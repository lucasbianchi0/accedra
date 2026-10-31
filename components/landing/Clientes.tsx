"use client";

import { clients } from "@/components/clientsData";
import { useT } from "@/lib/i18n/useT";
import { Entra } from "./Entra";

export default function Clientes() {
  const t = useT();
  const tira = [...clients, ...clients];

  return (
    <section id="clientes" className="lp-contenedor lp-clientes-seccion">
      <Entra tipo="funde" className="lp-clientes">
        <p className="lp-clientes-rotulo">{t.landing.clientes}</p>
        <div className="lp-clientes-pista">
          <div className="lp-marquesina">
            {tira.map((c, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={i}
                src={c.logo}
                alt={i < clients.length ? c.name : ""}
                aria-hidden={i >= clients.length || undefined}
                loading="lazy"
                decoding="async"
                style={{ height: `${Math.round(30 * (c.scale ?? 1))}px` }}
              />
            ))}
          </div>
        </div>
      </Entra>
    </section>
  );
}
