"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { capture } from "@/lib/attribution";
import { track } from "@/lib/track";

/**
 * Registra el origen de la visita y emite el pageview en cada navegación.
 * No renderiza nada.
 *
 * El orden importa: `capture` tiene que correr ANTES que `track`, porque el
 * primer evento de la sesión es el que lleva la atribución al servidor. Si se
 * invirtiera, la sesión se daría de alta sin saber de qué anuncio vino.
 *
 * Lee `window.location.search` a mano en lugar de usar `useSearchParams()`: ese
 * hook obliga a envolver el árbol en <Suspense> y saca las páginas del
 * prerenderizado estático, y no compensa para un efecto que corre sólo en el
 * cliente después de montar.
 */
export default function Attribution() {
  const pathname = usePathname();

  useEffect(() => {
    capture(window.location.search, pathname, document.referrer);
    track({ type: "pageview" });
  }, [pathname]);

  return null;
}
