import type { NextConfig } from "next";

// Mapa de las URLs del sitio VIEJO (estático, .html) a las del sitio nuevo.
// Google todavía tiene esas URLs indexadas y hoy devuelven 404, así que toda la
// autoridad y los enlaces que apuntan ahí se pierden. Con un 308 permanente esa
// señal se transfiere a la página nueva equivalente.
const LEGACY_REDIRECTS: [string, string][] = [
  ["/networking", "/soluciones/networking"],
  ["/cisco", "/soluciones/networking"],
  ["/pan", "/soluciones/seguridad"], // Palo Alto Networks
  ["/powerbi", "/soluciones/consultoria"],
  ["/firmadigital", "/soluciones/firma-biometrica"],
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "upload.wikimedia.org" },
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "logo.clearbit.com" },
    ],
  },
  async redirects() {
    return [
      // El sitio viejo indexaba tanto /seccion/ como /seccion/index.html.
      ...LEGACY_REDIRECTS.flatMap(([from, to]) => [
        { source: from, destination: to, permanent: true },
        { source: `${from}/index.html`, destination: to, permanent: true },
      ]),
      { source: "/index.html", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
