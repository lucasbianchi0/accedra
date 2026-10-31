"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp, RotateCcw, X } from "lucide-react";
import Conversacion, { whatsappDeLaCharla } from "./Conversacion";
import { NombreAccedraAI } from "./AccedraAI";
import { MascotaCara, MascotaRetrato } from "./Mascota";
import { ProgresoBarra, ProgresoVertical, PromesaPdf } from "./Progreso";
import { IconoWhatsApp } from "./Tarjetas";
import { enviar, reiniciar, useConversacion } from "@/lib/chat/store";
import { sugerenciasPara } from "@/lib/chat/sugerencias";
import { EJEMPLOS_MEZCLADOS, INDUSTRIAS, type Industria } from "@/lib/chat/industrias";
import { track } from "@/lib/track";

/**
 * La hoja de Accedra AI: sube desde abajo y ocupa el 60 % de la pantalla; el
 * resto de la página se oscurece y se desenfoca.
 *
 * La despiertan "Accedra AI" en el menú, "Preguntale a nuestro asistente" en
 * las portadas y el robotito flotante. La conversación vive en
 * `lib/chat/store` y sigue al navegar.
 *
 * Antes del primer mensaje es una bienvenida mínima: la marca, la pregunta de
 * la página, el campo y tres atajos. Con la conversación andando la
 * hoja sube al 88 % para que se lean las respuestas y las tarjetas. En el
 * teléfono ocupa casi todo el alto y se acomoda al teclado con
 * `visualViewport` (en iOS `100dvh` no se achica cuando aparece el teclado).
 */

/** Lo que tarda en irse (el `transform` de cierre en globals.css). */
const SALIDA_MS = 380;

/** La solución de la página actual, para la pregunta y las acciones. */
function solucionDeLaRuta(): string | undefined {
  return /^\/soluciones\/([^/]+)/.exec(window.location.pathname)?.[1];
}

export default function HojaAsistente({ abierto, onCerrar }: { abierto: boolean; onCerrar: () => void }) {
  const { mensajes, leadEnviado } = useConversacion();
  const hoja = useRef<HTMLDivElement>(null);
  const [solucion, setSolucion] = useState<string | undefined>();
  const vacio = mensajes.length === 0;

  // La primera vez la hoja se monta ya abierta y no hay desde dónde animar:
  // `data-open` pasa a "true" un cuadro después del montaje, así sube igual
  // que las demás veces. Al cerrar, en el acto.
  const [enPantalla, setEnPantalla] = useState(false);
  if (!abierto && enPantalla) setEnPantalla(false);
  useEffect(() => {
    if (!abierto) return;
    let segundo = 0;
    const primero = requestAnimationFrame(() => {
      segundo = requestAnimationFrame(() => setEnPantalla(true));
    });
    return () => {
      cancelAnimationFrame(primero);
      cancelAnimationFrame(segundo);
    };
  }, [abierto]);

  // La pregunta y las acciones se eligen al abrir: la hoja queda montada
  // mientras se navega y la página puede haber cambiado.
  useEffect(() => {
    if (!abierto) return;
    const t = setTimeout(() => setSolucion(solucionDeLaRuta()), 0);
    return () => clearTimeout(t);
  }, [abierto]);

  // Escape cierra; el fondo no scrollea mientras la hoja está abierta (y el
  // robotito y WhatsApp se esconden: escuchan el overflow del body).
  //
  // Al cerrar, la página se suelta recién cuando la hoja terminó de bajar: si
  // no, el robotito y WhatsApp volvían a aparecer encima de la hoja que se
  // estaba yendo. Si se reabre antes, el bloqueo sigue el que estaba.
  const bloqueo = useRef<{ soltar: () => void; salida?: number } | null>(null);
  useEffect(() => {
    if (!abierto) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onCerrar();
    window.addEventListener("keydown", onKey);
    if (bloqueo.current?.salida) {
      clearTimeout(bloqueo.current.salida);
      bloqueo.current.salida = undefined;
    } else {
      const html = document.documentElement;
      const body = document.body.style;
      const previo = { overflow: body.overflow, html: html.style.overflow, position: body.position, top: body.top, width: body.width };
      body.overflow = "hidden";
      html.style.overflow = "hidden";
      // En celular y tablet, además, el body fijo: iOS ignora el `overflow` y
      // seguía moviendo la página de atrás al abrir el teclado o al arrastrar
      // sobre una parte de la hoja sin scroll, y la hoja quedaba corrida. (En
      // escritorio no: ahí el scroll lo lleva Lenis y alcanza con el overflow.)
      const celular = window.matchMedia("(max-width: 1023px)").matches;
      const y = window.scrollY;
      if (celular) {
        body.position = "fixed";
        body.top = `-${y}px`;
        body.width = "100%";
      }
      bloqueo.current = {
        soltar: () => {
          body.overflow = previo.overflow;
          html.style.overflow = previo.html;
          if (celular) {
            body.position = previo.position;
            body.top = previo.top;
            body.width = previo.width;
            window.scrollTo({ top: y, behavior: "instant" });
          }
        },
      };
    }
    const b = bloqueo.current;
    return () => {
      window.removeEventListener("keydown", onKey);
      if (!b) return;
      b.salida = window.setTimeout(() => {
        b.soltar();
        bloqueo.current = null;
      }, SALIDA_MS);
    };
  }, [abierto, onCerrar]);

  // En celular y tablet la hoja es pantalla completa, del alto de lo que queda
  // visible sobre el teclado: en iOS `100dvh` no se achica cuando aparece, y el
  // campo de texto quedaría tapado.
  useEffect(() => {
    if (!abierto || !window.matchMedia("(max-width: 1023px)").matches) return;
    const vv = window.visualViewport;
    const el = hoja.current;
    if (!vv || !el) return;
    // El alto sin teclado es el mayor que se vio con la hoja abierta: en
    // Android `innerHeight` también se achica con el teclado y no sirve de
    // referencia.
    let base = vv.height;
    let alto = 0;
    let cuadro = 0;
    const ajustar = () => {
      cancelAnimationFrame(cuadro);
      cuadro = requestAnimationFrame(() => {
        base = Math.max(base, vv.height);
        el.style.height = `${vv.height}px`;
        el.style.top = `${vv.offsetTop}px`;
        // Con el teclado abierto, el campo donde se escribe (con sus botones)
        // queda a la vista, justo arriba. En cada cambio de alto y no una sola
        // vez: el teclado sube en varios pasos. Sin esconder ni mover nada
        // más: la bienvenida se desliza dentro de la hoja.
        const teclado = base - vv.height > 150;
        el.dataset.teclado = teclado ? "true" : "false";
        if (teclado && vv.height !== alto) {
          const foco = document.activeElement;
          if (foco instanceof HTMLElement && el.contains(foco)) {
            (foco.closest("form") ?? foco).scrollIntoView({ block: "nearest" });
          }
        }
        alto = vv.height;
      });
    };
    ajustar();
    vv.addEventListener("resize", ajustar);
    vv.addEventListener("scroll", ajustar);
    return () => {
      cancelAnimationFrame(cuadro);
      vv.removeEventListener("resize", ajustar);
      vv.removeEventListener("scroll", ajustar);
      el.style.height = "";
      el.style.top = "";
      delete el.dataset.teclado;
    };
  }, [abierto]);

  // En el teléfono la hoja tapa la página: al seguir un link se cierra para
  // que se vea adónde llevó. En escritorio también: la hoja es modal.
  const onNavegar = () => onCerrar();

  // Arrastrar la barra de arriba hacia abajo cierra la hoja (sólo con el
  // dedo: con mouse un arrastre accidental la cerraría sin querer).
  const arrastre = useRef<{ y: number; dy: number } | null>(null);
  const empezarArrastre = (e: React.PointerEvent) => {
    if (e.pointerType !== "touch" || (e.target as HTMLElement).closest("button")) return;
    arrastre.current = { y: e.clientY, dy: 0 };
    hoja.current?.setAttribute("data-arrastrando", "true");
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const moverArrastre = (e: React.PointerEvent) => {
    const a = arrastre.current;
    const el = hoja.current;
    if (!a || !el) return;
    a.dy = Math.max(0, e.clientY - a.y);
    el.style.transform = `translateY(${a.dy}px)`;
  };
  const soltarArrastre = () => {
    const a = arrastre.current;
    const el = hoja.current;
    arrastre.current = null;
    if (!a || !el) return;
    el.removeAttribute("data-arrastrando");
    el.style.transform = "";
    if (a.dy > 110) onCerrar();
  };

  return (
    <div className="chat-hoja-raiz" data-open={enPantalla ? "true" : "false"}>
      {/* Fondo: oscurece y desenfoca la página; un clic cierra. */}
      <div
        aria-hidden
        onClick={onCerrar}
        className="chat-hoja-fondo fixed inset-0 z-[80] bg-[rgba(3,6,14,0.58)] backdrop-blur-xl backdrop-saturate-[1.2]"
      />

      <div
        ref={hoja}
        role="dialog"
        aria-modal="true"
        aria-label="Accedra AI"
        // Vidrio: translúcida sobre la página ya desenfocada, con un blur propio
        // que termina de lavar lo que hay detrás.
        // Celular y tablet: pantalla completa (sube desde abajo igual).
        // Escritorio: hoja que sube hasta el 60 %, con márgenes amplios —no
        // pasa de ~1100 px de ancho— y al 86 % cuando hay conversación.
        className={`chat-hoja fixed inset-x-0 top-0 z-[81] flex h-[100dvh] flex-col overflow-hidden bg-[linear-gradient(180deg,rgba(24,36,66,0.86)_0%,rgba(9,16,32,0.94)_100%)] backdrop-blur-3xl backdrop-saturate-[1.6] lg:top-auto lg:bottom-0 lg:inset-x-[max(2rem,calc((100vw-1120px)/2))] lg:rounded-t-[32px] lg:border lg:border-b-0 lg:border-white/[0.13] lg:bg-[linear-gradient(180deg,rgba(24,36,66,0.62)_0%,rgba(9,16,32,0.74)_100%)] lg:shadow-[0_-40px_140px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.16)] ${
          vacio ? "lg:h-[62dvh] lg:min-h-[560px] lg:max-h-[92dvh]" : "lg:h-[86dvh]"
        }`}
      >
        {/* Filo de luz en el borde de arriba, en el degradé de la marca */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-[12%] top-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(185,165,251,0.75), rgba(127,179,248,0.75), transparent)",
          }}
        />
        {/* Aurora: dos luces que se mueven lento detrás del logo */}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 -top-32 h-[30rem] overflow-hidden [mask-image:linear-gradient(to_bottom,#000_45%,transparent)]">
          <div className="hoja-aurora hoja-aurora-1 absolute left-[28%] top-0 h-72 w-72 rounded-full bg-[#8B5CF6] opacity-40 blur-[90px]" />
          <div className="hoja-aurora hoja-aurora-2 absolute right-[26%] top-6 h-64 w-64 rounded-full bg-[#2B6FD4] opacity-40 blur-[90px]" />
        </div>
        {/* Grano muy fino: le saca lo plástico al vidrio */}
        <div
          aria-hidden
          className="hoja-grano pointer-events-none absolute inset-0 opacity-[0.035] mix-blend-overlay"
        />

        {/* Barra superior: manija, marca (con conversación), acciones */}
        <div
          onPointerDown={empezarArrastre}
          onPointerMove={moverArrastre}
          onPointerUp={soltarArrastre}
          onPointerCancel={soltarArrastre}
          className="relative flex touch-none items-center justify-between px-4 pb-1 pt-[max(12px,env(safe-area-inset-top))] sm:px-6 lg:pt-3"
        >
          <div className="flex min-w-0 items-center gap-2.5">
            {!vacio && (
              <>
                <MascotaCara size={30} className="ring-1 ring-white/15" />
                <div className="leading-tight">
                  <NombreAccedraAI className="font-display text-[15px] font-semibold text-white" />
                  <p className="flex items-center gap-1.5 text-[11px] text-gray-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    En línea · responde al instante
                  </p>
                </div>
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

        {/* Cuánto falta: a la izquierda en escritorio ancho, como barra arriba
            en el resto. Aparece cuando la charla arranca. */}
        {!vacio && (
          <>
            <div className="progreso-entra absolute left-8 top-[86px] z-10 hidden xl:block">
              <ProgresoVertical mensajes={mensajes} leadEnviado={leadEnviado} />
            </div>
            <div className="relative mx-auto w-full max-w-[760px] px-4 pb-1 pt-2 xl:hidden">
              <ProgresoBarra mensajes={mensajes} leadEnviado={leadEnviado} />
            </div>
          </>
        )}

        <Conversacion
          origen="hoja"
          onNavegar={onNavegar}
          ancho="mx-auto w-full max-w-[760px]"
          campoAlInicio={false}
          inicio={<Bienvenida solucion={solucion} />}
        />
      </div>
    </div>
  );
}

/** El ejemplo del campo se escribe solo, uno tras otro. */
function useMaquina(frases: string[], activa: boolean): string {
  const [e, setE] = useState({ i: 0, n: 0, borrando: false, pausa: 0 });

  // Con otra lista (se eligió una industria) arranca de cero.
  const [lista, setLista] = useState(frases);
  if (lista !== frases) {
    setLista(frases);
    setE({ i: 0, n: 0, borrando: false, pausa: 4 });
  }

  useEffect(() => {
    if (!activa || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => {
      setE((s) => {
        const frase = frases[s.i % frases.length];
        if (s.pausa > 0) return { ...s, pausa: s.pausa - 1 };
        if (!s.borrando) return s.n < frase.length ? { ...s, n: s.n + 1 } : { ...s, borrando: true, pausa: 48 };
        return s.n > 0 ? { ...s, n: Math.max(0, s.n - 3) } : { i: s.i + 1, n: 0, borrando: false, pausa: 8 };
      });
    }, 38);
    return () => clearInterval(t);
  }, [activa, frases]);

  const frase = frases[e.i % frases.length];
  return activa ? frase.slice(0, e.n) : frase;
}

/**
 * Lo que se ve antes del primer mensaje: el logo, la pregunta, las industrias
 * y el campo que escribe ejemplos solo.
 *
 * El campo NO toma el foco al abrir: si lo tomara, el ejemplo dejaría de
 * escribirse (y en el teléfono saltaría el teclado tapando la hoja).
 */
function Bienvenida({ solucion }: { solucion?: string }) {
  const { mensajes } = useConversacion();
  const { titulo } = sugerenciasPara(solucion);
  const [texto, setTexto] = useState("");
  const [enfocado, setEnfocado] = useState(false);
  const [industria, setIndustria] = useState<Industria | null>(null);
  const origen = solucion ? `hoja:${solucion}` : "hoja";
  const frases = industria ? industria.ejemplos : EJEMPLOS_MEZCLADOS;
  const escribiendo = useMaquina(frases, !texto && !enfocado);

  // El campo crece con el texto hasta cinco líneas (en el teléfono arranca en una).
  const campo = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    const el = campo.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 140)}px`;
  }, [texto]);

  const mandar = (t: string) => {
    if (!t.trim()) return;
    // Con una industria elegida, el asistente arranca sabiendo el rubro.
    // Sin repetirla si ya la escribió ("minera" no contiene "Minería").
    const minus = t.toLowerCase();
    const yaDicho =
      !industria ||
      minus.includes(industria.frase.toLowerCase()) ||
      minus.includes(industria.label.toLowerCase());
    const conRubro = yaDicho ? t : `${industria.frase} ${t}`;
    void enviar(conRubro, industria ? `${origen}:${industria.id}` : origen);
    setTexto("");
  };

  return (
    // Celular y tablet, como una app de chat: el campo es una sola línea
    // pegada abajo —el teclado la empuja y queda justo arriba de él— y el
    // saludo se centra en lo que sobra. Con el teclado abierto el robot, el
    // "Hola" y la promesa del PDF se esconden (`data-teclado` de la hoja):
    // quedan la pregunta, los rubros y el campo.
    //
    // Escritorio: todo junto y centrado, con el campo grande que escribe
    // ejemplos solo.
    //
    // `my-auto` y no `justify-center`: si el contenido no entra, justify-center
    // lo recorta arriba (donde no se puede scrollear); my-auto sólo centra
    // cuando sobra lugar.
    <div className="flex flex-1 flex-col items-center text-center lg:my-auto lg:flex-none lg:pb-4">
      {/* `hoja-entra`: cada hijo entra escalonado cuando la hoja termina de subir. */}
      <div className="hoja-entra my-auto flex w-full flex-col items-center py-4 lg:my-0 lg:py-0">
        <MascotaRetrato size={96} className="in-data-[teclado=true]:hidden" />
        <p className="mt-1 text-[14px] text-gray-400 in-data-[teclado=true]:hidden">
          Hola, soy el asistente de <NombreAccedraAI className="font-semibold text-white" />
        </p>
        <h2 className="font-display mt-1.5 text-[26px] font-semibold leading-tight tracking-[-0.015em] text-white sm:text-[34px] in-data-[teclado=true]:mt-0 in-data-[teclado=true]:text-[22px]">
          {titulo}
        </h2>
        <PromesaPdf className="mt-4 in-data-[teclado=true]:hidden" />

        {/* Industrias: elegir una cambia los ejemplos y le dice el rubro al asistente. */}
        <div
          role="radiogroup"
          aria-label="Tu industria"
          // En el teléfono se deslizan de costado; el fundido a la derecha avisa que hay más.
          className="no-scrollbar -mx-4 mt-5 flex max-w-[calc(100%+2rem)] gap-2 sm:gap-1.5 overflow-x-auto px-4 [mask-image:linear-gradient(to_right,#000_82%,transparent)] sm:mx-0 sm:max-w-none sm:flex-wrap sm:justify-center sm:px-0 sm:[mask-image:none] lg:mt-6 in-data-[teclado=true]:mt-3"
        >
          {INDUSTRIAS.map((ind) => {
            const activa = industria?.id === ind.id;
            const Icono = ind.icono;
            return (
              <button
                key={ind.id}
                type="button"
                role="radio"
                // Con el teclado abierto, elegir un rubro no lo cierra.
                onPointerDown={(e) => e.preventDefault()}
                aria-checked={activa}
                onClick={() => {
                  setIndustria(activa ? null : ind);
                  track({ type: "click", name: "asistente_industria", target: ind.id });
                }}
                className="chip-ai inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-medium sm:px-2.5"
                data-activa={activa ? "true" : "false"}
              >
                <Icono size={13} className="chip-ai-icono" />
                {ind.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="hoja-entra w-full lg:mt-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            mandar(texto);
          }}
          className="campo-ai relative flex w-full items-end gap-1 rounded-[26px] py-1.5 pl-4 pr-1.5 text-left lg:block lg:rounded-[22px] lg:p-0"
        >
          <textarea
            ref={campo}
            rows={1}
            value={texto}
            maxLength={1200}
            onChange={(e) => setTexto(e.target.value)}
            onFocus={() => setEnfocado(true)}
            onBlur={() => setEnfocado(false)}
            onKeyDown={(e) => {
              // Tab con el campo vacío usa el ejemplo que se está mostrando.
              if (e.key === "Tab" && !texto && !e.shiftKey) {
                e.preventDefault();
                setTexto(frases.find((f) => f.startsWith(escribiendo)) ?? escribiendo);
                return;
              }
              if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                e.preventDefault();
                mandar(texto);
              }
            }}
            // En el teléfono el placeholder fijo, como en las apps; en
            // escritorio sólo con foco (sin foco se ve el ejemplo que se escribe).
            placeholder="Contanos tu caso…"
            aria-label="Contanos tu caso"
            className="chat-campo relative block min-w-0 flex-1 resize-none bg-transparent py-2 text-[16px] leading-snug text-white placeholder:text-gray-500 outline-none lg:min-h-[76px] lg:w-full lg:px-5 lg:pb-0 lg:pt-4 lg:leading-relaxed lg:placeholder:text-transparent lg:focus:placeholder:text-gray-500"
          />
          {/* El ejemplo va encima y no como placeholder: uno que cambia cada
              40 ms lo releen los lectores de pantalla en cada cambio. */}
          {!texto && !enfocado && (
            <p
              aria-hidden
              className="pointer-events-none absolute inset-x-5 top-4 hidden text-[16px] leading-relaxed text-gray-400 lg:block"
            >
              {escribiendo}
              <span className="hero-cursor ml-0.5 inline-block h-[1.05em] w-[2px] translate-y-[3px] rounded-full bg-[#B9A5FB]" />
            </p>
          )}
          <div className="flex shrink-0 items-center gap-1 lg:gap-2 lg:px-3 lg:pb-3">
            <a
              href={whatsappDeLaCharla(mensajes)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track({ type: "click", name: "whatsapp", target: origen })}
              aria-label="Hablar con una persona por WhatsApp"
              title="Hablar con una persona"
              className="grid h-9 w-9 place-items-center rounded-full text-gray-400 transition-colors hover:bg-white/5 hover:text-[#25D366] lg:ml-auto"
            >
              <IconoWhatsApp size={16} />
            </a>
            <button
              // Sin robarle el foco al campo: si no, el teclado empieza a cerrarse
              // con el toque, la hoja se reacomoda y el toque cae en otro lado.
              onPointerDown={(e) => e.preventDefault()}
              type="submit"
              disabled={!texto.trim()}
              aria-label="Enviar"
              className="enviar-ai grid h-9 w-9 place-items-center rounded-full text-white"
            >
              <ArrowUp size={17} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
