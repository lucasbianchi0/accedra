"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import {
  Menu, X, ArrowRight, ChevronDown,
  Network, SquarePen, LayoutDashboard, ShieldCheck, Sparkles,
} from "lucide-react";
import { useT } from "@/lib/i18n/useT";
import LangSwitcher from "@/components/LangSwitcher";
import { enter } from "@/components/Reveal";

/* El overlay del menú mobile es lo único que sigue necesitando framer-motion
 * (ver components/MobileMenu.tsx). Entra por `next/dynamic` para que la librería
 * NO viaje en el bundle de arranque: se descarga la primera vez que alguien toca
 * la hamburguesa, cuando las métricas ya se midieron. El navbar en sí —la barra,
 * el dropdown de desktop y el ícono— quedó en CSS.
 *
 * `ssr: false` porque el overlay no existe hasta que hay una interacción: no hay
 * nada que prerenderizar y evita mandar su markup en el HTML de cada página. */
const MobileMenu = dynamic(() => import("@/components/MobileMenu"), { ssr: false });

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
  // El overlay mobile se descarga la primera vez que se abre y de ahí en más
  // queda montado (cerrado): volver a pedirlo en cada apertura agregaría un
  // parpadeo mientras resuelve el import.
  const [menuLoaded, setMenuLoaded] = useState(false);
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
      {/* La entrada (caía desde -80px) va por CSS con el mismo helper que el hero.
          Con framer no se pintaba hasta después de hidratar: la barra aparecía
          tarde en mobile. */}
      <nav
        className={`hero-enter fixed top-0 left-0 right-0 z-50 transition-[background-color,border-color,box-shadow] duration-300 ${
          scrolled ? "glass shadow-lg shadow-black/20" : "bg-gradient-to-b from-black/40 to-transparent"
        }`}
        // El borde se controla acá con un color EXPLÍCITO (transparente ↔ azul).
        // Antes lo ponía `.glass` y, al no existir borde en el estado inicial, su
        // color base era `currentColor` (texto casi blanco): `transition-all`
        // animaba el borde de blanco → azul = el flash blanco al scrollear.
        style={{
          ...enter("-80px", "0.6s", "0s"),
          borderBottom: `1px solid ${scrolled ? "rgba(43,111,212,0.2)" : "transparent"}`,
        }}
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
              {/* El panel queda montado y sólo alterna `data-open`: así tiene
                  animación de salida sin `AnimatePresence`. `visibility` es lo
                  que lo saca del tabulado y del mouse mientras está cerrado —
                  `opacity: 0` solo lo dejaría clickeable. */}
              <div className="nav-dropdown absolute left-1/2 top-full pt-3 w-[290px]" data-open={solOpen ? "true" : "false"}>
                {solutionPanel}
              </div>
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
            onClick={() => { setMenuLoaded(true); setOpen(!open); }}
            aria-expanded={open}
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
          >
            {/* Los dos íconos montados y superpuestos, girando en sentidos
                opuestos. Antes era un AnimatePresence `mode="wait"`; acá el
                cruce lo hace la transición de CSS sobre `data-on`. */}
            <span className="nav-burger relative block w-[18px] h-[18px]">
              <span className="nav-icon" data-on={open ? "true" : "false"}>
                <X size={18} className="text-white" />
              </span>
              <span className="nav-icon nav-icon-alt" data-on={open ? "false" : "true"}>
                <Menu size={18} className="text-white" />
              </span>
            </span>
          </button>
        </div>
      </nav>

      {/* Overlay del menú mobile — se descarga al primer toque de la hamburguesa
          (ver el `dynamic` de arriba). Antes de eso no existe ni en el HTML ni en
          el bundle. */}
      {menuLoaded && (
        <MobileMenu
          open={open}
          onClose={() => setOpen(false)}
          solutions={solutions}
          otherLinks={otherLinks}
          activeSlug={activeSlug}
          labels={{ services: t.nav.services, cta: t.nav.cta, language: t.nav.language }}
        />
      )}
    </>
  );
}
