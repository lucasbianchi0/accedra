export const LANGS = ["es", "en", "pt"] as const;
export type Lang = (typeof LANGS)[number];

export const DEFAULT_LANG: Lang = "es";

export const STORAGE_KEY = "accedra-lang";

// Etiqueta corta para el selector (ES · EN · PT)
export const LANG_LABELS: Record<Lang, string> = {
  es: "ES",
  en: "EN",
  pt: "PT",
};

// Nombre completo del idioma (para accesibilidad / tooltip)
export const LANG_NAMES: Record<Lang, string> = {
  es: "Español",
  en: "English",
  pt: "Português",
};

export function isLang(value: string | null | undefined): value is Lang {
  return !!value && (LANGS as readonly string[]).includes(value);
}
