"use client";

/**
 * Las piezas de los eventos que comparten la lista de /eventos, la pestaña
 * lateral de la portada y el popup de detalle: fecha, portada, tags de
 * categoría y el filtro.
 *
 * Viven aparte para que esos tres componentes no se importen entre sí: la lista
 * y la pestaña abren el popup, y el popup usa estas piezas. Si estuvieran dentro
 * de la lista, lista y popup quedarían en un import circular.
 */

import Image from "next/image";

import { useT } from "@/lib/i18n/useT";
import { CATEGORIAS, CATEGORIA_COLOR, ZONA, type Categoria, type EventoSitio } from "@/lib/eventos";

export const LOCALE = { es: "es-AR", en: "en-US", pt: "pt-BR" } as const;

/** Las categorías que aparecen en estos eventos, en el orden canónico. */
export function categoriasPresentes(eventos: EventoSitio[]): Categoria[] {
  return CATEGORIAS.filter((c) => eventos.some((e) => e.categorias.includes(c)));
}

/**
 * Los botones de filtro: "Todas" y una pastilla por categoría, con el color de
 * su solución. La activa se rellena con ese color.
 */
export function FiltroCategorias({
  disponibles,
  activa,
  onChange,
}: {
  disponibles: Categoria[];
  activa: Categoria | null;
  onChange: (c: Categoria | null) => void;
}) {
  const t = useT();
  const base = "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12.5px] font-medium transition-colors";
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label={t.events.all}>
      <button
        type="button"
        onClick={() => onChange(null)}
        aria-pressed={activa === null}
        className={`${base} ${activa === null ? "border-white bg-white text-[#0A1424]" : "border-white/15 bg-white/[0.03] text-white/75 hover:border-white/30 hover:text-white"}`}
      >
        {t.events.all}
      </button>
      {disponibles.map((c) => {
        const on = activa === c;
        return (
          <button
            key={c}
            type="button"
            onClick={() => onChange(on ? null : c)}
            aria-pressed={on}
            className={`${base} ${on ? "text-white" : "border-white/15 bg-white/[0.03] text-white/75 hover:border-white/30 hover:text-white"}`}
            style={on ? { background: CATEGORIA_COLOR[c], borderColor: CATEGORIA_COLOR[c] } : undefined}
          >
            {!on && <span className="h-2 w-2 rounded-full" style={{ background: CATEGORIA_COLOR[c] }} />}
            {t.events.categories[c]}
          </button>
        );
      })}
    </div>
  );
}

/**
 * Las etiquetas de un evento: primero las categorías, con el color de su
 * solución, y después los tags libres que se cargaron en el backoffice, en
 * neutro. Las categorías agrupan y filtran; los tags cuentan de qué se trata.
 */
export function CategoriaTags({ categorias, tags = [] }: { categorias: Categoria[]; tags?: string[] }) {
  const t = useT();
  if (categorias.length === 0 && tags.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {categorias.map((c) => (
        <span
          key={c}
          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium text-[#E3ECF9]"
          style={{ background: `${CATEGORIA_COLOR[c]}24`, border: `1px solid ${CATEGORIA_COLOR[c]}55` }}
        >
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: CATEGORIA_COLOR[c] }} />
          {t.events.categories[c]}
        </span>
      ))}
      {tags.slice(0, 4).map((tag) => (
        <span
          key={`tag-${tag}`}
          className="inline-flex items-center rounded-full border border-white/[0.12] bg-white/[0.05] px-2.5 py-0.5 text-[11px] text-[#C9D6E8]"
        >
          #{tag}
        </span>
      ))}
    </div>
  );
}

/** Sólo la primera letra: `capitalize` de CSS pone "24 De Septiembre". */
function mayuscula(t: string) {
  return t.charAt(0).toUpperCase() + t.slice(1);
}

export function fecha(iso: string, locale: string) {
  const d = new Date(iso);
  return {
    dia: d.toLocaleDateString(locale, { day: "2-digit", timeZone: ZONA }),
    mes: d.toLocaleDateString(locale, { month: "short", timeZone: ZONA }).replace(".", ""),
    larga: mayuscula(d.toLocaleDateString(locale, { weekday: "long", day: "numeric", month: "long", timeZone: ZONA })),
    // 24 horas siempre: "18:00 h", no "06:00 p. m. h".
    hora: d.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: ZONA }),
  };
}

export function BloqueFecha({ iso, locale, grande }: { iso: string; locale: string; grande?: boolean }) {
  const f = fecha(iso, locale);
  return (
    <div
      className={`rounded-2xl bg-white text-center leading-none text-[#0A1424] shadow-[0_14px_34px_rgba(0,0,0,0.35)] ${grande ? "px-4 py-3" : "px-3 py-2"}`}
    >
      <div className={`font-display font-bold tabular-nums ${grande ? "text-[30px]" : "text-[21px]"}`}>{f.dia}</div>
      <div className={`mt-1 font-semibold uppercase tracking-[0.14em] text-[#2560BC] ${grande ? "text-[11px]" : "text-[10px]"}`}>{f.mes}</div>
    </div>
  );
}

/**
 * La portada de un evento donde todavía se usa la foto tal como la subió el
 * backoffice: el popup y la pestaña de la portada.
 *
 * `sizes` NO ES OPCIONAL DE VERDAD
 *
 * Es cuánto mide la imagen en pantalla, y es lo único que le permite al
 * navegador elegir del `srcset`. Sin el dato asume que ocupa el ancho de la
 * ventana y se baja la versión más grande que exista: en la pestaña lateral,
 * donde la portada mide 150 px, eso era bajarse un archivo diez veces más
 * grande que el que se ve.
 *
 * Antes acá había una URL de `/_next/image` escrita a mano con un ancho fijo.
 * Funcionaba, pero servía el mismo archivo a un teléfono y a un monitor 4K, y
 * el ancho tenía que ser uno de los declarados en next.config: cualquier otro
 * devuelve 400 y deja la portada en negro.
 */
export function Portada({
  e,
  className,
  sizes = "100vw",
  /** Arriba del pliegue: se baja con la página, sin esperar al scroll. */
  yaMismo = false,
}: {
  e: EventoSitio;
  className?: string;
  sizes?: string;
  yaMismo?: boolean;
}) {
  return (
    <div
      // Sin className la portada fluye en su contenedor; con className (siempre
      // `absolute inset-0`) no puede llevar además `relative`: gana la última
      // regla de Tailwind y la caja queda con alto cero.
      className={`overflow-hidden ${className ?? "relative"}`}
      style={{ background: "linear-gradient(128deg, #0B2466 0%, #1640A0 45%, #2F79E0 100%)" }}
    >
      {e.portadaUrl ? (
        <Image
          src={e.portadaUrl}
          alt=""
          fill
          sizes={sizes}
          loading={yaMismo ? "eager" : "lazy"}
          className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
        />
      ) : (
        // Sin portada, la trama de marca: puntos que se disuelven y los logos del
        // evento como protagonistas.
        <>
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: "radial-gradient(rgba(255,255,255,0.7) 1px, transparent 1px)",
              backgroundSize: "20px 20px",
              maskImage: "radial-gradient(circle at 80% 20%, #000, transparent 70%)",
              WebkitMaskImage: "radial-gradient(circle at 80% 20%, #000, transparent 70%)",
            }}
          />
          {e.marcas.length > 0 && (
            // Placas chicas: la foto de las cards horizontales mide 240 px y
            // tres logos a tamaño completo se cortaban contra el borde.
            <div className="absolute inset-0 flex items-center justify-center gap-1.5 px-3 pb-10">
              {e.marcas.slice(0, 3).map((m) => (
                <div key={m.id} className="grid h-10 min-w-0 place-items-center rounded-lg bg-white px-2 shadow-[0_10px_26px_rgba(0,0,0,0.35)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={m.logoUrl} alt="" className="max-h-5 max-w-[58px] object-contain" />
                </div>
              ))}
            </div>
          )}
        </>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0C1826]/85 via-[#0C1826]/10 to-transparent" />
    </div>
  );
}
