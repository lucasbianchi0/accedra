/**
 * Vista imprimible de los brochures.
 *
 * Es una ruta y no un script porque así los PDF se generan con los datos reales
 * de `solutionsData.ts`, las tipografías de `next/font` y los assets de
 * `/public` — sin replicar nada. El PDF sale de imprimir esta página; mientras
 * tanto queda como preview para revisar cambios sin regenerar el archivo.
 *
 * `noindex` porque no es una página del sitio: es el original de un PDF. Si
 * Google la indexara competiría con la landing real de la misma solución.
 */

import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BrochureInstitucional, BrochureSolucion } from "@/components/brochure/Brochure";
import { SOLUTIONS } from "@/components/solutions/solutionsData";
import "@/components/brochure/brochure.css";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

/** El institucional no es una solución, así que no sale de `SOLUTIONS`. */
const INSTITUCIONAL = "institucional";

export function generateStaticParams() {
  return [{ slug: INSTITUCIONAL }, ...Object.keys(SOLUTIONS).map((slug) => ({ slug }))];
}

export default async function BrochurePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (slug === INSTITUCIONAL) return <BrochureInstitucional />;
  if (!SOLUTIONS[slug]) notFound();

  return <BrochureSolucion slug={slug} />;
}
