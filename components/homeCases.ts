// ⚠️ EJEMPLOS — reemplazar por casos reales (anónimos o autorizados) con
// métricas verificables antes de publicar. Fotos de Pexels (swappeables).
const px = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1200`;

export type HomeCase = {
  image: string;
  tag: string; // industria
  title: string; // el resultado (headline)
  desc: string; // una línea de contexto
  body: string[]; // relato editorial para el modal
};

export const HOME_CASES: HomeCase[] = [
  {
    image: px(4481259),
    tag: "Logística",
    title: "Red unificada en múltiples sedes, sin cortes críticos",
    desc: "Conectividad y ciberseguridad de misión crítica, con monitoreo continuo y un único responsable.",
    body: [
      "Un operador logístico con varios centros de distribución y sucursales sufría cortes frecuentes: equipos de distintas marcas, sin una arquitectura común. Cada incidente frenaba entregas y ningún proveedor se hacía responsable.",
      "Rediseñamos la red de punta a punta —switching, Wi-Fi gestionado y enlaces redundantes con failover— y unificamos el monitoreo en una sola consola, con Accedra como único interlocutor. La operación pasó a funcionar sin cortes críticos y los incidentes se resuelven desde un solo lugar.",
    ],
  },
  {
    image: px(259200),
    tag: "Banca",
    title: "Onboarding 100% digital con firma biométrica",
    desc: "Aperturas de cuenta sin papel, con identidad verificada y respaldo probatorio.",
    body: [
      "El alta de clientes dependía de trámites presenciales y papeleo, lo que generaba fricción, demoras y abandono durante el onboarding.",
      "Integramos firma digital biométrica al proceso de apertura, con verificación de identidad y respaldo probatorio. Hoy los clientes abren su cuenta de forma 100% digital, sin traslado de papel, conservando la validez jurídica de punta a punta.",
    ],
  },
  {
    image: px(3760067),
    tag: "Seguros",
    title: "Analítica de cartera unificada, en tiempo real",
    desc: "De datos dispersos a decisiones, con Power BI y gobernanza sobre toda la información.",
    body: [
      "Los datos de cartera estaban dispersos entre sistemas y los reportes llegaban tarde para decidir, sin una única fuente de verdad.",
      "Implementamos Power BI con gobernanza sobre todos los orígenes de datos del negocio. La dirección pasó a ver cartera, siniestralidad y rentabilidad en tiempo real, y las decisiones dejaron de depender de la intuición.",
    ],
  },
  {
    image: px(3735709),
    tag: "Salud",
    title: "Continuidad asegurada con arquitectura Zero Trust",
    desc: "Datos sensibles protegidos y operación estable ante amenazas, en infraestructura crítica.",
    body: [
      "Una red de centros de salud tenía sus sistemas críticos sobre una red plana, sin segmentación, exponiendo equipos y datos sensibles ante cualquier incidente en alguna de las sedes.",
      "Aplicamos segmentación por área, redundancia y una arquitectura Zero Trust con seguridad perimetral y de endpoints. El resultado fue una operación estable y protegida, con continuidad asegurada en una infraestructura que no puede detenerse.",
    ],
  },
];
