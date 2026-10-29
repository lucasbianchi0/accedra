/**
 * Los atajos de la tarjeta del chat en cada portada.
 *
 * En primera persona porque se mandan tal cual como mensaje: son lo que diría
 * quien llega a esa página, no un menú de servicios. Las landings de industria
 * y de servicio usan los de su solución madre.
 */

export type Sugerencias = { saludo: string; atajos: string[] };

export const SUGERENCIAS_HOME: Sugerencias = {
  saludo: "Contame qué está frenando tu operación y te digo cómo lo resolveríamos.",
  atajos: [
    "La red se cae o anda lenta y nadie lo resuelve de fondo",
    "Queremos dejar de imprimir y firmar en papel",
    "Tenemos los datos en Excel y nadie ve los números a tiempo",
  ],
};

const POR_SOLUCION: Record<string, Sugerencias> = {
  networking: {
    saludo: "Contame cómo es tu red hoy y qué te está fallando: te digo por dónde empezaríamos.",
    atajos: [
      "Tenemos cortes y lentitud en la red y nadie lo resuelve de fondo",
      "Sumamos sucursales y cada una tiene una red distinta",
      "Necesitamos conectividad en un sitio remoto sin fibra",
    ],
  },
  "firma-biometrica": {
    saludo: "Contame qué documentos firman hoy y cómo: te digo cómo lo digitalizaríamos.",
    atajos: [
      "Queremos dejar de imprimir y firmar en papel en las sucursales",
      "Necesitamos que los clientes firmen desde el celular",
      "¿Qué validez legal tiene la firma biométrica?",
    ],
  },
  consultoria: {
    saludo: "Contame dónde viven tus datos y qué necesitás ver: te digo cómo lo armaríamos.",
    atajos: [
      "Tenemos los datos en Excel y nadie ve los números a tiempo",
      "Queremos tableros de Power BI para la dirección",
      "Necesitamos ordenar las licencias de Microsoft 365",
    ],
  },
  seguridad: {
    saludo: "Contame cómo está protegida tu empresa hoy: te digo qué priorizaríamos.",
    atajos: [
      "Nos preocupa un ataque de ransomware",
      "No sabemos qué tan expuestos estamos",
      "Tenemos gente trabajando remoto sin control de accesos",
    ],
  },
  "software-ai": {
    saludo: "Contame qué proceso querés automatizar o qué probaron con IA: te digo cómo lo llevaríamos a producción.",
    atajos: [
      "Probamos IA y funcionó en la demo, pero no llegó a producción",
      "Tenemos procesos manuales en planillas que ya no escalan",
      "Queremos un asistente con IA conectado a nuestros sistemas",
    ],
  },
};

export function sugerenciasPara(slug?: string): Sugerencias {
  return (slug && POR_SOLUCION[slug]) || SUGERENCIAS_HOME;
}
