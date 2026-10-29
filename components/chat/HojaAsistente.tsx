"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp, RotateCcw, Sparkles, X } from "lucide-react";
import Conversacion, { whatsappDeLaCharla } from "./Conversacion";
import { LogoAccedraAI, NombreAccedraAI } from "./AccedraAI";
import { IconoWhatsApp } from "./Tarjetas";
import { enviar, reiniciar, useConversacion } from "@/lib/chat/store";
import { sugerenciasPara } from "@/lib/chat/sugerencias";
import { track } from "@/lib/track";

/**
 * La hoja de Accedra AI: sube desde abajo y ocupa el 60 % de la pantalla; el
 * resto de la página se oscurece y se desenfoca.
 *
 * La despiertan "Accedra AI" en el menú y "Preguntale a nuestro asistente"
 * en las portadas. El robotito flotante abre otra cosa —el chat clásico a la
 * derecha (ChatPanel)—, pero los dos muestran la misma conversación: vive en
 * `lib/chat/store` y sigue al navegar.
 *
 * Antes del primer mensaje es una bienvenida: la marca, la pregunta de la
 * página, un campo grande y tres acciones. Con la conversación andando la
 * hoja sube al 88 % para que se lean las respuestas y las tarjetas. En el
 * teléfono ocupa casi todo el alto y se acomoda al teclado con
 * `visualViewport` (en iOS `100dvh` no se achica cuando aparece el teclado).
 */

/** La solución de la página actual, para la pregunta y las acciones. */
function solucionDeLaRuta(): string | undefined {
  return /^\/soluciones\/([^/]+)/.exec(window.location.pathname)?.[1];
}

export default function HojaAsistente({ abierto, onCerrar }: { abierto: boolean; onCerrar: () => void }) {
  const { mensajes } = useConversacion();
  const hoja = useRef<HTMLDivElement>(null);
  const [solucion, setSolucion] = useState<string | undefined>();
  const vacio = mensajes.length === 0;

  // La pregunta y las acciones se eligen al abrir: la hoja queda montada
  // mientras se navega y la página puede haber cambiado.
  useEffect(() => {
    if (!abierto) return;
    const t = setTimeout(() => setSolucion(solucionDeLaRuta()), 0);
    return () => clearTimeout(t);
  }, [abierto]);

  // Escape cierra; el fondo no scrollea mientras la hoja está abierta (y el
  // robotito y WhatsApp se esconden: escuchan el overflow del body).
  useEffect(() => {
    if (!abierto) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onCerrar();
    window.addEventListener("keydown", onKey);
    const html = document.documentElement;
    const previo = { body: document.body.style.overflow, html: html.style.overflow };
    document.body.style.overflow = "hidden";
    html.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previo.body;
      html.style.overflow = previo.html;
    };
  }, [abierto, onCerrar]);

  // En el teléfono, la hoja del alto de lo que queda visible sobre el teclado.
  useEffect(() => {
    if (!abierto || !window.matchMedia("(max-width: 639px)").matches) return;
    const vv = window.visualViewport;
    const el = hoja.current;
    if (!vv || !el) return;
    const ajustar = () => {
      el.style.maxHeight = `${vv.height - 12}px`;
      el.style.bottom = `${Math.max(0, window.innerHeight - vv.height - vv.offsetTop)}px`;
    };
    ajustar();
    vv.addEventListener("resize", ajustar);
    vv.addEventListener("scroll", ajustar);
    return () => {
      vv.removeEventListener("resize", ajustar);
      vv.removeEventListener("scroll", ajustar);
      el.style.maxHeight = "";
      el.style.bottom = "";
    };
  }, [abierto]);

  // En el teléfono la hoja tapa la página: al seguir un link se cierra para
  // que se vea adónde llevó. En escritorio también: la hoja es modal.
  const onNavegar = () => onCerrar();

  return (
    <div className="chat-hoja-raiz" data-open={abierto ? "true" : "false"}>
      {/* Fondo: oscurece y desenfoca la página; un clic cierra. */}
      <div
        aria-hidden
        onClick={onCerrar}
        className="chat-hoja-fondo fixed inset-0 z-[80] bg-[rgba(5,10,20,0.62)] backdrop-blur-md"
      />

      <div
        ref={hoja}
        role="dialog"
        aria-modal="true"
        aria-label="Accedra AI"
        className={`chat-hoja fixed inset-x-0 bottom-0 z-[81] flex flex-col sm:inset-x-4 lg:inset-x-6 overflow-hidden rounded-t-[32px] border border-b-0 border-white/10 bg-navy-800 shadow-[0_-30px_100px_rgba(0,0,0,0.6)] ${
          vacio ? "h-[92dvh] sm:h-[60dvh] sm:min-h-[600px] sm:max-h-[92dvh]" : "h-[92dvh] sm:h-[88dvh]"
        }`}
      >
        {/* Luz de la marca desde arriba */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[min(900px,140%)] -translate-x-1/2 rounded-full opacity-50 blur-3xl"
          style={{
            background: "radial-gradient(closest-side, rgba(124,108,246,0.55), rgba(43,111,212,0.25), transparent)",
          }}
        />

        {/* Barra superior: manija, marca (con conversación), acciones */}
        <div className="relative flex items-center justify-between px-4 pt-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-2">
            {!vacio && (
              <>
                <LogoAccedraAI size={24} />
                <NombreAccedraAI className="font-display text-[15px] font-semibold text-white" />
              </>
            )}
          </div>
          <span aria-hidden className="absolute left-1/2 top-2.5 h-1 w-10 -translate-x-1/2 rounded-full bg-white/15" />
          <div className="flex items-center gap-1">
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
              aria-label="Cerrar Accedra AI"
              className="rounded-full p-2 text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <Conversacion
          origen="hoja"
          onNavegar={onNavegar}
          ancho="mx-auto w-full max-w-[760px]"
          campoAlInicio={false}
          inicio={<Bienvenida solucion={solucion} abierto={abierto} />}
        />
      </div>
    </div>
  );
}

/** Lo que se ve antes del primer mensaje, como en la referencia. */
function Bienvenida({ solucion, abierto }: { solucion?: string; abierto: boolean }) {
  const { mensajes } = useConversacion();
  const { titulo, atajos } = sugerenciasPara(solucion);
  const [texto, setTexto] = useState("");
  const campo = useRef<HTMLTextAreaElement>(null);
  const origen = solucion ? `hoja:${solucion}` : "hoja";

  // En escritorio el foco va al campo al abrir.
  useEffect(() => {
    if (!abierto || !window.matchMedia("(min-width: 640px)").matches) return;
    const t = setTimeout(() => campo.current?.focus({ preventScroll: true }), 350);
    return () => clearTimeout(t);
  }, [abierto]);

  const mandar = (t: string, de = origen) => {
    if (!t.trim()) return;
    void enviar(t, de);
    setTexto("");
  };

  return (
    // `my-auto` y no `justify-center`: si el contenido no entra, justify-center
    // lo recorta arriba (donde no se puede scrollear); my-auto sólo centra
    // cuando sobra lugar.
    <div className="flex min-h-full flex-col">
      <div className="my-auto flex flex-col items-center pb-2 text-center">
        <LogoAccedraAI size={52} brillo />
        <p className="mt-4 text-[15px] text-gray-400">
          Hola, soy <NombreAccedraAI className="font-semibold" />
        </p>
        <h2 className="font-display mt-1 text-[28px] font-semibold leading-tight tracking-[-0.01em] text-white sm:text-[36px]">
          {titulo}
        </h2>
        <p className="mt-2.5 max-w-[46ch] text-[14px] leading-relaxed text-gray-400">
          Te ayudo a entender qué necesita tu operación, te muestro casos reales y, si querés, un especialista lo
          analiza sin costo.
        </p>

        {/* El campo grande, con su franja de arriba y su barra de abajo */}
        <div className="mt-6 w-full rounded-[22px] border border-white/10 bg-white/[0.04] p-1.5 text-left">
          <p className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] text-gray-400">
            <Sparkles size={13} className="text-[#B9A5FB]" />
            Un especialista sigue tu caso, sin costo
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              mandar(texto);
            }}
            className="rounded-[18px] border border-white/10 bg-navy-900 transition-colors focus-within:border-[#9F8CFB]/50"
          >
            <textarea
              ref={campo}
              rows={2}
              value={texto}
              maxLength={1200}
              onChange={(e) => setTexto(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                  e.preventDefault();
                  mandar(texto);
                }
              }}
              placeholder="Contanos tu caso: qué hace tu empresa y qué te está frenando…"
              aria-label="Contanos tu caso"
              className="chat-campo block w-full resize-none bg-transparent px-4 pt-3.5 text-[16px] leading-relaxed text-white placeholder:text-gray-500 outline-none sm:text-[15px]"
            />
            <div className="flex items-center gap-2 px-2.5 pb-2.5 pt-1">
              <a
                href={whatsappDeLaCharla(mensajes)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track({ type: "click", name: "whatsapp", target: origen })}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-[12.5px] text-gray-300 transition-colors hover:border-[#25D366]/50 hover:text-[#25D366]"
              >
                <IconoWhatsApp size={13} />
                Hablar con una persona
              </a>
              <button
                type="submit"
                disabled={!texto.trim()}
                aria-label="Enviar"
                className="ml-auto grid h-9 w-9 place-items-center rounded-full text-white transition-all hover:-translate-y-0.5 disabled:opacity-40 disabled:hover:translate-y-0"
                style={{ background: "linear-gradient(135deg, #9F6CF6 0%, #2B6FD4 100%)" }}
              >
                <ArrowUp size={17} />
              </button>
            </div>
          </form>
        </div>

        {/* Tres acciones, como las tarjetas de la referencia */}
        <div className="mt-4 grid w-full gap-2.5 text-left sm:grid-cols-3">
          {atajos.slice(0, 3).map(({ label, texto: t, icono: Icono }) => (
            <button
              key={label}
              type="button"
              onClick={() => mandar(t, `${origen}:atajo`)}
              className="group rounded-2xl border border-white/[0.08] bg-white/[0.03] p-3.5 transition-all hover:border-[#9F8CFB]/40 hover:bg-white/[0.06]"
            >
              <span className="flex items-center gap-2 text-[13.5px] font-semibold text-white">
                <Icono size={15} className="text-[#B9A5FB]" />
                {label}
              </span>
              <span className="mt-1 line-clamp-2 block text-[12.5px] leading-snug text-gray-400">{t}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
