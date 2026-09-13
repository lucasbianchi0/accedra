"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, CalendarDays, Clock, MapPin, X } from "lucide-react";

import EventoModal from "@/components/EventoModal";
import { BloqueFecha, CategoriaTags, FiltroCategorias, LOCALE, Portada, categoriasPresentes, fecha } from "@/components/EventosPiezas";
import { useT } from "@/lib/i18n/useT";
import { useLang } from "@/lib/i18n/LangProvider";
import { enCurso, type Categoria, type EventoSitio } from "@/lib/eventos";
import { track } from "@/lib/track";

/**
 * La entrada y la salida del panel: el mismo deslizamiento, en los dos sentidos.
 *
 * Una sola curva y una sola duración a propósito. Se probó una entrada con
 * cascada de contenido, línea de luz y desenfoque, y el resultado fue ruidoso:
 * lo que se busca es que el panel aparezca desde el costado sin llamar la
 * atención sobre sí mismo, y que se vaya de la misma forma.
 *
 * La curva es simétrica (ease-in-out cúbica): arranca despacio, toma velocidad
 * a mitad de camino y llega frenando. Se probó una curva de hoja de iOS, que
 * sale disparada y se asienta de a poco: al hacer clic se sentía brusca y con
 * un rebote al final. Esta no tiene ni una cosa ni la otra.
 */
const DURACION_MS = 600;
const CURVA = "cubic-bezier(0.65, 0, 0.35, 1)";

/**
 * Los eventos en la portada, sin ocupar la portada.
 *
 * Una pestaña vertical pegada al borde derecho —"EVENTOS" y cuántos hay— que al
 * tocarla abre un panel lateral con la lista y el botón para participar. La
 * página no cambia: quien no busca eventos no los ve, y quien los busca los
 * tiene a un clic desde cualquier altura del scroll.
 *
 * La animación va en estilos inline y no en globals.css: son dos propiedades
 * (transform del panel, opacidad del fondo) que dependen de un estado, y así no
 * hay forma de que el CSS global y el componente queden desfasados.
 *
 * z-30 y no más: el overlay del menú mobile es z-40 y tiene que taparla.
 *
 * `?muestra=1` en desarrollo muestra eventos de ejemplo (lib/eventos-muestra.ts).
 */
export default function EventosLateral() {
  const t = useT();
  const { lang } = useLang();
  const locale = LOCALE[lang] ?? "es-AR";

  const dialogo = useRef<HTMLDialogElement>(null);
  const cierre = useRef<number | undefined>(undefined);
  const [eventos, setEventos] = useState<EventoSitio[]>([]);
  /** La pestaña entra deslizándose apenas llegan los datos. */
  const [pestanaVisible, setPestanaVisible] = useState(false);
  /** El estado visual. El <dialog> se abre antes y se cierra después de animar. */
  const [abierto, setAbierto] = useState(false);
  const [categoria, setCategoria] = useState<Categoria | null>(null);
  /** El evento abierto en el popup de detalle, encima del panel. */
  const [detalle, setDetalle] = useState<{ e: EventoSitio; form: boolean } | null>(null);

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
          // Las portadas se bajan y se decodifican ahora, en reposo. Si se
          // cargaran recién al abrir, la decodificación caería en medio del
          // deslizamiento.
          for (const e of proximos) {
            if (!e.portadaUrl) continue;
            const img = new Image();
            img.src = e.portadaUrl;
            img.decode?.().catch(() => {});
          }
          if (proximos.length > 0) requestAnimationFrame(() => setPestanaVisible(true));
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

  // La página de fondo no scrollea con el panel abierto. No se toca el overflow
  // del documento: eso recalcula el layout de toda la página y, con el scroll
  // suave de Lenis, el fondo daba un saltito justo cuando el panel empezaba a
  // entrar. En cambio se frenan la rueda y el arrastre táctil mientras el panel
  // está abierto, salvo dentro de la lista, que sí scrollea.
  const lista = useRef<HTMLDivElement>(null);
  const frenoScroll = useRef<((ev: Event) => void) | null>(null);
  const bloquearScroll = () => {
    if (frenoScroll.current) return;
    const freno = (ev: Event) => {
      if (lista.current?.contains(ev.target as Node)) return;
      ev.preventDefault();
    };
    frenoScroll.current = freno;
    window.addEventListener("wheel", freno, { passive: false });
    window.addEventListener("touchmove", freno, { passive: false });
  };
  const liberarScroll = useCallback(() => {
    const freno = frenoScroll.current;
    if (!freno) return;
    window.removeEventListener("wheel", freno);
    window.removeEventListener("touchmove", freno);
    frenoScroll.current = null;
  }, []);
  useEffect(() => liberarScroll, [liberarScroll]);

  const abrir = () => {
    const d = dialogo.current;
    if (!d) return;
    window.clearTimeout(cierre.current);
    bloquearScroll();
    if (!d.open) {
      d.showModal();
      // Un <dialog> cerrado es display:none, así que su posición de partida
      // (fuera de pantalla) nunca se calculó. Leer una medida obliga a
      // calcularla ahora; sin esto, partida y llegada caen en el mismo cuadro y
      // el panel aparece sin deslizarse.
      void d.offsetWidth;
    }
    setAbierto(true);
    track({ type: "click", name: "eventos_lateral_abrir", target: String(eventos.length) });
  };

  const cerrar = useCallback(() => {
    setAbierto(false);
    window.clearTimeout(cierre.current);
    cierre.current = window.setTimeout(() => {
      dialogo.current?.close();
      liberarScroll();
    }, DURACION_MS);
  }, [liberarScroll]);

  if (eventos.length === 0) return null;

  const hayEnCurso = eventos.some((e) => enCurso(e));
  const disponibles = categoriasPresentes(eventos);
  const visibles = categoria ? eventos.filter((e) => e.categorias.includes(categoria)) : eventos;
  // Con "Reducir movimiento" activado en el sistema, el panel aparece sin deslizarse.
  const duracion = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : DURACION_MS;

  return (
    <>
      {/* ── La pestaña ─────────────────────────────────────────────────────── */}
      <button
        type="button"
        onClick={abrir}
        aria-haspopup="dialog"
        aria-expanded={abierto}
        aria-label={`${t.events.tab} (${eventos.length})`}
        className="group fixed right-0 top-1/2 z-30 flex flex-col items-center gap-3 rounded-l-2xl border border-r-0 border-white/20 px-2.5 py-4 text-white sm:px-3 sm:py-5"
        style={{
          transform: pestanaVisible ? "translate3d(0, -50%, 0)" : "translate3d(115%, -50%, 0)",
          // Sin efecto de ensanche al pasar el mouse: al abrir el panel el mouse
          // deja de estar encima, la pestaña se achicaba mientras el panel
          // entraba y se leía como un rebote en el borde.
          transition: `transform ${DURACION_MS}ms ${CURVA}`,
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
      <dialog
        ref={dialogo}
        data-lenis-prevent
        aria-labelledby="eventos-lateral-titulo"
        // Esc: se intercepta para cerrar deslizando en vez de de golpe.
        onCancel={(e) => {
          e.preventDefault();
          cerrar();
        }}
        // Ocupa toda la pantalla: adentro van el fondo y el panel, cada uno con
        // su transición. El ::backdrop nativo no se deja animar así.
        style={{
          position: "fixed",
          inset: 0,
          width: "100vw",
          height: "100dvh",
          maxWidth: "none",
          maxHeight: "none",
          margin: 0,
          padding: 0,
          border: 0,
          background: "transparent",
          overflow: "hidden",
        }}
      >
        <div
          aria-hidden="true"
          onClick={cerrar}
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(4, 10, 20, 0.6)",
            opacity: abierto ? 1 : 0,
            transition: `opacity ${duracion}ms ${CURVA}`,
          }}
        />

        <div
          className="absolute inset-y-0 right-0 flex w-[min(100vw,440px)] flex-col border-l border-white/[0.12]"
          style={{
            background: "linear-gradient(180deg, #16263F 0%, #0F1C30 45%, #0A1424 100%)",
            boxShadow: "-24px 0 60px rgba(0,0,0,0.45)",
            transform: abierto ? "translate3d(0, 0, 0)" : "translate3d(100%, 0, 0)",
            transition: `transform ${duracion}ms ${CURVA}`,
            willChange: "transform",
          }}
        >
          {/* Cabecera */}
          <div className="relative border-b border-white/10 px-6 pb-5 pt-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id="eventos-lateral-titulo" className="text-[24px] font-bold leading-tight text-white">
                  {t.events.upcoming}
                </h2>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-[#9FB0C7]">{t.events.drawerSub}</p>
              </div>
              <button
                type="button"
                onClick={cerrar}
                aria-label={t.events.close}
                className="-mr-2 grid h-9 w-9 flex-shrink-0 place-items-center rounded-full text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X size={19} />
              </button>
            </div>
            {disponibles.length > 1 && (
              <div className="mt-4">
                <FiltroCategorias disponibles={disponibles} activa={categoria} onChange={setCategoria} />
              </div>
            )}
          </div>

          {/* Lista */}
          <div ref={lista} data-lenis-prevent className="flex-1 space-y-4 overflow-y-auto overscroll-contain px-5 py-5">
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
          <div className="border-t border-white/10 px-6 py-4">
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
      </dialog>

      {/* El detalle se abre como otro <dialog> modal, encima del panel. */}
      {detalle && (
        <EventoModal key={detalle.e.id} evento={detalle.e} enfocarForm={detalle.form} onCerrar={() => setDetalle(null)} />
      )}
    </>
  );
}

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
      className="group overflow-hidden rounded-card border border-white/[0.12] transition-[border-color,transform,box-shadow] duration-500 ease-out hover:-translate-y-0.5 hover:border-white/[0.22] hover:shadow-[0_24px_50px_rgba(0,0,0,0.45)]"
      style={{
        background: "linear-gradient(180deg, #1B2D49 0%, #13223A 100%)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12), 0 16px 40px rgba(0,0,0,0.35)",
      }}
    >
      <button
        type="button"
        onClick={() => onAbrir(e, false)}
        aria-label={`${t.events.details}: ${e.titulo}`}
        className="relative block aspect-[16/8] w-full overflow-hidden"
      >
        <Portada e={e} className="absolute inset-0" />
        <span
          className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider"
          style={{ background: "rgba(10,18,32,0.72)", color: "#DCE9FB", border: "1px solid rgba(255,255,255,0.12)" }}
        >
          {vivo && <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />}
          {vivo ? t.events.live : `${t.events.types[e.tipo]} · ${t.events.modes[e.modalidad]}`}
        </span>
        <span className="absolute bottom-3 left-3">
          <BloqueFecha iso={e.inicio} locale={locale} />
        </span>
      </button>

      <div className="p-4">
        {e.categorias.length + e.tags.length > 0 && (
          <div className="mb-2">
            <CategoriaTags categorias={e.categorias} tags={e.tags} />
          </div>
        )}
        <h3 className="text-[16.5px] font-bold leading-snug text-white">{e.titulo}</h3>
        <p className="mt-2 flex items-center gap-1.5 text-[12.5px] text-[#C9D6E8]">
          <Clock size={13} className="flex-shrink-0 text-[#7FB3F8]" />
          {f.larga} · {f.hora} h
        </p>
        {e.lugar && (
          <p className="mt-1 flex items-center gap-1.5 text-[12.5px] text-[#C9D6E8]">
            <MapPin size={13} className="flex-shrink-0 text-[#7FB3F8]" />
            <span className="truncate">{e.lugar}</span>
          </p>
        )}

        <div className="mt-4 flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              track({ type: "click", name: "evento_participar", target: e.slug });
              onAbrir(e, true);
            }}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-[13.5px] font-semibold text-white transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(43,111,212,0.55)]"
            style={{ background: "#2560BC", boxShadow: "0 8px 24px rgba(43,111,212,0.4)" }}
          >
            {t.events.participate}
            <ArrowRight size={15} />
          </button>
          <button
            type="button"
            onClick={() => onAbrir(e, false)}
            className="inline-flex items-center rounded-full border border-white/15 px-4 py-2.5 text-[13px] font-medium text-white/85 transition-colors duration-300 hover:border-white/30 hover:text-white"
          >
            {t.events.details}
          </button>
        </div>
      </div>
    </article>
  );
}
