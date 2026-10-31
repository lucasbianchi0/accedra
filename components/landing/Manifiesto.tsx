"use client";

import type { CSSProperties } from "react";
import { useT } from "@/lib/i18n/useT";

/* Las palabras se encienden con el scroll: lo resuelve CSS (`view-timeline`) y
 * sin soporte el texto queda en su color final. */
export default function Manifiesto() {
  const t = useT();
  const palabras = t.landing.manifiesto.split(/\s+/);

  return (
    <section className="lp-contenedor lp-manifiesto">
      <p>
        {palabras.map((p, i) => (
          <span key={i} style={{ "--p": i / palabras.length } as CSSProperties}>
            {p}{" "}
          </span>
        ))}
      </p>
    </section>
  );
}
