"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu, X, Phone, ArrowRight, ChevronDown,
  Network, SquarePen, LayoutDashboard, ShieldCheck, Sparkles,
} from "lucide-react";
import { useT } from "@/lib/i18n/useT";
import LangSwitcher from "@/components/LangSwitcher";

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
  const [solExpand, setSolExpand] = useState(false); // mobile accordion
  const solRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
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
        border: "1px solid rgba(255,255,255,0.12)",
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
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "glass shadow-lg shadow-black/20" : "bg-transparent"
        }`}
      >
        <div className="w-full px-6 lg:px-16 xl:px-24 flex items-center justify-between h-18 py-4">
          {/* Logo */}
          <a href="/" onClick={() => setOpen(false)} className="flex-shrink-0">
            <div className="flex flex-col leading-none">
              <span className="logo-word text-2xl text-white tracking-widest">ACCEDRA</span>
              <span className="logo-sub text-[10px] tracking-[0.25em] text-blue-400 uppercase">IT Solutions</span>
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
                className={`flex items-center gap-1 text-sm font-medium transition-colors duration-200 ${
                  activeSlug || solOpen ? "text-white" : "text-gray-300 hover:text-white"
                }`}
              >
                {t.nav.services}
                <ChevronDown size={14} className={`transition-transform duration-200 ${solOpen ? "rotate-180" : ""}`} />
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
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors duration-200 relative group"
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
              style={{ background: "#2B6FD4", boxShadow: "0 8px 28px rgba(43,111,212,0.35)" }}
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
            className="fixed inset-0 z-40 flex flex-col md:hidden"
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

            {/* Nav — Soluciones (acordeón) + resto */}
            <nav className="relative flex-1 overflow-y-auto flex flex-col justify-center px-6">
              {/* Soluciones accordion */}
              <div className="border-b" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                <button
                  onClick={() => setSolExpand((v) => !v)}
                  className="w-full group flex items-center gap-5 py-[17px] px-3 -mx-3 rounded-2xl transition-colors hover:bg-white/[0.03]"
                >
                  <span className="text-[11px] font-bold tabular-nums w-5 flex-shrink-0" style={{ color: `rgba(${BLUE_RGB},0.45)` }}>01</span>
                  <span className="text-white text-[22px] font-bold leading-none group-hover:text-blue-300 transition-colors">{t.nav.services}</span>
                  <ChevronDown size={20} className={`ml-auto text-gray-500 transition-transform duration-200 ${solExpand ? "rotate-180 text-blue-400" : ""}`} />
                </button>
                <AnimatePresence initial={false}>
                  {solExpand && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="pl-10 pb-3 space-y-0.5">
                        {solutions.map((s) => {
                          const Icon = s.icon;
                          const active = s.slug === activeSlug;
                          return (
                            <Link
                              key={s.slug}
                              href={`/soluciones/${s.slug}`}
                              onClick={() => setOpen(false)}
                              className="flex items-center gap-3 py-2.5 px-2 -mx-2 rounded-xl transition-colors hover:bg-white/[0.04]"
                            >
                              <span className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                                style={{ background: `rgba(${BLUE_RGB},0.16)`, border: `1px solid rgba(${BLUE_RGB},0.3)` }}>
                                <Icon size={13} style={{ color: "#7FB3F8" }} />
                              </span>
                              <span className={`text-[16px] font-semibold ${active ? "text-blue-300" : "text-gray-200"}`}>{s.label}</span>
                            </Link>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

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
            </nav>

            {/* Bottom: language + phone + CTA */}
            <div className="relative px-6 pb-10 flex-shrink-0 space-y-3">
              <div className="h-px mb-5" style={{ background: "rgba(255,255,255,0.06)" }} />
              <div className="flex items-center justify-between gap-3 pb-1">
                <span className="text-gray-500 text-xs font-semibold uppercase tracking-[0.14em]">{t.nav.language}</span>
                <LangSwitcher variant="mobile" />
              </div>
              <a href="tel:+541153659887" className="flex items-center gap-3 group">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: `rgba(${BLUE_RGB},0.12)`, border: `1px solid rgba(${BLUE_RGB},0.22)` }}>
                  <Phone size={13} style={{ color: "#7FB3F8" }} />
                </div>
                <span className="text-gray-400 text-sm group-hover:text-gray-200 transition-colors">(+54 11) 5365-9887</span>
              </a>
              <a
                href="/#contacto"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2.5 w-full py-4 rounded-2xl text-white font-semibold text-[15px] transition-opacity hover:opacity-90 active:scale-[0.99]"
                style={{ background: `#2B6FD4`, boxShadow: `0 8px 28px rgba(${BLUE_RGB},0.35)` }}
              >
                {t.nav.cta}
                <ArrowRight size={15} />
              </a>
              <a
                href="https://www.linkedin.com/company/accedra-s.a."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 pt-1 text-gray-500 text-xs hover:text-blue-300 transition-colors"
              >
                <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor" aria-hidden="true">
                  <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.22.79 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
                </svg>
                {t.nav.followLinkedin}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
