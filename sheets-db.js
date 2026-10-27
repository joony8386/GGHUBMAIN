/* ใกล้กัน Task Hub — Google Sheets connector
 * ---------------------------------------------------------------
 * Gives app.js the same small database interface it used inside Claude
 * (collection / doc / add / set / update / delete / onSnapshot / where /
 * orderBy / limit), but stores everything in your Google Sheet through
 * the Apps Script web app (apps-script/Code.gs).
 *
 * - Writes show on your own screen instantly and reach the Sheet in 1–3 s.
 * - Every open page checks the Sheet every POLL_SECONDS (config.js) and
 *   redraws only when something changed.
 * - Staff unlock the board once per device with the team passcode.
 * You should not need to edit this file.
 */
(function(){
  'use strict';

  var CFG = window.GG_CONFIG || {};
  var API_URL = String(CFG.API_URL || '').trim();
  var POLL_MS = Math.max(5, Number(CFG.POLL_SECONDS) || 8) * 1000;
  var KEY_STORE = 'gg_team_key';
  var COLLS = ['actionItems','calEvents','eventMeta','hiddenTasks','sunOffice','attendance','comments'];

  var data = {};            // coll -> { id -> {parent, doc} }
  COLLS.forEach(function(c){ data[c] = {}; });
  var listeners = [];       // {coll, kind:'query'|'doc', ...}
  var rev = '';             // server revision of the data we hold
  var queue = [];           // ops waiting to be sent
  var inFlight = false;
  var writeSeq = 0;         // bumps on every local write; a poll that overlaps a write is discarded
  var remoteDispatch = false;
  var pollTimer = null, flushTimer = null, retryMs = 2000;
  var teamKey = '';
  try{ teamKey = localStorage.getItem(KEY_STORE) || ''; }catch(e){}

  // ---------------- status pill ----------------
  function pill(th, en){
    var el = document.getElementById('statusPill');
    if(el) el.textContent = th + ' · ' + en;
  }
  function pad(n){ return String(n).padStart(2,'0'); }
  function clock(){ var d = new Date(); return pad(d.getHours())+':'+pad(d.getMinutes())+':'+pad(d.getSeconds()); }
  function syncedPill(){
    if(queue.length || inFlight) pill('กำลังบันทึก…', 'Saving…');
    else pill('ซิงก์แล้ว '+clock(), 'Synced '+clock());
  }

  // ---------------- helpers ----------------
  function clone(o){ return o == null ? o : JSON.parse(JSON.stringify(o)); }
  function newId(){ return 'x'+Date.now().toString(36)+Math.random().toString(36).slice(2,8); }
  function validColl(c){
    if(COLLS.indexOf(c) < 0) throw new Error('Unknown collection: '+c);
    return c;
  }
  function docSnap(id, rec){
    return { id:id, exists: !!rec, data: function(){ return rec ? clone(rec.doc) : undefined; } };
  }

  // ---------------- listeners ----------------
  function queryRows(L){
    var rows = [];
    var store = data[L.coll];
    Object.keys(store).forEach(function(id){
      var rec = store[id];
      if(L.parent != null && rec.parent !== L.parent) return;
      if(L.where && !L.where.every(function(w){ return rec.doc && rec.doc[w.f] === w.v; })) return;
      rows.push({id:id, rec:rec});
    });
    if(L.order){
      var f = L.order.f, dir = L.order.dir === 'desc' ? -1 : 1;
      rows.sort(function(a,b){
        var x = a.rec.doc ? a.rec.doc[f] : undefined, y = b.rec.doc ? b.rec.doc[f] : undefined;
        if(x === y) return 0;
        return (x > y ? 1 : -1) * dir;
      });
    }
    if(L.limit) rows = rows.slice(0, L.limit);
    return rows;
  }
  function qSnapshot(rows){
    var docs = rows.map(function(r){ return docSnap(r.id, r.rec); });
    return { docs:docs, size:docs.length, empty:!docs.length, forEach:function(fn){ docs.forEach(fn); } };
  }
  function evalListener(L, force){
    var sig, payload;
    if(L.kind === 'doc'){
      var rec = data[L.coll][L.id];
      sig = rec ? JSON.stringify(rec.doc) : '∅';
      payload = docSnap(L.id, rec);
    } else {
      var rows = queryRows(L);
      sig = JSON.stringify(rows.map(function(r){ return [r.id, r.rec.doc]; }));
      payload = qSnapshot(rows);
    }
    if(!force && sig === L.sig) return;
    L.sig = sig;
    try{ L.cb(payload); }catch(e){ console.error(e); }
  }
  function notify(colls, remote){
    remoteDispatch = !!remote;
    try{
      listeners.slice().forEach(function(L){
        if(!colls || colls.indexOf(L.coll) >= 0) evalListener(L, false);
      });
    } finally { remoteDispatch = false; }
  }
  var localNotifyColls = null;
  function notifyLocalSoon(coll){
    if(!localNotifyColls){
      localNotifyColls = [];
      setTimeout(function(){ var c = localNotifyColls; localNotifyColls = null; notify(c, false); }, 0);
    }
    if(localNotifyColls.indexOf(coll) < 0) localNotifyColls.push(coll);
  }
  function listen(L){
    L.active = true;
    listeners.push(L);
    setTimeout(function(){ if(L.active) evalListener(L, true); }, 0);
    return function(){ L.active = false; listeners = listeners.filter(function(x){ return x !== L; }); };
  }

  // ---------------- writes ----------------
  function write(op, coll, id, parent, doc){
    var store = data[coll];
    if(op === 'delete') delete store[id];
    else if(op === 'update'){
      var cur = store[id] ? clone(store[id].doc) : {};
      Object.keys(doc).forEach(function(k){ cur[k] = clone(doc[k]); });
      store[id] = {parent: store[id] ? store[id].parent : (parent || ''), doc: cur};
    } else {
      store[id] = {parent: parent || '', doc: clone(doc)};
    }
    writeSeq++;
    queue.push({op:op, coll:coll, id:id, parent:parent || '', data: op === 'delete' ? null : clone(doc)});
    notifyLocalSoon(coll);
    scheduleFlush();
    return Promise.resolve();
  }
  function scheduleFlush(){
    syncedPill();
    if(flushTimer) return;
    flushTimer = setTimeout(function(){ flushTimer = null; flush(); }, 150);
  }
  function flush(){
    if(inFlight || !queue.length) return;
    var ops = queue.slice();
    inFlight = true;
    syncedPill();
    fetch(API_URL, {method:'POST', body: JSON.stringify({key: teamKey, ops: ops})})
      .then(function(r){ return r.json(); })
      .then(function(res){
        inFlight = false;
        if(!res || !res.ok){
          if(res && res.error === 'auth'){ lockOut(); return; }
          throw new Error(res && res.error || 'save failed');
        }
        queue.splice(0, ops.length);
        retryMs = 2000;
        if(queue.length) flush(); else syncedPill();
      })
      .catch(function(err){
        inFlight = false;
        console.warn('save failed, retrying', err);
        pill('การเชื่อมต่อมีปัญหา — กำลังลองใหม่', 'Connection problem — retrying');
        setTimeout(flush, retryMs);
        retryMs = Math.min(retryMs * 2, 30000);
      });
  }

  // ---------------- reads ----------------
  function apply(all){
    COLLS.forEach(function(c){
      var next = {};
      (all[c] || []).forEach(function(row){ if(row && row.id) next[row.id] = {parent: row.parent || '', doc: row.data || {}}; });
      data[c] = next;
    });
  }
  function fetchAll(){
    var url = API_URL + (API_URL.indexOf('?') >= 0 ? '&' : '?') + 'action=all&key=' + encodeURIComponent(teamKey) + (rev ? '&rev=' + encodeURIComponent(rev) : '');
    return fetch(url).then(function(r){ return r.json(); });
  }
  function poll(){
    if(!teamKey) return;
    var seqAtStart = writeSeq;
    fetchAll().then(function(res){
      if(!res || !res.ok){
        if(res && res.error === 'auth'){ lockOut(); return; }
        throw new Error(res && res.error || 'load failed');
      }
      if(res.same){ if(!queue.length && !inFlight) syncedPill(); return; }
      // our own write may not be in this copy yet: keep what is on screen and try again next round
      if(seqAtStart !== writeSeq || queue.length || inFlight) return;
      rev = String(res.rev || '');
      apply(res.data || {});
      notify(null, true);
      syncedPill();
    }).catch(function(err){
      console.warn('poll failed', err);
      pill('การเชื่อมต่อมีปัญหา — กำลังลองใหม่', 'Connection problem — retrying');
    });
  }
  function startPolling(){
    if(pollTimer) clearInterval(pollTimer);
    pollTimer = setInterval(function(){ if(document.visibilityState !== 'hidden') poll(); }, POLL_MS);
    document.addEventListener('visibilitychange', function(){ if(document.visibilityState === 'visible') poll(); });
    window.addEventListener('online', poll);
  }

  // ---------------- passcode gate ----------------
  var gateResolve = null;
  function showGate(msgTh, msgEn){
    var g = document.getElementById('gate');
    if(!g) return;
    g.hidden = false;
    var m = document.getElementById('gateMsg');
    if(m){ m.innerHTML = msgTh ? msgTh + '<span class="en">' + msgEn + '</span>' : ''; }
    var inp = document.getElementById('gateKey');
    if(inp){ inp.value = ''; setTimeout(function(){ inp.focus(); }, 50); }
  }
  function hideGate(){ var g = document.getElementById('gate'); if(g) g.hidden = true; }
  function lockOut(){
    teamKey = '';
    try{ localStorage.removeItem(KEY_STORE); }catch(e){}
    pill('ต้องใส่รหัสทีม', 'Passcode needed');
    showGate('รหัสทีมเปลี่ยนแล้ว กรุณาใส่รหัสใหม่', 'The team passcode has changed — please enter the new one');
  }
  function tryKey(k){
    teamKey = k; rev = '';
    pill('กำลังตรวจสอบรหัส…', 'Checking passcode…');
    return fetchAll().then(function(res){
      if(res && res.ok){
        try{ localStorage.setItem(KEY_STORE, k); }catch(e){}
        rev = String(res.rev || '');
        apply(res.data || {});
        hideGate();
        notify(null, true);
        syncedPill();
        return true;
      }
      if(res && res.error === 'auth'){
        teamKey = '';
        showGate('รหัสไม่ถูกต้อง', 'Wrong passcode');
        return false;
      }
      throw new Error(res && res.error || 'load failed');
    });
  }
  function bindGate(){
    var form = document.getElementById('gateForm');
    if(!form || form._bound) return;
    form._bound = true;
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var k = (document.getElementById('gateKey').value || '').trim();
      if(!k) return;
      tryKey(k).then(function(ok){
        if(ok && gateResolve){ var r = gateResolve; gateResolve = null; r(); }
      }).catch(function(err){
        console.warn(err);
        showGate('เชื่อมต่อไม่ได้ ลองใหม่อีกครั้ง', 'Could not connect — please try again');
      });
    });
  }

  // ---------------- public API (Firestore-like) ----------------
  function Query(coll, parent, where, order, limit){
    this.coll = coll; this.parent = parent; this._where = where || []; this._order = order || null; this._limit = limit || 0;
  }
  Query.prototype.where = function(f, opr, v){
    if(opr !== '==') throw new Error('Only == is supported');
    return new Query(this.coll, this.parent, this._where.concat([{f:f, v:v}]), this._order, this._limit);
  };
  Query.prototype.orderBy = function(f, dir){ return new Query(this.coll, this.parent, this._where, {f:f, dir:dir || 'asc'}, this._limit); };
  Query.prototype.limit = function(n){ return new Query(this.coll, this.parent, this._where, this._order, n); };
  Query.prototype._L = function(cb){
    return {coll:this.coll, kind:'query', parent:this.parent, where:this._where, order:this._order, limit:this._limit, cb:cb};
  };
  Query.prototype.get = function(){ return Promise.resolve(qSnapshot(queryRows(this._L(null)))); };
  Query.prototype.onSnapshot = function(cb){ return listen(this._L(cb)); };
  Query.prototype.doc = function(id){ return new DocRef(this.coll, id, this.parent); };
  Query.prototype.add = function(doc){
    var id = newId();
    return write('set', this.coll, id, this.parent, doc).then(function(){ return {id:id}; });
  };

  function DocRef(coll, id, parent){ this.coll = coll; this.id = String(id); this.parent = parent; }
  DocRef.prototype.set = function(doc){ return write('set', this.coll, this.id, this.parent, doc || {}); };
  DocRef.prototype.update = function(doc){ return write('update', this.coll, this.id, this.parent, doc || {}); };
  DocRef.prototype.delete = function(){ return write('delete', this.coll, this.id, this.parent, null); };
  DocRef.prototype.get = function(){ return Promise.resolve(docSnap(this.id, data[this.coll][this.id])); };
  DocRef.prototype.onSnapshot = function(cb){ return listen({coll:this.coll, kind:'doc', id:this.id, cb:cb}); };
  DocRef.prototype.collection = function(sub){ return new Query(validColl(sub), this.coll + '/' + this.id); };

  var db = {
    collection: function(name){ return new Query(validColl(name), null); },
    doc: function(path){
      var p = String(path).split('/');
      if(p.length !== 2) throw new Error('db.doc expects "collection/id"');
      return new DocRef(validColl(p[0]), p[1], null);
    }
  };

  window.SheetsDB = {
    // true while a change from another person is being drawn (app.js uses it to protect half-typed input)
    isRemote: function(){ return remoteDispatch; },
    connect: function(){
      if(!API_URL || /PASTE_YOUR/i.test(API_URL)){
        pill('ยังไม่เชื่อมต่อ — ตั้งค่า API_URL ใน config.js', 'Not connected — set API_URL in config.js');
        return Promise.resolve(null);
      }
      bindGate();
      var ready = new Promise(function(resolve){
        if(!teamKey){ showGate('', ''); gateResolve = resolve; return; }
        tryKey(teamKey).then(function(ok){
          if(ok) resolve();
          else gateResolve = resolve;
        }).catch(function(err){
          // offline or temporary failure: open the board anyway and keep retrying in the background
          console.warn(err);
          pill('การเชื่อมต่อมีปัญหา — กำลังลองใหม่', 'Connection problem — retrying');
          resolve();
        });
      });
      return ready.then(function(){ startPolling(); return db; });
    }
  };
})();
