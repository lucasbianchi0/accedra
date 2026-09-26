"use client";

import { useEffect, useRef, useState } from "react";

// Cuenta de 0 al número cuando entra en viewport. Acepta "17+", "400+", etc.
export default function CountUp({ value, className }: { value: string; className?: string }) {
  const m = value.match(/^(\D*)(\d+)(.*)$/);
  const prefix = m ? m[1] : "";
  const target = m ? parseInt(m[2], 10) : 0;
  const suffix = m ? m[3] : "";

  const [n, setN] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const done = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setN(target);
      return;
    }
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !done.current) {
          done.current = true;
          const dur = 1400;
          const start = performance.now();
          const tick = (now: number) => {
            // El progreso se acota por ABAJO además de por arriba. El
            // timestamp que recibe `requestAnimationFrame` es el del comienzo
            // del cuadro, y puede ser anterior al `performance.now()` que se
            // leyó al disparar: ahí `p` da negativo, la curva `1-(1-p)^3`
            // devuelve un valor negativo y la cuenta arranca mostrando "-11+".
            // Dura un cuadro, pero cae justo en la franja de credibilidad del
            // hero.
            const p = Math.min(Math.max((now - start) / dur, 0), 1);
            const eased = 1 - Math.pow(1 - p, 3);
            setN(Math.round(target * eased));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [target]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {n}
      {suffix}
    </span>
  );
}
