"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { useSyncExternalStore, type ElementType, type ReactNode } from "react";

// Ease "expo-out": sale rápido y desacelera largo → la sensación cara/suave.
// Un único ease + duración para toda la página da coherencia de ritmo: todas las
// apariciones "hablan el mismo idioma" y se sienten conectadas.
export const EASE = [0.16, 1, 0.3, 1] as const;
// Reveals deliberadamente pausados (consultora premium): entran despacio y
// asientan largo. Subir esto ralentiza TODA la página desde un solo lugar.
const DUR = 1.5;
const DESKTOP = "(min-width: 768px)";

// El desenfoque animado es el único efecto caro en GPU: en mobile lo apagamos
// (queda fade + rise, mismo look, cero costo de filtro). Server → false para no
// desincronizar la hidratación; el desktop lo enciende al montar.
function useBlurOK() {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(DESKTOP);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia(DESKTOP).matches,
    () => false,
  );
}

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  blur?: boolean;
  once?: boolean;
  amount?: number;
  as?: ElementType;
};

// Reveal premium para un elemento: fade + rise + desenfoque que se resuelve al
// entrar en viewport. Con "reducir movimiento" queda sólo un fade instantáneo.
export function Reveal({
  children, className, delay = 0, y = 46, blur = true, once = true, amount = 0.3, as = "div",
}: RevealProps) {
  const reduce = useReducedMotion();
  const blurOK = useBlurOK();
  const MotionTag = motion[as as keyof typeof motion] as typeof motion.div;

  if (reduce) {
    return (
      <MotionTag className={className} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
        viewport={{ once, amount: 0.2 }} transition={{ duration: 0.4 }}>
        {children}
      </MotionTag>
    );
  }

  const useBlur = blur && blurOK;
  return (
    <MotionTag
      className={className}
      initial={useBlur ? { opacity: 0, y, filter: "blur(16px)" } : { opacity: 0, y }}
      whileInView={useBlur ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 1, y: 0 }}
      viewport={{ once, amount, margin: "0px 0px -10% 0px" }}
      transition={{ duration: DUR, delay, ease: EASE }}
    >
      {children}
    </MotionTag>
  );
}

// Contenedor que revela sus hijos en cascada (usar con `revealItem` /
// `revealItemFade`). El stagger es lo que da la sensación de "van apareciendo
// las cosas a medida que scrolleo".
export function RevealGroup({
  children, className, stagger = 0.19, delay = 0.08, once = true, amount = 0.2, as = "div",
}: {
  children: ReactNode; className?: string; stagger?: number; delay?: number; once?: boolean; amount?: number; as?: ElementType;
}) {
  const MotionTag = motion[as as keyof typeof motion] as typeof motion.div;
  return (
    <MotionTag className={className} initial="hidden" whileInView="show"
      viewport={{ once, amount, margin: "0px 0px -10% 0px" }}
      variants={{ show: { transition: { staggerChildren: stagger, delayChildren: delay } } }}>
      {children}
    </MotionTag>
  );
}

// Item de grilla/lista: SÓLO fade + rise (sin blur a propósito). En grillas el
// costo del filtro se multiplica por ítem y puede trabar en mobile; opacity +
// transform son baratos en GPU y van suaves en cualquier teléfono. Va como
// `variants` en un `motion.*` hijo directo de RevealGroup.
export const revealItem: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.96 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 1.25, ease: EASE } },
};

// Variante sin desplazamiento: sólo fade. Para bloques con hairlines (el bento)
// donde un `y` desalinearía las divisiones al entrar.
export const revealItemFade: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 1.2, ease: EASE } },
};

// Props para revelar CADA ítem con su PROPIO trigger de scroll (no en grupo).
// Motivo: en mobile las grillas se apilan y el RevealGroup animaba TODAS las
// cards juntas al asomar el contenedor (que es altísimo) → las de abajo ya
// habían aparecido cuando llegabas a ellas. Con estos props, cada card aparece
// cuando ELLA entra en viewport. Se aplican con spread sobre un `motion.*`:
//   <motion.div {...revealOnScroll} className="...">…</motion.div>
export const revealOnScroll = {
  initial: { opacity: 0, y: 34 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2, margin: "0px 0px -8% 0px" },
  transition: { duration: 0.85, ease: EASE },
};

// Igual pero sólo fade (sin desplazamiento), para cards donde el `y` no queda bien.
export const revealOnScrollFade = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true, amount: 0.2, margin: "0px 0px -8% 0px" },
  transition: { duration: 0.8, ease: EASE },
};
