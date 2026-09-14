"use client";

import { useState } from "react";
import { ArrowRight, CalendarDays, Clock, MapPin } from "lucide-react";

import EventoModal from "@/components/EventoModal";
import { BloqueFecha, CategoriaTags, FiltroCategorias, LOCALE, Portada, categoriasPresentes, fecha } from "@/components/EventosPiezas";
import { Reveal } from "@/components/Reveal";
import { useT } from "@/lib/i18n/useT";
import { useLang } from "@/lib/i18n/LangProvider";
import { enCurso, type Categoria, type EventoSitio } from "@/lib/eventos";
import { track } from "@/lib/track";

type AbrirDetalle = (e: EventoSitio, conFormulario: boolean) => void;

/**
 * La lista de eventos de la página /eventos: una card horizontal y compacta por
 * evento, primero los próximos y después los realizados, con el filtro por
 * categoría arriba.
 *
 * Los eventos no tienen página propia: "Ver detalle" y "Participar" abren el
 * popup del evento (EventoModal), que muestra la información completa y el mail
 * para anotarse.
 *
 * `eventoInicial` es el slug de `?evento=`: los links compartidos —y la vieja
 * dirección /eventos/<slug>, que redirige acá— abren directo ese popup.
 */
export function EventosVista({
  proximos,
  pasados,
  eventoInicial,
}: {
  proximos: EventoSitio[];
  pasados: EventoSitio[];
  eventoInicial?: string;
}) {
  const t = useT();
  const { lang } = useLang();
  const locale = LOCALE[lang] ?? "es-AR";
  const [categoria, setCategoria] = useState<Categoria | null>(null);
  const [detalle, setDetalle] = useState<{ e: EventoSitio; form: boolean } | null>(() => {
    const e = [...proximos, ...pasados].find((x) => x.slug === eventoInicial);
    return e ? { e, form: false } : null;
  });

  const abrir: AbrirDetalle = (e, form) => setDetalle({ e, form });

  // El filtro ofrece sólo las categorías que tienen algún evento: un botón que
  // lleva a una lista vacía es un callejón.
  const disponibles = categoriasPresentes([...proximos, ...pasados]);
  const filtrar = (lista: EventoSitio[]) => (categoria ? lista.filter((e) => e.categorias.includes(categoria)) : lista);
  const prox = filtrar(proximos);
  const pas = filtrar(pasados);

  return (
    <div className="mx-auto max-w-3xl">
      {disponibles.length > 1 && (
        <div className="mb-8">
          <FiltroCategorias disponibles={disponibles} activa={categoria} onChange={setCategoria} />
        </div>
      )}

      <div className="space-y-10">
        {prox.length > 0 && (
          <Grupo titulo={t.events.upcoming} cantidad={prox.length}>
            {prox.map((e) => (
              <Reveal key={e.id} preset="item">
                <CardHorizontal e={e} locale={locale} realizado={false} onAbrir={abrir} />
              </Reveal>
            ))}
          </Grupo>
        )}

        {pas.length > 0 && (
          <Grupo titulo={t.events.past} cantidad={pas.length}>
            {pas.map((e) => (
              <Reveal key={e.id} preset="item">
                <CardHorizontal e={e} locale={locale} realizado onAbrir={abrir} />
              </Reveal>
            ))}
          </Grupo>
        )}

        {prox.length + pas.length === 0 && (
          <p className="rounded-card border border-dashed border-white/15 px-6 py-10 text-center text-[14px] text-[#9FB0C7]">
            {t.events.noneInCategory}
          </p>
        )}
      </div>

      {/* Se monta al abrir y se desmonta al cerrar: el `key` hace que cada evento
          arranque con el formulario limpio. */}
      {detalle && (
        <EventoModal key={detalle.e.id} evento={detalle.e} onCerrar={() => setDetalle(null)} />
      )}
    </div>
  );
}

/* ── Partes ───────────────────────────────────────────────────────────────── */

function Grupo({ titulo, cantidad, children }: { titulo: string; cantidad: number; children: React.ReactNode }) {
  return (
    <section>
      <div className="mb-4 flex items-center gap-4">
        <h2 className="text-[13px] font-semibold uppercase tracking-[0.2em] text-[#7FB3F8]">
          {titulo} <span className="ml-1 text-white/40">{cantidad}</span>
        </h2>
        <div className="h-px flex-1" style={{ background: "linear-gradient(90deg, rgba(255,255,255,0.14), transparent)" }} />
      </div>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function CardHorizontal({
  e,
  locale,
  realizado,
  onAbrir,
}: {
  e: EventoSitio;
  locale: string;
  realizado: boolean;
  onAbrir: AbrirDetalle;
}) {
  const t = useT();
  const f = fecha(e.inicio, locale);
  const vivo = !realizado && enCurso(e);

  return (
    <article
      className="group relative flex flex-col overflow-hidden rounded-card border border-white/[0.12] transition-colors duration-300 hover:border-white/[0.22] sm:flex-row"
      style={{
        background: "linear-gradient(120deg, #1B2D49 0%, #13223A 55%, #0F1D31 100%)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12), 0 18px 44px rgba(0,0,0,0.4)",
      }}
    >
      {/* Foto con la fecha */}
      <button
        type="button"
        onClick={() => onAbrir(e, false)}
        aria-label={`${t.events.details}: ${e.titulo}`}
        className="relative block aspect-[16/8] flex-shrink-0 cursor-pointer sm:aspect-auto sm:w-[190px]"
      >
        <Portada
          e={e}
          className={`absolute inset-0 ${realizado ? "opacity-70 saturate-50 transition-all duration-500 group-hover:opacity-100 group-hover:saturate-100" : ""}`}
        />
        <div className="absolute bottom-3 left-3">
          <BloqueFecha iso={e.inicio} locale={locale} />
        </div>
      </button>

      {/* Qué, cuándo, dónde y los botones */}
      <div className="flex min-w-0 flex-1 flex-col gap-3 p-4 sm:flex-row sm:items-center sm:gap-5 sm:py-3.5">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 text-[10.5px] font-semibold uppercase tracking-wider">
            <span className="text-[#7FB3F8]">
              {t.events.types[e.tipo]} · {t.events.modes[e.modalidad]}
            </span>
            {vivo && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/15 px-2 py-0.5 text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                {t.events.live}
              </span>
            )}
            {realizado && <span className="rounded-full bg-white/10 px-2 py-0.5 text-white/60">{t.events.done}</span>}
          </div>

          {e.categorias.length + e.tags.length > 0 && (
            <div className="mt-2">
              <CategoriaTags categorias={e.categorias} tags={e.tags} />
            </div>
          )}

          <h3 className="mt-1.5 text-[16px] font-bold leading-snug text-white">
            <button type="button" onClick={() => onAbrir(e, false)} className="text-left transition-colors hover:text-blue-100">
              {e.titulo}
            </button>
          </h3>

          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12.5px] text-[#C9D6E8]">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays size={14} className="text-[#7FB3F8]" />
              {f.larga}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock size={14} className="text-[#7FB3F8]" />
              {f.hora} h
            </span>
            {e.lugar && (
              <span className="inline-flex min-w-0 items-center gap-1.5">
                <MapPin size={14} className="flex-shrink-0 text-[#7FB3F8]" />
                <span className="truncate">{e.lugar}</span>
              </span>
            )}
          </div>

          {e.marcas.length > 0 && (
            <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
              {e.marcas.slice(0, 4).map((m) => (
                <div key={m.id} title={m.nombre} className="grid h-7 min-w-10 place-items-center rounded-md bg-white px-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={m.logoUrl} alt={m.nombre} loading="lazy" className="max-h-4 max-w-[60px] object-contain" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-shrink-0 items-center gap-2 sm:flex-col sm:items-stretch">
          {!realizado && (
            <button
              type="button"
              onClick={() => {
                track({ type: "click", name: "evento_participar", target: e.slug });
                onAbrir(e, true);
              }}
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full px-4 py-2 text-[13px] font-semibold text-white transition-transform hover:-translate-y-0.5 sm:flex-none"
              style={{ background: "#2560BC", boxShadow: "0 8px 24px rgba(43,111,212,0.4)" }}
            >
              {t.events.participate}
              <ArrowRight size={15} />
            </button>
          )}
          <button
            type="button"
            onClick={() => onAbrir(e, false)}
            className="inline-flex items-center justify-center rounded-full border border-white/15 px-4 py-2 text-[12.5px] font-medium text-white/85 transition-colors hover:border-white/30 hover:text-white"
          >
            {t.events.details}
          </button>
        </div>
      </div>
    </article>
  );
}
