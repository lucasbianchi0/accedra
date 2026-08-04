import type { MetadataRoute } from "next";
import { SITE_URL, SERVICES } from "@/lib/seo/site";
import { SOLUTIONS } from "@/components/solutions/solutionsData";
import { HOME_CASES } from "@/components/homeCases";

// Sitemap de las rutas INDEXABLES. Se excluyen a propósito:
//  · las landings /soluciones/[slug]/[industria] (noindex, evitan duplicados)
//  · /preview-mapa (interna)
export default function sitemap(): MetadataRoute.Sitemap {
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

  return [...home, ...solutions, ...cases];
}
