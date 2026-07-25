// Generadores de JSON-LD (schema.org). Devuelven objetos planos que se serializan
// dentro de <script type="application/ld+json">. El @id compartido enlaza los nodos
// (Organization ↔ WebSite ↔ Service) para que los buscadores los lean como un grafo
// único, no como fragmentos sueltos.
import { SITE_URL, ORG, SERVICES, abs, DEFAULT_DESCRIPTION } from "./site";

const ORG_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;

// ProfessionalService extiende LocalBusiness → cubre SEO local (dirección + geo +
// areaServed) y a la vez describe la empresa como proveedor de servicios IT.
export function organizationLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": ORG_ID,
    name: ORG.name,
    legalName: ORG.legalName,
    url: SITE_URL,
    logo: abs("/icon"),
    image: abs("/opengraph-image"),
    description: DEFAULT_DESCRIPTION,
    email: ORG.email,
    telephone: ORG.phone,
    foundingDate: String(ORG.foundingYear),
    priceRange: "$$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: ORG.address.street,
      addressLocality: ORG.address.locality,
      addressRegion: ORG.address.region,
      postalCode: ORG.address.postalCode,
      addressCountry: ORG.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: ORG.geo.lat,
      longitude: ORG.geo.lng,
    },
    areaServed: { "@type": "Country", name: "Argentina" },
    sameAs: ORG.sameAs,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: ORG.phone,
      contactType: "sales",
      email: ORG.email,
      areaServed: ORG.areaServed,
      availableLanguage: ["es", "en", "pt"],
    },
    knowsAbout: SERVICES.map((s) => s.name),
  };
}

export function websiteLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE_URL,
    name: ORG.name,
    inLanguage: "es-AR",
    publisher: { "@id": ORG_ID },
  };
}

// Service individual — se emite en cada página de solución.
export function serviceLd(slug: string) {
  const svc = SERVICES.find((s) => s.slug === slug);
  if (!svc) return null;
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: svc.name,
    description: svc.desc,
    url: abs(`/soluciones/${slug}`),
    serviceType: svc.name,
    provider: { "@id": ORG_ID },
    areaServed: { "@type": "Country", name: "Argentina" },
  };
}

// Migas: Inicio › [páginas]. `items` = [{ name, path }].
export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: abs(it.path),
    })),
  };
}

/** Serializa uno o varios objetos JSON-LD para inyectar en el HTML. */
export function jsonLdString(...objects: unknown[]): string {
  const payload = objects.length === 1 ? objects[0] : objects;
  return JSON.stringify(payload);
}
