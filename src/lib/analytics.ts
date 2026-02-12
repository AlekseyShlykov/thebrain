/**
 * Funnel analytics: events sent to Google Analytics (gtag) and optionally to our API → Google Sheets.
 *
 * Events:
 * 1. intro_button_click — user pressed Start on the landing (intro) screen
 * 2. first_question_choice_stage1 — user selected an answer on the first question of stage 1
 * 3. stage_1_ended — user finished all stage 1 questions (before stage 2 intro)
 * 4. stage_2_ended — user finished stage 2 and reached results
 */

export const ANALYTICS_EVENTS = {
  INTRO_BUTTON_CLICK: "intro_button_click",
  FIRST_QUESTION_CHOICE_STAGE1: "first_question_choice_stage1",
  STAGE_1_ENDED: "stage_1_ended",
  STAGE_2_ENDED: "stage_2_ended",
} as const;

export type AnalyticsEventName = (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

function getSessionId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("brain-driver-session-id");
}

/**
 * Send a funnel event to Google Analytics (gtag) and to our API (which writes to Google Sheets if configured).
 */
export function trackFunnelEvent(eventName: AnalyticsEventName): void {
  if (typeof window === "undefined") return;
  const sessionId = getSessionId() ?? undefined;

  // Google Analytics 4
  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, {
      session_id: sessionId,
      event_category: "funnel",
    });
  }

  // Google Sheets via Apps Script web app (works with static export; set NEXT_PUBLIC_ANALYTICS_SHEETS_SCRIPT_URL)
  const scriptUrl = process.env.NEXT_PUBLIC_ANALYTICS_SHEETS_SCRIPT_URL;
  if (scriptUrl && sessionId) {
    const url = new URL(scriptUrl);
    url.searchParams.set("eventName", eventName);
    url.searchParams.set("sessionId", sessionId);
    fetch(url.toString(), { method: "GET", keepalive: true }).catch(() => {});
  }
}
