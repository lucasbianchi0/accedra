"use client";

import { motion } from "framer-motion";
import { Check, Fingerprint, ScanFace, KeyRound, FileText, Smartphone, PenLine, Boxes } from "lucide-react";
import type { Capability } from "./solutionsData";

const BLUE = "#2B6FD4";

// Tarjeta blanca reutilizable dentro de las escenas
function MiniCard({ children, className = "", style = {} }: { children?: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`rounded-xl bg-white border border-gray-200/70 shadow-[0_6px_20px_rgba(20,30,60,0.08)] ${className}`} style={style}>
      {children}
    </div>
  );
}

// ── Ilustración por índice de capacidad ─────────────────────────────
function Illustration({ i }: { i: number }) {
  // 0 · Firma manuscrita biométrica
  if (i === 0)
    return (
      <MiniCard className="w-[230px] p-4">
        <div className="flex items-center gap-2 mb-3">
          <FileText size={14} className="text-blue-600" />
          <span className="text-[11px] font-medium text-gray-500">Contrato.pdf</span>
        </div>
        <svg viewBox="0 0 210 44" className="w-full">
          <path d="M6 32 C 26 6, 44 40, 66 22 S 104 4, 130 28 S 172 8, 204 24" stroke={BLUE} fill="none" strokeWidth="2.6" strokeLinecap="round" />
        </svg>
        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-1.5 text-[11px] font-medium text-emerald-600">
          <span className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center"><Check size={10} /></span>
          Válido legalmente
        </div>
      </MiniCard>
    );

  // 1 · eSignAnywhere — documento con check, cards apiladas
  if (i === 1)
    return (
      <div className="relative w-[220px] h-[150px]">
        <MiniCard className="absolute top-3 left-8 w-[150px] h-[120px] rotate-[-6deg] opacity-60" />
        <MiniCard className="absolute top-1 left-3 w-[160px] h-[124px] p-4">
          <div className="h-2 w-20 rounded-full bg-gray-200 mb-2.5" />
          <div className="h-2 w-28 rounded-full bg-gray-100 mb-2.5" />
          <div className="h-2 w-16 rounded-full bg-gray-100" />
          <div className="absolute -right-3 -bottom-3 w-11 h-11 rounded-full text-white flex items-center justify-center shadow-lg"
            style={{ background: `linear-gradient(135deg, #5AA2F5, ${BLUE})` }}>
            <Check size={20} strokeWidth={3} />
          </div>
        </MiniCard>
        <span className="absolute top-2 right-1 text-[9px] font-semibold px-2 py-1 rounded-full bg-white shadow-sm border border-gray-100 text-blue-600">Web</span>
        <span className="absolute bottom-1 right-6 text-[9px] font-semibold px-2 py-1 rounded-full bg-white shadow-sm border border-gray-100 text-blue-600">Mobile</span>
      </div>
    );

  // 2 · Factoring digital — factura
  if (i === 2)
    return (
      <MiniCard className="w-[210px] p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-semibold text-gray-700">Factura</span>
          <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">Digital</span>
        </div>
        {[["Servicio A", "$ 1.200"], ["Servicio B", "$ 3.450"]].map(([a, b]) => (
          <div key={a} className="flex items-center justify-between py-1.5 border-b border-gray-100">
            <span className="text-[11px] text-gray-500">{a}</span>
            <span className="text-[11px] font-medium text-gray-700">{b}</span>
          </div>
        ))}
        <div className="flex items-center justify-between pt-2.5">
          <span className="text-[11px] font-semibold text-gray-800">Total</span>
          <span className="text-[13px] font-bold text-blue-600">$ 4.650</span>
        </div>
      </MiniCard>
    );

  // 3 · Firma mobile — teléfono
  if (i === 3)
    return (
      <div className="relative w-[112px] h-[168px] rounded-[22px] bg-white border border-gray-200/80 shadow-[0_10px_30px_rgba(20,30,60,0.12)] p-2.5 flex flex-col">
        <div className="mx-auto w-10 h-1 rounded-full bg-gray-200 mb-3" />
        <div className="flex-1 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center px-2">
          <svg viewBox="0 0 90 34"><path d="M4 24 C 18 6, 30 30, 44 16 S 70 6, 86 20" stroke={BLUE} fill="none" strokeWidth="2.4" strokeLinecap="round" /></svg>
        </div>
        <div className="mt-2.5 h-7 rounded-lg text-white text-[10px] font-semibold flex items-center justify-center gap-1"
          style={{ background: `linear-gradient(135deg, #5AA2F5, ${BLUE})` }}>
          <PenLine size={11} /> Firmar
        </div>
      </div>
    );

  // 4 · Multibiometría — anillos con huella al centro
  if (i === 4)
    return (
      <div className="relative w-[180px] h-[160px] flex items-center justify-center">
        <div className="absolute w-40 h-40 rounded-full border border-blue-200/60" />
        <div className="absolute w-28 h-28 rounded-full border border-blue-300/60" />
        <div className="relative w-16 h-16 rounded-2xl text-white flex items-center justify-center shadow-lg z-10"
          style={{ background: `linear-gradient(135deg, #5AA2F5, ${BLUE})` }}>
          <Fingerprint size={30} />
        </div>
        <div className="absolute top-3 right-6 w-9 h-9 rounded-xl bg-white shadow-md border border-gray-100 flex items-center justify-center text-blue-600">
          <ScanFace size={17} />
        </div>
        <div className="absolute bottom-4 left-5 w-9 h-9 rounded-xl bg-white shadow-md border border-gray-100 flex items-center justify-center text-blue-600">
          <KeyRound size={16} />
        </div>
      </div>
    );

  // 5 · Integración homogénea — grilla de sistemas
  return (
    <div className="grid grid-cols-3 gap-2.5 w-[168px]">
      {Array.from({ length: 9 }).map((_, k) => {
        const active = k === 4;
        return (
          <div key={k}
            className="aspect-square rounded-xl flex items-center justify-center"
            style={active
              ? { background: `linear-gradient(135deg, #5AA2F5, ${BLUE})`, boxShadow: "0 8px 20px rgba(43,111,212,0.35)" }
              : { background: "#fff", border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 2px 8px rgba(20,30,60,0.05)" }}>
            {active
              ? <Boxes size={20} className="text-white" />
              : <div className="w-3.5 h-3.5 rounded-md" style={{ background: k % 2 ? "rgba(43,111,212,0.14)" : "rgba(0,0,0,0.06)" }} />}
          </div>
        );
      })}
    </div>
  );
}

export default function FirmaCapabilities({
  eyebrow,
  title,
  items,
}: {
  eyebrow: string;
  title: string;
  items: Capability[];
}) {
  return (
    <section className="py-14 lg:py-20 relative overflow-hidden bg-gradient-to-b from-[#07101D] to-[#0A1424]">
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[380px] rounded-full pointer-events-none blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(43,111,212,0.1) 0%, transparent 65%)" }} />
      <div className="relative z-10 max-w-[1120px] mx-auto px-5 sm:px-8 lg:px-12">
        <div className="text-center mb-10">
          <p className="text-xs font-semibold tracking-[0.22em] uppercase mb-3 text-blue-400">{eyebrow}</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white">{title}</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((c, i) => (
            <motion.div key={c.title}
              initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.45, delay: (i % 3) * 0.08 }}
              className="rounded-2xl overflow-hidden flex flex-col border transition-all duration-300 hover:-translate-y-1.5"
              style={{ background: "#0A0F19", borderColor: "rgba(255,255,255,0.08)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)" }}
            >
              <div className="relative h-40 flex items-center justify-center overflow-hidden"
                style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.03), transparent 92%)" }}>
                <div className="absolute inset-0"
                  style={{ background: "radial-gradient(circle at 50% 42%, rgba(43,111,212,0.16), transparent 62%)" }} />
                <div className="relative scale-[0.8]">
                  <Illustration i={i} />
                </div>
              </div>
              <div className="p-5 border-t border-white/[0.06]">
                <h3 className="text-white font-bold text-[16px] mb-1.5">{c.title}</h3>
                <p className="text-gray-400 text-[13.5px] leading-relaxed">{c.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
