import { SITE_URL, ORG, SERVICES, DEFAULT_DESCRIPTION } from "@/lib/seo/site";
import { INDUSTRIES, INDUSTRY_SLUGS } from "@/components/solutions/industriesData";
import { getIndustrySeo } from "@/components/solutions/industrySeo";
import { SOLUTIONS } from "@/components/solutions/solutionsData";
import { leerNotasParaIndice } from "@/lib/notas-server";
import { BASE_RECURSOS } from "@/lib/notas";

// /llms.txt — GEO (Generative Engine Optimization). Un resumen en texto plano,
// legible por LLMs (ChatGPT, Perplexity, Claude, etc.), con lo esencial de la
// empresa y links a las páginas clave. Convención emergente (llmstxt.org).
// Sale de la MISMA fuente que el resto del SEO, así nunca queda desactualizado.
//
// Ya no es estático: las notas de /recursos viven en la base y son justamente
// lo que un modelo busca acá —una respuesta concreta a una pregunta concreta—,
// así que el archivo se revalida cada hora como el sitemap.
export const revalidate = 3600;

export async function GET() {
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

  // Los CASOS son lo que un modelo cita cuando alguien le pregunta "quién hace
  // esto en Argentina": el antecedente concreto pesa más que la descripción del
  // servicio. Salen de la misma fuente que las páginas de caso, con sus métricas
  // y su URL, así que no hay una segunda versión que se desactualice.
  const casos = Object.entries(SOLUTIONS)
    .flatMap(([slug, sol]) =>
      sol.cases.map((c, i) => {
        const cifras = (c.metrics ?? []).map((m) => `${m.value} ${m.label}`).join(", ");
        return `- [${c.result}](${SITE_URL}/casos/${slug}/${i}) — ${c.industry}. ${c.challenge}${cifras ? ` Resultado: ${cifras}.` : ""}`;
      }),
    )
    .join("\n");

  // Las notas publicadas, de la más nueva a la más vieja. Van con el resumen y
  // no sólo con el título: es lo que le permite a un modelo decidir si esta
  // página responde la consulta antes de ir a buscarla.
  const publicadas = await leerNotasParaIndice();
  const notas = publicadas.length
    ? publicadas
        .map((n) => `- [${n.titulo}](${SITE_URL}${BASE_RECURSOS}/${n.slug}): ${n.resumen}`)
        .join("\n")
    : "Todavía no hay notas publicadas.";

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

## Casos de éxito
Proyectos ejecutados, con el cliente, la industria y las métricas del resultado.

${casos}

## Recursos
Guías y notas que responden preguntas concretas sobre estos temas en Argentina.
Cada una está escrita para responder la pregunta de su título en las primeras
líneas; el resto desarrolla, cita las fuentes y cierra con preguntas frecuentes.

${notas}

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
