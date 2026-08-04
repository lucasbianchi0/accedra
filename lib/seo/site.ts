// Fuente ÚNICA de verdad de los datos de negocio para SEO, metadata, structured
// data (JSON-LD) y GEO. Todo lo canónico del sitio sale de acá para que nada
// diverja entre el <title>, el schema.org, el sitemap y el llms.txt.
//
// El dominio se puede pisar con NEXT_PUBLIC_SITE_URL en el entorno; el default es
// accedra.com.ar (mismo dominio del email). Sin barra final.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.accedra.com.ar"
).replace(/\/$/, "");

export const ORG = {
  legalName: "Accedra S.A.",
  name: "Accedra IT Solutions",
  shortName: "Accedra",
  tagline: "Infraestructura y Servicios Tecnológicos",
  foundingYear: 2008, // 17 años a 2025
  email: "info@accedra.com.ar",
  phone: "+541153659887", // fijo, formato E.164
  phoneDisplay: "(+54 11) 5365-9887",
  whatsapp: "541133001233",
  address: {
    street: "Irala 1950, 2° piso",
    locality: "Ciudad Autónoma de Buenos Aires",
    region: "CABA",
    postalCode: "C1276",
    country: "AR",
  },
  // Coordenadas APROXIMADas de Irala 1950 (Barracas, CABA). Verificar/afinar con
  // la ubicación exacta antes de producción — impactan el SEO local.
  geo: { lat: -34.6449, lng: -58.3796 },
  sameAs: [
    "https://www.linkedin.com/company/accedra-s.a.",
    "https://www.instagram.com/accedra_sa/",
  ],
  areaServed: "AR",
} as const;

// Servicios canónicos (slug = ruta /soluciones/<slug>). El nombre y la descripción
// corta alimentan el Service schema y el sitemap.
export const SERVICES = [
  { slug: "networking", name: "Networking", desc: "Infraestructura de red robusta y de alta disponibilidad, del cableado a la nube." },
  { slug: "firma-biometrica", name: "Firma Biométrica", desc: "Firma electrónica, biométrica y digital con validez legal y trazabilidad total." },
  { slug: "consultoria", name: "Consultoría Microsoft", desc: "Ecosistema Microsoft y analítica que convierten tus datos en decisiones." },
  { slug: "seguridad", name: "Seguridad IT", desc: "Ciberseguridad de nivel corporativo en cada capa, con arquitectura Zero Trust." },
  { slug: "software-ai", name: "Software & AI", desc: "Software a medida e inteligencia artificial aplicada a tus procesos." },
] as const;

// Constante propia y no derivada de ORG.tagline: ese campo dice
// "Infraestructura y Servicios Tecnológicos", una frase que no aparece en
// NINGÚN texto visible del sitio y que además nadie busca en Google. Un title
// que promete algo que la página nunca dice es una coincidencia débil.
// La marca va primero porque el objetivo principal es ganar la búsqueda
// "accedra"; después las dos categorías con volumen real de búsqueda.
export const DEFAULT_TITLE = "Accedra | Infraestructura IT y Ciberseguridad para Empresas";

// Arranca con la keyword en vez de con "17 años": lo primero que lee alguien
// que escanea resultados tiene que decirle qué hacés. "En Argentina" va al
// final y aplicado a los proyectos, no a la empresa — da la señal local sin
// leerse como una frontera.
export const DEFAULT_DESCRIPTION =
  "Infraestructura IT para empresas: networking, ciberseguridad, firma biométrica y consultoría Microsoft. 17 años y +400 proyectos en Argentina.";

/** Construye una URL absoluta a partir de un path del sitio. */
export function abs(path = "/"): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
