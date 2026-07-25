"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu, X, ArrowRight, ChevronDown, ChevronLeft,
  Network, SquarePen, LayoutDashboard, ShieldCheck, Sparkles,
} from "lucide-react";
import { useT } from "@/lib/i18n/useT";
import LangSwitcher from "@/components/LangSwitcher";
import { whatsappLink } from "@/lib/whatsapp";

const BLUE_RGB = "43,111,212";

// Soluciones (orden == t.services.columns, de ahí sale el label traducido)
const SOLUTION_ITEMS = [
  { slug: "networking", icon: Network },
  { slug: "firma-biometrica", icon: SquarePen },
  { slug: "consultoria", icon: LayoutDashboard },
  { slug: "seguridad", icon: ShieldCheck },
  { slug: "software-ai", icon: Sparkles },
] as const;

const otherLinkHrefs = [
  { key: "partners", href: "/#partners" },
  { key: "about", href: "/#nosotros" },
  { key: "contact", href: "/#contacto" },
] as const;

export default function Navbar() {
  const t = useT();
  const pathname = usePathname();
  const activeSlug = pathname?.match(/^\/soluciones\/([^/]+)/)?.[1];
  const solutions = SOLUTION_ITEMS.map((s, i) => ({ ...s, label: t.services.columns[i].title }));
  const otherLinks = otherLinkHrefs.map((l) => ({ href: l.href, label: t.nav[l.key] }));

  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [solOpen, setSolOpen] = useState(false); // desktop dropdown
  const [solView, setSolView] = useState(false); // mobile: sub-vista de soluciones
  const solRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    // Al cerrar el menú, volvemos a la vista principal (no que reabra en soluciones).
    if (!open) setSolView(false);
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Cierra el dropdown al clickear fuera (abre solo con click, no hover).
  useEffect(() => {
    if (!solOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (solRef.current && !solRef.current.contains(e.target as Node)) setSolOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [solOpen]);

  const solutionPanel = (
    <div
      className="relative rounded-2xl p-1.5 overflow-hidden"
      style={{
        background: "linear-gradient(160deg, #16233a 0%, #0b1523 100%)",
        border: "1px solid rgba(255,255,255,0.1)",
        boxShadow: "0 24px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1)",
      }}
    >
      <div className="absolute inset-x-0 top-0 h-px pointer-events-none"
        style={{ background: `linear-gradient(90deg, transparent, rgba(${BLUE_RGB},0.7), transparent)` }} />
      {solutions.map((s) => {
        const Icon = s.icon;
        const active = s.slug === activeSlug;
        return (
          <Link
            key={s.slug}
            href={`/soluciones/${s.slug}`}
            onClick={() => { setSolOpen(false); setOpen(false); }}
            className="group/item relative flex items-center gap-3 px-2.5 py-2.5 rounded-xl transition-colors hover:bg-white/[0.08]"
            style={active ? { background: `linear-gradient(135deg, rgba(${BLUE_RGB},0.26), rgba(${BLUE_RGB},0.08))` } : undefined}
          >
            <span className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: `rgba(${BLUE_RGB},0.16)`, border: `1px solid rgba(${BLUE_RGB},0.3)` }}>
              <Icon size={15} style={{ color: "#7FB3F8" }} />
            </span>
            <span className={`text-sm font-medium ${active ? "text-white" : "text-gray-200"}`}>{s.label}</span>
            <ArrowRight size={14} className="ml-auto text-gray-600 group-hover/item:text-blue-400 group-hover/item:translate-x-0.5 transition-all" />
          </Link>
        );
      })}
      <Link
        href="/#contacto"
        onClick={() => { setSolOpen(false); setOpen(false); }}
        className="mt-1 flex items-center gap-2 px-2.5 py-2.5 rounded-xl text-[13px] text-gray-400 hover:text-blue-300 hover:bg-white/[0.05] transition-colors border-t border-white/[0.07]"
      >
        {t.services.ctaText}
        <ArrowRight size={13} className="ml-auto" />
      </Link>
    </div>
  );

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-[background-color,border-color,box-shadow] duration-300 ${
          scrolled ? "glass shadow-lg shadow-black/20" : "bg-gradient-to-b from-black/40 to-transparent"
        }`}
        // El borde se controla acá con un color EXPLÍCITO (transparente ↔ azul).
        // Antes lo ponía `.glass` y, al no existir borde en el estado inicial, su
        // color base era `currentColor` (texto casi blanco): `transition-all`
        // animaba el borde de blanco → azul = el flash blanco al scrollear.
        style={{ borderBottom: `1px solid ${scrolled ? "rgba(43,111,212,0.2)" : "transparent"}` }}
      >
        <div className="container-x flex items-center justify-between h-18 py-4">
          {/* Logo */}
          <a href="/" onClick={() => setOpen(false)} className="flex-shrink-0">
            <div className="flex items-center leading-none">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logos/accedra-outlined.svg" alt="Accedra" className="h-[26px] w-auto" />
            </div>
          </a>

          {/* Desktop right */}
          <div className="hidden md:flex items-center gap-10">
            {/* Soluciones dropdown */}
            <div ref={solRef} className="relative">
              <button
                onClick={() => setSolOpen((v) => !v)}
                onKeyDown={(e) => e.key === "Escape" && setSolOpen(false)}
                aria-haspopup="menu"
                aria-expanded={solOpen}
                className={`group relative flex items-center gap-1 text-sm font-medium transition-colors duration-200 ${
                  activeSlug || solOpen ? "text-white" : "text-gray-200 hover:text-white"
                }`}
              >
                {t.nav.services}
                <ChevronDown size={14} className={`transition-transform duration-200 ${solOpen ? "rotate-180" : ""}`} />
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-blue-400 transition-all duration-300 ${solOpen ? "w-full" : "w-0 group-hover:w-full"}`} />
              </button>
              <AnimatePresence>
                {solOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute left-1/2 -translate-x-1/2 top-full pt-3 w-[290px]"
                  >
                    {solutionPanel}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {otherLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-sm font-medium text-gray-200 hover:text-white transition-colors duration-200 relative group"
              >
                {l.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 group-hover:w-full transition-all duration-300" />
              </a>
            ))}
            <div className="w-px h-5 bg-white/15" />
            <LangSwitcher variant="desktop" />
            <a
              href="/#contacto"
              className="relative overflow-hidden shine text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-all duration-200 hover:-translate-y-0.5"
              style={{ background: "#2560BC", boxShadow: "0 8px 28px rgba(43,111,212,0.35)" }}
            >
              {t.nav.cta}
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-200"
            style={{
              background: open ? `rgba(${BLUE_RGB},0.15)` : "rgba(255,255,255,0.05)",
              border: `1px solid ${open ? `rgba(${BLUE_RGB},0.3)` : "rgba(255,255,255,0.1)"}`,
            }}
            onClick={() => setOpen(!open)}
          >
            <AnimatePresence mode="wait" initial={false}>
              {open ? (
                <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                  <X size={18} className="text-white" />
                </motion.span>
              ) : (
                <motion.span key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                  <Menu size={18} className="text-white" />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu — full-screen premium overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 flex flex-col md:hidden overflow-x-hidden"
            style={{
              background: "rgba(7,16,29,0.97)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
            }}
          >
            <div className="h-[2px] flex-shrink-0"
              style={{ background: `linear-gradient(to right, transparent, rgba(${BLUE_RGB},0.9) 30%, rgba(${BLUE_RGB},0.9) 70%, transparent)` }} />
            <div className="absolute inset-0 pointer-events-none"
              style={{ backgroundImage: `radial-gradient(circle, rgba(${BLUE_RGB},0.13) 1px, transparent 1px)`, backgroundSize: "28px 28px", opacity: 0.3 }} />
            <div className="absolute top-0 right-0 w-80 h-80 pointer-events-none"
              style={{ background: `radial-gradient(circle at top right, rgba(${BLUE_RGB},0.18) 0%, transparent 65%)` }} />

            <div className="h-[72px] flex-shrink-0" />

            {/* Nav — dos vistas: principal ↔ soluciones (drill-in con volver) */}
            <div className="relative flex-1 overflow-hidden">
              <AnimatePresence mode="wait" initial={false}>
                {!solView ? (
                  <motion.nav
                    key="main"
                    initial={{ opacity: 0, x: -24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -24 }}
                    transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-0 overflow-y-auto overflow-x-hidden flex flex-col justify-center px-6"
                  >
                    {/* Soluciones — abre la sub-vista (no despliega inline) */}
                    <button
                      onClick={() => setSolView(true)}
                      className="w-full group flex items-center gap-5 py-[17px] px-3 -mx-3 rounded-2xl border-b transition-colors hover:bg-white/[0.03]"
                      style={{ borderColor: "rgba(255,255,255,0.05)" }}
                    >
                      <span className="text-[11px] font-bold tabular-nums w-5 flex-shrink-0" style={{ color: `rgba(${BLUE_RGB},0.45)` }}>01</span>
                      <span className="text-white text-[22px] font-bold leading-none group-hover:text-blue-300 transition-colors">{t.nav.services}</span>
                      <ArrowRight size={18} className="ml-auto text-gray-600 group-hover:text-blue-400 group-hover:translate-x-1 transition-all duration-200" />
                    </button>

                    {otherLinks.map((l, i) => (
                      <a
                        key={l.href}
                        href={l.href}
                        onClick={() => setOpen(false)}
                        className="group flex items-center gap-5 py-[17px] px-3 -mx-3 rounded-2xl border-b last:border-0 transition-colors duration-200 hover:bg-white/[0.03] active:bg-white/[0.05]"
                        style={{ borderColor: "rgba(255,255,255,0.05)" }}
                      >
                        <span className="text-[11px] font-bold tabular-nums w-5 flex-shrink-0" style={{ color: `rgba(${BLUE_RGB},0.45)` }}>
                          {String(i + 2).padStart(2, "0")}
                        </span>
                        <span className="text-white text-[22px] font-bold leading-none group-hover:text-blue-300 transition-colors duration-200">{l.label}</span>
                        <ArrowRight size={15} className="ml-auto text-gray-700 group-hover:text-blue-400 group-hover:translate-x-1 transition-all duration-200" />
                      </a>
                    ))}
                  </motion.nav>
                ) : (
                  <motion.nav
                    key="sol"
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 24 }}
                    transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-0 overflow-y-auto overflow-x-hidden flex flex-col justify-center px-6"
                  >
                    {/* Volver a la vista principal */}
                    <button
                      onClick={() => setSolView(false)}
                      className="self-start inline-flex items-center gap-1.5 mb-7 py-2 pr-3 pl-1 -ml-1 rounded-full text-gray-400 hover:text-white transition-colors"
                    >
                      <ChevronLeft size={20} />
                      <span className="text-sm font-semibold uppercase tracking-wide">Volver</span>
                    </button>

                    <span className="text-blue-400 text-xs font-bold uppercase tracking-[0.2em] mb-4 pl-1">{t.nav.services}</span>

                    <div className="space-y-1">
                      {solutions.map((s) => {
                        const Icon = s.icon;
                        const active = s.slug === activeSlug;
                        return (
                          <Link
                            key={s.slug}
                            href={`/soluciones/${s.slug}`}
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-4 py-3 px-3 -mx-3 rounded-2xl transition-colors hover:bg-white/[0.04] active:bg-white/[0.06]"
                          >
                            <span className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                              style={{ background: `rgba(${BLUE_RGB},0.16)`, border: `1px solid rgba(${BLUE_RGB},0.3)` }}>
                              <Icon size={17} style={{ color: "#7FB3F8" }} />
                            </span>
                            <span className={`text-[18px] font-semibold ${active ? "text-blue-300" : "text-white"}`}>{s.label}</span>
                            <ArrowRight size={15} className="ml-auto text-gray-600" />
                          </Link>
                        );
                      })}
                    </div>
                  </motion.nav>
                )}
              </AnimatePresence>
            </div>

            {/* Bottom: contacto + acciones (CTA + WhatsApp) e idioma al final */}
            <div className="relative px-6 pb-10 flex-shrink-0 space-y-3">
              <div className="h-px mb-5" style={{ background: "rgba(255,255,255,0.06)" }} />

              {/* CTA principal */}
              <a
                href="/#contacto"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2.5 w-full py-4 rounded-full text-white font-semibold text-[15px] transition-opacity hover:opacity-90 active:scale-[0.99]"
                style={{ background: `#2560BC`, boxShadow: `0 8px 28px rgba(${BLUE_RGB},0.35)` }}
              >
                {t.nav.cta}
                <ArrowRight size={15} />
              </a>

              {/* WhatsApp — arriba del idioma */}
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2.5 w-full py-4 rounded-full text-white font-semibold text-[15px] transition-opacity hover:opacity-90 active:scale-[0.99]"
                style={{ background: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)", boxShadow: "0 8px 24px rgba(37,211,102,0.35)" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WhatsApp
              </a>

              {/* Idioma — abajo de todo */}
              <div className="flex items-center justify-between gap-3 pt-4 mt-1" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <span className="text-gray-500 text-xs font-semibold uppercase tracking-[0.14em]">{t.nav.language}</span>
                <LangSwitcher variant="mobile" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
