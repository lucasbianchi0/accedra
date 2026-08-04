import { SITE_URL, ORG, SERVICES, DEFAULT_DESCRIPTION } from "@/lib/seo/site";
import { INDUSTRIES, INDUSTRY_SLUGS } from "@/components/solutions/industriesData";
import { getIndustrySeo } from "@/components/solutions/industrySeo";

// /llms.txt — GEO (Generative Engine Optimization). Un resumen en texto plano,
// legible por LLMs (ChatGPT, Perplexity, Claude, etc.), con lo esencial de la
// empresa y links a las páginas clave. Convención emergente (llmstxt.org).
// Sale de la MISMA fuente que el resto del SEO, así nunca queda desactualizado.
export const dynamic = "force-static";

export function GET() {
  const services = SERVICES.map(
    (s) => `- [${s.name}](${SITE_URL}/soluciones/${s.slug}): ${s.desc}`,
  ).join("\n");

  // Landings solución × industria, agrupadas por industria (y no por solución):
  // un LLM que responde "firma digital para estudios jurídicos" busca por el
  // vertical, así que agrupar por industria le deja las opciones juntas.
  const industryLinks = INDUSTRY_SLUGS.map((ind) => {
    const rows = SERVICES.map((s) => {
      const seo = getIndustrySeo(s.slug, ind);
      if (!seo) return null;
      return `- [${s.name} ${INDUSTRIES[ind].forLabel}](${SITE_URL}/soluciones/${s.slug}/${ind}): ${seo.metaDescription}`;
    }).filter(Boolean);
    if (!rows.length) return null;
    return `### ${INDUSTRIES[ind].name}\n${rows.join("\n")}`;
  })
    .filter(Boolean)
    .join("\n\n");

  const body = `# ${ORG.name}

> ${DEFAULT_DESCRIPTION}

${ORG.legalName} es un proveedor integral de infraestructura, servicios y proyectos
de tecnología para empresas líderes de Argentina. Más de 17 años de experiencia y
400+ proyectos entregados. Un único responsable de cuenta, del diagnóstico al soporte.

## Datos
- Sitio: ${SITE_URL}
- Ubicación: ${ORG.address.street}, ${ORG.address.locality}, Argentina
- Teléfono: ${ORG.phoneDisplay}
- Email: ${ORG.email}
- Idiomas: español, inglés, portugués
- Área de servicio: Argentina

## Soluciones
${services}

## Soluciones por industria
Cada solución tiene una página propia por vertical, con el contexto, el marco
normativo argentino aplicable y preguntas frecuentes específicas de esa industria.

${industryLinks}

## Enlaces
- [Contacto](${SITE_URL}/#contacto)
- [Partners tecnológicos](${SITE_URL}/#partners)
- [Casos de éxito](${SITE_URL}/#nosotros)
- [LinkedIn](${ORG.sameAs[0]})
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
