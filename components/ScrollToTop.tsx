"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

// Al cambiar de ruta, salta al tope SIN animación, aunque el <html> tenga
// scroll-behavior: smooth (que se usa para los anchors del menú). Mantiene el
// modo "auto" durante toda la transición para ganarle al scroll interno de Next.
export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    const html = document.documentElement;
    html.style.scrollBehavior = "auto";
    window.scrollTo(0, 0);
    // Reintento por si el layout todavía no tomó la altura final.
    const raf = requestAnimationFrame(() => window.scrollTo(0, 0));
    // Recién restauramos el smooth (para los anchors) tras la transición.
    const timer = setTimeout(() => {
      html.style.scrollBehavior = "";
    }, 250);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, [pathname]);

  return null;
}
