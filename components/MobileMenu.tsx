"use client";

import { LazyMotion, MotionConfig, m, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import LangSwitcher from "@/components/LangSwitcher";
import { whatsappLink } from "@/lib/whatsapp";
import { track } from "@/lib/track";

/* Overlay del menú mobile — el ÚNICO lugar del sitio que todavía usa
 * framer-motion, y por eso vive en su propio archivo.
 *
 * Es un drill-in de dos vistas (principal ↔ soluciones) con transición cruzada:
 * una entra mientras la otra sale, y la que sale tiene que seguir montada hasta
 * terminar su animación. Eso es exactamente lo que resuelve `AnimatePresence` y
 * lo que en CSS puro obligaría a escribir una máquina de estados a mano. Acá la
 * librería se gana el lugar; en un fade de scroll no.
 *
 * Lo que cambia es CUÁNDO se paga. El Navbar lo trae con `next/dynamic`, así
 * que framer no viaja en el bundle de arranque: se descarga la primera vez que
 * alguien toca la hamburguesa. Para entonces las métricas ya se midieron, y el
 * visitante que nunca abre el menú —la mayoría— no lo descarga nunca.
 *
 * Por lo mismo `LazyMotion`/`MotionConfig` se montan ACÁ y no en el layout:
 * tenerlos en la raíz volvía a meter la librería en el arranque, que es
 * justamente lo que este archivo existe para evitar.
 */

const BLUE_RGB = "43,111,212";

type Solution = { slug: string; icon: LucideIcon; label: string };
type OtherLink = { href: string; label: string };

const loadFeatures = () => import("framer-motion").then((mod) => mod.domAnimation);

export default function MobileMenu({
  open,
  onClose,
  solutions,
  otherLinks,
  activeSlug,
  labels,
}: {
  open: boolean;
  onClose: () => void;
  solutions: Solution[];
  otherLinks: OtherLink[];
  activeSlug?: string;
  labels: { services: string; cta: string; language: string };
}) {
  // Sub-vista de soluciones. Vive acá adentro porque sólo existe mientras el
  // overlay está montado.
  const [solView, setSolView] = useState(false);

  return (
    <LazyMotion features={loadFeatures} strict>
      {/* Respeta "Reducir movimiento" del SO en todo lo que anime framer (el
          bloque CSS de reduced-motion sólo alcanza a las animaciones CSS). */}
      <MotionConfig reducedMotion="user">
        {/* onExitComplete: la sub-vista vuelve a "principal" RECIÉN cuando el menú
            terminó de cerrarse, para que al clickear una opción no se vea el panel
            deslizándose para atrás mientras se desvanece. */}
        <AnimatePresence onExitComplete={() => setSolView(false)}>
          {open && (
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 flex flex-col md:hidden overflow-x-hidden"
              style={{
                background: "rgba(7,16,29,0.97)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
              }}
            >
              <div className="h-[2px] flex-shrink-0"
                style={{ background: `linear-gradient(to right, transparent, rgba(${BLUE_RGB},0.9) 30%, rgba(${BLUE_RGB},0.9) 70%, transparent)` }} />
              <div className="absolute inset-0 pointer-events-none"
                style={{ backgroundImage: `radial-gradient(circle, rgba(${BLUE_RGB},0.13) 1px, transparent 1px)`, backgroundSize: "28px 28px", opacity: 0.3 }} />
              <div className="absolute top-0 right-0 w-80 h-80 pointer-events-none"
                style={{ background: `radial-gradient(circle at top right, rgba(${BLUE_RGB},0.18) 0%, transparent 65%)` }} />

              <div className="h-[72px] flex-shrink-0" />

              {/* Nav — dos vistas: principal ↔ soluciones (drill-in con volver) */}
              <div className="relative flex-1 overflow-hidden">
                <AnimatePresence mode="wait" initial={false}>
                  {!solView ? (
                    <m.nav
                      key="main"
                      initial={{ opacity: 0, x: -24 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -24 }}
                      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute inset-0 overflow-y-auto overflow-x-hidden flex flex-col justify-center px-6"
                    >
                      {/* Soluciones — abre la sub-vista (no despliega inline) */}
                      <button
                        onClick={() => setSolView(true)}
                        className="w-full group flex items-center gap-5 py-[17px] px-3 -mx-3 rounded-2xl border-b transition-colors hover:bg-white/[0.03]"
                        style={{ borderColor: "rgba(255,255,255,0.05)" }}
                      >
                        <span className="text-[11px] font-bold tabular-nums w-5 flex-shrink-0" style={{ color: `rgba(${BLUE_RGB},0.45)` }}>01</span>
                        <span className="text-white text-[22px] font-bold leading-none group-hover:text-blue-300 transition-colors">{labels.services}</span>
                        <ArrowRight size={18} className="ml-auto text-gray-600 group-hover:text-blue-400 group-hover:translate-x-1 transition-all duration-200" />
                      </button>

                      {otherLinks.map((l, i) => (
                        <a
                          key={l.href}
                          href={l.href}
                          onClick={onClose}
                          className="group flex items-center gap-5 py-[17px] px-3 -mx-3 rounded-2xl border-b last:border-0 transition-colors duration-200 hover:bg-white/[0.03] active:bg-white/[0.05]"
                          style={{ borderColor: "rgba(255,255,255,0.05)" }}
                        >
                          <span className="text-[11px] font-bold tabular-nums w-5 flex-shrink-0" style={{ color: `rgba(${BLUE_RGB},0.45)` }}>
                            {String(i + 2).padStart(2, "0")}
                          </span>
                          <span className="text-white text-[22px] font-bold leading-none group-hover:text-blue-300 transition-colors duration-200">{l.label}</span>
                          <ArrowRight size={15} className="ml-auto text-gray-700 group-hover:text-blue-400 group-hover:translate-x-1 transition-all duration-200" />
                        </a>
                      ))}
                    </m.nav>
                  ) : (
                    <m.nav
                      key="sol"
                      initial={{ opacity: 0, x: 24 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 24 }}
                      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute inset-0 overflow-y-auto overflow-x-hidden flex flex-col justify-center px-6"
                    >
                      {/* Volver a la vista principal */}
                      <button
                        onClick={() => setSolView(false)}
                        className="self-start inline-flex items-center gap-1.5 mb-7 py-2 pr-3 pl-1 -ml-1 rounded-full text-gray-400 hover:text-white transition-colors"
                      >
                        <ChevronLeft size={20} />
                        <span className="text-sm font-semibold uppercase tracking-wide">Volver</span>
                      </button>

                      <div className="space-y-1">
                        {solutions.map((s) => {
                          const Icon = s.icon;
                          const active = s.slug === activeSlug;
                          return (
                            <Link
                              key={s.slug}
                              href={`/soluciones/${s.slug}`}
                              onClick={onClose}
                              className="flex items-center gap-4 py-3 px-3 -mx-3 rounded-2xl transition-colors hover:bg-white/[0.04] active:bg-white/[0.06]"
                            >
                              <span className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                                style={{ background: `rgba(${BLUE_RGB},0.16)`, border: `1px solid rgba(${BLUE_RGB},0.3)` }}>
                                <Icon size={17} style={{ color: "#7FB3F8" }} />
                              </span>
                              <span className={`text-[18px] font-semibold ${active ? "text-blue-300" : "text-white"}`}>{s.label}</span>
                              <ArrowRight size={15} className="ml-auto text-gray-600" />
                            </Link>
                          );
                        })}
                      </div>
                    </m.nav>
                  )}
                </AnimatePresence>
              </div>

              {/* Bottom: contacto + acciones (CTA + WhatsApp) e idioma al final */}
              <div className="relative px-6 pb-10 flex-shrink-0 space-y-3">
                <div className="h-px mb-5" style={{ background: "rgba(255,255,255,0.06)" }} />

                {/* CTA principal */}
                <a
                  href="/#contacto"
                  onClick={onClose}
                  className="flex items-center justify-center gap-2.5 w-full py-4 rounded-full text-white font-semibold text-[15px] transition-opacity hover:opacity-90 active:scale-[0.99]"
                  style={{ background: `#2560BC`, boxShadow: `0 8px 28px rgba(${BLUE_RGB},0.35)` }}
                >
                  {labels.cta}
                  <ArrowRight size={15} />
                </a>

                {/* WhatsApp — arriba del idioma */}
                <a
                  href={whatsappLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => track({ type: "click", name: "whatsapp", target: "menu" })}
                  className="flex items-center justify-center gap-2.5 w-full py-4 rounded-full text-white font-semibold text-[15px] transition-opacity hover:opacity-90 active:scale-[0.99]"
                  style={{ background: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)", boxShadow: "0 8px 24px rgba(37,211,102,0.35)" }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="white" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  WhatsApp
                </a>

                {/* Idioma — abajo de todo */}
                <div className="flex items-center justify-between gap-3 pt-4 mt-1" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  <span className="text-gray-500 text-xs font-semibold uppercase tracking-[0.14em]">{labels.language}</span>
                  <LangSwitcher variant="mobile" />
                </div>
              </div>
            </m.div>
          )}
        </AnimatePresence>
      </MotionConfig>
    </LazyMotion>
  );
}
