/**
 * Google Apps Script: Funnel analytics → Google Sheets
 *
 * Deploy as Web App (Execute as: Me, Who has access: Anyone) and use the URL as
 * NEXT_PUBLIC_ANALYTICS_SHEETS_SCRIPT_URL in your app.
 *
 * Spreadsheet must have two sheets:
 * - "Events" — raw log: Timestamp | Session ID | Event Name | Language
 * - "Funnel" — one row per session: Session ID | Language | First event | Last event | Event 1–4 | Total score | Limbic | Reptilian | Neocortex
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
  var language = params.language || "";
  var totalCorrect = params.totalCorrect ? parseInt(params.totalCorrect, 10) : null;
  var totalQuestions = params.totalQuestions ? parseInt(params.totalQuestions, 10) : null;
  var limbicCorrect = params.limbicCorrect ? parseInt(params.limbicCorrect, 10) : null;
  var limbicTotal = params.limbicTotal ? parseInt(params.limbicTotal, 10) : null;
  var reptilianCorrect = params.reptilianCorrect ? parseInt(params.reptilianCorrect, 10) : null;
  var reptilianTotal = params.reptilianTotal ? parseInt(params.reptilianTotal, 10) : null;
  var neocortexCorrect = params.neocortexCorrect ? parseInt(params.neocortexCorrect, 10) : null;
  var neocortexTotal = params.neocortexTotal ? parseInt(params.neocortexTotal, 10) : null;

  var results = null;
  if (totalCorrect !== null && totalQuestions !== null) {
    results = {
      totalCorrect: totalCorrect,
      totalQuestions: totalQuestions,
      limbic: limbicCorrect !== null && limbicTotal !== null ? limbicCorrect + "/" + limbicTotal : "",
      reptilian: reptilianCorrect !== null && reptilianTotal !== null ? reptilianCorrect + "/" + reptilianTotal : "",
      neocortex: neocortexCorrect !== null && neocortexTotal !== null ? neocortexCorrect + "/" + neocortexTotal : ""
    };
  }

  try {
    var now = new Date();
    appendEvent(sessionId, eventName, language, now);
    updateFunnel(sessionId, eventName, language, now, results);
    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function appendEvent(sessionId, eventName, language, timestamp) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_EVENTS);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_EVENTS);
    sheet.appendRow(["Timestamp", "Session ID", "Event Name", "Language"]);
  }
  sheet.appendRow([timestamp, sessionId, eventName, language]);
}

function eventToColumn(eventName) {
  switch (eventName) {
    case EVENT_1: return 5;
    case EVENT_2: return 6;
    case EVENT_3: return 7;
    case EVENT_4: return 8;
    default: return -1;
  }
}

function updateFunnel(sessionId, eventName, language, timestamp, results) {
  var col = eventToColumn(eventName);
  if (col === -1) return;

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_FUNNEL);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_FUNNEL);
    sheet.appendRow([
      "Session ID", "Language", "First event", "Last event",
      "Event 1 (Intro click)", "Event 2 (First Q choice)", "Event 3 (Stage 1 ended)", "Event 4 (Stage 2 ended)",
      "Total score", "Limbic", "Reptilian", "Neocortex"
    ]);
  }

  var data = sheet.getDataRange().getValues();
  var foundRow = -1;
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === sessionId) {
      foundRow = i + 1;
      break;
    }
  }

  var tsStr = timestamp.toISOString ? timestamp.toISOString() : timestamp.toString();

  if (foundRow > 0) {
    sheet.getRange(foundRow, col).setValue("Y");
    if (language) sheet.getRange(foundRow, 2).setValue(language);
    sheet.getRange(foundRow, 4).setValue(tsStr);
    if (results) {
      sheet.getRange(foundRow, 9).setValue(results.totalCorrect + "/" + results.totalQuestions);
      if (results.limbic) sheet.getRange(foundRow, 10).setValue(results.limbic);
      if (results.reptilian) sheet.getRange(foundRow, 11).setValue(results.reptilian);
      if (results.neocortex) sheet.getRange(foundRow, 12).setValue(results.neocortex);
    }
  } else {
    var row = [
      sessionId,
      language,
      tsStr,
      tsStr,
      eventName === EVENT_1 ? "Y" : "",
      eventName === EVENT_2 ? "Y" : "",
      eventName === EVENT_3 ? "Y" : "",
      eventName === EVENT_4 ? "Y" : "",
      results ? (results.totalCorrect + "/" + results.totalQuestions) : "",
      results ? results.limbic : "",
      results ? results.reptilian : "",
      results ? results.neocortex : ""
    ];
    sheet.appendRow(row);
  }
}
