"use client";

import { useLang } from "./LangProvider";
import { DICTS } from "./dictionaries";

// Hook de traducción: devuelve el diccionario del idioma activo.
export function useT() {
  const { lang } = useLang();
  return DICTS[lang];
}
