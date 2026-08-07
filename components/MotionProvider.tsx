"use client";

import { LazyMotion, MotionConfig } from "framer-motion";

/* framer-motion ya no anima los reveals de scroll (eso es CSS puro desde
 * components/Reveal.tsx). Queda sólo donde hace falta de verdad: los menús con
 * AnimatePresence del navbar y el WhatsApp flotante, y el parallax ligado al
 * scroll de Services.
 *
 * Como es una minoría de la página y nada de eso pasa en el primer segundo, las
 * features se cargan por `import()` dinámico en vez de viajar en el bundle de
 * arranque. Es la diferencia entre pagar el motor de animación durante el
 * arranque —cuando el hilo principal decide el TBT— o pagarlo después, cuando
 * ya no hay nadie esperando.
 *
 * `domAnimation` cubre animaciones, variantes y AnimatePresence. Lo que NO trae
 * es `layout`/`layoutId` y `drag`; el proyecto no usa ninguno de los dos (si
 * algún día se usa, hay que pasar a `domMax`).
 *
 * `strict` hace fallar en desarrollo si alguien escribe `motion.div` en vez de
 * `m.div`. No es una preferencia de estilo: un solo `motion.*` vuelve a meter la
 * librería entera en el bundle y anula todo esto en silencio. Mejor que rompa.
 */
const loadFeatures = () =>
  import("framer-motion").then((mod) => mod.domAnimation);

export default function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      {/* Respeta la preferencia "Reducir movimiento" del SO en TODO framer
          (el bloque CSS de reduced-motion sólo alcanza a las animaciones CSS,
          no a los transforms que framer maneja por JS). */}
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
