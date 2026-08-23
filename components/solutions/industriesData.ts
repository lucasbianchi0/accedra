// Catálogo de industrias para las landings por vertical:
// /soluciones/[slug]/[industria]  (ej. /soluciones/firma-biometrica/juridicos)

const photo = (id: number) =>
  `/images/${id}.jpg`;

export type Industry = {
  slug: string;
  name: string; // "Bancos"
  forLabel: string; // "para bancos" (se muestra en el badge)
  context: string; // frase específica de la industria, agnóstica de la solución
  heroImage: string; // portada propia de la industria (se puede swappear el id de Pexels)
};

export const INDUSTRIES: Record<string, Industry> = {
  bancos: {
    slug: "bancos",
    name: "Bancos",
    forLabel: "para bancos",
    context:
      "donde la disponibilidad, la seguridad y el cumplimiento normativo no son negociables.",
    heroImage: photo(259200),
  },
  seguros: {
    slug: "seguros",
    name: "Aseguradoras",
    forLabel: "para aseguradoras",
    context:
      "donde cada póliza, siniestro y trámite exige trazabilidad, agilidad y respaldo probatorio.",
    heroImage: photo(3760067),
  },
  juridicos: {
    slug: "juridicos",
    name: "Estudios jurídicos",
    forLabel: "para estudios jurídicos",
    context:
      "donde la validez legal, la confidencialidad y el resguardo documental son la base del negocio.",
    heroImage: photo(5668473),
  },
  laboratorios: {
    slug: "laboratorios",
    name: "Laboratorios y salud",
    forLabel: "para laboratorios y salud",
    context:
      "donde la continuidad, la protección de datos sensibles y la trazabilidad son críticas.",
    heroImage: photo(3735709),
  },
  logistica: {
    slug: "logistica",
    name: "Logística",
    forLabel: "para logística",
    context:
      "donde la operación es 24/7 y un minuto de caída se traduce en entregas y clientes perdidos.",
    heroImage: photo(4481259),
  },
  retail: {
    slug: "retail",
    name: "Retail",
    forLabel: "para retail",
    context:
      "donde múltiples sucursales, picos de demanda y datos de clientes conviven en una misma red.",
    heroImage: photo(264636),
  },
  // Minería entra última pero es la de mayor potencial hoy: la inversión del
  // sector pasa de US$ 1.388 M en 2025 a US$ 7.510 M proyectados para 2026, y
  // Accedra ya tiene el antecedente más difícil de conseguir en ese mercado
  // —Finning, 15+ sitios en cuatro provincias con Starlink por SD-WAN y
  // certificación de Seguridad e Higiene minera—. El slug va sin tilde por
  // consistencia con el resto: las URLs del sitio no llevan acentos.
  mineria: {
    slug: "mineria",
    name: "Minería",
    forLabel: "para minería",
    context:
      "donde la operación es 24/7 en yacimientos remotos, la conectividad tradicional no llega y cada hora de parada cuesta producción.",
    // Ruta literal y no `photo()`: la única foto de minería que tenemos es la
    // del propio caso Finning, y usar la real vale más que un banco de imágenes.
    heroImage: "/cases/finning.jpg",
  },
};

export const INDUSTRY_SLUGS = Object.keys(INDUSTRIES);
