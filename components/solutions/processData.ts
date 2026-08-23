/**
 * Las cuatro etapas del método, por solución.
 *
 * Viven en su propio archivo y no dentro de `ProcessCardsRow` por la misma razón
 * que `partnersData.ts` y `homeCases.ts`: un dato importado desde un módulo
 * `"use client"` llega a un componente de servidor como referencia al cliente, no
 * como el objeto. Separarlo deja la puerta abierta a consumirlo desde el server
 * —el brochure en PDF lo hizo durante una versión— sin tener que volver a tocar
 * el componente.
 */

export type Step = { title: string; desc: string };

// Pasos por solución — lenguaje corporativo, tono de metodología. Sin números ni
// datos duros inventados: describe CÓMO se trabaja en cada disciplina.
export const BY_SLUG: Record<string, { name: string; steps: [Step, Step, Step, Step] }> = {
  networking: {
    // Espeja SOLUTIONS.networking.name en solutionsData.ts. Si uno cambia,
    // el otro también: son dos fuentes del mismo nombre.
    name: "Conectividad Crítica",
    steps: [
      { title: "Relevamiento", desc: "Auditamos tu red, el tráfico y los puntos críticos de la operación." },
      { title: "Arquitectura", desc: "Diseñamos topología, redundancia y capacidad dimensionada a tu demanda real." },
      { title: "Despliegue", desc: "Implementamos con ventanas de cambio coordinadas y mínima interrupción." },
      { title: "Operación", desc: "Monitoreo proactivo y soporte gestionado, con un único responsable." },
    ],
  },
  seguridad: {
    name: "Seguridad",
    steps: [
      { title: "Evaluación", desc: "Mapeamos la superficie de ataque, vulnerabilidades y brechas de cumplimiento." },
      { title: "Arquitectura Zero Trust", desc: "Definimos políticas, segmentación y controles por capa según tu operación." },
      { title: "Implementación", desc: "Desplegamos perímetro, endpoints y accesos con cronograma acordado." },
      { title: "Monitoreo", desc: "Vigilancia continua y respuesta ante incidentes, de punta a punta." },
    ],
  },
  "firma-biometrica": {
    name: "Firma Biométrica",
    steps: [
      { title: "Relevamiento", desc: "Analizamos tus circuitos de firma y los requisitos de validez legal." },
      { title: "Diseño", desc: "Definimos dispositivos, integración y flujo documental a medida." },
      { title: "Integración", desc: "Implementamos e integramos con tus sistemas, con puesta en marcha guiada." },
      { title: "Soporte", desc: "Acompañamiento y mejora continua del circuito, con un único responsable." },
    ],
  },
  consultoria: {
    name: "Consultoría",
    steps: [
      { title: "Diagnóstico", desc: "Relevamos tu ecosistema Microsoft, licencias y madurez de datos." },
      { title: "Estrategia", desc: "Trazamos la hoja de ruta, el gobierno y las prioridades del negocio." },
      { title: "Implementación", desc: "Configuramos y desplegamos con adopción guiada de tus equipos." },
      { title: "Optimización", desc: "Mejora continua y soporte, con un único responsable de tu cuenta." },
    ],
  },
  "software-ai": {
    name: "Software & AI",
    steps: [
      { title: "Descubrimiento", desc: "Entendemos tu problema, tus datos y tus objetivos antes de construir." },
      { title: "Diseño", desc: "Definimos arquitectura, modelo y alcance del producto a medida." },
      { title: "Desarrollo", desc: "Construimos por iteraciones, con entregas frecuentes y validación continua." },
      { title: "Evolución", desc: "Mantenimiento, monitoreo de modelos y evolución del producto." },
    ],
  },
};

export const FALLBACK: { name: string; steps: [Step, Step, Step, Step] } = {
  name: "",
  steps: [
    { title: "Diagnóstico", desc: "Relevamos infraestructura, operación y riesgos antes de proponer una solución." },
    { title: "Diseño", desc: "Arquitectura y plan a medida, dimensionado a tu operación real y documentado." },
    { title: "Implementación", desc: "Ejecución con cronograma acordado y ventanas de cambio coordinadas." },
    { title: "Soporte", desc: "Monitoreo continuo, con un único responsable de tu cuenta de punta a punta." },
  ],
};
