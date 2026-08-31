import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Fuera del crawl: la página de preview interna y los PDF de los brochures.
      // Los brochures se piden dejando un mail en la landing; si Google los
      // indexa, la URL aparece en la búsqueda y el formulario deja de existir.
      // Las landings por industria SÍ se rastrean e indexan: tienen contenido
      // propio (contexto, normativa y FAQs por vertical) y están en el sitemap.
      disallow: ["/preview-mapa", "/brochures/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
