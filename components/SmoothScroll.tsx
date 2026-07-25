"use client";

import { ReactLenis } from "lenis/react";
import { useEffect, useState } from "react";

/**
 * Scroll suave premium (Lenis). Le da a toda la página la inercia "cara" de las
 * consultoras modernas: la rueda no salta, desacelera con peso. Sincroniza con el
 * parallax del fondo porque Lenis mueve el scroll real de la ventana (los
 * listeners de `scroll` y `window.scrollY` siguen funcionando igual).
 *
 * En "Reducir movimiento" NO se inicializa: queda el scroll nativo del sistema.
 * En touch tampoco suaviza (mobile ya trae su propia inercia); sólo desktop/rueda.
 */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  // Arranca habilitado para que el markup del server y el primer render del
  // cliente coincidan (ReactLenis root no agrega DOM: sólo corre un efecto).
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  if (reduced) return <>{children}</>;

  return (
    <ReactLenis
      root
      options={{
        // `lerp` = qué tan rápido "alcanza" el scroll al gesto. Más alto = más
        // ágil/responsivo; más bajo = más pesado. 0.1 suaviza sin sentirse trabado.
        lerp: 0.1,
        wheelMultiplier: 1.05,
        // El mobile mantiene su scroll nativo (no lo suavizamos: se sentiría raro).
        smoothWheel: true,
        syncTouch: false,
        // Los anclajes internos (#contacto, #capacidades…) los maneja Lenis, con
        // la misma curva suave que el resto del scroll.
        anchors: { offset: -80, duration: 1.4 },
      }}
    >
      {children}
    </ReactLenis>
  );
}
