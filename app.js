/* ใกล้กัน Task Hub — app logic
 * Staff list: the PEOPLE list just below. Job descriptions: the add('freq','Group','Text') lines after it.
 * English subtitles: the EN list ('Thai':'English',). Never change a person's key once they have tasks.
 */
(function(){
  "use strict";

  var PEOPLE = [
    {key:'grace', name:'เกรซ', full:'เกรซ กัญญ์สราลักษณ์ ตรัยอันธยา', role:'Commercial Operations Manager', dept:'Commercial & Operations', contact:'093-565-6236 · หยุดทุกวันอาทิตย์ 10:00–19:00 น.', color:'#d9764a'},
    {key:'natt', name:'นัท', full:'ปัณณวิชญ์ บัวขจร', role:'CEO Assistant', dept:'Sale & Event Marketing (gudslip)', contact:'091-596-5120', color:'#4a7cbf'},
    {key:'lin', name:'หลิน', full:'หลิน', role:'CEO Assistant', dept:'Sale & Event Marketing (gudslip)', contact:'', color:'#5aa859'},
    {key:'chokun', name:'โชกุน', full:'โชกุน', role:'Content Creator', dept:'Content & Creative — 3 แบรนด์', contact:'Glaiganplace Hotel / gudslip / Sunglaigan', color:'#a56bc2'},
    {key:'botun', name:'โบตั๋น', full:'กนกอร สอนสา', role:'ผู้ช่วยบัญชี', dept:'Accounting & Finance — ใกล้กัน เมดิเทค', contact:'097-050-3581 · botunsonsa@gmail.com', color:'#c99a2e'},
    {key:'jiab', name:'เจี๊ยบ', full:'เจี๊ยบ', role:'Chief Account', dept:'Accounting & Finance', contact:'รายงานต่อ K.Sun / K.Joon / K.Grace', color:'#3fa3a0'},
    {key:'sun', name:'ซัน', full:'K.Sun', role:'CEO', dept:'ใกล้กัน — ภาพรวมทุกแบรนด์', contact:'Meditech / Gudslip / GoodSpace / Glaiganplace Hotel / Sunglaigan', color:'#b23c4e'},
    {key:'joon', name:'Joon', full:'', role:'', dept:'', contact:'', color:'#c45f8f'}
  ];

  // legal name shown after the nickname; drop the part that just repeats the nickname
  function fullExtra(p){
    var f = p.full || '';
    if(!f || f === p.name) return '';
    if(f.indexOf(p.name) === 0) return f.slice(p.name.length).trim();
    return f;
  }

  function personByKey(key){
    for(var i=0;i<PEOPLE.length;i++){ if(PEOPLE[i].key===key) return PEOPLE[i]; }
    return null;
  }

  var FREQ_LABEL = {daily:'รายวัน', weekly:'รายสัปดาห์', monthly:'รายเดือน', tax:'ภาษี', asneeded:'ตามความจำเป็น', ongoing:'งานประจำ'};

  // ---------- English subtitles: Thai source text -> English ----------
  var EN = {
    // people
    'เกรซ':'Grace', 'นัท':'Natt', 'หลิน':'Lin', 'โชกุน':'Chokun', 'โบตั๋น':'Botun', 'เจี๊ยบ':'Jiab', 'ซัน':'Sun',
    'กัญญ์สราลักษณ์ ตรัยอันธยา':'Kansaralak Traianthaya',
    'ปัณณวิชญ์ บัวขจร':'Pannawit Buakhajon',
    'กนกอร สอนสา':'Kanok-on Sonsa',
    'ผู้ช่วยบัญชี':'Accounting Assistant',
    'Content & Creative — 3 แบรนด์':'Content & Creative — 3 brands',
    'Accounting & Finance — ใกล้กัน เมดิเทค':'Accounting & Finance — Glaigan Meditech',
    'ใกล้กัน — ภาพรวมทุกแบรนด์':'Glaigan — oversight of all brands',
    '093-565-6236 · หยุดทุกวันอาทิตย์ 10:00–19:00 น.':'093-565-6236 · Off every Sunday · hours 10:00–19:00',
    'รายงานต่อ K.Sun / K.Joon / K.Grace':'Reports to K.Sun / K.Joon / K.Grace',

    // job-description groups
    'บริหารและประสานงาน':'Management & coordination',
    'นำเข้าและขึ้นทะเบียนสินค้า':'Import & product registration',
    'บริษัทภาซุ เทรดดิ้ง และเอาโซ ซิสเต็ม':'Phasu Trading & Auso System (companies)',
    'งานประมูล':'Tenders / bids',
    'Event และ Sponsor':'Events & sponsorship',
    'จัดซื้อและบุคลากร':'Procurement & staffing',
    'เอกสารและสื่อการขาย':'Sales documents & materials',
    'เงินกองกลาง':'Company petty-cash fund',
    'ออเดอร์และแพ็คสินค้า':'Orders & packing',
    'การเงิน':'Finance',
    'สรุปยอดขาย':'Sales summaries',
    'สต็อกสินค้า':'Inventory',
    'เอกสารบัญชี':'Accounting documents',
    'สนับสนุนอื่น ๆ':'Other support',
    'งานประจำวัน':'Daily tasks',
    'งานประจำสัปดาห์':'Weekly tasks',
    'งานปิดบัญชีประจำเดือน':'Month-end close',
    'งานด้านภาษี':'Tax',
    'การควบคุมภายใน':'Internal control',
    'บริหารภาพรวมองค์กร':'Company-wide management',
    'อนุมัติค่าใช้จ่ายและงบประมาณ':'Expense & budget approvals',
    'ตัดสินใจ/ชี้ขาด':'Decisions / final calls',
    'ภาพลักษณ์และความสัมพันธ์ภายนอก':'Image & external relations',

    // GRACE
    'มอบหมาย ติดตาม และตรวจสอบเอกสาร การทำงานของทีม':'Assign, follow up on and review the team\'s documents and work',
    'ประสานงานกับฝ่ายขาย ลูกค้า คู่ค้า และหน่วยงานที่เกี่ยวข้อง':'Coordinate with sales, customers, partners and relevant agencies',
    'ติดตามงานค้าง กำหนดส่ง และสรุปความคืบหน้าให้ผู้บริหาร':'Track outstanding work and deadlines; summarise progress for management',
    'ประสานงานกับทีม Customs และ Product Registration':'Coordinate with the Customs and Product Registration teams',
    'จัดทำเอกสาร Packing List, Invoice ส่งให้ทีม Customs':'Prepare packing lists and invoices for the Customs team',
    'ติดต่อ Supplier เพื่อตรวจสอบความถูกต้องของเอกสาร':'Contact suppliers to verify document accuracy',
    'ประสานงานเอกสาร PO, Quotation และ Invoice':'Coordinate POs, quotations and invoices',
    'จัดเตรียมและจัดส่งสินค้า':'Prepare and ship products',
    'จัดหา ติดตั้ง และจัดส่งอุปกรณ์ออกบูธตามโรงพยาบาลต่าง ๆ':'Source, set up and deliver booth equipment for hospital exhibitions',
    'ทำคู่เทียบราคา (ใบเสนอราคา + รายละเอียดคุณลักษณะ)':'Prepare comparison quotes (quotation + specifications)',
    'ตรวจสอบเงื่อนไขและจัดหาราคาสินค้าจาก Supplier':'Review tender terms and get product pricing from suppliers',
    'จัดทำใบเสนอราคาและขอเอกสารประมูล':'Prepare quotations and request tender documents',
    'เตรียมและยื่นเอกสารประมูล ติดตามผล และประสานส่งมอบสินค้า':'Prepare and submit tender documents, follow up on results and coordinate delivery',
    'ตรวจสอบยอดขายและค่าคอมมิชชั่นของทีม Sales ประจำเดือน':'Review the sales team\'s monthly sales and commissions',
    'วางแผนสินค้าและสต็อกสำหรับรอบขายเดือนถัดไป':'Plan products and stock for next month\'s sales cycle',
    'วางระบบและกระบวนการขายใน JUBILI CRM':'Set up the sales system and process in JUBILI CRM',
    'จัดทำ Sales Toolkit, Sales Playbook และเอกสารประกอบการขาย':'Build the sales toolkit, sales playbook and supporting sales documents',
    'อบรม ประเมิน และติดตาม Pipeline ของทีม Sales':'Train and evaluate the sales team and track its pipeline',
    'กำหนดนโยบายราคา รูปแบบการขาย และอนุมัติส่วนลด':'Set pricing policy and sales models; approve discounts',
    'ติดต่อนำเสนอเงื่อนไขกับลูกค้า B2B และ Partner + ทำสัญญาการขาย':'Pitch terms to B2B customers and partners; draw up sales contracts',
    'ดูแล Key Account ติดตามคำสั่งซื้อ การชำระเงิน และการจัดส่ง':'Manage key accounts: track orders, payments and deliveries',
    'ประสานงานกับ HR ในการสรรหา สัมภาษณ์ และคัดเลือกทีม Sales':'Work with HR to recruit, interview and select sales staff',
    'คัดเลือกและประสานงานการเข้าร่วม Event หรือกิจกรรมสปอนเซอร์':'Select and coordinate participation in events or sponsorships',
    'เจรจาพื้นที่ ค่าใช้จ่าย และสิทธิประโยชน์':'Negotiate space, costs and benefits',
    'วางรูปแบบบูธ โปรโมชั่น และเป้าหมายการขายของแต่ละงาน':'Plan booth layout, promotions and sales targets for each event',
    'จัดเตรียมสินค้า โบรชัวร์ Company Sheet นามบัตร และอุปกรณ์ออกบูธ':'Prepare products, brochures, company sheet, business cards and booth equipment',
    'ดูแลการขนส่ง ติดตั้ง รื้อถอน และสรุปผลหลังจบงาน':'Handle transport, setup and teardown; write the post-event summary',
    'สรรหา เปรียบเทียบราคา และจัดซื้อสินค้า/อุปกรณ์ที่จำเป็น':'Source, compare prices and purchase necessary goods/equipment',
    'กำหนดคุณสมบัติ สัมภาษณ์ และคัดเลือกพนักงานในทีม':'Define requirements, interview and select team staff',
    'ดูแลการฝึกอบรมและประเมินผลพนักงานในทีม':'Oversee training and performance reviews for team staff',
    'จัดทำและปรับปรุง Company Profile, Product Catalogue, Presentation':'Create and update the company profile, product catalogue and presentations',
    'ตรวจสอบเนื้อหา ราคา และข้อความประชาสัมพันธ์ให้ตรงแนวทางบริษัท':'Check content, pricing and PR messaging against company guidelines',
    'ดูแลเอกสารสัญญา ใบเสนอราคา และข้อมูลสินค้าในทุกช่องทาง':'Maintain contracts, quotations and product information across all channels',
    'ดูแลเงินกองกลางของบริษัทและอนุมัติค่าใช้จ่ายที่เกี่ยวข้อง':'Manage the company petty-cash fund and approve related expenses',
    'ชำระค่าใช้จ่าย เช่น ค่าโทรศัพท์ ค่าจัดส่งสินค้า ค่าอุปกรณ์สำนักงาน ค่าเดินทาง':'Pay expenses such as phone bills, shipping, office supplies and travel',
    'รวบรวมใบเสร็จและหลักฐานการชำระเงินส่งให้ฝ่ายบัญชี':'Collect receipts and proof of payment and send them to accounting',

    // NATT & LIN
    'ประสานงานระหว่าง CEO กับทีมงาน':'Coordinate between the CEO and the team',
    'ประสานงานกับหน่วยงานราชการ หรือหน่วยงานอื่น ๆ':'Coordinate with government agencies and other organisations',
    'จัดรับ–จัดส่งเอกสารตามที่ได้รับมอบหมาย':'Pick up and deliver documents as assigned',
    'จัดหา Event หรืองานที่น่าสนใจสำหรับการเข้าร่วม':'Find events or shows worth taking part in',
    'เตรียมอุปกรณ์ + ตรวจเช็คสภาพอุปกรณ์ก่อนออกงาน':'Prepare equipment and check its condition before each event',
    'ติดตั้งบูธ + ขายสินค้า + ให้ข้อมูลสินค้าหน้างาน':'Set up the booth, sell products and explain them on site',
    'จัดหาร้านขายยา ฟิตเนส โรงแรม และร้านอื่น ๆ สำหรับวางขาย gudslip':'Find pharmacies, gyms, hotels and other shops to stock gudslip',
    'ติดต่อนำเสนอขายสินค้าของ gudslip ให้ร้านค้าใหม่':'Pitch gudslip products to new retailers',
    'บริการหลังการขายให้ร้านค้า/ลูกค้าที่ดูแลอยู่':'Provide after-sales service to existing retailers/customers',
    'ปฏิบัติงานอื่น ๆ ตามที่ CEO มอบหมาย':'Other duties as assigned by the CEO',

    // CHOKUN
    'คิดหัวข้อและไอเดียคอนเทนต์ให้ครบทั้ง 3 แบรนด์':'Come up with content topics and ideas for all 3 brands',
    'วาง Content Pillar / Content Calendar ของแต่ละแบรนด์':'Set content pillars and the content calendar for each brand',
    'คิด Hook / Story / Direction ของคอนเทนต์แต่ละชิ้น':'Develop the hook, story and direction for each piece',
    'Brainstorm แนวทางคอนเทนต์ใหม่ ๆ ร่วมกับทีม':'Brainstorm new content directions with the team',
    'วางแผนคอนเทนต์ให้เหมาะกับแต่ละแพลตฟอร์ม (TikTok/IG/FB/YouTube)':'Plan content to suit each platform (TikTok/IG/FB/YouTube)',
    'ถ่ายวิดีโอ / เก็บ Footage ตามแผนที่วางไว้':'Shoot video / capture footage according to plan',
    'เก็บ B-roll, Atmosphere, Lifestyle Shot ของแต่ละแบรนด์':'Capture B-roll, atmosphere and lifestyle shots for each brand',
    'ถ่าย Event / Activity / Interview เมื่อมีงาน':'Film events, activities and interviews when they happen',
    'คิดมุมกล้องและ Mood ของภาพให้เข้ากับแต่ละแบรนด์':'Plan camera angles and visual mood to fit each brand',
    'ตัดต่อ Short-form Video สำหรับ TikTok / IG Reels / Facebook / YouTube':'Edit short-form video for TikTok / IG Reels / Facebook / YouTube',
    'เลือก Footage และเรียงลำดับเรื่องราว (Story)':'Select footage and sequence the story',
    'ตัด Interview ให้กระชับได้ใจความ':'Cut interviews down so they are tight and clear',
    'ใส่ Subtitle / SFX / Transition / Music':'Add subtitles, SFX, transitions and music',
    'ปรับ Color / Mood ให้เข้ากับ Content และแบรนด์':'Grade colour and mood to fit the content and brand',
    'ปรับ Hook และจังหวะตัดต่อให้คนดูอยากดูต่อ':'Tune the hook and edit pacing to keep viewers watching',
    'กำหนด Mood & Tone และ Visual Direction โดยรวม':'Define the overall mood, tone and visual direction',
    'ทำ Moodboard และหา Reference ใหม่ ๆ':'Make moodboards and find new references',
    'คิดรูปแบบการเล่าเรื่องและสิ่งที่แต่ละแบรนด์ควรสื่อผ่านคอนเทนต์':'Shape the storytelling style and what each brand should say through its content',
    'ปรับแนวทาง Content ให้เหมาะกับ Glaiganplace Hotel / gudslip / Sunglaigan':'Adapt the content approach for Glaiganplace Hotel / gudslip / Sunglaigan',
    'สร้าง Character และดูแลภาพลักษณ์ให้แต่ละแบรนด์แตกต่างกันชัดเจน':'Build each brand\'s character and keep their images clearly distinct',
    'ทบทวนคอนเทนต์เดือนที่ผ่านมาว่าตรงเป้าหมายของแต่ละแบรนด์หรือไม่':'Review last month\'s content against each brand\'s goals',

    // BOTUN
    'ตรวจเช็ครับ Order ช่วงเช้าในทุกช่องทาง (Shopee/TikTok/Lazada) และยืนยันรับสินค้าในแอป':'Check incoming orders each morning on every channel (Shopee/TikTok/Lazada) and confirm them in the apps',
    'ลงบันทึกยอดขายแต่ละออเดอร์ และปริ้นออเดอร์เพื่อแพ็ค–จัดส่ง':'Record sales for each order and print orders for packing and shipping',
    'ตรวจสอบความถูกต้องหลังแพ็ค และแพ็ค/ส่งคำสั่งซื้อที่เข้าก่อน 12:00 น. ให้ทัน':'Check accuracy after packing; make sure orders received before 12:00 are packed and shipped the same day',
    'เช็คออเดอร์ที่เข้าหลังแพ็ค และติดตามขนส่งแต่ละเจ้าให้มารับสินค้า':'Check orders that come in after packing; chase each courier to collect parcels',
    'บันทึกเงินสดย่อยเมื่อมีรายการจ่าย และทำเบิกขออนุมัติเงินกองกลาง':'Record petty-cash payments and submit reimbursement requests from the company fund',
    'สรุปยอดขายประจำเดือน ทำรายงาน Canva P&L เทียบกับเดือนก่อน':'Summarise monthly sales; make a Canva P&L report compared with last month',
    'ทำ Canva สรุปยอดขายรายวัน เทียบกับเป้าที่ต้องขายให้ถึงเดือนนั้น':'Make a daily Canva sales summary against that month\'s sales target',
    'ทำตาราง Stock Movement รายวัน สรุปยอดคงเหลือหลังขายในแต่ละวัน':'Keep the daily stock-movement table; summarise remaining stock after each day\'s sales',
    'สรุป Stock Movement รายสัปดาห์ และเช็คสินค้าที่ต้องเติมของ':'Summarise weekly stock movement and check which items need restocking',
    'ช่วยเจี๊ยบเก็บเอกสารบัญชี (ใบกำกับภาษีซื้อ-ขาย / ภ.ง.ด.1 / ภ.ง.ด.3 / ภ.ง.ด.53) ส่งสำนักงานบัญชีก่อนกำหนด':'Help Jiab collect accounting documents (purchase/sales tax invoices, PND 1 / PND 3 / PND 53) and send them to the accounting firm before the deadline',
    'ช่วยแพ็คส่งสินค้าเมื่อมีออเดอร์เครื่องมือแพทย์':'Help pack and ship when medical-device orders come in',
    'ทำเบิกจ่ายค่าใช้จ่ายพนักงาน (ค่าน้ำมัน ฯลฯ) เมื่อออกทำงานนอกสถานที่':'Process staff expense claims (fuel etc.) for off-site work',
    'ตามใส่ตารางสรุปยอดขาย/ค่าคอม AMS ในสมุดบัญชี (ยอดโชว์หลังส่งของแล้ว ~1 สัปดาห์)':'Enter the AMS sales/commission summary into the ledger (figures appear ~1 week after delivery)',

    // JIAB
    'ตรวจสอบ Bank / Cash — ยอดคงเหลือและรายการเคลื่อนไหวทุกบัญชี':'Check bank/cash — balances and movements on every account',
    'ตรวจสอบ Sales / Invoice / Receipt และเอกสารประกอบ':'Check sales, invoices, receipts and supporting documents',
    'ตรวจสอบ Collection — เงินรับจากลูกค้าและตัดรับชำระ AR':'Check collections — customer receipts and clearing AR',
    'ติดตามลูกหนี้คงค้าง (AR) และรายการผิดปกติ':'Follow up on outstanding receivables (AR) and irregular items',
    'ตรวจสอบเจ้าหนี้ (AP) เอกสารจ่าย และ Due Date':'Check payables (AP), payment documents and due dates',
    'บันทึก/ตรวจสอบรายการบัญชีในระบบ PEAK':'Record/review accounting entries in PEAK',
    'ตรวจสอบเอกสาร VAT / WHT และรายการที่ต้องหัก ณ ที่จ่าย':'Check VAT/WHT documents and items subject to withholding tax',
    'ตรวจสอบ Stock — รับเข้า ขายออก และยอดคงเหลือ':'Check stock — goods in, goods sold and balance',
    'สรุปเงินเข้า–ออก (Daily Cash Flow)':'Summarise money in and out (daily cash flow)',
    'สรุปตัวเลขสำคัญและประเด็นค้างรายงานผู้บริหาร':'Report key figures and open issues to management',
    'ตรวจสอบ AR Aging และติดตามรายการค้าง':'Review AR aging and chase overdue items',
    'ตรวจสอบ AP Aging / Due List':'Review AP aging / due list',
    'ทำ Bank Reconciliation':'Do the bank reconciliation',
    'ตรวจสอบ Stock Movement รายสัปดาห์':'Review weekly stock movement',
    'สรุปค่าใช้จ่ายแยก Project (Meditech / Gudslip / GoodSpace)':'Summarise expenses by project (Meditech / Gudslip / GoodSpace)',
    'สรุป Cash Flow และภาระจ่ายที่กำลังจะถึงให้ผู้บริหาร':'Summarise cash flow and upcoming payment obligations for management',
    'ปิดบัญชีประจำเดือน ตรวจสอบรายการค้าง และปรับปรุงบัญชี':'Close the month: review open items and post adjustments',
    'จัดทำ Profit & Loss':'Prepare the profit & loss statement',
    'จัดทำ Balance Sheet':'Prepare the balance sheet',
    'จัดทำ Cash Flow ประจำเดือน':'Prepare the monthly cash-flow statement',
    'จัดทำ Project P&L แยก Meditech / Gudslip / GoodSpace':'Prepare project P&Ls for Meditech / Gudslip / GoodSpace',
    'จัดทำ Management Report สรุป KPI ให้ผู้บริหาร':'Prepare the management report with KPI summary',
    'จัดทำ Payroll ตรวจสอบเงินเดือน/รายการหัก และยอดจ่ายสุทธิ':'Run payroll: check salaries, deductions and net pay',
    'นำส่งเงินสมทบประกันสังคมของพนักงาน':'Remit employee social-security contributions',
    'ประสานงานสำนักงานบัญชีภายนอก':'Coordinate with the external accounting firm',
    'ยื่น ภ.พ.30 (VAT)':'File PP 30 (VAT return)',
    'ยื่น ภ.ง.ด.1 / 3 / 53':'File PND 1 / 3 / 53 (withholding-tax returns)',
    'ตรวจสอบภาษีหัก ณ ที่จ่าย และเตรียมหนังสือรับรอง':'Check withholding tax and prepare WHT certificates',
    'ตรวจสอบ VAT ซื้อ–ขาย':'Check input and output VAT',
    'ตรวจสอบเอกสารนำเข้าและภาษีนำเข้า':'Check import documents and import duties',
    'จัดเตรียมข้อมูลภาษีสำหรับหน่วยงานที่เกี่ยวข้อง':'Prepare tax information for the relevant authorities',
    'ตรวจสอบเอกสารก่อนบันทึกบัญชี และการอนุมัติค่าใช้จ่าย':'Check documents and expense approvals before booking entries',
    'ควบคุม AR / AP และ Stock ให้ตรงกับข้อมูลจริง':'Keep AR / AP and stock in line with actual figures',
    'ตรวจสอบความถูกต้องของข้อมูลในระบบ PEAK':'Verify the accuracy of data in PEAK',
    'จัดเก็บเอกสารทางบัญชีให้ครบถ้วนและค้นหาได้':'File accounting documents completely and keep them easy to find',

    // SUN
    'กำหนดทิศทาง นโยบาย และเป้าหมายของแต่ละแบรนด์ (Meditech / Gudslip / GoodSpace / Glaiganplace Hotel / Sunglaigan)':'Set direction, policy and goals for each brand (Meditech / Gudslip / GoodSpace / Glaiganplace Hotel / Sunglaigan)',
    'รับทราบสรุปงานและประเด็นค้างจากหัวหน้าแต่ละส่วนงาน':'Receive work summaries and open issues from each department head',
    'ประชุมทีมใหญ่ / อัปเดตและมอบหมายงานประจำสัปดาห์':'All-hands meeting / weekly updates and task assignment',
    'ทบทวน Management Report และ KPI ของบริษัทประจำเดือน':'Review the monthly management report and company KPIs',
    'อนุมัติการใช้เงินกองกลางและค่าใช้จ่ายที่เกินอำนาจของแต่ละแผนก':'Approve petty-cash use and expenses beyond each department\'s authority',
    'อนุมัติสปอนเซอร์ งบการตลาด และค่าใช้จ่ายอีเวนต์':'Approve sponsorships, marketing budgets and event costs',
    'อนุมัติส่วนลดและเงื่อนไขราคาสำหรับลูกค้า B2B รายสำคัญ':'Approve discounts and pricing terms for key B2B customers',
    'พิจารณาและเซ็นอนุมัติสัญญา/ข้อเสนอที่มีผลผูกพันบริษัท':'Review and sign contracts/offers that bind the company',
    'ตัดสินใจเรื่องสำคัญที่ทีมส่งเข้ามาขออนุมัติ หรือเรื่องที่ติดขัดข้ามแผนก':'Decide on major matters sent up for approval or cross-department blockers',
    'ดูแลความสัมพันธ์กับพาร์ทเนอร์ ลูกค้ารายสำคัญ และหน่วยงานภายนอก':'Manage relationships with partners, key customers and external bodies',

    // September 2026 calendar (whiteboard transcription)
    'จัดบูธ Decathlon 11:00 น.':'Decathlon booth setup 11:00',
    'Demo Jubili 14:00 น.':'Jubili demo 14:00',
    'คอร์ส/Academy — งานการเงิน':'Course/Academy — finance',
    'Decathlon บางนา':'Decathlon Bangna',
    'ไปตลาด':'Market visit',
    'ประชุมทีม 11:00 น.':'Team meeting 11:00',
    'ปิดยอด PL 13:00 น.':'Close P&L figures 13:00',
    'ประชุมแผนก':'Department meeting',
    'วิ่ง Decathlon Thailand (~1,500 คนทั่วประเทศ)':'Decathlon Thailand run (~1,500 runners nationwide)',
    'อัปเดต/Assign งาน โดย พลอย':'Task update/assignment by Ploy',
    'Thai Miss — ทีม K.Sun':'Thai Miss — K.Sun\'s team',
    'ประชุม / Assign งาน':'Meeting / task assignment',
    'นัดหมาย (โปรดตรวจสอบ)':'Appointment (please confirm)',
    'งานจากปฏิทิน':'Task from calendar',
    'การเข้างานและวันหยุด':'Attendance & leave'
  };
  var FREQ_EN = {daily:'Daily', weekly:'Weekly', monthly:'Monthly', tax:'Tax', asneeded:'As needed', ongoing:'Ongoing'};
  var EN_MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  var EN_MONTHS_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var WD_EN_SHORT = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  var WD_EN_LONG = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

  function enOf(th){ return Object.prototype.hasOwnProperty.call(EN, th) ? EN[th] : ''; }
  // Thai text with an English subtitle line underneath (block). No translation known -> Thai only.
  function bi(th, escape, en){
    var main = escape ? escHtml(th) : th;
    en = en || enOf(th);
    return en ? main+'<span class="en">'+escHtml(en)+'</span>' : main;
  }
  // inline variant for chips / badges / buttons: "ไทย · English"
  function biI(th, en){
    en = en || enOf(th);
    return en ? th+' <span class="en-i">· '+escHtml(en)+'</span>' : th;
  }
  function biOpt(th, en){ en = en || enOf(th); return en ? th+' · '+en : th; } // plain text (option / title / placeholder)
  function nameBi(q){ return biI(q.name); }
  function enDue(due){
    if(!due) return '—';
    var parts = due.split('-'); if(parts.length!==3) return due;
    return parseInt(parts[2],10)+' '+(EN_MONTHS_SHORT[parseInt(parts[1],10)-1]||parts[1])+' '+parts[0];
  }
  function enMonth(mk){ var p = mk.split('-'); return EN_MONTHS[parseInt(p[1],10)-1]+' '+p[0]; }
  function monthBi(mk){ return monthLabel(mk)+' <span class="en-i">· '+enMonth(mk)+'</span>'; }
  function dueBi(due){ return fmtDue(due)+' <span class="en-i">· '+enDue(due)+'</span>'; }
  function enLongDate(iso){
    var pr = iso.split('-'); var d = new Date(parseInt(pr[0],10), parseInt(pr[1],10)-1, parseInt(pr[2],10));
    return WD_EN_LONG[d.getDay()]+', '+d.getDate()+' '+EN_MONTHS[d.getMonth()]+' '+d.getFullYear();
  }
  function freqLabel(f){ return FREQ_LABEL[f]+' · '+FREQ_EN[f]; }
  function tl(o){ return biI(o.label, o.en); } // bilingual label of a {label,en} option

  function T(p,id,freq,group,text){ return {p:p,id:id,freq:freq,group:group,text:text}; }

  var TASKS = [];

  // ---------- GRACE ----------
  (function(){
    var g='grace', n=1;
    var add=function(freq,group,text){ TASKS.push(T(g,'g'+(n++),freq,group,text)); };
    add('ongoing','บริหารและประสานงาน','มอบหมาย ติดตาม และตรวจสอบเอกสาร การทำงานของทีม');
    add('ongoing','บริหารและประสานงาน','ประสานงานกับฝ่ายขาย ลูกค้า คู่ค้า และหน่วยงานที่เกี่ยวข้อง');
    add('ongoing','บริหารและประสานงาน','ติดตามงานค้าง กำหนดส่ง และสรุปความคืบหน้าให้ผู้บริหาร');
    add('ongoing','นำเข้าและขึ้นทะเบียนสินค้า','ประสานงานกับทีม Customs และ Product Registration');
    add('ongoing','นำเข้าและขึ้นทะเบียนสินค้า','จัดทำเอกสาร Packing List, Invoice ส่งให้ทีม Customs');
    add('ongoing','นำเข้าและขึ้นทะเบียนสินค้า','ติดต่อ Supplier เพื่อตรวจสอบความถูกต้องของเอกสาร');
    add('ongoing','บริษัทภาซุ เทรดดิ้ง และเอาโซ ซิสเต็ม','ประสานงานเอกสาร PO, Quotation และ Invoice');
    add('ongoing','บริษัทภาซุ เทรดดิ้ง และเอาโซ ซิสเต็ม','จัดเตรียมและจัดส่งสินค้า');
    add('ongoing','บริษัทภาซุ เทรดดิ้ง และเอาโซ ซิสเต็ม','จัดหา ติดตั้ง และจัดส่งอุปกรณ์ออกบูธตามโรงพยาบาลต่าง ๆ');
    add('ongoing','บริษัทภาซุ เทรดดิ้ง และเอาโซ ซิสเต็ม','ทำคู่เทียบราคา (ใบเสนอราคา + รายละเอียดคุณลักษณะ)');
    add('asneeded','งานประมูล','ตรวจสอบเงื่อนไขและจัดหาราคาสินค้าจาก Supplier');
    add('asneeded','งานประมูล','จัดทำใบเสนอราคาและขอเอกสารประมูล');
    add('asneeded','งานประมูล','เตรียมและยื่นเอกสารประมูล ติดตามผล และประสานส่งมอบสินค้า');
    add('monthly','Gudslip / Gudsport B2B','ตรวจสอบยอดขายและค่าคอมมิชชั่นของทีม Sales ประจำเดือน');
    add('monthly','Gudslip / Gudsport B2B','วางแผนสินค้าและสต็อกสำหรับรอบขายเดือนถัดไป');
    add('ongoing','Gudslip / Gudsport B2B','วางระบบและกระบวนการขายใน JUBILI CRM');
    add('ongoing','Gudslip / Gudsport B2B','จัดทำ Sales Toolkit, Sales Playbook และเอกสารประกอบการขาย');
    add('ongoing','Gudslip / Gudsport B2B','อบรม ประเมิน และติดตาม Pipeline ของทีม Sales');
    add('ongoing','Gudslip / Gudsport B2B','กำหนดนโยบายราคา รูปแบบการขาย และอนุมัติส่วนลด');
    add('ongoing','Gudslip / Gudsport B2B','ติดต่อนำเสนอเงื่อนไขกับลูกค้า B2B และ Partner + ทำสัญญาการขาย');
    add('ongoing','Gudslip / Gudsport B2B','ดูแล Key Account ติดตามคำสั่งซื้อ การชำระเงิน และการจัดส่ง');
    add('asneeded','Gudslip / Gudsport B2B','ประสานงานกับ HR ในการสรรหา สัมภาษณ์ และคัดเลือกทีม Sales');
    add('asneeded','Event และ Sponsor','คัดเลือกและประสานงานการเข้าร่วม Event หรือกิจกรรมสปอนเซอร์');
    add('asneeded','Event และ Sponsor','เจรจาพื้นที่ ค่าใช้จ่าย และสิทธิประโยชน์');
    add('asneeded','Event และ Sponsor','วางรูปแบบบูธ โปรโมชั่น และเป้าหมายการขายของแต่ละงาน');
    add('asneeded','Event และ Sponsor','จัดเตรียมสินค้า โบรชัวร์ Company Sheet นามบัตร และอุปกรณ์ออกบูธ');
    add('asneeded','Event และ Sponsor','ดูแลการขนส่ง ติดตั้ง รื้อถอน และสรุปผลหลังจบงาน');
    add('ongoing','จัดซื้อและบุคลากร','สรรหา เปรียบเทียบราคา และจัดซื้อสินค้า/อุปกรณ์ที่จำเป็น');
    add('ongoing','จัดซื้อและบุคลากร','กำหนดคุณสมบัติ สัมภาษณ์ และคัดเลือกพนักงานในทีม');
    add('ongoing','จัดซื้อและบุคลากร','ดูแลการฝึกอบรมและประเมินผลพนักงานในทีม');
    add('ongoing','เอกสารและสื่อการขาย','จัดทำและปรับปรุง Company Profile, Product Catalogue, Presentation');
    add('ongoing','เอกสารและสื่อการขาย','ตรวจสอบเนื้อหา ราคา และข้อความประชาสัมพันธ์ให้ตรงแนวทางบริษัท');
    add('ongoing','เอกสารและสื่อการขาย','ดูแลเอกสารสัญญา ใบเสนอราคา และข้อมูลสินค้าในทุกช่องทาง');
    add('monthly','เงินกองกลาง','ดูแลเงินกองกลางของบริษัทและอนุมัติค่าใช้จ่ายที่เกี่ยวข้อง');
    add('monthly','เงินกองกลาง','ชำระค่าใช้จ่าย เช่น ค่าโทรศัพท์ ค่าจัดส่งสินค้า ค่าอุปกรณ์สำนักงาน ค่าเดินทาง');
    add('monthly','เงินกองกลาง','รวบรวมใบเสร็จและหลักฐานการชำระเงินส่งให้ฝ่ายบัญชี');
  })();

  // ---------- NATT & LIN (same JD, Sale & Event Marketing - gudslip) ----------
  ['natt','lin'].forEach(function(p){
    var n=1;
    var add=function(freq,group,text){ TASKS.push(T(p,p[0]+(n++),freq,group,text)); };
    add('ongoing','Coordinator','ประสานงานระหว่าง CEO กับทีมงาน');
    add('ongoing','Coordinator','ประสานงานกับหน่วยงานราชการ หรือหน่วยงานอื่น ๆ');
    add('ongoing','Coordinator','จัดรับ–จัดส่งเอกสารตามที่ได้รับมอบหมาย');
    add('asneeded','Event Marketing','จัดหา Event หรืองานที่น่าสนใจสำหรับการเข้าร่วม');
    add('asneeded','Event Marketing','เตรียมอุปกรณ์ + ตรวจเช็คสภาพอุปกรณ์ก่อนออกงาน');
    add('asneeded','Event Marketing','ติดตั้งบูธ + ขายสินค้า + ให้ข้อมูลสินค้าหน้างาน');
    add('ongoing','Sale','จัดหาร้านขายยา ฟิตเนส โรงแรม และร้านอื่น ๆ สำหรับวางขาย gudslip');
    add('ongoing','Sale','ติดต่อนำเสนอขายสินค้าของ gudslip ให้ร้านค้าใหม่');
    add('ongoing','Sale','บริการหลังการขายให้ร้านค้า/ลูกค้าที่ดูแลอยู่');
    add('asneeded','CEO Assistant','ปฏิบัติงานอื่น ๆ ตามที่ CEO มอบหมาย');
  });

  // ---------- CHOKUN (Content, 3 brands) ----------
  (function(){
    var g='chokun', n=1;
    var add=function(freq,group,text){ TASKS.push(T(g,'c'+(n++),freq,group,text)); };
    add('weekly','Content Planning','คิดหัวข้อและไอเดียคอนเทนต์ให้ครบทั้ง 3 แบรนด์');
    add('weekly','Content Planning','วาง Content Pillar / Content Calendar ของแต่ละแบรนด์');
    add('weekly','Content Planning','คิด Hook / Story / Direction ของคอนเทนต์แต่ละชิ้น');
    add('weekly','Content Planning','Brainstorm แนวทางคอนเทนต์ใหม่ ๆ ร่วมกับทีม');
    add('weekly','Content Planning','วางแผนคอนเทนต์ให้เหมาะกับแต่ละแพลตฟอร์ม (TikTok/IG/FB/YouTube)');
    add('weekly','Content Production','ถ่ายวิดีโอ / เก็บ Footage ตามแผนที่วางไว้');
    add('weekly','Content Production','เก็บ B-roll, Atmosphere, Lifestyle Shot ของแต่ละแบรนด์');
    add('asneeded','Content Production','ถ่าย Event / Activity / Interview เมื่อมีงาน');
    add('ongoing','Content Production','คิดมุมกล้องและ Mood ของภาพให้เข้ากับแต่ละแบรนด์');
    add('weekly','Video Editing','ตัดต่อ Short-form Video สำหรับ TikTok / IG Reels / Facebook / YouTube');
    add('weekly','Video Editing','เลือก Footage และเรียงลำดับเรื่องราว (Story)');
    add('weekly','Video Editing','ตัด Interview ให้กระชับได้ใจความ');
    add('weekly','Video Editing','ใส่ Subtitle / SFX / Transition / Music');
    add('weekly','Video Editing','ปรับ Color / Mood ให้เข้ากับ Content และแบรนด์');
    add('weekly','Video Editing','ปรับ Hook และจังหวะตัดต่อให้คนดูอยากดูต่อ');
    add('ongoing','Creative Direction','กำหนด Mood & Tone และ Visual Direction โดยรวม');
    add('ongoing','Creative Direction','ทำ Moodboard และหา Reference ใหม่ ๆ');
    add('ongoing','Creative Direction','คิดรูปแบบการเล่าเรื่องและสิ่งที่แต่ละแบรนด์ควรสื่อผ่านคอนเทนต์');
    add('monthly','Brand Content Management','ปรับแนวทาง Content ให้เหมาะกับ Glaiganplace Hotel / gudslip / Sunglaigan');
    add('monthly','Brand Content Management','สร้าง Character และดูแลภาพลักษณ์ให้แต่ละแบรนด์แตกต่างกันชัดเจน');
    add('monthly','Brand Content Management','ทบทวนคอนเทนต์เดือนที่ผ่านมาว่าตรงเป้าหมายของแต่ละแบรนด์หรือไม่');
  })();

  // ---------- BOTUN (Accounting Assistant, ใกล้กัน เมดิเทค) ----------
  (function(){
    var g='botun', n=1;
    var add=function(freq,group,text){ TASKS.push(T(g,'b'+(n++),freq,group,text)); };
    add('daily','ออเดอร์และแพ็คสินค้า','ตรวจเช็ครับ Order ช่วงเช้าในทุกช่องทาง (Shopee/TikTok/Lazada) และยืนยันรับสินค้าในแอป');
    add('daily','ออเดอร์และแพ็คสินค้า','ลงบันทึกยอดขายแต่ละออเดอร์ และปริ้นออเดอร์เพื่อแพ็ค–จัดส่ง');
    add('daily','ออเดอร์และแพ็คสินค้า','ตรวจสอบความถูกต้องหลังแพ็ค และแพ็ค/ส่งคำสั่งซื้อที่เข้าก่อน 12:00 น. ให้ทัน');
    add('daily','ออเดอร์และแพ็คสินค้า','เช็คออเดอร์ที่เข้าหลังแพ็ค และติดตามขนส่งแต่ละเจ้าให้มารับสินค้า');
    add('asneeded','การเงิน','บันทึกเงินสดย่อยเมื่อมีรายการจ่าย และทำเบิกขออนุมัติเงินกองกลาง');
    add('monthly','สรุปยอดขาย','สรุปยอดขายประจำเดือน ทำรายงาน Canva P&L เทียบกับเดือนก่อน');
    add('daily','สรุปยอดขาย','ทำ Canva สรุปยอดขายรายวัน เทียบกับเป้าที่ต้องขายให้ถึงเดือนนั้น');
    add('daily','สต็อกสินค้า','ทำตาราง Stock Movement รายวัน สรุปยอดคงเหลือหลังขายในแต่ละวัน');
    add('weekly','สต็อกสินค้า','สรุป Stock Movement รายสัปดาห์ และเช็คสินค้าที่ต้องเติมของ');
    add('monthly','เอกสารบัญชี','ช่วยเจี๊ยบเก็บเอกสารบัญชี (ใบกำกับภาษีซื้อ-ขาย / ภ.ง.ด.1 / ภ.ง.ด.3 / ภ.ง.ด.53) ส่งสำนักงานบัญชีก่อนกำหนด');
    add('asneeded','สนับสนุนอื่น ๆ','ช่วยแพ็คส่งสินค้าเมื่อมีออเดอร์เครื่องมือแพทย์');
    add('asneeded','สนับสนุนอื่น ๆ','ทำเบิกจ่ายค่าใช้จ่ายพนักงาน (ค่าน้ำมัน ฯลฯ) เมื่อออกทำงานนอกสถานที่');
    add('weekly','สนับสนุนอื่น ๆ','ตามใส่ตารางสรุปยอดขาย/ค่าคอม AMS ในสมุดบัญชี (ยอดโชว์หลังส่งของแล้ว ~1 สัปดาห์)');
  })();

  // ---------- JIAB (Chief Account) ----------
  (function(){
    var g='jiab', n=1;
    var add=function(freq,group,text){ TASKS.push(T(g,'j'+(n++),freq,group,text)); };
    add('daily','งานประจำวัน','ตรวจสอบ Bank / Cash — ยอดคงเหลือและรายการเคลื่อนไหวทุกบัญชี');
    add('daily','งานประจำวัน','ตรวจสอบ Sales / Invoice / Receipt และเอกสารประกอบ');
    add('daily','งานประจำวัน','ตรวจสอบ Collection — เงินรับจากลูกค้าและตัดรับชำระ AR');
    add('daily','งานประจำวัน','ติดตามลูกหนี้คงค้าง (AR) และรายการผิดปกติ');
    add('daily','งานประจำวัน','ตรวจสอบเจ้าหนี้ (AP) เอกสารจ่าย และ Due Date');
    add('daily','งานประจำวัน','บันทึก/ตรวจสอบรายการบัญชีในระบบ PEAK');
    add('daily','งานประจำวัน','ตรวจสอบเอกสาร VAT / WHT และรายการที่ต้องหัก ณ ที่จ่าย');
    add('daily','งานประจำวัน','ตรวจสอบ Stock — รับเข้า ขายออก และยอดคงเหลือ');
    add('daily','งานประจำวัน','สรุปเงินเข้า–ออก (Daily Cash Flow)');
    add('daily','งานประจำวัน','สรุปตัวเลขสำคัญและประเด็นค้างรายงานผู้บริหาร');
    add('weekly','งานประจำสัปดาห์','ตรวจสอบ AR Aging และติดตามรายการค้าง');
    add('weekly','งานประจำสัปดาห์','ตรวจสอบ AP Aging / Due List');
    add('weekly','งานประจำสัปดาห์','ทำ Bank Reconciliation');
    add('weekly','งานประจำสัปดาห์','ตรวจสอบ Stock Movement รายสัปดาห์');
    add('weekly','งานประจำสัปดาห์','สรุปค่าใช้จ่ายแยก Project (Meditech / Gudslip / GoodSpace)');
    add('weekly','งานประจำสัปดาห์','สรุป Cash Flow และภาระจ่ายที่กำลังจะถึงให้ผู้บริหาร');
    add('monthly','งานปิดบัญชีประจำเดือน','ปิดบัญชีประจำเดือน ตรวจสอบรายการค้าง และปรับปรุงบัญชี');
    add('monthly','งานปิดบัญชีประจำเดือน','จัดทำ Profit & Loss');
    add('monthly','งานปิดบัญชีประจำเดือน','จัดทำ Balance Sheet');
    add('monthly','งานปิดบัญชีประจำเดือน','จัดทำ Cash Flow ประจำเดือน');
    add('monthly','งานปิดบัญชีประจำเดือน','จัดทำ Project P&L แยก Meditech / Gudslip / GoodSpace');
    add('monthly','งานปิดบัญชีประจำเดือน','จัดทำ Management Report สรุป KPI ให้ผู้บริหาร');
    add('monthly','งานปิดบัญชีประจำเดือน','จัดทำ Payroll ตรวจสอบเงินเดือน/รายการหัก และยอดจ่ายสุทธิ');
    add('monthly','งานปิดบัญชีประจำเดือน','นำส่งเงินสมทบประกันสังคมของพนักงาน');
    add('monthly','งานปิดบัญชีประจำเดือน','ประสานงานสำนักงานบัญชีภายนอก');
    add('tax','งานด้านภาษี','ยื่น ภ.พ.30 (VAT)');
    add('tax','งานด้านภาษี','ยื่น ภ.ง.ด.1 / 3 / 53');
    add('tax','งานด้านภาษี','ตรวจสอบภาษีหัก ณ ที่จ่าย และเตรียมหนังสือรับรอง');
    add('tax','งานด้านภาษี','ตรวจสอบ VAT ซื้อ–ขาย');
    add('tax','งานด้านภาษี','ตรวจสอบเอกสารนำเข้าและภาษีนำเข้า');
    add('tax','งานด้านภาษี','จัดเตรียมข้อมูลภาษีสำหรับหน่วยงานที่เกี่ยวข้อง');
    add('ongoing','การควบคุมภายใน','ตรวจสอบเอกสารก่อนบันทึกบัญชี และการอนุมัติค่าใช้จ่าย');
    add('ongoing','การควบคุมภายใน','ควบคุม AR / AP และ Stock ให้ตรงกับข้อมูลจริง');
    add('ongoing','การควบคุมภายใน','ตรวจสอบความถูกต้องของข้อมูลในระบบ PEAK');
    add('ongoing','การควบคุมภายใน','จัดเก็บเอกสารทางบัญชีให้ครบถ้วนและค้นหาได้');
  })();

  // ---------- SUN (CEO) ---------- ดึงจากงานของแผนกต่าง ๆ ที่ต้องผ่าน/รอ K.Sun อยู่แล้ว
  (function(){
    var g='sun', n=1;
    var add=function(freq,group,text){ TASKS.push(T(g,'s'+(n++),freq,group,text)); };
    add('ongoing','บริหารภาพรวมองค์กร','กำหนดทิศทาง นโยบาย และเป้าหมายของแต่ละแบรนด์ (Meditech / Gudslip / GoodSpace / Glaiganplace Hotel / Sunglaigan)');
    add('ongoing','บริหารภาพรวมองค์กร','รับทราบสรุปงานและประเด็นค้างจากหัวหน้าแต่ละส่วนงาน');
    add('weekly','บริหารภาพรวมองค์กร','ประชุมทีมใหญ่ / อัปเดตและมอบหมายงานประจำสัปดาห์');
    add('monthly','บริหารภาพรวมองค์กร','ทบทวน Management Report และ KPI ของบริษัทประจำเดือน');
    add('asneeded','อนุมัติค่าใช้จ่ายและงบประมาณ','อนุมัติการใช้เงินกองกลางและค่าใช้จ่ายที่เกินอำนาจของแต่ละแผนก');
    add('asneeded','อนุมัติค่าใช้จ่ายและงบประมาณ','อนุมัติสปอนเซอร์ งบการตลาด และค่าใช้จ่ายอีเวนต์');
    add('asneeded','อนุมัติค่าใช้จ่ายและงบประมาณ','อนุมัติส่วนลดและเงื่อนไขราคาสำหรับลูกค้า B2B รายสำคัญ');
    add('asneeded','อนุมัติค่าใช้จ่ายและงบประมาณ','พิจารณาและเซ็นอนุมัติสัญญา/ข้อเสนอที่มีผลผูกพันบริษัท');
    add('asneeded','ตัดสินใจ/ชี้ขาด','ตัดสินใจเรื่องสำคัญที่ทีมส่งเข้ามาขออนุมัติ หรือเรื่องที่ติดขัดข้ามแผนก');
    add('ongoing','ภาพลักษณ์และความสัมพันธ์ภายนอก','ดูแลความสัมพันธ์กับพาร์ทเนอร์ ลูกค้ารายสำคัญ และหน่วยงานภายนอก');
  })();

  // ---------- state ----------
  var today = new Date();
  var currentMonth = today.getFullYear()+'-'+String(today.getMonth()+1).padStart(2,'0'); // real current month; JD is reference-only now, so this no longer scrolls
  var activeTab = 'overview';
  var activeFreq = {}; // per person filter
  var db = null, dbReady = false;
  var ACTION_ITEMS = []; // {p,id,text,due:'YYYY-MM-DD',done:bool,createdAt}
  var actionUnsub = null;
  var actionLocalSeq = 1;
  var CAL_CUSTOM_CACHE = {}; // monthKey -> [{id,day,text,tag}]
  var calUnsub = null;
  var calLocalSeq = 1;
  var EVENT_META_CACHE = {}; // eventKey -> {responsible:[], due, note}
  var eventMetaAllUnsub = null;
  var ALL_DYN_EVENTS = {}; // id -> {month, day, text, tag} — every user-added calendar event, any month
  var allCalUnsub = null;
  var SUN_OFFICE = {}; // 'YYYY-MM-DD' -> 'in' | 'out'
  var sunOfficeUnsub = null;

  // ---------- attendance (การเข้างานและวันหยุด) ----------
  // one doc per person per day in 'attendance': id 'YYYY-MM-DD__personKey', {date,p,status,note,checkInAt?,updatedAt}
  var ATT_STATUS = [
    {k:'in',   label:'เข้างาน',     short:'เข้า',  en:'At work',        enShort:'In',   kind:'present'},
    {k:'wfh',  label:'WFH',         short:'WFH',   en:'Working from home', enShort:'Home', kind:'present'},
    {k:'out',  label:'นอกสถานที่',   short:'นอก',   en:'Off-site',       enShort:'Out',  kind:'present'},
    {k:'vac',  label:'พักร้อน',      short:'พร.',   en:'Vacation',       enShort:'Vac',  kind:'leave'},
    {k:'sick', label:'ลาป่วย',       short:'ป่วย',  en:'Sick leave',     enShort:'Sick', kind:'leave'},
    {k:'biz',  label:'ลากิจ',        short:'กิจ',   en:'Personal leave', enShort:'Pers', kind:'leave'},
    {k:'off',  label:'หยุด',         short:'หยุด',  en:'Day off',        enShort:'Off',  kind:'leave'}
  ];
  var ATTEND = {};
  var attendUnsub = null;
  var attModalState = {p:'', date:'', status:''};
  var attScrollMonth = '';
  var attPendingScroll = null;
  var WD_SHORT = ['อา','จ','อ','พ','พฤ','ศ','ส'];
  var WD_LONG = ['อาทิตย์','จันทร์','อังคาร','พุธ','พฤหัสบดี','ศุกร์','เสาร์'];

  // full (unfiltered by month) subscription so the overview's "urgent" list can resolve
  // an event's label even when nobody currently has that month open on the calendar tab
  function loadAllCalEvents(){
    if(!db) return;
    if(allCalUnsub){ allCalUnsub(); allCalUnsub = null; }
    allCalUnsub = db.collection('calEvents').onSnapshot(function(snap){
      var next = {};
      snap.docs.forEach(function(doc){
        var d = doc.data() || {};
        next[doc.id] = {month:d.month, day:d.day, text:d.text||'', tag:!!d.tag};
      });
      ALL_DYN_EVENTS = next;
      renderAll();
    }, function(err){ console.warn('calEvents (all) error', err); });
  }

  function labelForEventKey(key){
    if(key.indexOf('static__')===0){
      var parts = key.split('__');
      var mk = parts[1], day = parseInt(parts[2],10), idx = parseInt(parts[3],10);
      var evs = (CAL_STATIC[mk]||{})[day];
      return (evs && evs[idx]) ? evs[idx].t : null;
    }
    if(key.indexOf('dyn__')===0){
      var e = ALL_DYN_EVENTS[key.slice(5)];
      return e ? e.text : null;
    }
    return null;
  }

  // calendar-assigned deadlines landing within the next 3 days — surfaced on the overview tab
  function urgentEvents(){
    var limitI = isoDate(new Date(today.getFullYear(), today.getMonth(), today.getDate()+3));
    var out = [];
    Object.keys(EVENT_META_CACHE).forEach(function(key){
      var meta = EVENT_META_CACHE[key];
      if(!meta || !meta.due) return;
      if(meta.due < TODAY_ISO || meta.due > limitI) return;
      var label = labelForEventKey(key);
      if(!label) return; // event since deleted, or its month's label isn't loaded yet
      out.push({key:key, label:label, due:meta.due, responsible:meta.responsible||[]});
    });
    out.sort(function(a,b){ return a.due.localeCompare(b.due); });
    return out;
  }

  function renderUrgent(){
    var host = document.getElementById('urgentBox');
    if(!host) return;
    var items = urgentEvents();
    if(!items.length){ host.innerHTML = ''; return; }
    var html = '<div class="urgent-box"><div class="title">⚠️ ใกล้ถึงกำหนด (ภายใน 3 วัน) <span class="en-i">· Due soon (within 3 days)</span></div>';
    items.forEach(function(it){
      var isToday = it.due===TODAY_ISO;
      html += '<div class="urgent-item">';
      html += '  <span class="u-txt">'+bi(it.label, true)+'</span>';
      html += '  <span class="u-due">'+(isToday?biI('วันนี้','Today'):dueBi(it.due))+'</span>';
      html += '  <span class="u-who">';
      if(it.responsible.length){
        it.responsible.forEach(function(pk){
          var p = personByKey(pk);
          if(!p) return;
          html += '<span class="u-chip" style="background:'+p.color+';" data-urgent-jump="'+pk+'">'+nameBi(p)+'</span>';
        });
      } else {
        html += '<span class="u-chip" style="background:var(--ink-faint);">'+biI('ยังไม่มอบหมาย','Unassigned')+'</span>';
      }
      html += '  </span>';
      html += '</div>';
    });
    html += '</div>';
    host.innerHTML = html;
    host.querySelectorAll('[data-urgent-jump]').forEach(function(chip){
      chip.addEventListener('click', function(){
        activeTab = chip.getAttribute('data-urgent-jump');
        renderAll();
      });
    });
  }

  function loadSunOffice(){
    if(!db) return;
    if(sunOfficeUnsub){ sunOfficeUnsub(); sunOfficeUnsub = null; }
    sunOfficeUnsub = db.collection('sunOffice').onSnapshot(function(snap){
      var next = {};
      snap.docs.forEach(function(doc){
        var d = doc.data() || {};
        if(d.status) next[doc.id] = d.status;
      });
      SUN_OFFICE = next;
      renderAll();
    }, function(err){ console.warn('sunOffice error', err); });
  }

  // click cycles a day: unset -> เข้าออฟฟิศ -> ไม่เข้าออฟฟิศ -> unset
  function cycleSunOffice(dateIso){
    var cur = SUN_OFFICE[dateIso] || '';
    var next = cur==='' ? 'in' : (cur==='in' ? 'out' : '');
    if(db){
      if(next===''){
        db.collection('sunOffice').doc(dateIso).delete().catch(function(e){ console.warn('sunOffice clear failed', e); });
      } else {
        db.collection('sunOffice').doc(dateIso).set({status:next, updatedAt:Date.now()}).catch(function(e){ console.warn('sunOffice save failed', e); });
      }
    }
    if(next==='') delete SUN_OFFICE[dateIso]; else SUN_OFFICE[dateIso] = next;
    renderAll();
  }

  function loadAllEventMeta(){
    if(!db) return;
    if(eventMetaAllUnsub){ eventMetaAllUnsub(); eventMetaAllUnsub = null; }
    eventMetaAllUnsub = db.collection('eventMeta').onSnapshot(function(snap){
      var next = {};
      snap.docs.forEach(function(doc){ next[doc.id] = doc.data() || {}; });
      EVENT_META_CACHE = next;
      renderAll();
    }, function(err){ console.warn('eventMeta list error', err); });
  }
  var HIDDEN_TASKS = {}; // "p__id" -> true  (permanently removed built-in tasks, per person)
  var hiddenUnsub = null;
  var jdOpen = {}; // per-person: whether the "หน้าที่หลัก" disclosure is expanded (default true)

  var THAI_MONTHS = ['มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน','กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม'];

  function monthLabel(mk){
    var parts = mk.split('-'); var y = parseInt(parts[0],10)+543; var m = parseInt(parts[1],10)-1;
    return THAI_MONTHS[m] + ' ' + y;
  }
  function shiftMonth(mk, delta){
    var parts = mk.split('-'); var y = parseInt(parts[0],10); var m = parseInt(parts[1],10)-1+delta;
    var d = new Date(y, m, 1);
    return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0');
  }
  var THAI_MONTHS_SHORT = ['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.'];
  function fmtDue(due){
    if(!due) return '—';
    var parts = due.split('-');
    if(parts.length!==3) return due;
    var y = (parseInt(parts[0],10)+543).toString().slice(-2);
    var m = THAI_MONTHS_SHORT[parseInt(parts[1],10)-1] || parts[1];
    var d = parseInt(parts[2],10);
    return d+' '+m+' '+y;
  }

  function allTasksFor(p){
    return TASKS.filter(function(t){ return t.p===p; });
  }
  function tasksFor(p){
    return allTasksFor(p).filter(function(t){ return !HIDDEN_TASKS[p+'__'+t.id]; });
  }
  function hiddenTasksFor(p){
    return allTasksFor(p).filter(function(t){ return !!HIDDEN_TASKS[p+'__'+t.id]; });
  }

  function hideTask(p, id){
    if(db){
      db.collection('hiddenTasks').doc(p+'__'+id).set({p:p, id:id, hiddenAt:Date.now()}).catch(function(e){
        console.warn('hide failed', e);
      });
    } else {
      HIDDEN_TASKS[p+'__'+id] = true;
      renderAll();
    }
  }
  function restoreTask(p, id){
    if(db){
      db.collection('hiddenTasks').doc(p+'__'+id).delete().catch(function(e){ console.warn('restore failed', e); });
    } else {
      delete HIDDEN_TASKS[p+'__'+id];
      renderAll();
    }
  }
  function loadHiddenTasks(){
    if(!db) return;
    if(hiddenUnsub){ hiddenUnsub(); hiddenUnsub = null; }
    hiddenUnsub = db.collection('hiddenTasks').onSnapshot(function(snap){
      var map = {};
      snap.docs.forEach(function(doc){
        var d = doc.data() || {};
        if(d.p && d.id) map[d.p+'__'+d.id] = true;
      });
      HIDDEN_TASKS = map;
      renderAll();
    }, function(err){ console.warn('hiddenTasks error', err); });
  }

  // ---------- action items: ad-hoc tasks with a real due date, bucketed for the Monday recap ----------
  function isoDate(d){ return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'); }
  var TODAY_ISO = isoDate(today);

  function weekRanges(){
    var now = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    var day = now.getDay(); // 0=Sun
    var diffToMon = (day===0 ? -6 : 1-day);
    var thisMon = new Date(now); thisMon.setDate(now.getDate()+diffToMon);
    var thisSun = new Date(thisMon); thisSun.setDate(thisMon.getDate()+6);
    var lastMon = new Date(thisMon); lastMon.setDate(thisMon.getDate()-7);
    var lastSun = new Date(thisMon); lastSun.setDate(thisMon.getDate()-1);
    var monthEnd = new Date(now.getFullYear(), now.getMonth()+1, 0);
    return {thisMon:thisMon, thisSun:thisSun, lastMon:lastMon, lastSun:lastSun, monthEnd:monthEnd};
  }

  // a task shows on its owner's page and on every collaborator's page
  function actionItemsFor(p){
    return ACTION_ITEMS.filter(function(t){ return t.p===p || (t.with||[]).indexOf(p)>=0; });
  }

  function bucketActionItems(p, filterFn, flat){
    var r = weekRanges();
    var lastMonI = isoDate(r.lastMon), lastSunI = isoDate(r.lastSun);
    var thisMonI = isoDate(r.thisMon), thisSunI = isoDate(r.thisSun);
    var monthEndI = isoDate(r.monthEnd);
    var buckets = {lastWeek:[], thisWeek:[], restOfMonth:[], older:[], flatMonth:null,
      ranges:{lastMonI:lastMonI,lastSunI:lastSunI,thisMonI:thisMonI,thisSunI:thisSunI,monthEndI:monthEndI}};

    var items = actionItemsFor(p);
    if(filterFn) items = items.filter(filterFn);

    if(flat){
      // one plain list, no weekly grouping — sorted straight down by due date.
      // still respects the month nav: shows the browsed month, plus any still-open
      // overdue items from before it so nothing gets lost.
      var flatItems;
      if(currentMonth === TODAY_ISO.slice(0,7)){
        flatItems = items.filter(function(t){
          var d = t.due||'';
          if(!d) return true;
          if(d < lastMonI) return !t.done;
          return d <= monthEndI;
        });
      } else {
        flatItems = items.filter(function(t){ return (t.due||'').slice(0,7)===currentMonth; });
      }
      buckets.flatMonth = flatItems.sort(function(a,b){ return (a.due||'').localeCompare(b.due||''); });
      return buckets;
    }

    // browsing today's real month → keep the Monday-recap weekly breakdown (relative to actual "today")
    // browsing any other month (via the month nav) → just list everything due that month, flat, sorted
    if(currentMonth === TODAY_ISO.slice(0,7)){
      items.forEach(function(t){
        var d = t.due || '';
        if(!d){ buckets.thisWeek.push(t); return; }
        if(d < lastMonI){ if(!t.done) buckets.older.push(t); }
        else if(d <= lastSunI){ buckets.lastWeek.push(t); }
        else if(d <= thisSunI){ buckets.thisWeek.push(t); }
        else if(d <= monthEndI){ buckets.restOfMonth.push(t); }
      });
      ['lastWeek','thisWeek','restOfMonth','older'].forEach(function(k){
        buckets[k].sort(function(a,b){ return (a.due||'').localeCompare(b.due||''); });
      });
    } else {
      buckets.flatMonth = items.filter(function(t){
        return (t.due||'').slice(0,7)===currentMonth;
      }).sort(function(a,b){ return (a.due||'').localeCompare(b.due||''); });
    }
    return buckets;
  }

  var TASK_TYPES = [
    {k:'event',   label:'Event',          en:''},
    {k:'office',  label:'งานออฟฟิศ',      en:'Office work'},
    {k:'meeting', label:'ประชุม',          en:'Meeting'},
    {k:'sales',   label:'ขาย / ลูกค้า',    en:'Sales / clients'},
    {k:'doc',     label:'เอกสาร / บัญชี',  en:'Documents / accounts'},
    {k:'content', label:'คอนเทนต์',        en:'Content'},
    {k:'other',   label:'อื่น ๆ',           en:'Other'}
  ];
  var TASK_STATUS = [
    {k:'todo',    label:'ยังไม่เริ่ม',         en:'Not started'},
    {k:'doing',   label:'กำลังทำ',            en:'In progress'},
    {k:'waiting', label:'รอคนอื่น / รอตรวจ',  en:'Waiting on others / in review'},
    {k:'done',    label:'เสร็จแล้ว',           en:'Done'}
  ];
  function taskType(k){
    for(var i=0;i<TASK_TYPES.length;i++){ if(TASK_TYPES[i].k===k) return TASK_TYPES[i]; }
    return TASK_TYPES[TASK_TYPES.length-1];
  }
  function taskStatusOf(t){
    if(t.done) return 'done';
    return (t.status && t.status!=='done') ? t.status : 'todo';
  }
  function safeUrl(u){
    u = String(u||'').trim();
    if(!u) return '';
    return /^https?:\/\//i.test(u) ? u : 'https://'+u;
  }

  function mapActionDoc(doc){
    var d = doc.data() || {};
    var done = !!d.done;
    return {
      p:d.p, id:doc.id, text:d.text||'', due:d.due||'', link:d.link||'', evKey:d.evKey||'', requester:d.requester||'', done:done,
      type:d.type||'', with:Array.isArray(d.with) ? d.with : [], status:d.status || (done ? 'done' : 'todo'), note:d.note||'',
      subtasks:Array.isArray(d.subtasks) ? d.subtasks : [], doneAt:d.doneAt||0, createdAt:d.createdAt||0
    };
  }

  function addActionItem(p, text, due, link, evKey, requester, extra){
    text = (text||'').trim();
    due = due || TODAY_ISO;
    link = (link||'').trim();
    evKey = evKey || '';
    requester = (requester||'').trim();
    extra = extra || {};
    if(!text) return;
    var doc = {p:p, text:text, due:due, link:link, evKey:evKey, requester:requester, done:false, status:'todo',
               type:extra.type||'', with:extra.with||[], note:'', subtasks:[], createdAt:Date.now()};
    if(db){
      db.collection('actionItems').add(doc).catch(function(e){ console.warn('add action item failed', e); });
    } else {
      var local = {id:'local'+(actionLocalSeq++), doneAt:0};
      Object.keys(doc).forEach(function(k){ local[k] = doc[k]; });
      ACTION_ITEMS.push(local);
      renderAll();
    }
  }

  function toggleActionDone(item, val){
    item.done = val; // optimistic
    item.status = val ? 'done' : 'todo';
    item.doneAt = val ? Date.now() : 0;
    if(db && item.id.indexOf('local')!==0){
      db.collection('actionItems').doc(item.id).update({done:val, status:item.status, doneAt:item.doneAt}).catch(function(e){ console.warn('update failed', e); });
    }
    renderAll();
  }

  function deleteActionItem(id){
    if(db && id.indexOf('local')!==0){
      db.collection('actionItems').doc(id).delete().catch(function(e){ console.warn('delete failed', e); });
    }
    ACTION_ITEMS = ACTION_ITEMS.filter(function(t){ return t.id!==id; });
    renderAll();
  }

  function loadActionItems(){
    if(!db) return;
    if(actionUnsub){ actionUnsub(); actionUnsub = null; }
    actionUnsub = db.collection('actionItems').onSnapshot(function(snap){
      ACTION_ITEMS = snap.docs.map(mapActionDoc);
      renderAll();
    }, function(err){ console.warn('actionItems error', err); });
  }

  // JD ("หน้าที่หลักตามตำแหน่ง") เป็นข้อมูลอ้างอิงล้วน ไม่มีการติ๊กเสร็จ เพราะเป็นหน้าที่ประจำตัวอยู่แล้ว
  // "ต้องเสร็จภายในเดือนนี้" จึงผูกกับ "ความรับผิดชอบปัจจุบัน" (action item ที่มีวันครบกำหนดจริง) เท่านั้น
  function progressFor(p){
    var actionThisMonth = actionItemsFor(p).filter(function(t){ return (t.due||'').slice(0,7)===currentMonth; });
    var total = actionThisMonth.length;
    if(!total) return {done:0,total:0,pct:0};
    var done = actionThisMonth.filter(function(t){ return t.done; }).length;
    return {done:done, total:total, pct: Math.round(done/total*100)};
  }

  // ---------- render: tabs ----------
  function renderTabs(){
    var tabs = document.getElementById('tabs');
    var defs = [{key:'overview', label:'ภาพรวมทีม', en:'Team overview'}, {key:'attendance', label:'การเข้างานและวันหยุด', en:'Attendance & leave'}]
      .concat(PEOPLE.map(function(p){ return {key:p.key, label:p.name}; }))
      .concat([{key:'calendar', label:'ปฏิทินบริษัท', en:'Company calendar'}]);
    tabs.innerHTML = '';
    defs.forEach(function(d){
      var b = document.createElement('button');
      b.innerHTML = bi(d.label, true, d.en);
      b.className = d.key===activeTab ? 'active' : '';
      var pc = personByKey(d.key);
      if(pc){
        b.style.setProperty('--dot-color', pc.color);
        b.style.borderBottom = '3px solid '+pc.color;
        if(d.key===activeTab){ b.style.background = pc.color+'22'; b.style.color = pc.color; }
      }
      b.onclick = function(){ activeTab = d.key; renderAll(); };
      tabs.appendChild(b);
    });
  }

  function showPanel(key){
    document.querySelectorAll('section.panel').forEach(function(s){ s.classList.remove('active'); });
    var el = document.getElementById('panel-'+key);
    if(el) el.classList.add('active');
  }

  // ---------- render: overview ----------
  function renderOverview(){
    var grid = document.getElementById('overviewGrid');
    grid.innerHTML = '';
    PEOPLE.forEach(function(p){
      var prog = progressFor(p.key);
      var card = document.createElement('div');
      card.className = 'card p-card';
      card.style.borderLeft = '4px solid '+p.color;
      card.onclick = function(){ activeTab = p.key; renderAll(); };
      card.innerHTML =
        '<div class="name" style="color:'+p.color+';">'+bi(p.name)+'</div>'+
        '<div class="bar"><i style="width:'+prog.pct+'%"></i></div>'+
        '<div class="stat"><span>ต้องเสร็จ '+monthLabel(currentMonth)+'<span class="en">Due in '+enMonth(currentMonth)+'</span></span><span>'+prog.done+' / '+prog.total+'</span></div>';
      grid.appendChild(card);
    });
  }

  // ---------- render: person panels ----------
  var taskFilter = {};  // personKey -> {open:bool, type:''}
  var taskDraft = {};   // personKey -> {text,due,type,with:[]}  (survives live re-renders)

  function taskRowHtml(t, viewerKey){
    var overdue = !t.done && t.due && t.due < TODAY_ISO;
    var st = taskStatusOf(t);
    var subs = t.subtasks || [];
    var subDone = subs.filter(function(x){ return x.d; }).length;
    var h = '<div class="trow'+(t.done?' done':'')+'" data-task-open="'+t.id+'" tabindex="0" role="button">';
    h += '<input type="checkbox" class="tcheck" data-ai-id="'+t.id+'" '+(t.done?'checked':'')+' aria-label="ทำเสร็จแล้ว / Mark done">';
    h += '<div class="tmain"><div class="ttitle">'+bi(t.text, true)+'</div><div class="tmeta">';
    if(t.type){ var ty = taskType(t.type); h += '<span class="tchip tp-'+ty.k+'">'+tl(ty)+'</span>'; }
    if(t.due){
      if(t.done && t.doneAt){
        var doneIso = isoDate(new Date(t.doneAt));
        var late = doneIso > t.due;
        h += '<span class="tbadge'+(late?' late':'')+'">'+(late?'เสร็จช้า · ':'เสร็จ ')+fmtDue(doneIso)+' <span class="en-i">· '+(late?'Done late ':'Done ')+enDue(doneIso)+'</span></span>';
      } else {
        h += '<span class="tbadge'+(overdue?' overdue':'')+'">'+(overdue?'เลยกำหนด · ':'ส่ง ')+fmtDue(t.due)+' <span class="en-i">· '+(overdue?'Overdue ':'Due ')+enDue(t.due)+'</span></span>';
      }
    }
    if(!t.done && st==='doing') h += '<span class="tbadge ts-doing">'+biI('กำลังทำ','In progress')+'</span>';
    if(!t.done && st==='waiting') h += '<span class="tbadge ts-waiting">'+biI('รอคนอื่น / รอตรวจ','Waiting / in review')+'</span>';
    if(subs.length) h += '<span class="tbadge">ขั้นตอน '+subDone+'/'+subs.length+' <span class="en-i">· Steps</span></span>';
    var others = [t.p].concat(t.with||[]).filter(function(k, i, arr){ return k!==viewerKey && arr.indexOf(k)===i; });
    var names = others.map(function(k){
      var q = personByKey(k);
      return q ? '<span class="twith"><i style="background:'+q.color+';"></i>'+nameBi(q)+'</span>' : '';
    }).join('');
    if(names && (t.with||[]).length) h += '<span class="twith" style="color:var(--ink-faint);">'+biI('ร่วมกับ','with')+'</span>'+names;
    else if(names && t.p!==viewerKey) h += '<span class="twith" style="color:var(--ink-faint);">'+biI('งานของ','owned by')+'</span>'+names;
    if(t.requester) h += '<span class="tbadge">ขอโดย '+escHtml(t.requester)+' <span class="en-i">· Requested by</span></span>';
    if(t.evKey) h += '<span class="tbadge">'+biI('จากปฏิทิน','From calendar')+'</span>';
    if(t.note) h += '<span class="tbadge">'+biI('มีหมายเหตุ','Has notes')+'</span>';
    if(t.link) h += '<a class="tbadge" href="'+escAttr(safeUrl(t.link))+'" target="_blank" rel="noopener">'+biI('ลิงก์งาน','Task link')+'</a>';
    h += '</div></div></div>';
    return h;
  }

  function renderPersonPanels(){
    var host = document.getElementById('personPanels');
    host.innerHTML = '';
    PEOPLE.forEach(function(p){
      var sec = document.createElement('section');
      sec.className = 'panel';
      sec.id = 'panel-'+p.key;

      var prog = progressFor(p.key);
      var groups = {};
      tasksFor(p.key).forEach(function(t){
        groups[t.group] = groups[t.group] || [];
        groups[t.group].push(t);
      });
      var freqsPresent = Array.from(new Set(tasksFor(p.key).map(function(t){return t.freq;})));
      var curFilter = activeFreq[p.key] || 'all';
      var isSun = p.key==='sun';
      var isRealCurrentMonth = currentMonth === TODAY_ISO.slice(0,7);
      var todayStr = TODAY_ISO;
      var tf = taskFilter[p.key] || (taskFilter[p.key] = {open:false, type:''});
      var defaultAddDue = isRealCurrentMonth ? todayStr : (currentMonth+'-01');

      var html = '';
      var fx = fullExtra(p);
      html += '<div class="person-head" style="border-left:4px solid '+p.color+'; padding-left:14px;">';
      var enHead = [enOf(p.name), fx ? (enOf(fx) || (/[ก-๙]/.test(fx) ? '' : '')) : ''].filter(function(x){ return x; }).join(' · ');
      html += '  <div class="who"><h2><span style="color:'+p.color+';">'+p.name+'</span>'+(fx ? ' <span style="font-weight:400;color:var(--ink-soft);font-size:14px;">'+fx+'</span>' : '')+(enHead ? '<span class="en">'+escHtml(enHead)+'</span>' : '')+'</h2>';
      if(p.contact) html += '    <div class="contact">'+bi(p.contact)+'</div>';
      html += '  </div>';
      html += '  <div class="progress-box"><div class="pct">'+prog.pct+'%</div><div class="lbl">Task ที่ต้องเสร็จใน '+monthLabel(currentMonth)+' — เสร็จแล้ว '+prog.done+' จาก '+prog.total+'<span class="en">Tasks due in '+enMonth(currentMonth)+' — '+prog.done+' of '+prog.total+' done</span></div></div>';
      html += '</div>';

      // ---- Sun only: office attendance calendar ----
      if(isSun){
        html += '<div class="section-title" style="display:flex; align-items:center; justify-content:space-between; gap:10px; flex-wrap:wrap;">';
        html += '  <span>ปฏิทินเข้า-ออกออฟฟิศ<span class="en">Sun\'s office in/out calendar</span></span>';
        html += '  <span style="display:flex; align-items:center; gap:6px; font-weight:400; font-size:13px; text-transform:none; letter-spacing:0;">';
        html += '    <button type="button" class="chip" data-month-act="prev" title="เดือนก่อนหน้า / Previous month">‹</button>';
        html += '    <span style="min-width:104px; text-align:center;">'+bi(monthLabel(currentMonth), false, enMonth(currentMonth))+'</span>';
        html += '    <button type="button" class="chip" data-month-act="next" title="เดือนถัดไป / Next month">›</button>';
        html += '  </span>';
        html += '</div>';
        html += '<p class="note-line" style="margin-top:-4px;">'+bi('คลิกที่วันที่เพื่อวนสถานะ: ยังไม่ระบุ → เข้าออฟฟิศ → ไม่เข้าออฟฟิศ → ยังไม่ระบุ', false, 'Click a day to cycle its status: not set → in the office → not in the office → not set')+'</p>';
        html += '<div class="cal-wrap"><table class="cal"><thead><tr><th>อา<span class="en">Sun</span></th><th>จ<span class="en">Mon</span></th><th>อ<span class="en">Tue</span></th><th>พ<span class="en">Wed</span></th><th>พฤ<span class="en">Thu</span></th><th>ศ<span class="en">Fri</span></th><th>ส<span class="en">Sat</span></th></tr></thead><tbody>';
        var sDim = daysInMonthOf(currentMonth), sFw = firstWeekdayOf(currentMonth);
        var sCells = [];
        for(var si=0; si<sFw; si++) sCells.push(null);
        for(var sd=1; sd<=sDim; sd++) sCells.push(sd);
        while(sCells.length % 7 !== 0) sCells.push(null);
        for(var sr=0; sr<sCells.length/7; sr++){
          html += '<tr>';
          for(var sc=0; sc<7; sc++){
            var sDay = sCells[sr*7+sc];
            if(sDay===null){ html += '<td class="blank"></td>'; continue; }
            var sIso = currentMonth+'-'+String(sDay).padStart(2,'0');
            var sSt = SUN_OFFICE[sIso] || '';
            var sCls = sSt==='in' ? ' in' : (sSt==='out' ? ' out' : '');
            var sLbl = sSt==='in' ? bi('เข้าออฟฟิศ',false,'In office') : (sSt==='out' ? bi('ไม่เข้าออฟฟิศ',false,'Not in office') : '');
            html += '<td class="sun-day'+sCls+'" data-sun-day="'+sIso+'"><span class="d">'+sDay+'</span>'+(sLbl?'<span class="lbl">'+sLbl+'</span>':'')+'</td>';
          }
          html += '</tr>';
        }
        html += '</tbody></table></div>';
      }

      // ---- building blocks ----
      function monthNavHtml(){
        var h = '  <span style="display:flex; align-items:center; gap:6px; font-weight:400; font-size:13px; text-transform:none; letter-spacing:0;">';
        h += '    <button type="button" class="chip" data-month-act="prev" title="เดือนก่อนหน้า / Previous month">‹</button>';
        h += '    <span style="min-width:104px; text-align:center;">'+bi(monthLabel(currentMonth), false, enMonth(currentMonth))+'</span>';
        h += '    <button type="button" class="chip" data-month-act="next" title="เดือนถัดไป / Next month">›</button>';
        if(!isRealCurrentMonth) h += '    <button type="button" class="chip" data-month-act="today">'+biI('เดือนนี้','This month')+'</button>';
        h += '  </span>';
        return h;
      }
      function sectionHead(title, first, withNav){
        var st = first ? 'margin-top:0; padding-top:0; border-top:none; ' : '';
        return '<div class="section-title" style="'+st+'display:flex; align-items:center; justify-content:space-between; gap:10px; flex-wrap:wrap;"><span>'+title+'</span>'+(withNav ? monthNavHtml() : '')+'</div>';
      }
      function bucketHtml(title, range, list, emptyMsg, warn){
        var h = '<div class="bucket-head'+(warn?' warn':'')+'">'+title+(range ? '<span class="bk-range">'+range+'</span>' : '')+'</div>';
        if(!list.length){
          h += '<p class="note-line" style="margin:0 0 16px;">'+emptyMsg+'</p>';
        } else {
          h += '<div class="tlist">';
          list.forEach(function(t){ h += taskRowHtml(t, p.key); });
          h += '</div>';
        }
        return h;
      }
      function bucketsBlock(b, flatTitle){
        var R = b.ranges, h = '';
        if(b.flatMonth){
          return bucketHtml(flatTitle, '', b.flatMonth, bi('ยังไม่มีรายการในเดือนนี้', false, 'Nothing this month yet'));
        }
        function rng(a, b){ return fmtDue(a)+' – '+fmtDue(b)+' <span class="en-i">· '+enDue(a)+' – '+enDue(b)+'</span>'; }
        h += bucketHtml(biI('สัปดาห์ที่แล้ว','Last week'), rng(R.lastMonI, R.lastSunI), b.lastWeek, bi('ไม่มี Task ที่ถึงกำหนดสัปดาห์ที่แล้ว', false, 'No tasks were due last week'));
        h += bucketHtml(biI('สัปดาห์นี้','This week'), rng(R.thisMonI, R.thisSunI), b.thisWeek, bi('ยังไม่มี Task สัปดาห์นี้', false, 'No tasks this week yet'));
        h += bucketHtml(biI('ที่เหลือของเดือน','Rest of the month'), 'ถึง '+fmtDue(R.monthEndI)+' <span class="en-i">· until '+enDue(R.monthEndI)+'</span>', b.restOfMonth, bi('ไม่มี Task ในช่วงที่เหลือของเดือน', false, 'No tasks for the rest of the month'));
        if(b.older.length) h += bucketHtml(biI('ค้างจากก่อนหน้า','Carried over (overdue)'), '', b.older, '', true);
        return h;
      }
      function taskFormHtml(){
        var d = taskDraft[p.key] || {};
        var h = '<div class="tform" data-form="task">';
        h += '<div class="tform-row">';
        h += '<input type="text" id="tf-text-'+p.key+'" data-ai-text placeholder="เพิ่ม Task ใหม่… / Add a new task…" value="'+escAttr(d.text||'')+'">';
        h += '<input type="date" id="tf-due-'+p.key+'" data-ai-due value="'+(d.due || defaultAddDue)+'" aria-label="กำหนดส่ง / Due date">';
        h += '<select id="tf-type-'+p.key+'" data-ai-type aria-label="ประเภทงาน / Type">';
        TASK_TYPES.forEach(function(ty){ h += '<option value="'+ty.k+'"'+(ty.k===(d.type||'office')?' selected':'')+'>'+biOpt(ty.label, ty.en)+'</option>'; });
        h += '</select>';
        h += '<button type="button" class="att-btn primary" data-ai-submit>+ เพิ่ม <span class="en-i">· Add</span></button>';
        h += '</div>';
        h += '<div class="tform-with"><span>'+biI('ทำร่วมกับ','Working with')+'</span>';
        PEOPLE.forEach(function(q){
          if(q.key===p.key) return;
          var on = (d.with||[]).indexOf(q.key)>=0;
          h += '<button type="button" class="wchip'+(on?' on':'')+'" data-with="'+q.key+'" style="border-color:'+q.color+';'+(on ? 'background:'+q.color+';' : 'color:'+q.color+';')+'">'+nameBi(q)+'</button>';
        });
        h += '</div></div>';
        return h;
      }
      function filterBarHtml(){
        var all = actionItemsFor(p.key).filter(function(t){ return isSun ? !t.requester : true; });
        if(!all.length) return '';
        var types = TASK_TYPES.filter(function(ty){ return all.some(function(t){ return (t.type||'other')===ty.k; }); });
        var h = '<div class="tfilter">';
        h += '<button type="button" class="chip'+(!tf.open?' active':'')+'" data-tfilter-open="0">'+biI('ทั้งหมด','All')+'</button>';
        h += '<button type="button" class="chip'+(tf.open?' active':'')+'" data-tfilter-open="1">'+biI('ยังไม่เสร็จ','Not done')+'</button>';
        if(types.length>1){
          h += '<span class="tsep"></span>';
          h += '<button type="button" class="chip'+(!tf.type?' active':'')+'" data-tfilter-type="">'+biI('ทุกประเภท','All types')+'</button>';
          types.forEach(function(ty){
            h += '<button type="button" class="chip'+(tf.type===ty.k?' active':'')+'" data-tfilter-type="'+ty.k+'">'+tl(ty)+'</button>';
          });
        }
        h += '</div>';
        return h;
      }
      function passFilter(t){
        if(tf.open && t.done) return false;
        if(tf.type && (t.type||'other')!==tf.type) return false;
        return true;
      }

      // ---- Sun: requests to sign / approve (employees fill these in) ----
      if(isSun){
        html += sectionHead(bi('คำขอให้เซ็น / อนุมัติ', false, 'Requests for Sun to sign / approve'), true, true);
        html += '<div class="addtask" data-form="req">';
        html += '  <input type="text" id="rq-text" placeholder="เรื่องที่ต้องให้ซันเซ็น/อนุมัติ… / What Sun needs to sign or approve…" data-ai-text style="flex:2 1 220px;">';
        html += '  <input type="date" id="rq-due" data-ai-due data-sun-due value="'+defaultAddDue+'">';
        html += '  <input type="text" id="rq-who" placeholder="ชื่อผู้ขอ / Requester name" data-ai-requester style="flex:1 1 120px;">';
        html += '  <input type="text" id="rq-link" placeholder="แนบลิงก์เอกสาร (ถ้ามี) / Document link (optional)" data-ai-link style="flex:1.2 1 170px;">';
        html += '  <button type="button" class="submit" data-ai-submit>+ ส่งคำขอ <span class="en-i">· Send request</span></button>';
        html += '  <span class="hint" data-sun-hint>ใส่วันที่ต้องการให้เซ็น ระบบจะเช็คให้ว่าวันนั้นซันเข้าออฟฟิศหรือไม่ · ต้องกรอกชื่อผู้ขอ<span class="en">Enter the date you need the signature; the system checks whether Sun is in the office that day · Requester name is required</span></span>';
        html += '</div>';
        var reqB = bucketActionItems(p.key, function(t){ return !!t.requester; }, true);
        html += bucketsBlock(reqB, biI('คำขอทั้งหมด เรียงตามวันที่','All requests, by date'));

        html += sectionHead('Task', false, false);
        html += taskFormHtml();
        html += filterBarHtml();
        var selfB = bucketActionItems(p.key, function(t){ return !t.requester && passFilter(t); }, false);
        html += bucketsBlock(selfB, 'Task ในเดือน '+monthLabel(currentMonth)+' <span class="en-i">· Tasks in '+enMonth(currentMonth)+'</span>');
      } else {
        html += sectionHead('Task', true, true);
        html += taskFormHtml();
        html += filterBarHtml();
        var myB = bucketActionItems(p.key, passFilter, false);
        html += bucketsBlock(myB, 'Task ในเดือน '+monthLabel(currentMonth)+' <span class="en-i">· Tasks in '+enMonth(currentMonth)+'</span>');
      }

      // ---- JD: collapsed until clicked ----
      var hasJd = tasksFor(p.key).length + hiddenTasksFor(p.key).length > 0;
      if(hasJd){
      html += '<details data-jd-details'+(jdOpen[p.key]===true?' open':'')+' style="margin-top:8px;">';
      html += '  <summary class="section-title" style="cursor:pointer; user-select:none; display:inline-block;">หน้าที่หลักตามตำแหน่ง (JD) <span class="en-i">· Core duties by position (job description)</span></summary>';
      html += '  <div class="freq-filter">';
      html += '    <button class="chip'+(curFilter==='all'?' active':'')+'" data-freq="all">'+biI('ทั้งหมด','All')+'</button>';
      freqsPresent.forEach(function(f){
        html += '    <button class="chip'+(curFilter===f?' active':'')+'" data-freq="'+f+'">'+biI(FREQ_LABEL[f], FREQ_EN[f])+'</button>';
      });
      html += '  </div>';
      Object.keys(groups).forEach(function(gname){
        var items = groups[gname].filter(function(t){ return curFilter==='all' || t.freq===curFilter; });
        if(!items.length) return;
        html += '  <div class="group"><h3>'+bi(gname)+'</h3>';
        items.forEach(function(t){
          html += '  <div class="task">';
          html += '    <span class="txt">'+t.text+'<span class="badge '+t.freq+'">'+freqLabel(t.freq)+'</span>'+(enOf(t.text) ? '<span class="en">'+escHtml(enOf(t.text))+'</span>' : '')+'</span>';
          html += '    <button type="button" class="del" data-hide="'+t.id+'" title="เอางานนี้ออกจากลิสต์ / Remove this duty from the list">✕</button>';
          html += '  </div>';
        });
        html += '  </div>';
      });
      var hiddenList = hiddenTasksFor(p.key);
      if(hiddenList.length){
        html += '  <div class="group"><h3>ซ่อนไว้ ('+hiddenList.length+')<span class="en">Hidden ('+hiddenList.length+')</span></h3>';
        hiddenList.forEach(function(t){
          html += '  <label class="task" style="opacity:.6;">';
          html += '    <span class="txt">'+t.text+'<span class="badge '+t.freq+'">'+freqLabel(t.freq)+'</span>'+(enOf(t.text) ? '<span class="en">'+escHtml(enOf(t.text))+'</span>' : '')+'</span>';
          html += '    <button type="button" class="del" data-restore="'+t.id+'" title="กู้คืนงานนี้ / Restore this duty">↺ กู้คืน <span class="en-i">· Restore</span></button>';
          html += '  </label>';
        });
        html += '  </div>';
      }
      html += '</details>';
      }

      sec.innerHTML = html;
      host.appendChild(sec);

      var jdDetails = sec.querySelector('[data-jd-details]');
      if(jdDetails){
        jdDetails.addEventListener('toggle', function(){ jdOpen[p.key] = jdDetails.open; });
      }

      // ---- Sun's request form ----
      var reqForm = sec.querySelector('[data-form="req"]');
      if(reqForm){
        var rBtn = reqForm.querySelector('[data-ai-submit]');
        var rDue = reqForm.querySelector('[data-sun-due]');
        var rHint = reqForm.querySelector('[data-sun-hint]');
        var rHintDefault = rHint ? rHint.innerHTML : '';
        var refreshSunConflictState = function(){
          if(!rDue || !rBtn) return;
          if(isSunAway(rDue.value)){
            rBtn.disabled = true;
            if(rHint){ rHint.innerHTML = '⚠️ วันที่ '+fmtDue(rDue.value)+' ซันไม่เข้าออฟฟิศ — เลือกวันอื่นก่อนส่งคำขอ<span class="en" style="color:inherit;">Sun is not in the office on '+enDue(rDue.value)+' — pick another day before sending the request</span>'; rHint.style.color = 'var(--danger)'; }
          } else {
            rBtn.disabled = false;
            if(rHint){ rHint.innerHTML = rHintDefault; rHint.style.color = ''; }
          }
        };
        refreshSunConflictState();
        rDue.addEventListener('change', refreshSunConflictState);
        rBtn.addEventListener('click', function(){
          var txtEl = reqForm.querySelector('[data-ai-text]');
          var linkEl = reqForm.querySelector('[data-ai-link]');
          var whoEl = reqForm.querySelector('[data-ai-requester]');
          if(isSunAway(rDue.value)){ refreshSunConflictState(); return; }
          if(!whoEl.value.trim()){ whoEl.style.borderColor = 'var(--danger)'; whoEl.focus(); return; }
          addActionItem(p.key, txtEl.value, rDue.value, linkEl.value, '', whoEl.value);
          txtEl.value = ''; linkEl.value = ''; whoEl.value = ''; whoEl.style.borderColor = '';
        });
        reqForm.querySelector('[data-ai-text]').addEventListener('keydown', function(e){
          if(e.key==='Enter'){ e.preventDefault(); rBtn.click(); }
        });
      }

      // ---- Task form ----
      var tForm = sec.querySelector('[data-form="task"]');
      if(tForm){
        var draft = taskDraft[p.key] = taskDraft[p.key] || {text:'', due:'', type:'office', with:[]};
        var tText = tForm.querySelector('[data-ai-text]');
        var tDue = tForm.querySelector('[data-ai-due]');
        var tType = tForm.querySelector('[data-ai-type]');
        tText.addEventListener('input', function(){ draft.text = tText.value; });
        tDue.addEventListener('change', function(){ draft.due = tDue.value; });
        tType.addEventListener('change', function(){ draft.type = tType.value; });
        tForm.querySelectorAll('[data-with]').forEach(function(btn){
          btn.addEventListener('click', function(){
            var k = btn.getAttribute('data-with');
            var i = draft.with.indexOf(k);
            if(i>=0) draft.with.splice(i,1); else draft.with.push(k);
            draft.text = tText.value; draft.due = tDue.value; draft.type = tType.value;
            renderAll();
          });
        });
        var submitTask = function(){
          var text = tText.value.trim();
          if(!text){ tText.focus(); return; }
          addActionItem(p.key, text, tDue.value, '', '', '', {type:tType.value, with:draft.with.slice()});
          taskDraft[p.key] = {text:'', due:'', type:tType.value, with:[]};
          tText.value = '';
          renderAll();
        };
        tForm.querySelector('[data-ai-submit]').addEventListener('click', submitTask);
        tText.addEventListener('keydown', function(e){
          if(e.key==='Enter'){ e.preventDefault(); submitTask(); }
        });
      }

      sec.querySelectorAll('[data-tfilter-open]').forEach(function(btn){
        btn.addEventListener('click', function(){ tf.open = btn.getAttribute('data-tfilter-open')==='1'; renderAll(); });
      });
      sec.querySelectorAll('[data-tfilter-type]').forEach(function(btn){
        btn.addEventListener('click', function(){ tf.type = btn.getAttribute('data-tfilter-type'); renderAll(); });
      });

      // ---- task rows ----
      sec.querySelectorAll('.trow').forEach(function(row){
        var id = row.getAttribute('data-task-open');
        row.addEventListener('click', function(e){
          if(e.target.closest('.tcheck, a')) return;
          openTaskModal(id);
        });
        row.addEventListener('keydown', function(e){
          if(e.target!==row) return;
          if(e.key==='Enter' || e.key===' '){ e.preventDefault(); openTaskModal(id); }
        });
      });
      sec.querySelectorAll('[data-ai-id]').forEach(function(cb){
        cb.addEventListener('change', function(){
          var item = findAction(cb.getAttribute('data-ai-id'));
          if(item) toggleActionDone(item, cb.checked);
        });
      });
      sec.querySelectorAll('[data-hide]').forEach(function(btn){
        btn.addEventListener('click', function(e){ e.preventDefault(); hideTask(p.key, btn.getAttribute('data-hide')); });
      });
      sec.querySelectorAll('[data-restore]').forEach(function(btn){
        btn.addEventListener('click', function(e){ e.preventDefault(); restoreTask(p.key, btn.getAttribute('data-restore')); });
      });
      sec.querySelectorAll('[data-month-act]').forEach(function(btn){
        btn.addEventListener('click', function(){ goToMonth(btn.getAttribute('data-month-act')); });
      });
      sec.querySelectorAll('[data-sun-day]').forEach(function(td){
        td.addEventListener('click', function(){ cycleSunOffice(td.getAttribute('data-sun-day')); });
      });
      sec.querySelectorAll('[data-freq]').forEach(function(btn){
        btn.addEventListener('click', function(){ activeFreq[p.key] = btn.getAttribute('data-freq'); renderAll(); });
      });
    });
  }

  // ---------- task detail modal ----------
  var tm = null; // {id, w:{...working copy}, confirmDel}
  function findAction(id){
    for(var i=0;i<ACTION_ITEMS.length;i++){ if(ACTION_ITEMS[i].id===id) return ACTION_ITEMS[i]; }
    return null;
  }
  function personChip(q, on, onClick){
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'resp-chip'+(on ? ' on' : '');
    if(on){ b.style.background = q.color; b.style.borderColor = q.color; b.style.color = '#fff'; }
    else { b.style.borderColor = q.color; b.style.color = q.color; }
    b.innerHTML = nameBi(q);
    b.setAttribute('aria-pressed', on ? 'true' : 'false');
    b.addEventListener('click', onClick);
    return b;
  }
  function optChip(label, cls, on, onClick){ // label may carry an English subtitle (HTML)
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'att-chip'+(on ? ' on '+cls : '');
    b.innerHTML = label;
    b.setAttribute('aria-pressed', on ? 'true' : 'false');
    b.addEventListener('click', onClick);
    return b;
  }
  function renderTaskModal(){
    var w = tm.w;
    var types = document.getElementById('tmTypes'); types.innerHTML = '';
    TASK_TYPES.forEach(function(ty){
      types.appendChild(optChip(tl(ty), 'tp-'+ty.k, w.type===ty.k, function(){ w.type = (w.type===ty.k ? '' : ty.k); renderTaskModal(); }));
    });
    var stat = document.getElementById('tmStatus'); stat.innerHTML = '';
    TASK_STATUS.forEach(function(st){
      stat.appendChild(optChip(tl(st), 'ts-'+st.k, w.status===st.k, function(){ w.status = st.k; renderTaskModal(); }));
    });
    var owner = document.getElementById('tmOwner'); owner.innerHTML = '';
    PEOPLE.forEach(function(q){
      owner.appendChild(personChip(q, w.p===q.key, function(){
        w.p = q.key;
        w.with = w.with.filter(function(k){ return k!==q.key; });
        renderTaskModal();
      }));
    });
    var wth = document.getElementById('tmWith'); wth.innerHTML = '';
    PEOPLE.forEach(function(q){
      if(q.key===w.p) return;
      var on = w.with.indexOf(q.key)>=0;
      wth.appendChild(personChip(q, on, function(){
        var i = w.with.indexOf(q.key);
        if(i>=0) w.with.splice(i,1); else w.with.push(q.key);
        renderTaskModal();
      }));
    });
    var subs = document.getElementById('tmSubs'); subs.innerHTML = '';
    w.subtasks.forEach(function(sb, i){
      var row = document.createElement('div'); row.className = 'tm-sub';
      var cb = document.createElement('input'); cb.type = 'checkbox'; cb.checked = !!sb.d; cb.setAttribute('aria-label','ทำแล้ว / Done');
      cb.addEventListener('change', function(){ sb.d = cb.checked; });
      var tx = document.createElement('input'); tx.type = 'text'; tx.className = 'att-input'; tx.value = sb.t;
      tx.addEventListener('input', function(){ sb.t = tx.value; });
      var del = document.createElement('button'); del.type = 'button'; del.textContent = '✕'; del.setAttribute('aria-label','ลบขั้นตอน / Remove step');
      del.addEventListener('click', function(){ w.subtasks.splice(i,1); renderTaskModal(); });
      row.appendChild(cb); row.appendChild(tx); row.appendChild(del);
      subs.appendChild(row);
    });
    var delBtn = document.getElementById('tmDelete');
    delBtn.innerHTML = tm.confirmDel ? biI('ยืนยันลบ Task นี้','Confirm delete') : biI('ลบ Task','Delete task');
    delBtn.className = 'att-btn'+(tm.confirmDel ? ' danger' : '');
  }
  function openTaskModal(id){
    var t = findAction(id);
    if(!t) return;
    tm = {id:id, confirmDel:false, w:{
      p:t.p, type:t.type||'', status:taskStatusOf(t), with:(t.with||[]).slice(),
      subtasks:(t.subtasks||[]).map(function(x){ return {t:x.t, d:!!x.d}; })
    }};
    document.getElementById('tmText').value = t.text;
    document.getElementById('tmDue').value = t.due || '';
    document.getElementById('tmLink').value = t.link || '';
    document.getElementById('tmNote').value = t.note || '';
    document.getElementById('tmSubText').value = '';
    var meta = [];
    if(t.createdAt){ var ci = isoDate(new Date(t.createdAt)); meta.push('สร้างเมื่อ '+fmtDue(ci)+' <span class="en-i">(created '+enDue(ci)+')</span>'); }
    if(t.done && t.doneAt){ var di = isoDate(new Date(t.doneAt)); meta.push('เสร็จเมื่อ '+fmtDue(di)+' <span class="en-i">(done '+enDue(di)+')</span>'); }
    if(t.requester) meta.push('ขอโดย '+escHtml(t.requester)+' <span class="en-i">(requested by)</span>');
    document.getElementById('tmMeta').innerHTML = meta.join(' · ');
    renderTaskModal();
    document.getElementById('tmBackdrop').classList.add('open');
  }
  function closeTaskModal(){
    document.getElementById('tmBackdrop').classList.remove('open');
    tm = null;
  }
  function saveTaskModal(){
    if(!tm) return;
    var t = findAction(tm.id);
    if(!t){ closeTaskModal(); return; }
    var w = tm.w;
    var text = document.getElementById('tmText').value.trim();
    if(!text){ document.getElementById('tmText').focus(); return; }
    var done = w.status==='done';
    var body = {
      p:w.p, text:text, type:w.type, due:document.getElementById('tmDue').value, status:w.status, done:done,
      with:w.with.filter(function(k){ return k!==w.p; }),
      subtasks:w.subtasks.filter(function(x){ return String(x.t||'').trim(); }).map(function(x){ return {t:x.t.trim(), d:!!x.d}; }),
      link:document.getElementById('tmLink').value.trim(), note:document.getElementById('tmNote').value.trim(),
      doneAt: done ? (t.doneAt || Date.now()) : 0, updatedAt:Date.now()
    };
    Object.keys(body).forEach(function(k){ t[k] = body[k]; }); // optimistic
    if(db && t.id.indexOf('local')!==0){
      db.collection('actionItems').doc(t.id).update(body).catch(function(e){ console.warn('task save failed', e); });
    }
    closeTaskModal();
    renderAll();
  }
  function bindTaskModal(){
    document.getElementById('tmClose').addEventListener('click', closeTaskModal);
    document.getElementById('tmCancel').addEventListener('click', closeTaskModal);
    document.getElementById('tmBackdrop').addEventListener('click', function(e){
      if(e.target === e.currentTarget) closeTaskModal();
    });
    document.getElementById('tmSave').addEventListener('click', saveTaskModal);
    document.getElementById('tmDelete').addEventListener('click', function(){
      if(!tm) return;
      if(!tm.confirmDel){ tm.confirmDel = true; renderTaskModal(); return; }
      var id = tm.id;
      closeTaskModal();
      deleteActionItem(id);
    });
    function addSub(){
      if(!tm) return;
      var el = document.getElementById('tmSubText');
      var v = el.value.trim();
      if(!v) return;
      tm.w.subtasks.push({t:v, d:false});
      el.value = '';
      renderTaskModal();
      el.focus();
    }
    document.getElementById('tmSubAdd').addEventListener('click', addSub);
    document.getElementById('tmSubText').addEventListener('keydown', function(e){
      if(e.key==='Enter'){ e.preventDefault(); addSub(); }
    });
    document.addEventListener('keydown', function(e){
      if(e.key==='Escape') closeTaskModal();
    });
  }

  // ---------- calendar: static whiteboard transcription (Sept 2026 only) + dynamic added events ----------
  var CAL_STATIC = {
    '2026-09': {
      1:[{tag:true,t:'จัดบูธ Decathlon 11:00 น.'}],
      2:[{tag:true,t:'Demo Jubili 14:00 น.'}],
      6:[{t:'คอร์ส/Academy — งานการเงิน'},{t:'Decathlon บางนา'},{t:'Wink Clinic'}],
      9:[{t:'ไปตลาด'}],
      16:[{t:'ประชุมทีม 11:00 น.'},{t:'ปิดยอด PL 13:00 น.'}],
      17:[{t:'ประชุมแผนก'}],
      19:[{tag:true,t:'วิ่ง Decathlon Thailand (~1,500 คนทั่วประเทศ)'}],
      21:[{t:'อัปเดต/Assign งาน โดย พลอย'}],
      23:[{tag:true,t:'Thai Miss — ทีม K.Sun'}],
      24:[{tag:true,t:'Thai Miss — ทีม K.Sun'}],
      25:[{tag:true,t:'Thai Miss'}],
      26:[{tag:true,t:'Thai Miss'},{t:'Grace — 4EC'}],
      28:[{t:'ประชุม / Assign งาน'}],
      29:[{t:'นัดหมาย (โปรดตรวจสอบ)'}]
    }
  };

  function daysInMonthOf(mk){
    var parts = mk.split('-'); var y = parseInt(parts[0],10), m = parseInt(parts[1],10);
    return new Date(y, m, 0).getDate();
  }
  function firstWeekdayOf(mk){
    var parts = mk.split('-'); var y = parseInt(parts[0],10), m = parseInt(parts[1],10)-1;
    return new Date(y, m, 1).getDay(); // 0=Sun
  }

  var EV_WHERE = [{k:'office', label:'ใน office', en:'In the office', cls:'st-in'}, {k:'outside', label:'นอกสถานที่', en:'Off-site', cls:'st-out'}];
  var calView = 'list';
  var calFilter = {where:'', person:''};
  var calDraft = {text:'', date:'', time:'', where:'', place:'', type:'', with:[], tag:false};
  function newDocId(){ return 'e'+Date.now().toString(36)+Math.random().toString(36).slice(2,8); }

  // iso = 'YYYY-MM-DD'; meta = {time, where, place, type, with}
  function addCalEvent(iso, text, tag, meta){
    text = (text||'').trim();
    if(!text || !iso) return;
    meta = meta || {};
    var mk = iso.slice(0,7), day = parseInt(iso.slice(8,10),10);
    var id = db ? newDocId() : 'local'+(calLocalSeq++);
    var doc = {month:mk, day:day, text:text, tag:!!tag, createdAt:Date.now()};
    var metaBody = {responsible:[], with:(meta.with||[]).slice(), where:meta.where||'', place:(meta.place||'').trim(),
                    time:meta.time||'', type:meta.type||'', due:'', note:'', updatedAt:Date.now()};
    if(db){
      db.collection('calEvents').doc(id).set(doc).catch(function(e){ console.warn('add event failed', e); });
      db.collection('eventMeta').doc('dyn__'+id).set(metaBody).catch(function(e){ console.warn('add event meta failed', e); });
    }
    var arr = CAL_CUSTOM_CACHE[mk] = CAL_CUSTOM_CACHE[mk] || [];
    if(!arr.some(function(x){ return x.id===id; })) arr.push({id:id, day:day, text:text, tag:!!tag});
    ALL_DYN_EVENTS[id] = {month:mk, day:day, text:text, tag:!!tag};
    EVENT_META_CACHE['dyn__'+id] = metaBody;
    renderAll();
  }
  function deleteCalEvent(mk, id){
    if(db && id.indexOf('local')!==0){
      db.collection('calEvents').doc(id).delete().catch(function(e){ console.warn('delete event failed', e); });
      db.collection('eventMeta').doc('dyn__'+id).delete().catch(function(e){ console.warn('delete event meta failed', e); });
    }
    CAL_CUSTOM_CACHE[mk] = (CAL_CUSTOM_CACHE[mk]||[]).filter(function(e){ return e.id!==id; });
    delete ALL_DYN_EVENTS[id];
    delete EVENT_META_CACHE['dyn__'+id];
    renderAll();
  }
  function loadCalEvents(mk){
    if(!db) return;
    if(calUnsub){ calUnsub(); calUnsub = null; }
    calUnsub = db.collection('calEvents').where('month','==',mk).onSnapshot(function(snap){
      CAL_CUSTOM_CACHE[mk] = snap.docs.map(function(doc){
        var d = doc.data() || {};
        return {id:doc.id, day:d.day, text:d.text||'', tag:!!d.tag};
      });
      if(currentMonth===mk) renderAll();
    }, function(err){ console.warn('calEvents error', err); });
  }

  // everyone involved in an event: responsible people first, then the rest of the group
  function evPeopleKeys(m){
    var r = m.responsible || [], w = m.with || [];
    return r.concat(w.filter(function(k){ return r.indexOf(k)<0; })).filter(function(k){ return !!personByKey(k); });
  }
  function monthEvents(){
    var out = [];
    var staticEvs = CAL_STATIC[currentMonth] || {};
    Object.keys(staticEvs).forEach(function(day){
      staticEvs[day].forEach(function(e, idx){
        out.push({key:'static__'+currentMonth+'__'+day+'__'+idx, day:parseInt(day,10), text:e.t, tag:!!e.tag});
      });
    });
    (CAL_CUSTOM_CACHE[currentMonth] || []).forEach(function(e){
      out.push({key:'dyn__'+e.id, day:e.day, text:e.text, tag:!!e.tag});
    });
    out.forEach(function(e){ e.iso = currentMonth+'-'+pad2(e.day); e.meta = EVENT_META_CACHE[e.key] || {}; });
    out.sort(function(a,b){
      if(a.day!==b.day) return a.day-b.day;
      return String(a.meta.time||'').localeCompare(String(b.meta.time||''));
    });
    return out;
  }
  function evPassFilter(e){
    if(calFilter.where && e.meta.where!==calFilter.where) return false;
    if(calFilter.person && evPeopleKeys(e.meta).indexOf(calFilter.person)<0) return false;
    return true;
  }
  function evLocHtml(m){
    var label = m.where==='office' ? 'ใน office' : (m.where==='outside' ? 'นอกสถานที่' : '');
    var lblEn = m.where==='office' ? 'In the office' : (m.where==='outside' ? 'Off-site' : '');
    var cls = m.where==='office' ? ' in' : (m.where==='outside' ? ' out' : '');
    var place = String(m.place||'').trim();
    if(!label && !place) return '';
    var placeEn = enOf(place);
    return '<span class="evloc'+cls+'">'+escHtml(label ? label+(place ? ' · '+place : '') : place)+
      ((lblEn || placeEn) ? ' <span class="en-i">· '+escHtml([lblEn, placeEn].filter(function(x){ return x; }).join(' · '))+'</span>' : '')+'</span>';
  }
  function evPeopleHtml(m){
    var ks = evPeopleKeys(m);
    if(!ks.length) return '';
    var r = m.responsible || [];
    return '<span class="evppl">'+ks.map(function(k){
      var q = personByKey(k);
      return '<span'+(r.indexOf(k)>=0 ? ' class="lead"' : '')+'><i style="background:'+q.color+';"></i>'+nameBi(q)+'</span>';
    }).join('')+'</span>';
  }
  function evAttrs(e){
    return 'data-ev-key="'+e.key+'" data-ev-label="'+escAttr(e.text)+'" data-ev-date="'+e.iso+'"';
  }
  function evRowHtml(e){
    var m = e.meta;
    var h = '<div class="evrow'+(m.where ? ' wh-'+m.where : '')+'" '+evAttrs(e)+' tabindex="0" role="button">';
    h += '<div class="evtime">'+(m.time ? escHtml(m.time) : bi('ทั้งวัน', false, 'All day'))+'</div>';
    h += '<div style="min-width:0;"><div class="evtitle">'+bi(e.text, true)+'</div><div class="evmeta">';
    if(e.tag) h += '<span class="tbadge hl">'+biI('สำคัญ','Important')+'</span>';
    if(m.type){ var ty = taskType(m.type); h += '<span class="tchip tp-'+ty.k+'">'+tl(ty)+'</span>'; }
    h += evLocHtml(m) || '<span class="evnone">'+biI('ยังไม่ระบุสถานที่','No place set')+'</span>';
    h += evPeopleHtml(m) || '<span class="evnone">'+biI('ยังไม่ระบุคนไป','No one assigned yet')+'</span>';
    h += '</div></div></div>';
    return h;
  }
  // ---------- staff entries on the company calendar ----------
  var calShowStaff = true;
  try{ calShowStaff = localStorage.getItem('gg_cal_staff')!=='0'; }catch(e){}
  function staffByDay(){
    var out = {};
    if(!calShowStaff || calFilter.where) return out;
    var mk = currentMonth, who = calFilter.person;
    function push(day, it){ (out[day] = out[day] || []).push(it); }
    ACTION_ITEMS.forEach(function(t){
      if((t.due||'').slice(0,7)!==mk || t.evKey) return; // calendar-born tasks already show as the event itself
      if(who && t.p!==who && (t.with||[]).indexOf(who)<0) return;
      if(!personByKey(t.p)) return;
      push(parseInt(t.due.slice(8,10),10), {kind:'task', t:t});
    });
    Object.keys(ATTEND).forEach(function(id){
      var a = ATTEND[id];
      if(!a || (a.date||'').slice(0,7)!==mk || a.status==='in') return;
      if(who && a.p!==who) return;
      if(!personByKey(a.p)) return;
      push(parseInt(a.date.slice(8,10),10), {kind:'att', a:a});
    });
    Object.keys(SUN_OFFICE).forEach(function(iso){
      if(iso.slice(0,7)!==mk || (who && who!=='sun') || attGet(iso,'sun')) return;
      push(parseInt(iso.slice(8,10),10), {kind:'sun', iso:iso, st:SUN_OFFICE[iso]});
    });
    return out;
  }
  function staffRowHtml(it){
    var h = '', q;
    if(it.kind==='task'){
      var t = it.t; q = personByKey(t.p);
      h += '<div class="srow'+(t.done ? ' done' : '')+'" data-staff-task="'+escAttr(t.id)+'" tabindex="0" role="button">';
      h += '<i style="background:'+q.color+';"></i><span class="s-who" style="color:'+q.color+';">'+nameBi(q)+'</span>';
      h += '<span class="s-txt">'+bi(t.text, true)+'</span>';
      h += '<span class="tbadge">'+(t.requester ? biI('คำขอเซ็น/อนุมัติ','Sign/approve request') : biI('งานพนักงาน','Staff task'))+(t.done ? ' ✓' : '')+'</span>';
      return h+'</div>';
    }
    if(it.kind==='att'){
      var a = it.a, st = attStatus(a.status); q = personByKey(a.p);
      h += '<div class="srow" data-staff-att="'+a.p+'|'+a.date+'" tabindex="0" role="button">';
      h += '<i style="background:'+q.color+';"></i><span class="s-who" style="color:'+q.color+';">'+nameBi(q)+'</span>';
      h += '<span class="att-pill st-'+st.k+'">'+tl(st)+'</span>'+(a.note ? '<span class="s-txt">'+escHtml(a.note)+'</span>' : '');
      return h+'</div>';
    }
    q = personByKey('sun');
    h += '<div class="srow" data-staff-sun tabindex="0" role="button"><i style="background:'+(q ? q.color : '#999')+';"></i>';
    h += '<span class="s-txt">'+(it.st==='in' ? biI('ซันเข้าออฟฟิศ','Sun in the office') : biI('ซันไม่เข้าออฟฟิศ','Sun out of the office'))+'</span>';
    return h+'</div>';
  }
  function staffChipHtml(it){
    var q, label, attr;
    if(it.kind==='task'){ q = personByKey(it.t.p); label = escHtml(it.t.text)+(it.t.done ? ' ✓' : ''); attr = 'data-staff-task="'+escAttr(it.t.id)+'"'; }
    else if(it.kind==='att'){ var st = attStatus(it.a.status); q = personByKey(it.a.p); label = q.name+' · '+st.label+'<span class="en">'+(enOf(q.name)||q.name)+' · '+st.en+'</span>'; attr = 'data-staff-att="'+it.a.p+'|'+it.a.date+'"'; }
    else { q = personByKey('sun'); label = (it.st==='in' ? 'ซันเข้าออฟฟิศ<span class="en">Sun in office</span>' : 'ซันไม่เข้าออฟฟิศ<span class="en">Sun out of office</span>'); attr = 'data-staff-sun'; }
    return '<button type="button" class="schip'+(it.kind==='task' && it.t.done ? ' done' : '')+'" '+attr+' style="border-left-color:'+(q ? q.color : '#999')+';">'+label+'</button>';
  }
  function bindStaffItems(host){
    host.querySelectorAll('[data-staff-task],[data-staff-att],[data-staff-sun]').forEach(function(el){
      function open(){
        if(el.hasAttribute('data-staff-task')) openTaskModal(el.getAttribute('data-staff-task'));
        else if(el.hasAttribute('data-staff-att')){ var pr = el.getAttribute('data-staff-att').split('|'); openAttModal(pr[0], pr[1]); }
        else { activeTab = 'sun'; renderAll(); }
      }
      el.addEventListener('click', open);
      el.addEventListener('keydown', function(e){ if(e.key==='Enter' || e.key===' '){ e.preventDefault(); open(); } });
    });
  }

  function calListHtml(shown, total){
    var staff = staffByDay();
    if(!shown.length && !Object.keys(staff).length){
      return '<p class="note-line">'+(total ? bi('ไม่มีกิจกรรมตรงกับตัวกรอง', false, 'No events match the filter') : bi('ยังไม่มีกิจกรรมในเดือนนี้ เพิ่มจากฟอร์มด้านบนได้เลย', false, 'No events this month yet — add one with the form above'))+'</p>';
    }
    var mp = currentMonth.split('-'); var my = parseInt(mp[0],10), mm = parseInt(mp[1],10);
    var byDay = {};
    shown.forEach(function(e){ (byDay[e.day] = byDay[e.day] || []).push(e); });
    Object.keys(staff).forEach(function(d){ byDay[d] = byDay[d] || []; });
    var h = '';
    Object.keys(byDay).map(Number).sort(function(a,b){ return a-b; }).forEach(function(day){
      var iso = currentMonth+'-'+pad2(day);
      var dow = new Date(my, mm-1, day).getDay();
      var isToday = iso===TODAY_ISO;
      h += '<div class="evday'+(isToday ? ' today' : '')+'">'+WD_SHORT[dow]+' '+day+' '+THAI_MONTHS_SHORT[mm-1]+'<small>'+(isToday ? 'วันนี้' : 'วัน'+WD_LONG[dow])+'</small><span class="en-i">'+(isToday ? 'Today · ' : '')+WD_EN_LONG[dow]+' '+day+' '+EN_MONTHS_SHORT[mm-1]+'</span></div>';
      byDay[day].forEach(function(e){ h += evRowHtml(e); });
      (staff[day] || []).forEach(function(it){ h += staffRowHtml(it); });
    });
    h += '<p class="note-line" style="margin-top:14px;">'+bi('ตัวหนา = ผู้รับผิดชอบ · กดที่กิจกรรมเพื่อเพิ่มรายละเอียด สถานที่ และคนที่ไปด้วย', false, 'Bold = responsible · Tap an event to add details, place and who is going')+'</p>';
    return h;
  }
  function calGridHtml(shown){
    var mp = currentMonth.split('-'); var my = parseInt(mp[0],10), mm = parseInt(mp[1],10);
    var firstWeekday = firstWeekdayOf(currentMonth), dim = daysInMonthOf(currentMonth);
    var staff = staffByDay();
    var cells = [];
    for(var i=0;i<firstWeekday;i++) cells.push(null);
    for(var d=1; d<=dim; d++) cells.push(d);
    while(cells.length % 7 !== 0) cells.push(null);
    var h = '<div class="cal-wrap"><table class="cal"><thead><tr><th>อา<span class="en">Sun</span></th><th>จ<span class="en">Mon</span></th><th>อ<span class="en">Tue</span></th><th>พ<span class="en">Wed</span></th><th>พฤ<span class="en">Thu</span></th><th>ศ<span class="en">Fri</span></th><th>ส<span class="en">Sat</span></th></tr></thead><tbody>';
    for(var r=0; r<cells.length/7; r++){
      h += '<tr>';
      for(var c=0; c<7; c++){
        var day = cells[r*7+c];
        if(day===null){ h += '<td class="blank"></td>'; continue; }
        var iso = currentMonth+'-'+pad2(day);
        h += '<td'+(iso===TODAY_ISO ? ' class="today"' : '')+'><span class="d">'+day+'</span>';
        shown.filter(function(e){ return e.day===day; }).forEach(function(e){
          var m = e.meta;
          var ks = evPeopleKeys(m);
          h += '<button type="button" class="evchip'+(m.where ? ' wh-'+m.where : '')+(e.tag ? ' tag' : '')+'" '+evAttrs(e)+'>';
          h += (m.time ? '<b>'+escHtml(m.time)+'</b>' : '')+bi(e.text, true);
          if(m.where || ks.length){
            h += '<span class="evm">';
            if(m.where) h += '<span class="'+(m.where==='office' ? 'in' : 'out')+'">'+(m.where==='office' ? 'office' : 'นอกสถานที่ · off-site')+'</span>';
            ks.forEach(function(k){ var q = personByKey(k); h += '<i style="background:'+q.color+';" title="'+escAttr(biOpt(q.name))+'"></i>'; });
            h += '</span>';
          }
          h += '</button>';
        });
        (staff[day] || []).forEach(function(it){ h += staffChipHtml(it); });
        h += '</td>';
      }
      h += '</tr>';
    }
    h += '</tbody></table></div>';
    return h;
  }
  function calFormHtml(){
    var d = calDraft;
    var dateVal = d.date || (currentMonth===TODAY_ISO.slice(0,7) ? TODAY_ISO : currentMonth+'-01');
    var h = '<div class="tform" data-form="cal">';
    h += '<div class="tform-row">';
    h += '<input type="text" id="cf-text" data-cf-text placeholder="เพิ่มกิจกรรมของบริษัท เช่น จัดบูธ Decathlon / Add a company event, e.g. Decathlon booth" value="'+escAttr(d.text)+'">';
    h += '<input type="date" id="cf-date" data-cf-date value="'+dateVal+'" aria-label="วันที่ / Date">';
    h += '<input type="time" id="cf-time" data-cf-time value="'+escAttr(d.time)+'" aria-label="เวลา / Time">';
    h += '<select id="cf-type" data-cf-type aria-label="ประเภทงาน / Type"><option value="">ประเภทงาน · Type</option>';
    TASK_TYPES.forEach(function(ty){ h += '<option value="'+ty.k+'"'+(ty.k===d.type ? ' selected' : '')+'>'+biOpt(ty.label, ty.en)+'</option>'; });
    h += '</select>';
    h += '<button type="button" class="att-btn primary" data-cf-submit>+ เพิ่ม <span class="en-i">· Add</span></button>';
    h += '</div>';
    h += '<div class="tform-row"><span class="tform-lab">'+bi('จัดที่ไหน', false, 'Where')+'</span>';
    EV_WHERE.forEach(function(w){
      h += '<button type="button" class="att-chip'+(d.where===w.k ? ' on '+w.cls : '')+'" data-cf-where="'+w.k+'" aria-pressed="'+(d.where===w.k)+'">'+tl(w)+'</button>';
    });
    h += '<input type="text" id="cf-place" data-cf-place placeholder="ชื่อสถานที่ (ไม่บังคับ) / Place name (optional)" value="'+escAttr(d.place)+'" style="flex:1 1 180px;">';
    h += '</div>';
    h += '<div class="tform-with"><span class="tform-lab">'+bi('ไปด้วย', false, 'Who\'s going')+'</span>';
    PEOPLE.forEach(function(q){
      var on = d.with.indexOf(q.key)>=0;
      h += '<button type="button" class="wchip'+(on ? ' on' : '')+'" data-cf-with="'+q.key+'" style="border-color:'+q.color+';'+(on ? 'background:'+q.color+';' : 'color:'+q.color+';')+'">'+nameBi(q)+'</button>';
    });
    h += '<label class="cf-tag"><input type="checkbox" data-cf-tag'+(d.tag ? ' checked' : '')+'> ทำเครื่องหมายว่าสำคัญ <span class="en-i">· Mark as important</span></label>';
    h += '</div></div>';
    return h;
  }

  function renderCalendar(){
    var host = document.getElementById('panel-calendar');
    if(!host) return;
    var evs = monthEvents();
    var shown = evs.filter(evPassFilter);
    var html = '';

    html += '<div class="cal-bar">';
    html += '  <div class="month-nav">';
    html += '    <button type="button" data-cal-act="prev" aria-label="เดือนก่อนหน้า / Previous month">‹</button>';
    html += '    <div class="label">'+bi(monthLabel(currentMonth), false, enMonth(currentMonth))+'</div>';
    html += '    <button type="button" data-cal-act="next" aria-label="เดือนถัดไป / Next month">›</button>';
    html += '    <button type="button" class="today-btn" data-cal-act="today">'+biI('เดือนนี้','This month')+'</button>';
    html += '  </div>';
    html += '  <div class="seg"><button type="button" data-cal-view="list" class="'+(calView==='list' ? 'active' : '')+'">'+biI('รายการ','List')+'</button>';
    html += '  <button type="button" data-cal-view="grid" class="'+(calView==='grid' ? 'active' : '')+'">'+biI('ตารางเดือน','Month grid')+'</button></div>';
    html += '</div>';

    html += calFormHtml();

    html += '<div class="tfilter">';
    html += '<button type="button" class="chip'+(!calFilter.where ? ' active' : '')+'" data-cal-fwhere="">'+biI('ทุกที่','Everywhere')+'</button>';
    EV_WHERE.forEach(function(w){
      html += '<button type="button" class="chip'+(calFilter.where===w.k ? ' active' : '')+'" data-cal-fwhere="'+w.k+'">'+tl(w)+'</button>';
    });
    html += '<span class="tsep"></span>';
    html += '<button type="button" class="chip'+(!calFilter.person ? ' active' : '')+'" data-cal-fperson="">'+biI('ทุกคน','Everyone')+'</button>';
    PEOPLE.forEach(function(q){
      html += '<button type="button" class="chip'+(calFilter.person===q.key ? ' active' : '')+'" data-cal-fperson="'+q.key+'">'+nameBi(q)+'</button>';
    });
    html += '<span class="tsep"></span>';
    html += '<button type="button" class="chip'+(calShowStaff ? ' active' : '')+'" data-cal-staff>'+(calShowStaff ? '✓ ' : '')+biI('แสดง Task และวันลาของพนักงาน','Show staff tasks & leave')+'</button>';
    html += '</div>';

    html += calView==='grid' ? calGridHtml(shown) : calListHtml(shown, evs.length);
    host.innerHTML = html;

    host.querySelectorAll('[data-cal-act]').forEach(function(btn){
      btn.addEventListener('click', function(){ goToMonth(btn.getAttribute('data-cal-act')); });
    });
    host.querySelectorAll('[data-cal-staff]').forEach(function(btn){
      btn.addEventListener('click', function(){
        calShowStaff = !calShowStaff;
        try{ localStorage.setItem('gg_cal_staff', calShowStaff ? '1' : '0'); }catch(e){}
        renderAll();
      });
    });
    bindStaffItems(host);
    host.querySelectorAll('[data-cal-view]').forEach(function(btn){
      btn.addEventListener('click', function(){ calView = btn.getAttribute('data-cal-view'); renderAll(); });
    });
    host.querySelectorAll('[data-cal-fwhere]').forEach(function(btn){
      btn.addEventListener('click', function(){ calFilter.where = btn.getAttribute('data-cal-fwhere'); renderAll(); });
    });
    host.querySelectorAll('[data-cal-fperson]').forEach(function(btn){
      btn.addEventListener('click', function(){ calFilter.person = btn.getAttribute('data-cal-fperson'); renderAll(); });
    });
    host.querySelectorAll('[data-ev-key]').forEach(function(el){
      function open(){ openEventModal(el.getAttribute('data-ev-key'), el.getAttribute('data-ev-label'), el.getAttribute('data-ev-date')); }
      el.addEventListener('click', open);
      el.addEventListener('keydown', function(e){
        if(e.target!==el) return;
        if(e.key==='Enter' || e.key===' '){ e.preventDefault(); open(); }
      });
    });

    // ---- add-event form (draft survives live re-renders) ----
    var form = host.querySelector('[data-form="cal"]');
    var tx = form.querySelector('[data-cf-text]'), dt = form.querySelector('[data-cf-date]'), tm2 = form.querySelector('[data-cf-time]');
    var ty = form.querySelector('[data-cf-type]'), pl = form.querySelector('[data-cf-place]'), tg = form.querySelector('[data-cf-tag]');
    function syncDraft(){
      calDraft.text = tx.value; calDraft.date = dt.value; calDraft.time = tm2.value;
      calDraft.type = ty.value; calDraft.place = pl.value; calDraft.tag = tg.checked;
    }
    [tx, dt, tm2, ty, pl, tg].forEach(function(el){ el.addEventListener('input', syncDraft); el.addEventListener('change', syncDraft); });
    form.querySelectorAll('[data-cf-where]').forEach(function(btn){
      btn.addEventListener('click', function(){
        syncDraft();
        var k = btn.getAttribute('data-cf-where');
        calDraft.where = (calDraft.where===k ? '' : k);
        renderAll();
      });
    });
    form.querySelectorAll('[data-cf-with]').forEach(function(btn){
      btn.addEventListener('click', function(){
        syncDraft();
        var k = btn.getAttribute('data-cf-with');
        var i = calDraft.with.indexOf(k);
        if(i>=0) calDraft.with.splice(i,1); else calDraft.with.push(k);
        renderAll();
      });
    });
    function submit(){
      syncDraft();
      if(!calDraft.text.trim()){ tx.focus(); return; }
      var iso = calDraft.date || dt.value;
      if(!iso) { dt.focus(); return; }
      if(iso.slice(0,7)!==currentMonth){
        currentMonth = iso.slice(0,7);
        if(db) loadCalEvents(currentMonth);
      }
      addCalEvent(iso, calDraft.text, calDraft.tag, {time:calDraft.time, where:calDraft.where, place:calDraft.place, type:calDraft.type, with:calDraft.with});
      calDraft = {text:'', date:'', time:'', where:'', place:'', type:'', with:[], tag:false};
      renderAll();
    }
    form.querySelector('[data-cf-submit]').addEventListener('click', submit);
    tx.addEventListener('keydown', function(e){ if(e.key==='Enter'){ e.preventDefault(); submit(); } });
  }

  function respDots(key){
    var meta = EVENT_META_CACHE[key];
    if(!meta || !meta.responsible || !meta.responsible.length) return '';
    var out = '<span style="display:inline-flex;gap:2px;margin-right:4px;vertical-align:middle;">';
    meta.responsible.forEach(function(pk){
      var p = personByKey(pk);
      if(!p) return;
      out += '<span style="display:inline-block;width:7px;height:7px;border-radius:99px;background:'+p.color+';" title="'+p.name+'"></span>';
    });
    out += '</span>';
    return out;
  }

  function escAttr(s){
    return String(s||'').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');
  }

  // ---------- attendance: data helpers ----------
  function attStatus(k){
    for(var i=0;i<ATT_STATUS.length;i++){ if(ATT_STATUS[i].k===k) return ATT_STATUS[i]; }
    return {k:'in', label:String(k||''), short:String(k||''), en:'', enShort:'', kind:'present'};
  }
  function attGet(iso, pk){ return ATTEND[iso+'__'+pk] || null; }
  function pad2(n){ return String(n).padStart(2,'0'); }
  function fmtClock(ts){
    var d = new Date(ts);
    return pad2(d.getHours())+':'+pad2(d.getMinutes());
  }
  function fmtLongDate(iso){
    var pr = iso.split('-'); var d = new Date(parseInt(pr[0],10), parseInt(pr[1],10)-1, parseInt(pr[2],10));
    return 'วัน'+WD_LONG[d.getDay()]+'ที่ '+d.getDate()+' '+THAI_MONTHS[d.getMonth()]+' '+(d.getFullYear()+543);
  }

  // Sun is "away" for the request form when attendance says leave/off that day
  // (falls back to the older office calendar if attendance has nothing for that day)
  function isSunAway(iso){
    var a = attGet(iso, 'sun');
    if(a) return attStatus(a.status).kind==='leave';
    return (SUN_OFFICE[iso]||'')==='out';
  }

  function attSet(iso, pk, status, note){
    var id = iso+'__'+pk;
    if(!status){
      delete ATTEND[id];
      if(db) db.collection('attendance').doc(id).delete().catch(function(e){ console.warn('attendance clear failed', e); });
    } else {
      var prev = ATTEND[id];
      var body = {date:iso, p:pk, status:status, note:(note||'').trim(), updatedAt:Date.now()};
      var cin = 0;
      if(status==='in') cin = (prev && prev.checkInAt) || (iso===TODAY_ISO ? Date.now() : 0);
      if(cin) body.checkInAt = cin;
      ATTEND[id] = body; // optimistic
      if(db) db.collection('attendance').doc(id).set(body).catch(function(e){ console.warn('attendance save failed', e); });
    }
    renderAll();
  }

  function attendFromSnap(snap){
    var next = {};
    snap.docs.forEach(function(doc){
      var d = doc.data() || {};
      if(d.status) next[doc.id] = d;
    });
    ATTEND = next;
  }
  function loadAttendance(){
    if(!db) return;
    if(attendUnsub){ attendUnsub(); attendUnsub = null; }
    attendUnsub = db.collection('attendance').onSnapshot(function(snap){
      attendFromSnap(snap);
      renderAll();
    }, function(err){ console.warn('attendance error', err); });
  }

  // ---------- attendance: render ----------
  function renderAttendance(){
    var host = document.getElementById('panel-attendance');
    if(!host) return;
    var prevScroll = host.querySelector('.att-scroll');
    var visible = host.offsetParent !== null; // a hidden panel reports scrollLeft 0, so only trust it while shown
    attPendingScroll = (prevScroll && visible && attScrollMonth===currentMonth) ? prevScroll.scrollLeft : null;

    var present=0, leave=0, none=0;
    PEOPLE.forEach(function(p){
      var a = attGet(TODAY_ISO, p.key);
      if(!a) none++; else if(attStatus(a.status).kind==='leave') leave++; else present++;
    });

    var html = '';
    html += '<div class="att-head">';
    html += '  <div><h2 class="att-title">'+bi('การเข้างานและวันหยุด')+'</h2><div class="att-date">'+bi(fmtLongDate(TODAY_ISO), false, enLongDate(TODAY_ISO))+'</div></div>';
    html += '  <div class="att-sum">';
    html += '    <span class="att-stat c-in"><b>'+present+'</b>'+bi('เข้างานแล้ว', false, 'At work')+'</span>';
    html += '    <span class="att-stat c-leave"><b>'+leave+'</b>'+bi('ลา / หยุด', false, 'On leave / off')+'</span>';
    html += '    <span class="att-stat c-none"><b>'+none+'</b>'+bi('ยังไม่ลงเวลา', false, 'Not checked in')+'</span>';
    html += '  </div>';
    html += '</div>';

    // ---- today board ----
    html += '<div class="section-title" style="margin-top:14px;">'+bi('วันนี้', false, 'Today')+'</div>';
    html += '<div class="att-board">';
    PEOPLE.forEach(function(p){
      var a = attGet(TODAY_ISO, p.key);
      var st = a ? attStatus(a.status) : null;
      var meta = [];
      if(a && a.status==='in' && a.checkInAt) meta.push('เข้างาน '+fmtClock(a.checkInAt)+' น. <span class="en-i">· checked in '+fmtClock(a.checkInAt)+'</span>');
      if(a && a.note) meta.push(escHtml(a.note));
      html += '<div class="att-row">';
      html += '  <span class="att-dot" style="background:'+p.color+';"></span>';
      html += '  <div><div class="att-name">'+bi(p.name)+'</div></div>';
      html += st ? '  <span class="att-pill st-'+st.k+'">'+tl(st)+'</span>' : '  <span class="att-pill st-none">'+biI('ยังไม่ลงเวลา','Not in')+'</span>';
      html += '  <div class="att-meta">'+meta.join(' · ')+'</div>';
      html += '  <div class="att-act">';
      if(!a) html += '<button type="button" class="att-btn primary" data-att-checkin="'+p.key+'">'+biI('เช็กอิน','Check in')+'</button>';
      html += '<button type="button" class="att-btn" data-att-edit="'+p.key+'|'+TODAY_ISO+'">'+(a ? biI('เปลี่ยน','Change') : biI('ลา / หยุด','Leave / off'))+'</button>';
      html += '  </div>';
      html += '</div>';
    });
    html += '</div>';

    // ---- upcoming leave ----
    var up = {};
    Object.keys(ATTEND).forEach(function(id){
      var a = ATTEND[id];
      if(!a || !a.date || a.date < TODAY_ISO) return;
      var st = attStatus(a.status);
      if(st.kind!=='leave') return;
      var pp = personByKey(a.p);
      if(!pp) return;
      (up[a.date] = up[a.date] || []).push({p:pp, st:st, note:a.note||''});
    });
    var upDates = Object.keys(up).sort().slice(0, 14);
    html += '<div class="section-title">'+bi('ลา / หยุด ที่กำลังจะมาถึง', false, 'Upcoming leave & days off')+'</div>';
    if(!upDates.length){
      html += '<p class="note-line" style="margin:0;">'+bi('ยังไม่มีใครลงวันลาหรือวันหยุดล่วงหน้า กดช่องวันที่ในตารางด้านล่างเพื่อลงวันลา', false, 'Nobody has booked leave or days off ahead yet. Tap a day in the grid below to book leave.')+'</p>';
    } else {
      html += '<div class="att-up">';
      upDates.forEach(function(iso){
        var pr = iso.split('-'); var dow = new Date(parseInt(pr[0],10), parseInt(pr[1],10)-1, parseInt(pr[2],10)).getDay();
        html += '<div class="att-up-row"><span class="att-up-date">'+WD_SHORT[dow]+' '+fmtDue(iso)+(iso===TODAY_ISO?' · วันนี้':'')+'<span class="en">'+WD_EN_SHORT[dow]+' '+enDue(iso)+(iso===TODAY_ISO?' · Today':'')+'</span></span><span class="att-up-who">';
        up[iso].forEach(function(it){
          html += '<span class="att-pill st-'+it.st.k+'" title="'+escAttr(it.note)+'">'+it.p.name+' · '+it.st.label+' <span class="en-i">· '+escHtml([enOf(it.p.name)||it.p.name, it.st.en].join(' · '))+'</span></span>';
        });
        html += '</span></div>';
      });
      html += '</div>';
    }

    // ---- month grid ----
    html += '<div class="section-title" style="display:flex; align-items:center; justify-content:space-between; gap:10px; flex-wrap:wrap;">';
    html += '  <span>ตารางทั้งเดือน<span class="en">Whole-month grid</span></span>';
    html += '  <span style="display:flex; align-items:center; gap:6px; font-weight:400; font-size:13px; text-transform:none; letter-spacing:0;">';
    html += '    <button type="button" class="chip" data-month-act="prev" title="เดือนก่อนหน้า / Previous month">‹</button>';
    html += '    <span style="min-width:104px; text-align:center;">'+bi(monthLabel(currentMonth), false, enMonth(currentMonth))+'</span>';
    html += '    <button type="button" class="chip" data-month-act="next" title="เดือนถัดไป / Next month">›</button>';
    if(currentMonth !== TODAY_ISO.slice(0,7)) html += '    <button type="button" class="chip" data-month-act="today">'+biI('เดือนนี้','This month')+'</button>';
    html += '  </span>';
    html += '</div>';
    html += '<div class="att-legend">';
    ATT_STATUS.forEach(function(st){ html += '<span class="att-pill st-'+st.k+'">'+st.short+' = '+st.label+' <span class="en-i">· '+st.enShort+' = '+st.en+'</span></span>'; });
    html += '</div>';

    var dim = daysInMonthOf(currentMonth);
    var mp = currentMonth.split('-'); var my = parseInt(mp[0],10), mm = parseInt(mp[1],10);
    var perDayLeave = [];
    html += '<div class="att-scroll"><table class="att-grid"><thead><tr><th class="att-first">ชื่อ<span class="en">Name</span></th>';
    for(var d=1; d<=dim; d++){
      var dow = new Date(my, mm-1, d).getDay();
      var iso = currentMonth+'-'+pad2(d);
      var cls = ((dow===0||dow===6) ? ' wk' : '') + (iso===TODAY_ISO ? ' today' : '');
      html += '<th class="att-d'+cls+'"><span>'+WD_SHORT[dow]+' · '+WD_EN_SHORT[dow].slice(0,2)+'</span>'+d+'</th>';
      perDayLeave.push(0);
    }
    html += '<th class="att-sumcol" title="จำนวนวันที่มาทำงาน / Days worked">มา<span class="en">Work</span></th><th class="att-sumcol" title="จำนวนวันลา/หยุด / Days on leave or off">ลา<span class="en">Leave</span></th></tr></thead><tbody>';
    PEOPLE.forEach(function(p){
      var pr=0, lv=0;
      html += '<tr><th class="att-first" scope="row"><span class="att-dot" style="background:'+p.color+'; margin-right:7px;"></span>'+p.name+(enOf(p.name) ? '<span class="en">'+enOf(p.name)+'</span>' : '')+'</th>';
      for(var d2=1; d2<=dim; d2++){
        var dow2 = new Date(my, mm-1, d2).getDay();
        var iso2 = currentMonth+'-'+pad2(d2);
        var cls2 = ((dow2===0||dow2===6) ? ' wk' : '') + (iso2===TODAY_ISO ? ' today' : '');
        var a = attGet(iso2, p.key);
        var edit = p.key+'|'+iso2;
        if(a){
          var st = attStatus(a.status);
          if(st.kind==='leave'){ lv++; perDayLeave[d2-1]++; } else pr++;
          var tip = biOpt(p.name)+' · '+fmtDue(iso2)+' ('+enDue(iso2)+') · '+biOpt(st.label, st.en)+(a.note ? ' · '+a.note : '');
          html += '<td class="att-cell st-'+st.k+'" data-att-edit="'+edit+'" tabindex="0" title="'+escAttr(tip)+'">'+st.short+(st.enShort && st.enShort!==st.short ? '<span class="en">'+st.enShort+'</span>' : '')+'</td>';
        } else {
          html += '<td class="att-cell empty'+cls2+'" data-att-edit="'+edit+'" tabindex="0" title="'+escAttr(biOpt(p.name)+' · '+fmtDue(iso2)+' ('+enDue(iso2)+') · ยังไม่ระบุ · not set')+'">·</td>';
        }
      }
      html += '<td class="att-sumcol">'+pr+'</td><td class="att-sumcol">'+lv+'</td></tr>';
    });
    html += '</tbody><tfoot><tr><th class="att-first">ลา/หยุด (คน)<span class="en">On leave (people)</span></th>';
    for(var d3=0; d3<dim; d3++){
      html += '<td>'+(perDayLeave[d3] ? perDayLeave[d3] : '')+'</td>';
    }
    html += '<td></td><td></td></tr></tfoot></table></div>';
    html += '<p class="note-line">'+bi('กดช่องของวันนั้นเพื่อตั้งสถานะ ช่องว่างคือยังไม่ระบุ · คอลัมน์สีเข้มคือวันนี้ · เสาร์-อาทิตย์แรเงาเทา', false, 'Tap a day\'s cell to set a status; blank means not set · The dark column is today · Weekends are shaded grey')+'</p>';

    host.innerHTML = html;

    host.querySelectorAll('[data-att-checkin]').forEach(function(btn){
      btn.addEventListener('click', function(){ attSet(TODAY_ISO, btn.getAttribute('data-att-checkin'), 'in', ''); });
    });
    host.querySelectorAll('[data-att-edit]').forEach(function(el){
      function open(){
        var pr = el.getAttribute('data-att-edit').split('|');
        openAttModal(pr[0], pr[1]);
      }
      el.addEventListener('click', open);
      if(el.tagName==='TD'){
        el.addEventListener('keydown', function(e){ if(e.key==='Enter' || e.key===' '){ e.preventDefault(); open(); } });
      }
    });
    host.querySelectorAll('[data-month-act]').forEach(function(btn){
      btn.addEventListener('click', function(){ goToMonth(btn.getAttribute('data-month-act')); });
    });
  }

  // runs after the panel is shown (offsets are 0 while it is hidden): keep the user's horizontal
  // position across live refreshes, otherwise bring today's column into view
  function positionAttScroll(){
    if(activeTab!=='attendance') return;
    var host = document.getElementById('panel-attendance');
    var sc = host && host.querySelector('.att-scroll');
    if(!sc) return;
    if(attPendingScroll!==null){ sc.scrollLeft = attPendingScroll; }
    else {
      var th = sc.querySelector('th.today');
      if(th) sc.scrollLeft = Math.max(0, th.offsetLeft - 92 - 40);
    }
    attScrollMonth = currentMonth;
  }

  // ---------- attendance: status modal ----------
  function renderAttChips(){
    var host = document.getElementById('attStatusChips');
    host.innerHTML = '';
    ATT_STATUS.forEach(function(st){
      var b = document.createElement('button');
      b.type = 'button';
      var on = attModalState.status===st.k;
      b.className = 'att-chip'+(on ? ' on st-'+st.k : '');
      b.innerHTML = tl(st);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
      b.addEventListener('click', function(){
        attModalState.status = st.k;
        renderAttChips();
      });
      host.appendChild(b);
    });
    document.getElementById('attSave').disabled = !attModalState.status;
  }
  function openAttModal(pk, iso){
    var p = personByKey(pk);
    if(!p) return;
    var a = attGet(iso, pk);
    attModalState = {p:pk, date:iso, status:a ? a.status : ''};
    document.getElementById('attModalTitle').innerHTML = escHtml(p.name+' · '+fmtLongDate(iso))+'<span class="en">'+escHtml((enOf(p.name)||p.name)+' · '+enLongDate(iso))+'</span>';
    document.getElementById('attNote').value = a ? (a.note||'') : '';
    document.getElementById('attClear').hidden = !a;
    renderAttChips();
    document.getElementById('attModalBackdrop').classList.add('open');
  }
  function closeAttModal(){
    document.getElementById('attModalBackdrop').classList.remove('open');
  }
  function bindAttModal(){
    document.getElementById('attModalClose').addEventListener('click', closeAttModal);
    document.getElementById('attModalBackdrop').addEventListener('click', function(e){
      if(e.target === e.currentTarget) closeAttModal();
    });
    document.getElementById('attSave').addEventListener('click', function(){
      if(!attModalState.status) return;
      attSet(attModalState.date, attModalState.p, attModalState.status, document.getElementById('attNote').value);
      closeAttModal();
    });
    document.getElementById('attClear').addEventListener('click', function(){
      attSet(attModalState.date, attModalState.p, '', '');
      closeAttModal();
    });
    document.getElementById('attNote').addEventListener('keydown', function(e){
      if(e.key==='Enter'){ e.preventDefault(); document.getElementById('attSave').click(); }
    });
    document.addEventListener('keydown', function(e){
      if(e.key==='Escape') closeAttModal();
    });
  }

  // ---------- safe typing ----------
  // When another person's change arrives while you are typing in a form on the page, the redraw waits
  // until you leave the field, so a half-typed entry is never wiped.
  var renderDeferred = false;
  function userIsTyping(){
    var a = document.activeElement;
    if(!a || !a.closest || !a.closest('.wrap')) return false;
    if(a.tagName==='TEXTAREA' || a.tagName==='SELECT') return true;
    if(a.tagName!=='INPUT') return false;
    return ['checkbox','radio','button','submit'].indexOf(a.type) < 0;
  }
  function renderAll(){
    if(window.SheetsDB && window.SheetsDB.isRemote() && userIsTyping()){ renderDeferred = true; return; }
    renderDeferred = false;
    renderAllNow();
  }
  document.addEventListener('focusout', function(){
    setTimeout(function(){ if(renderDeferred && !userIsTyping()) renderAll(); }, 0);
  });

  function renderAllNow(){
    renderTabs();
    renderUrgent();
    renderOverview();
    renderAttendance();
    renderPersonPanels();
    renderCalendar();
    showPanel(activeTab);
    positionAttScroll();
  }

  // ---------- event modal: type, time, place, people, comments ----------
  var currentEventKey = null;
  var currentEventLabel = '';
  var currentEventDate = ''; // the calendar day the event actually falls on ('YYYY-MM-DD') — this is the default due date
  var metaUnsub = null, commentsUnsub = null;
  var evConfirmDel = false;
  function emptyMeta(){ return {responsible:[], with:[], where:'', place:'', time:'', type:'', due:'', note:''}; }
  var currentMeta = emptyMeta();

  function applyMeta(d){
    d = d || {};
    currentMeta = {
      responsible:(d.responsible||[]).slice(), with:(d.with||[]).slice(), where:d.where||'', place:d.place||'',
      time:d.time||'', type:d.type||'', due:d.due||currentEventDate, note:d.note||''
    };
  }
  // write stored values into the inputs, but never overwrite the field the person is typing in
  function fillEventModalFields(){
    var map = {eventDue:currentMeta.due, eventNote:currentMeta.note, evTime:currentMeta.time, evPlace:currentMeta.place};
    Object.keys(map).forEach(function(id){
      var el = document.getElementById(id);
      if(el && document.activeElement!==el) el.value = map[id];
    });
  }

  function openEventModal(key, label, evDate){
    currentEventKey = key;
    currentEventLabel = label || '';
    currentEventDate = evDate || TODAY_ISO;
    evConfirmDel = false;
    document.getElementById('eventModalTitle').innerHTML = bi(label||'', true);
    document.getElementById('eventModalDate').innerHTML = escHtml(fmtLongDate(currentEventDate))+' <span class="en-i">· '+enLongDate(currentEventDate)+'</span>';
    applyMeta(EVENT_META_CACHE[key] || {});
    fillEventModalFields();
    renderEventModalChips();
    document.getElementById('eventComments').innerHTML = '<div class="comment-empty">กำลังโหลด… <span class="en-i">· Loading…</span></div>';
    var savedAuthor = '';
    try{ savedAuthor = localStorage.getItem('khg_commenter_name') || ''; }catch(e){}
    document.getElementById('commentAuthor').value = savedAuthor;
    document.getElementById('eventModalBackdrop').classList.add('open');

    if(metaUnsub){ metaUnsub(); metaUnsub = null; }
    if(commentsUnsub){ commentsUnsub(); commentsUnsub = null; }

    if(db){
      metaUnsub = db.doc('eventMeta/'+key).onSnapshot(function(snap){
        applyMeta(snap.exists ? (snap.data()||{}) : {});
        fillEventModalFields();
        renderEventModalChips();
      }, function(err){ console.warn('meta error', err); });

      commentsUnsub = db.doc('eventMeta/'+key).collection('comments').orderBy('createdAt','asc').limit(100).onSnapshot(function(snap){
        var list = document.getElementById('eventComments');
        if(!snap.size){ list.innerHTML = '<div class="comment-empty">ยังไม่มีการอัพเดทความคืบหน้า <span class="en-i">· No progress updates yet</span></div>'; return; }
        var html = '';
        snap.docs.forEach(function(doc){
          var c = doc.data() || {};
          var when = c.createdAt ? new Date(c.createdAt).toLocaleString('th-TH',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'}) : '';
          html += '<div class="comment-item"><span class="who">'+(c.author && c.author!=='ไม่ระบุชื่อ' ? escHtml(c.author) : biI('ไม่ระบุชื่อ','Anonymous'))+'</span><span class="when">'+when+'</span><div class="body">'+escHtml(c.text||'')+'</div></div>';
        });
        list.innerHTML = html;
        list.scrollTop = list.scrollHeight;
      }, function(err){ console.warn('comments error', err); });
    } else {
      document.getElementById('eventComments').innerHTML = '<div class="comment-empty">โหมดออฟไลน์ — ไม่สามารถบันทึกได้ในเซสชันนี้ <span class="en-i">· Offline mode — can\'t save in this session</span></div>';
    }
  }

  function closeEventModal(){
    document.getElementById('eventModalBackdrop').classList.remove('open');
    if(metaUnsub){ metaUnsub(); metaUnsub = null; }
    if(commentsUnsub){ commentsUnsub(); commentsUnsub = null; }
    currentEventKey = null;
  }

  function escHtml(s){
    return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  function renderEventModalChips(){
    var types = document.getElementById('evTypes'); types.innerHTML = '';
    TASK_TYPES.forEach(function(ty){
      types.appendChild(optChip(tl(ty), 'tp-'+ty.k, currentMeta.type===ty.k, function(){
        currentMeta.type = (currentMeta.type===ty.k ? '' : ty.k);
        persistCurrentMeta(); renderEventModalChips();
      }));
    });
    var where = document.getElementById('evWhere'); where.innerHTML = '';
    EV_WHERE.forEach(function(w){
      where.appendChild(optChip(tl(w), w.cls, currentMeta.where===w.k, function(){
        currentMeta.where = (currentMeta.where===w.k ? '' : w.k);
        persistCurrentMeta(); renderEventModalChips();
      }));
    });
    var resp = document.getElementById('eventRespChips'); resp.innerHTML = '';
    PEOPLE.forEach(function(q){
      resp.appendChild(personChip(q, currentMeta.responsible.indexOf(q.key)>=0, function(){
        var i = currentMeta.responsible.indexOf(q.key);
        var turningOn = i<0;
        if(i>=0) currentMeta.responsible.splice(i,1); else currentMeta.responsible.push(q.key);
        persistCurrentMeta(); renderEventModalChips();
        // toggling on drops the task into that person's list; keep the modal open so more people can be picked
        if(turningOn) ensureTaskForAssignment(q.key);
      }));
    });
    var wth = document.getElementById('evWith'); wth.innerHTML = '';
    PEOPLE.forEach(function(q){
      wth.appendChild(personChip(q, currentMeta.with.indexOf(q.key)>=0, function(){
        var i = currentMeta.with.indexOf(q.key);
        if(i>=0) currentMeta.with.splice(i,1); else currentMeta.with.push(q.key);
        persistCurrentMeta(); renderEventModalChips();
      }));
    });
    var del = document.getElementById('evDelete');
    del.hidden = !(currentEventKey && currentEventKey.indexOf('dyn__')===0);
    del.innerHTML = evConfirmDel ? biI('ยืนยันลบกิจกรรมนี้','Confirm delete') : biI('ลบกิจกรรม','Delete event');
    del.className = 'att-btn'+(evConfirmDel ? ' danger' : '');
  }

  // when a calendar event is assigned to someone, also drop it into their
  // Task list so it actually shows up as a task for them
  function ensureTaskForAssignment(personKey){
    if(!currentEventKey) return;
    var already = ACTION_ITEMS.some(function(t){ return t.p===personKey && t.evKey===currentEventKey; });
    if(already) return;
    var due = (document.getElementById('eventDue').value || currentMeta.due || currentEventDate || TODAY_ISO);
    addActionItem(personKey, currentEventLabel || 'งานจากปฏิทิน', due, '', currentEventKey, '', {type:'event'});
  }

  function persistCurrentMeta(){
    if(!currentEventKey) return;
    var savingKey = currentEventKey;
    currentMeta.due = document.getElementById('eventDue').value;
    currentMeta.note = document.getElementById('eventNote').value;
    currentMeta.time = document.getElementById('evTime').value;
    currentMeta.place = document.getElementById('evPlace').value.trim();
    var body = {
      responsible:currentMeta.responsible.slice(), with:currentMeta.with.slice(), where:currentMeta.where, place:currentMeta.place,
      time:currentMeta.time, type:currentMeta.type, due:currentMeta.due, note:currentMeta.note, updatedAt:Date.now()
    };
    if(db){
      db.doc('eventMeta/'+savingKey).set(body).catch(function(e){ console.warn('save meta failed', e); });
    }
    EVENT_META_CACHE[savingKey] = body; // optimistic local update so chips/dots reflect immediately
    renderAll();
  }

  function saveEventMeta(){
    persistCurrentMeta();
    var resp = currentMeta.responsible;
    if(resp.length===1){
      // exactly one person assigned → it's unambiguous, jump straight to their dashboard
      var jumpTo = resp[0];
      closeEventModal();
      activeTab = jumpTo;
      renderAll();
    } else {
      closeEventModal();
      renderAll();
    }
  }

  function submitComment(){
    if(!currentEventKey) return;
    var authorEl = document.getElementById('commentAuthor');
    var textEl = document.getElementById('commentText');
    var author = (authorEl.value||'').trim() || 'ไม่ระบุชื่อ';
    var text = (textEl.value||'').trim();
    if(!text) return;
    try{ localStorage.setItem('khg_commenter_name', author); }catch(e){}
    if(db){
      db.doc('eventMeta/'+currentEventKey).collection('comments').add({author:author, text:text, createdAt:Date.now()}).catch(function(e){
        console.warn('comment failed', e);
      });
    }
    textEl.value = '';
  }

  function bindEventModal(){
    document.getElementById('eventModalClose').addEventListener('click', closeEventModal);
    document.getElementById('eventModalBackdrop').addEventListener('click', function(e){
      if(e.target === e.currentTarget) closeEventModal();
    });
    document.getElementById('eventSaveMeta').addEventListener('click', saveEventMeta);
    ['eventDue','eventNote','evTime','evPlace'].forEach(function(id){
      document.getElementById(id).addEventListener('change', persistCurrentMeta);
    });
    document.getElementById('evDelete').addEventListener('click', function(){
      if(!currentEventKey) return;
      if(!evConfirmDel){ evConfirmDel = true; renderEventModalChips(); return; }
      var id = currentEventKey.slice(5);
      var mk = (ALL_DYN_EVENTS[id] && ALL_DYN_EVENTS[id].month) || currentMonth;
      closeEventModal();
      deleteCalEvent(mk, id);
    });
    document.getElementById('commentSubmit').addEventListener('click', submitComment);
    document.getElementById('commentText').addEventListener('keydown', function(e){
      if(e.key==='Enter'){ e.preventDefault(); submitComment(); }
    });
    document.addEventListener('keydown', function(e){
      if(e.key==='Escape') closeEventModal();
    });
  }

  // shared month navigation: used by the calendar's own nav AND by each person's
  // task-list month nav, so both stay in sync on the same currentMonth
  function goToMonth(act){
    if(act==='prev') currentMonth = shiftMonth(currentMonth,-1);
    else if(act==='next') currentMonth = shiftMonth(currentMonth,1);
    else if(act==='today') currentMonth = TODAY_ISO.slice(0,7);
    if(db) loadCalEvents(currentMonth); // resubscribe to the newly selected month
    renderAll();
  }


  // ---------- db wiring ----------
  // onSnapshot *should* push live updates the moment anyone writes, but in some
  // viewer contexts that push can be unreliable (nothing shows up until the page
  // is closed and reopened). As a safety net, also poll every few seconds and
  // pull a fresh copy of each collection — this guarantees everyone converges
  // to the same data within a few seconds even if the push channel is stuck.
  var pollTimer = null;
  var pollSig = {};
  function pollChanged(name, rows){
    var sig = JSON.stringify(rows);
    if(pollSig[name]===sig) return false;
    pollSig[name] = sig;
    return true;
  }
  function pollAllCollections(){
    if(!db) return;
    db.collection('actionItems').get().then(function(snap){
      var next = snap.docs.map(mapActionDoc);
      if(!pollChanged('actionItems', next)) return;
      ACTION_ITEMS = next;
      renderAll();
    }).catch(function(e){ console.warn('poll actionItems failed', e); });
    db.collection('hiddenTasks').get().then(function(snap){
      var map = {};
      snap.docs.forEach(function(doc){
        var d = doc.data() || {};
        if(d.p && d.id) map[d.p+'__'+d.id] = true;
      });
      if(!pollChanged('hiddenTasks', map)) return;
      HIDDEN_TASKS = map;
      renderAll();
    }).catch(function(e){ console.warn('poll hiddenTasks failed', e); });
    db.collection('eventMeta').get().then(function(snap){
      var next = {};
      snap.docs.forEach(function(doc){ next[doc.id] = doc.data() || {}; });
      if(!pollChanged('eventMeta', next)) return;
      EVENT_META_CACHE = next;
      renderAll();
    }).catch(function(e){ console.warn('poll eventMeta failed', e); });
    db.collection('sunOffice').get().then(function(snap){
      var next = {};
      snap.docs.forEach(function(doc){
        var d = doc.data() || {};
        if(d.status) next[doc.id] = d.status;
      });
      if(!pollChanged('sunOffice', next)) return;
      SUN_OFFICE = next;
      renderAll();
    }).catch(function(e){ console.warn('poll sunOffice failed', e); });
    db.collection('attendance').get().then(function(snap){
      var next = {};
      snap.docs.forEach(function(doc){ var d = doc.data() || {}; if(d.status) next[doc.id] = d; });
      if(!pollChanged('attendance', next)) return;
      ATTEND = next;
      renderAll();
    }).catch(function(e){ console.warn('poll attendance failed', e); });
    db.collection('calEvents').get().then(function(snap){
      var next = {};
      snap.docs.forEach(function(doc){
        var d = doc.data() || {};
        next[doc.id] = {month:d.month, day:d.day, text:d.text||'', tag:!!d.tag};
      });
      if(!pollChanged('calEvents', next)) return;
      ALL_DYN_EVENTS = next;
      var monthItems = [];
      Object.keys(next).forEach(function(id){
        var e = next[id];
        if(e.month===currentMonth) monthItems.push({id:id, day:e.day, text:e.text, tag:e.tag});
      });
      CAL_CUSTOM_CACHE[currentMonth] = monthItems;
      renderAll();
    }).catch(function(e){ console.warn('poll calEvents failed', e); });
  }

  async function init(){
    bindEventModal();
    bindAttModal();
    bindTaskModal();
    renderAll(); // render immediately with empty state, then upgrade
    try{
      db = window.SheetsDB ? await window.SheetsDB.connect() : null;
    }catch(e){ console.warn(e); db = null; }
    var pill = document.getElementById('statusPill');
    if(db){
      loadActionItems();
      loadCalEvents(currentMonth);
      loadHiddenTasks();
      loadAllEventMeta();
      loadSunOffice();
      loadAttendance();
      loadAllCalEvents();
    } else {
      if(pill && !/API_URL/.test(pill.textContent)) pill.textContent = 'โหมดออฟไลน์ (บันทึกเฉพาะเครื่องนี้) · Offline (saved on this device only)';
      CAL_CUSTOM_CACHE[currentMonth] = [];
    }
  }

  init();
})();
