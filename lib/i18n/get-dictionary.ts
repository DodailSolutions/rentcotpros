import type { Locale } from "./config";
import en from "./dictionaries/en.json";
import hi from "./dictionaries/hi.json";
import te from "./dictionaries/te.json";
import ar from "./dictionaries/ar.json";

export type Dictionary = typeof en;

const dictionaries: Record<Locale, Dictionary> = {
  en,
  hi,
  te,
  ar,
};

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale] ?? dictionaries.en;
}
