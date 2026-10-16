import SolutionPage from "@/components/solutions/SolutionPage";
import { SUB_SERVICES } from "@/components/solutions/subServicesData";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ScrollProgress from "@/components/ScrollProgress";
import JsonLd from "@/components/seo/JsonLd";
import { subServiceLd, faqLd, breadcrumbLd } from "@/lib/seo/jsonLd";
import type { Metadata } from "next";

// Landing de cableado estructurado. Ruta estática: gana sobre
// /soluciones/[slug]/[industria], que con este path daría 404.
// Ver el porqué en components/solutions/subServicesData.ts.

const SUB = SUB_SERVICES["cableado-estructurado"];
const PATH = "/soluciones/networking/cableado-estructurado";

export const metadata: Metadata = {
  title: { absolute: SUB.seo.metaTitle },
  description: SUB.seo.metaDescription,
  alternates: { canonical: PATH },
  openGraph: {
    type: "website",
    url: PATH,
    title: SUB.seo.metaTitle,
    description: SUB.seo.metaDescription,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large", "max-video-preview": -1 },
  },
};

export default function Page() {
  const crumbs = breadcrumbLd([
    { name: "Inicio", path: "/" },
    { name: "Conectividad Crítica", path: "/soluciones/networking" },
    { name: SUB.name, path: PATH },
  ]);
  return (
    <>
      {/* Desde el Server Component, para que el grafo vaya en el HTML inicial. */}
      <JsonLd data={[subServiceLd("networking", SUB.slug), faqLd(SUB.seo.faqs), crumbs].filter(Boolean)} />
      <ScrollProgress />
      <SolutionPage slug="networking" servicio={SUB.slug} />
      <Footer />
      <WhatsAppButton />
    </>
  );
}
