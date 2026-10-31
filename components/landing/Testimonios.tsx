"use client";

import { useState } from "react";
import { useT } from "@/lib/i18n/useT";
import { Entra } from "./Entra";

// El nombre no se traduce; cita y puesto salen del diccionario por índice.
const NOMBRES = ["Germán C.", "Sebastián S.", "Gustavo I."];

export default function Testimonios() {
  const t = useT();
  const [actual, setActual] = useState(0);
  const item = t.testimonials.items[actual];

  return (
    <section className="lp-seccion lp-contenedor lp-testimonios">
      <Entra as="span" tipo="funde" className="lp-rotulo">{t.landing.testimonios.eyebrow}</Entra>
      <Entra>
        <blockquote key={actual} className="lp-cita">&ldquo;{item.quote}&rdquo;</blockquote>
      </Entra>
      <Entra demora={160} className="lp-autores">
        {NOMBRES.map((nombre, i) => (
          <button
            key={nombre}
            type="button"
            onClick={() => setActual(i)}
            aria-pressed={i === actual}
            data-activo={i === actual || undefined}
          >
            <strong>{nombre}</strong>
            <span>{t.testimonials.items[i].role}</span>
          </button>
        ))}
      </Entra>
    </section>
  );
}
