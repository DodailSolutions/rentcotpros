export type Locale = "en" | "hi" | "te" | "ar";

export const LOCALES: { code: Locale; name: string; nativeName: string; dir: "ltr" | "rtl" }[] = [
  { code: "en", name: "English", nativeName: "English", dir: "ltr" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", dir: "ltr" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు", dir: "ltr" },
  { code: "ar", name: "Arabic", nativeName: "العربية", dir: "rtl" },
];

export const DEFAULT_LOCALE: Locale = "en";

export function isLocaleSupported(locale: string): locale is Locale {
  return LOCALES.some((l) => l.code === locale);
}

export function getLocaleDirection(locale: Locale): "ltr" | "rtl" {
  const match = LOCALES.find((l) => l.code === locale);
  return match ? match.dir : "ltr";
}
