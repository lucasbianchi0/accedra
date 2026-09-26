import { Suspense } from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JsonLd from "@/components/seo/JsonLd";
import HubNotas from "@/components/recursos/HubNotas";
import { leerNotasPublicadas } from "@/lib/notas-server";
import { breadcrumbLd, listaDeNotasLd } from "@/lib/seo/jsonLd";
import { ORG, abs } from "@/lib/seo/site";

/**
 * El hub de contenido: /recursos.
 *
 * Las notas se escriben en el backoffice y se leen de la base con ISR de cinco
 * minutos: publicar una nota no necesita un deploy, y el hub se sigue sirviendo
 * desde el CDN.
 *
 * ES MÁS OSCURO QUE EL RESTO DEL SITIO, A PROPÓSITO
 *
 * Las otras páginas venden: el fondo lleva las lámparas azules de
 * `AmbientLight` y el contenido flota sobre esa luz. Acá el contenido son
 * portadas de colores distintos —una por solución— y cada una compite con el
 * fondo. Sobre casi negro las cinco conviven; sobre el navy iluminado, la
 * violeta y la cian se ensucian. Es la misma razón por la que una galería se
 * pinta de gris oscuro y no de azul.
 *
 * SIN NOTAS, LA SECCIÓN NO EXISTE
 *
 * Igual que con los eventos: esta dirección redirige a la portada en vez de
 * mostrar una página vacía. Un hub vacío indexado es peor que no tenerlo.
 *
 * LA PÁGINA ES ESTÁTICA Y EL FILTRO NO
 *
 * Acá se leía `searchParams` para resolver `?solucion=` en el servidor, y eso
 * volvía dinámica la página entera: no se prerenderizaba, y cada visita se
 * renderizaba de nuevo contra Supabase (250 ms de TTFB medidos en el build de
 * producción, contra 2 ms de una página estática del mismo sitio). El
 * `revalidate` no alcanzaba: cachea lo que se prerenderiza, y esto no se
 * prerenderizaba.
 *
 * Ahora la página no mira la query —la mira `HubNotas`, del lado del cliente—
 * y vuelve a ser estática con ISR de cinco minutos. El HTML que se sirve y el
 * que indexa Google es el del hub completo, sin filtrar; `?solucion=` recorta
 * al hidratar.
 *
 * Por eso tampoco hace falta el `noindex` que llevaban las vistas filtradas:
 * `?solucion=x` ya no es otra página flaca, es la misma página con un canonical
 * a /recursos.
 */

export const revalidate = 300;

const DESCRIPCION =
  "Guías y notas sobre firma biométrica, infraestructura y ciberseguridad en Argentina: qué dice la ley, qué conviene y qué mirar antes de decidir.";

export const metadata: Metadata = {
  title: "Recursos",
  description: DESCRIPCION,
  alternates: { canonical: "/recursos" },
  openGraph: {
    type: "website",
    url: "/recursos",
    title: `Recursos · ${ORG.shortName}`,
    description: DESCRIPCION,
  },
};

export default async function RecursosPage() {
  const todas = await leerNotasPublicadas();
  if (todas.length === 0) redirect("/");

  return (
    <main className="relative min-h-screen bg-[#04070d]">
      {/* El clima de la página, en dos capas y nada más: un amanecer azul
          detrás del título y la trama de puntos de marca. No se usa
          `AmbientLight` acá — sus siete lámparas están calibradas para una
          página de venta larga y acá levantarían el fondo justo lo que esta
          página necesita bajar. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[620px] overflow-hidden" aria-hidden="true">
        <div
          className="absolute -top-[420px] left-1/2 h-[820px] w-[1400px] -translate-x-1/2"
          style={{ background: "radial-gradient(ellipse at center, rgba(43,111,212,0.20) 0%, transparent 68%)" }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(rgba(255,255,255,0.045) 1px, transparent 1px)",
            backgroundSize: "34px 34px",
            maskImage: "radial-gradient(ellipse 65% 60% at 50% 22%, #000 5%, transparent 78%)",
            WebkitMaskImage: "radial-gradient(ellipse 65% 60% at 50% 22%, #000 5%, transparent 78%)",
          }}
        />
      </div>

      <Navbar />

      <JsonLd
        data={[
          breadcrumbLd([
            { name: "Inicio", path: "/" },
            { name: "Recursos", path: "/recursos" },
          ]),
          listaDeNotasLd(todas.map((n) => ({ titulo: n.titulo, url: abs(`/recursos/${n.slug}`) }))),
        ].filter(Boolean)}
      />

      <div className="relative z-10">
        {/* NO ES UNA PORTADA, ES UN ENCABEZADO
            El hub no es una landing: quien entra ya sabe a qué vino y lo que
            busca son las notas, así que media pantalla de título antes de la
            primera card es una aduana. Pero un h1 suelto arriba de los filtros
            tampoco: sin jerarquía ni aire, la página empieza como una tabla.
            Queda un encabezado editorial —filete, volanta, título en la
            display y una regla que cierra— que ocupa un cuarto de pantalla y
            deja las primeras cards sobre el pliegue. */}
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
          {/* La bajada va DEBAJO del título, no al costado. En una columna
              aparte compite con el título por la primera mirada y deja el
              encabezado partido en dos bloques que no se leen en orden; abajo
              es lo que es: la segunda línea de una misma idea. */}
          <p className="mt-5 max-w-[560px] text-[15px] leading-[1.7] text-gray-400">
            Qué dice la ley, qué conviene y qué mirar antes de firmar. Escrito por el equipo que
            después lo implementa.
          </p>
          {/* La regla se apaga hacia la derecha en vez de cortar en seco: es el
              mismo recurso que la máscara del fondo, a escala de un filete. */}
          <div className="mt-9 h-px bg-gradient-to-r from-white/[0.14] via-white/[0.05] to-transparent" />
        </header>

        <section className="container-x pb-24">
          {/* `useSearchParams` (el filtro) necesita un límite de Suspense para
              que el resto de la página se pueda prerenderizar. El fallback no
              dibuja nada: lo de adentro se renderiza en el servidor igual, sin
              filtro, que es exactamente el hub completo. */}
          <Suspense>
            <HubNotas todas={todas} />
          </Suspense>
        </section>

        <Footer />
      </div>
    </main>
  );
}
