// Catálogo de industrias para las landings por vertical:
// /soluciones/[slug]/[industria]  (ej. /soluciones/firma-biometrica/juridicos)

const photo = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1920`;

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
};

export const INDUSTRY_SLUGS = Object.keys(INDUSTRIES);
