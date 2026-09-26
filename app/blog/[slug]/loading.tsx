import Link from "next/link";
import { ChevronRight } from "lucide-react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FaroBlog from "@/components/blog/FaroBlog";
import { Barra, MiniEsqueleto, ParrafoEsqueleto } from "@/components/blog/Esqueletos";

/**
 * Lo que se ve mientras una nota espera a la base.
 *
 * Copia el esqueleto de la nota real hasta en el `marginRight` negativo de la
 * grilla: si el esqueleto usara el ancho común del sitio, al llegar el
 * contenido la columna derecha saltaría 86 px hacia afuera. El comentario de
 * por qué ese margen existe está en la página; acá sólo hay que mantenerlo
 * igual.
 *
 * NO HAY TÍTULO GRIS DE UNA SOLA LÍNEA
 *
 * Los títulos de las notas van de una a tres líneas y el h1 mide 34 px en
 * mobile y 46 en desktop. Dos barras a esa altura es lo que más se parece al
 * caso común, y de paso evita el salto más grande de la página: el que
 * empuja la portada hacia abajo cuando el título resulta más largo.
 *
 * Las migas son las dos primeras del breadcrumb real —Inicio y Blog, que
 * no dependen de la nota— y se dibujan de verdad. La tercera, que es el
 * título, es la única que espera.
 */
export default function CargandoNota() {
  return (
    <main className="relative min-h-screen bg-[#04070d]">
      <FaroBlog />
      <Navbar />

      <div className="relative z-10">
        <div className="container-x pb-20 pt-28 lg:pb-28 lg:pt-36">
          <div
            className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_420px] lg:gap-12"
            style={{ marginRight: "calc(-1 * max(0px, (100vw - 1320px) / 2))" }}
          >
            <div className="min-w-0 max-w-[760px]">
              <nav className="mb-6 flex flex-wrap items-center gap-1.5 text-[12px] text-gray-500">
                <Link href="/" className="transition-colors hover:text-gray-300">
                  Inicio
                </Link>
                <ChevronRight className="h-3 w-3" />
                <Link href="/blog" className="transition-colors hover:text-gray-300">
                  Blog
                </Link>
              </nav>

              <div aria-hidden="true">
                {/* Volanta (GUÍA / NOTA / CASO) */}
                <Barra className="h-2.5 w-16" />

                {/* Título: 34 px en mobile, 46 en desktop, dos renglones. */}
                <Barra className="mt-5 h-8 w-[92%] md:h-11" />
                <Barra className="mt-3 h-8 w-[64%] md:h-11" />

                {/* Autor · cargo · fecha · minutos, todo en una línea. */}
                <Barra className="mt-6 h-3 w-[70%] sm:w-[58%]" />

                {/* La portada, con el mismo 16/9 y el mismo borde. */}
                <div className="esqueleto mt-9 aspect-[16/9] w-full rounded-card border border-white/[0.07]" />

                {/* El bloque de respuesta directa: filete de color al costado. */}
                <div className="mt-9 rounded-card border border-white/10 bg-white/[0.04] p-6">
                  <Barra className="h-4 w-full" />
                  <Barra className="mt-3 h-4 w-full" />
                  <Barra className="mt-3 h-4 w-[72%]" />
                </div>

                {/* El índice "En esta nota": cuatro entradas. */}
                <div className="mt-9 rounded-card border border-white/10 bg-white/[0.02] p-6">
                  <Barra className="h-2.5 w-28" />
                  <div className="mt-4 space-y-3">
                    {["w-[78%]", "w-[64%]", "w-[71%]", "w-[58%]"].map((w) => (
                      <Barra key={w} className={`h-3.5 ${w}`} />
                    ))}
                  </div>
                </div>

                {/* El cuerpo: dos secciones con su encabezado. */}
                <div className="mt-11 space-y-9">
                  <div>
                    <Barra className="h-6 w-[58%]" />
                    <ParrafoEsqueleto className="mt-5" />
                  </div>
                  <div>
                    <Barra className="h-6 w-[45%]" />
                    <ParrafoEsqueleto className="mt-5" />
                  </div>
                </div>
              </div>
            </div>

            <aside className="min-w-0" aria-hidden="true">
              <div className="lg:sticky lg:top-[100px]">
                <div className="rounded-card border border-white/[0.07] bg-white/[0.02] p-6">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-500">
                    Seguir leyendo
                  </p>
                  <div className="mt-1 divide-y divide-white/[0.06]">
                    {Array.from({ length: 4 }, (_, i) => (
                      <MiniEsqueleto key={i} />
                    ))}
                  </div>
                  <Barra className="mt-4 h-3.5 w-40" />
                </div>
              </div>
            </aside>
          </div>

          <p role="status" className="sr-only">
            Cargando la nota…
          </p>
        </div>

        <Footer />
      </div>
    </main>
  );
}
