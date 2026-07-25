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
    icons: [
      { src: "/icon", sizes: "512x512", type: "image/png" },
    ],
  };
}
