import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Sólo la página de preview interna queda fuera del crawl. Las landings por
      // industria SÍ se rastrean e indexan: tienen contenido propio (contexto,
      // normativa y FAQs por vertical) y están en el sitemap.
      disallow: ["/preview-mapa"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
