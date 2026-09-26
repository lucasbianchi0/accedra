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
    // NO AGREGAR AVIF ACÁ. Está medido, no supuesto.
    //
    // Las portadas que sube el backoffice ya son WebP, y volver a comprimir un
    // WebP a AVIF con q=75 da un archivo MÁS GRANDE: sobre una portada real de
    // /recursos, 24,5 KB contra 19,6 KB a 384 px y 47,8 contra 40,8 a 640. El
    // AVIF gana cuando el original es JPEG (19,4 contra 21,4 a 640 sobre una
    // foto de /public), pero ése no es el caso de las dos secciones que viven
    // de portadas. Con `formats: ["image/avif","image/webp"]` el navegador que
    // soporta AVIF —o sea, casi todos— se llevaría la versión peor.
    //
    // Si algún día el backoffice pasa a guardar los originales en JPEG o PNG,
    // vale volver a medirlo.
    remotePatterns: [
      { protocol: "https", hostname: "upload.wikimedia.org" },
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "logo.clearbit.com" },
      // Portadas de eventos subidas desde el backoffice. Van por el optimizador
      // para la miniatura del panel lateral: el original pesa ~280 KB y se ve
      // a 150 px.
      { protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" },
    ],
  },
  async redirects() {
    return [
      // La biblioteca pasó de /recursos a /blog. Las notas ya estaban indexadas
      // y con enlaces apuntando a la dirección vieja: un 308 le transfiere esa
      // señal a la nueva en vez de tirarla a un 404.
      { source: "/recursos", destination: "/blog", permanent: true },
      { source: "/recursos/:slug", destination: "/blog/:slug", permanent: true },

      // El sitio viejo indexaba tanto /seccion/ como /seccion/index.html.
      ...LEGACY_REDIRECTS.flatMap(([from, to]) => [
        { source: from, destination: to, permanent: true },
        { source: `${from}/index.html`, destination: to, permanent: true },
      ]),
      { source: "/index.html", destination: "/", permanent: true },
      // Alias legible para el caso Finning. La ruta real es /casos/[solucion]/[n],
      // que sale de la posición en el array de casos — sirve para navegar el
      // sitio pero no para pegar en un mail de prospección ni dictarla por
      // teléfono, que es justo lo que necesita la campaña dirigida a minería.
      // Temporal (307) y no permanente: si el orden del array cambia, el destino
      // cambia con él, y un 301 cacheado por el navegador apuntaría al caso
      // equivocado para siempre.
      { source: "/casos/finning", destination: "/casos/networking/1", permanent: false },
    ];
  },

  // Los PDF de los brochures se leen del disco desde /api/brochure para
  // adjuntarlos al mail. Todo lo que vive en `public/` se sube al CDN, pero NO
  // entra al bundle de la función serverless: sin esto, en Vercel el readFile
  // falla y el mail sale sin adjunto (con el enlace, pero sin el archivo).
  outputFileTracingIncludes: {
    "/api/brochure": ["./public/brochures/**"],
  },
};

export default nextConfig;
