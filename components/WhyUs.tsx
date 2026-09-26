"use client";

import { ArrowRight, ArrowUpRight, Package, Mountain, Landmark, Building2, type LucideIcon } from "lucide-react";
import { useT } from "@/lib/i18n/useT";
import Link from "next/link";
import { track } from "@/lib/track";
import Image from "next/image";
import { useState } from "react";
import { HOME_CASES } from "./homeCases";
import { Reveal } from "@/components/Reveal";
import Testimonials from "@/components/Testimonials";

const BLUE_RGB = "43,111,212";
const LINKEDIN = "https://www.linkedin.com/company/accedra-s.a.";

const INDUSTRY_ICONS: Record<string, LucideIcon> = {
  "Logística": Package, "Minería": Mountain, "Banca": Landmark,
};

// Casos de éxito: header centrado + paneles de foto que se abren en hover, con
// la métrica principal como titular + banner de cierre. Debajo, testimonios.
export default function WhyUs() {
  const t = useT();
  const cases = HOME_CASES;
  // Panel abierto en desktop; null = los tres parejos.
  const [active, setActive] = useState<number | null>(null);
  // Card visible en el carrusel mobile (para los puntos).
  const [slide, setSlide] = useState(0);

  return (
    <section id="nosotros" className="section relative">
        <div className="container-x relative z-10">

          {/* ── Header centrado ── */}
          <Reveal className="title-halo text-center max-w-3xl mx-auto mb-12">
            <h2 className="section-title mt-3">
              {t.whyUs.titlePre}{" "}
              <span className="gradient-text">{t.whyUs.titleHighlight}</span>
            </h2>
            <div className="mx-auto mt-6 h-px w-28"
              style={{ background: `linear-gradient(90deg, transparent, rgba(${BLUE_RGB},0.7), transparent)` }} />
          </Reveal>

          {/* ── Casos: paneles de foto a sangre. En desktop se reparten el ancho y
              el que tiene hover/foco se estira y despliega el detalle; sin hover
              quedan parejos. En mobile es un carrusel con snap: cada card ocupa
              ~78% del ancho y la siguiente asoma (aun con la pestaña del blog encima);
              todas abiertas, con puntos que marcan en cuál estás. ── */}
          {cases.length > 0 && (
            <Reveal preset="item">
              <div className="flex gap-3 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden snap-x snap-mandatory scroll-px-5 sm:scroll-px-8 -mx-5 px-5 sm:-mx-8 sm:px-8 lg:mx-0 lg:px-0 lg:gap-[3px] lg:h-[480px] lg:rounded-panel lg:overflow-hidden"
                onMouseLeave={() => setActive(null)}
                onScroll={(e) => {
                  // Solo el carrusel mobile scrollea: la card más cerca del borde es la actual
                  const el = e.currentTarget;
                  const card = el.firstElementChild as HTMLElement | null;
                  if (!card) return;
                  setSlide(Math.round(el.scrollLeft / (card.offsetWidth + 12)));
                }}>
                {cases.map((c, i) => {
                  const TagIcon = INDUSTRY_ICONS[c.tag] ?? Building2;
                  const lead = c.stats[0];
                  const open = active === i;
                  return (
                    <Link key={c.title} href={`/casos/home/${i}`} aria-label={`Ver caso: ${c.title}`}
                      data-open={open}
                      onMouseEnter={() => setActive(i)}
                      onFocus={() => setActive(i)}
                      onClick={() => track({ type: "click", name: "caso_card", target: `home/${i}` })}
                      className="group relative flex h-[400px] w-[78vw] max-w-[360px] shrink-0 snap-start lg:w-auto lg:max-w-none lg:h-auto lg:flex-[1_1_0%] lg:data-[open=true]:grow-[2.1] lg:transition-[flex-grow] lg:duration-700 lg:ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none min-w-0 overflow-hidden rounded-panel lg:rounded-none focus-visible:outline-none">
                      <Image
                        src={c.image}
                        alt={c.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 760px"
                        className="object-cover transition-transform duration-[900ms] ease-out group-data-[open=true]:scale-[1.04]"
                        draggable={false}
                      />
                      {/* Lectura: oscurece de abajo hacia arriba; el abierto se aclara un poco */}
                      <div className="absolute inset-0 transition-opacity duration-500"
                        style={{ background: "linear-gradient(180deg, rgba(8,14,26,0.35) 0%, rgba(8,14,26,0.15) 30%, rgba(8,14,26,0.72) 62%, rgba(8,14,26,0.95) 100%)" }} />
                      <div className="absolute inset-0 bg-navy-900/40 transition-opacity duration-500 group-data-[open=true]:opacity-60" />
                      {/* Sombra detrás del texto: pesa abajo-izquierda, donde vive el
                          bloque, y deja respirar la foto arriba-derecha. En mobile el
                          detalle está siempre abierto, así que ahí va siempre. */}
                      <div className="absolute inset-0 transition-opacity duration-500 lg:opacity-0 group-data-[open=true]:opacity-100"
                        style={{ background: "radial-gradient(120% 85% at 0% 100%, rgba(6,12,22,0.95) 0%, rgba(6,12,22,0.82) 40%, rgba(6,12,22,0.45) 72%, transparent 100%)" }} />
                      {/* Ring azul en foco de teclado */}
                      <div className="absolute inset-0 z-[3] rounded-[inherit] opacity-0 group-focus-visible:opacity-100 pointer-events-none"
                        style={{ boxShadow: `inset 0 0 0 2px rgba(${BLUE_RGB},0.7)` }} />

                      <span className="absolute top-5 left-5 z-[2] inline-flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full"
                        style={{ background: "rgba(10,18,32,0.6)", color: "#DCE9FB", border: "1px solid rgba(255,255,255,0.14)", backdropFilter: "blur(6px)" }}>
                        <TagIcon size={12} className="text-blue-300" />
                        {c.tag}
                      </span>
                      <ArrowUpRight size={22} className="absolute top-5 right-5 z-[2] text-white/50 transition-all duration-300 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />

                      <div className="relative z-[2] mt-auto w-full p-6 sm:p-8 [text-shadow:0_1px_12px_rgba(0,0,0,0.45)]">
                        {/* La métrica principal hace de titular, como un número de cartel */}
                        <div className="font-display font-bold text-white leading-none tracking-tight whitespace-nowrap text-[44px] sm:text-[52px]">
                          {lead.value}
                        </div>
                        <div className="mt-2 text-[12px] font-semibold uppercase tracking-[0.14em]" style={{ color: "#8DBBF5" }}>{lead.label}</div>
                        <h3 className="mt-4 text-white/90 text-[17px] font-semibold leading-snug max-w-[34ch] line-clamp-2">{c.title}</h3>

                        {/* Detalle: se despliega en el abierto (siempre visible en mobile) */}
                        <div className="grid grid-rows-[1fr] lg:grid-rows-[0fr] lg:opacity-0 group-data-[open=true]:grid-rows-[1fr] group-data-[open=true]:opacity-100 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none">
                          <div className="min-h-0 overflow-hidden">
                            {/* Ancho fijo en desktop: el texto no se reacomoda mientras el panel se estira */}
                            <div className="max-w-[40ch] lg:w-[40ch] lg:max-w-none pt-2">
                              <p className="text-white/75 text-[13.5px] leading-relaxed line-clamp-2">{c.desc}</p>
                              {/* CTA: pastilla blanca como el botón del banner de cierre */}
                              <span className="mt-5 inline-flex items-center gap-2 pl-5 pr-1.5 py-1.5 rounded-full text-[14px] font-semibold [text-shadow:none] transition-all group-hover:gap-3"
                                style={{ background: "#ffffff", color: "#1E4C97", boxShadow: "0 10px 30px rgba(0,0,0,0.35)" }}>
                                Ver caso
                                <span className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: "rgba(30,76,151,0.12)" }}>
                                  <ArrowRight size={14} />
                                </span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
              <div className="mt-4 flex justify-center gap-1.5 lg:hidden" aria-hidden>
                {cases.map((c, i) => (
                  <span key={c.title} className={`h-1.5 rounded-full transition-all duration-300 ${i === slide ? "w-5 bg-blue-400" : "w-1.5 bg-white/25"}`} />
                ))}
              </div>
            </Reveal>
          )}

          {/* ── Banner de cierre — banda de marca con gradiente animado (cta-ocean),
              reflejos que derivan y botón blanco invertido, igual que el CTA de
              soluciones para que la página cierre coherente. ── */}
          <Reveal delay={0.1} className="mt-8">
            <div className="cta-ocean relative overflow-hidden rounded-panel px-8 sm:px-10 py-8 flex flex-col sm:flex-row items-center justify-between gap-6"
              style={{ border: `1px solid rgba(${BLUE_RGB},0.35)`, boxShadow: "0 24px 60px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.14), inset 0 -50px 80px rgba(0,0,0,0.4)" }}>
              {/* Reflejos que derivan sobre la superficie a distinto ritmo */}
              <div className="absolute -top-24 -right-10 w-80 h-80 rounded-full blur-3xl pointer-events-none cta-drift-a"
                style={{ background: "radial-gradient(circle, rgba(90,162,245,0.28), transparent 70%)" }} />
              <div className="absolute -bottom-28 left-1/4 w-72 h-72 rounded-full blur-3xl pointer-events-none cta-drift-b"
                style={{ background: "radial-gradient(circle, rgba(43,111,212,0.32), transparent 70%)" }} />
              {/* Trama de puntos que se desvanece */}
              <div className="absolute inset-0 opacity-[0.14] pointer-events-none"
                style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.7) 1px, transparent 1px)", backgroundSize: "22px 22px", maskImage: "linear-gradient(90deg, transparent, #000 60%)", WebkitMaskImage: "linear-gradient(90deg, transparent, #000 60%)" }} />

              <div className="relative text-center sm:text-left">
                <p className="text-white text-[19px] sm:text-[21px] font-bold mb-1.5 leading-snug">Más de 400 empresas confían en Accedra IT Solutions</p>
                <p className="text-white/80 text-[14px]">Somos el partner tecnológico para proyectos que mueven al país.</p>
              </div>
              <a href={LINKEDIN} target="_blank" rel="noopener noreferrer"
                className="relative flex-shrink-0 inline-flex items-center gap-2 pl-6 pr-2 py-2.5 rounded-full text-[15px] font-semibold transition-all hover:gap-3"
                style={{ background: "#ffffff", color: "#1E4C97", boxShadow: "0 10px 30px rgba(0,0,0,0.28)" }}>
                Ver todos los casos de éxito
                <span className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "rgba(30,76,151,0.12)" }}>
                  <ArrowRight size={15} />
                </span>
              </a>
            </div>
          </Reveal>

          {/* Testimonios: cierran el bloque de confianza, pegados a los casos */}
          <Testimonials />

        </div>
      </section>
  );
}
