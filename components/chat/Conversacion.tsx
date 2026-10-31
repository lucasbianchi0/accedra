"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowUp, Square } from "lucide-react";
import { MascotaCara } from "./Mascota";
import { opcionesDe, preguntaDe, separarPregunta } from "@/lib/chat/pregunta";
import Formato from "./Formato";
import {
  Caso,
  Contacto,
  Evento,
  Humano,
  IconoWhatsApp,
  Nota,
  Opciones,
  Relevamiento,
  Solucion,
  enlaceWhatsApp,
} from "./Tarjetas";
import { LIMITES_CHAT, type Tarjeta } from "@/lib/chat/tipos";
import { conversacionEnTexto, detener, enviar, marcarLeadEnviado, textoDe, useConversacion } from "@/lib/chat/store";
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
  ancho = "",
  campoAlInicio = true,
}: {
  /** Lo que se ve antes del primer mensaje. */
  inicio?: ReactNode;
  onNavegar: () => void;
  /** Para el tracking: desde dónde escribió. */
  origen: string;
  placeholder?: string;
  /** Clases del contenido (p. ej. un ancho máximo centrado en la hoja). */
  ancho?: string;
  /** Si es false, el campo de abajo aparece recién con el primer mensaje:
   *  el `inicio` trae el suyo. */
  campoAlInicio?: boolean;
}) {
  const { mensajes, enCurso, leadEnviado, preparando } = useConversacion();
  // Sólo se animan los mensajes que llegan con la conversación a la vista: al
  // reabrir el chat, lo que ya estaba aparece quieto.
  const [presentes] = useState(() => new Set(mensajes.map((m) => m.id)));
  const nuevo = (id: string) => !presentes.has(id);
  const [texto, setTexto] = useState("");
  const lista = useRef<HTMLDivElement>(null);
  const campo = useRef<HTMLTextAreaElement>(null);

  // Pegada al final: cada vez que el contenido cambia de alto (llega texto, se
  // carga la foto de un caso, aparecen las opciones, la hoja se abre y deja
  // de medir cero) baja al fondo, salvo que la persona haya subido a releer.
  // Con un ResizeObserver y no con un efecto sobre `mensajes`: el efecto corría
  // antes de que la tarjeta midiera, y las opciones quedaban debajo del borde.
  const pegada = useRef(true);
  // Sin mensajes no hay "final": la bienvenida se lee desde arriba.
  const sinMensajes = useRef(true);
  useEffect(() => {
    sinMensajes.current = mensajes.length === 0;
  }, [mensajes.length]);
  useEffect(() => {
    const el = lista.current;
    const contenido = el?.firstElementChild;
    if (!el || !contenido) return;
    const onScroll = () => {
      pegada.current = el.scrollHeight - el.scrollTop - el.clientHeight < 120;
    };
    const ro = new ResizeObserver(() => {
      if (pegada.current && !sinMensajes.current) el.scrollTop = el.scrollHeight;
    });
    ro.observe(contenido);
    ro.observe(el);
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      ro.disconnect();
      el.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Un mensaje propio siempre vuelve al fondo, aunque se haya subido a releer.
  const cantidadPropios = mensajes.filter((m) => m.rol === "user").length;
  useEffect(() => {
    pegada.current = true;
    const el = lista.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [cantidadPropios]);

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
      <div
        ref={lista}
        data-lenis-prevent
        className="chat-scroll chat-scroll-fundido relative flex-1 overflow-y-auto overscroll-contain px-4 py-5"
      >
        <div className={`flex min-h-full flex-col ${ancho}`}>
          {vacio ? (
            inicio
          ) : (
            <div className="space-y-5">
              {mensajes.map((m) =>
                m.rol === "user" ? (
                  <div key={m.id} className={`flex justify-end ${nuevo(m.id) ? "msg-propio-entra" : ""}`}>
                    <div className="max-w-[85%] whitespace-pre-wrap break-words rounded-[20px] rounded-br-md bg-accent-600 px-4 py-2.5 text-[15px] leading-relaxed text-white lg:text-[14px]">
                      {textoDe(m)}
                    </div>
                  </div>
                ) : (
                  <div key={m.id} className={`flex lg:gap-2.5 ${nuevo(m.id) ? "msg-entra" : ""}`}>
                    {/* `self-start` y tamaño fijo: sin eso el span se estiraba al
                        alto del mensaje y el latido dibujaba una pastilla.
                        En celular y tablet sin avatar, como en las apps de
                        chat: la respuesta y las tarjetas usan todo el ancho. */}
                    <span
                      className={`mt-0.5 hidden h-7 w-7 shrink-0 self-start rounded-full lg:block ${m.id === ultimo?.id && enCurso ? "avatar-pensando" : ""}`}
                    >
                      <MascotaCara size={28} className="ring-1 ring-white/10" />
                    </span>
                    <div className="min-w-0 flex-1 space-y-3.5 text-[15px] leading-relaxed text-gray-200 lg:space-y-4 lg:text-[14px]">
                      {separarPregunta(m.partes).partes.map((p, i) =>
                        p.tipo === "texto" ? (
                          <Formato key={i} texto={p.texto} onNavegar={onNavegar} />
                        ) : p.tarjeta.tipo === "opciones" ? null : (
                          // Cada tarjeta entra apenas llega, con su propio movimiento.
                          <div key={i} className={nuevo(m.id) ? "tarjeta-entra" : undefined}>
                            <TarjetaVista t={p.tarjeta} onNavegar={onNavegar} leadEnviado={leadEnviado} />
                          </div>
                        ),
                      )}
                      {/* La pregunta, aparte y al final: entre la explicación y
                          las tarjetas se perdía, y es lo único que la persona
                          tiene que contestar. */}
                      {preguntaDe(m.partes) && (
                        // Sin raya arriba: el rótulo ya la separa, y las rayas
                        // en cada respuesta cortaban la charla en pedazos.
                        <div className={`pt-1.5 ${nuevo(m.id) ? "opciones-entra" : ""}`}>
                          <p className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-[#A99BFF]">
                            Para seguir
                          </p>
                          <div className="mt-1 text-[16px] font-medium leading-snug text-white lg:text-[15px]">
                            <Formato texto={preguntaDe(m.partes)!} onNavegar={onNavegar} />
                          </div>
                        </div>
                      )}
                      {/* Las opciones van al final y sólo en la última respuesta:
                          contestada la pregunta, dejan de tener sentido. */}
                      {m.id === ultimo?.id && !enCurso && opcionesDe(m.partes) && (
                        <div className="opciones-entra">
                          <Opciones t={opcionesDe(m.partes)!} onElegir={(o) => void enviar(o, `${origen}:opcion`)} />
                        </div>
                      )}
                      {m.id === ultimo?.id && enCurso && preparando && ESQUELETO[preparando] && (
                        <Esqueleto herramienta={preparando} />
                      )}
                      {m.id === ultimo?.id && pensando && !preparando && (
                        <span className="pensando-texto inline-block pt-1 text-[13.5px] font-medium" role="status">
                          Analizando tu caso…
                        </span>
                      )}
                      {m.error && (
                        // Nunca un callejón sin salida: si el asistente no puede
                        // responder (límite, red, proveedor caído), la persona
                        // sigue por WhatsApp con su caso ya escrito.
                        <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
                          <p className="text-[13px] text-gray-300">{m.error}</p>
                          <a
                            href={whatsappDeLaCharla(mensajes)}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => track({ type: "click", name: "whatsapp", target: `chat_error:${origen}` })}
                            className="mt-2.5 inline-flex items-center gap-1.5 rounded-full bg-[#1fa855] px-3.5 py-1.5 text-[12.5px] font-semibold text-white transition-transform hover:-translate-y-px"
                          >
                            <IconoWhatsApp size={13} />
                            Seguir por WhatsApp
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                ),
              )}
            </div>
          )}
        </div>
      </div>

      {(campoAlInicio || !vacio) && (
        // Sin raya arriba ni pie en el celular: el campo solo, como en la
        // bienvenida, con WhatsApp adentro.
        <div className="relative px-3 pb-[max(10px,env(safe-area-inset-bottom))] pt-2 lg:border-t lg:border-white/[0.06] lg:pb-[max(12px,env(safe-area-inset-bottom))] lg:pt-3">
          <div className={ancho}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                mandar();
              }}
              // Celular: escribir arriba y los botones abajo, como en la
              // bienvenida. Escritorio: un solo renglón (la fila de botones se
              // disuelve con `contents`).
              className="campo-ai rounded-[26px] lg:flex lg:items-end lg:gap-2 lg:rounded-[22px] lg:py-1.5 lg:pl-4 lg:pr-1.5"
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
                // Al abrirse el teclado, el último mensaje queda a la vista: es
                // lo que se está contestando.
                onFocus={() =>
                  setTimeout(() => {
                    const el = lista.current;
                    if (el && !sinMensajes.current) el.scrollTop = el.scrollHeight;
                  }, 350)
                }
                placeholder={placeholder}
                aria-label="Tu mensaje"
                // 16px hasta escritorio: con menos, iOS hace zoom al enfocar y
                // desarma la hoja (en tablet también).
                className="chat-campo block max-h-[132px] w-full resize-none bg-transparent px-4 pb-1 pt-3.5 text-[16px] lg:flex-1 lg:px-0 lg:py-2 leading-snug text-white placeholder:text-gray-500 outline-none lg:text-[14px]"
              />
              <div className="flex items-center gap-1 px-2 pb-2 lg:contents">
                <a
                  href={whatsappDeLaCharla(mensajes)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => track({ type: "click", name: "whatsapp", target: `chat_campo:${origen}` })}
                  aria-label="Hablar con una persona por WhatsApp"
                  title="Hablar con una persona"
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-gray-400 transition-colors hover:bg-white/5 hover:text-[#25D366] lg:hidden"
                >
                  <IconoWhatsApp size={16} />
                </a>
                {enCurso ? (
                  <button
                    type="button"
                    onClick={detener}
                    aria-label="Detener"
                    className="ml-auto grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/15 lg:ml-0"
                  >
                    <Square size={12} fill="currentColor" />
                  </button>
                ) : (
                  <button
                    // Sin robarle el foco al campo: si no, el teclado empieza a cerrarse
                    // con el toque, la hoja se reacomoda y el toque cae en otro lado.
                    onPointerDown={(e) => e.preventDefault()}
                    type="submit"
                    disabled={!texto.trim()}
                    aria-label="Enviar"
                    className="ml-auto grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent-600 text-white transition-all hover:bg-accent disabled:bg-white/10 disabled:text-gray-500 lg:ml-0"
                  >
                    <ArrowUp size={17} />
                  </button>
                )}
              </div>
            </form>
            <div className="mt-2 hidden items-center justify-between px-1 text-[11px] text-gray-600 lg:flex">
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
        </div>
      )}
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
      return <Contacto t={t} conversacion={conversacionEnTexto} enviado={leadEnviado} onEnviado={marcarLeadEnviado} />;
    case "humano":
      return <Humano t={t} />;
    case "relevamiento":
      return <Relevamiento t={t} />;
    case "nota":
      return <Nota t={t} onNavegar={onNavegar} />;
    case "evento":
      return <Evento t={t} onNavegar={onNavegar} />;
    case "opciones":
      return null;
  }
}

/** Lo que dice el esqueleto mientras llega cada tarjeta. Las rápidas no tienen. */
const ESQUELETO: Record<string, string> = {
  armar_relevamiento: "Armando tu relevamiento en PDF…",
  mostrar_solucion: "Buscando la solución para tu caso…",
  mostrar_caso: "Buscando un caso parecido…",
  pedir_contacto: "Preparando el formulario…",
  mostrar_nota: "Buscando una nota del blog…",
  mostrar_evento: "Buscando un evento del tema…",
};

/** La forma de la tarjeta que viene, con un brillo que la recorre. */
function Esqueleto({ herramienta }: { herramienta: string }) {
  const pdf = herramienta === "armar_relevamiento";
  return (
    <div role="status" className="tarjeta-entra rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <div className="flex items-center gap-4">
        {pdf && <div className="esqueleto h-12 w-10 shrink-0 rounded-lg" />}
        <div className="min-w-0 flex-1 space-y-2">
          <div className="esqueleto h-2.5 w-24 rounded-full" />
          <div className="esqueleto h-3.5 w-3/5 rounded-full" />
          <div className="esqueleto h-2.5 w-4/5 rounded-full" />
        </div>
        {pdf && <div className="esqueleto hidden h-9 w-20 shrink-0 rounded-full sm:block" />}
      </div>
      <p className="pensando-texto mt-3 text-[12.5px] font-medium">{ESQUELETO[herramienta]}</p>
    </div>
  );
}
