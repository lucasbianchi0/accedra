"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

/* Todo lo que toca Lenis vive acá, en un módulo aparte, porque SmoothScroll lo
 * carga con `import()` dinámico. Si `lenis/react` se importara desde cualquier
 * archivo del árbol estático volvería al bundle de arranque, y el objetivo es
 * justamente que un teléfono no descargue ni ejecute una línea de una librería
 * que en touch no hace absolutamente nada.
 *
 * Por eso el reset de scroll entre rutas también está acá y no en ScrollToTop:
 * `useLenis` es un import de la librería. La versión sin Lenis —scroll nativo—
 * es la que quedó en components/ScrollToTop.tsx.
 */

// Al cambiar de ruta salta al tope SIN animación. EXCEPCIÓN: si la URL trae un
// ancla (#contacto, #servicios, …) scrollea a ese elemento en vez del tope.
//
// CLAVE: con Lenis activo `window.scrollTo(0,0)` no alcanza — Lenis mantiene su
// propia posición y la reimpone en el frame siguiente. Hay que decirle a Lenis
// que vaya a 0. Reintentos por si el layout aún no tomó su altura final.
function LenisScrollToTop() {
  const pathname = usePathname();
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;
    const hash = window.location.hash;

    if (hash) {
      const jump = () => lenis.scrollTo(hash, { immediate: true, offset: -80 });
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

    lenis.scrollTo(0, { immediate: true });
    const raf = requestAnimationFrame(() =>
      lenis.scrollTo(0, { immediate: true })
    );
    return () => cancelAnimationFrame(raf);
  }, [pathname, lenis]);

  return null;
}

export default function LenisRoot({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        // `lerp` = qué tan rápido "alcanza" el scroll al gesto. Más alto = más
        // ágil/responsivo; más bajo = más pesado. 0.1 suaviza sin sentirse trabado.
        lerp: 0.1,
        wheelMultiplier: 1.05,
        smoothWheel: true,
        syncTouch: false,
        // Los anclajes internos (#contacto, #capacidades…) los maneja Lenis, con
        // la misma curva suave que el resto del scroll.
        anchors: { offset: -80, duration: 1.4 },
      }}
    >
      <LenisScrollToTop />
      {children}
    </ReactLenis>
  );
}
