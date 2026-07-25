"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useLenis } from "lenis/react";

// Al cambiar de ruta salta al tope SIN animación. EXCEPCIÓN: si la URL trae un
// ancla (#contacto, #servicios, …) scrollea a ese elemento en vez del tope.
//
// CLAVE: con Lenis activo, `window.scrollTo(0,0)` no alcanza — Lenis mantiene su
// propia posición y la reimpone en el frame siguiente. Hay que decirle a Lenis
// que vaya a 0 (`lenis.scrollTo(0, { immediate: true })`). Sin Lenis (reduce-motion)
// cae al scroll nativo. Reintentos por si el layout aún no tomó su altura final.
export default function ScrollToTop() {
  const pathname = usePathname();
  const lenis = useLenis();

  useEffect(() => {
    const hash = window.location.hash;

    if (hash) {
      const jump = () => {
        if (lenis) {
          lenis.scrollTo(hash, { immediate: true, offset: -80 });
        } else {
          const el = document.querySelector(hash);
          if (el) el.scrollIntoView({ behavior: "auto", block: "start" });
        }
      };
      jump();
      const raf = requestAnimationFrame(jump);
      const t1 = setTimeout(jump, 120);
      const t2 = setTimeout(jump, 400); // tras cargar imágenes/video
      return () => {
        cancelAnimationFrame(raf);
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }

    // Tope de la página
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
      const raf = requestAnimationFrame(() => lenis.scrollTo(0, { immediate: true }));
      return () => cancelAnimationFrame(raf);
    }

    const html = document.documentElement;
    html.style.scrollBehavior = "auto";
    window.scrollTo(0, 0);
    const raf = requestAnimationFrame(() => window.scrollTo(0, 0));
    const timer = setTimeout(() => {
      html.style.scrollBehavior = "";
    }, 250);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, [pathname, lenis]);

  return null;
}
