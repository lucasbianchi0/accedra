import SolutionPage from "@/components/solutions/SolutionPage";
import { SOLUTIONS, SOLUTION_SLUGS } from "@/components/solutions/solutionsData";
import { INDUSTRIES, INDUSTRY_SLUGS } from "@/components/solutions/industriesData";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ScrollProgress from "@/components/ScrollProgress";
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
  return {
    title: `${data.name} ${ind.forLabel} · Accedra`,
    description: `${data.name} ${ind.forLabel} — ${data.metaDescription}`,
    // Landings privadas: se reparten por link directo, no se indexan ni se llega por la UI.
    robots: { index: false, follow: false },
  };
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const { slug, industria } = await params;
  if (!SOLUTIONS[slug] || !INDUSTRIES[industria]) notFound();
  return (
    <>
      <ScrollProgress />
      <SolutionPage slug={slug} industria={industria} />
      <Footer />
      <WhatsAppButton />
    </>
  );
}
