"use client";

import { useLocale } from "@/context/LocaleContext";
import { useGame } from "@/context/GameContext";
import { SUPPORTED_LANGUAGES, type SupportedLanguage } from "@/lib/config";

const LANGUAGE_LABELS: Record<SupportedLanguage, string> = {
  en: "EN",
  fr: "FR",
  ru: "RU",
};

export default function LanguageSwitcher() {
  const { language, setLanguage, strings } = useLocale();
  const { playClick } = useGame();

  return (
    <div
      className="fixed top-4 right-4 z-50 flex items-center gap-1 rounded-full bg-white/80 backdrop-blur-md shadow-lg px-1 py-1 border border-gray-200"
      role="group"
      aria-label={strings.nav.languageSwitcher}
    >
      {SUPPORTED_LANGUAGES.map((lang) => (
        <button
          key={lang}
          onClick={() => {
            playClick();
            setLanguage(lang);
          }}
          aria-pressed={language === lang}
          className={`
            px-3 py-1.5 text-xs font-semibold rounded-full transition-all duration-200
            focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
            ${
              language === lang
                ? "bg-gray-900 text-white shadow-sm"
                : "text-gray-600 hover:bg-gray-100"
            }
          `}
        >
          {LANGUAGE_LABELS[lang]}
        </button>
      ))}
    </div>
  );
}
