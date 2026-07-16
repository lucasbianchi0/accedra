import CaseDetail from "@/components/cases/CaseDetail";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ScrollProgress from "@/components/ScrollProgress";
import { SOLUTIONS, SOLUTION_SLUGS } from "@/components/solutions/solutionsData";
import { HOME_CASES } from "@/components/homeCases";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

type Params = { solucion: string; n: string };

export function generateStaticParams(): Params[] {
  const sol = SOLUTION_SLUGS.flatMap((solucion) =>
    SOLUTIONS[solucion].cases.map((_, i) => ({ solucion, n: String(i) }))
  );
  const home = HOME_CASES.map((_, i) => ({ solucion: "home", n: String(i) }));
  return [...sol, ...home];
}

function metaFor(solucion: string, idx: number): { title: string; desc: string } | null {
  if (solucion === "home") {
    const c = HOME_CASES[idx];
    return c ? { title: c.title, desc: c.desc } : null;
  }
  const c = SOLUTIONS[solucion]?.cases[idx];
  return c ? { title: c.result, desc: c.challenge } : null;
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { solucion, n } = await params;
  const c = metaFor(solucion, Number(n));
  if (!c) return {};
  return { title: `${c.title} · Caso de éxito · Accedra`, description: c.desc };
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const { solucion, n } = await params;
  const idx = Number(n);
  const exists = solucion === "home" ? !!HOME_CASES[idx] : !!SOLUTIONS[solucion]?.cases[idx];
  if (!Number.isInteger(idx) || !exists) notFound();
  return (
    <>
      <ScrollProgress />
      <CaseDetail solucion={solucion} index={idx} />
      <Footer />
      <WhatsAppButton />
    </>
  );
}
