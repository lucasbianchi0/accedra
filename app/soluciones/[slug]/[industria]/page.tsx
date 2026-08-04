import SolutionPage from "@/components/solutions/SolutionPage";
import { SOLUTIONS, SOLUTION_SLUGS } from "@/components/solutions/solutionsData";
import { INDUSTRIES, INDUSTRY_SLUGS } from "@/components/solutions/industriesData";
import { getIndustrySeo } from "@/components/solutions/industrySeo";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ScrollProgress from "@/components/ScrollProgress";
import JsonLd from "@/components/seo/JsonLd";
import { industryServiceLd, faqLd, breadcrumbLd } from "@/lib/seo/jsonLd";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

type Params = { slug: string; industria: string };

// Pre-renderiza todas las combinaciones solución × industria.
export function generateStaticParams(): Params[] {
  return SOLUTION_SLUGS.flatMap((slug) =>
    INDUSTRY_SLUGS.map((industria) => ({ slug, industria }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug, industria } = await params;
  const data = SOLUTIONS[slug];
  const ind = INDUSTRIES[industria];
  if (!data || !ind) return {};

  const path = `/soluciones/${slug}/${industria}`;
  const seo = getIndustrySeo(slug, industria);

  // Sin bloque SEO propio la página no tiene contenido que la diferencie de la
  // base, así que se mantiene fuera del índice: indexar una variante sin texto
  // propio es lo que Google penaliza como doorway page. El fallback nunca debería
  // dispararse (hay entrada para las 30 combinaciones), pero si alguien agrega una
  // industria y olvida el contenido, el default seguro es NO indexar.
  if (!seo) {
    return {
      // `absolute` igual que en la rama indexable: sin esto el template del
      // layout pega la marca encima de la que ya trae el título y queda
      // "… · Accedra | Accedra IT Solutions".
      title: { absolute: `${data.name} ${ind.forLabel} · Accedra` },
      description: `${data.name} ${ind.forLabel} — ${data.metaDescription}`,
      robots: { index: false, follow: false },
    };
  }

  return {
    // `absolute` evita que el template `| Accedra` del layout duplique la marca.
    title: { absolute: seo.metaTitle },
    description: seo.metaDescription,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      url: path,
      title: seo.metaTitle,
      description: seo.metaDescription,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        // Sin límite de snippet ni de preview: estas páginas viven de que el
        // buscador pueda mostrar (y los motores generativos citar) las respuestas
        // completas de las FAQs.
        "max-snippet": -1,
        "max-image-preview": "large",
        "max-video-preview": -1,
      },
    },
  };
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const { slug, industria } = await params;
  const data = SOLUTIONS[slug];
  const ind = INDUSTRIES[industria];
  if (!data || !ind) notFound();

  const seo = getIndustrySeo(slug, industria);
  const svc = industryServiceLd(slug, industria);
  const faq = seo ? faqLd(seo.faqs) : null;
  const crumbs = breadcrumbLd([
    { name: "Inicio", path: "/" },
    { name: data.name, path: `/soluciones/${slug}` },
    { name: ind.name, path: `/soluciones/${slug}/${industria}` },
  ]);

  return (
    <>
      {/* El structured data se emite desde acá (Server Component) y no desde
          SolutionPage, que es "use client": así el grafo llega en el HTML inicial
          sin depender de la hidratación. */}
      <JsonLd data={[svc, faq, crumbs].filter(Boolean)} />
      <ScrollProgress />
      <SolutionPage slug={slug} industria={industria} />
      <Footer />
      <WhatsAppButton />
    </>
  );
}
