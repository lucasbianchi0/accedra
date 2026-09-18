import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ChevronRight } from "lucide-react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AmbientLight from "@/components/AmbientLight";
import JsonLd from "@/components/seo/JsonLd";
import NotaCard from "@/components/recursos/NotaCard";
import { leerNotaPorSlug, leerNotasParaIndice, leerNotasPublicadas } from "@/lib/notas-server";
import {
  CATEGORIA_COLOR,
  CATEGORIA_LABEL,
  TIPO_LABEL,
  fechaLarga,
  minutosDe,
  urlDeNota,
  type NotaSitio,
} from "@/lib/notas";
import { renderizarMarkdown } from "@/lib/notas-markdown";
import { articleLd, breadcrumbLd, faqLd } from "@/lib/seo/jsonLd";
import { ORG, abs } from "@/lib/seo/site";
import { INDUSTRIES } from "@/components/solutions/industriesData";
import { getIndustrySeo } from "@/components/solutions/industrySeo";

/**
 * Una nota: accedra.com.ar/recursos/<slug>.
 *
 * ISR de cinco minutos, como el hub. La página se arma entera en el servidor
 * —el cuerpo se renderiza de markdown acá, no en el navegador— porque es
 * exactamente lo que tiene que leer un crawler: si el texto llegara por JS,
 * para media búsqueda generativa la página estaría vacía.
 *
 * EL ORDEN DE LA PÁGINA NO ES ESTÉTICO
 *
 * Título, respuesta directa, índice, cuerpo, preguntas frecuentes, fuentes. Es
 * el orden en que lo lee alguien que llegó buscando una respuesta concreta, y
 * también el que hace que un modelo pueda citar la respuesta sin procesar la
 * nota entera.
 */

export const revalidate = 300;

/**
 * Las notas que ya existen se prerenderizan en el build; las que se publiquen
 * después se generan la primera vez que alguien (o un crawler) las pide, y de
 * ahí en más salen del CDN. Es lo que hace que la primera visita a una nota
 * recién publicada no espere a la base.
 */
export async function generateStaticParams() {
  const notas = await leerNotasParaIndice();
  return notas.map((n) => ({ slug: n.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const nota = await leerNotaPorSlug(slug);
  if (!nota) return { title: "Nota no encontrada", robots: { index: false, follow: true } };

  const titulo = nota.tituloSeo || nota.titulo;
  const url = urlDeNota(nota.slug);

  return {
    title: titulo,
    description: nota.resumen,
    alternates: { canonical: url },
    authors: nota.autor ? [{ name: nota.autor }] : undefined,
    openGraph: {
      type: "article",
      url,
      title: titulo,
      description: nota.resumen,
      publishedTime: nota.publicadoEn || undefined,
      modifiedTime: nota.revisadoEn || nota.publicadoEn || undefined,
      authors: nota.autor ? [nota.autor] : undefined,
      tags: nota.tags,
      ...(nota.portadaUrl ? { images: [{ url: nota.portadaUrl }] } : {}),
    },
    ...(nota.portadaUrl ? { twitter: { card: "summary_large_image", images: [nota.portadaUrl] } } : {}),
  };
}

export default async function NotaPage({ params }: Props) {
  const { slug } = await params;
  const nota = await leerNotaPorSlug(slug);
  if (!nota) notFound();

  const { html, indice } = renderizarMarkdown(nota.cuerpo);
  const secciones = indice.filter((h) => h.nivel === 2);
  const url = abs(urlDeNota(nota.slug));

  // Otras notas de la misma solución. Se piden cuatro y se muestran tres: si
  // una de las cuatro es ésta, igual quedan tres.
  const relacionadas = (
    await leerNotasPublicadas({
      categoria: nota.categoria ?? undefined,
      excepto: nota.id,
      limite: 4,
    })
  ).slice(0, 3);

  const color = nota.categoria ? CATEGORIA_COLOR[nota.categoria] : "#2b6fd4";

  return (
    <main className="relative min-h-screen bg-navy-800">
      <AmbientLight variant="solution" />
      <Navbar />

      <JsonLd
        data={[
          articleLd({
            titulo: nota.titulo,
            tituloSeo: nota.tituloSeo,
            resumen: nota.resumen,
            respuesta: nota.respuesta,
            autor: nota.autor,
            autorCargo: nota.autorCargo,
            publicadoEn: nota.publicadoEn,
            revisadoEn: nota.revisadoEn,
            portadaUrl: nota.portadaUrl,
            categoria: nota.categoria,
            tags: nota.tags,
            url,
          }),
          faqLd(nota.faqs),
          breadcrumbLd([
            { name: "Inicio", path: "/" },
            { name: "Recursos", path: "/recursos" },
            { name: nota.titulo, path: urlDeNota(nota.slug) },
          ]),
        ].filter(Boolean)}
      />

      <div className="relative z-10">
        <article className="container-x pb-20 pt-28 lg:pb-28 lg:pt-36">
          <div className="mx-auto max-w-[760px]">
            {/* Migas: las mismas que el BreadcrumbList del schema. Que coincidan
                lo que ve una persona y lo que declara el marcado es la mitad de
                para qué sirve el marcado. */}
            <nav className="mb-6 flex flex-wrap items-center gap-1.5 text-[12px] text-gray-500">
              <Link href="/" className="transition-colors hover:text-gray-300">
                Inicio
              </Link>
              <ChevronRight className="h-3 w-3" />
              <Link href="/recursos" className="transition-colors hover:text-gray-300">
                Recursos
              </Link>
              {nota.categoria && (
                <>
                  <ChevronRight className="h-3 w-3" />
                  <Link
                    href={`/recursos?solucion=${nota.categoria}`}
                    className="transition-colors hover:text-gray-300"
                  >
                    {CATEGORIA_LABEL[nota.categoria]}
                  </Link>
                </>
              )}
            </nav>

            <p className="text-[11px] font-semibold uppercase tracking-[0.22em]" style={{ color }}>
              {TIPO_LABEL[nota.tipo]}
            </p>
            <h1 className="mt-4 text-[34px] font-bold leading-[1.1] tracking-[-0.02em] text-white md:text-[46px]">
              {nota.titulo}
            </h1>

            <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-gray-500">
              {nota.autor && (
                <span className="text-gray-300">
                  {nota.autor}
                  {nota.autorCargo && <span className="text-gray-500"> · {nota.autorCargo}</span>}
                </span>
              )}
              {nota.publicadoEn && <time dateTime={nota.publicadoEn}>{fechaLarga(nota.publicadoEn)}</time>}
              <span>{minutosDe(nota.cuerpo)} min de lectura</span>
            </div>
            {/* La revisión se muestra sólo si es posterior a la publicación: en
                una nota de hace dos años es la información que decide si alguien
                sigue leyendo. */}
            {nota.revisadoEn && nota.revisadoEn > nota.publicadoEn && (
              <p className="mt-1.5 text-[12px] text-gray-500">
                Revisada el <time dateTime={nota.revisadoEn}>{fechaLarga(nota.revisadoEn)}</time>
              </p>
            )}

            {nota.portadaUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={nota.portadaUrl}
                alt=""
                className="mt-9 aspect-[16/9] w-full rounded-card border border-white/10 object-cover"
              />
            )}

            {nota.respuesta && (
              <div
                className="mt-9 rounded-card border border-white/10 bg-white/[0.04] p-6"
                style={{ borderLeft: `3px solid ${color}` }}
              >
                <p className="text-[17px] leading-[1.7] text-gray-200">{nota.respuesta}</p>
              </div>
            )}

            {secciones.length > 2 && (
              <nav className="mt-9 rounded-card border border-white/10 bg-white/[0.02] p-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-500">En esta nota</p>
                <ol className="mt-3 space-y-2">
                  {secciones.map((h, i) => (
                    <li key={h.id} className="flex gap-3 text-[14px] leading-snug">
                      <span className="shrink-0 tabular-nums text-gray-600">{String(i + 1).padStart(2, "0")}</span>
                      <a href={`#${h.id}`} className="text-gray-300 transition-colors hover:text-white">
                        {h.texto}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            )}

            <div className="prosa mt-10" dangerouslySetInnerHTML={{ __html: html }} />

            {nota.faqs.length > 0 && (
              <section className="mt-14 border-t border-white/10 pt-10">
                <h2 className="text-[24px] font-bold text-white">Preguntas frecuentes</h2>
                <div className="mt-6 space-y-6">
                  {nota.faqs.map((f, i) => (
                    <div key={i}>
                      <h3 className="text-[17px] font-semibold leading-snug text-white">{f.q}</h3>
                      <p className="mt-2 text-[15.5px] leading-[1.75] text-gray-400">{f.a}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {nota.fuentes.length > 0 && (
              <section className="mt-12 border-t border-white/10 pt-8">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-500">Fuentes</p>
                <ul className="mt-3 space-y-2">
                  {nota.fuentes.map((f, i) => (
                    <li key={i} className="text-[14px] leading-relaxed">
                      <a
                        href={f.url}
                        target="_blank"
                        rel="noopener noreferrer nofollow"
                        className="text-accent-300 underline underline-offset-4 transition-colors hover:text-white"
                      >
                        {f.titulo}
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {nota.tags.length > 0 && (
              <div className="mt-10 flex flex-wrap gap-2">
                {nota.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[12px] text-gray-400"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}

            <Cierre nota={nota} />
          </div>
        </article>

        {relacionadas.length > 0 && (
          <section className="container-x pb-24">
            <div className="mx-auto max-w-[1100px]">
              <h2 className="mb-6 text-[22px] font-bold text-white">Seguir leyendo</h2>
              <div className="grid gap-6 md:grid-cols-3">
                {relacionadas.map((n) => (
                  <NotaCard key={n.id} nota={n} />
                ))}
              </div>
            </div>
          </section>
        )}

        <Footer />
      </div>
    </main>
  );
}

/**
 * El cierre comercial de la nota.
 *
 * Es un link y no un formulario porque quien llega leyendo una nota todavía no
 * está pidiendo una cotización. Lleva a la página de la solución —y a la landing
 * de la industria si la nota habla de un vertical—, que es donde están el
 * teléfono y el WhatsApp, que es como esta gente prefiere hablar.
 */
function Cierre({ nota }: { nota: NotaSitio }) {
  if (!nota.categoria) return null;
  const color = CATEGORIA_COLOR[nota.categoria];

  const landings = nota.industrias
    .filter((ind) => getIndustrySeo(nota.categoria!, ind))
    .map((ind) => ({
      href: `/soluciones/${nota.categoria}/${ind}`,
      label: INDUSTRIES[ind]?.name ?? ind,
    }));

  return (
    <aside className="mt-12 rounded-card border border-white/10 bg-white/[0.03] p-7">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color }}>
        {CATEGORIA_LABEL[nota.categoria]}
      </p>
      <p className="mt-3 text-[17px] leading-relaxed text-gray-300">
        Esto es parte de lo que hacemos en {ORG.shortName} todos los días. Si te queda una duda concreta sobre tu caso,
        la respondemos sin vueltas.
      </p>
      <div className="mt-5 flex flex-wrap gap-3">
        <Link
          href={`/soluciones/${nota.categoria}`}
          className="inline-flex items-center gap-2 rounded-control bg-accent px-5 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-accent-600"
        >
          Ver {CATEGORIA_LABEL[nota.categoria]}
          <ArrowRight className="h-4 w-4" />
        </Link>
        {landings.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="inline-flex items-center gap-2 rounded-control border border-white/15 px-5 py-2.5 text-[14px] font-medium text-gray-300 transition-colors hover:border-white/30 hover:text-white"
          >
            Para {l.label}
          </Link>
        ))}
      </div>
    </aside>
  );
}
