export type HomeCase = {
  image: string;
  tag: string; // industria
  title: string; // el resultado (headline)
  desc: string; // una línea de contexto
  body: string[]; // relato editorial para el modal
};

// Solo casos reales. Si el array queda vacío, la sección se oculta.
export const HOME_CASES: HomeCase[] = [
  {
    image: "/cases/andreani.jpg",
    tag: "Logística",
    title: "Red sin interrupciones para el líder logístico",
    desc: "Rediseño de red integral con Cisco: conectividad, seguridad y soporte para su operación nacional.",
    body: [
      "Andreani, la compañía líder en logística de la Argentina (75 años de trayectoria, +1.260 vehículos y 10 plantas de operación), atravesaba un crecimiento exponencial: +550 puntos de venta, 122 sucursales, más usuarios móviles y más aplicaciones en la nube. Eso trajo más movilidad, necesidad de robustez y mayor exposición a amenazas — y sus equipos necesitaban conectividad más allá de la red corporativa.",
      "Como partner de Cisco, rediseñamos la red de punta a punta: wireless gestionado, switching y routing de alta disponibilidad, seguridad integrada y un esquema flexible de licenciamiento y soporte — con monitoreo centralizado y gestión de accesos en todas sus locaciones.",
      "Hoy Andreani trabaja sin interrupciones ni retrasos, con visibilidad total de la operación y gestión de accesos centralizada en todas sus locaciones. Las caídas de red pasaron de 5 por semana a menos de 1 por mes.",
    ],
  },
  {
    image: "/cases/finning.jpg",
    tag: "Minería",
    title: "Conectividad crítica para minería, en todo el país",
    desc: "Redes, WiFi y conectividad satelital para operaciones mineras remotas, desplegadas en varias provincias.",
    body: [
      "Finning —dealer oficial de Caterpillar— opera en yacimientos y sucursales distribuidos por todo el país, muchos en zonas remotas y de difícil acceso donde la conectividad tradicional no llega. Necesitaba una red confiable que sostuviera la operación desde las oficinas hasta el playón donde se arman camiones y palas.",
      "Relevamos técnicamente cada sitio —con mapas de calor y planificación de cobertura— y desplegamos infraestructura de punta a punta: racks modernizados, energía protegida, cableado estructurado y WiFi interior y exterior donde hizo falta. Para los yacimientos sin fibra, sumamos conectividad satelital integrada a la red.",
      "El despliegue se ejecutó a lo largo de varias provincias —Catamarca, San Juan, Santa Cruz y Jujuy, entre otras—, sitio por sitio, y todo certificado según las normas de Seguridad e Higiene de la industria minera. Hoy las operaciones de Finning están conectadas de forma estable hasta en los rincones más aislados: oficinas, bodegas, truck shop y frentes de armado.",
    ],
  },
];
