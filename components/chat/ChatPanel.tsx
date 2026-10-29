"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUp, ChevronDown, RotateCcw, Square, X } from "lucide-react";
import Robot from "./Robot";
import Formato from "./Formato";
import { Caso, Contacto, Humano, IconoWhatsApp, Solucion, enlaceWhatsApp } from "./Tarjetas";
import { LIMITES_CHAT, notaDeTarjeta, type Entrada, type Mensaje, type Parte, type Tarjeta } from "@/lib/chat/tipos";
import { track } from "@/lib/track";

/**
 * El panel del asistente.
 *
 * En escritorio es una tarjeta flotante abajo a la derecha, por encima de los
 * botones; en el teléfono ocupa la pantalla entera y se acomoda al teclado
 * (con `visualViewport`: en iOS `100dvh` no se achica cuando aparece el
 * teclado y el campo de texto quedaría tapado).
 *
 * La conversación vive en `sessionStorage`: sobrevive a navegar dentro del
 * sitio —las tarjetas llevan a páginas de solución y de caso— y se borra al
 * cerrar la pestaña. No se guarda en ningún servidor salvo que la persona deje
 * sus datos, y ahí va con el lead para que el especialista la lea.
 */

const CLAVE = "accedra-chat";

const SUGERENCIAS = [
  "Somos una logística con varios depósitos y la red se cae seguido",
  "Queremos dejar de imprimir y firmar contratos en papel",
  "Tenemos datos en planillas y nadie ve los números a tiempo",
  "Nos preocupa un ataque de ransomware",
];

type Guardado = { mensajes: Mensaje[]; leadEnviado: boolean };

function leer(): Guardado {
  try {
    const g = JSON.parse(sessionStorage.getItem(CLAVE) ?? "null") as Guardado | null;
    if (g && Array.isArray(g.mensajes)) return { mensajes: g.mensajes, leadEnviado: Boolean(g.leadEnviado) };
  } catch {}
  return { mensajes: [], leadEnviado: false };
}

const nuevoId = () => Math.random().toString(36).slice(2, 10);

const textoDe = (m: Mensaje) =>
  m.partes
    .map((p) => (p.tipo === "texto" ? p.texto : notaDeTarjeta(p.tarjeta)))
    .join("\n\n")
    .trim();

/** El historial que va al servidor: los últimos mensajes con contenido. */
function historial(mensajes: Mensaje[]): Entrada[] {
  const entradas = mensajes
    .filter((m) => !m.error)
    .map((m) => ({
      role: m.rol,
      content: textoDe(m).slice(0, m.rol === "user" ? LIMITES_CHAT.mensaje : LIMITES_CHAT.respuesta),
    }))
    .filter((e) => e.content);
  let recortado = entradas.slice(-LIMITES_CHAT.historial);
  while (recortado.reduce((n, e) => n + e.content.length, 0) > LIMITES_CHAT.total && recortado.length > 1) {
    recortado = recortado.slice(1);
  }
  while (recortado.length && recortado[0].role !== "user") recortado = recortado.slice(1);
  return recortado;
}

export default function ChatPanel({
  abierto,
  onCerrar,
  pendiente,
  onPendienteUsado,
}: {
  abierto: boolean;
  onCerrar: () => void;
  pendiente: { texto: string; origen: string; n: number } | null;
  onPendienteUsado: () => void;
}) {
  // El panel se monta sólo en el cliente (`ssr: false`), así que se puede
  // leer lo guardado en el primer render.
  const [inicial] = useState(leer);
  const [mensajes, setMensajes] = useState<Mensaje[]>(inicial.mensajes);
  const [leadEnviado, setLeadEnviado] = useState(inicial.leadEnviado);
  const [texto, setTexto] = useState("");
  const [enCurso, setEnCurso] = useState(false);
  const abortar = useRef<AbortController | null>(null);
  const lista = useRef<HTMLDivElement>(null);
  const campo = useRef<HTMLTextAreaElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      if (mensajes.length) sessionStorage.setItem(CLAVE, JSON.stringify({ mensajes, leadEnviado }));
      else sessionStorage.removeItem(CLAVE);
    } catch {}
  }, [mensajes, leadEnviado]);

  // Al fondo con cada novedad, salvo que la persona haya subido a releer.
  useEffect(() => {
    const el = lista.current;
    if (!el) return;
    const cerca = el.scrollHeight - el.scrollTop - el.clientHeight < 160;
    if (cerca || !enCurso) el.scrollTo({ top: el.scrollHeight, behavior: enCurso ? "auto" : "smooth" });
  }, [mensajes, enCurso, abierto]);

  const actualizar = (id: string, f: (m: Mensaje) => Mensaje) =>
    setMensajes((ms) => ms.map((m) => (m.id === id ? f(m) : m)));

  const enviar = useCallback(
    async (crudo: string, origen = "panel") => {
      const limpio = crudo.trim().slice(0, LIMITES_CHAT.mensaje);
      if (!limpio || enCurso) return;

      const usuario: Mensaje = { id: nuevoId(), rol: "user", partes: [{ tipo: "texto", texto: limpio }] };
      const respuesta: Mensaje = { id: nuevoId(), rol: "assistant", partes: [] };
      const base = [...mensajes.filter((m) => !(m.rol === "assistant" && m.error && !m.partes.length)), usuario];
      setMensajes([...base, respuesta]);
      setTexto("");
      setEnCurso(true);
      track({ type: "click", name: "chat_mensaje", target: origen, metadata: { n: base.filter((m) => m.rol === "user").length } });

      const ctrl = new AbortController();
      abortar.current = ctrl;
      const agregarTexto = (t: string) =>
        actualizar(respuesta.id, (m) => {
          const partes = [...m.partes];
          const ultima = partes[partes.length - 1];
          if (ultima?.tipo === "texto") partes[partes.length - 1] = { tipo: "texto", texto: ultima.texto + t };
          else partes.push({ tipo: "texto", texto: t.replace(/^\s+/, "") });
          return { ...m, partes };
        });
      const agregarTarjeta = (tarjeta: Tarjeta) =>
        actualizar(respuesta.id, (m) => ({ ...m, partes: [...m.partes, { tipo: "tarjeta", tarjeta } as Parte] }));
      const fallar = (error: string) => actualizar(respuesta.id, (m) => ({ ...m, error }));

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: historial(base) }),
          signal: ctrl.signal,
        });
        if (!res.ok || !res.body) {
          const cuerpo = (await res.json().catch(() => null)) as { error?: string } | null;
          fallar(cuerpo?.error ?? "No pude responder. Probá de nuevo.");
          return;
        }

        const lector = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        for (;;) {
          const { value, done } = await lector.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const eventos = buffer.split("\n\n");
          buffer = eventos.pop() ?? "";
          for (const crudoEvento of eventos) {
            const evento = /^event: (.+)$/m.exec(crudoEvento)?.[1];
            const dato = /^data: (.*)$/m.exec(crudoEvento)?.[1];
            if (!evento || dato === undefined) continue;
            const valor = JSON.parse(dato);
            if (evento === "texto") agregarTexto(valor as string);
            else if (evento === "tarjeta") agregarTarjeta(valor as Tarjeta);
            else if (evento === "error") fallar((valor as { mensaje: string }).mensaje);
          }
        }
      } catch (e) {
        if ((e as Error).name !== "AbortError") fallar("Se cortó la conexión. Probá de nuevo.");
      } finally {
        setEnCurso(false);
        abortar.current = null;
      }
    },
    [mensajes, enCurso],
  );

  // El mensaje que escribieron en la portada se manda apenas se abre.
  useEffect(() => {
    if (!pendiente) return;
    const t = setTimeout(() => {
      onPendienteUsado();
      void enviar(pendiente.texto, pendiente.origen);
    }, 0);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendiente?.n]);

  // Escape cierra; en escritorio el foco va al campo al abrir.
  useEffect(() => {
    if (!abierto) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onCerrar();
    window.addEventListener("keydown", onKey);
    if (window.matchMedia("(min-width: 640px)").matches) setTimeout(() => campo.current?.focus(), 80);
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

  // El campo crece con el texto hasta cinco líneas.
  useEffect(() => {
    const el = campo.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 132)}px`;
  }, [texto]);

  const reiniciar = () => {
    abortar.current?.abort();
    setMensajes([]);
    setLeadEnviado(false);
    track({ type: "click", name: "chat_reiniciar" });
  };

  const conversacion = () =>
    mensajes
      .map((m) => `${m.rol === "user" ? "Visitante" : "Asistente"}: ${textoDe(m)}`)
      .join("\n\n")
      .slice(-6000);

  const primerMensaje = mensajes.find((m) => m.rol === "user");
  const whatsappRapido = enlaceWhatsApp(
    primerMensaje
      ? `Hola, vengo del asistente del sitio. Mi consulta: ${textoDe(primerMensaje).slice(0, 400)}`
      : "Hola, quisiera hablar con un especialista de Accedra.",
  );

  const vacio = mensajes.length === 0;
  const ultimo = mensajes[mensajes.length - 1];
  const pensando = enCurso && ultimo?.rol === "assistant" && ultimo.partes.length === 0;

  return (
    <div
      ref={panel}
      role="dialog"
      aria-modal="false"
      aria-label="Asistente de Accedra"
      data-open={abierto ? "true" : "false"}
      className="chat-panel fixed inset-x-0 top-0 z-[80] flex h-[100dvh] flex-col overflow-hidden bg-navy-800 sm:inset-auto sm:bottom-6 sm:right-5 sm:top-auto sm:h-[min(680px,calc(100dvh-48px))] sm:w-[400px] sm:rounded-[26px] sm:border sm:border-white/10 sm:shadow-[0_30px_90px_rgba(0,0,0,0.6)]"
    >
      {/* Luz de fondo, muy tenue: el mismo azul del sitio */}
      <div aria-hidden className="pointer-events-none absolute -top-24 left-1/2 h-56 w-[120%] -translate-x-1/2 rounded-full bg-accent/20 blur-3xl" />

      {/* Encabezado */}
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

      {/* Conversación */}
      <div ref={lista} data-lenis-prevent className="chat-scroll relative flex-1 overflow-y-auto overscroll-contain px-4 py-5">
        {vacio ? (
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
                href={whatsappRapido}
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
                        <Formato key={i} texto={p.texto} onNavegar={onNavegarMovil} />
                      ) : (
                        <TarjetaVista
                          key={i}
                          t={p.tarjeta}
                          onNavegar={onNavegarMovil}
                          conversacion={conversacion}
                          leadEnviado={leadEnviado}
                          onLead={() => setLeadEnviado(true)}
                        />
                      ),
                    )}
                    {m.id === ultimo?.id && pensando && (
                      <span className="chat-pensando inline-flex gap-1 py-2" aria-label="Escribiendo">
                        <i /><i /><i />
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

      {/* Campo */}
      <div className="relative border-t border-white/[0.06] px-3 pb-[max(12px,env(safe-area-inset-bottom))] pt-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void enviar(texto);
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
                void enviar(texto);
              }
            }}
            placeholder={vacio ? "Ej.: somos una clínica y…" : "Escribí tu mensaje"}
            aria-label="Tu mensaje"
            className="max-h-[132px] flex-1 resize-none bg-transparent py-2 text-[16px] leading-snug text-white placeholder:text-gray-500 outline-none chat-campo sm:text-[14px]"
          />
          {enCurso ? (
            <button
              type="button"
              onClick={() => abortar.current?.abort()}
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
          {!vacio && (
            <a
              href={whatsappRapido}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track({ type: "click", name: "whatsapp", target: "chat_pie" })}
              className="inline-flex items-center gap-1 font-medium text-gray-400 transition-colors hover:text-[#25D366]"
            >
              <IconoWhatsApp size={12} />
              Hablar con una persona
            </a>
          )}
        </div>
      </div>
    </div>
  );

  // En el teléfono el panel tapa la página: al seguir un link se cierra para
  // que se vea adónde llevó. En escritorio queda abierto al costado.
  function onNavegarMovil() {
    if (window.matchMedia("(max-width: 639px)").matches) onCerrar();
  }
}

function TarjetaVista({
  t,
  onNavegar,
  conversacion,
  leadEnviado,
  onLead,
}: {
  t: Tarjeta;
  onNavegar: () => void;
  conversacion: () => string;
  leadEnviado: boolean;
  onLead: () => void;
}) {
  switch (t.tipo) {
    case "solucion":
      return <Solucion t={t} onNavegar={onNavegar} />;
    case "caso":
      return <Caso t={t} onNavegar={onNavegar} />;
    case "contacto":
      return <Contacto t={t} conversacion={conversacion} enviado={leadEnviado} onEnviado={onLead} />;
    case "humano":
      return <Humano t={t} />;
  }
}
