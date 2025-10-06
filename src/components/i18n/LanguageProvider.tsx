"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import en from "@/locales/en.json";
import hi from "@/locales/hi.json";

export type SupportedLocale = "en" | "hi";

type Dictionary = typeof en;

type LanguageContextValue = {
  locale: SupportedLocale;
  t: (path: string) => string;
  setLocale: (next: SupportedLocale) => void;
};

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

const STORAGE_KEY = "careconnect.locale";

const dictionaries: Record<SupportedLocale, Dictionary> = {
  en,
  hi,
};

function getByPath(dict: Dictionary, path: string): string | undefined {
  return path.split(".").reduce<any>((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), dict);
}

export function LanguageProvider({ children, defaultLocale = "en" as SupportedLocale }: { children: React.ReactNode; defaultLocale?: SupportedLocale }) {
  const [locale, setLocaleState] = useState<SupportedLocale>(defaultLocale);

  useEffect(() => {
    const stored = typeof window !== "undefined" ? (localStorage.getItem(STORAGE_KEY) as SupportedLocale | null) : null;
    if (stored && (stored === "en" || stored === "hi")) {
      setLocaleState(stored);
      const html = document.documentElement;
      if (html) html.lang = stored === "hi" ? "hi" : "en";
    } else {
      const html = document.documentElement;
      if (html) html.lang = defaultLocale === "hi" ? "hi" : "en";
    }
  }, [defaultLocale]);

  const setLocale = useCallback((next: SupportedLocale) => {
    setLocaleState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
      const html = document.documentElement;
      if (html) html.lang = next === "hi" ? "hi" : "en";
    } catch {}
  }, []);

  const t = useCallback(
    (path: string) => {
      const dict = dictionaries[locale];
      const value = getByPath(dict, path);
      if (typeof value === "string") return value;
      // fallback to English
      const fallback = getByPath(dictionaries.en, path);
      return typeof fallback === "string" ? fallback : path;
    },
    [locale]
  );

  const value = useMemo<LanguageContextValue>(() => ({ locale, t, setLocale }), [locale, t, setLocale]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useI18n must be used within LanguageProvider");
  return ctx;
}


