export type CaseStat = {
  value: string;
  label: string;
  icon: "shield" | "gauge" | "headset" | "satellite" | "pen" | "check" | "lock" | "network";
};

export type HomeCase = {
  image: string;
  tag: string; // industria (chip sobre la imagen)
  category: string; // bucket para el filtro
  title: string; // el resultado (headline)
  desc: string; // una línea de contexto
  stats: CaseStat[]; // 3 métricas duras que se muestran en la card
  body: string[]; // relato editorial para el modal
};

// Solo casos reales. Si el array queda vacío, la sección se oculta.
export const HOME_CASES: HomeCase[] = [
  {
    image: "/cases/andreani.jpg",
    tag: "Logística",
    category: "Infraestructura",
    title: "Red sin interrupciones para el líder logístico",
    desc: "Rediseño de red integral con Cisco: conectividad, seguridad y soporte para su operación nacional.",
    stats: [
      { value: "99,99%", label: "Disponibilidad", icon: "shield" },
      { value: "+40%", label: "Rendimiento", icon: "gauge" },
      { value: "24/7", label: "Soporte", icon: "headset" },
    ],
    body: [
      "Andreani, la compañía líder en logística de la Argentina (75 años de trayectoria, +1.260 vehículos y 10 plantas de operación), atravesaba un crecimiento exponencial: +550 puntos de venta, 122 sucursales, más usuarios móviles y más aplicaciones en la nube. Eso trajo más movilidad, necesidad de robustez y mayor exposición a amenazas — y sus equipos necesitaban conectividad más allá de la red corporativa.",
      "Como partner de Cisco, rediseñamos la red de punta a punta: wireless gestionado, switching y routing de alta disponibilidad, seguridad integrada y un esquema flexible de licenciamiento y soporte — con monitoreo centralizado y gestión de accesos en todas sus locaciones.",
      "Hoy Andreani trabaja sin interrupciones ni retrasos, con visibilidad total de la operación y gestión de accesos centralizada en todas sus locaciones. Las caídas de red pasaron de 5 por semana a menos de 1 por mes.",
    ],
  },
  {
    image: "/cases/finning.jpg",
    tag: "Minería",
    category: "Conectividad",
    title: "Conectividad crítica para minería, en todo el país",
    desc: "Redes, WiFi y conectividad satelital para operaciones mineras remotas, desplegadas en varias provincias.",
    stats: [
      { value: "15+", label: "Sitios conectados", icon: "satellite" },
      { value: "100%", label: "Cobertura crítica", icon: "shield" },
      { value: "< 50ms", label: "Latencia", icon: "gauge" },
    ],
    body: [
      "Finning —dealer oficial de Caterpillar— opera en yacimientos y sucursales distribuidos por todo el país, muchos en zonas remotas y de difícil acceso donde la conectividad tradicional no llega. Necesitaba una red confiable que sostuviera la operación desde las oficinas hasta el playón donde se arman camiones y palas.",
      "Relevamos técnicamente cada sitio —con mapas de calor y planificación de cobertura— y desplegamos infraestructura de punta a punta: racks modernizados, energía protegida, cableado estructurado y WiFi interior y exterior donde hizo falta. Para los yacimientos sin fibra, sumamos conectividad satelital integrada a la red.",
      "El despliegue se ejecutó a lo largo de varias provincias —Catamarca, San Juan, Santa Cruz y Jujuy, entre otras—, sitio por sitio, y todo certificado según las normas de Seguridad e Higiene de la industria minera. Hoy las operaciones de Finning están conectadas de forma estable hasta en los rincones más aislados: oficinas, bodegas, truck shop y frentes de armado.",
    ],
  },
  {
    image: "/images/5904065.jpg",
    tag: "Banca",
    category: "Transformación Digital",
    title: "Banco Provincia digitaliza la firma en toda su red de sucursales",
    desc: "Firma biométrica digital llave en mano: +4.400 pantallas Wacom en 400 sucursales, integrada 100% por Accedra.",
    stats: [
      { value: "4.400", label: "Pantallas Wacom", icon: "pen" },
      { value: "100%", label: "Integración", icon: "check" },
      { value: "Seguridad", label: "biométrica", icon: "lock" },
    ],
    body: [
      "El Banco de la Provincia de Buenos Aires —una de las entidades financieras más grandes de la Argentina— operaba sus trámites de sucursal sobre un circuito de papel: impresión de formularios, firma manuscrita, escaneo y archivo físico. Eso generaba demoras en la atención, costos crecientes de impresión y logística documental, y riesgos operativos en el manejo del papel. El objetivo: digitalizar de punta a punta la firma en toda la red, sin fricción para el cliente ni el personal, y con plena validez de la firma capturada.",
      "Accedra implementó una solución integral de firma biométrica digital llave en mano, desplegada en las 400 sucursales del banco con más de 4.400 pantallas de firma Wacom, diseñadas para la captura de firma manuscrita en entornos bancarios de alta demanda. La integramos de forma nativa con los sistemas core del banco, digitalizando más de 620 formularios operativos. Cada firma se registra con sus parámetros biométricos (presión, velocidad, trazo y tiempos), vinculada de forma segura e inalterable al documento. Fue un modelo llave en mano de punta a punta: relevamiento, hardware, integración de software, despliegue, capacitación y soporte, con integración 100% realizada por Accedra.",
      "El circuito de firma pasó a ser 100% digital: se eliminaron por completo las impresiones y los escaneos. Los trámites son más rápidos, con menos pasos manuales y menor tiempo de espera; hay un ahorro significativo en papel, impresión, traslado y archivo; y una trazabilidad de punta a punta, con el documento firmado disponible al instante. La firma biométrica queda ligada al documento con garantías de integridad y valor probatorio, reforzando el cumplimiento normativo — en cada una de las 400 sucursales.",
    ],
  },
];
