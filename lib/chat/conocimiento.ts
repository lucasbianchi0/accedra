import { SOLUTIONS } from "@/components/solutions/solutionsData";
import { SUB_SERVICES } from "@/components/solutions/subServicesData";
import { imgFor } from "@/components/cases/caseImage";
import { ORG } from "@/lib/seo/site";
import type { TarjetaCaso, TarjetaSolucion } from "./tipos";

/**
 * Lo que sabe el asistente de Accedra.
 *
 * Sale de la MISMA fuente que las páginas de solución, los casos y /llms.txt:
 * si mañana se agrega una capacidad o un caso, el asistente lo sabe sin que
 * nadie se acuerde de actualizar un prompt aparte. Lo único que vive acá es lo
 * que las páginas no dicen y el asistente necesita (a quién corresponde cada
 * caso).
 */

/**
 * El cliente de cada caso, por id (`solución:índice`).
 *
 * El caso no trae el nombre del cliente como campo —en la página va en el
 * relato—, y la tarjeta lo necesita corto. Si se agrega un caso y no se anota
 * acá, la tarjeta muestra la industria: se ve bien igual.
 */
const CLIENTE_DE_CASO: Record<string, string> = {
  "networking:0": "Andreani",
  "networking:1": "Finning (Caterpillar)",
  "firma-biometrica:0": "Banco Provincia",
};

export const SLUGS_SOLUCION = Object.keys(SOLUTIONS);

export const IDS_CASO = Object.entries(SOLUTIONS).flatMap(([slug, s]) =>
  s.cases.map((_, i) => `${slug}:${i}`),
);

export function tarjetaSolucion(slug: string, motivo: string): TarjetaSolucion | null {
  const s = SOLUTIONS[slug];
  if (!s) return null;
  return {
    tipo: "solucion",
    slug,
    nombre: s.name,
    motivo: motivo.trim().slice(0, 220) || s.introTitle,
    accent: s.accent,
    href: `/soluciones/${slug}`,
  };
}

/**
 * Una cifra del caso dicha en palabras, para los casos que no traen su
 * `logro` escrito: "+4.400 dispositivos" → "Más de 4.400 dispositivos.",
 * "5→<1 caídas" → "De 5 a menos de 1 caídas.". Las flechas y los signos se
 * leen como planilla, no como un resultado.
 */
export function enPalabras(m?: { value: string; label: string }): string {
  if (!m) return "";
  const valor = m.value
    .replace(/^\s*(\d[\d.,]*)\s*(?:→|->)\s*<\s*(\d[\d.,]*)\s*$/, "de $1 a menos de $2")
    .replace(/^\s*(\d[\d.,]*)\s*(?:→|->)\s*(\d[\d.,]*)\s*$/, "de $1 a $2")
    .replace(/^\+\s*/, "más de ")
    .replace(/^<\s*/, "menos de ")
    .replace(/^>\s*/, "más de ")
    .replace(/→|->/g, "a");
  const frase = `${valor} ${m.label}`.trim();
  return `${frase.charAt(0).toUpperCase()}${frase.slice(1)}.`;
}

export function tarjetaCaso(id: string): TarjetaCaso | null {
  const [slug, n] = id.split(":");
  const s = SOLUTIONS[slug];
  const c = s?.cases[Number(n)];
  if (!s || !c) return null;
  return {
    tipo: "caso",
    id,
    cliente: CLIENTE_DE_CASO[id] ?? c.industry,
    industria: c.industry,
    titulo: c.result,
    imagen: c.image ?? imgFor(c.industry),
    cifras: (c.metrics ?? []).slice(0, 3),
    logro: c.logro ?? enPalabras(c.metrics?.[0]),
    href: `/casos/${slug}/${n}`,
    accent: s.accent,
  };
}

/** El catálogo en texto, para el prompt. Se arma una vez por instancia. */
let cache: string | null = null;

export function conocimiento(): string {
  if (cache) return cache;

  const soluciones = Object.entries(SOLUTIONS)
    .map(([slug, s]) => {
      const capacidades = s.capabilities.map((c) => `  - ${c.title}: ${c.desc}`).join("\n");
      const dolores = s.pains.map((p) => `  - ${p}`).join("\n");
      const beneficios = s.benefits.map((b) => `  - ${b}`).join("\n");
      const subs = Object.values(SUB_SERVICES)
        .filter((x) => x.parent === slug)
        .map((x) => `  - ${x.name} → /soluciones/${slug}/${x.slug}`)
        .join("\n");
      const industrias = (s.industries ?? []).join(", ");
      return [
        `### ${s.name} (slug: ${slug}) → /soluciones/${slug}`,
        `${s.title} ${s.highlight} ${s.subtitle}`,
        `${s.introTitle} ${s.intro}`,
        `Dolores típicos del cliente:\n${dolores}`,
        `Qué hacemos:\n${capacidades}`,
        `Beneficios:\n${beneficios}`,
        `Marcas y tecnologías: ${[...new Set([...s.tech, ...s.brands])].join(", ")}`,
        industrias ? `Industrias donde se aplica: ${industrias}` : "",
        subs ? `Servicios con página propia:\n${subs}` : "",
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n\n");

  const casos = Object.entries(SOLUTIONS)
    .flatMap(([slug, s]) =>
      s.cases.map((c, i) => {
        const id = `${slug}:${i}`;
        const cifras = (c.metrics ?? []).map((m) => `${m.value} ${m.label}`).join("; ");
        return [
          `### Caso ${id} — ${CLIENTE_DE_CASO[id] ?? c.industry} (${c.industry}, solución ${s.name})`,
          `Desafío: ${c.challenge}`,
          `Qué hicimos: ${c.solution}`,
          `Resultado: ${c.result}. ${c.logro ?? enPalabras(c.metrics?.[0])}${cifras ? ` (cifras: ${cifras})` : ""}`,
          ...(c.body ?? []),
        ].join("\n");
      }),
    )
    .join("\n\n");

  cache = `# Accedra

${ORG.legalName} (${ORG.name}): integrador de infraestructura, servicios y proyectos de
tecnología para medianas y grandes empresas de Argentina. Más de 17 años, más de
400 proyectos entregados, más de 100 clientes. Un único responsable de cuenta, del
diagnóstico al soporte. Partner de Cisco, Microsoft, Palo Alto Networks, Check Point, Wacom, Namirial,
Nutanix, Pure Storage y HPE Aruba, entre otras.

Contacto: teléfono ${ORG.phoneDisplay}, email ${ORG.email}, WhatsApp comercial
+54 11 3300-1233. Horario: lunes a viernes de 9 a 18. Oficina en ${ORG.address.street}, ${ORG.address.locality}.

Cómo trabajamos: relevamiento y diagnóstico sin costo → propuesta con alcance y
plazos → implementación llave en mano → capacitación → soporte con SLA.

# Soluciones

${soluciones}

# Casos de éxito reales (los únicos que se pueden citar)

${casos}`;
  return cache;
}
