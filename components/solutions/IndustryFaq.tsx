"use client";

import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { Reveal, revealOnScroll } from "@/components/Reveal";
import type { IndustryFaq as Faq } from "./industrySeo";

// Preguntas frecuentes de una landing por industria.
//
// Usa <details>/<summary> nativo a propósito, en vez de un acordeón con estado:
// el texto de las respuestas queda SIEMPRE en el DOM aunque el panel esté cerrado.
// Un acordeón que monta la respuesta al abrirla se la esconde a los crawlers y
// desperdicia justamente el contenido que los motores generativos citan.
export default function IndustryFaq({ faqs }: { faqs: Faq[] }) {
  if (!faqs.length) return null;

  return (
    <section className="section relative overflow-hidden">
      <div className="container-x relative z-10">
        <div className="flex items-end gap-6 mb-10 lg:mb-12">
          <div className="min-w-0 max-w-2xl">
            <Reveal as="h2" delay={0.08} className="section-title text-left mt-0 text-balance">
              Preguntas frecuentes
            </Reveal>
          </div>
          <div className="hidden sm:block flex-1 h-px mb-3.5"
            style={{ background: `linear-gradient(90deg, rgba(var(--accent-rgb,43,111,212),0.5), transparent)` }} />
        </div>

        <div className="max-w-3xl space-y-3">
          {faqs.map((f) => (
            <motion.div key={f.q} {...revealOnScroll}>
              <details
                className="group/faq rounded-panel overflow-hidden transition-colors duration-300"
                style={{
                  background: "linear-gradient(180deg, rgba(255,255,255,0.055) 0%, rgba(255,255,255,0.018) 100%)",
                  border: "1px solid rgba(255,255,255,0.09)",
                }}
              >
                <summary className="flex items-start gap-4 cursor-pointer list-none px-6 py-5 sm:px-7 sm:py-6 hover:bg-white/[0.03] transition-colors">
                  {/* h3 dentro del summary: da jerarquía de encabezados real a cada
                      pregunta, que es lo que lee el buscador. */}
                  <h3 className="flex-1 text-white text-[15.5px] sm:text-base font-semibold leading-snug">
                    {f.q}
                  </h3>
                  <span
                    className="mt-0.5 shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-transform duration-300 group-open/faq:rotate-45"
                    style={{ background: `rgba(var(--accent-rgb,43,111,212),0.14)`, border: `1px solid rgba(var(--accent-rgb,43,111,212),0.3)` }}
                    aria-hidden="true"
                  >
                    <Plus size={15} strokeWidth={2} className="text-accent" />
                  </span>
                </summary>
                <div className="px-6 pb-6 sm:px-7 sm:pb-7 -mt-1">
                  <p className="text-gray-300 text-[15px] leading-relaxed max-w-2xl pr-10">
                    {f.a}
                  </p>
                </div>
              </details>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
