"use client";

import { useEffect, useRef } from "react";
import { useGame, type GameScreen } from "@/context/GameContext";
import { useLocale } from "@/context/LocaleContext";
import { BRAIN_SYSTEMS } from "@/lib/config";

const SCROLLY_SCREENS: GameScreen[] = [
  "scrolly-1",
  "scrolly-2",
  "scrolly-3",
  "scrolly-4",
  "scrolly-5",
];

const SPEECH_LANG: Record<string, string> = {
  en: "en-US",
  fr: "fr-FR",
  ru: "ru-RU",
};

/**
 * Uses the browser’s built-in Speech Synthesis (multilingual).
 * When Voice is on, reads the text currently on screen; respects app language.
 */
export default function SpeechSpeaker() {
  const { screen, audio, questions, currentQuestionIndex, results } = useGame();
  const { strings, language, t } = useLocale();
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    if (!audio.voiceOn) {
      window.speechSynthesis.cancel();
      return;
    }

    const lang = SPEECH_LANG[language] || "en-US";

    let text = "";

    if (screen === "landing") {
      text = [strings.landing.title, strings.landing.subtitle, strings.landing.description].join(
        ". "
      );
    } else if (screen === "stage2-intro") {
      text = strings.stage2Intro.question;
    } else if (SCROLLY_SCREENS.includes(screen)) {
      const idx = SCROLLY_SCREENS.indexOf(screen) + 1;
      const screenKey = `screen${idx}` as keyof typeof strings.scrolly;
      const content = strings.scrolly[screenKey] as { title: string; body: string };
      text = [content.title, content.body].join(". ");
    } else if (screen === "quiz" && questions.length > 0) {
      const question = questions[currentQuestionIndex];
      if (question) {
        const situationStrings =
          question.stage === 1
            ? (strings.situationsMain as Record<string, { title: string; description: string; why: string }>)[
                question.localeKey
              ]
            : (strings.situations as Record<string, { title: string; description: string; why: string }>)[
                question.localeKey
              ];
        if (situationStrings) {
          const parts =
            question.stage === 1
              ? [
                  situationStrings.title,
                  situationStrings.description,
                  strings.quiz.questionMain,
                  ...BRAIN_SYSTEMS.map((s) => strings.quiz.options[s]),
                ]
              : [
                  situationStrings.title,
                  situationStrings.description,
                  strings.quiz.questionQ1,
                  ...BRAIN_SYSTEMS.map((s) => strings.quiz.options[s]),
                  strings.quiz.questionQ2,
                  ...BRAIN_SYSTEMS.map((s) => strings.quiz.options[s]),
                ];
          text = parts.join(". ");
        }
      }
    } else if (screen === "results" && results) {
      const topLabel =
        strings.results[results.topSystem as keyof typeof strings.results] || results.topSystem;
      const parts = [
        strings.results.title,
        t(strings.results.topDriver, { system: topLabel }),
        t(strings.results.scoreLabel, {
          correct: results.totalCorrect,
          total: results.totalQuestions,
        }),
        strings.results.breakdownTitle,
      ];
      (["reptilian", "limbic", "neocortex"] as const).forEach((sys) => {
        const bd = results.breakdown[sys] || { correct: 0, total: 0 };
        const label = strings.results[sys];
        parts.push(`${label}, ${t(strings.results.correctLabel, { count: bd.correct })}`);
      });
      text = parts.join(". ");
    }

    if (!text.trim()) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.95;
    utteranceRef.current = utterance;

    window.speechSynthesis.speak(utterance);

    return () => {
      window.speechSynthesis.cancel();
    };
  }, [
    audio.voiceOn,
    screen,
    language,
    strings,
    questions,
    currentQuestionIndex,
    results,
    t,
  ]);

  return null;
}
