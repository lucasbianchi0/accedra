"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, X } from "lucide-react";

import { CATEGORIA_COLOR, CATEGORIA_LABEL, fechaCorta, urlDeNota, type NotaSitio } from "@/lib/notas";
import { track } from "@/lib/track";

/**
 * El blog en la portada, sin ocupar la portada.
 *
 * Es el hermano de `EventosLateral`: misma pestaña vertical pegada al borde
 * derecho, mismo panel que entra deslizándose, misma decisión de no usar
 * `<dialog>` —ver el comentario largo allá, que explica por qué `showModal()`
 * arruinaba la animación en una portada con video y luces—.
 *
 * DÓNDE SE PARA LA PESTAÑA
 *
 * Las dos comparten el borde derecho y se pisarían. La de eventos manda: se
 * queda centrada y avisa que está con `data-eventos-pestana` en el `<body>`,
 * el mismo recurso que ya usa la barra del popup. Esta lee ese dato y, si hay
 * eventos, se corre abajo; si no hay, se queda en el centro. Es una sola fuente
 * de verdad y ninguna de las dos necesita conocer a la otra.
 *
 * Las notas se piden en reposo, igual que los eventos: la portada es estática y
 * el panel vive cerrado, así que no puede costar TTFB.
 */

const ENTRADA_MS = 600;
const SALIDA_MS = 450;
const CURVA_ENTRADA = "cubic-bezier(0.33, 1, 0.68, 1)";
const CURVA_SALIDA = "cubic-bezier(0.32, 0, 0.67, 0)";

/** Cuánto baja la pestaña cuando la de eventos ya ocupa el centro. */
const CORRIMIENTO = 128;

export default function BlogLateral() {
  const pestana = useRef<HTMLButtonElement>(null);
  const botonCerrar = useRef<HTMLButtonElement>(null);

  const [notas, setNotas] = useState<NotaSitio[]>([]);
  const [pestanaVisible, setPestanaVisible] = useState(false);
  const [abierto, setAbierto] = useState(false);
  const [hayEventos, setHayEventos] = useState(false);

  /* ── Datos, cuando el navegador está libre ─────────────────────────────── */

  useEffect(() => {
    let vivo = true;
    const traer = () =>
      fetch("/api/notas")
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => {
          if (!vivo || !d?.notas?.length) return;
          setNotas(d.notas);
          window.setTimeout(() => vivo && setPestanaVisible(true), 60);
        })
        .catch(() => {});

    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    if (w.requestIdleCallback) {
      const id = w.requestIdleCallback(traer, { timeout: 4000 });
      return () => {
        vivo = false;
        w.cancelIdleCallback?.(id);
      };
    }
    const id = window.setTimeout(traer, 2000);
    return () => {
      vivo = false;
      window.clearTimeout(id);
    };
  }, []);

  /* ── Si la pestaña de eventos está, esta se corre ──────────────────────── */

  useEffect(() => {
    const sync = () => setHayEventos(document.body.dataset.eventosPestana === "1");
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(document.body, { attributes: true, attributeFilter: ["data-eventos-pestana"] });
    return () => observer.disconnect();
  }, []);

  /* ── Abrir y cerrar ────────────────────────────────────────────────────── */

  const abrir = () => {
    setAbierto(true);
    track({ type: "click", name: "blog_lateral_abrir", target: String(notas.length) });
  };
  const cerrar = useCallback(() => setAbierto(false), []);

  useEffect(() => {
    if (!abierto) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") cerrar();
    };
    document.addEventListener("keydown", onKey);
    const id = window.setTimeout(() => botonCerrar.current?.focus(), 80);
    return () => {
      document.removeEventListener("keydown", onKey);
      window.clearTimeout(id);
    };
  }, [abierto, cerrar]);

  // Al cerrar, el foco vuelve a la pestaña: si no, queda en un nodo `inert` y
  // el próximo Tab arranca desde el principio del documento.
  const cerrarYVolver = useCallback(() => {
    cerrar();
    window.setTimeout(() => pestana.current?.focus(), SALIDA_MS);
  }, [cerrar]);

  if (notas.length === 0) return null;

  const duracion = abierto ? ENTRADA_MS : SALIDA_MS;
  const curva = abierto ? CURVA_ENTRADA : CURVA_SALIDA;
  // El corrimiento va en `top` y no dentro del `translate3d`: Chrome no
  // interpola una transición entre `-50%` y `calc(-50% + 128px)`, así que el
  // valor quedaba escrito en el style pero la pestaña no se movía.
  const top = hayEventos ? `calc(50% + ${CORRIMIENTO}px)` : "50%";

  return (
    <>
      {/* ── La pestaña ─────────────────────────────────────────────────────── */}
      <button
        ref={pestana}
        type="button"
        onClick={abrir}
        aria-haspopup="dialog"
        aria-expanded={abierto}
        aria-label={`Blog (${notas.length})`}
        className="fixed right-0 z-30 flex flex-col items-center gap-3 rounded-l-2xl border border-r-0 border-white/20 px-2.5 py-4 text-white sm:px-3 sm:py-5"
        style={{
          top,
          transform: pestanaVisible ? "translate3d(0, -50%, 0)" : "translate3d(115%, -50%, 0)",
          transition: `transform ${ENTRADA_MS}ms ${CURVA_ENTRADA}, top ${ENTRADA_MS}ms ${CURVA_ENTRADA}`,
          background: "linear-gradient(180deg, #1B2D49 0%, #14243D 55%, #0F1C30 100%)",
          boxShadow: "-12px 18px 40px rgba(0,0,0,0.45), inset 1px 1px 0 rgba(255,255,255,0.16)",
        }}
      >
        <span className="grid h-6 w-6 place-items-center rounded-full bg-white text-[11.5px] font-bold tabular-nums text-[#14243D]">
          {notas.length}
        </span>
        <span
          className="font-display text-[12.5px] font-semibold uppercase tracking-[0.26em]"
          style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
        >
          Blog
        </span>
        <BookOpen size={16} className="text-white/85" />
      </button>

      {/* ── El panel ───────────────────────────────────────────────────────── */}
      <div
        className="fixed inset-0 z-[70]"
        inert={!abierto}
        aria-hidden={!abierto}
        style={{
          visibility: abierto ? "visible" : "hidden",
          pointerEvents: abierto ? "auto" : "none",
          transition: `visibility 0s linear ${abierto ? 0 : duracion}ms`,
        }}
      >
        <div
          aria-hidden="true"
          onClick={cerrarYVolver}
          className="absolute inset-0"
          style={{
            background: "rgba(4, 10, 20, 0.6)",
            opacity: abierto ? 1 : 0,
            transition: `opacity ${duracion}ms ease`,
          }}
        />

        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="blog-lateral-titulo"
          data-lenis-prevent
          className="absolute inset-y-0 right-0 flex w-[min(100vw,540px)] flex-col border-l border-white/[0.12]"
          style={{
            // Más oscuro que el de eventos, por el mismo motivo que /blog es
            // más oscuro que el resto del sitio: acá conviven las portadas y los
            // colores de las cinco soluciones.
            background: "linear-gradient(180deg, #0B1220 0%, #070C16 45%, #04070d 100%)",
            boxShadow: "-24px 0 60px rgba(0,0,0,0.45)",
            transform: abierto ? "translate3d(0, 0, 0)" : "translate3d(100%, 0, 0)",
            transition: `transform ${duracion}ms ${curva}`,
            willChange: "transform",
            backfaceVisibility: "hidden",
          }}
        >
          <div className="relative border-b border-white/10 px-7 pb-6 pt-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id="blog-lateral-titulo" className="font-display text-[27px] font-bold leading-tight text-white">
                  Del blog
                </h2>
                <p className="mt-2 max-w-md text-[14.5px] leading-relaxed text-gray-400">
                  Qué dice la ley, qué conviene y qué mirar antes de decidir. Escrito por el equipo que después lo
                  implementa.
                </p>
              </div>
              <button
                ref={botonCerrar}
                type="button"
                onClick={cerrarYVolver}
                aria-label="Cerrar"
                className="-mr-2 grid h-9 w-9 flex-shrink-0 place-items-center rounded-full text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X size={19} />
              </button>
            </div>
          </div>

          <div data-lenis-prevent className="flex-1 space-y-2 overflow-y-auto overscroll-contain px-5 py-5">
            {notas.map((n) => (
              <ItemNota key={n.id} nota={n} onIr={cerrar} />
            ))}
          </div>

          <div className="border-t border-white/10 px-7 py-5">
            <Link
              href="/blog"
              onClick={cerrar}
              className="inline-flex items-center gap-2 text-[14px] font-semibold text-accent-300 transition-colors hover:text-white"
            >
              Ver todo el blog
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

/** Una nota en el panel: portada chica, solución, título y fecha. */
function ItemNota({ nota, onIr }: { nota: NotaSitio; onIr: () => void }) {
  const color = nota.categoria ? CATEGORIA_COLOR[nota.categoria] : "#2b6fd4";

  return (
    <Link
      href={urlDeNota(nota.slug)}
      onClick={() => {
        track({ type: "click", name: "blog_lateral_nota", target: nota.slug });
        onIr();
      }}
      className="group flex gap-4 rounded-card p-3 transition-colors hover:bg-white/[0.04]"
    >
      {/* 96 px en mobile y 112 en el panel ancho: a 76 la portada se leía como
          un ícono y no como una foto, que es justo lo que decide el clic. El
          `sizes` acompaña los dos anchos para que no se baje de más. */}
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-white/[0.07] bg-[#05090f] sm:h-28 sm:w-28">
        {nota.portadaUrl ? (
          <Image
            src={nota.portadaUrl}
            alt=""
            fill
            sizes="(min-width: 640px) 112px, 96px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${color}40, #05090f)` }} />
        )}
      </div>

      {/* El texto ocupa exactamente el alto de la foto.
          La fila mide lo que mide la miniatura y esta columna se estira con
          `items-stretch` (el defecto del flex); `justify-between` manda la
          solución arriba y la fecha abajo, y el título se queda con el medio.
          El recorte es a tres líneas en el panel ancho y a dos en mobile, que
          es lo que entra en 112 y en 96 px: el navegador pone los puntos
          suspensivos sólo cuando hacen falta. */}
      <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
        {nota.categoria && (
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em]" style={{ color }}>
            {CATEGORIA_LABEL[nota.categoria]}
          </p>
        )}
        <h3 className="line-clamp-2 text-[17px] font-semibold leading-[1.25] text-gray-100 transition-colors group-hover:text-white sm:line-clamp-3 sm:text-[18px]">
          {nota.titulo}
        </h3>
        <p className="text-[11.5px] uppercase tracking-[0.12em] text-gray-500">{fechaCorta(nota.publicadoEn)}</p>
      </div>
    </Link>
  );
}
