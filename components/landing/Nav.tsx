"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  ArrowRight, ChevronDown, LayoutDashboard, Menu, Network, ShieldCheck, Sparkles, SquarePen, X,
} from "lucide-react";
import LangSwitcher from "@/components/LangSwitcher";
import { LogoAccedraAI, NombreAccedraAI } from "@/components/chat/AccedraAI";
import { useChat } from "@/components/chat/ChatProvider";
import { useT } from "@/lib/i18n/useT";
import { track } from "@/lib/track";

// Igual que en Navbar: el overlay arrastra framer-motion, se baja al primer toque.
const MobileMenu = dynamic(() => import("@/components/MobileMenu"), { ssr: false });

// Mismo orden que t.services.columns. Los íconos los pide MobileMenu.
const SOLUCIONES = [
  { slug: "networking", icon: Network },
  { slug: "firma-biometrica", icon: SquarePen },
  { slug: "consultoria", icon: LayoutDashboard },
  { slug: "seguridad", icon: ShieldCheck },
  { slug: "software-ai", icon: Sparkles },
];

export default function Nav() {
  const t = useT();
  const { abrirHoja, precargarHoja } = useChat();
  const [claro, setClaro] = useState(false);
  const [bajo, setBajo] = useState(false);
  const [abierto, setAbierto] = useState(false);
  const [menuListo, setMenuListo] = useState(false);
  const [solAbierto, setSolAbierto] = useState(false);
  const solRef = useRef<HTMLDivElement>(null);

  const soluciones = SOLUCIONES.map((s, i) => ({ ...s, label: t.services.columns[i].title }));
  const enlaces = [
    { href: "#partners", label: t.nav.partners },
    { href: "#nosotros", label: t.nav.about },
    { href: "#contacto", label: t.nav.contact },
  ];

  // La barra pasa a blanca cuando la portada queda detrás, con un observer: no
  // hace falta escuchar el scroll durante toda la visita.
  useEffect(() => {
    const portada = document.getElementById("inicio");
    if (!portada) return;
    const ob = new IntersectionObserver(([e]) => setClaro(!e.isIntersecting), { rootMargin: "-90px 0px 0px 0px" });
    ob.observe(portada);
    // Apenas se baja, la barra necesita fondo: el texto de la portada pasa debajo.
    const tope = portada.querySelector("[data-lp-tope]");
    const obTope = new IntersectionObserver(([e]) => setBajo(!e.isIntersecting));
    if (tope) obTope.observe(tope);
    return () => {
      ob.disconnect();
      obTope.disconnect();
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = abierto ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [abierto]);

  useEffect(() => {
    if (!solAbierto) return;
    const fuera = (e: MouseEvent) => {
      if (!solRef.current?.contains(e.target as Node)) setSolAbierto(false);
    };
    document.addEventListener("mousedown", fuera);
    return () => document.removeEventListener("mousedown", fuera);
  }, [solAbierto]);

  return (
    <>
      <nav className="lp-nav" data-claro={(claro && !abierto) || undefined} data-bajo={bajo || undefined} aria-label="Principal">
        <div className="lp-nav-barra">
          <Link href="/" className="lp-nav-logo" aria-label="Accedra">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logos/accedra-outlined.svg" alt="" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logos/accedra-navy.svg" alt="" />
          </Link>

          <div className="lp-nav-enlaces">
            <div ref={solRef} className="relative">
              <button
                type="button"
                onClick={() => setSolAbierto((v) => !v)}
                onKeyDown={(e) => e.key === "Escape" && setSolAbierto(false)}
                aria-haspopup="menu"
                aria-expanded={solAbierto}
              >
                {t.nav.services}
                <ChevronDown size={14} className={`transition-transform duration-200 ${solAbierto ? "rotate-180" : ""}`} />
              </button>
              <div className="nav-dropdown absolute left-1/2 top-full pt-3 w-[270px]" data-open={solAbierto ? "true" : "false"}>
                <div className="lp-nav-panel">
                  {soluciones.map((s) => (
                    <Link key={s.slug} href={`/soluciones/${s.slug}`} onClick={() => setSolAbierto(false)}>
                      {s.label}
                      <ArrowRight size={14} aria-hidden />
                    </Link>
                  ))}
                  <a href="#contacto" onClick={() => setSolAbierto(false)} className="lp-nav-panel-cta">
                    {t.services.ctaText}
                    <ArrowRight size={14} aria-hidden />
                  </a>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                track({ type: "click", name: "asistente", target: "menu" });
                abrirHoja(undefined, "menu");
              }}
              onPointerEnter={precargarHoja}
              className="lp-nav-asistente"
            >
              <LogoAccedraAI size={18} />
              <NombreAccedraAI />
            </button>

            {enlaces.map((l) => (
              <a key={l.href} href={l.href}>{l.label}</a>
            ))}
          </div>

          <div className="lp-nav-der">
            <LangSwitcher variant="desktop" />
            <a href="#contacto" className="lp-nav-cta">{t.nav.cta}</a>
          </div>

          <button
            type="button"
            className="lp-nav-burger"
            onClick={() => {
              setMenuListo(true);
              setAbierto(!abierto);
            }}
            aria-expanded={abierto}
            aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
          >
            {abierto ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </nav>

      {menuListo && (
        <MobileMenu
          open={abierto}
          onClose={() => setAbierto(false)}
          solutions={soluciones}
          otherLinks={enlaces}
          activeSlug={undefined}
          labels={{ services: t.nav.services, cta: t.nav.cta, language: t.nav.language }}
          ocultoDesde="min-[1100px]:hidden"
          onAsistente={() => {
            setAbierto(false);
            track({ type: "click", name: "asistente", target: "menu_mobile" });
            abrirHoja(undefined, "menu");
          }}
        />
      )}
    </>
  );
}
