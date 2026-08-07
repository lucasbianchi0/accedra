"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import ScrollToTop from "@/components/ScrollToTop";

/**
 * Scroll suave premium (Lenis). Le da a toda la página la inercia "cara" de las
 * consultoras modernas: la rueda no salta, desacelera con peso.
 *
 * SÓLO SE MONTA EN DESKTOP, y esto no cambia nada de lo que se ve:
 * la config ya tenía `syncTouch: false`, o sea que en un teléfono Lenis no
 * suavizaba absolutamente nada — se limitaba a correr un loop de rAF permanente
 * y a competir por un hilo principal que en mobile es el recurso escaso (el TBT
 * es el rubro más pesado del score y sale casi todo de ahí). El scroll táctil
 * nativo ya trae su propia inercia, mejor que cualquier emulación por JS.
 *
 * Lo único que Lenis aportaba en mobile era la curva de los anclajes internos.
 * Eso lo cubre `scroll-behavior: smooth` + `scroll-margin-top: 80px` en
 * globals.css, que es nativo, gratis y no ocupa el hilo principal.
 *
 * Además va por `import()` dinámico: en mobile la librería no se descarga ni se
 * parsea. No alcanzaba con no ejecutarla — un `import` estático la habría puesto
 * igual en el bundle de arranque.
 */
const LenisRoot = dynamic(() => import("@/components/LenisRoot"), {
  ssr: false,
});

// `pointer: coarse` es el discriminante correcto acá: pregunta por el tipo de
// entrada (dedo vs mouse), que es exactamente lo que decide si el smooth de
// rueda tiene sentido. Un `max-width` mandaría a scroll nativo a una notebook
// con ventana angosta, y dejaría a una tablet grande con el loop corriendo al
// pedo.
const NO_LENIS = "(pointer: coarse), (prefers-reduced-motion: reduce)";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  // Arranca DESHABILITADO y el efecto lo enciende sólo si corresponde. El orden
  // importa: server y primer render del cliente deben coincidir, y el server no
  // sabe si hay touch. Empezar en "sin Lenis" y encender después es seguro
  // (montar Lenis no toca el DOM, sólo corre un efecto); al revés produciría un
  // frame con Lenis activo en mobile.
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(NO_LENIS);
    const update = () => setEnabled(!mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Cada rama trae SU reset de scroll entre rutas: el de Lenis va dentro de
  // LenisRoot (necesita el contexto de la librería), el nativo es este.
  if (!enabled) {
    return (
      <>
        <ScrollToTop />
        {children}
      </>
    );
  }

  return <LenisRoot>{children}</LenisRoot>;
}
