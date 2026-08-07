"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/* Reset de scroll entre rutas para el camino SIN Lenis — que desde que Lenis
 * quedó restringido a desktop es todo mobile, más cualquiera con "reducir
 * movimiento" activado.
 *
 * La versión equivalente para cuando Lenis está activo vive en LenisRoot.tsx:
 * tiene que estar allá porque `useLenis` importa la librería, y este archivo
 * debe poder cargarse sin arrastrarla al bundle de arranque.
 *
 * Al cambiar de ruta salta al tope SIN animación. EXCEPCIÓN: si la URL trae un
 * ancla (#contacto, #servicios, …) scrollea a ese elemento en vez del tope.
 * Reintentos por si el layout aún no tomó su altura final.
 */
export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    const hash = window.location.hash;

    if (hash) {
      const jump = () => {
        const el = document.querySelector(hash);
        // `behavior: auto` es a propósito: pisa el `scroll-behavior: smooth`
        // global. Al ENTRAR a una URL con ancla querés estar ahí, no ver la
        // página desfilando sola. El smooth es para los clicks internos.
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
