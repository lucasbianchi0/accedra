"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, CalendarDays, Clock, MapPin, X } from "lucide-react";

import EventoModal from "@/components/EventoModal";
import { BloqueFecha, FiltroCategorias, LOCALE, Portada, categoriasPresentes, fecha } from "@/components/EventosPiezas";
import { useT } from "@/lib/i18n/useT";
import { useLang } from "@/lib/i18n/LangProvider";
import { enCurso, type Categoria, type EventoSitio } from "@/lib/eventos";
import { track } from "@/lib/track";

/*
 * LA ANIMACION DEL PANEL
 *
 * Un deslizamiento desde el costado, nada más: entra desacelerando y sale
 * acelerando, con el fondo oscureciéndose al mismo ritmo.
 *
 * POR QUE NO ES UN <dialog>
 *
 * Con `showModal()` Chrome vuelve inerte todo el resto del documento y
 * recalcula los estilos de la página entera en ese mismo cuadro. En la portada
 * —video, luces, marquesinas— eso se comía los primeros cuadros de la
 * animación: el panel se veía cortado, llegaba de golpe y parecía rebotar.
 * Además un <dialog> cerrado es display:none, así que la transición no tenía
 * un punto de partida estable.
 *
 * Acá el panel está siempre montado, cerrado y fuera de pantalla. Abrir cambia
 * dos propiedades que resuelve la GPU sin tocar el layout —el transform del
 * panel y la opacidad del fondo— y nada más en la página se entera.
 */
const ENTRADA_MS = 600;
const SALIDA_MS = 450;
/** Ease-out cúbica: llega frenando, sin pasarse ni rebotar. */
const CURVA_ENTRADA = "cubic-bezier(0.33, 1, 0.68, 1)";
/** Ease-in cúbica: el espejo de la entrada, se va acelerando. */
const CURVA_SALIDA = "cubic-bezier(0.32, 0, 0.67, 0)";

/**
 * Los eventos en la portada, sin ocupar la portada.
 *
 * Una pestaña vertical pegada al borde derecho —"EVENTOS" y cuántos hay— que al
 * tocarla abre un panel lateral con la lista y el botón para participar. Sólo
 * existe si hay eventos próximos.
 *
 * Accesibilidad sin <dialog>: `role="dialog"` con `aria-modal`, el foco va al
 * botón de cerrar al abrir y vuelve a la pestaña al cerrar, Esc cierra, y el
 * panel cerrado es `inert` para que no se pueda llegar con Tab.
 *
 * z-30 la pestaña (el overlay del menú mobile es z-40 y tiene que taparla) y
 * z-[70] el panel (por encima del navbar y la barra de progreso).
 *
 * `?muestra=1` en desarrollo muestra eventos de ejemplo (lib/eventos-muestra.ts).
 */
export default function EventosLateral() {
  const t = useT();
  const { lang } = useLang();
  const locale = LOCALE[lang] ?? "es-AR";

  const pestana = useRef<HTMLButtonElement>(null);
  const botonCerrar = useRef<HTMLButtonElement>(null);
  const lista = useRef<HTMLDivElement>(null);

  const [eventos, setEventos] = useState<EventoSitio[]>([]);
  const [pestanaVisible, setPestanaVisible] = useState(false);
  const [abierto, setAbierto] = useState(false);
  const [categoria, setCategoria] = useState<Categoria | null>(null);
  /** El evento abierto en el popup de detalle, encima del panel. */
  const [detalle, setDetalle] = useState<{ e: EventoSitio; form: boolean } | null>(null);

  /* ── Datos ─────────────────────────────────────────────────────────────── */

  useEffect(() => {
    let vivo = true;
    const muestra = new URLSearchParams(window.location.search).has("muestra") ? "?muestra=1" : "";
    const traer = () =>
      fetch(`/api/eventos${muestra}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => {
          if (!vivo || !d) return;
          const proximos: EventoSitio[] = d.proximos ?? [];
          setEventos(proximos);
          // Acá había una precarga a mano (`new Image()` con la URL que pintaba
          // la card) para que las portadas no se bajaran en medio del
          // deslizamiento. Se fue junto con la URL escrita a mano: ahora la
          // portada viaja por `next/image` con un `srcset`, y cuál de esos
          // archivos se baja lo decide el navegador según la pantalla — una
          // precarga que adivine mal baja un archivo que después no se usa. Las
          // cards van con `yaMismo`, que es la misma intención dicha en el
          // lugar correcto: se bajan al montarse, no al abrirse el panel.
          if (proximos.length > 0) window.setTimeout(() => vivo && setPestanaVisible(true), 60);
        })
        .catch(() => {});

    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    if (w.requestIdleCallback) {
      const id = w.requestIdleCallback(traer, { timeout: 3000 });
      return () => {
        vivo = false;
        w.cancelIdleCallback?.(id);
      };
    }
    const id = window.setTimeout(traer, 1500);
    return () => {
      vivo = false;
      window.clearTimeout(id);
    };
  }, []);

  // El borde derecho lo comparten dos pestañas. Esta manda —se queda en el
  // centro— y lo publica en el body para que la del blog se corra abajo. Es el
  // mismo recurso que usa la barra del popup con `data-popup-barra`: ninguna de
  // las dos necesita importar a la otra.
  useEffect(() => {
    if (!pestanaVisible) return;
    document.body.dataset.eventosPestana = "1";
    return () => {
      delete document.body.dataset.eventosPestana;
    };
  }, [pestanaVisible]);

  /* ── Abrir y cerrar ────────────────────────────────────────────────────── */

  const abrir = () => {
    setAbierto(true);
    track({ type: "click", name: "eventos_lateral_abrir", target: String(eventos.length) });
  };

  const cerrar = useCallback(() => {
    setAbierto(false);
  }, []);

  // Con el panel abierto: la página de fondo no scrollea (se frenan la rueda y
  // el arrastre táctil fuera de la lista, sin tocar el layout de la página), Esc
  // cierra y el foco entra al panel. Al cerrar, el foco vuelve a la pestaña.
  useEffect(() => {
    if (!abierto) return;

    const freno = (ev: Event) => {
      if (lista.current?.contains(ev.target as Node)) return;
      ev.preventDefault();
    };
    const tecla = (ev: KeyboardEvent) => {
      // Con el popup de detalle abierto, Esc es de él.
      if (ev.key === "Escape" && !document.querySelector("dialog.evento-modal[open]")) cerrar();
    };

    window.addEventListener("wheel", freno, { passive: false });
    window.addEventListener("touchmove", freno, { passive: false });
    window.addEventListener("keydown", tecla);
    botonCerrar.current?.focus({ preventScroll: true });

    const volverFoco = pestana.current;
    return () => {
      window.removeEventListener("wheel", freno);
      window.removeEventListener("touchmove", freno);
      window.removeEventListener("keydown", tecla);
      volverFoco?.focus({ preventScroll: true });
    };
  }, [abierto, cerrar]);

  if (eventos.length === 0) return null;

  const hayEnCurso = eventos.some((e) => enCurso(e));
  const disponibles = categoriasPresentes(eventos);
  const visibles = categoria ? eventos.filter((e) => e.categorias.includes(categoria)) : eventos;
  const sinMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const duracion = sinMovimiento ? 0 : abierto ? ENTRADA_MS : SALIDA_MS;
  const curva = abierto ? CURVA_ENTRADA : CURVA_SALIDA;

  return (
    <>
      {/* ── La pestaña ─────────────────────────────────────────────────────── */}
      <button
        ref={pestana}
        type="button"
        onClick={abrir}
        aria-haspopup="dialog"
        aria-expanded={abierto}
        aria-label={`${t.events.tab} (${eventos.length})`}
        className="fixed right-0 top-1/2 z-30 flex flex-col items-center gap-3 rounded-l-2xl border border-r-0 border-white/20 px-2.5 py-4 text-white sm:px-3 sm:py-5"
        style={{
          transform: pestanaVisible ? "translate3d(0, -50%, 0)" : "translate3d(115%, -50%, 0)",
          transition: `transform ${ENTRADA_MS}ms ${CURVA_ENTRADA}`,
          background: "linear-gradient(180deg, #2F79E0 0%, #1E57BD 55%, #16409A 100%)",
          boxShadow: "-12px 18px 40px rgba(0,0,0,0.45), inset 1px 1px 0 rgba(255,255,255,0.2)",
        }}
      >
        <span className="relative grid h-6 w-6 place-items-center rounded-full bg-white text-[11.5px] font-bold text-[#16409A] tabular-nums">
          {eventos.length}
          {hayEnCurso && (
            <span className="absolute -right-0.5 -top-0.5 flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full border border-white bg-emerald-400" />
            </span>
          )}
        </span>
        <span
          className="font-display text-[12.5px] font-semibold uppercase tracking-[0.26em]"
          style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
        >
          {t.events.tab}
        </span>
        <CalendarDays size={16} className="text-white/85" />
      </button>

      {/* ── El panel ───────────────────────────────────────────────────────── */}
      {/* Siempre montado. Cerrado: fuera de pantalla, sin clics y sin foco.
          `visibility` se apaga recién cuando terminó de salir. */}
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
          onClick={cerrar}
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
          aria-labelledby="eventos-lateral-titulo"
          data-lenis-prevent
          className="absolute inset-y-0 right-0 flex w-[min(100vw,540px)] flex-col border-l border-white/[0.12]"
          style={{
            background: "linear-gradient(180deg, #16263F 0%, #0F1C30 45%, #0A1424 100%)",
            boxShadow: "-24px 0 60px rgba(0,0,0,0.45)",
            transform: abierto ? "translate3d(0, 0, 0)" : "translate3d(100%, 0, 0)",
            transition: `transform ${duracion}ms ${curva}`,
            willChange: "transform",
            backfaceVisibility: "hidden",
          }}
        >
          {/* Cabecera */}
          <div className="relative border-b border-white/10 px-7 pb-6 pt-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id="eventos-lateral-titulo" className="text-[27px] font-bold leading-tight text-white">
                  {t.events.upcoming}
                </h2>
                <p className="mt-2 max-w-md text-[14.5px] leading-relaxed text-[#9FB0C7]">{t.events.drawerSub}</p>
              </div>
              <button
                ref={botonCerrar}
                type="button"
                onClick={cerrar}
                aria-label={t.events.close}
                className="-mr-2 grid h-9 w-9 flex-shrink-0 place-items-center rounded-full text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X size={19} />
              </button>
            </div>
            {disponibles.length > 1 && (
              <div className="mt-5">
                <FiltroCategorias disponibles={disponibles} activa={categoria} onChange={setCategoria} />
              </div>
            )}
          </div>

          {/* Lista */}
          <div ref={lista} data-lenis-prevent className="flex-1 space-y-5 overflow-y-auto overscroll-contain px-6 py-6">
            {visibles.map((e) => (
              <ItemEvento key={e.id} e={e} locale={locale} onAbrir={(ev, form) => setDetalle({ e: ev, form })} />
            ))}
            {visibles.length === 0 && (
              <p className="rounded-card border border-dashed border-white/15 px-5 py-8 text-center text-[13.5px] text-[#9FB0C7]">
                {t.events.noneInCategory}
              </p>
            )}
          </div>

          {/* Pie */}
          <div className="border-t border-white/10 px-7 py-5">
            <Link
              href="/eventos"
              onClick={cerrar}
              className="group inline-flex items-center gap-2 text-[13.5px] font-medium text-white/80 transition-colors hover:text-white"
            >
              {t.events.viewAll}
              <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* El detalle se abre como <dialog> modal, encima del panel. */}
      {detalle && (
        <EventoModal key={detalle.e.id} evento={detalle.e} onCerrar={() => setDetalle(null)} />
      )}
    </>
  );
}

/**
 * Un evento en el panel: card horizontal con la foto cuadrada a la izquierda
 * —con la fecha encima— y al lado el tipo, el título, cuándo y dónde, y los dos
 * botones. Sin tags: se ven en el popup de detalle y en /eventos, y el filtro de
 * arriba ya agrupa por categoría.
 *
 * La foto va cuadrada y dentro del padding de la card, con sus propias esquinas
 * redondeadas: así la card no se estira de alto con la foto, y el texto tiene
 * todo el ancho que le queda.
 */
function ItemEvento({
  e,
  locale,
  onAbrir,
}: {
  e: EventoSitio;
  locale: string;
  onAbrir: (e: EventoSitio, conFormulario: boolean) => void;
}) {
  const t = useT();
  const f = fecha(e.inicio, locale);
  const vivo = enCurso(e);

  return (
    <article
      className="flex gap-4 rounded-card border border-white/[0.12] p-4 transition-colors duration-300 hover:border-white/[0.22] sm:gap-5"
      style={{
        background: "linear-gradient(120deg, #1B2D49 0%, #13223A 100%)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12), 0 16px 40px rgba(0,0,0,0.32)",
      }}
    >
      {/* Foto cuadrada con la fecha */}
      <button
        type="button"
        onClick={() => onAbrir(e, false)}
        aria-label={`${t.events.details}: ${e.titulo}`}
        className="relative aspect-square w-[112px] flex-shrink-0 self-start overflow-hidden rounded-xl sm:w-[150px]"
      >
        <Portada e={e} sizes="150px" yaMismo className="absolute inset-0" />
        <span className="absolute bottom-2 left-2">
          <BloqueFecha iso={e.inicio} locale={locale} />
        </span>
      </button>

      {/* Qué, cuándo, dónde y los botones */}
      <div className="flex min-w-0 flex-1 flex-col">
        <p className="flex flex-wrap items-center gap-2 text-[10.5px] font-semibold uppercase tracking-[0.12em] text-[#7FB3F8]">
          <span>
            {t.events.types[e.tipo]} · {t.events.modes[e.modalidad]}
          </span>
          {vivo && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/15 px-2 py-0.5 text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              {t.events.live}
            </span>
          )}
        </p>

        <h3 className="mt-1.5 line-clamp-2 text-[16.5px] font-bold leading-snug text-white">{e.titulo}</h3>

        <div className="mt-2 space-y-1 text-[12.5px] text-[#C9D6E8]">
          <p className="flex items-center gap-1.5">
            <Clock size={13} className="flex-shrink-0 text-[#7FB3F8]" />
            <span className="truncate">
              {f.larga} · {f.hora} h
            </span>
          </p>
          {e.lugar && (
            <p className="flex items-center gap-1.5">
              <MapPin size={13} className="flex-shrink-0 text-[#7FB3F8]" />
              <span className="truncate">{e.lugar}</span>
            </p>
          )}
        </div>

        <div className="mt-auto flex flex-wrap items-center gap-2 pt-3.5">
          <button
            type="button"
            onClick={() => {
              track({ type: "click", name: "evento_participar", target: e.slug });
              onAbrir(e, true);
            }}
            className="inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-2 text-[13px] font-semibold text-white transition-opacity duration-200 hover:opacity-90"
            style={{ background: "#2560BC", boxShadow: "0 8px 22px rgba(43,111,212,0.4)" }}
          >
            {t.events.participate}
            <ArrowRight size={14} />
          </button>
          <button
            type="button"
            onClick={() => onAbrir(e, false)}
            className="inline-flex items-center rounded-full border border-white/15 px-4 py-2 text-[13px] font-medium text-white/85 transition-colors duration-300 hover:border-white/30 hover:text-white"
          >
            {t.events.details}
          </button>
        </div>
      </div>
    </article>
  );
}
