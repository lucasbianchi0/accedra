import CaseDetail from "@/components/cases/CaseDetail";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ScrollProgress from "@/components/ScrollProgress";
import { SOLUTIONS, SOLUTION_SLUGS } from "@/components/solutions/solutionsData";
import { HOME_CASES } from "@/components/homeCases";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbLd } from "@/lib/seo/jsonLd";

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
  const url = `/casos/${solucion}/${n}`;
  // Se saca "· Caso de éxito ·" del medio: eran 17 caracteres para decir algo
  // que nadie escribe en Google, y empujaban el título a 72 — por encima de lo
  // que el buscador muestra sin cortar. El resultado del caso, que es lo que
  // aporta valor, ahora entra completo.
  const title = `${c.title} | Accedra`;
  return {
    title: { absolute: title },
    description: c.desc,
    alternates: { canonical: url },
    openGraph: { type: "article", url, title, description: c.desc },
  };
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const { solucion, n } = await params;
  const idx = Number(n);
  const exists = solucion === "home" ? !!HOME_CASES[idx] : !!SOLUTIONS[solucion]?.cases[idx];
  if (!Number.isInteger(idx) || !exists) notFound();
  const meta = metaFor(solucion, idx);
  const crumbs =
    solucion === "home"
      ? [{ name: "Inicio", path: "/" }, { name: meta!.title, path: `/casos/${solucion}/${n}` }]
      : [
          { name: "Inicio", path: "/" },
          { name: SOLUTIONS[solucion].name, path: `/soluciones/${solucion}` },
          { name: meta!.title, path: `/casos/${solucion}/${n}` },
        ];
  return (
    <>
      <JsonLd data={breadcrumbLd(crumbs)} />
      <ScrollProgress />
      <CaseDetail solucion={solucion} index={idx} />
      <Footer />
      <WhatsAppButton />
    </>
  );
}
