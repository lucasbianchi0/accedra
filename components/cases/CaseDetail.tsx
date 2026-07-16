"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight, Building2, Target, Wrench, FileText, TrendingUp } from "lucide-react";
import Navbar from "@/components/Navbar";
import { SOLUTIONS } from "@/components/solutions/solutionsData";
import { HOME_CASES } from "@/components/homeCases";
import { imgFor } from "./caseImage";

const BLUE = "#2B6FD4";
const BLUE_RGB = "43,111,212";

type Norm = {
  image: string;
  industry: string;
  result: string;
  lead?: string;
  challenge?: string;
  solution?: string;
  body: string[];
};
type OtherCard = { i: number; image: string; industry: string; result: string; sub: string };

export default function CaseDetail({ solucion, index }: { solucion: string; index: number }) {
  const router = useRouter();
  const isHome = solucion === "home";
  const sol = isHome ? null : SOLUTIONS[solucion];

  let item: Norm;
  let others: OtherCard[];
  let crumb: { name: string; href: string };
  let sideCta: { href: string; label: string };

  if (isHome) {
    const c = HOME_CASES[index];
    item = { image: c.image, industry: c.tag, result: c.title, lead: c.desc, body: c.body };
    others = HOME_CASES.map((x, i) => ({ x, i })).filter((o) => o.i !== index)
      .map(({ x, i }) => ({ i, image: x.image, industry: x.tag, result: x.title, sub: x.desc }));
    crumb = { name: "Nuestro trabajo", href: "/#nosotros" };
    sideCta = { href: "/#servicios", label: "Ver soluciones" };
  } else {
    const c = sol!.cases[index];
    item = {
      image: c.image ?? imgFor(c.industry),
      industry: c.industry,
      result: c.result,
      challenge: c.challenge,
      solution: c.solution,
      body: c.body && c.body.length ? c.body : [c.challenge, c.solution],
    };
    others = sol!.cases.map((x, i) => ({ x, i })).filter((o) => o.i !== index)
      .map(({ x, i }) => ({ i, image: x.image ?? imgFor(x.industry), industry: x.industry, result: x.result, sub: x.challenge }));
    crumb = { name: sol!.name, href: `/soluciones/${solucion}` };
    sideCta = { href: `/soluciones/${solucion}`, label: "Ver la solución" };
  }
  const basePath = `/casos/${solucion}`;

  return (
    <main className="bg-[#07101D] min-h-screen relative">
      <Navbar />

      {/* Glow ambiental superior */}
      <div className="absolute top-0 inset-x-0 h-[520px] pointer-events-none"
        style={{ background: `radial-gradient(ellipse 55% 100% at 50% 0%, rgba(${BLUE_RGB},0.15) 0%, transparent 68%)` }} />

      <div className="relative z-10 max-w-[1120px] mx-auto px-5 sm:px-8 lg:px-12 pt-24 lg:pt-28 pb-8">
        {/* Volver */}
        <button onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors mb-8">
          <ArrowLeft size={15} /> Volver
        </button>

        {/* Encabezado */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-3xl">
          <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] px-3 py-1.5 rounded-full mb-5"
            style={{ background: `rgba(${BLUE_RGB},0.14)`, color: "#9EC5FF", border: `1px solid rgba(${BLUE_RGB},0.3)` }}>
            <Building2 size={12} /> {item.industry} · Caso de éxito
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-[44px] font-bold text-white leading-[1.1] mb-4">{item.result}</h1>
          {item.lead && <p className="text-gray-300 text-lg leading-relaxed max-w-2xl">{item.lead}</p>}
        </motion.div>

        {/* Foto enmarcada */}
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.1 }}
          className="relative mt-8">
          <div className="absolute -inset-2 rounded-[30px] pointer-events-none blur-2xl"
            style={{ background: `radial-gradient(60% 90% at 50% 0%, rgba(${BLUE_RGB},0.22), transparent 72%)` }} />
          <div className="relative rounded-[24px] p-px"
            style={{ background: `linear-gradient(150deg, rgba(${BLUE_RGB},0.55), rgba(255,255,255,0.08) 42%, rgba(255,255,255,0.02))` }}>
            <div className="rounded-[23px] overflow-hidden relative h-[240px] sm:h-[360px] lg:h-[420px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.image} alt="" aria-hidden="true" className="hero-zoom absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(7,16,29,0.45) 0%, transparent 42%)" }} />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Cuerpo: relato + ficha lateral */}
      <div className="relative z-10 max-w-[1120px] mx-auto px-5 sm:px-8 lg:px-12 pb-16 lg:pb-24">
        <div className="grid lg:grid-cols-[1fr_340px] gap-8 lg:gap-14">
          {/* Relato */}
          <article>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-400 mb-5">El caso</p>
            <div className="space-y-5">
              {item.body.map((p, k) => (
                <p key={k} className="text-gray-300 text-[16.5px] leading-[1.85]">{p}</p>
              ))}
            </div>
          </article>

          {/* Ficha lateral (sticky en desktop) — mejorada */}
          <aside className="lg:sticky lg:top-24 h-fit">
            <div className="rounded-[20px] border overflow-hidden"
              style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.1)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08), 0 20px 48px rgba(0,0,0,0.4)" }}>
              {/* Resultado destacado (arriba) */}
              <div className="relative p-6 overflow-hidden"
                style={{ background: `linear-gradient(150deg, rgba(${BLUE_RGB},0.22), rgba(${BLUE_RGB},0.05))` }}>
                <div className="absolute -top-10 -right-8 w-36 h-36 rounded-full blur-3xl pointer-events-none"
                  style={{ background: `radial-gradient(circle, rgba(${BLUE_RGB},0.4), transparent 70%)` }} />
                <p className="relative text-[10px] font-semibold uppercase tracking-[0.2em] text-blue-300 mb-2 flex items-center gap-1.5">
                  <TrendingUp size={12} /> El resultado
                </p>
                <p className="relative text-white text-[16px] font-semibold leading-snug">{item.result}</p>
              </div>

              {/* Ficha */}
              <div className="divide-y divide-white/[0.07]">
                <MetaRow icon={Building2} label="Industria" value={item.industry} />
                {item.challenge && <MetaRow icon={Target} label="El desafío" value={item.challenge} />}
                {item.solution && <MetaRow icon={Wrench} label="La solución" value={item.solution} />}
                {!item.challenge && item.lead && <MetaRow icon={FileText} label="Resumen" value={item.lead} />}
              </div>

              {/* CTAs */}
              <div className="p-5 space-y-2.5 border-t border-white/[0.07]">
                <Link href="/#contacto"
                  className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-[14.5px] font-semibold text-white transition-all hover:gap-3"
                  style={{ background: BLUE, boxShadow: `0 8px 24px rgba(${BLUE_RGB},0.4)` }}>
                  Quiero un resultado así <ArrowRight size={16} />
                </Link>
                <Link href={sideCta.href}
                  className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-[14.5px] font-semibold text-gray-200 border border-white/12 hover:bg-white/5 transition-all">
                  {sideCta.label}
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Otros casos */}
      {others.length > 0 && (
        <section className="relative z-10 py-14 lg:py-20 border-t border-white/[0.06] bg-[#0A1424]">
          <div className="max-w-[1120px] mx-auto px-5 sm:px-8 lg:px-12">
            <div className="flex items-end justify-between gap-4 mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-white">Otros casos</h2>
              <Link href={crumb.href} className="text-sm font-semibold text-blue-400 hover:text-blue-300 inline-flex items-center gap-1 transition-colors">
                Ver todos <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
              {others.map((o) => (
                <Link key={o.i} href={`${basePath}/${o.i}`}
                  className="group relative flex flex-col rounded-2xl border overflow-hidden transition-all duration-300 hover:-translate-y-1.5"
                  style={{ background: "#0D1A2D", borderColor: "rgba(255,255,255,0.09)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.07), 0 10px 34px rgba(0,0,0,0.35)" }}>
                  <div className="relative h-40">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={o.image} alt="" aria-hidden="true"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      style={{ maskImage: "linear-gradient(to bottom, #000 55%, transparent 98%)", WebkitMaskImage: "linear-gradient(to bottom, #000 55%, transparent 98%)" }} />
                    <span className="absolute bottom-3 left-4 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full"
                      style={{ background: `rgba(${BLUE_RGB},0.35)`, color: "#EAF2FE", border: `1px solid rgba(${BLUE_RGB},0.5)`, backdropFilter: "blur(4px)" }}>
                      <Building2 size={12} /> {o.industry}
                    </span>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-white font-bold text-[16px] leading-snug mb-2.5">{o.result}</h3>
                    <p className="text-gray-400 text-[13.5px] leading-relaxed mb-4 flex-1">{o.sub}</p>
                    <span className="inline-flex items-center gap-1 text-[13px] font-semibold text-blue-400 group-hover:text-blue-300 transition-colors">
                      Ver caso <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

function MetaRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex gap-3.5 p-5">
      <span className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: `rgba(${BLUE_RGB},0.14)`, border: `1px solid rgba(${BLUE_RGB},0.28)` }}>
        <Icon size={15} style={{ color: "#7FB3F8" }} />
      </span>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-500 mb-1">{label}</p>
        <p className="text-gray-200 text-[13.5px] leading-relaxed">{value}</p>
      </div>
    </div>
  );
}
