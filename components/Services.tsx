"use client";

import type { CSSProperties } from "react";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { track } from "@/lib/track";
import { ArrowRight } from "lucide-react";
import { useT } from "@/lib/i18n/useT";
import ServiceIllustration from "@/components/ServiceIllustration";
import { Reveal } from "@/components/Reveal";

const BLUE_RGB = "43,111,212";

// Metadatos no traducibles (slug, destacado). Título, propuesta de valor e items
// salen del diccionario por índice (t.services.columns[i]).
// `accent` = color de identidad de cada solución (RGB). Por ahora sólo tiñe el
// aura/blur de fondo que aparece al hacer hover. La idea es luego llevar el mismo
// color a cada página. Familia fría-joya, pareja en el círculo cromático.
const columns = [
  { slug: "networking", accent: "59,130,246" },      // azul (ancla)
  { slug: "firma-biometrica", featured: true, accent: "124,108,246" }, // índigo/violeta
  { slug: "consultoria", accent: "6,182,212" },      // cian/teal
  { slug: "seguridad", accent: "16,185,129" },       // esmeralda
  { slug: "software-ai", accent: "180,92,242" },     // púrpura/fucsia
];

export default function Services() {
  const t = useT();

  // Parallax ligado al scroll: header y grilla derivan a distinto ritmo mientras
  // la sección cruza el viewport → profundidad, "sección viva". Sutil (rangos
  // chicos) para que sea refinado, no estridente. `transform` no reflowea el
  // layout, así que es barato y no mueve nada de su lugar real.
  //
  // Antes esto eran `useScroll` + `useTransform` de framer. Se escribe a mano por
  // el mismo motivo que el resto de la página dejó la librería: `m` y sus hooks
  // viajan en el bundle de ARRANQUE, y este efecto no puede ocurrir antes de que
  // el visitante scrollee hasta la tercera sección. El cálculo es una regla de
  // tres sobre `getBoundingClientRect`; lo que hacía framer no era más que eso.
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    // En touch no corre: escribir variables en cada evento de scroll obliga a
    // recomponer mientras el dedo arrastra, y es el hilo principal del teléfono
    // el recurso que estamos cuidando. Mismo criterio que AmbientLight.
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      // `progress` replica el `offset: ["start end", "end start"]` de framer: 0
      // cuando el borde superior de la sección toca el borde inferior de la
      // ventana, 1 cuando su borde inferior toca el superior de la ventana.
      const span = window.innerHeight + r.height;
      const p = Math.min(1, Math.max(0, (window.innerHeight - r.top) / span));
      el.style.setProperty("--head-y", `${34 + p * (-30 - 34)}px`);
      el.style.setProperty("--grid-y", `${14 + p * (-18 - 14)}px`);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section id="servicios" ref={sectionRef} className="section relative">
      {/* Sin fondo propio: el clima visual lo pone AmbientLight a nivel de página.
          Cualquier glow local acá quedaría recortado por la sección y dibujaría
          una costura contra la vecina. */}
      <div className="container-x relative z-10">

        {/* Header (sin eyebrow) — capa de parallax propia (deriva más que la grilla).
            El fallback `0px` de la variable es lo que se ve en mobile y con
            "reducir movimiento", donde el efecto no corre: sin desplazamiento. */}
        <div className="section-head title-halo" style={{ transform: "translateY(var(--head-y, 0px))" }}>
          <Reveal as="h2" className="section-title">{t.services.title}</Reveal>
          <Reveal as="p" delay={0.1} className="section-sub">{t.services.subtitle}</Reveal>
        </div>

        {/* Grilla — segunda capa de parallax (deriva menos) */}
        <div style={{ transform: "translateY(var(--grid-y, 0px))" }}>
          <CardsGrid t={t} />
        </div>

        {/* El CTA de diagnóstico vive al final de Partners: cierra el bloque
            soluciones + tecnologías una sola vez, no dos. */}

      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// OPCIÓN 2 — 5 cards iguales, corporativas premium
// Todas las cards del MISMO tamaño, en una sola fila que entra en la view (5 col
// en lg). Se conservan las ilustraciones, su hover y su fondo; cambia la caja de
// la card y la manera de mostrar los tags de cada solución (chips en columna,
// número de tags acotado para que respiren en el ancho angosto).
// ─────────────────────────────────────────────────────────────────────────────
function CardsGrid({ t }: { t: ReturnType<typeof useT> }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 lg:gap-5 items-stretch">
      {columns.map((col, i) => {
        const cd = t.services.columns[i];
        const featured = !!col.featured;
        const accent = col.accent ?? BLUE_RGB; // color de identidad para el hover
        // Bento: 3 arriba (col-span-2 = 1/3 cada una) + 2 abajo ANCHAS
        // (col-span-3 = 1/2 cada una) → la fila de abajo llena todo el ancho.
        // En tablet (sm, 2 col) la 5ª card quedaba sola media fila → la hacemos
        // full-width ahí para evitar el hueco (2 + 2 + 1full).
        const rowSpan =
          (i === 4 ? "sm:col-span-2 " : "") + (i >= 3 ? "lg:col-span-3" : "lg:col-span-2");
        return (
          <Reveal key={col.slug} preset="item"
            className={`h-full ${rowSpan}`}>
            <Link href={`/soluciones/${col.slug}`}
              aria-label={`${t.services.viewSolution}: ${cd.title}`}
              // Qué solución despierta más interés en la home. Es la señal que
              // dice hacia qué servicio conviene empujar presupuesto de Ads.
              onClick={() => track({ type: "click", name: "solucion_card", target: col.slug })}
              className="group relative flex h-full flex-col rounded-[1.5rem] overflow-hidden border focus-visible:outline-none transition-transform duration-500 hover:-translate-y-1.5"
              style={{
                // Vidrio translúcido + blur del fondo, igual que Testimonios/WhyUs.
                // La destacada lleva un tinte azul; las demás vidrio neutro.
                background: featured
                  ? `linear-gradient(180deg, rgba(${BLUE_RGB},0.16) 0%, rgba(255,255,255,0.03) 100%)`
                  : "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.025) 100%)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                borderColor: featured ? `rgba(${BLUE_RGB},0.4)` : "rgba(255,255,255,0.1)",
                boxShadow: featured
                  ? `inset 0 1px 0 rgba(255,255,255,0.14), 0 18px 48px rgba(0,0,0,0.4)`
                  : "inset 0 1px 0 rgba(255,255,255,0.12), 0 18px 48px rgba(0,0,0,0.36)",
              }}
            >
              {/* Glow de fondo en hover — tiñe TODA la card con el color de identidad
                  de la solución. z-[1]: sobre el fill base, debajo del contenido. */}
              <div className="absolute inset-0 z-[1] rounded-[inherit] opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: `radial-gradient(ellipse 100% 76% at 50% 30%, rgba(${accent},0.30) 0%, rgba(${accent},0.11) 42%, transparent 72%)` }} />
              {/* Ring en hover/foco — mismo acento. En mobile (sin hover) va siempre encendido. */}
              <div className="absolute inset-0 z-[4] rounded-[inherit] opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-visible:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{ boxShadow: `inset 0 0 0 1px rgba(${accent},0.6), inset 0 26px 60px rgba(${accent},0.16), 0 0 40px rgba(${accent},0.25)` }} />

              {/* Fondo premium: textura + spotlight (conservado de la opción 1) */}
              <div className="absolute inset-0 pointer-events-none z-[1]">
                <div className="absolute inset-0"
                  style={{
                    backgroundImage: "radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)",
                    backgroundSize: "15px 15px",
                    maskImage: "radial-gradient(ellipse 82% 58% at 50% 0%, #000 18%, transparent 74%)",
                    WebkitMaskImage: "radial-gradient(ellipse 82% 58% at 50% 0%, #000 18%, transparent 74%)",
                  }} />
                <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-[300px] h-[210px] rounded-full blur-3xl"
                  style={{ background: `radial-gradient(circle, rgba(${BLUE_RGB},${featured ? 0.24 : 0.15}) 0%, transparent 70%)` }} />
              </div>

              {/* Badge Diferencial */}
              {featured && (
                <span className="absolute top-3.5 right-3.5 z-10 text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
                  style={{ background: `rgba(${BLUE_RGB},0.32)`, color: "#EAF2FE", border: `1px solid rgba(${BLUE_RGB},0.55)`, backdropFilter: "blur(6px)" }}>
                  {t.services.featuredBadge}
                </span>
              )}

              {/* Ilustración — mismo tratamiento (fondo + hover) que la opción 1.
                  Sin chips hay aire de sobra, así que le damos altura y presencia. */}
              <div className="relative z-[2] h-48 overflow-hidden">
                <div className="absolute inset-0"
                  style={{ background: `radial-gradient(ellipse 60% 85% at 50% 88%, rgba(${BLUE_RGB},0.32) 0%, transparent 66%)` }} />
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[280px] rounded-full blur-3xl opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: `radial-gradient(circle, rgba(${accent},0.85) 0%, transparent 66%)` }} />
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[220px] h-[170px] rounded-full blur-2xl opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: `radial-gradient(circle, rgba(${accent},0.6) 0%, transparent 70%)` }} />
                <div className="absolute left-1/2 -translate-x-1/2 origin-bottom transition-transform duration-500 scale-[0.92] group-hover:-translate-y-4 group-hover:scale-[0.97]"
                  style={{ bottom: "-40px", filter: "drop-shadow(0 18px 30px rgba(0,0,0,0.32))", "--seq-delay": `${i}s` } as CSSProperties}>
                  <ServiceIllustration slug={col.slug} />
                </div>
              </div>

              {/* Divisor sutil */}
              <div className="relative z-[2] h-px mx-6"
                style={{ background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.10) 20%, rgba(${BLUE_RGB},0.18) 50%, rgba(255,255,255,0.10) 80%, transparent)` }} />

              {/* Contenido limpio — título + propuesta de valor + CTA. Los chips
                  de tecnologías viven en la página de detalle: en el overview lo
                  que engancha es el beneficio, no la lista de herramientas. */}
              <div className="relative z-[2] px-6 pt-6 pb-6 flex-1 flex flex-col">
                <h3 className="text-white text-xl font-bold tracking-tight uppercase mb-3 group-hover:text-blue-100 transition-colors">{cd.title}</h3>
                <p className="text-gray-300 text-[15px] leading-relaxed mb-6">{cd.desc}</p>

                <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-blue-300 group-hover:text-white transition-colors">
                  {t.services.viewSolution}
                  <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          </Reveal>
        );
      })}
    </div>
  );
}
