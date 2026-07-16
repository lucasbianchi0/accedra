"use client";

import { Check, FileText, Share2, ShieldCheck, BarChart3 } from "lucide-react";

const BLUE = "#2B6FD4";

// Todas las escenas comparten el mismo lenguaje: un mini-panel de producto
// blanco (MiniCard) sobre el header oscuro de la card. Consistencia = premium.
function MiniCard({
  children,
  className = "",
  style = {},
}: {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`rounded-xl bg-white border border-gray-200/70 shadow-[0_10px_30px_rgba(20,30,60,0.18)] ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}

function GreenPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
      {children}
    </span>
  );
}

// ── Una mini-pantalla de producto representativa por solución ────────────
export default function ServiceIllustration({ slug }: { slug: string }) {
  // NETWORKING — panel "Estado de red" con topología + uptime
  if (slug === "networking") {
    return (
      <MiniCard className="w-[224px] p-4">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[11px] font-semibold text-gray-700 flex items-center gap-1.5">
            <Share2 size={13} className="text-blue-600" /> Estado de red
          </span>
          <GreenPill>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Online
          </GreenPill>
        </div>
        <div className="relative h-[58px]">
          <svg viewBox="0 0 190 58" className="absolute inset-0 w-full h-full">
            <g stroke="rgba(43,111,212,0.4)" strokeWidth="1.6" fill="none">
              <path d="M95 29 L 30 12" />
              <path d="M95 29 L 160 12" />
              <path d="M95 29 L 30 46" />
              <path d="M95 29 L 160 46" />
            </g>
            {[[30, 12], [160, 12], [30, 46], [160, 46]].map(([cx, cy], k) => (
              <circle key={k} cx={cx} cy={cy} r="5" fill="#fff" stroke="rgba(43,111,212,0.5)" strokeWidth="1.6" />
            ))}
          </svg>
          <div
            className="svc-accent absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center text-white"
            style={{ background: `linear-gradient(135deg, #5AA2F5, ${BLUE})`, boxShadow: "0 6px 16px rgba(43,111,212,0.4)" }}
          >
            <Share2 size={15} />
          </div>
        </div>
        <div className="mt-2.5 pt-2.5 border-t border-gray-100 flex items-center justify-between">
          <span className="text-[11px] text-gray-500">4 sedes activas</span>
          <span className="text-[13px] font-bold text-blue-600">99.9%</span>
        </div>
      </MiniCard>
    );
  }

  // FIRMA BIOMÉTRICA — contrato firmado con validez legal
  if (slug === "firma-biometrica") {
    return (
      <MiniCard className="w-[224px] p-4">
        <div className="flex items-center gap-2 mb-3">
          <FileText size={14} className="text-blue-600" />
          <span className="text-[11px] font-medium text-gray-500">Contrato.pdf</span>
        </div>
        <svg viewBox="0 0 210 44" className="w-full">
          <path className="svc-accent" d="M6 32 C 26 6, 44 40, 66 22 S 104 4, 130 28 S 172 8, 204 24" stroke={BLUE} fill="none" strokeWidth="2.6" strokeLinecap="round" />
        </svg>
        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-1.5 text-[11px] font-medium text-emerald-600">
          <span className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center">
            <Check size={10} />
          </span>
          Válido legalmente
        </div>
      </MiniCard>
    );
  }

  // CONSULTORÍA MICROSOFT — dashboard Power BI
  if (slug === "consultoria") {
    return (
      <MiniCard className="w-[224px] p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-semibold text-gray-700 flex items-center gap-1.5">
            <BarChart3 size={13} className="text-blue-600" /> Ventas
          </span>
          <span className="text-[13px] font-bold text-blue-600">+24%</span>
        </div>
        <div className="flex items-end gap-2 h-16">
          {[40, 65, 50, 80, 60, 95].map((h, k) => (
            <div
              key={k}
              className={`flex-1 rounded-t-md ${k === 5 ? "svc-accent" : ""}`}
              style={{ height: `${h}%`, background: k === 5 ? `linear-gradient(180deg, #5AA2F5, ${BLUE})` : "rgba(43,111,212,0.22)" }}
            />
          ))}
        </div>
      </MiniCard>
    );
  }

  // SOFTWARE & AI — mini editor de código con sugerencia de IA
  if (slug === "software-ai") {
    return (
      <MiniCard className="w-[224px] p-0 overflow-hidden">
        <div className="flex items-center gap-1.5 px-3.5 py-2 bg-gray-50 border-b border-gray-100">
          <span className="w-2 h-2 rounded-full bg-red-300" />
          <span className="w-2 h-2 rounded-full bg-amber-300" />
          <span className="w-2 h-2 rounded-full bg-emerald-300" />
          <span className="ml-1.5 text-[10px] font-medium text-gray-400">app.tsx</span>
          <span
            className="svc-accent ml-auto text-[9px] font-bold text-white px-1.5 py-0.5 rounded-md"
            style={{ background: `linear-gradient(135deg, #5AA2F5, ${BLUE})` }}
          >
            AI
          </span>
        </div>
        <div className="p-3.5 space-y-2">
          <div className="flex gap-1.5 items-center">
            <div className="h-1.5 w-6 rounded-full bg-blue-300" />
            <div className="h-1.5 w-16 rounded-full bg-gray-200" />
          </div>
          <div className="flex gap-1.5 items-center pl-3">
            <div className="h-1.5 w-10 rounded-full bg-blue-200" />
            <div className="h-1.5 w-12 rounded-full bg-gray-200" />
          </div>
          <div className="flex gap-1.5 items-center pl-3 -mx-1 px-1 py-1 rounded-md" style={{ background: "rgba(43,111,212,0.10)" }}>
            <div className="h-1.5 w-14 rounded-full" style={{ background: BLUE }} />
            <div className="h-1.5 w-8 rounded-full bg-blue-200" />
          </div>
          <div className="flex gap-1.5 items-center">
            <div className="h-1.5 w-8 rounded-full bg-gray-200" />
            <div className="h-1.5 w-10 rounded-full bg-gray-100" />
          </div>
        </div>
      </MiniCard>
    );
  }

  // SEGURIDAD — panel "Red protegida" (amenazas bloqueadas)
  return (
    <MiniCard className="w-[224px] p-4">
      <div className="flex items-center gap-3 mb-3">
        <div
          className="svc-accent w-9 h-9 rounded-xl flex items-center justify-center text-white flex-shrink-0"
          style={{ background: `linear-gradient(135deg, #5AA2F5, ${BLUE})`, boxShadow: "0 6px 16px rgba(43,111,212,0.4)" }}
        >
          <ShieldCheck size={18} />
        </div>
        <div>
          <div className="text-[12px] font-semibold text-gray-800 leading-tight">Red protegida</div>
          <div className="text-[10px] text-gray-400">Firewall · Zero Trust</div>
        </div>
      </div>
      <div className="h-8 rounded-lg bg-emerald-50 text-emerald-700 text-[11px] font-semibold flex items-center justify-center gap-1.5">
        <Check size={13} /> 12 amenazas bloqueadas
      </div>
    </MiniCard>
  );
}
