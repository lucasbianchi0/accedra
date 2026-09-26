"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Una lista con scroll propio que se desvanece hacia abajo mientras haya algo
 * más para ver.
 *
 * POR QUÉ LLEVA JAVASCRIPT
 *
 * Primero estuvo hecho sólo con CSS: `mask-image` sobre una variable animada
 * por `animation-timeline: scroll(self block)`, que es la forma moderna de
 * atar un efecto al scroll sin JS. La animación quedaba en estado inactivo
 * —`progress: null`— y la máscara nunca se movía. No vale la pena pelear con
 * eso para un detalle de borde: catorce líneas de listener hacen lo mismo y se
 * comportan igual en todos lados.
 *
 * QUÉ RESUELVE
 *
 * Que el último ítem no se corte a filo contra el borde del panel, que es lo
 * que hace pensar que la lista terminó ahí. El degradado aparece sólo cuando
 * hay contenido abajo, y se apaga al llegar al final: un desvanecido fijo
 * mentiría dos veces —apagando el último ítem cuando no hay nada más, y
 * apagando justo lo que fuiste a leer—.
 *
 * El estado viaja en `data-desborda` y lo pinta el CSS (ver globals.css), así
 * que este componente no toca estilos: sólo mide.
 */
export default function ListaDesvanecida({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const medir = () => {
      // 2 px de tolerancia: con zoom del navegador o alturas fraccionarias,
      // `scrollTop + clientHeight` no llega nunca a igualar a `scrollHeight` y
      // el desvanecido se quedaría encendido al final de la lista.
      const restante = el.scrollHeight - el.clientHeight - el.scrollTop;
      el.dataset.desborda = restante > 2 ? "si" : "no";
    };

    medir();
    el.addEventListener("scroll", medir, { passive: true });

    // La altura cambia cuando cargan las miniaturas y cuando se redimensiona
    // la ventana; sin observar el tamaño, el panel abre sin desvanecido y lo
    // gana recién al primer scroll.
    const ro = new ResizeObserver(medir);
    ro.observe(el);
    for (const hijo of Array.from(el.children)) ro.observe(hijo);

    return () => {
      el.removeEventListener("scroll", medir);
      ro.disconnect();
    };
  }, []);

  return (
    <div ref={ref} data-desborda="no" className={`lista-desvanecida ${className}`}>
      {children}
    </div>
  );
}
