import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FondoRecursos from "@/components/recursos/FondoRecursos";
import { CardEsqueleto, Pastilla } from "@/components/recursos/Esqueletos";

/**
 * Lo que se ve mientras el hub espera a la base.
 *
 * CUÁNDO APARECE
 *
 * La página tiene ISR de cinco minutos, así que la visita normal sale del CDN
 * y esto no se llega a ver. Se ve en dos momentos: la primera visita después de
 * una revalidación —cuando alguien publica una nota y hay que ir a buscarla— y
 * cada navegación desde el navbar, donde Next muestra este archivo mientras
 * transmite la página. En una conexión de sucursal esos dos casos son un par de
 * segundos de pantalla en blanco sin esto.
 *
 * SIETE CARDS, CON LA PRIMERA ANCHA
 *
 * No sabemos cuántas notas hay hasta que responde la base, pero sí que la
 * grilla arranca con la destacada. Siete es lo que hay hoy y llena las tres
 * filas visibles en un portátil; si sobran, el reemplazo achica la página en
 * vez de agrandarla, que es el lado bueno de equivocarse.
 *
 * El encabezado y el pie son texto fijo y se dibujan de verdad: cambiarlos por
 * barras grises haría parpadear lo único que ya estaba listo para mostrar.
 */
export default function CargandoRecursos() {
  return (
    <main className="relative min-h-screen bg-[#04070d]">
      <FondoRecursos />
      <Navbar />

      <div className="relative z-10">
        {/* Copia literal del encabezado de la página. Es texto fijo: si acá
            estuviera escrito distinto, el reemplazo lo movería de lugar, que
            es exactamente el salto que un esqueleto existe para evitar. */}
        <header className="container-x pb-9 pt-32 lg:pb-11 lg:pt-40">
          <div className="flex items-center gap-3">
            <span className="h-px w-9 bg-gradient-to-r from-accent-300 to-accent-300/10" />
            <p className="text-[10.5px] font-semibold uppercase tracking-[0.3em] text-accent-300">
              Biblioteca técnica
            </p>
          </div>
          <h1 className="mt-5 font-display text-[46px] font-bold leading-[0.95] tracking-[-0.035em] text-white lg:text-[58px]">
            Recursos
          </h1>
          <p className="mt-5 max-w-[560px] text-[15px] leading-[1.7] text-gray-400">
            Qué dice la ley, qué conviene y qué mirar antes de firmar. Escrito por el equipo que
            después lo implementa.
          </p>
          <div className="mt-9 h-px bg-gradient-to-r from-white/[0.14] via-white/[0.05] to-transparent" />
        </header>

        <section className="container-x pb-24">
          {/* Los filtros reales son links de ancho variable: estas seis
              pastillas tienen los anchos que dan "Todo", "Networking", "Firma
              biométrica", "Consultoría", "Ciberseguridad" e "IA & Software". */}
          <div
            className="-mx-4 mb-8 flex flex-wrap items-center gap-2 border-b border-white/[0.06] px-4 py-4"
            aria-hidden="true"
          >
            <Pastilla className="w-20" />
            <Pastilla className="w-32" />
            <Pastilla className="w-44" />
            <Pastilla className="w-32" />
            <Pastilla className="w-40" />
            <Pastilla className="w-36" />
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
            <CardEsqueleto ancha />
            {Array.from({ length: 6 }, (_, i) => (
              <CardEsqueleto key={i} />
            ))}
          </div>

          {/* El esqueleto es decoración: quien usa un lector de pantalla no
              tiene que oír diez divs vacíos, tiene que oír que está cargando. */}
          <p role="status" className="sr-only">
            Cargando recursos…
          </p>
        </section>

        <Footer />
      </div>
    </main>
  );
}
