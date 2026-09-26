import { Suspense } from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import JsonLd from "@/components/seo/JsonLd";
import FaroBlog from "@/components/blog/FaroBlog";
import HubNotas from "@/components/blog/HubNotas";
import { leerNotasPublicadas } from "@/lib/notas-server";
import { breadcrumbLd, listaDeNotasLd } from "@/lib/seo/jsonLd";
import { ORG, abs } from "@/lib/seo/site";

/**
 * El hub de contenido: /blog.
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
 * a /blog.
 */

export const revalidate = 300;

const DESCRIPCION =
  "Guías y notas sobre firma biométrica, infraestructura y ciberseguridad en Argentina: qué dice la ley, qué conviene y qué mirar antes de decidir.";

export const metadata: Metadata = {
  title: "Blog",
  description: DESCRIPCION,
  alternates: { canonical: "/blog" },
  openGraph: {
    type: "website",
    url: "/blog",
    title: `Blog · ${ORG.shortName}`,
    description: DESCRIPCION,
  },
};

export default async function BlogPage() {
  const todas = await leerNotasPublicadas();
  if (todas.length === 0) redirect("/");

  return (
    <main className="relative min-h-screen bg-[#04070d]">
      {/* La luz que baja y se abre sobre el encabezado. El charco que la cierra
          sobre el buscador va pegado a la caja, en HubNotas. */}
      <FaroBlog />

      <Navbar />

      <JsonLd
        data={[
          breadcrumbLd([
            { name: "Inicio", path: "/" },
            { name: "Blog", path: "/blog" },
          ]),
          listaDeNotasLd(todas.map((n) => ({ titulo: n.titulo, url: abs(`/blog/${n.slug}`) }))),
        ].filter(Boolean)}
      />

      <div className="relative z-10">
        {/* EL ENCABEZADO ES EL BUSCADOR
            El hub dejó de ser una lista con título: lo primero que se ve es la
            pregunta ("¿qué estás buscando?") y la caja para escribirla, con la
            luz cayendo justo detrás. El título y la bajada quedan centrados
            arriba, cortos, porque acá el protagonista es el buscador.

            El h1 y la bajada los pinta el servidor —son lo que indexa Google—
            y de la caja para abajo manda `HubNotas`, que es de cliente porque
            filtra sin volver al servidor. */}
        <header className="container-x pt-32 text-center lg:pt-40">
          {/* El h1 dice qué es esto, no cómo se llama la sección. "Blog" ya
              está en el <title>, en la miga y en el menú: repetirlo acá era
              gastar el renglón más grande de la página en una etiqueta. */}
          {/* `hero-enter` y no `Reveal`: este h1 es el LCP de la página, y el
              preset de Reveal arranca en opacidad 0 exacta, que es justo lo que
              hace que Chrome no lo tome como candidato hasta que sube. El mismo
              motivo por el que el h1 del hero de la portada usa esta clase. */}
          <h1
            className="hero-enter mx-auto max-w-[15ch] font-display text-[40px] font-bold leading-[1.02] tracking-[-0.035em] text-white sm:max-w-[20ch] sm:text-[52px] lg:text-[60px]"
            style={{ "--enter-from": "0.01", "--enter-y": "20px", "--enter-dur": "1.4s" } as React.CSSProperties}
          >
            Tecnología explicada por los que la implementan
          </h1>
          <p
            className="hero-enter mx-auto mt-6 max-w-[560px] text-[15.5px] leading-[1.7] text-gray-400"
            style={{ "--enter-delay": "0.22s", "--enter-dur": "1.4s" } as React.CSSProperties}
          >
            Qué dice la ley, qué conviene y qué mirar antes de decidir. Guías y notas sobre firma
            digital, infraestructura, ciberseguridad e IA.
          </p>
        </header>

        <section className="container-x pb-24 pt-8">
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
      <WhatsAppButton />
    </main>
  );
}
