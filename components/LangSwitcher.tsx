"use client";

import { useEffect, useRef, useState } from "react";
import { useLang } from "@/lib/i18n/LangProvider";
import { LANGS, LANG_LABELS, LANG_NAMES } from "@/lib/i18n/config";

const BLUE_RGB = "43,111,212";

/**
 * Selector de idioma ES · EN · PT.
 * - variant "desktop": botón compacto con dropdown (para la navbar).
 * - variant "mobile": control segmentado siempre visible (para el overlay mobile).
 */
export default function LangSwitcher({
  variant = "desktop",
}: {
  variant?: "desktop" | "mobile";
}) {
  const { lang, setLang } = useLang();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  if (variant === "mobile") {
    return (
      <div
        className="inline-flex items-center gap-1 p-1 rounded-full"
        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
      >
        {LANGS.map((l) => {
          const active = l === lang;
          return (
            <button
              key={l}
              onClick={() => setLang(l)}
              aria-label={LANG_NAMES[l]}
              aria-pressed={active}
              className="px-3.5 py-1.5 rounded-full text-[13px] font-semibold transition-colors"
              style={
                active
                  ? { background: `rgba(${BLUE_RGB},0.9)`, color: "#fff" }
                  : { color: "rgba(255,255,255,0.6)" }
              }
            >
              {LANG_LABELS[l]}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Idioma / Language"
        className="flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-semibold text-gray-300 hover:text-white transition-colors"
        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
      >
        <GlobeIcon />
        {LANG_LABELS[lang]}
        <span className={`text-[10px] transition-transform ${open ? "rotate-180" : ""}`}>▾</span>
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute right-0 mt-2.5 w-44 p-1.5 rounded-2xl overflow-hidden z-50 origin-top-right animate-lang-pop"
          style={{
            background:
              "linear-gradient(160deg, rgba(28,42,66,0.55) 0%, rgba(10,18,33,0.62) 100%)",
            border: "1px solid rgba(255,255,255,0.14)",
            backdropFilter: "blur(26px) saturate(160%)",
            WebkitBackdropFilter: "blur(26px) saturate(160%)",
            boxShadow:
              "0 24px 60px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.14), inset 0 0 0 1px rgba(255,255,255,0.02)",
          }}
        >
          {/* brillo superior azul */}
          <div
            className="absolute inset-x-0 top-0 h-px pointer-events-none"
            style={{
              background: `linear-gradient(90deg, transparent, rgba(${BLUE_RGB},0.7), transparent)`,
            }}
          />
          {LANGS.map((l) => {
            const active = l === lang;
            return (
              <button
                key={l}
                role="option"
                aria-selected={active}
                onClick={() => {
                  setLang(l);
                  setOpen(false);
                }}
                className="relative w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm transition-all duration-150 hover:bg-white/[0.08]"
                style={
                  active
                    ? {
                        color: "#EAF2FE",
                        background: `linear-gradient(135deg, rgba(${BLUE_RGB},0.28), rgba(${BLUE_RGB},0.08))`,
                        boxShadow: `inset 0 0 0 1px rgba(${BLUE_RGB},0.35)`,
                      }
                    : { color: "rgba(255,255,255,0.72)" }
                }
              >
                <span className="font-medium">{LANG_NAMES[l]}</span>
                <span className="text-[11px] font-bold tracking-wider opacity-70">{LANG_LABELS[l]}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function GlobeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <circle cx="12" cy="12" r="9.5" />
      <path d="M2.5 12h19M12 2.5c2.6 2.5 4 6 4 9.5s-1.4 7-4 9.5c-2.6-2.5-4-6-4-9.5s1.4-7 4-9.5z" />
    </svg>
  );
}
