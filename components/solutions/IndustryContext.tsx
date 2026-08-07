"use client";

import { Scale } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import type { IndustrySeo } from "./industrySeo";

// Bloque de contexto de una landing por industria: el H2 con la keyword long-tail,
// dos párrafos propios y el marco normativo del vertical.
//
// Este componente es la razón por la que la página se puede indexar. Sin él, el
// único texto distinto entre /firma-biometrica y /firma-biometrica/juridicos sería
// el subtítulo de la portada — y eso Google lo lee como la misma página dos veces.
export default function IndustryContext({ seo }: { seo: IndustrySeo }) {
  return (
    <section className="section relative overflow-hidden">
      <div className="container-x relative z-10">
        <div className="flex items-end gap-6 mb-10 lg:mb-12">
          <div className="min-w-0 max-w-3xl">
            <Reveal as="h2" delay={0.08} className="section-title text-left mt-0 text-balance">
              {seo.h2}
            </Reveal>
          </div>
          <div className="hidden sm:block flex-1 h-px mb-3.5"
            style={{ background: `linear-gradient(90deg, rgba(var(--accent-rgb,43,111,212),0.5), transparent)` }} />
        </div>

        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:gap-16">
          {/* Cuerpo editorial */}
          <div className="max-w-2xl space-y-5">
            {seo.intro.map((p, i) => (
              <Reveal as="p" key={i} preset="item" className="text-gray-300 text-[17px] leading-relaxed">
                {p}
              </Reveal>
            ))}
          </div>

          {/* Marco normativo — aporta entidades reconocibles (leyes, organismos)
              que los motores generativos usan para ubicar la página en un dominio
              temático concreto. No es asesoramiento legal: es contexto. */}
          {seo.compliance && seo.compliance.length > 0 && (
            <Reveal
              as="aside"
              preset="item"
              className="relative rounded-panel p-7 lg:p-8 self-start overflow-hidden"
              style={{
                background: "linear-gradient(180deg, rgba(255,255,255,0.065) 0%, rgba(255,255,255,0.02) 60%, rgba(255,255,255,0.012) 100%)",
                border: "1px solid rgba(255,255,255,0.09)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.13), 0 18px 48px rgba(0,0,0,0.38)",
              }}
            >
              <div className="absolute inset-x-6 top-0 h-px pointer-events-none"
                style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)" }} />

              <div className="flex items-center gap-3 mb-6">
                <span className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: `rgba(var(--accent-rgb,43,111,212),0.14)`, border: `1px solid rgba(var(--accent-rgb,43,111,212),0.3)` }}>
                  <Scale size={19} strokeWidth={1.7} className="text-accent" />
                </span>
                <h3 className="text-white font-semibold text-[15px]">Marco normativo aplicable</h3>
              </div>

              <ul className="space-y-5">
                {seo.compliance.map((c) => (
                  <li key={c.label}>
                    <p className="text-white text-[14px] font-semibold mb-1.5">{c.label}</p>
                    <p className="text-gray-400 text-[13.5px] leading-relaxed">{c.detail}</p>
                  </li>
                ))}
              </ul>

              <p className="mt-7 pt-5 text-[12px] text-gray-500 leading-relaxed border-t border-white/[0.07]">
                Referencias de contexto, no asesoramiento legal. El alcance concreto
                se define en cada implementación.
              </p>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}
