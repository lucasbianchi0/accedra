"use client";

import { Check, PenTool, ShieldCheck, AlertTriangle, TrendingUp, Sparkles } from "lucide-react";

const BLUE = "#2B6FD4";
const GRAD = `linear-gradient(135deg, #5AA2F5, ${BLUE})`;

// Cada ilustración es un "objeto" realista anclado al borde INFERIOR de su zona
// y recortado arriba (overflow-hidden en el contenedor de Services), como si el
// dispositivo/escena continuara fuera de cuadro. Detallado y específico por card.
export default function ServiceIllustration({ slug }: { slug: string }) {
  if (slug === "networking") return <Networking />;
  if (slug === "firma-biometrica") return <Firma />;
  if (slug === "consultoria") return <Consultoria />;
  if (slug === "software-ai") return <SoftwareAI />;
  return <Seguridad />;
}

// ── NETWORKING — switch rack con puertos RJ45 y patch-cables que suben ────────
function Networking() {
  const cables = [
    { x: 74, c: "#5AA2F5" },
    { x: 116, c: "#34d399" },
    { x: 158, c: "#7CC0FF" },
  ];
  return (
    <div className="relative w-[248px] h-[214px]">
      {/* Patch-cables que salen por el borde superior (bleed) */}
      <svg viewBox="0 0 248 214" className="absolute inset-0 w-full h-full pointer-events-none" fill="none">
        {cables.map((cb, k) => (
          <path key={k}
            d={`M${cb.x} 96 C ${cb.x} 60, ${cb.x + (k - 1) * 26} 40, ${cb.x + (k - 1) * 34} -6`}
            stroke={cb.c} strokeWidth="5.5" strokeLinecap="round" opacity="0.85" />
        ))}
      </svg>

      {/* Cuerpo del switch, anclado abajo */}
      <div className="absolute bottom-0 inset-x-0 rounded-xl overflow-hidden"
        style={{ background: "linear-gradient(160deg, #14294080 0%, #0C1B2E 60%)", border: "1px solid rgba(120,160,220,0.22)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)" }}>
        {/* Header del equipo */}
        <div className="flex items-center justify-between px-3.5 pt-3 pb-2">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 svc-accent" />
            <span className="text-[11px] font-semibold text-white tracking-wide">CORE-SW-48</span>
          </div>
          <span className="text-[9px] font-medium text-blue-300/80">99.9% uptime</span>
        </div>

        {/* Conectores donde entran los cables */}
        <div className="relative h-3">
          {cables.map((cb, k) => (
            <span key={k} className="absolute -top-0.5 w-3.5 h-3 rounded-sm"
              style={{ left: cb.x - 7, background: cb.c, boxShadow: `0 0 8px ${cb.c}` }} />
          ))}
        </div>

        {/* Dos filas de puertos RJ45 */}
        <div className="px-3.5 pb-2 space-y-1.5">
          {[0, 1].map((row) => (
            <div key={row} className="flex gap-[5px]">
              {Array.from({ length: 12 }).map((_, k) => {
                const lit = [1, 4, 5, 9].includes((k + row) % 12);
                return (
                  <div key={k} className="flex-1 h-3.5 rounded-[3px] flex items-end justify-center pb-[2px]"
                    style={{ background: "#0A1626", border: "1px solid rgba(120,160,220,0.18)" }}>
                    <span className="w-1 h-1 rounded-full"
                      style={{ background: lit ? (k % 2 ? "#34d399" : "#5AA2F5") : "rgba(120,160,220,0.25)" }} />
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Base con LEDs de estado */}
        <div className="flex items-center gap-2 px-3.5 py-2 border-t border-white/[0.06]">
          <span className="text-[9px] text-gray-400">SFP+</span>
          <div className="flex gap-1 ml-auto">
            {["#34d399", "#5AA2F5", "#34d399", "#f59e0b"].map((c, k) => (
              <span key={k} className="w-1.5 h-1.5 rounded-full" style={{ background: c }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── FIRMA BIOMÉTRICA — tableta Wacom de firma + lápiz óptico ─────────────────
function Firma() {
  return (
    <div className="relative w-[244px] h-[214px]">
      {/* Lápiz óptico en diagonal que sale por arriba (bleed) */}
      <div className="absolute z-20 left-[150px] top-[-26px] rotate-[34deg] origin-bottom">
        <div className="relative w-[15px] h-[168px] rounded-t-[7px] rounded-b-[3px]"
          style={{ background: "linear-gradient(90deg, #2a2f3a 0%, #6b7280 45%, #cfd4dc 55%, #4b5563 100%)", boxShadow: "0 8px 16px rgba(0,0,0,0.35)" }}>
          {/* aro azul */}
          <div className="absolute top-[70px] inset-x-0 h-2.5" style={{ background: GRAD }} />
          {/* punta */}
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-0 h-0"
            style={{ borderLeft: "7px solid transparent", borderRight: "7px solid transparent", borderTop: "14px solid #3b4250" }} />
          <div className="absolute -bottom-[15px] left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full" style={{ background: BLUE }} />
        </div>
      </div>

      {/* Tableta anclada abajo */}
      <div className="absolute bottom-0 inset-x-0 rounded-[18px] p-3"
        style={{ background: "linear-gradient(160deg, #1b2330 0%, #0f1620 100%)", border: "1px solid rgba(120,160,220,0.20)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.07), 0 18px 34px rgba(0,0,0,0.4)" }}>
        <div className="flex gap-3">
          {/* ExpressKeys */}
          <div className="flex flex-col gap-2 pt-1">
            {[0, 1, 2, 3].map((k) => (
              <span key={k} className="w-3.5 h-3.5 rounded-md"
                style={{ background: k === 0 ? GRAD : "#0A1626", border: "1px solid rgba(120,160,220,0.2)" }} />
            ))}
          </div>

          {/* Pantalla de firma */}
          <div className="flex-1 rounded-lg bg-white p-3 relative overflow-hidden"
            style={{ boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.05)" }}>
            <div className="flex items-center gap-1.5 mb-1.5">
              <PenTool size={11} className="text-blue-600" />
              <span className="text-[9px] font-semibold text-gray-500">Firma biométrica</span>
            </div>
            {/* trazo de firma */}
            <svg viewBox="0 0 150 40" className="w-full h-[40px]">
              <path className="svc-accent" d="M6 30 C 20 6, 30 38, 44 20 S 70 6, 86 26 S 116 4, 138 22"
                stroke={BLUE} fill="none" strokeWidth="2.6" strokeLinecap="round" />
            </svg>
            <div className="mt-1 border-t border-dashed border-gray-200 pt-1 flex items-center justify-between">
              <span className="text-[8px] text-gray-400">Presión · velocidad · trazo</span>
              <span className="inline-flex items-center gap-0.5 text-[8px] font-semibold text-emerald-600">
                <Check size={9} /> Válida
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── CONSULTORÍA — dashboard Power BI (KPIs + área + barras) ──────────────────
function Consultoria() {
  return (
    <div className="relative w-[244px] h-[212px]">
      <div className="absolute bottom-0 inset-x-0 rounded-xl bg-white overflow-hidden"
        style={{ border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 18px 34px rgba(0,0,0,0.35)" }}>
        {/* Header */}
        <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-gray-100">
          <span className="text-[11px] font-semibold text-gray-700">Panel de ventas</span>
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600">
            <TrendingUp size={12} /> +24%
          </span>
        </div>

        <div className="p-3 space-y-2.5">
          {/* KPIs */}
          <div className="grid grid-cols-2 gap-2">
            {[["Ingresos", "$ 1.24M"], ["Clientes", "3.480"]].map(([a, b]) => (
              <div key={a} className="rounded-lg bg-blue-50/70 px-2.5 py-1.5">
                <div className="text-[8px] text-gray-400">{a}</div>
                <div className="text-[12px] font-bold text-gray-800">{b}</div>
              </div>
            ))}
          </div>

          {/* Área + barras */}
          <div className="flex gap-2">
            {/* área */}
            <div className="flex-1 rounded-lg border border-gray-100 p-2">
              <svg viewBox="0 0 110 46" className="w-full h-[44px]">
                <defs>
                  <linearGradient id="ar" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="rgba(43,111,212,0.35)" />
                    <stop offset="1" stopColor="rgba(43,111,212,0)" />
                  </linearGradient>
                </defs>
                <path d="M2 34 L 22 24 L 42 30 L 62 14 L 82 20 L 108 6 L 108 46 L 2 46 Z" fill="url(#ar)" />
                <path className="svc-accent" d="M2 34 L 22 24 L 42 30 L 62 14 L 82 20 L 108 6" stroke={BLUE} fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            {/* barras */}
            <div className="w-[64px] rounded-lg border border-gray-100 p-2 flex items-end gap-1.5 h-[60px]">
              {[45, 70, 55, 90].map((h, k) => (
                <div key={k} className={`flex-1 rounded-t-[3px] ${k === 3 ? "svc-accent" : ""}`}
                  style={{ height: `${h}%`, background: k === 3 ? GRAD : "rgba(43,111,212,0.2)" }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── SEGURIDAD — firewall / feed de ataques bloqueados ────────────────────────
function Seguridad() {
  const rows = [
    { ip: "203.0.113.5", tag: "Fuerza bruta" },
    { ip: "45.148.10.2", tag: "Port scan" },
  ];
  return (
    <div className="relative w-[244px] h-[214px]">
      <div className="absolute bottom-0 inset-x-0 rounded-xl bg-white overflow-hidden"
        style={{ border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 18px 34px rgba(0,0,0,0.35)" }}>
        {/* Header con escudo */}
        <div className="flex items-center gap-2.5 px-3.5 py-2.5 border-b border-gray-100">
          <div className="svc-accent w-8 h-8 rounded-xl flex items-center justify-center text-white flex-shrink-0"
            style={{ background: GRAD, boxShadow: "0 6px 16px rgba(43,111,212,0.4)" }}>
            <ShieldCheck size={16} />
          </div>
          <div className="leading-tight">
            <div className="text-[11px] font-semibold text-gray-800">Firewall · Zero Trust</div>
            <div className="text-[9px] text-gray-400">Monitoreo en tiempo real</div>
          </div>
          <span className="ml-auto text-[9px] font-bold text-red-500 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 svc-accent" /> LIVE
          </span>
        </div>

        {/* Feed de ataques bloqueados */}
        <div className="p-2.5 space-y-1.5">
          {rows.map((r) => (
            <div key={r.ip} className="flex items-center gap-2 rounded-lg bg-red-50 px-2.5 py-1.5">
              <AlertTriangle size={12} className="text-red-500 flex-shrink-0" />
              <span className="text-[10px] font-medium text-gray-700">{r.ip}</span>
              <span className="text-[8px] text-gray-400">{r.tag}</span>
              <span className="ml-auto text-[8px] font-bold px-1.5 py-0.5 rounded bg-red-100 text-red-600">Bloqueado</span>
            </div>
          ))}
          <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-2.5 py-1.5">
            <Check size={12} className="text-emerald-600 flex-shrink-0" />
            <span className="text-[10px] font-semibold text-emerald-700">12 amenazas neutralizadas hoy</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── SOFTWARE & AI — editor de código con copiloto de IA ──────────────────────
function SoftwareAI() {
  return (
    <div className="relative w-[244px] h-[214px]">
      <div className="absolute bottom-0 inset-x-0 rounded-xl bg-white overflow-hidden"
        style={{ border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 18px 34px rgba(0,0,0,0.35)" }}>
        {/* Barra del editor */}
        <div className="flex items-center gap-1.5 px-3.5 py-2 bg-gray-50 border-b border-gray-100">
          <span className="w-2 h-2 rounded-full bg-red-300" />
          <span className="w-2 h-2 rounded-full bg-amber-300" />
          <span className="w-2 h-2 rounded-full bg-emerald-300" />
          <span className="ml-1.5 text-[10px] font-medium text-gray-400">app.tsx</span>
          <span className="svc-accent ml-auto inline-flex items-center gap-1 text-[9px] font-bold text-white px-1.5 py-0.5 rounded-md" style={{ background: GRAD }}>
            <Sparkles size={9} /> AI
          </span>
        </div>

        {/* Código con números de línea */}
        <div className="flex text-[10px] font-mono">
          <div className="py-2.5 px-2 text-right text-gray-300 select-none space-y-2">
            {[1, 2, 3, 4, 5].map((n) => <div key={n}>{n}</div>)}
          </div>
          <div className="flex-1 py-2.5 pr-3 space-y-2">
            {/* líneas de "código" */}
            <div className="flex gap-1.5 items-center">
              <span className="h-1.5 w-8 rounded-full bg-purple-300" />
              <span className="h-1.5 w-14 rounded-full bg-blue-300" />
            </div>
            <div className="flex gap-1.5 items-center pl-3">
              <span className="h-1.5 w-10 rounded-full bg-emerald-300" />
              <span className="h-1.5 w-10 rounded-full bg-gray-200" />
            </div>
            {/* línea sugerida por IA */}
            <div className="relative flex gap-1.5 items-center pl-3 -mr-1 px-1 py-1 rounded-md" style={{ background: "rgba(43,111,212,0.10)" }}>
              <span className="h-1.5 w-12 rounded-full" style={{ background: BLUE }} />
              <span className="h-1.5 w-8 rounded-full bg-blue-200" />
              <span className="ml-auto inline-flex items-center gap-0.5 text-[8px] font-semibold text-blue-600">
                <Sparkles size={8} /> Copilot
              </span>
            </div>
            <div className="flex gap-1.5 items-center pl-3">
              <span className="h-1.5 w-8 rounded-full bg-gray-200" />
              <span className="h-1.5 w-12 rounded-full bg-gray-100" />
            </div>
            <div className="flex gap-1.5 items-center">
              <span className="h-1.5 w-6 rounded-full bg-purple-300" />
              <span className="h-1.5 w-10 rounded-full bg-gray-200" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
