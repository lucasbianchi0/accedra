import { Suspense } from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import JsonLd from "@/components/seo/JsonLd";
import FondoEventos from "@/components/eventos/FondoEventos";
import CabeceraEventos from "@/components/eventos/CabeceraEventos";
import ListaEventos from "@/components/eventos/ListaEventos";
import { leerEventosPublicados } from "@/lib/eventos-server";
import { breadcrumbLd } from "@/lib/seo/jsonLd";
import { ORG } from "@/lib/seo/site";

/**
 * Todos los eventos: los próximos y los realizados.
 *
 * Se lee en el servidor con ISR de un minuto, igual que el panel de la portada:
 * se sirve desde el CDN y una publicación del backoffice llega sola.
 *
 * Sin ningún evento publicado la sección no existe: la pestaña de la portada y
 * la opción del menú no se muestran, y esta dirección redirige a la portada en
 * vez de llevar a una página vacía.
 *
 * ES MÁS OSCURA QUE EL RESTO DEL SITIO, A PROPÓSITO
 *
 * Misma razón que /blog: el contenido son portadas de fotos distintas más
 * los colores de las cinco soluciones, y cada uno compite con el fondo. Sobre
 * el navy iluminado de `AmbientLight` las portadas se ensucian y las pastillas
 * violeta y cian pierden el color; sobre casi negro conviven todas. Es la misma
 * razón por la que una galería se pinta de gris oscuro y no de azul.
 *
 * LA PÁGINA ES ESTÁTICA
 *
 * Nada de lo que hay acá mira la dirección: ni el filtro por categoría, ni el
 * `?evento=` que abre un popup, ni el `?muestra=1` de desarrollo. Los tres
 * viven en `ListaEventos`, del lado del cliente.
 *
 * No es prolijidad: una página que lee `searchParams` en Next es dinámica —no
 * se prerenderiza— y cada visita se renderizaba de nuevo contra Supabase. En el
 * build de producción eso medía 250 ms de TTFB por visita, contra 2 ms de una
 * página estática del mismo sitio; el `revalidate` no lo evitaba, porque cachea
 * lo que se prerenderiza. Es el mismo razonamiento que ya estaba escrito en
 * /api/eventos para no leer la tabla en la portada.
 */

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Eventos",
  description: `Workshops, webinars y capacitaciones de ${ORG.shortName} sobre las tecnologías que implementamos en las empresas líderes de Argentina.`,
  alternates: { canonical: "/eventos" },
  openGraph: { type: "website", url: "/eventos", title: `Eventos · ${ORG.shortName}` },
};

export default async function EventosPage() {
  const { proximos, pasados } = await leerEventosPublicados(60);
  if (proximos.length + pasados.length === 0) redirect("/");

  return (
    <main className="relative min-h-screen bg-[#04070d]">
      {/* El clima de la página: los haces de una sala antes de que prendan las
          luces. Vive detrás del encabezado y muere antes del primer evento —
          abajo manda el contenido. */}
      <FondoEventos variante="haz" alto={1000} />

      <Navbar />

      <JsonLd
        data={[
          breadcrumbLd([
            { name: "Inicio", path: "/" },
            { name: "Eventos", path: "/eventos" },
          ]),
        ].filter(Boolean)}
      />

      <div className="relative z-10">
        <CabeceraEventos
          proximos={proximos.length}
          realizados={pasados.length}
          proximoInicio={proximos[0]?.inicio}
        />

        <section className="container-x pb-24">
          {/* `useSearchParams` (el popup compartido) necesita un límite de
              Suspense para que el resto se pueda prerenderizar. El fallback no
              dibuja nada: la lista se renderiza igual en el servidor, con el
              popup cerrado, que es como se ve una visita sin `?evento=`. */}
          <Suspense>
            <ListaEventos proximos={proximos} pasados={pasados} />
          </Suspense>
        </section>

        <Footer />
      </div>
      <WhatsAppButton />
    </main>
  );
}
