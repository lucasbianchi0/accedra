import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Landings por industria (noindex) y la página de preview interna: fuera
      // del crawl para no diluir el índice con variantes/duplicados.
      disallow: ["/preview-mapa"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
