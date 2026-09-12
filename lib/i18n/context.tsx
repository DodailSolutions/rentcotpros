"use client";

import React, { createContext, useContext, useMemo } from "react";
import type { Locale } from "./config";
import type { Dictionary } from "./get-dictionary";
import { getLocaleDirection } from "./config";

interface I18nContextType {
  locale: Locale;
  dict: Dictionary;
  dir: "ltr" | "rtl";
  t: (key: string, fallback?: string) => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({
  locale,
  dict,
  children,
}: {
  locale: Locale;
  dict: Dictionary;
  children: React.ReactNode;
}) {
  const dir = getLocaleDirection(locale);

  const value = useMemo(() => {
    // Nested path translation helper e.g. t('nav.dashboard')
    const t = (path: string, fallback?: string): string => {
      const parts = path.split(".");
      let current: any = dict;
      for (const part of parts) {
        if (current && typeof current === "object" && part in current) {
          current = current[part];
        } else {
          return fallback ?? path;
        }
      }
      return typeof current === "string" ? current : fallback ?? path;
    };

    return { locale, dict, dir, t };
  }, [locale, dict, dir]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useTranslation() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useTranslation must be used within an I18nProvider");
  }
  return context;
}
