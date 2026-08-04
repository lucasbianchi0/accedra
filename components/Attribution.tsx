"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { capture } from "@/lib/attribution";

/**
 * Registra el origen de la visita en cada navegación. No renderiza nada.
 *
 * Lee `window.location.search` a mano en lugar de usar `useSearchParams()`: ese
 * hook obliga a envolver el árbol en <Suspense> y saca las páginas del
 * prerenderizado estático. Para un efecto que corre sólo en el cliente después
 * de montar, no compensa pagar ese costo.
 */
export default function Attribution() {
  const pathname = usePathname();

  useEffect(() => {
    capture(window.location.search, pathname, document.referrer);
  }, [pathname]);

  return null;
}
