/**
 * Navio Labs: lead webhook for Google Sheets
 *
 * How to use
 * 1. Create a Google Sheet, then open Extensions > Apps Script.
 * 2. Paste this whole file and save.
 * 3. Deploy > New deployment > type "Web app".
 *      Execute as: Me
 *      Who has access: Anyone
 * 4. Copy the Web app URL (it ends with /exec) into:
 *      server/.env   -> GOOGLE_SCRIPT_URL
 *      client/.env   -> VITE_GOOGLE_SCRIPT_URL  (optional fallback)
 * 5. Every time you change this script, use Deploy > Manage deployments > Edit > New version.
 *
 * The website sends JSON like:
 *   { "name": "...", "email": "...", "phone": "...", "service": "...", "message": "..." }
 */
const SHEET_NAME = 'Leads';
const HEADERS = ['Timestamp', 'Name', 'Email', 'Phone', 'Service', 'Message'];

// Stops spreadsheet formulas such as =HYPERLINK(...) from running if someone types them into the form.
function safe(value) {
  const text = String(value == null ? '' : value);
  if (text.charAt(0) === "'") return text;
  return /^[=+\-@\t\r]/.test(text) ? "'" + text : text;
}

function readBody(e) {
  if (e && e.postData && e.postData.contents) {
    try {
      return JSON.parse(e.postData.contents);
    } catch (err) {
      // Not JSON: fall back to normal form fields
    }
  }
  return (e && e.parameter) || {};
}

function doPost(e) {
  try {
    const data = readBody(e);
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.insertSheet(SHEET_NAME);
    if (sheet.getLastRow() === 0) sheet.appendRow(HEADERS);

    sheet.appendRow([
      new Date(),
      safe(data.name),
      safe(data.email),
      safe(data.phone),
      safe(data.service),
      safe(data.message),
    ]);

    return ContentService.createTextOutput(JSON.stringify({ result: 'success' })).setMimeType(
      ContentService.MimeType.JSON
    );
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ result: 'error', error: String(err) })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

// Open the /exec URL in a browser to check the deployment is live.
function doGet() {
  return ContentService.createTextOutput('Navio Labs lead webhook is running.');
}
