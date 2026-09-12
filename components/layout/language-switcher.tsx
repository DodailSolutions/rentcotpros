"use client";

import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LOCALES, type Locale } from "@/lib/i18n/config";
import { useTranslation } from "@/lib/i18n/context";
import { Globe, Check } from "lucide-react";

export function LanguageSwitcher() {
  const { locale } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const handleSelectLocale = (newLocale: Locale) => {
    setIsOpen(false);
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;

    // Replace locale in current path
    const segments = pathname.split("/");
    if (segments.length > 1 && LOCALES.some((l) => l.code === segments[1])) {
      segments[1] = newLocale;
    } else {
      segments.splice(1, 0, newLocale);
    }
    const newPath = segments.join("/") || `/${newLocale}`;
    router.push(newPath);
    router.refresh();
  };

  const currentLocaleObj = LOCALES.find((l) => l.code === locale) || LOCALES[0];

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border border-border bg-background hover:bg-muted text-foreground transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
        aria-label="Change language"
      >
        <Globe className="w-4 h-4 text-primary" />
        <span className="hidden sm:inline">{currentLocaleObj.nativeName}</span>
        <span className="sm:hidden font-mono uppercase text-xs">{currentLocaleObj.code}</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 rtl:right-auto rtl:left-0 mt-2 w-48 rounded-xl bg-card border border-border shadow-xl z-50 py-1 divide-y divide-border/40 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-3 py-2 text-xs font-semibold uppercase text-muted-foreground tracking-wider">
              Select Language
            </div>
            <div className="py-1">
              {LOCALES.map((loc) => {
                const isSelected = loc.code === locale;
                return (
                  <button
                    key={loc.code}
                    onClick={() => handleSelectLocale(loc.code)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 text-sm text-left rtl:text-right transition-colors hover:bg-muted/70 ${
                      isSelected ? "text-primary font-medium bg-primary/5" : "text-foreground"
                    }`}
                  >
                    <div className="flex flex-col">
                      <span>{loc.nativeName}</span>
                      <span className="text-xs text-muted-foreground">{loc.name}</span>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-primary" />}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
