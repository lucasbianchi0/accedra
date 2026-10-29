import {
  BarChart3, Bot, Building2, Cable, Cpu, FileCheck2, Mountain, PenTool, Radar, Scale, ShieldAlert,
  Smartphone, Sparkles, Users, Wifi,
  type LucideIcon,
} from "lucide-react";

/**
 * La pregunta y las acciones del asistente en cada portada.
 *
 * El `texto` va en primera persona porque se manda tal cual como mensaje: es
 * lo que diría quien llega a esa página, no un menú de servicios. La `label`
 * es lo que se ve en el chip, corta para que entren en una fila. Las landings
 * de industria y de servicio usan las de su solución madre.
 */

export type Atajo = { label: string; texto: string; icono: LucideIcon };
/** `titulo`: la pregunta grande sobre el campo, corta. */
export type Sugerencias = { titulo: string; atajos: Atajo[] };

export const SUGERENCIAS_HOME: Sugerencias = {
  titulo: "¿En qué te podemos ayudar hoy?",
  atajos: [
    { label: "La red se cae", icono: Wifi, texto: "La red se cae o anda lenta y nadie lo resuelve de fondo" },
    { label: "Firmar sin papel", icono: PenTool, texto: "Queremos dejar de imprimir y firmar en papel" },
    { label: "Datos y tableros", icono: BarChart3, texto: "Tenemos los datos en Excel y nadie ve los números a tiempo" },
    { label: "Ciberseguridad", icono: ShieldAlert, texto: "Nos preocupa la ciberseguridad de la empresa, ¿por dónde arrancamos?" },
    { label: "Automatizar con IA", icono: Sparkles, texto: "Tenemos procesos manuales que queremos automatizar con IA" },
  ],
};

const POR_SOLUCION: Record<string, Sugerencias> = {
  networking: {
    titulo: "¿Qué le está fallando a tu red?",
    atajos: [
      { label: "Cortes en la red", icono: Wifi, texto: "Tenemos cortes y lentitud en la red y nadie lo resuelve de fondo" },
      { label: "Sucursales", icono: Building2, texto: "Sumamos sucursales y cada una tiene una red distinta" },
      { label: "Sitio remoto", icono: Mountain, texto: "Necesitamos conectividad en un sitio remoto sin fibra" },
      { label: "Cableado", icono: Cable, texto: "Necesitamos cablear una planta u oficina nueva" },
    ],
  },
  "firma-biometrica": {
    titulo: "¿Cómo firman hoy en tu empresa?",
    atajos: [
      { label: "Firmar sin papel", icono: PenTool, texto: "Queremos dejar de imprimir y firmar en papel en las sucursales" },
      { label: "Firma desde el celular", icono: Smartphone, texto: "Necesitamos que los clientes firmen desde el celular" },
      { label: "Validez legal", icono: Scale, texto: "¿Qué validez legal tiene la firma biométrica?" },
    ],
  },
  consultoria: {
    titulo: "¿Qué números necesitás ver?",
    atajos: [
      { label: "Datos y tableros", icono: BarChart3, texto: "Tenemos los datos en Excel y nadie ve los números a tiempo" },
      { label: "Power BI", icono: FileCheck2, texto: "Queremos tableros de Power BI para la dirección" },
      { label: "Microsoft 365", icono: Users, texto: "Necesitamos ordenar las licencias de Microsoft 365" },
    ],
  },
  seguridad: {
    titulo: "¿Qué te preocupa de tu seguridad?",
    atajos: [
      { label: "Ransomware", icono: ShieldAlert, texto: "Nos preocupa un ataque de ransomware" },
      { label: "Nivel de exposición", icono: Radar, texto: "No sabemos qué tan expuestos estamos" },
      { label: "Acceso remoto", icono: Users, texto: "Tenemos gente trabajando remoto sin control de accesos" },
    ],
  },
  "software-ai": {
    titulo: "¿Qué proceso querés automatizar?",
    atajos: [
      { label: "IA a producción", icono: Sparkles, texto: "Probamos IA y funcionó en la demo, pero no llegó a producción" },
      { label: "Automatizar procesos", icono: Cpu, texto: "Tenemos procesos manuales en planillas que ya no escalan" },
      { label: "Asistente con IA", icono: Bot, texto: "Queremos un asistente con IA conectado a nuestros sistemas" },
    ],
  },
};

export function sugerenciasPara(slug?: string): Sugerencias {
  return (slug && POR_SOLUCION[slug]) || SUGERENCIAS_HOME;
}
