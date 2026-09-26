"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowUpRight, Search, SearchX, X } from "lucide-react";

import NotaCard from "@/components/blog/NotaCard";
import CardPromo from "@/components/blog/CardPromo";
import { Reveal } from "@/components/Reveal";
import { CATEGORIAS, CATEGORIA_COLOR, CATEGORIA_LABEL, urlDeNota, type NotaSitio } from "@/lib/notas";
import { track } from "@/lib/track";

/**
 * Los filtros y la grilla del hub.
 *
 * POR QUÉ ESTO ES DE CLIENTE Y LA PÁGINA NO
 *
 * Antes el filtro lo resolvía el servidor: `/blog?solucion=seguridad` era
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
 *
 * EL BUSCADOR NO VA AL SERVIDOR
 *
 * Las notas ya están todas acá: buscar es filtrar un array de nueve elementos,
 * no una consulta. Se escribe y la grilla responde en el mismo cuadro, sin
 * spinner y sin red. El día que sean doscientas habrá que paginar, y ahí sí
 * conviene un índice del lado del servidor.
 *
 * Busca sobre título, resumen, etiquetas y nombre de la solución, ignorando
 * tildes y mayúsculas: quien escribe "biometrica" tiene que encontrar la nota
 * de firma biométrica.
 */
/**
 * `useLayoutEffect` en el cliente y `useEffect` en el servidor.
 *
 * Lo necesita la barra de filtros: su estado inicial —pegada o no— hay que
 * decidirlo ANTES de que el navegador pinte. Con `useEffect` se pinta un cuadro
 * con la barra transparente y recién después aparece el fondo, y eso al
 * recargar la página con scroll restaurado se ve como un parpadeo en la barra.
 * `useLayoutEffect` corre antes del pintado, pero en el servidor no existe y
 * React avisa: de ahí el cambio según el entorno.
 */
const useEfectoDeLayout = typeof window === "undefined" ? useEffect : useLayoutEffect;

/** Sin tildes y en minúsculas: "biométrica" y "biometrica" tienen que empatar. */
function normalizar(t: string): string {
  return t
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export default function HubNotas({ todas }: { todas: NotaSitio[] }) {
  const parametro = useSearchParams().get("solucion");
  const filtro = CATEGORIAS.find((c) => c === parametro) ?? null;
  const [busqueda, setBusqueda] = useState("");
  const [abierto, setAbierto] = useState(false);
  const [pegada, setPegada] = useState(false);
  const caja = useRef<HTMLDivElement>(null);
  const centinela = useRef<HTMLDivElement>(null);
  const pantalla = useRef<HTMLDivElement>(null);
  const campoMovil = useRef<HTMLInputElement>(null);
  // La pantalla completa se monta en el <body> con un portal, y eso sólo existe
  // en el cliente: en el servidor no hay dónde montarla.
  //
  // `useSyncExternalStore` y no el `useState` + `useEffect` de siempre: da
  // `false` en el servidor y `true` en el cliente sin escribir estado dentro de
  // un efecto, que es justo lo que dispara un render en cascada. No se suscribe
  // a nada —de ahí la función de baja vacía—, sólo distingue los dos entornos.
  const montado = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  // La barra de filtros sólo pinta su fondo cuando de verdad está pegada
  // arriba. Con el fondo puesto siempre, su rectángulo opaco cortaba en recto
  // el resplandor del buscador: se veía una línea horizontal donde la luz
  // moría de golpe. Un centinela de un píxel arriba de la barra avisa cuándo
  // deja de estar a la vista, que es exactamente cuándo la barra se pega.
  useEfectoDeLayout(() => {
    const marca = centinela.current;
    if (!marca) return;
    // Primero la lectura directa, antes del pintado: si la página se recargó
    // con la barra ya pegada, nace con el fondo puesto en vez de aparecer.
    // Corre una sola vez al montar y escribe el mismo valor que el observer
    // calcularía un cuadro más tarde: sin este renglón, ese cuadro se ve.
    setPegada(marca.getBoundingClientRect().top < 69);
    const obs = new IntersectionObserver(([e]) => setPegada(!e.isIntersecting), {
      rootMargin: "-69px 0px 0px 0px",
    });
    obs.observe(marca);
    return () => obs.disconnect();
  }, []);

  // En teléfono, al abrir: el campo de la pantalla completa toma el foco y la
  // página de atrás deja de scrollear. Al cerrar se devuelven las dos cosas.
  useEffect(() => {
    if (!abierto || !window.matchMedia("(max-width: 639px)").matches) return;
    const anterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const id = window.setTimeout(() => campoMovil.current?.focus(), 120);
    return () => {
      document.body.style.overflow = anterior;
      window.clearTimeout(id);
    };
  }, [abierto]);

  // El desplegable se cierra al tocar fuera y con Escape. Se escucha
  // `pointerdown` y no `click` para que el cierre gane de mano al clic que
  // empieza afuera, y `blur` no sirve: el foco se va ANTES de que el clic
  // llegue a la opción, así que la opción nunca se elegiría.
  useEffect(() => {
    if (!abierto) return;
    const afuera = (e: PointerEvent) => {
      const t = e.target as Node;
      // La pantalla completa de teléfono vive fuera de `caja` —no puede estar
      // adentro: `hero-enter` anima `filter`, y un ancestro con filtro rompe
      // el `position: fixed` de sus descendientes—, así que cuenta aparte.
      if (caja.current?.contains(t) || pantalla.current?.contains(t)) return;
      setAbierto(false);
    };
    const escape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAbierto(false);
    };
    document.addEventListener("pointerdown", afuera);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", afuera);
      document.removeEventListener("keydown", escape);
    };
  }, [abierto]);

  // Todo lo buscable de una nota, junto y normalizado una sola vez.
  const indice = useMemo(
    () =>
      new Map(
        todas.map((n) => [
          n.id,
          normalizar(
            [n.titulo, n.resumen, n.tags.join(" "), n.categoria ? CATEGORIA_LABEL[n.categoria] : ""].join(" ")
          ),
        ])
      ),
    [todas]
  );

  // Las sugerencias salen de las etiquetas que más se repiten, no de una lista
  // escrita a mano: así ninguna sugerencia lleva a cero resultados.
  const sugerencias = useMemo(() => {
    const cuenta = new Map<string, number>();
    for (const n of todas) for (const t of n.tags) cuenta.set(t, (cuenta.get(t) ?? 0) + 1);
    return [...cuenta.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .slice(0, 5)
      .map(([t]) => t);
  }, [todas]);

  const texto = normalizar(busqueda.trim());
  const notas = todas.filter(
    (n) => (!filtro || n.categoria === filtro) && (!texto || (indice.get(n.id) ?? "").includes(texto))
  );

  // Sólo las soluciones que tienen al menos una nota: un filtro que devuelve
  // una lista vacía es una promesa incumplida.
  const conNotas = CATEGORIAS.filter((c) => todas.some((n) => n.categoria === c));

  // La grilla con el llamado a la acción intercalado.
  //
  // Va en la cuarta posición: primera celda de la segunda fila en escritorio,
  // que es donde el ojo vuelve al margen izquierdo después de leer la fila de
  // arriba. Más arriba interrumpe antes de que la persona haya visto lo que
  // vino a ver; al final no lo ve nadie.
  //
  // Dos casos donde no aparece: con menos de cuatro notas sería una de cada
  // cuatro celdas, y durante una búsqueda, porque quien escribió algo puntual
  // está buscando eso y no una oferta.
  const conPromos: ({ tipo: "nota"; nota: NotaSitio } | { tipo: "promo" })[] = notas.map((nota) => ({
    tipo: "nota" as const,
    nota,
  }));
  if (!texto && notas.length >= 4) conPromos.splice(3, 0, { tipo: "promo" });

  return (
    <>
      {/* ── El buscador ────────────────────────────────────────────────────
          Al tocarlo se abre un desplegable: con el campo vacío propone
          búsquedas —salen de las etiquetas que más se repiten, así que ninguna
          lleva a cero resultados—, y con algo escrito muestra las notas que
          coinciden, para ir directo sin pasar por la grilla.

          La grilla se filtra igual mientras se escribe: el desplegable es un
          atajo, no el único camino. */}
      {/* Entran uno detrás de otro, no todos juntos: primero el título (que es
          el LCP y usa `hero-enter`), después el buscador, después los filtros y
          al final las cards. El escalonado es el mismo motor CSS de toda la
          página —un IntersectionObserver compartido y `opacity`/`transform`—,
          así que no agrega JS de animación. */}
      <div
        ref={caja}
        // `z-40` sólo con el desplegable abierto.
        //
        // `hero-enter` anima `opacity` y `filter`, y las dos crean un contexto
        // de apilado: el `z-30` del desplegable queda encerrado acá adentro y
        // pierde contra la barra de filtros (z-20) y contra las cards, que son
        // hermanas posteriores. Subiendo la caja entera cuando se abre, el
        // desplegable vuelve a quedar arriba de todo. Cerrada no lleva z-index,
        // así el resplandor que vive adentro sigue pintando por debajo.
        className={`hero-enter relative mx-auto mb-6 w-full max-w-[620px] ${abierto ? "z-40" : ""}`}
        style={{ "--enter-delay": "0.46s", "--enter-dur": "1.4s" } as React.CSSProperties}
      >
        {/* EL CHARCO DE LUZ, pegado a la caja.
            Va acá y no en el fondo de la página porque tiene que caer sobre la
            caja SIEMPRE: al angostar la ventana el título envuelve en más
            líneas y la caja baja, y una altura escrita a mano quedaba
            desalineada. Anclado al elemento, la sigue sola.

            El centrado va en el contenedor de afuera y la animación en el de
            adentro: si compartieran el mismo `transform`, la animación pisaría
            el centrado. Y el ancho se limita a la ventana para que el
            resplandor no empuje la barra de scroll horizontal. */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2">
          <div
            className="faro-foco h-[330px] w-[min(940px,92vw)] rounded-[50%]"
            style={{ background: "radial-gradient(ellipse at center, rgba(43,111,212,0.26) 0%, rgba(43,111,212,0.12) 45%, transparent 72%)" }}
          />
          {/* El núcleo se centra con márgenes y no con `translate`: el
              `transform` lo usa la animación, y si lo compartieran, el último
              en aplicarse borraría al otro. */}
          <div
            className="faro-foco faro-foco-nucleo absolute left-1/2 top-1/2 h-[190px] w-[min(620px,72vw)] rounded-[50%]"
            style={{
              marginLeft: "max(-310px, -36vw)",
              marginTop: -95,
              background: "radial-gradient(ellipse at center, rgba(43,111,212,0.2) 0%, transparent 70%)",
            }}
          />
        </div>

        <div className="group relative">
          <Search
            size={18}
            className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-gray-500"
            aria-hidden="true"
          />
          <input
            type="search"
            value={busqueda}
            onChange={(e) => {
              setBusqueda(e.target.value);
              setAbierto(true);
            }}
            onFocus={() => setAbierto(true)}
            onClick={() => setAbierto(true)}
            placeholder="Buscar en el blog…"
            aria-label="Buscar en el blog"
            // Un `type="search"` es un textbox y no admite `aria-expanded`: el
            // patrón correcto para un campo con desplegable es `combobox`.
            role="combobox"
            aria-expanded={abierto}
            aria-controls="blog-sugerencias"
            aria-autocomplete="list"
            // El anillo azul de `:focus-visible` que pone globals.css acá no va: un
            // campo de texto matchea `:focus-visible` SIEMPRE, también con el
            // mouse, así que el anillo aparecía con cada clic. Queda un realce
            // mínimo del borde, que se nota si se lo busca pero no grita — y no
            // se puede sacar del todo sin romper la accesibilidad de teclado.
            className="buscador-blog h-[54px] w-full rounded-full border border-white/[0.09] bg-white/[0.03] pl-[52px] pr-12 text-[15px] text-white transition-colors placeholder:text-gray-500 focus:outline-none focus-visible:border-white/25"
          />
          {busqueda && (
            <button
              type="button"
              onClick={() => {
                setBusqueda("");
                setAbierto(false);
              }}
              aria-label="Borrar la búsqueda"
              className="absolute right-4 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full text-gray-500 transition-colors hover:bg-white/10 hover:text-white"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {abierto && (
          <div
            id="blog-sugerencias"
            // De 640 px para arriba. En teléfono el buscador se abre a pantalla
            // completa: ver el bloque al final del componente.
            className="absolute inset-x-0 top-[60px] z-30 hidden overflow-hidden rounded-2xl sm:block border border-white/[0.09] bg-[#080d16]/95 p-2 text-left shadow-[0_28px_70px_-20px_rgba(0,0,0,0.9)] backdrop-blur-xl"
          >
            {!texto ? (
              <>
                <p className="px-3 pb-1.5 pt-2 text-[11px] uppercase tracking-[0.18em] text-gray-600">Buscar por</p>
                {sugerencias.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => {
                      setBusqueda(t);
                      setAbierto(false);
                    }}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-[14px] text-gray-300 transition-colors hover:bg-white/[0.06] hover:text-white"
                  >
                    <Search size={14} className="shrink-0 text-gray-600" />
                    {t}
                  </button>
                ))}
              </>
            ) : notas.length > 0 ? (
              <>
                <p className="px-3 pb-1.5 pt-2 text-[11px] uppercase tracking-[0.18em] text-gray-600">
                  {notas.length === 1 ? "1 nota" : `${notas.length} notas`}
                </p>
                {notas.slice(0, 6).map((n) => (
                  <Link
                    key={n.id}
                    href={urlDeNota(n.slug)}
                    onClick={() => setAbierto(false)}
                    className="group/op flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-white/[0.06]"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[14px] text-gray-200 transition-colors group-hover/op:text-white">
                        {n.titulo}
                      </span>
                      {n.categoria && (
                        <span
                          className="mt-0.5 block text-[11px] uppercase tracking-[0.12em]"
                          style={{ color: CATEGORIA_COLOR[n.categoria] }}
                        >
                          {CATEGORIA_LABEL[n.categoria]}
                        </span>
                      )}
                    </span>
                    <ArrowUpRight size={14} className="mt-1 shrink-0 text-gray-600 transition-colors group-hover/op:text-white" />
                  </Link>
                ))}
              </>
            ) : (
              <p className="px-3 py-4 text-[14px] text-gray-500">Nada coincide con “{busqueda.trim()}”.</p>
            )}
          </div>
        )}
      </div>

      {/* El centinela del `sticky`: un píxel invisible justo arriba de la barra. */}
      <div ref={centinela} aria-hidden="true" className="h-px w-full" />

      {conNotas.length > 1 && (
        // Pegada arriba: con veinte notas, volver a los filtros no puede
        // costar un scroll hasta el principio de la página.
        <nav
          style={{ "--enter-delay": "0.68s", "--enter-dur": "1.4s" } as React.CSSProperties}
          className={`hero-enter sticky top-[68px] z-20 -mx-4 mb-8 flex flex-wrap items-center justify-center gap-2 px-4 py-4 transition-colors duration-300 ${
            pegada ? "border-b border-white/[0.06] bg-[#04070d]/85 backdrop-blur-xl" : "border-b border-transparent"
          }`}
        >
          <Filtro href="/blog" activo={!filtro} label="Todo" cantidad={todas.length} />
          {conNotas.map((c) => (
            <Filtro
              key={c}
              href={`/blog?solucion=${c}`}
              activo={filtro === c}
              label={CATEGORIA_LABEL[c]}
              color={CATEGORIA_COLOR[c]}
              cantidad={todas.filter((n) => n.categoria === c).length}
            />
          ))}
        </nav>
      )}

      {notas.length === 0 ? (
        /* EL VACÍO NO ES UN CALLEJÓN.
           Alguien que buscó algo puntual y no lo encontró acaba de decirnos
           exactamente qué necesita: es la persona más calificada de toda la
           página. Un "no hay resultados" la despide; esto le ofrece las dos
           salidas que tienen sentido —preguntar, o probar otra búsqueda— sin
           fingir que el contenido existe.

           Responsive: los botones se apilan en teléfono y van uno al lado del
           otro desde 640 px; las pastillas envuelven solas. */
        <div className="mx-auto max-w-[560px] px-2 py-14 text-center sm:py-20">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-white/[0.08] bg-white/[0.03]">
            <SearchX size={22} className="text-gray-500" aria-hidden="true" />
          </div>

          <h2 className="mt-6 font-display text-[22px] font-bold leading-snug text-white sm:text-[26px]">
            {texto ? <>Todavía no escribimos sobre esto</> : <>Todavía no hay notas de esta solución</>}
          </h2>

          <p className="mx-auto mt-3 max-w-[460px] text-[14.5px] leading-[1.7] text-gray-400">
            {texto ? (
              <>
                Nada coincide con <span className="text-gray-200">“{busqueda.trim()}”</span>
                {filtro ? <> dentro de {CATEGORIA_LABEL[filtro]}</> : null}. Si es algo que estás evaluando,
                preguntanos directo: contestamos en menos de 24 horas.
              </>
            ) : (
              <>Estamos escribiendo. Mientras tanto, contanos qué estás evaluando y te respondemos en menos de 24 horas.</>
            )}
          </p>

          <div className="mt-7 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <Link
              href="/#contacto"
              onClick={() => track({ type: "click", name: "blog_vacio_consultar", target: busqueda.trim() || filtro || "" })}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-white px-6 text-[14px] font-semibold text-[#05090f] transition-transform hover:-translate-y-0.5"
            >
              Preguntanos
              <ArrowUpRight size={15} />
            </Link>
            {texto ? (
              <button
                type="button"
                onClick={() => setBusqueda("")}
                className="inline-flex h-11 items-center justify-center rounded-full border border-white/15 px-6 text-[14px] font-medium text-white/85 transition-colors hover:border-white/35 hover:text-white"
              >
                Ver todas las notas
              </button>
            ) : (
              <Link
                href="/blog"
                className="inline-flex h-11 items-center justify-center rounded-full border border-white/15 px-6 text-[14px] font-medium text-white/85 transition-colors hover:border-white/35 hover:text-white"
              >
                Ver todas las notas
              </Link>
            )}
          </div>

          {sugerencias.length > 0 && (
            <div className="mt-9 border-t border-white/[0.06] pt-7">
              <p className="text-[11px] uppercase tracking-[0.2em] text-gray-600">O probá con</p>
              <div className="mt-3.5 flex flex-wrap items-center justify-center gap-2">
                {sugerencias.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setBusqueda(t)}
                    className="rounded-full border border-white/[0.07] bg-white/[0.02] px-3.5 py-1.5 text-[13px] text-gray-400 transition-colors hover:border-white/20 hover:text-white"
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        // Todas las cards miden lo mismo.
        //
        // Antes la destacada ocupaba dos columnas y era la única con el alto de
        // la foto libre: la imagen se estiraba para llenar la card y al lado
        // quedaba un hueco de aire entre el resumen y la fecha. Una grilla
        // pareja se lee mejor que una jerarquía que sólo se nota porque algo
        // está deformado.
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {conPromos.map((item, i) =>
            item.tipo === "promo" ? (
              <Reveal key="promo" preset="item" delay={0}>
                <CardPromo categoria={filtro} />
              </Reveal>
            ) : (
              // `Reveal` por card y no por grilla: si el contenedor es más alto
              // que la pantalla, con un grupo las de abajo ya terminaron de
              // animar cuando llegás a ellas. El retraso escalonado es sólo para
              // la primera fila —la que entra con la página—; de ahí en adelante
              // cada card anima cuando aparece.
              <Reveal key={item.nota.id} preset="item" delay={i < 3 ? 0.92 + i * 0.14 : 0}>
                {/* Las tres primeras cargan la portada sin esperar al scroll: son
                    la primera fila en escritorio. */}
                <NotaCard nota={item.nota} arriba={i < 3} />
              </Reveal>
            )
          )}
        </div>
      )}

      {/* ── EL BUSCADOR A PANTALLA COMPLETA (sólo teléfono) ──────────────────
          En 390 px un desplegable de cinco opciones tapa media página y deja el
          teclado encima: no se ve ni lo que se escribe ni lo que se elige. Acá
          el buscador se lleva la pantalla, con su X para cerrar.

          Siempre montado, como el panel de eventos: así la salida también
          anima. Cerrado no recibe clics ni foco (`inert`) y la visibilidad se
          apaga recién cuando terminó de irse.

          VA EN UN PORTAL AL BODY, y no es opcional: el contenido de la página
          vive dentro de un `relative z-10`, que es un contexto de apilado. Un
          `z-80` ahí adentro sigue valiendo 10 contra el resto de la página, así
          que el navbar (z-50) se le montaba encima. */}
      {montado &&
        createPortal(
        <div
          ref={pantalla}
          className="fixed inset-0 z-[80] sm:hidden"
          inert={!abierto}
          aria-hidden={!abierto}
          style={{
            visibility: abierto ? "visible" : "hidden",
            pointerEvents: abierto ? "auto" : "none",
            transition: `visibility 0s linear ${abierto ? 0 : 260}ms`,
          }}
        >
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[#04070d]"
            style={{ opacity: abierto ? 1 : 0, transition: "opacity 260ms ease" }}
          />

          <div
            role="dialog"
            aria-modal="true"
            aria-label="Buscar en el blog"
            className="absolute inset-x-0 top-0 flex h-full flex-col"
            style={{
              opacity: abierto ? 1 : 0,
              transform: abierto ? "translate3d(0, 0, 0)" : "translate3d(0, -14px, 0)",
              transition: `opacity 260ms ease, transform 320ms cubic-bezier(0.22, 1, 0.36, 1)`,
            }}
          >
            <div className="flex items-center gap-2 border-b border-white/[0.08] px-4 py-3">
              <div className="relative flex-1">
                <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" aria-hidden="true" />
                <input
                  ref={campoMovil}
                  type="search"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  placeholder="Buscar en el blog…"
                  aria-label="Buscar en el blog"
                  className="buscador-blog h-12 w-full rounded-full border border-white/[0.09] bg-white/[0.04] pl-11 pr-4 text-[16px] text-white placeholder:text-gray-500 focus:outline-none"
                />
              </div>
              <button
                type="button"
                onClick={() => setAbierto(false)}
                aria-label="Cerrar la búsqueda"
                className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto overscroll-contain px-3 py-3">
              {!texto ? (
                <>
                  <p className="px-3 pb-1 pt-2 text-[11px] uppercase tracking-[0.18em] text-gray-600">Buscar por</p>
                  {sugerencias.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setBusqueda(t)}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-3.5 text-left text-[15px] text-gray-300 active:bg-white/[0.06]"
                    >
                      <Search size={15} className="shrink-0 text-gray-600" />
                      {t}
                    </button>
                  ))}
              </>
            ) : notas.length > 0 ? (
              <>
                <p className="px-3 pb-1 pt-2 text-[11px] uppercase tracking-[0.18em] text-gray-600">
                  {notas.length === 1 ? "1 nota" : `${notas.length} notas`}
                </p>
                {notas.map((n) => (
                  <Link
                    key={n.id}
                    href={urlDeNota(n.slug)}
                    onClick={() => setAbierto(false)}
                    className="flex items-start gap-3 rounded-xl px-3 py-3.5 active:bg-white/[0.06]"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block text-[15px] leading-snug text-gray-100">{n.titulo}</span>
                      {n.categoria && (
                        <span
                          className="mt-1 block text-[11px] uppercase tracking-[0.12em]"
                          style={{ color: CATEGORIA_COLOR[n.categoria] }}
                        >
                          {CATEGORIA_LABEL[n.categoria]}
                        </span>
                      )}
                    </span>
                    <ArrowUpRight size={15} className="mt-1 shrink-0 text-gray-600" />
                  </Link>
                ))}
              </>
            ) : (
              <p className="px-3 py-6 text-[15px] text-gray-500">Nada coincide con “{busqueda.trim()}”.</p>
            )}
          </div>
        </div>
      </div>,
          document.body
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
