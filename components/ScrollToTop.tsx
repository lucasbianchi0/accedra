"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

// Al cambiar de ruta salta al tope SIN animación. EXCEPCIÓN: si la URL trae un
// ancla (#contacto, #servicios, …) scrollea a ese elemento en vez del tope —
// con reintentos por si el layout todavía no tomó su altura final (imágenes/video).
export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    const hash = window.location.hash;

    if (hash) {
      const jump = () => {
        const el = document.querySelector(hash);
        if (el) el.scrollIntoView({ behavior: "auto", block: "start" });
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
  }, [pathname]);

  return null;
}
