/**
 * Los atajos de la tarjeta del chat en cada portada.
 *
 * El `texto` va en primera persona porque se manda tal cual como mensaje: es
 * lo que diría quien llega a esa página, no un menú de servicios. La `label`
 * es lo que se ve en el chip, corta para que entren tres en una fila. Las
 * landings de industria y de servicio usan los de su solución madre.
 */

export type Atajo = { label: string; texto: string };
/** `titulo`: la pregunta grande de la portada, corta. */
export type Sugerencias = { titulo: string; saludo: string; atajos: Atajo[] };

export const SUGERENCIAS_HOME: Sugerencias = {
  titulo: "¿Qué está frenando tu operación?",
  saludo: "Contame qué está frenando tu operación y te digo cómo lo resolveríamos.",
  atajos: [
    { label: "Red lenta", texto: "La red se cae o anda lenta y nadie lo resuelve de fondo" },
    { label: "Firmar sin papel", texto: "Queremos dejar de imprimir y firmar en papel" },
    { label: "Datos y tableros", texto: "Tenemos los datos en Excel y nadie ve los números a tiempo" },
  ],
};

const POR_SOLUCION: Record<string, Sugerencias> = {
  networking: {
    titulo: "¿Qué le está fallando a tu red?",
    saludo: "Contame cómo es tu red hoy y qué te está fallando: te digo por dónde empezaríamos.",
    atajos: [
      { label: "Cortes en la red", texto: "Tenemos cortes y lentitud en la red y nadie lo resuelve de fondo" },
      { label: "Sucursales", texto: "Sumamos sucursales y cada una tiene una red distinta" },
      { label: "Sitio remoto", texto: "Necesitamos conectividad en un sitio remoto sin fibra" },
    ],
  },
  "firma-biometrica": {
    titulo: "¿Cómo firman hoy en tu empresa?",
    saludo: "Contame qué documentos firman hoy y cómo: te digo cómo lo digitalizaríamos.",
    atajos: [
      { label: "Firmar sin papel", texto: "Queremos dejar de imprimir y firmar en papel en las sucursales" },
      { label: "Firma desde el celular", texto: "Necesitamos que los clientes firmen desde el celular" },
      { label: "Validez legal", texto: "¿Qué validez legal tiene la firma biométrica?" },
    ],
  },
  consultoria: {
    titulo: "¿Qué números necesitás ver?",
    saludo: "Contame dónde viven tus datos y qué necesitás ver: te digo cómo lo armaríamos.",
    atajos: [
      { label: "Datos y tableros", texto: "Tenemos los datos en Excel y nadie ve los números a tiempo" },
      { label: "Power BI", texto: "Queremos tableros de Power BI para la dirección" },
      { label: "Microsoft 365", texto: "Necesitamos ordenar las licencias de Microsoft 365" },
    ],
  },
  seguridad: {
    titulo: "¿Qué te preocupa de tu seguridad?",
    saludo: "Contame cómo está protegida tu empresa hoy: te digo qué priorizaríamos.",
    atajos: [
      { label: "Ransomware", texto: "Nos preocupa un ataque de ransomware" },
      { label: "Nivel de exposición", texto: "No sabemos qué tan expuestos estamos" },
      { label: "Acceso remoto", texto: "Tenemos gente trabajando remoto sin control de accesos" },
    ],
  },
  "software-ai": {
    titulo: "¿Qué proceso querés automatizar?",
    saludo: "Contame qué proceso querés automatizar o qué probaron con IA: te digo cómo lo llevaríamos a producción.",
    atajos: [
      { label: "IA a producción", texto: "Probamos IA y funcionó en la demo, pero no llegó a producción" },
      { label: "Automatizar procesos", texto: "Tenemos procesos manuales en planillas que ya no escalan" },
      { label: "Asistente con IA", texto: "Queremos un asistente con IA conectado a nuestros sistemas" },
    ],
  },
};

export function sugerenciasPara(slug?: string): Sugerencias {
  return (slug && POR_SOLUCION[slug]) || SUGERENCIAS_HOME;
}
