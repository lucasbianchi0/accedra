"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowUp, Square } from "lucide-react";
import Robot from "./Robot";
import Formato from "./Formato";
import { Caso, Contacto, Humano, IconoWhatsApp, Solucion, enlaceWhatsApp } from "./Tarjetas";
import { LIMITES_CHAT, type Tarjeta } from "@/lib/chat/tipos";
import {
  conversacionEnTexto,
  detener,
  enviar,
  marcarLeadEnviado,
  textoDe,
  useConversacion,
} from "@/lib/chat/store";
import { track } from "@/lib/track";

/**
 * La conversación: los mensajes, las tarjetas y el campo para escribir.
 *
 * La usan el panel flotante y la tarjeta de la portada. Cada uno pone su marco
 * y su encabezado; lo de adentro es lo mismo y lee el mismo store, así que la
 * charla que empezó en el hero sigue en el panel al bajar por la página.
 */

export function whatsappDeLaCharla(mensajes: ReturnType<typeof useConversacion>["mensajes"]) {
  const primero = mensajes.find((m) => m.rol === "user");
  return enlaceWhatsApp(
    primero
      ? `Hola, vengo del asistente del sitio. Mi consulta: ${textoDe(primero).slice(0, 400)}`
      : "Hola, quisiera hablar con un especialista de Accedra.",
  );
}

export default function Conversacion({
  inicio,
  onNavegar,
  origen,
  placeholder = "Escribí tu mensaje",
}: {
  /** Lo que se ve antes del primer mensaje. */
  inicio?: ReactNode;
  onNavegar: () => void;
  /** Para el tracking: desde dónde escribió. */
  origen: string;
  placeholder?: string;
}) {
  const { mensajes, enCurso, leadEnviado } = useConversacion();
  const [texto, setTexto] = useState("");
  const lista = useRef<HTMLDivElement>(null);
  const campo = useRef<HTMLTextAreaElement>(null);

  // Al fondo con cada novedad, salvo que la persona haya subido a releer.
  useEffect(() => {
    const el = lista.current;
    if (!el) return;
    const cerca = el.scrollHeight - el.scrollTop - el.clientHeight < 160;
    if (cerca || !enCurso) el.scrollTo({ top: el.scrollHeight, behavior: enCurso ? "auto" : "smooth" });
  }, [mensajes, enCurso]);

  // El campo crece con el texto hasta cinco líneas.
  useEffect(() => {
    const el = campo.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 132)}px`;
  }, [texto]);

  const mandar = () => {
    if (!texto.trim() || enCurso) return;
    void enviar(texto, origen);
    setTexto("");
  };

  const vacio = mensajes.length === 0;
  const ultimo = mensajes[mensajes.length - 1];
  const pensando = enCurso && ultimo?.rol === "assistant" && ultimo.partes.length === 0;

  return (
    <>
      <div ref={lista} data-lenis-prevent className="chat-scroll relative flex-1 overflow-y-auto overscroll-contain px-4 py-5">
        {vacio ? (
          inicio
        ) : (
          <div className="space-y-5">
            {mensajes.map((m) =>
              m.rol === "user" ? (
                <div key={m.id} className="flex justify-end">
                  <div className="max-w-[85%] whitespace-pre-wrap break-words rounded-[20px] rounded-br-md bg-accent-600 px-4 py-2.5 text-[14px] leading-relaxed text-white">
                    {textoDe(m)}
                  </div>
                </div>
              ) : (
                <div key={m.id} className="flex gap-2.5">
                  <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white/[0.06] text-accent-300">
                    <Robot size={17} vivo={false} />
                  </span>
                  <div className="min-w-0 flex-1 space-y-3 text-[14px] leading-relaxed text-gray-200">
                    {m.partes.map((p, i) =>
                      p.tipo === "texto" ? (
                        <Formato key={i} texto={p.texto} onNavegar={onNavegar} />
                      ) : (
                        <TarjetaVista key={i} t={p.tarjeta} onNavegar={onNavegar} leadEnviado={leadEnviado} />
                      ),
                    )}
                    {m.id === ultimo?.id && pensando && (
                      <span className="chat-pensando inline-flex gap-1 py-2" aria-label="Escribiendo">
                        <i />
                        <i />
                        <i />
                      </span>
                    )}
                    {m.error && (
                      <div className="rounded-xl border border-red-400/20 bg-red-400/[0.06] px-3 py-2 text-[13px] text-red-200">
                        {m.error}
                      </div>
                    )}
                  </div>
                </div>
              ),
            )}
          </div>
        )}
      </div>

      <div className="relative border-t border-white/[0.06] px-3 pb-[max(12px,env(safe-area-inset-bottom))] pt-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            mandar();
          }}
          className="flex items-end gap-2 rounded-[22px] border border-white/10 bg-white/[0.04] py-1.5 pl-4 pr-1.5 transition-colors focus-within:border-accent-300/40"
        >
          <textarea
            ref={campo}
            rows={1}
            value={texto}
            maxLength={LIMITES_CHAT.mensaje}
            onChange={(e) => setTexto(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                e.preventDefault();
                mandar();
              }
            }}
            placeholder={placeholder}
            aria-label="Tu mensaje"
            className="chat-campo max-h-[132px] flex-1 resize-none bg-transparent py-2 text-[16px] leading-snug text-white placeholder:text-gray-500 outline-none sm:text-[14px]"
          />
          {enCurso ? (
            <button
              type="button"
              onClick={detener}
              aria-label="Detener"
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/15"
            >
              <Square size={12} fill="currentColor" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={!texto.trim()}
              aria-label="Enviar"
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent-600 text-white transition-all hover:bg-accent disabled:bg-white/10 disabled:text-gray-500"
            >
              <ArrowUp size={17} />
            </button>
          )}
        </form>
        <div className="mt-2 flex items-center justify-between px-1 text-[11px] text-gray-600">
          <span>Asistente con IA · puede equivocarse</span>
          <a
            href={whatsappDeLaCharla(mensajes)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track({ type: "click", name: "whatsapp", target: `chat_pie:${origen}` })}
            className="inline-flex items-center gap-1 font-medium text-gray-400 transition-colors hover:text-[#25D366]"
          >
            <IconoWhatsApp size={12} />
            Hablar con una persona
          </a>
        </div>
      </div>
    </>
  );
}

function TarjetaVista({ t, onNavegar, leadEnviado }: { t: Tarjeta; onNavegar: () => void; leadEnviado: boolean }) {
  switch (t.tipo) {
    case "solucion":
      return <Solucion t={t} onNavegar={onNavegar} />;
    case "caso":
      return <Caso t={t} onNavegar={onNavegar} />;
    case "contacto":
      return (
        <Contacto t={t} conversacion={conversacionEnTexto} enviado={leadEnviado} onEnviado={marcarLeadEnviado} />
      );
    case "humano":
      return <Humano t={t} />;
  }
}
