"use client";

import { useEffect, useRef } from "react";
import { ArrowUp, ChevronDown, RotateCcw, X } from "lucide-react";
import Robot from "./Robot";
import Conversacion, { whatsappDeLaCharla } from "./Conversacion";
import { IconoWhatsApp } from "./Tarjetas";
import { enviar, reiniciar, useConversacion } from "@/lib/chat/store";
import { track } from "@/lib/track";

/**
 * El panel flotante del asistente.
 *
 * En escritorio es una tarjeta abajo a la derecha, por encima de los botones;
 * en el teléfono ocupa la pantalla entera y se acomoda al teclado (con
 * `visualViewport`: en iOS `100dvh` no se achica cuando aparece el teclado y el
 * campo de texto quedaría tapado). La conversación es la misma que la de la
 * tarjeta de la portada: vive en `lib/chat/store`.
 */

const SUGERENCIAS = [
  "Somos una logística con varios depósitos y la red se cae seguido",
  "Queremos dejar de imprimir y firmar contratos en papel",
  "Tenemos datos en planillas y nadie ve los números a tiempo",
  "Nos preocupa un ataque de ransomware",
];

export default function ChatPanel({ abierto, onCerrar }: { abierto: boolean; onCerrar: () => void }) {
  const { mensajes } = useConversacion();
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!abierto) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onCerrar();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [abierto, onCerrar]);

  // En el teléfono: pantalla completa, sin scroll de fondo, y el panel del
  // alto de lo que queda visible por encima del teclado.
  useEffect(() => {
    if (!abierto || !window.matchMedia("(max-width: 639px)").matches) return;
    const body = document.body;
    const previo = body.style.overflow;
    body.style.overflow = "hidden";
    const vv = window.visualViewport;
    const el = panel.current;
    const ajustar = () => {
      if (!el || !vv) return;
      el.style.height = `${vv.height}px`;
      el.style.transform = `translateY(${vv.offsetTop}px)`;
    };
    ajustar();
    vv?.addEventListener("resize", ajustar);
    vv?.addEventListener("scroll", ajustar);
    return () => {
      body.style.overflow = previo;
      vv?.removeEventListener("resize", ajustar);
      vv?.removeEventListener("scroll", ajustar);
      if (el) {
        el.style.height = "";
        el.style.transform = "";
      }
    };
  }, [abierto]);

  // En el teléfono el panel tapa la página: al seguir un link se cierra para
  // que se vea adónde llevó. En escritorio queda abierto al costado.
  const onNavegar = () => {
    if (window.matchMedia("(max-width: 639px)").matches) onCerrar();
  };

  const vacio = mensajes.length === 0;

  return (
    <div
      ref={panel}
      role="dialog"
      aria-modal="false"
      aria-label="Asistente de Accedra"
      data-open={abierto ? "true" : "false"}
      className="chat-panel fixed inset-x-0 top-0 z-[80] flex h-[100dvh] flex-col overflow-hidden bg-navy-800 sm:inset-auto sm:bottom-6 sm:right-5 sm:top-auto sm:h-[min(680px,calc(100dvh-48px))] sm:w-[400px] sm:rounded-[26px] sm:border sm:border-white/10 sm:shadow-[0_30px_90px_rgba(0,0,0,0.6)]"
    >
      <div aria-hidden className="pointer-events-none absolute -top-24 left-1/2 h-56 w-[120%] -translate-x-1/2 rounded-full bg-accent/20 blur-3xl" />

      <header className="relative flex items-center gap-3 border-b border-white/[0.06] px-4 pb-3 pt-[max(12px,env(safe-area-inset-top))] sm:pt-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/10 bg-gradient-to-br from-accent to-[#1c4f9c] text-white">
          <Robot size={22} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-display text-[15px] font-semibold leading-tight text-white">Asistente Accedra</p>
          <p className="flex items-center gap-1.5 text-[11.5px] text-gray-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Responde al instante · un especialista sigue tu caso
          </p>
        </div>
        {!vacio && (
          <button
            type="button"
            onClick={reiniciar}
            aria-label="Empezar de nuevo"
            title="Empezar de nuevo"
            className="rounded-full p-2 text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
          >
            <RotateCcw size={16} />
          </button>
        )}
        <button
          type="button"
          onClick={onCerrar}
          aria-label="Cerrar el asistente"
          className="rounded-full p-2 text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
        >
          <ChevronDown size={20} className="sm:hidden" />
          <X size={18} className="hidden sm:block" />
        </button>
      </header>

      {abierto && <EnfocarAlAbrir />}
      <Conversacion
        origen="panel"
        onNavegar={onNavegar}
        placeholder={vacio ? "Ej.: somos una clínica y…" : "Escribí tu mensaje"}
        inicio={
          <div className="flex min-h-full flex-col">
            <div className="mb-5">
              <p className="font-display text-[22px] font-semibold leading-tight text-white">
                Contanos qué está frenando tu operación.
              </p>
              <p className="mt-2 text-[13.5px] leading-relaxed text-gray-400">
                Te damos una primera devolución en el momento, te mostramos cómo lo resolvimos en empresas parecidas y,
                si querés, un especialista analiza tu proceso sin costo.
              </p>
            </div>
            <div className="space-y-2">
              {SUGERENCIAS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => void enviar(s, "sugerencia")}
                  className="group flex w-full items-center justify-between gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-left text-[13.5px] text-gray-300 transition-all hover:border-accent-300/30 hover:bg-white/[0.06] hover:text-white"
                >
                  {s}
                  <ArrowUp size={14} className="shrink-0 rotate-45 text-gray-600 transition-colors group-hover:text-accent-300" />
                </button>
              ))}
            </div>
            <div className="mt-auto pt-6">
              <a
                href={whatsappDeLaCharla(mensajes)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track({ type: "click", name: "whatsapp", target: "chat_inicio" })}
                className="flex items-center justify-center gap-2 text-[12.5px] text-gray-400 transition-colors hover:text-[#25D366]"
              >
                <IconoWhatsApp size={14} />
                ¿Preferís hablar con una persona? Escribinos por WhatsApp
              </a>
            </div>
          </div>
        }
      />
    </div>
  );
}

/** En escritorio, el foco va al campo cada vez que se abre el panel. */
function EnfocarAlAbrir() {
  useEffect(() => {
    if (!window.matchMedia("(min-width: 640px)").matches) return;
    const t = setTimeout(() => {
      document.querySelector<HTMLTextAreaElement>(".chat-panel textarea")?.focus({ preventScroll: true });
    }, 80);
    return () => clearTimeout(t);
  }, []);
  return null;
}
