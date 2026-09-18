import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AmbientLight from "@/components/AmbientLight";
import JsonLd from "@/components/seo/JsonLd";
import NotaCard from "@/components/recursos/NotaCard";
import { leerNotasPublicadas } from "@/lib/notas-server";
import { CATEGORIAS, CATEGORIA_COLOR, CATEGORIA_LABEL } from "@/lib/notas";
import { breadcrumbLd, listaDeNotasLd } from "@/lib/seo/jsonLd";
import { ORG, abs } from "@/lib/seo/site";

/**
 * El hub de contenido: /recursos.
 *
 * Las notas se escriben en el backoffice y se leen de la base con ISR de cinco
 * minutos: publicar una nota no necesita un deploy, y el hub se sigue sirviendo
 * desde el CDN.
 *
 * SIN NOTAS, LA SECCIÓN NO EXISTE
 *
 * Igual que con los eventos: esta dirección redirige a la portada en vez de
 * mostrar una página vacía. Un hub vacío indexado es peor que no tenerlo.
 *
 * EL FILTRO POR SOLUCIÓN NO SE INDEXA
 *
 * `?solucion=` es comodidad para quien está navegando, pero como página es la
 * misma lista recortada: contenido duplicado y flaco. Por eso las vistas
 * filtradas van con `noindex` y canonical a /recursos — la que compite es una
 * sola.
 */

export const revalidate = 300;

const DESCRIPCION =
  "Guías y notas sobre firma biométrica, infraestructura y ciberseguridad en Argentina: qué dice la ley, qué conviene y qué mirar antes de decidir.";

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { solucion } = await searchParams;
  const filtrada = CATEGORIAS.find((c) => c === solucion);

  return {
    title: filtrada ? `Recursos sobre ${CATEGORIA_LABEL[filtrada]}` : "Recursos",
    description: DESCRIPCION,
    alternates: { canonical: "/recursos" },
    ...(filtrada ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      type: "website",
      url: "/recursos",
      title: `Recursos · ${ORG.shortName}`,
      description: DESCRIPCION,
    },
  };
}

type Props = { searchParams: Promise<{ solucion?: string }> };

export default async function RecursosPage({ searchParams }: Props) {
  const { solucion } = await searchParams;
  const filtro = CATEGORIAS.find((c) => c === solucion) ?? null;

  const todas = await leerNotasPublicadas();
  if (todas.length === 0) redirect("/");

  const notas = filtro ? todas.filter((n) => n.categoria === filtro) : todas;
  // La destacada sólo encabeza la lista completa: dentro de un filtro, la card
  // grande sería la nota destacada de otra solución o ninguna, y la grilla
  // quedaría descalzada.
  const destacada = !filtro ? notas.find((n) => n.destacada) ?? null : null;
  const resto = destacada ? notas.filter((n) => n.id !== destacada.id) : notas;

  // Sólo las soluciones que tienen al menos una nota: un filtro que devuelve
  // una lista vacía es una promesa incumplida.
  const conNotas = CATEGORIAS.filter((c) => todas.some((n) => n.categoria === c));

  return (
    <main className="relative min-h-screen bg-navy-800">
      <AmbientLight />
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
        <header className="relative overflow-hidden pb-10 pt-32 lg:pb-12 lg:pt-40">
          <div
            className="absolute inset-0 opacity-60"
            style={{ background: "radial-gradient(60% 80% at 80% 0%, rgba(43,111,212,0.35), transparent 70%)" }}
          />
          <div className="container-x relative text-center">
            <h1 className="section-title mx-auto mt-0 max-w-3xl">
              Lo que preguntan <span className="gradient-text">antes de decidir</span>
            </h1>
            <p className="section-sub mx-auto max-w-2xl">
              Qué dice la ley, qué conviene y qué mirar antes de firmar. Escrito por el equipo que después lo implementa.
            </p>
          </div>
        </header>

        <section className="container-x pb-24">
          {conNotas.length > 1 && (
            <nav className="mb-10 flex flex-wrap items-center justify-center gap-2">
              <Filtro href="/recursos" activo={!filtro} label="Todo" />
              {conNotas.map((c) => (
                <Filtro
                  key={c}
                  href={`/recursos?solucion=${c}`}
                  activo={filtro === c}
                  label={CATEGORIA_LABEL[c]}
                  color={CATEGORIA_COLOR[c]}
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
            <div className="space-y-8">
              {destacada && <NotaCard nota={destacada} grande />}
              {resto.length > 0 && (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {resto.map((n) => (
                    <NotaCard key={n.id} nota={n} />
                  ))}
                </div>
              )}
            </div>
          )}
        </section>

        <Footer />
      </div>
    </main>
  );
}

function Filtro({
  href,
  label,
  activo,
  color,
}: {
  href: string;
  label: string;
  activo: boolean;
  color?: string;
}) {
  return (
    <Link
      href={href}
      // Los filtros son links y no botones a propósito: se pueden abrir en otra
      // pestaña, se comparten, y la página funciona sin JavaScript.
      className={`inline-flex h-9 items-center gap-2 rounded-full border px-4 text-[13px] font-medium transition-colors ${
        activo
          ? "border-white/25 bg-white/10 text-white"
          : "border-white/10 bg-white/[0.02] text-gray-400 hover:border-white/20 hover:text-gray-200"
      }`}
    >
      {color && <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />}
      {label}
    </Link>
  );
}
