"use client";

import { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Building2, X, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

const BLUE_RGB = "43,111,212";

export type CaseModalItem = { image: string; tag: string; title: string; body?: string[] };

export default function CaseModal({
  items,
  open,
  onClose,
  onOpenChange,
}: {
  items: CaseModalItem[];
  open: number | null;
  onClose: () => void;
  onOpenChange: (i: number) => void;
}) {
  const go = useCallback(
    (dir: number) => {
      if (open === null) return;
      onOpenChange((open + dir + items.length) % items.length);
    },
    [open, items.length, onOpenChange]
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose, go]);

  const active = open !== null ? items[open] : null;

  return (
    <AnimatePresence>
      {active && open !== null && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
          style={{ background: "rgba(4,8,15,0.78)", backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)" }}>
          <motion.article
            key={open}
            initial={{ opacity: 0, y: 24, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-[720px] max-h-[88vh] overflow-y-auto rounded-3xl border"
            style={{ background: "#0B1422", borderColor: "rgba(255,255,255,0.1)", boxShadow: "0 40px 100px rgba(0,0,0,0.6)" }}>

            {/* Foto hero */}
            <div className="relative h-56 sm:h-64 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={active.image} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(11,20,34,0.25) 0%, rgba(11,20,34,0.65) 60%, #0B1422 100%)" }} />
              <span className="absolute bottom-4 left-6 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full"
                style={{ background: `rgba(${BLUE_RGB},0.4)`, color: "#EAF2FE", border: `1px solid rgba(${BLUE_RGB},0.55)`, backdropFilter: "blur(4px)" }}>
                <Building2 size={12} /> {active.tag}
              </span>
              <button onClick={onClose} aria-label="Cerrar"
                className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-white/90 hover:text-white transition-colors"
                style={{ background: "rgba(10,18,33,0.7)", border: "1px solid rgba(255,255,255,0.15)", backdropFilter: "blur(6px)" }}>
                <X size={16} />
              </button>
            </div>

            {/* Cuerpo editorial */}
            <div className="px-6 sm:px-9 py-7 sm:py-9">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-400 mb-3">Caso de éxito</p>
              <h3 className="text-white text-2xl sm:text-[28px] font-bold leading-tight mb-7">{active.title}</h3>

              <div className="space-y-5">
                {(active.body ?? []).map((p, k) => (
                  <p key={k} className="text-gray-300 text-[15.5px] leading-[1.75]">{p}</p>
                ))}
              </div>

              <div className="mt-8">
                <Link href="#contacto" onClick={onClose}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-white px-6 py-3.5 rounded-full transition-all hover:gap-3"
                  style={{ background: "linear-gradient(135deg, #4f8ef7 0%, #2B6FD4 50%, #1a4fa0 100%)", boxShadow: `0 10px 30px rgba(${BLUE_RGB},0.4)` }}>
                  Quiero un resultado así <ArrowRight size={16} />
                </Link>
              </div>
            </div>

            {/* Navegación entre casos */}
            <div className="sticky bottom-0 flex items-center justify-between px-6 sm:px-9 py-4 border-t"
              style={{ background: "rgba(11,20,34,0.9)", borderColor: "rgba(255,255,255,0.08)", backdropFilter: "blur(8px)" }}>
              <button onClick={() => go(-1)} aria-label="Caso anterior"
                className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors">
                <ChevronLeft size={16} /> Anterior
              </button>
              <div className="flex items-center gap-1.5">
                {items.map((_, k) => (
                  <span key={k} className="w-1.5 h-1.5 rounded-full transition-colors"
                    style={{ background: k === open ? "#5AA2F5" : "rgba(255,255,255,0.2)" }} />
                ))}
              </div>
              <button onClick={() => go(1)} aria-label="Caso siguiente"
                className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors">
                Siguiente <ChevronRight size={16} />
              </button>
            </div>
          </motion.article>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
