import type { Lang } from "../config";
import { es, type Dict } from "./es";

export type { Dict };
export { es };

/* Sólo el español viaja en el bundle de arranque. Antes los tres diccionarios
   entraban estáticos en TODAS las páginas (~10 KB gzip de inglés y portugués)
   para una fracción mínima de visitas que cambia de idioma. En mobile ese JS se
   descarga antes del LCP y Lighthouse lo cobra. Inglés y portugués se piden
   recién cuando alguien elige el idioma (o lo tiene guardado). */
export function loadDict(lang: Lang): Promise<Dict> {
  switch (lang) {
    case "en":
      return import("./en").then((m) => m.en);
    case "pt":
      return import("./pt").then((m) => m.pt);
    default:
      return Promise.resolve(es);
  }
}
