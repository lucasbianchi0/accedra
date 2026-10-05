import type { MetadataRoute } from "next";
import { ORG, DEFAULT_DESCRIPTION } from "@/lib/seo/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: ORG.name,
    short_name: ORG.shortName,
    description: DEFAULT_DESCRIPTION,
    start_url: "/",
    display: "standalone",
    background_color: "#0a1424",
    theme_color: "#07101d",
    lang: "es-AR",
    categories: ["business", "technology"],
    // Generados por scripts/generar-icono-app.mjs. El maskable lleva la A más
    // chica porque Android lo recorta con su forma (círculo, gota) y sólo
    // garantiza el 80% del centro.
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
