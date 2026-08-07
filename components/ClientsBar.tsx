"use client";

import { Reveal } from "@/components/Reveal";

// scale ajusta el tamaño visual de logos cuadrados/emblema que, a igual altura,
// se ven más chicos que un wordmark ancho.
const clients = [
  { name: "Andreani Logística",  logo: "/logos/andreani.png",  scale: 1.15 },
  { name: "Finning",             logo: "/logos/finning.png", scale: 1 },
  { name: "CNP Seguros",         logo: "/logos/cnp.png",       scale: 1.35 },
  { name: "Banco Provincia",     logo: "/logos/provincia.svg", scale: 1 },
  { name: "Volkswagen",          logo: "/logos/volkswagen-logo-2019.png", scale: 1.3 },
  { name: "Hipódromo Argentino", logo: "/logos/hipodromo.svg", scale: 1.05 },
  { name: "Banco Macro",         logo: "/logos/banco-macro-logo-azul.png", scale: 1 },
  { name: "Mapfre",              logo: "/logos/logo-mapfre-2026.png", scale: 1 },
  { name: "Accenture",           logo: "/logos/accenture-svg.png", scale: 1 },
  { name: "Techint",             logo: "/logos/techint-logo-svg.png", scale: 1 },
  { name: "Hausler",             logo: "/logos/hausler.svg",   scale: 1 },
];

export default function ClientsBar() {
  const doubled = [...clients, ...clients];

  return (
    <section id="clientes" className="py-6 overflow-hidden" style={{ background: "#F1F5F9" }}>
      <Reveal as="div" y={14} blur={false} amount={0.4} className="relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#F1F5F9] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#F1F5F9] to-transparent z-10 pointer-events-none" />

        <div className="flex w-max animate-marquee">
          {doubled.map((client, i) => (
            <div key={i} className="flex-shrink-0 mx-4 sm:mx-7">
              <div className="h-12 sm:h-16 flex items-center justify-center w-36 sm:w-48">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={client.logo}
                  alt={client.name}
                  // lazy + async: sin esto React emite un <link rel="preload"> por
                  // cada logo y en mobile veintipico de preloads le pelean el caño
                  // al poster del hero, que es el elemento LCP.
                  loading="lazy"
                  decoding="async"
                  className="w-auto object-contain"
                  style={{
                    height: `calc(clamp(26px, 3.8vw, 42px) * ${client.scale ?? 1})`,
                    maxWidth: "185px",
                    opacity: 0.85,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
