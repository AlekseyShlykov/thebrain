/**
 * Google Apps Script: Funnel analytics → Google Sheets
 *
 * Deploy as Web App (Execute as: Me, Who has access: Anyone) and use the URL as
 * NEXT_PUBLIC_ANALYTICS_SHEETS_SCRIPT_URL in your app.
 *
 * Spreadsheet must have two sheets:
 * - "Events" — raw log: Timestamp | Session ID | Event Name
 * - "Funnel" — one row per session: Session ID | Event 1 (Intro) | Event 2 (First Q) | Event 3 (Stage 1 ended) | Event 4 (Stage 2 ended)
 */

const SHEET_EVENTS = "Events";
const SHEET_FUNNEL = "Funnel";

const EVENT_1 = "intro_button_click";
const EVENT_2 = "first_question_choice_stage1";
const EVENT_3 = "stage_1_ended";
const EVENT_4 = "stage_2_ended";

function doGet(e) {
  var params = e && e.parameter;
  if (!params || !params.eventName || !params.sessionId) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: "missing eventName or sessionId" }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  var eventName = params.eventName;
  var sessionId = params.sessionId;
  try {
    appendEvent(sessionId, eventName);
    updateFunnel(sessionId, eventName);
    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function appendEvent(sessionId, eventName) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_EVENTS);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_EVENTS);
    sheet.appendRow(["Timestamp", "Session ID", "Event Name"]);
  }
  sheet.appendRow([new Date(), sessionId, eventName]);
}

function eventToColumn(eventName) {
  switch (eventName) {
    case EVENT_1: return 2;
    case EVENT_2: return 3;
    case EVENT_3: return 4;
    case EVENT_4: return 5;
    default: return -1;
  }
}

function updateFunnel(sessionId, eventName) {
  var col = eventToColumn(eventName);
  if (col === -1) return;

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_FUNNEL);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_FUNNEL);
    sheet.appendRow(["Session ID", "Event 1 (Intro click)", "Event 2 (First Q choice)", "Event 3 (Stage 1 ended)", "Event 4 (Stage 2 ended)"]);
  }

  var data = sheet.getDataRange().getValues();
  var header = data[0];
  var foundRow = -1;
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === sessionId) {
      foundRow = i + 1;
      break;
    }
  }

  if (foundRow > 0) {
    sheet.getRange(foundRow, col).setValue("Y");
  } else {
    var row = [sessionId, "", "", "", ""];
    row[col - 1] = "Y";
    sheet.appendRow(row);
  }
}
