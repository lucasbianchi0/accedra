"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp, RotateCcw, X } from "lucide-react";
import Conversacion, { whatsappDeLaCharla } from "./Conversacion";
import { LogoAccedraAI, NombreAccedraAI } from "./AccedraAI";
import { IconoWhatsApp } from "./Tarjetas";
import { enviar, reiniciar, useConversacion } from "@/lib/chat/store";
import { sugerenciasPara } from "@/lib/chat/sugerencias";
import { EJEMPLOS_MEZCLADOS, INDUSTRIAS, type Industria } from "@/lib/chat/industrias";
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
 * Antes del primer mensaje es una bienvenida mínima: la marca, la pregunta de
 * la página, el campo y tres atajos. Con la conversación andando la
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
    <div className="chat-hoja-raiz" data-open={abierto ? "true" : "false"}>
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
        // que termina de lavar lo que hay detrás. Márgenes laterales amplios:
        // en escritorio la hoja no pasa de ~1000 px de ancho.
        className={`chat-hoja fixed inset-x-0 bottom-0 z-[81] flex flex-col overflow-hidden rounded-t-[32px] border border-b-0 border-white/[0.13] bg-[linear-gradient(180deg,rgba(24,36,66,0.62)_0%,rgba(9,16,32,0.74)_100%)] shadow-[0_-40px_140px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.16)] backdrop-blur-3xl backdrop-saturate-[1.6] sm:inset-x-[max(2rem,calc((100vw-1040px)/2))] ${
          vacio ? "h-[88dvh] sm:h-[60dvh] sm:min-h-[480px] sm:max-h-[92dvh]" : "h-[92dvh] sm:h-[86dvh]"
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
        <div aria-hidden className="pointer-events-none absolute inset-x-0 -top-32 h-96 overflow-hidden">
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
          className="relative flex touch-none items-center justify-between px-4 pb-1 pt-3 sm:px-6"
        >
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

  const mandar = (t: string) => {
    if (!t.trim()) return;
    // Con una industria elegida, el asistente arranca sabiendo el rubro.
    const conRubro =
      industria && !t.toLowerCase().includes(industria.label.toLowerCase()) ? `${industria.frase} ${t}` : t;
    void enviar(conRubro, industria ? `${origen}:${industria.id}` : origen);
    setTexto("");
  };

  return (
    // `my-auto` y no `justify-center`: si el contenido no entra, justify-center
    // lo recorta arriba (donde no se puede scrollear); my-auto sólo centra
    // cuando sobra lugar.
    <div className="flex min-h-full flex-col">
      {/* `hoja-entra`: cada hijo entra escalonado cuando la hoja termina de subir. */}
      <div className="hoja-entra my-auto flex flex-col items-center pb-4 text-center">
        <LogoAccedraAI size={46} brillo />
        <h2 className="font-display mt-5 text-[26px] font-semibold leading-tight tracking-[-0.015em] text-white sm:text-[34px]">
          {titulo}
        </h2>

        {/* Industrias: elegir una cambia los ejemplos y le dice el rubro al asistente. */}
        <div
          role="radiogroup"
          aria-label="Tu industria"
          className="no-scrollbar -mx-4 mt-6 flex max-w-[calc(100%+2rem)] gap-2 overflow-x-auto px-4 sm:mx-0 sm:max-w-none sm:flex-wrap sm:justify-center sm:px-0"
        >
          {INDUSTRIAS.map((ind) => {
            const activa = industria?.id === ind.id;
            const Icono = ind.icono;
            return (
              <button
                key={ind.id}
                type="button"
                role="radio"
                aria-checked={activa}
                onClick={() => {
                  setIndustria(activa ? null : ind);
                  track({ type: "click", name: "asistente_industria", target: ind.id });
                }}
                className="chip-ai inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[12.5px] font-medium"
                data-activa={activa ? "true" : "false"}
              >
                <Icono size={13} className="chip-ai-icono" />
                {ind.label}
              </button>
            );
          })}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            mandar(texto);
          }}
          className="campo-ai relative mt-4 w-full rounded-[22px] text-left"
        >
          <textarea
            rows={2}
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
            placeholder={enfocado ? "Contanos tu caso…" : undefined}
            aria-label="Contanos tu caso"
            className="chat-campo relative block w-full resize-none bg-transparent px-5 pt-4 text-[16px] leading-relaxed text-white placeholder:text-gray-500 outline-none"
          />
          {/* El ejemplo va encima y no como placeholder: uno que cambia cada
              40 ms lo releen los lectores de pantalla en cada cambio. */}
          {!texto && !enfocado && (
            <p
              aria-hidden
              className="pointer-events-none absolute inset-x-5 top-4 text-[16px] leading-relaxed text-gray-400"
            >
              {escribiendo}
              <span className="hero-cursor ml-0.5 inline-block h-[1.05em] w-[2px] translate-y-[3px] rounded-full bg-[#B9A5FB]" />
            </p>
          )}
          <div className="flex items-center gap-2 px-3 pb-3">
            <span className="hidden pl-2 text-[11.5px] text-gray-500 sm:inline">
              <kbd className="rounded border border-white/15 px-1.5 py-px font-sans text-[10.5px] text-gray-400">
                Tab
              </kbd>{" "}
              usa el ejemplo
            </span>
            <a
              href={whatsappDeLaCharla(mensajes)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track({ type: "click", name: "whatsapp", target: origen })}
              aria-label="Hablar con una persona por WhatsApp"
              title="Hablar con una persona"
              className="ml-auto grid h-9 w-9 place-items-center rounded-full text-gray-400 transition-colors hover:bg-white/5 hover:text-[#25D366]"
            >
              <IconoWhatsApp size={16} />
            </a>
            <button
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
