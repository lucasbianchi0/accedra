"use client";

import { MotionConfig } from "framer-motion";

/* Respeta la preferencia "Reducir movimiento" del SO en TODO framer-motion
   (el bloque CSS de reduced-motion sólo alcanza a las animaciones CSS, no a
   los transforms que framer maneja por JS). */
export default function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
