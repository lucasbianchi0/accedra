"use client";

import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import { useT } from "@/lib/i18n/useT";
import { partners } from "./partnersData";
import { Reveal } from "@/components/Reveal";

// Tres filas de logos que corren en direcciones alternadas (→ ← →).
// Split 6 / 5 / 5. Cada fila se duplica para el loop continuo sin costura.
const rowA = partners.slice(0, 6);
const rowB = partners.slice(6, 11);
const rowC = partners.slice(11);

// Los bordes se disuelven (mask) para que los logos aparezcan/desaparezcan
// suave en vez de cortarse en seco contra el borde.
const EDGE_FADE =
  "linear-gradient(90deg, transparent 0%, #000 11%, #000 89%, transparent 100%)";

// Rellena la fila repitiendo los logos hasta que UNA copia sea bien ancha (≥14),
// y luego la duplica. Así el marquee nunca deja huecos (loop perfecto y fluido)
// aunque la fila tenga pocos logos.
function buildStrip(items: typeof partners) {
  const reps = Math.max(2, Math.ceil(14 / items.length));
  const base = Array.from({ length: reps }, () => items).flat();
  return [...base, ...base]; // doble → el -50% del keyframe cierra sin costura
}

function LogoItem({ logo, name, filter }: { logo: string; name: string; filter: string }) {
  return (
    <div className="mx-5 sm:mx-8 flex h-14 w-32 flex-shrink-0 items-center justify-center sm:w-40">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={logo}
        alt={name}
        className="max-h-10 w-auto max-w-[140px] object-contain opacity-90 transition-opacity duration-500 hover:opacity-100 sm:max-h-[52px] sm:max-w-[168px]"
        style={{ filter }}
      />
    </div>
  );
}

function MarqueeRow({
  items,
  reverse,
  duration,
}: {
  items: typeof partners;
  reverse?: boolean;
  duration: string;
}) {
  const strip = buildStrip(items);
  return (
    <div
      className="relative overflow-hidden"
      style={{ maskImage: EDGE_FADE, WebkitMaskImage: EDGE_FADE }}
    >
      <div
        className={`flex w-max will-change-transform ${reverse ? "animate-marquee-reverse" : "animate-marquee"}`}
        style={{ animationDuration: duration, animationTimingFunction: "linear" }}
      >
        {strip.map((p, i) => (
          <LogoItem key={i} logo={p.logo} name={p.name} filter={p.filter} />
        ))}
      </div>
    </div>
  );
}

export default function Partners() {
  const t = useT();

  return (
    <section id="partners" className="section relative">
      <div className="container-x relative z-10">

        {/* Header — solo el título (una línea, sin descripción) */}
        <div className="section-head">
          <Reveal as="h2" className="section-title">{t.partners.title}</Reveal>
        </div>

        {/* Triple marquee: → ← → (velocidades apenas distintas para que no se
            lean sincronizadas ni espejadas). */}
        <Reveal delay={0.1} className="space-y-7 sm:space-y-10">
          <MarqueeRow items={rowA} duration="120s" />
          <MarqueeRow items={rowB} reverse duration="145s" />
          <MarqueeRow items={rowC} duration="132s" />
        </Reveal>

        {/* Sello de confianza */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-12 flex justify-center"
        >
          <div
            className="pill-premium inline-flex items-center gap-3 pl-5 pr-6 py-3.5 rounded-full border border-white/10"
            style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
            }}
          >
            <ShieldCheck size={20} className="text-blue-400 flex-shrink-0 relative z-10" />
            <span className="relative z-10 text-gray-200 text-[15px] sm:text-base font-medium">
              {t.partners.pill}
            </span>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
