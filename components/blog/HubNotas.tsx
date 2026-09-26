"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

import NotaCard from "@/components/recursos/NotaCard";
import { CATEGORIAS, CATEGORIA_COLOR, CATEGORIA_LABEL, type NotaSitio } from "@/lib/notas";

/**
 * Los filtros y la grilla del hub.
 *
 * POR QUÉ ESTO ES DE CLIENTE Y LA PÁGINA NO
 *
 * Antes el filtro lo resolvía el servidor: `/recursos?solucion=seguridad` era
 * otra ejecución de la página. Eso obligaba a la página a leer `searchParams`,
 * y una página que lee `searchParams` en Next es dinámica: NO se prerenderiza,
 * y cada visita —filtrada o no— se renderizaba de nuevo contra Supabase. Medido
 * en el build de producción: 250 ms de TTFB por visita, contra 2 ms de una
 * página estática del mismo sitio. El `revalidate = 300` no lo evitaba; el
 * revalidate cachea la página que se prerenderiza, y ésta no se prerenderizaba.
 *
 * Con el filtro acá, la página vuelve a ser estática con ISR: el HTML sale del
 * caché y Supabase se consulta una vez cada cinco minutos, no una vez por
 * visitante.
 *
 * EL HTML SIGUE TRAYENDO TODAS LAS NOTAS
 *
 * Esto se renderiza también en el servidor: lo que cambia es quién decide qué
 * se ve, no quién dibuja. El primer HTML es el del hub sin filtrar —todas las
 * notas, que es justo lo que tiene que indexar Google— y el filtro se aplica al
 * hidratar. Sin JavaScript se ven todas: se pierde el recorte, no el contenido.
 *
 * LOS FILTROS SIGUEN SIENDO LINKS
 *
 * Se pueden abrir en otra pestaña y se comparten. Lo que cambió es que ya no
 * viajan al servidor a buscar la misma lista recortada.
 */
export default function HubNotas({ todas }: { todas: NotaSitio[] }) {
  const parametro = useSearchParams().get("solucion");
  const filtro = CATEGORIAS.find((c) => c === parametro) ?? null;

  const notas = filtro ? todas.filter((n) => n.categoria === filtro) : todas;

  // La destacada se dibuja ancha sólo cuando hay suficientes notas como para
  // que la fila de abajo se complete: con dos o tres, una card de doble ancho
  // deja un hueco al lado en vez de crear jerarquía. Y dentro de un filtro no
  // se destaca nada — la destacada es la del hub, no la de cada solución.
  const destacada = !filtro && notas.length >= 4 ? notas.find((n) => n.destacada) ?? null : null;

  // Sólo las soluciones que tienen al menos una nota: un filtro que devuelve
  // una lista vacía es una promesa incumplida.
  const conNotas = CATEGORIAS.filter((c) => todas.some((n) => n.categoria === c));

  return (
    <>
      {conNotas.length > 1 && (
        // Pegada arriba: con veinte notas, volver a los filtros no puede
        // costar un scroll hasta el principio de la página.
        <nav className="sticky top-[68px] z-20 -mx-4 mb-8 flex flex-wrap items-center gap-2 border-b border-white/[0.06] bg-[#04070d]/85 px-4 py-4 backdrop-blur-xl">
          <Filtro href="/recursos" activo={!filtro} label="Todo" cantidad={todas.length} />
          {conNotas.map((c) => (
            <Filtro
              key={c}
              href={`/recursos?solucion=${c}`}
              activo={filtro === c}
              label={CATEGORIA_LABEL[c]}
              color={CATEGORIA_COLOR[c]}
              cantidad={todas.filter((n) => n.categoria === c).length}
            />
          ))}
        </nav>
      )}

      {notas.length === 0 ? (
        <p className="py-16 text-center text-[15px] text-gray-400">
          Todavía no hay notas de esta solución.{" "}
          <Link href="/recursos" className="text-accent-300 underline underline-offset-4">
            Ver todas
          </Link>
          .
        </p>
      ) : (
        // Una sola grilla para todo: la destacada es una card más que ocupa
        // dos columnas, no una fila aparte. Con una nota, con cuatro o con
        // cuarenta, el hub nunca queda descalzado.
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {notas.map((n, i) => (
            // Las tres primeras cargan sin esperar al scroll: son la primera
            // fila en escritorio y una de ellas es el LCP. De la cuarta en
            // adelante manda el lazy del navegador — precargar veinte portadas
            // para que se vean tres es pagar la página entera de una.
            <NotaCard key={n.id} nota={n} ancha={n.id === destacada?.id} arriba={i < 3} />
          ))}
        </div>
      )}
    </>
  );
}

function Filtro({
  href,
  label,
  activo,
  color,
  cantidad,
}: {
  href: string;
  label: string;
  activo: boolean;
  color?: string;
  cantidad: number;
}) {
  return (
    <Link
      href={href}
      // `scroll={false}`: el filtro vive pegado arriba de la grilla y la
      // navegación es dentro de la misma página; saltar al tope en cada clic
      // deja al visitante mirando el encabezado que ya leyó.
      scroll={false}
      className={`inline-flex h-9 items-center gap-2 rounded-full border px-4 text-[13px] font-medium transition-colors ${
        activo
          ? "border-white/20 bg-white/[0.09] text-white"
          : "border-white/[0.07] bg-white/[0.02] text-gray-400 hover:border-white/15 hover:text-gray-200"
      }`}
    >
      {color && (
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{ background: color, boxShadow: activo ? `0 0 8px ${color}` : undefined }}
        />
      )}
      {label}
      <span className={activo ? "text-gray-400" : "text-gray-600"}>{cantidad}</span>
    </Link>
  );
}
