"use client";

import { useLang } from "./LangProvider";

// Hook de traducción: devuelve el diccionario del idioma activo.
export function useT() {
  return useLang().dict;
}
