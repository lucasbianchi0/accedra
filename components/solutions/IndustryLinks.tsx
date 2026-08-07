"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { SOLUTIONS } from "./solutionsData";
import { INDUSTRIES, INDUSTRY_SLUGS } from "./industriesData";
import { getIndustrySeo } from "./industrySeo";

// Enlaces internos desde la página base de una solución hacia sus landings por
// industria.
//
// Es lo que evita que esas landings queden huérfanas: una página sin enlaces
// entrantes no recibe autoridad aunque esté en el sitemap y sin noindex.
//
// Sólo se renderiza en la página base. Las landings de industria no muestran esta
// sección (ni hermanas ni cross-solución) por decisión de diseño.

type Card = { href: string; title: string; desc: string };

function LinkCards({ cards }: { cards: Card[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((c) => (
        <Reveal key={c.href} preset="item">
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
        </Reveal>
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

export default function IndustryLinks({ slug }: { slug: string }) {
  const solution = SOLUTIONS[slug];
  if (!solution) return null;

  // Sólo se enlazan combinaciones con contenido propio: enlazar una variante sin
  // texto diferenciado le pasaría autoridad a una página que no debería indexarse.
  const industries = INDUSTRY_SLUGS.filter((i) => getIndustrySeo(slug, i));
  if (!industries.length) return null;

  return (
    <section className="section relative overflow-hidden">
      <div className="container-x relative z-10">
        <Header title={`${solution.name} por industria`} />
        <LinkCards
          cards={industries.map((i) => {
            const target = INDUSTRIES[i];
            const seo = getIndustrySeo(slug, i);
            return {
              href: `/soluciones/${slug}/${i}`,
              title: `${solution.name} ${target.forLabel}`,
              desc: seo?.h2 ?? target.context,
            };
          })}
        />
      </div>
    </section>
  );
}
