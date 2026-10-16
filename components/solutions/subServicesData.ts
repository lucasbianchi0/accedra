// Landings de SERVICIO dentro de una solución: /soluciones/<solucion>/<servicio>.
//
// Por qué existen, si ya están las landings por industria: aquellas cortan la
// misma solución por PÚBLICO (redes para bancos, para minería). Éstas la cortan
// por lo que la gente efectivamente BUSCA. "Cableado estructurado" tiene 480
// búsquedas por mes en Argentina y es la búsqueda con la que llegó el primer
// cliente que trajo Google Ads (GL servicios, 25/9/2026, una licitación); hasta
// ahora caía en /soluciones/networking, que abre con satélite y SD-WAN y deja el
// cableado como sexta capacidad. Esa página sigue igual: la vitrina de
// Conectividad Crítica no cambia, esto es la puerta de entrada de quien ya sabe
// qué necesita.
//
// Reutiliza la página de solución entera (portada, bento, proceso, casos, FAQ,
// formulario): sólo pisa el texto y el contenido propio. Así se ve igual que el
// resto del sitio y cualquier mejora a SolutionPage le llega sola.

import { Building2, Cable, ClipboardCheck, FileSearch, Network, ServerCog, type LucideIcon } from "lucide-react";
import type { IndustrySeo } from "./industrySeo";

const photo = (id: number) => `/images/${id}.jpg`;

export type SubService = {
  /** Solución madre (slug de SOLUTIONS). */
  parent: string;
  slug: string;
  /** Nombre corto: breadcrumb, WhatsApp, Service schema. */
  name: string;
  /** Pastilla sobre el h1. */
  badge: string;
  /** Texto del botón principal: quien busca un servicio puntual viene a cotizar. */
  cta: string;
  title: string;
  highlight: string;
  subtitle: string;
  heroImage: string;
  brands: string[];
  brandsLabel: string;
  capabilities: { icon: LucideIcon; title: string; desc: string; photo?: string }[];
  /** Mismo formato que las landings por industria: alimenta IndustryContext,
   *  IndustryFaq, el FAQPage y el Service schema. */
  seo: IndustrySeo;
  complianceTitle: string;
  complianceNote: string;
};

export const SUB_SERVICES: Record<string, SubService> = {
  "cableado-estructurado": {
    parent: "networking",
    slug: "cableado-estructurado",
    name: "Cableado estructurado",
    badge: "Cableado estructurado certificado",
    cta: "Pedir cotización",
    title: "Cableado estructurado",
    highlight: "certificado para empresas.",
    subtitle:
      "Relevamiento, diseño, instalación y certificación de cableado de datos, voz, video y fibra óptica. Para oficinas, plantas, depósitos y licitaciones, con racks, energía y documentación de obra entregados llave en mano.",
    heroImage: photo(2881232),
    brands: ["CommScope Systimax", "CommScope NetConnect", "Furukawa", "Siemon", "APC", "Vertiv"],
    brandsLabel: "Trabajamos con",
    // Seis, como en todas las soluciones: el bento llena filas exactas con seis.
    capabilities: [
      { icon: FileSearch, title: "Relevamiento técnico", desc: "Visita al sitio, recorrido de bandejas y montantes, ubicación de racks y cómputo de puestos antes de cotizar. Sin relevamiento no hay presupuesto serio.", photo: photo(4508751) },
      { icon: Cable, title: "Cobre Cat 6 y Cat 6A", desc: "Puestos de datos, voz y video, cámaras y access points, con canalización, rotulado y patcheo ordenado de punta a punta.", photo: photo(2881232) },
      { icon: Network, title: "Fibra óptica", desc: "Backbone entre pisos, edificios y naves en fibra multimodo o monomodo, con fusiones, bandejas y certificación de cada enlace.", photo: photo(442151) },
      { icon: ServerCog, title: "Racks, energía y orden", desc: "Armado y modernización de racks y salas técnicas, con UPS y PDUs, gestión de cables y el equipamiento activo ya montado.", photo: photo(4682189) },
      { icon: ClipboardCheck, title: "Certificación y documentación", desc: "Cada punto se certifica con instrumental y se entrega el informe junto con planos, rotulado y planilla de patcheo: la red queda auditable.", photo: photo(2881229) },
      { icon: Building2, title: "Obras, mudanzas y licitaciones", desc: "Cableado para oficinas nuevas, ampliaciones y mudanzas, y cotización técnica para licitaciones públicas y privadas, con pliego y cómputo detallado.", photo: photo(1148820) },
    ],
    complianceTitle: "Normas con las que trabajamos",
    complianceNote:
      "El estándar y la categoría de cada proyecto se definen en el relevamiento según el uso, las distancias y lo que pida el pliego.",
    seo: {
      metaTitle: "Cableado Estructurado Certificado para Empresas · Accedra",
      metaDescription:
        "Cableado estructurado Cat 6, Cat 6A y fibra óptica para empresas en CABA, GBA y todo el país. Relevamiento, instalación, certificación y cotización para licitaciones.",
      h2: "Cableado estructurado que se certifica, se documenta y dura",
      intro: [
        "El cableado es la parte de la red que más años queda instalada y la que más caro sale rehacer: cambia el switch, cambian los access points, pero el cable que corre por bandejas, cielorrasos y montantes se queda diez o quince años. Por eso un proyecto de cableado estructurado no se mide por el precio por boca sino por cómo se diseña, cómo se instala y cómo se entrega. Trabajamos con relevamiento previo en sitio, cómputo de puestos por sector, canalización adecuada a cada ambiente y separación de corrientes respecto de la instalación eléctrica.",
        "Cada punto se termina, se rotula y se certifica con instrumental, y la obra se entrega con el informe de certificación, los planos con la ubicación de cada boca, el rotulado de patcheras y la planilla de patcheo. Eso es lo que permite que el área de sistemas —o el próximo proveedor— sepa exactamente qué hay instalado, y lo que piden los pliegos de licitación y las auditorías. Cotizamos tanto obras puntuales como despliegues en varias sedes: el mismo criterio que aplicamos en más de quince sitios de minería para Finning y en la red nacional de Andreani.",
        "Además del cobre Cat 6 y Cat 6A para datos, telefonía IP, cámaras y access points, resolvemos el backbone en fibra óptica entre pisos, edificios y naves, el armado o la modernización de racks y salas técnicas con UPS y PDUs, y el equipamiento activo de red sobre el que corre todo. Un solo responsable desde el relevamiento hasta la red funcionando.",
      ],
      compliance: [
        { label: "ANSI/TIA-568", detail: "Estándar de cableado de telecomunicaciones para edificios comerciales: categorías, distancias y desempeño de cada enlace." },
        { label: "ISO/IEC 11801", detail: "Equivalente internacional: clases de canal (E, EA) y requisitos de cableado genérico." },
        { label: "ANSI/TIA-606", detail: "Administración: rotulado de cables, patcheras y racks para que la instalación sea trazable." },
        { label: "ANSI/TIA-569", detail: "Canalizaciones y espacios: bandejas, montantes y salas técnicas donde corre y vive el cableado." },
      ],
      faqs: [
        {
          q: "¿Cuánto cuesta el cableado estructurado para una empresa?",
          a: "Depende de la cantidad de puestos, de la categoría (Cat 6 o Cat 6A), de las distancias y de cómo hay que canalizar: no es lo mismo una oficina con cielorraso que una nave industrial. Por eso cotizamos después de un relevamiento en el sitio, con cómputo de bocas por sector y el detalle de materiales, mano de obra y certificación. Para pedir el presupuesto alcanza con escribirnos la dirección, la cantidad aproximada de puestos y si hay planos.",
        },
        {
          q: "¿Qué diferencia hay entre Cat 6 y Cat 6A?",
          a: "Cat 6 soporta hasta 1 Gbps en los 90 metros de un enlace horizontal (y 10 Gbps en tramos cortos); Cat 6A sostiene 10 Gbps en el enlace completo y tiene mejor desempeño ante interferencia. Cat 6 alcanza para la mayoría de los puestos de oficina; Cat 6A conviene para access points de última generación, cámaras PoE de alto consumo y lugares donde el cableado tiene que durar muchos años sin quedar chico. Lo definimos en el relevamiento según el uso de cada sector.",
        },
        {
          q: "¿Qué es la certificación del cableado y por qué importa?",
          a: "Certificar es medir cada enlace terminado con un instrumento que verifica que cumple la categoría instalada: atenuación, diafonía, longitud y mapa de cableado. El resultado es un informe por punto que demuestra que la red rinde lo que se pagó. Sin certificación no hay forma de probar que una boca con problemas viene de la instalación, y es un requisito habitual en licitaciones y en los programas de garantía de los fabricantes.",
        },
        {
          q: "¿Hacen cableado estructurado para licitaciones?",
          a: "Sí. Preparamos la cotización técnica con el cómputo de bocas, materiales, canalizaciones, racks y certificación según lo que pida el pliego, y la documentación de obra al finalizar. Si la licitación tiene planos, con eso arrancamos; si no, hacemos el relevamiento en el sitio.",
        },
        {
          q: "¿Trabajan fuera de CABA?",
          a: "Sí. Tenemos base en la Ciudad de Buenos Aires y trabajamos en CABA, el Gran Buenos Aires y en el interior del país. Desplegamos cableado y redes en sitios de minería de Catamarca, San Juan, Santa Cruz y Jujuy, y en sedes distribuidas por todo el país.",
        },
        {
          q: "¿Qué se entrega al terminar la obra?",
          a: "El informe de certificación de cada punto, los planos con la ubicación de las bocas, el rotulado de cables y patcheras según norma y la planilla de patcheo. Con eso cualquier técnico puede saber qué hay instalado y dónde, hoy o dentro de diez años.",
        },
      ],
      keywords: [
        "cableado estructurado",
        "cableado estructurado empresas",
        "cotización cableado estructurado",
        "certificación de cableado",
        "cableado cat 6a",
        "instalación de fibra óptica",
        "cableado estructurado licitación",
        "empresa de cableado estructurado CABA",
      ],
    },
  },
};

export const SUB_SERVICE_SLUGS = Object.keys(SUB_SERVICES);

export function getSubService(parent: string, slug: string): SubService | null {
  const s = SUB_SERVICES[slug];
  return s && s.parent === parent ? s : null;
}
