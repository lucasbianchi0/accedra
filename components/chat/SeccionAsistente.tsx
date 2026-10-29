"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, ArrowUp, Check } from "lucide-react";
import Robot from "./Robot";
import { useChat } from "./ChatProvider";
import { IconoWhatsApp, enlaceWhatsApp } from "./Tarjetas";
import { reiniciar, useConversacion } from "@/lib/chat/store";
import { sugerenciasPara } from "@/lib/chat/sugerencias";
import { Reveal } from "@/components/Reveal";
import { track } from "@/lib/track";

/**
 * "Contanos tu caso": la sección del asistente, debajo de la portada.
 *
 * La portada no se toca —título, video y números siguen como estaban— y el
 * asistente tiene su propio espacio, armado como el resto de las secciones
 * (encabezado con eyebrow, `section-title`, cards con el mismo borde y degradé
 * que las de soluciones). Así se lee como parte del sitio y no como un widget.
 *
 * Lo que se escribe abre el panel con el mensaje ya mandado; la conversación
 * sigue ahí, y el robotito flotante la retoma desde cualquier página.
 */

const PUNTOS = ["Respuesta al instante", "Casos reales que ya resolvimos", "Un especialista sigue tu caso, sin costo"];

/** El ejemplo del campo se escribe solo, con los casos de la página. */
function useMaquina(frases: string[], activa: boolean): string {
  const [e, setE] = useState({ i: 0, n: 0, borrando: false, pausa: 0 });

  useEffect(() => {
    if (!activa || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => {
      setE((s) => {
        const frase = frases[s.i % frases.length];
        if (s.pausa > 0) return { ...s, pausa: s.pausa - 1 };
        if (!s.borrando) return s.n < frase.length ? { ...s, n: s.n + 1 } : { ...s, borrando: true, pausa: 40 };
        return s.n > 0 ? { ...s, n: Math.max(0, s.n - 3) } : { i: s.i + 1, n: 0, borrando: false, pausa: 6 };
      });
    }, 45);
    return () => clearInterval(t);
  }, [activa, frases]);

  const frase = frases[e.i % frases.length];
  return activa ? frase.slice(0, e.n) : frase;
}

export default function SeccionAsistente({ solucion, accent = "#2560BC" }: { solucion?: string; accent?: string }) {
  const { abrir, precargar, setHeroVisible } = useChat();
  const { mensajes } = useConversacion();
  const { titulo, atajos } = sugerenciasPara(solucion);
  const [texto, setTexto] = useState("");
  const [enfocado, setEnfocado] = useState(false);
  const [frases] = useState(() => atajos.map((a) => a.texto));
  const tarjeta = useRef<HTMLDivElement>(null);
  const origen = solucion ? `seccion:${solucion}` : "seccion";
  const escribiendo = useMaquina(frases, !texto && !enfocado);

  // Con la sección a la vista, el robotito flotante sobra: es la misma puerta.
  useEffect(() => {
    const el = tarjeta.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setHeroVisible(e.isIntersecting), { threshold: 0.4 });
    io.observe(el);
    return () => {
      io.disconnect();
      setHeroVisible(false);
    };
  }, [setHeroVisible]);

  const mandar = (t: string, de = origen) => {
    if (!t.trim()) return;
    abrir(t, de);
    setTexto("");
  };

  return (
    <section id="asistente" className="section relative">
      <div className="container-x relative z-10">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
          {/* ── Texto ── */}
          <Reveal className="lg:col-span-5">
            <p className="flex items-center gap-2 text-[#7fb3f8]">
              <Robot size={18} />
              <span className="eyebrow">Asistente Accedra</span>
            </p>
            <h2 className="section-title">
              {solucion ? (
                titulo
              ) : (
                <>
                  Contanos tu caso. <span className="gradient-text">Te decimos cómo lo resolvemos.</span>
                </>
              )}
            </h2>
            <p className="section-sub">
              Describí qué está frenando tu operación: te damos una primera devolución en el momento y te mostramos
              cómo lo resolvimos en empresas parecidas.
            </p>
            <ul className="mt-7 space-y-3">
              {PUNTOS.map((p) => (
                <li key={p} className="flex items-center gap-3 text-[15px] text-gray-300">
                  <span
                    className="grid h-6 w-6 shrink-0 place-items-center rounded-full"
                    style={{ background: `${accent}26`, color: "#7fb3f8" }}
                  >
                    <Check size={13} strokeWidth={2.5} />
                  </span>
                  {p}
                </li>
              ))}
            </ul>
            <a
              href={enlaceWhatsApp("Hola, quisiera hablar con un especialista de Accedra.")}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track({ type: "click", name: "whatsapp", target: `asistente:${origen}` })}
              className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-gray-400 transition-colors hover:text-[#25D366]"
            >
              <IconoWhatsApp size={15} />
              ¿Preferís hablar con una persona? Escribinos por WhatsApp
            </a>
          </Reveal>

          {/* ── El campo y los problemas típicos ── */}
          <Reveal preset="item" delay={0.1} className="lg:col-span-7">
            <div
              ref={tarjeta}
              onPointerEnter={precargar}
              className="rounded-[1.5rem] border border-white/10 p-5 sm:p-7"
              style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.025) 100%)" }}
            >
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  mandar(texto);
                }}
                className="relative rounded-2xl border border-white/10 bg-navy-900/60 transition-colors focus-within:border-white/25"
              >
                <label htmlFor={`caso-${origen}`} className="sr-only">
                  Contanos tu caso
                </label>
                <textarea
                  id={`caso-${origen}`}
                  rows={3}
                  value={texto}
                  maxLength={1200}
                  onChange={(e) => setTexto(e.target.value)}
                  onFocus={() => {
                    setEnfocado(true);
                    precargar();
                  }}
                  onBlur={() => setEnfocado(false)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                      e.preventDefault();
                      mandar(texto);
                    }
                  }}
                  placeholder={enfocado ? "Qué hace tu empresa y qué te está frenando…" : undefined}
                  className="chat-campo block w-full resize-none bg-transparent px-5 pb-14 pt-4 text-[16px] leading-relaxed text-white placeholder:text-gray-500 outline-none"
                />
                {/* El ejemplo va encima y no como placeholder: uno que cambia cada
                    45 ms lo releen los lectores de pantalla en cada cambio. */}
                {!texto && !enfocado && (
                  <p aria-hidden className="pointer-events-none absolute inset-x-5 top-4 text-[16px] leading-relaxed text-gray-500">
                    {escribiendo}
                    <span className="hero-cursor ml-px inline-block h-[1.05em] w-px translate-y-[3px] bg-gray-400" />
                  </p>
                )}
                <div className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-3 pl-2">
                  <span className="hidden text-[12px] text-gray-500 sm:inline">Enter para enviar</span>
                  <button
                    type="submit"
                    disabled={!texto.trim()}
                    className="ml-auto inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13.5px] font-semibold text-white transition-all hover:gap-2.5 disabled:opacity-40"
                    style={{ background: accent }}
                  >
                    Enviar
                    <ArrowUp size={15} />
                  </button>
                </div>
              </form>

              <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500">
                Lo que más nos consultan
              </p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {atajos.slice(0, 4).map(({ label, texto: t, icono: Icono }, i, lista) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => mandar(t, `${origen}:atajo`)}
                    // Con un número impar, el último ocupa la fila: sin hueco en la grilla.
                    className={`${lista.length % 2 && i === lista.length - 1 ? "sm:col-span-2 " : ""}group flex items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-3 text-left transition-all hover:border-white/20 hover:bg-white/[0.05]`}
                  >
                    <Icono size={17} className="shrink-0 text-gray-400 transition-colors group-hover:text-white" />
                    <span className="flex-1 text-[14px] text-gray-300 transition-colors group-hover:text-white">{label}</span>
                    <ArrowRight size={15} className="shrink-0 text-gray-600 transition-all group-hover:translate-x-0.5 group-hover:text-white" />
                  </button>
                ))}
              </div>

              {mensajes.length > 0 && (
                <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4 text-[13px]">
                  <button
                    type="button"
                    onClick={() => abrir(undefined, origen)}
                    className="inline-flex items-center gap-1.5 font-semibold text-white transition-all hover:gap-2.5"
                  >
                    Seguir tu conversación
                    <ArrowRight size={14} />
                  </button>
                  <button type="button" onClick={reiniciar} className="text-gray-500 transition-colors hover:text-gray-300">
                    Empezar de nuevo
                  </button>
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
