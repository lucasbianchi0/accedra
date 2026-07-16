import type { Lang } from "./config";
import type { Solution } from "@/components/solutions/solutionsData";
import { SOLUTIONS_EN } from "./solutionsText.en";
import { SOLUTIONS_PT } from "./solutionsText.pt";

// Campos traducibles de una solución (páginas base, NO industria).
// tech, icon, imágenes, video y slug NO se traducen.
export type SolutionText = {
  name: string;
  eyebrow: string;
  title: string;
  highlight: string;
  subtitle: string;
  introTitle: string;
  intro: string;
  painsTitle: string;
  pains: string[];
  capabilities: { title: string; desc: string }[];
  benefitsTitle: string;
  benefits: string[];
  industries?: string[];
  metaTitle: string;
  metaDescription: string;
};

const OVERLAYS: Record<"en" | "pt", Record<string, SolutionText>> = {
  en: SOLUTIONS_EN,
  pt: SOLUTIONS_PT,
};

// Devuelve la solución con sus textos en el idioma pedido. Si falta la
// traducción (o es español) devuelve el contenido base sin tocar.
export function getLocalizedSolution(base: Solution, lang: Lang): Solution {
  if (lang === "es") return base;
  const t = OVERLAYS[lang]?.[base.slug];
  if (!t) return base;
  return {
    ...base,
    name: t.name,
    eyebrow: t.eyebrow,
    title: t.title,
    highlight: t.highlight,
    subtitle: t.subtitle,
    introTitle: t.introTitle,
    intro: t.intro,
    painsTitle: t.painsTitle,
    pains: t.pains,
    capabilities: base.capabilities.map((c, i) => ({ ...c, ...(t.capabilities[i] ?? {}) })),
    benefitsTitle: t.benefitsTitle,
    benefits: t.benefits,
    industries: t.industries ?? base.industries,
    metaTitle: t.metaTitle,
    metaDescription: t.metaDescription,
  };
}
