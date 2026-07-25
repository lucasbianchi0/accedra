"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Building2, ArrowRight, ArrowUpRight } from "lucide-react";
import type { Case } from "./solutionsData";
import { imgFor } from "@/components/cases/caseImage";
import { Reveal, revealOnScroll, EASE } from "@/components/Reveal";

const CARD_STYLE = {
  // Vidrio premium: mismo material que Testimonials/bento/proceso — fill
  // translúcido + blur + brillo interior, no un navy sólido plano.
  background: "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.025) 60%, rgba(255,255,255,0.015) 100%)",
  borderColor: "rgba(255,255,255,0.10)",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12), 0 18px 50px rgba(0,0,0,0.38)",
};

function IndustryBadge({ industry, className = "" }: { industry: string; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full ${className}`}
      style={{ background: "rgba(11,21,36,0.55)", color: "#EAF2FE", border: `1px solid rgba(var(--accent-rgb,43,111,212),0.5)`, backdropFilter: "blur(6px)" }}>
      <Building2 size={12} /> {industry}
    </span>
  );
}

// ── Un solo caso: fila editorial a lo ancho (foto + contenido + métricas) ──
function EditorialCase({ c, href }: { c: Case; href: string }) {
  const img = c.image ?? imgFor(c.industry);
  return (
    <motion.div initial={{ opacity: 0, y: 44, filter: "blur(14px)" }} whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }} viewport={{ once: true, amount: 0.15, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 1.4, ease: EASE }}>
      <Link href={href}
        className="group relative block rounded-panel overflow-hidden border transition-all duration-500 hover:-translate-y-1"
        style={CARD_STYLE}>
        <div className="absolute inset-0 z-20 rounded-panel opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ boxShadow: `inset 0 0 0 1px rgba(var(--accent-rgb,43,111,212),0.5), 0 44px 100px rgba(var(--accent-rgb,43,111,212),0.24)` }} />
        <div className="grid lg:grid-cols-2">
          <div className="relative h-60 sm:h-72 lg:h-auto lg:min-h-[430px] overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img} alt="" aria-hidden="true"
              className="photo-zoom absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 transition-opacity duration-700 ease-out group-hover:opacity-50"
              style={{ background: `linear-gradient(150deg, rgba(var(--accent-rgb,43,111,212),0.24) 0%, transparent 52%)` }} />
            <div className="absolute inset-0 lg:hidden" style={{ background: "linear-gradient(to top, #0A1524 3%, transparent 62%)" }} />
            <div className="absolute inset-0 hidden lg:block" style={{ background: "linear-gradient(to right, #0A1524 1%, transparent 46%)" }} />
            <span className="absolute top-5 left-5"><IndustryBadge industry={c.industry} /></span>
          </div>
          <div className="relative z-10 p-7 sm:p-10 lg:p-12 flex flex-col justify-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-accent mb-4">Caso de éxito</p>
            <h3 className="text-white font-bold text-[26px] lg:text-[30px] leading-[1.15] mb-4 transition-colors duration-300 group-hover:text-white">{c.result}</h3>
            <p className="text-gray-400 text-[15px] leading-relaxed mb-7 max-w-md">{c.challenge}</p>
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-accent group-hover:text-white transition-colors">
              Ver caso completo <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ── Varios casos: card vertical (foto arriba + contenido + métricas) ──
function VerticalCase({ c, href }: { c: Case; href: string }) {
  const img = c.image ?? imgFor(c.industry);
  return (
    <motion.div {...revealOnScroll} className="h-full">
      <Link href={href}
        className="group relative flex h-full flex-col rounded-card border overflow-hidden transition-all duration-500 hover:-translate-y-2"
        style={CARD_STYLE}>
        {/* Borde + sombra azul en hover */}
        <div className="absolute inset-0 z-20 rounded-card opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ boxShadow: `inset 0 0 0 1px rgba(var(--accent-rgb,43,111,212),0.5), 0 36px 80px rgba(var(--accent-rgb,43,111,212),0.26)` }} />
        {/* Spotlight azul que sube desde abajo en hover */}
        <div className="absolute inset-x-0 bottom-0 h-2/3 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ background: `radial-gradient(ellipse 85% 100% at 50% 100%, rgba(var(--accent-rgb,43,111,212),0.16), transparent 68%)` }} />
        {/* Foto */}
        <div className="relative h-44 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={img} alt="" aria-hidden="true"
            className="photo-zoom absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 transition-opacity duration-700 ease-out group-hover:opacity-40" style={{ background: `linear-gradient(150deg, rgba(var(--accent-rgb,43,111,212),0.22) 0%, transparent 55%)` }} />
          <span className="absolute top-4 left-4"><IndustryBadge industry={c.industry} /></span>
        </div>
        {/* Contenido */}
        <div className="relative z-10 p-6 lg:p-7 flex-1 flex flex-col">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-accent mb-2.5">Caso de éxito</p>
          <h3 className="text-white font-bold text-[19px] leading-snug mb-2.5 transition-colors duration-300 group-hover:text-white">{c.result}</h3>
          <p className="text-gray-400 text-[13.5px] leading-relaxed mb-5">{c.challenge}</p>
          {/* `mt-auto` estaba en la grilla de métricas; al sacarla pasa acá para que
              el link siga anclado al pie y las cards queden parejas. */}
          <span className="mt-auto inline-flex items-center gap-1.5 text-[13px] font-semibold text-accent group-hover:text-white transition-colors">
            Ver caso completo <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

export default function CasesSection({ cases, slug }: { cases: Case[]; slug: string }) {
  const items = cases.slice(0, 3);
  if (items.length === 0) return null; // sin casos → no se muestra la sección

  const single = items.length === 1;
  const pair = items.length === 2;

  return (
    // Tratamiento de "sala de galería": todas las demás secciones aclaran en el
    // medio; esta OSCURECE hasta navy-900. Las fotos de los casos quedan como
    // obras iluminadas contra una pared oscura, y la sección se distingue del
    // resto sin salirse de la paleta. Abre y cierra en navy-800 para empalmar
    // con ProcessSection y con Contact.
    <section id="casos" className="section scroll-mt-24 relative">
      {/* Sin fondo propio: la luz y el grano los pone AmbientLight a nivel de
          página. El cenital que había acá sumaba luz solo en esta sección y
          marcaba una costura contra Proceso y contra Contacto. */}
      <div className="relative z-10 max-w-[1320px] mx-auto px-5 sm:px-8 lg:px-12">
        <div className="section-head">
          <Reveal as="h2" delay={0.08} className="section-title mt-0">Resultados que hablan por nosotros</Reveal>
          <Reveal as="p" delay={0.16} className="section-sub">Proyectos reales, en empresas líderes, con resultados concretos.</Reveal>
        </div>

        {single ? (
          <EditorialCase c={items[0]} href={`/casos/${slug}/0`} />
        ) : (
          <div className={pair ? "grid md:grid-cols-2 gap-6 max-w-[860px] mx-auto" : "grid md:grid-cols-3 gap-6"}>
            {items.map((c, i) => (
              <VerticalCase key={i} c={c} href={`/casos/${slug}/${i}`} />
            ))}
          </div>
        )}

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
          className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
          <p className="text-gray-400 text-[15px]">¿Querés que el próximo caso sea el tuyo?</p>
          <Link href="#contacto"
            className="inline-flex items-center gap-2 text-sm font-semibold text-white px-6 py-3 rounded-full transition-all hover:gap-3"
            style={{ background: "rgb(var(--accent-rgb,43,111,212))", boxShadow: `0 8px 28px rgba(var(--accent-rgb,43,111,212),0.35)` }}>
            Solicitar un diagnóstico <ArrowRight size={15} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
