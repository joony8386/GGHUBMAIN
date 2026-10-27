# ใกล้กัน Task Hub · Glaigan Task Hub

Shared task board, attendance & leave tracker and company calendar for the Glaigan (ใกล้กัน) team.
Every screen is bilingual Thai / English.

- **Website:** these files, hosted free on GitHub Pages.
- **Database:** a Google Sheet in the owner's Google Drive, reached through a small Apps Script web app (`apps-script/Code.gs`).
- **Access:** staff enter a shared team passcode once per device.

| File | What it is |
| --- | --- |
| `index.html` | Page layout and the passcode screen |
| `styles.css` | Colours, fonts, layout |
| `app.js` | All app logic, the staff list (`PEOPLE`) and job descriptions |
| `sheets-db.js` | Connects the page to the Google Sheet and checks for updates |
| `config.js` | The one file to edit: your Apps Script Web app URL |
| `apps-script/Code.gs` | Backup copy of the backend; it runs inside Google Apps Script, not here |

Setup and day-to-day instructions are in the Go-Live Manual.
