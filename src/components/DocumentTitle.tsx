"use client";

import { useEffect } from "react";
import { useLocale } from "@/context/LocaleContext";

/** Syncs document title to the current locale's game name (landing.title + subtitle). */
export default function DocumentTitle() {
  const { strings } = useLocale();

  useEffect(() => {
    document.title = `${strings.landing.title} — ${strings.landing.subtitle}`;
  }, [strings.landing.title, strings.landing.subtitle]);

  return null;
}
