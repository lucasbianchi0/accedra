"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowUpRight, CalendarDays, MapPin } from "lucide-react";

import EventoModal from "@/components/EventoModal";
import { CategoriaTags, FiltroCategorias, LOCALE, categoriasPresentes, fecha } from "@/components/EventosPiezas";
import PortadaEvento from "@/components/eventos/PortadaEvento";
import { useT } from "@/lib/i18n/useT";
import { useLang } from "@/lib/i18n/LangProvider";
import { CATEGORIA_COLOR, enCurso, type Categoria, type EventoSitio } from "@/lib/eventos";
import { track } from "@/lib/track";

/**
 * La lista de /eventos.
 *
 * UNA AGENDA NO ES UNA LISTA
 *
 * Es un próximo evento y todo lo demás. Por eso el primero se lleva una
 * marquesina de ancho completo —portada sangrada, fecha en tipografía grande,
 * título de titular de diario— y el resto baja a una grilla de dos columnas.
 * Los realizados pierden la foto y se vuelven un índice de una línea.
 *
 * La versión anterior daba el mismo peso a un workshop de mañana y a un webinar
 * de hace dos meses: catorce cards horizontales idénticas que se leían como un
 * panel de control. Lo que hace que un diseño se sienta caro no es el brillo,
 * es la jerarquía — que algo pese diez veces más que lo que sigue.
 *
 * LOS EVENTOS NO TIENEN PÁGINA PROPIA
 *
 * «Participar» y «Ver detalle» abren el popup (`EventoModal`), que trae la
 * información completa y el mail para anotarse. El slug de `?evento=` —los
 * links compartidos, y la vieja dirección /eventos/<slug>, que redirige acá—
 * abre ese popup directo.
 *
 * ESE SLUG SE LEE ACÁ Y NO EN LA PÁGINA
 *
 * Leerlo arriba obligaba a la página a mirar `searchParams`, y una página que
 * mira `searchParams` en Next es dinámica: no se prerenderiza y cada visita se
 * renderiza de nuevo contra Supabase. Medido en el build de producción, eso
 * eran 250 ms de TTFB por visita contra 2 ms de una página estática. Leerlo
 * desde el cliente deja /eventos estática con ISR de un minuto, y el popup se
 * abre igual: un milisegundo después, cuando hidrata.
 *
 * DÓNDE SE ROMPE
 *
 * Con un solo evento próximo la página es la marquesina y nada más. Se banca:
 * esa es la verdad de la agenda esa semana. Con más de diez próximos la grilla
 * se hace larga, y ahí habría que paginar o agrupar por mes.
 */
export default function ListaEventos({
  proximos,
  pasados,
}: {
  proximos: EventoSitio[];
  pasados: EventoSitio[];
}) {
  const t = useT();
  const { lang } = useLang();
  const locale = LOCALE[lang] ?? "es-AR";
  const compartido = useSearchParams().get("evento");
  const [categoria, setCategoria] = useState<Categoria | null>(null);
  const [detalle, setDetalle] = useState<{ e: EventoSitio; form: boolean } | null>(null);
  // Una vez que se cierra el popup que abrió la dirección, no se vuelve a
  // abrir: el slug sigue en la barra del navegador y sin esto el popup se
  // reabriría solo en el siguiente render.
  const [urlDescartada, setUrlDescartada] = useState(false);
  const abrir = (e: EventoSitio, form: boolean) => setDetalle({ e, form });
  const cerrar = () => {
    setDetalle(null);
    setUrlDescartada(true);
  };

  // `?muestra=1`: los eventos de ejemplo, SÓLO en desarrollo.
  //
  // Antes lo resolvía la página, leyendo la query en el servidor. Eso es
  // justamente lo que volvía dinámica la ruta, así que la comodidad de
  // desarrollo se pagaba en cada visita de producción. Ahora se piden por el
  // mismo endpoint que ya usa la pestaña de la portada, y en el build de
  // producción `process.env.NODE_ENV` es una constante: todo esto se va con el
  // árbol muerto y los eventos de ejemplo nunca entran al bundle.
  //
  // El contador del encabezado sigue mostrando los eventos reales: lo arma el
  // servidor y esto es de acá para abajo.
  const [muestra, setMuestra] = useState<{ proximos: EventoSitio[]; pasados: EventoSitio[] } | null>(null);
  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    if (!new URLSearchParams(window.location.search).has("muestra")) return;
    let vivo = true;
    fetch("/api/eventos?muestra=1")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => vivo && d && setMuestra(d))
      .catch(() => {});
    return () => {
      vivo = false;
    };
  }, []);

  const todos = muestra ?? { proximos, pasados };

  // El popup que pidió la dirección, derivado al renderizar y no guardado en un
  // efecto: al prerenderizar no hay query —`compartido` es null y el popup no
  // existe en el HTML—, y en el cliente aparece en el primer render. Un efecto
  // que llamara a `setDetalle` haría lo mismo pero con un render de más y una
  // regla de React rota (`set-state-in-effect`).
  const deLaUrl =
    !urlDescartada && compartido
      ? [...todos.proximos, ...todos.pasados].find((x) => x.slug === compartido)
      : undefined;
  const abierto = detalle ?? (deLaUrl ? { e: deLaUrl, form: false } : null);

  const disponibles = categoriasPresentes([...todos.proximos, ...todos.pasados]);
  const filtrar = (l: EventoSitio[]) => (categoria ? l.filter((e) => e.categorias.includes(categoria)) : l);
  const prox = filtrar(todos.proximos);
  const pas = filtrar(todos.pasados);

  // El destacado del backoffice manda; si no hay ninguno marcado, el primero
  // que viene. Nunca uno realizado: una marquesina de algo que ya pasó es una
  // promesa vencida.
  const cabeza = prox.find((e) => e.destacado) ?? prox[0] ?? null;
  const resto = prox.filter((e) => e.id !== cabeza?.id);

  return (
    <div className="space-y-14">
      {disponibles.length > 1 && (
        <FiltroCategorias disponibles={disponibles} activa={categoria} onChange={setCategoria} />
      )}

      {cabeza && <Marquesina e={cabeza} locale={locale} onAbrir={abrir} />}

      {resto.length > 0 && (
        <section>
          <Rotulo texto={t.events.upcoming} cantidad={resto.length} />
          <div className="grid gap-5 md:grid-cols-2">
            {resto.map((e) => (
              <CardMedia key={e.id} e={e} locale={locale} onAbrir={abrir} />
            ))}
          </div>
        </section>
      )}

      {pas.length > 0 && (
        <section>
          <Rotulo texto={t.events.past} cantidad={pas.length} />
          <ul className="divide-y divide-white/[0.06] border-y border-white/[0.06]">
            {pas.map((e) => (
              <FilaRealizada key={e.id} e={e} locale={locale} onAbrir={abrir} />
            ))}
          </ul>
        </section>
      )}

      {prox.length + pas.length === 0 && <Vacio texto={t.events.noneInCategory} />}

      {abierto && <EventoModal key={abierto.e.id} evento={abierto.e} onCerrar={cerrar} />}
    </div>
  );
}

/* ── Piezas ───────────────────────────────────────────────────────────────── */

function Rotulo({ texto, cantidad }: { texto: string; cantidad: number }) {
  return (
    <div className="mb-5 flex items-center gap-4">
      <h2 className="text-[11px] font-semibold uppercase tracking-[0.26em] text-gray-400">
        {texto} <span className="ml-1.5 text-gray-600 tabular-nums">{cantidad}</span>
      </h2>
      <div className="h-px flex-1 bg-gradient-to-r from-white/[0.10] to-transparent" />
    </div>
  );
}

function Vacio({ texto }: { texto: string }) {
  return (
    <p className="rounded-card border border-dashed border-white/10 px-6 py-14 text-center text-[14px] text-gray-500">
      {texto}
    </p>
  );
}

/**
 * La marquesina del próximo evento.
 *
 * La fecha no es una pastilla al costado: es tipografía grande, alineada al
 * título, y es lo primero que se lee. Un evento es una fecha antes que un
 * título.
 *
 * El velo es en dos capas —una desde la izquierda y otra desde abajo— y no una
 * sola diagonal: con una sola, el texto se lee sobre fotos claras pero se come
 * la foto entera. Con dos, la esquina superior derecha de la portada queda
 * limpia y la imagen sigue siendo imagen.
 */
function Marquesina({ e, locale, onAbrir }: { e: EventoSitio; locale: string; onAbrir: (e: EventoSitio, f: boolean) => void }) {
  const t = useT();
  const f = fecha(e.inicio, locale);
  const vivo = enCurso(e);
  const color = e.categorias[0] ? CATEGORIA_COLOR[e.categorias[0]] : "#2b6fd4";

  return (
    <article className="group relative overflow-hidden rounded-[26px] border border-white/[0.09] bg-[#05090f]">
      <PortadaEvento e={e} conMarcas={false} prioridad sizes="(min-width: 1280px) 1232px, 100vw" />
      {/* El velo, en tres capas. Con una sola diagonal el título se leía sobre
          fotos oscuras y desaparecía sobre una foto de oficina a pleno sol: la
          horizontal sostiene el texto, la vertical sostiene los botones y el
          velo plano le baja medio punto a toda la foto para que el blanco
          siempre gane. */}
      <div className="absolute inset-0 bg-black/25" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#04070d] via-[#04070d]/85 to-[#04070d]/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#04070d] via-[#04070d]/40 to-transparent" />
      {/* El hilo de color de la solución arriba: la misma firma que usan las
          cards de /recursos, acá encendida siempre porque es el destacado. */}
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
      />

      <div className="relative flex min-h-[430px] flex-col justify-end gap-6 p-7 lg:min-h-[480px] lg:p-11">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white"
            style={{ background: `${color}2e`, border: `1px solid ${color}66` }}
          >
            {t.events.types[e.tipo]} · {t.events.modes[e.modalidad]}
          </span>
          {vivo && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              {t.events.live}
            </span>
          )}
          {e.cupo && (
            <span className="rounded-full border border-white/12 bg-black/40 px-3 py-1 text-[11px] font-medium text-gray-300">
              {t.events.seats} {e.cupo}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:gap-9">
          {/* El lockup de fecha. `tabular-nums` para que 11 y 22 midan lo mismo
              y el bloque no baile entre eventos. */}
          <div className="flex shrink-0 items-end gap-3.5">
            <span className="font-display text-[72px] font-bold leading-[0.78] tracking-[-0.05em] tabular-nums text-white lg:text-[92px]">
              {f.dia}
            </span>
            <div className="pb-1.5">
              <div className="text-[14px] font-bold uppercase tracking-[0.3em] text-accent-300">{f.mes}</div>
              <div className="mt-1.5 text-[12.5px] text-gray-400">{f.hora} h</div>
            </div>
          </div>

          <div className="min-w-0 lg:border-l lg:border-white/[0.12] lg:pl-9">
            <h2 className="font-display text-[30px] font-bold leading-[1.05] tracking-[-0.03em] text-white lg:text-[42px]">
              {e.titulo}
            </h2>
            {e.resumen && (
              <p className="mt-3.5 max-w-[620px] text-[15px] leading-[1.65] text-gray-300 line-clamp-2">{e.resumen}</p>
            )}
            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[13px] text-gray-400">
              <Meta icono={<CalendarDays size={14} />}>{f.larga}</Meta>
              {e.lugar && <Meta icono={<MapPin size={14} />}>{e.lugar}</Meta>}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button
            type="button"
            onClick={() => {
              track({ type: "click", name: "evento_participar", target: e.slug });
              onAbrir(e, true);
            }}
            className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-[14px] font-semibold text-[#05090f] transition-transform hover:-translate-y-0.5"
          >
            {t.events.participate}
            <ArrowUpRight className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onAbrir(e, false)}
            className="inline-flex items-center rounded-full border border-white/20 px-6 py-3 text-[14px] font-medium text-white/85 transition-colors hover:border-white/40 hover:text-white"
          >
            {t.events.details}
          </button>

          {e.marcas.length > 0 && (
            <div className="ml-auto hidden items-center gap-2 lg:flex">
              {e.marcas.slice(0, 4).map((m) => (
                <div key={m.id} title={m.nombre} className="grid h-8 min-w-11 place-items-center rounded-md bg-white/95 px-2.5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={m.logoUrl} alt={m.nombre} loading="lazy" className="max-h-4 max-w-[62px] object-contain" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

function Meta({ icono, children }: { icono: React.ReactNode; children: React.ReactNode }) {
  return (
    <span className="inline-flex min-w-0 items-center gap-1.5">
      <span className="shrink-0 text-accent-300">{icono}</span>
      <span className="truncate">{children}</span>
    </span>
  );
}

/** Un próximo que no es el destacado: portada, fecha encima y lo justo. */
function CardMedia({ e, locale, onAbrir }: { e: EventoSitio; locale: string; onAbrir: (e: EventoSitio, f: boolean) => void }) {
  const t = useT();
  const f = fecha(e.inicio, locale);
  const color = e.categorias[0] ? CATEGORIA_COLOR[e.categorias[0]] : "#2b6fd4";

  return (
    <article
      className="group relative flex cursor-pointer flex-col overflow-hidden rounded-card border border-white/[0.07] bg-white/[0.02] transition duration-300 hover:-translate-y-1 hover:border-white/15 hover:bg-white/[0.04] hover:shadow-[0_24px_70px_-20px_rgba(0,0,0,0.8)]"
      onClick={() => onAbrir(e, false)}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
      />
      <div className="relative aspect-[16/9]">
        <PortadaEvento e={e} sizes="(min-width: 1280px) 610px, (min-width: 768px) 50vw, 100vw" />
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#05090f] to-transparent" />
        {/* La fecha en línea, no en un bloque blanco: el bloque blanco es la
            firma del panel lateral de la portada y acá compite con la foto. */}
        <div className="absolute bottom-3.5 left-4 flex items-baseline gap-2">
          <span className="font-display text-[26px] font-bold leading-none tabular-nums text-white">{f.dia}</span>
          <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-accent-300">{f.mes}</span>
          <span className="text-[11.5px] text-gray-400">{f.hora} h</span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-accent-300">
          {t.events.types[e.tipo]} · {t.events.modes[e.modalidad]}
        </p>
        <h3 className="mt-2 font-display text-[18px] font-bold leading-[1.22] text-white">{e.titulo}</h3>
        {e.resumen && <p className="mt-2.5 line-clamp-2 text-[13.5px] leading-relaxed text-gray-400">{e.resumen}</p>}

        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
          <div className="min-w-0">
            <CategoriaTags categorias={e.categorias} />
          </div>
          <span
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/10 text-gray-400 transition-all duration-300 group-hover:border-white/25 group-hover:bg-white/10 group-hover:text-white"
            aria-hidden="true"
          >
            <ArrowUpRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </article>
  );
}

/**
 * Un realizado.
 *
 * Sin foto y sin botones: lo que queda de un evento que pasó es el registro de
 * que pasó. Mantenerlo como card con portada hacía que la página pareciera
 * tener el doble de agenda de la que tiene.
 */
function FilaRealizada({ e, locale, onAbrir }: { e: EventoSitio; locale: string; onAbrir: (e: EventoSitio, f: boolean) => void }) {
  const t = useT();
  const f = fecha(e.inicio, locale);

  return (
    <li>
      <button
        type="button"
        onClick={() => onAbrir(e, false)}
        className="group flex w-full items-center gap-5 py-4 text-left transition-colors hover:bg-white/[0.02]"
      >
        <span className="w-[74px] shrink-0 text-[12px] uppercase tracking-[0.14em] text-gray-500 tabular-nums">
          {f.dia} {f.mes}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[15px] font-medium text-gray-200 transition-colors group-hover:text-white">
            {e.titulo}
          </span>
          <span className="mt-0.5 block truncate text-[12px] text-gray-500">
            {t.events.types[e.tipo]}
            {e.lugar ? ` · ${e.lugar}` : ""}
          </span>
        </span>
        <span className="hidden shrink-0 items-center gap-1.5 md:flex">
          {e.marcas.slice(0, 3).map((m) => (
            <span key={m.id} className="grid h-6 min-w-9 place-items-center rounded bg-white/85 px-1.5 opacity-60 transition-opacity group-hover:opacity-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={m.logoUrl} alt="" loading="lazy" className="max-h-3.5 max-w-[48px] object-contain" />
            </span>
          ))}
        </span>
        <ArrowUpRight className="h-4 w-4 shrink-0 text-gray-600 transition-colors group-hover:text-white" />
      </button>
    </li>
  );
}
