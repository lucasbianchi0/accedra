"use client";

import { useEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from "react";

/* Disparador de las entradas de la portada. Marca `data-in` una sola vez cuando
 * el elemento aparece; todo el movimiento vive en landing.css. Un solo observer
 * para toda la página, y sin él el contenido se ve igual: el estado oculto está
 * dentro de `@media (scripting: enabled)`. */

let observador: IntersectionObserver | undefined;

function observar(el: HTMLElement) {
  if (typeof IntersectionObserver === "undefined") {
    el.dataset.in = "1";
    return () => {};
  }
  observador ??= new IntersectionObserver(
    (entradas, self) => {
      for (const e of entradas) {
        if (!e.isIntersecting) continue;
        (e.target as HTMLElement).dataset.in = "1";
        self.unobserve(e.target);
      }
    },
    { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
  );
  const ob = observador;
  ob.observe(el);
  return () => ob.unobserve(el);
}

type Tipo = "sube" | "funde" | "titulo" | "foto";

export function Entra({
  as = "div",
  tipo = "sube",
  demora = 0,
  className,
  style,
  children,
  ...resto
}: {
  as?: ElementType;
  tipo?: Tipo;
  /** Milisegundos. */
  demora?: number;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
} & Record<string, unknown>) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => (ref.current ? observar(ref.current) : undefined), []);
  const Tag = as;
  return (
    <Tag
      ref={ref}
      data-entra={tipo}
      className={className}
      style={{ "--d": `${demora}ms`, ...style } as CSSProperties}
      {...resto}
    >
      {children}
    </Tag>
  );
}

/* Parte un texto en palabras que suben desde atrás de una máscara. El texto real
 * sigue en el DOM, palabra por palabra, así que se lee y se indexa igual. */
export function Palabras({
  texto,
  desde = 0,
  className,
}: {
  texto: string;
  /** Índice de la primera palabra, para continuar la cascada entre líneas. */
  desde?: number;
  className?: string;
}) {
  return (
    <span className={className}>
      {texto.split(/\s+/).filter(Boolean).map((palabra, i) => (
        <span key={i}>
          <span className="lp-p">
            <span style={{ "--i": i + desde } as CSSProperties}>{palabra}</span>
          </span>{" "}
        </span>
      ))}
    </span>
  );
}
