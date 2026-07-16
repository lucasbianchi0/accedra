"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { Capability } from "./solutionsData";
import {
  Check, Fingerprint, ScanFace, KeyRound, FileText, PenLine, Boxes,
  Cable, Share2, Wifi, Phone, ShieldCheck, Server, RefreshCw,
  Bug, Cloud, Laptop, Smartphone, Mail, Globe, Lock, AlertTriangle,
  BarChart3, Users, Database, Zap, BadgeCheck, ArrowRight,
} from "lucide-react";

const BLUE = "#2B6FD4";

function MiniCard({ children, className = "", style = {} }: { children?: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`rounded-xl bg-white border border-gray-200/70 shadow-[0_6px_20px_rgba(20,30,60,0.08)] ${className}`} style={style}>
      {children}
    </div>
  );
}

// Chip cuadrado: activo (azul, ícono blanco) o neutro (blanco, ícono azul)
function Chip({ icon: Ic, active, size = 40 }: { icon: React.ElementType; active?: boolean; size?: number }) {
  return (
    <div className="rounded-xl flex items-center justify-center flex-shrink-0"
      style={active
        ? { width: size, height: size, background: `linear-gradient(135deg, #5AA2F5, ${BLUE})`, boxShadow: "0 8px 20px rgba(43,111,212,0.35)" }
        : { width: size, height: size, background: "#fff", border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 2px 8px rgba(20,30,60,0.06)" }}>
      <Ic size={size * 0.45} className={active ? "text-white" : "text-blue-600"} />
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
function BluePill({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">{children}</span>
  );
}

// ─────────────────────────────────────────────────────────────────────
function Scene({ slug, i, icon: CapIcon }: { slug: string; i: number; icon?: React.ElementType }) {
  // ══ FIRMA BIOMÉTRICA ══
  if (slug === "firma-biometrica") {
    if (i === 0)
      return (
        <MiniCard className="w-[230px] p-4">
          <div className="flex items-center gap-2 mb-3"><FileText size={14} className="text-blue-600" /><span className="text-[11px] font-medium text-gray-500">Contrato.pdf</span></div>
          <svg viewBox="0 0 210 44" className="w-full"><path d="M6 32 C 26 6, 44 40, 66 22 S 104 4, 130 28 S 172 8, 204 24" stroke={BLUE} fill="none" strokeWidth="2.6" strokeLinecap="round" /></svg>
          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-1.5 text-[11px] font-medium text-emerald-600"><span className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center"><Check size={10} /></span>Válido legalmente</div>
        </MiniCard>
      );
    if (i === 1)
      return (
        <div className="relative w-[220px] h-[150px]">
          <MiniCard className="absolute top-3 left-8 w-[150px] h-[120px] rotate-[-6deg] opacity-60" />
          <MiniCard className="absolute top-1 left-3 w-[160px] h-[124px] p-4">
            <div className="h-2 w-20 rounded-full bg-gray-200 mb-2.5" /><div className="h-2 w-28 rounded-full bg-gray-100 mb-2.5" /><div className="h-2 w-16 rounded-full bg-gray-100" />
            <div className="absolute -right-3 -bottom-3 w-11 h-11 rounded-full text-white flex items-center justify-center shadow-lg" style={{ background: `linear-gradient(135deg, #5AA2F5, ${BLUE})` }}><Check size={20} strokeWidth={3} /></div>
          </MiniCard>
          <span className="absolute top-2 right-1"><BluePill>Web</BluePill></span>
          <span className="absolute bottom-1 right-6"><BluePill>Mobile</BluePill></span>
        </div>
      );
    if (i === 2)
      return (
        <MiniCard className="w-[210px] p-4">
          <div className="flex items-center justify-between mb-3"><span className="text-[11px] font-semibold text-gray-700">Factura</span><BluePill>Digital</BluePill></div>
          {[["Servicio A", "$ 1.200"], ["Servicio B", "$ 3.450"]].map(([a, b]) => (<div key={a} className="flex items-center justify-between py-1.5 border-b border-gray-100"><span className="text-[11px] text-gray-500">{a}</span><span className="text-[11px] font-medium text-gray-700">{b}</span></div>))}
          <div className="flex items-center justify-between pt-2.5"><span className="text-[11px] font-semibold text-gray-800">Total</span><span className="text-[13px] font-bold text-blue-600">$ 4.650</span></div>
        </MiniCard>
      );
    if (i === 3)
      return (
        <div className="relative w-[112px] h-[168px] rounded-[22px] bg-white border border-gray-200/80 shadow-[0_10px_30px_rgba(20,30,60,0.12)] p-2.5 flex flex-col">
          <div className="mx-auto w-10 h-1 rounded-full bg-gray-200 mb-3" />
          <div className="flex-1 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center px-2"><svg viewBox="0 0 90 34"><path d="M4 24 C 18 6, 30 30, 44 16 S 70 6, 86 20" stroke={BLUE} fill="none" strokeWidth="2.4" strokeLinecap="round" /></svg></div>
          <div className="mt-2.5 h-7 rounded-lg text-white text-[10px] font-semibold flex items-center justify-center gap-1" style={{ background: `linear-gradient(135deg, #5AA2F5, ${BLUE})` }}><PenLine size={11} /> Firmar</div>
        </div>
      );
    if (i === 4)
      return (
        <div className="relative w-[180px] h-[160px] flex items-center justify-center">
          <div className="absolute w-40 h-40 rounded-full border border-blue-200/60" /><div className="absolute w-28 h-28 rounded-full border border-blue-300/60" />
          <div className="relative w-16 h-16 rounded-2xl text-white flex items-center justify-center shadow-lg z-10" style={{ background: `linear-gradient(135deg, #5AA2F5, ${BLUE})` }}><Fingerprint size={30} /></div>
          <div className="absolute top-3 right-6"><Chip icon={ScanFace} size={36} /></div>
          <div className="absolute bottom-4 left-5"><Chip icon={KeyRound} size={36} /></div>
        </div>
      );
    return (
      <div className="grid grid-cols-3 gap-2.5 w-[168px]">
        {Array.from({ length: 9 }).map((_, k) => (<div key={k} className="aspect-square rounded-xl flex items-center justify-center" style={k === 4 ? { background: `linear-gradient(135deg, #5AA2F5, ${BLUE})`, boxShadow: "0 8px 20px rgba(43,111,212,0.35)" } : { background: "#fff", border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 2px 8px rgba(20,30,60,0.05)" }}>{k === 4 ? <Boxes size={20} className="text-white" /> : <div className="w-3.5 h-3.5 rounded-md" style={{ background: k % 2 ? "rgba(43,111,212,0.14)" : "rgba(0,0,0,0.06)" }} />}</div>))}
      </div>
    );
  }

  // ══ NETWORKING ══
  if (slug === "networking") {
    if (i === 0) // Cableado estructurado — patch panel
      return (
        <MiniCard className="w-[220px] p-4">
          <div className="flex items-center gap-1.5 text-[11px] text-gray-500 mb-3"><Cable size={13} className="text-blue-600" /> Patch panel</div>
          <div className="grid grid-cols-6 gap-1.5">
            {Array.from({ length: 12 }).map((_, k) => (<div key={k} className="aspect-square rounded-[5px]" style={[1, 3, 4, 8].includes(k) ? { background: `linear-gradient(135deg, #5AA2F5, ${BLUE})` } : { background: "#EEF1F6", border: "1px solid rgba(0,0,0,0.05)" }} />))}
          </div>
        </MiniCard>
      );
    if (i === 1) // Switching & Routing — nodo central + dispositivos
      return (
        <div className="relative w-[200px] h-[150px]">
          <svg viewBox="0 0 200 150" className="absolute inset-0 w-full h-full"><g stroke="rgba(43,111,212,0.35)" strokeWidth="2" fill="none"><path d="M100 75 L 40 30" /><path d="M100 75 L 160 30" /><path d="M100 75 L 40 120" /><path d="M100 75 L 160 120" /></g></svg>
          {[["10%", "8%"], ["72%", "8%"], ["10%", "72%"], ["72%", "72%"]].map(([l, t], k) => (<div key={k} className="absolute" style={{ left: l, top: t }}><Chip icon={Server} size={34} /></div>))}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"><Chip icon={Share2} active size={48} /></div>
        </div>
      );
    if (i === 2) // Wireless — AP con arcos wifi
      return (
        <div className="relative w-[170px] h-[150px] flex items-center justify-center">
          <div className="absolute w-40 h-40 rounded-full border border-blue-200/50" /><div className="absolute w-28 h-28 rounded-full border border-blue-300/50" /><div className="absolute w-16 h-16 rounded-full border border-blue-400/50" />
          <div className="relative w-14 h-14 rounded-2xl text-white flex items-center justify-center shadow-lg z-10" style={{ background: `linear-gradient(135deg, #5AA2F5, ${BLUE})` }}><Wifi size={26} /></div>
          <span className="absolute -bottom-1"><BluePill>Wi-Fi 6 · 5 GHz</BluePill></span>
        </div>
      );
    if (i === 3) // Telefonía IP — en llamada
      return (
        <MiniCard className="w-[210px] p-4 flex items-center gap-3">
          <div className="w-11 h-11 rounded-full text-white flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(135deg, #34d399, #059669)" }}><Phone size={18} /></div>
          <div className="flex-1"><div className="text-[12px] font-semibold text-gray-800">En llamada</div><div className="text-[11px] text-gray-400">VoIP · 00:42</div></div>
          <div className="flex gap-0.5 items-end h-5">{[8, 14, 10, 18, 12].map((h, k) => (<div key={k} className="w-1 rounded-full" style={{ height: h, background: BLUE }} />))}</div>
        </MiniCard>
      );
    if (i === 4) // Seguridad de red — protegida
      return (
        <MiniCard className="w-[190px] p-5 flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-2xl text-white flex items-center justify-center mb-3" style={{ background: `linear-gradient(135deg, #5AA2F5, ${BLUE})` }}><ShieldCheck size={26} /></div>
          <div className="text-[12px] font-semibold text-gray-800 mb-1">Red protegida</div>
          <GreenPill><Check size={10} /> Sin amenazas</GreenPill>
        </MiniCard>
      );
    return ( // Contingencia — redundancia / failover
      <div className="flex items-center gap-3">
        <MiniCard className="w-[74px] h-[92px] flex flex-col items-center justify-center gap-1"><Server size={22} className="text-blue-600" /><span className="text-[9px] text-gray-400">Nodo A</span></MiniCard>
        <div className="flex flex-col items-center text-blue-500"><RefreshCw size={22} /><span className="text-[8px] font-semibold text-blue-500 mt-1">Failover</span></div>
        <MiniCard className="w-[74px] h-[92px] flex flex-col items-center justify-center gap-1" style={{ borderColor: "rgba(43,111,212,0.4)" }}><Server size={22} className="text-blue-600" /><span className="text-[9px] text-gray-400">Nodo B</span></MiniCard>
      </div>
    );
  }

  // ══ SEGURIDAD ══
  if (slug === "seguridad") {
    if (i === 0) // Firewall NGFW
      return (
        <div className="relative w-[210px] h-[140px] flex items-center justify-center">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 flex flex-col gap-2">{[0, 1, 2].map((k) => <div key={k} className="w-6 h-1.5 rounded-full bg-gray-300" />)}</div>
          <div className="relative w-16 h-16 rounded-2xl text-white flex items-center justify-center shadow-lg z-10" style={{ background: `linear-gradient(135deg, #5AA2F5, ${BLUE})` }}><ShieldCheck size={28} /></div>
          <div className="absolute right-2 top-3"><GreenPill><Check size={10} /> Permitido</GreenPill></div>
          <div className="absolute right-2 bottom-3"><span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-red-100 text-red-600">✕ Bloqueado</span></div>
        </div>
      );
    if (i === 1) // Malware bloqueado
      return (
        <MiniCard className="w-[215px] p-4">
          <div className="flex items-center gap-2 mb-3"><div className="w-9 h-9 rounded-xl bg-red-100 text-red-600 flex items-center justify-center"><Bug size={18} /></div><div><div className="text-[12px] font-semibold text-gray-800">Amenaza detectada</div><div className="text-[10px] text-gray-400">trojan.win32</div></div></div>
          <div className="h-8 rounded-lg bg-red-50 text-red-600 text-[11px] font-semibold flex items-center justify-center gap-1.5"><AlertTriangle size={13} /> Malware bloqueado</div>
        </MiniCard>
      );
    if (i === 2) // Seguridad en la nube
      return (
        <div className="relative w-[180px] h-[130px] flex items-center justify-center">
          <Cloud size={110} className="text-blue-100" fill="rgb(219 234 254)" strokeWidth={1} />
          <div className="absolute w-12 h-12 rounded-2xl text-white flex items-center justify-center shadow-lg" style={{ background: `linear-gradient(135deg, #5AA2F5, ${BLUE})` }}><Lock size={20} /></div>
        </div>
      );
    if (i === 3) // Endpoints protegidos
      return (
        <div className="flex items-end gap-3">
          {[Laptop, Smartphone, Laptop].map((Ic, k) => (<MiniCard key={k} className="w-[60px] h-[76px] flex flex-col items-center justify-center gap-1 relative"><Ic size={20} className="text-gray-600" /><span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center"><Check size={11} strokeWidth={3} /></span></MiniCard>))}
        </div>
      );
    if (i === 4) // Protección de email
      return (
        <MiniCard className="w-[210px] p-4">
          <div className="flex items-center gap-2 mb-3"><Mail size={16} className="text-blue-600" /><span className="text-[11px] font-semibold text-gray-700">Bandeja de entrada</span></div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-red-50 mb-2"><span className="text-[10px] text-red-600 font-medium flex-1">Phishing detectado</span><span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-red-100 text-red-600">Bloqueado</span></div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-50"><span className="text-[10px] text-emerald-700 font-medium flex-1">Correo verificado</span><Check size={12} className="text-emerald-600" /></div>
        </MiniCard>
      );
    return ( // VPN & acceso remoto
      <div className="relative w-[210px] h-[120px] flex items-center justify-between px-2">
        <Chip icon={Laptop} size={44} />
        <svg viewBox="0 0 120 20" className="flex-1 mx-1"><path d="M2 10 H 118" stroke="rgba(43,111,212,0.4)" strokeWidth="2" strokeDasharray="4 4" /></svg>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full text-white flex items-center justify-center shadow-lg z-10" style={{ background: `linear-gradient(135deg, #5AA2F5, ${BLUE})` }}><Lock size={18} /></div>
        <Chip icon={Globe} size={44} />
        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2"><GreenPill><Check size={10} /> Conexión segura</GreenPill></span>
      </div>
    );
  }

  // ══ CONSULTORÍA MICROSOFT ══
  if (slug === "consultoria") {
  if (i === 0) // Power BI — dashboard
    return (
      <MiniCard className="w-[215px] p-4">
        <div className="flex items-center justify-between mb-3"><span className="text-[11px] font-semibold text-gray-700 flex items-center gap-1.5"><BarChart3 size={13} className="text-blue-600" /> Ventas</span><span className="text-[13px] font-bold text-blue-600">+24%</span></div>
        <div className="flex items-end gap-2 h-16">{[40, 65, 50, 80, 60, 95].map((h, k) => (<div key={k} className="flex-1 rounded-t-md" style={{ height: `${h}%`, background: k === 5 ? `linear-gradient(180deg, #5AA2F5, ${BLUE})` : "rgba(43,111,212,0.22)" }} />))}</div>
      </MiniCard>
    );
  if (i === 1) // Microsoft 365 & Teams — colaboración
    return (
      <div className="relative w-[200px] h-[140px]">
        <MiniCard className="absolute top-0 right-2 w-[130px] p-3"><div className="h-2 w-16 rounded-full bg-gray-200 mb-2" /><div className="h-2 w-24 rounded-full bg-gray-100 mb-2" /><div className="h-2 w-20 rounded-full bg-gray-100" /></MiniCard>
        <div className="absolute bottom-1 left-2 flex -space-x-2">{["#5AA2F5", "#34d399", "#f59e0b", "#a78bfa"].map((c, k) => (<div key={k} className="w-9 h-9 rounded-full border-2 border-white flex items-center justify-center text-white text-[11px] font-bold" style={{ background: c }}><Users size={14} /></div>))}</div>
      </div>
    );
  if (i === 2) // Dynamics 365 & SharePoint — tabla
    return (
      <MiniCard className="w-[215px] p-0 overflow-hidden">
        <div className="flex items-center gap-1.5 px-4 py-2.5 bg-gray-50 border-b border-gray-100"><Database size={12} className="text-blue-600" /><span className="text-[11px] font-semibold text-gray-600">Registros</span></div>
        {[0, 1, 2].map((r) => (<div key={r} className="flex items-center gap-3 px-4 py-2 border-b border-gray-100 last:border-0"><div className="w-6 h-6 rounded-md" style={{ background: r === 0 ? "rgba(43,111,212,0.15)" : "#EEF1F6" }} /><div className="h-2 flex-1 rounded-full bg-gray-100" /><div className="h-2 w-10 rounded-full bg-gray-100" /></div>))}
      </MiniCard>
    );
  if (i === 3) // Azure Cloud — nube + nodos
    return (
      <div className="relative w-[190px] h-[130px] flex items-center justify-center">
        <Cloud size={120} className="text-blue-100" fill="rgb(219 234 254)" strokeWidth={1} />
        <div className="absolute flex gap-2">{[Server, Server, Server].map((Ic, k) => (<Chip key={k} icon={Ic} active={k === 1} size={k === 1 ? 40 : 32} />))}</div>
      </div>
    );
  if (i === 4) // Power Automate — flujo
    return (
      <div className="relative w-[210px] h-[100px] flex items-center justify-between">
        <Chip icon={FileText} size={40} />
        <svg viewBox="0 0 40 10" className="w-10"><path d="M2 5 H 38" stroke="rgba(43,111,212,0.4)" strokeWidth="2" strokeDasharray="3 3" /></svg>
        <div className="w-12 h-12 rounded-2xl text-white flex items-center justify-center shadow-lg" style={{ background: `linear-gradient(135deg, #5AA2F5, ${BLUE})` }}><Zap size={22} /></div>
        <svg viewBox="0 0 40 10" className="w-10"><path d="M2 5 H 38" stroke="rgba(43,111,212,0.4)" strokeWidth="2" strokeDasharray="3 3" /></svg>
        <Chip icon={Check} size={40} />
      </div>
    );
  return ( // Licenciamiento & CSP
    <MiniCard className="w-[200px] p-5 flex flex-col items-center text-center">
      <div className="w-14 h-14 rounded-2xl text-white flex items-center justify-center mb-3" style={{ background: `linear-gradient(135deg, #5AA2F5, ${BLUE})` }}><BadgeCheck size={26} /></div>
      <div className="text-[12px] font-semibold text-gray-800 mb-1">Licencias optimizadas</div>
      <BluePill>CSP · 12 activas</BluePill>
    </MiniCard>
    );
  }

  // ══ FALLBACK GENÉRICO (ej. Software & AI) — el ícono de la capacidad ══
  return (
    <MiniCard className="w-[210px] p-5 flex flex-col items-center text-center">
      <div className="w-14 h-14 rounded-2xl text-white flex items-center justify-center mb-3" style={{ background: `linear-gradient(135deg, #5AA2F5, ${BLUE})` }}>
        {CapIcon ? <CapIcon size={26} /> : null}
      </div>
      <div className="h-2 w-24 rounded-full bg-gray-200 mb-2" />
      <div className="h-2 w-16 rounded-full bg-gray-100" />
    </MiniCard>
  );
}

export default function CapabilitiesBento({
  slug, eyebrow, title, items,
}: {
  slug: string;
  eyebrow: string;
  title: string;
  items: Capability[];
}) {
  return (
    <section id="capacidades" className="scroll-mt-24 py-14 lg:py-20 relative overflow-hidden bg-gradient-to-b from-[#07101D] to-[#0A1424]">
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
              className="group relative rounded-2xl overflow-hidden flex flex-col border transition-all duration-300 hover:-translate-y-1.5 hover:border-blue-500/30"
              style={{ background: "#0D1A2D", borderColor: "rgba(255,255,255,0.09)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.07), 0 8px 30px rgba(0,0,0,0.3)" }}
            >
              {/* tinte azul como las cards del home */}
              <div className="absolute inset-0 pointer-events-none z-[1]"
                style={{ background: "linear-gradient(160deg, rgba(43,111,212,0.14) 0%, transparent 42%)" }} />
              <div className="relative z-[2] h-40 flex items-center justify-center overflow-hidden"
                style={{ background: "linear-gradient(160deg, rgba(43,111,212,0.3) 0%, rgba(13,26,45,0) 72%)" }}>
                <div className="relative scale-[0.8] transition-transform duration-500 group-hover:scale-[0.86]">
                  <Scene slug={slug} i={i} icon={c.icon} />
                </div>
              </div>
              <div className="relative z-[2] p-5 border-t border-white/[0.06]">
                <h3 className="text-white font-bold text-[16px] mb-1.5">{c.title}</h3>
                <p className="text-gray-400 text-[13.5px] leading-relaxed">{c.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Link href="#contacto"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-[15px] font-semibold text-white transition-all hover:gap-3"
            style={{ background: "#2B6FD4", boxShadow: "0 10px 30px rgba(43,111,212,0.4)" }}>
            Solicitar un diagnóstico <ArrowRight size={17} />
          </Link>
        </div>
      </div>
    </section>
  );
}
