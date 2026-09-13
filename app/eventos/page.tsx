import type { Metadata } from "next";
import { redirect } from "next/navigation";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AmbientLight from "@/components/AmbientLight";
import { EventosVista } from "@/components/Eventos";
import { leerEventosPublicados } from "@/lib/eventos-server";
import { eventosMuestra } from "@/lib/eventos-muestra";
import { ORG } from "@/lib/seo/site";

/**
 * Todos los eventos: los próximos y los realizados.
 *
 * Se lee en el servidor con ISR de un minuto, igual que la página de cada
 * evento: se sirve desde el CDN y una publicación del backoffice llega sola.
 *
 * Sin ningún evento publicado la sección no existe: la pestaña de la portada y
 * la opción del menú no se muestran, y esta dirección redirige a la portada en
 * vez de llevar a una página vacía.
 *
 * El filtro por categoría vive en el cliente, dentro de EventosVista: la lista
 * completa ya llega en el HTML y filtrar no necesita volver al servidor.
 *
 * `?muestra=1` en desarrollo muestra eventos de ejemplo (lib/eventos-muestra.ts).
 */

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Eventos",
  description: `Workshops, webinars y capacitaciones de ${ORG.shortName} sobre las tecnologías que implementamos en las empresas líderes de Argentina.`,
  alternates: { canonical: "/eventos" },
  openGraph: { type: "website", url: "/eventos", title: `Eventos · ${ORG.shortName}` },
};

type Props = { searchParams: Promise<{ muestra?: string; evento?: string }> };

export default async function EventosPage({ searchParams }: Props) {
  const { muestra, evento } = await searchParams;
  const deMuestra = muestra !== undefined && process.env.NODE_ENV !== "production";
  const { proximos, pasados } = deMuestra ? eventosMuestra() : await leerEventosPublicados(60);
  if (proximos.length + pasados.length === 0) redirect("/");

  return (
    <main className="relative min-h-screen bg-navy-800">
      <AmbientLight />
      <Navbar />
      <div className="relative z-10">
        <header className="relative overflow-hidden pb-10 pt-32 lg:pb-12 lg:pt-40">
          <div
            className="absolute inset-0 opacity-60"
            style={{ background: "radial-gradient(60% 80% at 80% 0%, rgba(43,111,212,0.35), transparent 70%)" }}
          />
          <div className="container-x relative text-center">
            <h1 className="section-title mx-auto mt-0 max-w-3xl">
              Aprendé con <span className="gradient-text">quienes lo implementan</span>
            </h1>
            <p className="section-sub mx-auto max-w-2xl">
              Workshops, webinars y capacitaciones con las tecnologías que desplegamos todos los días en las empresas
              líderes de Argentina.
            </p>
          </div>
        </header>

        <section className="container-x pb-24">
          <EventosVista proximos={proximos} pasados={pasados} eventoInicial={evento} />
        </section>

        <Footer />
      </div>
    </main>
  );
}
