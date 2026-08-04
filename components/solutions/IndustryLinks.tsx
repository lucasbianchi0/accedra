"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Reveal, revealOnScroll } from "@/components/Reveal";
import { SOLUTIONS, SOLUTION_SLUGS } from "./solutionsData";
import { INDUSTRIES, INDUSTRY_SLUGS } from "./industriesData";
import { getIndustrySeo } from "./industrySeo";

// Malla de enlaces internos entre las landings de industria.
//
// Es la pieza que faltaba para que estas páginas puedan rankear: hasta ahora eran
// huérfanas —no se llegaba a ellas desde ningún lado— y una página sin enlaces
// entrantes no recibe autoridad aunque esté en el sitemap y sin noindex.
//
// Dos modos:
//  · sin `industria` (página base de la solución) → enlaza a sus 6 industrias.
//  · con `industria` (landing) → enlaza a las industrias hermanas Y a la misma
//    industria en las otras soluciones, tejiendo la malla en los dos ejes.

type Card = { href: string; title: string; desc: string };

function LinkCards({ cards }: { cards: Card[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((c) => (
        <motion.div key={c.href} {...revealOnScroll}>
          <Link
            href={c.href}
            className="group/link relative flex flex-col h-full rounded-panel p-6 overflow-hidden transition-transform duration-300 hover:-translate-y-1"
            style={{
              background: "linear-gradient(180deg, rgba(255,255,255,0.055) 0%, rgba(255,255,255,0.018) 100%)",
              border: "1px solid rgba(255,255,255,0.09)",
            }}
          >
            <div className="absolute inset-0 rounded-panel opacity-0 group-hover/link:opacity-100 transition-opacity duration-400 pointer-events-none"
              style={{ boxShadow: `inset 0 0 0 1px rgba(var(--accent-rgb,43,111,212),0.45), 0 22px 50px rgba(var(--accent-rgb,43,111,212),0.16)` }} />

            <p className="relative z-10 text-white font-semibold text-[15.5px] leading-snug mb-2">
              {c.title}
            </p>
            <p className="relative z-10 text-gray-400 text-[13.5px] leading-relaxed flex-1">
              {c.desc}
            </p>
            <span className="relative z-10 inline-flex items-center gap-1.5 mt-5 text-[13px] font-semibold text-accent transition-all duration-200 group-hover/link:gap-2.5">
              Ver solución <ArrowRight size={14} />
            </span>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}

function Header({ title }: { title: string }) {
  return (
    <div className="flex items-end gap-6 mb-9 lg:mb-11">
      <div className="min-w-0 max-w-2xl">
        <Reveal as="h2" delay={0.08} className="section-title text-left mt-0 text-balance">
          {title}
        </Reveal>
      </div>
      <div className="hidden sm:block flex-1 h-px mb-3.5"
        style={{ background: `linear-gradient(90deg, rgba(var(--accent-rgb,43,111,212),0.5), transparent)` }} />
    </div>
  );
}

export default function IndustryLinks({
  slug,
  industria,
}: {
  slug: string;
  industria?: string;
}) {
  const solution = SOLUTIONS[slug];
  if (!solution) return null;

  // Sólo se enlazan combinaciones con contenido propio: enlazar una variante sin
  // texto diferenciado le pasaría autoridad a una página que no debería indexarse.
  const siblings = INDUSTRY_SLUGS.filter(
    (i) => i !== industria && getIndustrySeo(slug, i),
  );

  const crossSolutions = industria
    ? SOLUTION_SLUGS.filter((s) => s !== slug && getIndustrySeo(s, industria))
    : [];

  if (!siblings.length && !crossSolutions.length) return null;

  const ind = industria ? INDUSTRIES[industria] : null;

  return (
    <section className="section relative overflow-hidden">
      <div className="container-x relative z-10">
        {siblings.length > 0 && (
          <>
            <Header
              title={
                ind
                  ? `${solution.name} en otras industrias`
                  : `${solution.name} por industria`
              }
            />
            <LinkCards
              cards={siblings.map((i) => {
                const target = INDUSTRIES[i];
                const seo = getIndustrySeo(slug, i);
                return {
                  href: `/soluciones/${slug}/${i}`,
                  title: `${solution.name} ${target.forLabel}`,
                  desc: seo?.h2 ?? target.context,
                };
              })}
            />
          </>
        )}

        {ind && crossSolutions.length > 0 && (
          <div className={siblings.length > 0 ? "mt-20 lg:mt-24" : ""}>
            <Header title={`Otras soluciones ${ind.forLabel}`} />
            <LinkCards
              cards={crossSolutions.map((s) => {
                const target = SOLUTIONS[s];
                const seo = getIndustrySeo(s, industria!);
                return {
                  href: `/soluciones/${s}/${industria}`,
                  title: `${target.name} ${ind.forLabel}`,
                  desc: seo?.h2 ?? target.subtitle,
                };
              })}
            />
          </div>
        )}
      </div>
    </section>
  );
}
