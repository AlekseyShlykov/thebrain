"use client";

import React, { createContext, useContext, useState, useCallback, useMemo } from "react";
import type { SupportedLanguage } from "@/lib/config";
import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from "@/lib/config";
import enStrings from "@/locales/en.json";
import frStrings from "@/locales/fr.json";
import ruStrings from "@/locales/ru.json";

type StringsMap = typeof enStrings;

const localeFiles: Record<SupportedLanguage, StringsMap> = {
  en: enStrings,
  fr: frStrings,
  ru: ruStrings,
};

interface LocaleContextValue {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  strings: StringsMap;
  /** Helper: replace `{key}` tokens in a string */
  t: (template: string, vars?: Record<string, string | number>) => string;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<SupportedLanguage>(DEFAULT_LANGUAGE);

  const setLanguage = useCallback((lang: SupportedLanguage) => {
    if (SUPPORTED_LANGUAGES.includes(lang)) {
      setLanguageState(lang);
    }
  }, []);

  const strings = useMemo(() => localeFiles[language], [language]);

  const t = useCallback(
    (template: string, vars?: Record<string, string | number>) => {
      if (!vars) return template;
      return Object.entries(vars).reduce(
        (str, [key, val]) => str.replace(new RegExp(`\\{${key}\\}`, "g"), String(val)),
        template
      );
    },
    []
  );

  return (
    <LocaleContext.Provider value={{ language, setLanguage, strings, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}
