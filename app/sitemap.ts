import type { MetadataRoute } from "next";
import { SITE_URL, SERVICES } from "@/lib/seo/site";
import { SOLUTIONS } from "@/components/solutions/solutionsData";
import { INDUSTRY_SLUGS } from "@/components/solutions/industriesData";
import { getIndustrySeo } from "@/components/solutions/industrySeo";
import { HOME_CASES } from "@/components/homeCases";
import { leerNotasParaIndice } from "@/lib/notas-server";
import { BASE_RECURSOS } from "@/lib/notas";

// Sitemap de las rutas INDEXABLES. Se excluye a propósito:
//  · /preview-mapa (interna)
//  · /recursos?solucion= (la misma lista filtrada: va con noindex)
//
// Las rutas fijas salen del código; las notas, de la base. Por eso el sitemap
// es async y se revalida cada hora: publicar una nota en el backoffice la mete
// en el sitemap sin un deploy, que es la misma promesa que el resto del
// contenido editable del sitio.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const home: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: "weekly", priority: 1 },
    // Indexable a propósito: además de ser obligatoria, es una señal de confianza
    // que Google valora en sitios que recolectan datos.
    { url: `${SITE_URL}/privacidad`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  const solutions: MetadataRoute.Sitemap = SERVICES.map((s) => ({
    url: `${SITE_URL}/soluciones/${s.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.9,
  }));

  // Landings por industria (solución × industria). Sólo entran las que tienen
  // contenido propio en INDUSTRY_SEO — es la misma condición que decide el
  // `index` en generateMetadata, así que sitemap y robots nunca se contradicen.
  // Prioridad 0.8: por debajo de la solución base (0.9), que sigue siendo la
  // página canónica del servicio.
  const industries: MetadataRoute.Sitemap = SERVICES.flatMap((s) =>
    INDUSTRY_SLUGS.filter((ind) => getIndustrySeo(s.slug, ind)).map((ind) => ({
      url: `${SITE_URL}/soluciones/${s.slug}/${ind}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  );

  // Detalle de cada caso de éxito: los del home (/casos/home/n) y los de cada
  // solución que tenga casos cargados (/casos/<slug>/n).
  const cases: MetadataRoute.Sitemap = [];
  HOME_CASES.forEach((_, i) => {
    cases.push({ url: `${SITE_URL}/casos/home/${i}`, lastModified: now, changeFrequency: "yearly", priority: 0.6 });
  });
  Object.entries(SOLUTIONS).forEach(([slug, sol]) => {
    (sol.cases ?? []).forEach((_, i) => {
      cases.push({ url: `${SITE_URL}/casos/${slug}/${i}`, lastModified: now, changeFrequency: "yearly", priority: 0.6 });
    });
  });

  // Notas de /recursos. `lastModified` es la fecha de revisión y no la de
  // publicación: es lo que le dice a Google si vale la pena volver a pasar.
  const notas = await leerNotasParaIndice();
  const recursos: MetadataRoute.Sitemap = notas.length
    ? [
        { url: `${SITE_URL}${BASE_RECURSOS}`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
        ...notas.map((n) => ({
          url: `${SITE_URL}${BASE_RECURSOS}/${n.slug}`,
          lastModified: new Date(n.revisadoEn || n.publicadoEn || now),
          changeFrequency: "monthly" as const,
          priority: 0.7,
        })),
      ]
    : [];

  return [...home, ...solutions, ...industries, ...cases, ...recursos];
}
