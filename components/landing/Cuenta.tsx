"use client";

import { useEffect, useRef } from "react";

/* Cuenta hasta `valor` al entrar en pantalla. El HTML trae el número real, así
 * que crawlers y visitas sin JS nunca ven un 0. Escribe directo en el nodo:
 * un render por cuadro no hace falta para cambiar un texto. */
export default function Cuenta({ valor }: { valor: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let cuadro = 0;
    el.textContent = "0";
    const ob = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        ob.disconnect();
        const inicio = performance.now();
        const paso = (ahora: number) => {
          const p = Math.min((ahora - inicio) / 1400, 1);
          el.textContent = String(Math.round(valor * (1 - (1 - p) ** 3)));
          if (p < 1) cuadro = requestAnimationFrame(paso);
        };
        cuadro = requestAnimationFrame(paso);
      },
      { threshold: 0.5 },
    );
    ob.observe(el);
    return () => {
      ob.disconnect();
      cancelAnimationFrame(cuadro);
      el.textContent = String(valor);
    };
  }, [valor]);

  return <span ref={ref}>{valor}</span>;
}
