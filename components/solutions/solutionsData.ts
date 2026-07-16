import {
  Network, SquarePen, LayoutDashboard, ShieldCheck,
  Cable, Waypoints, Wifi, Phone, Server,
  PenTool, FileSignature, Receipt, Smartphone, Fingerprint, Blocks,
  BarChart3, Users, Database, Cloud, Workflow, BadgeCheck,
  Flame, Bug, CloudCog, Laptop, MailCheck, Lock,
  Sparkles, Code2, Bot, BrainCircuit, Cpu,
  type LucideIcon,
} from "lucide-react";

const photo = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1920`;

const video = (id: number) =>
  `https://videos.pexels.com/video-files/${id}/${id}-hd_1920_1080_25fps.mp4`;

export type Capability = { icon: LucideIcon; title: string; desc: string; photo?: string };

// Caso de éxito por solución. ⚠️ EJEMPLOS — reemplazar por casos reales
// (anónimos o autorizados) con métricas verificables antes de publicar.
export type Case = {
  industry: string;
  challenge: string;
  solution: string;
  result: string;
  body?: string[]; // relato editorial (párrafos) para el modal
};

// Contenido a medida por industria (opcional). Lo que no se define acá cae
// automáticamente al contenido base de la solución + el marco de la industria.
export type IndustryContent = {
  subtitle?: string;
  painsTitle?: string;
  pains?: string[];
};

export type Solution = {
  slug: string;
  name: string;
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  highlight: string; // gradient-highlighted tail of the title
  subtitle: string;
  heroImage: string; // poster / fallback for the hero video
  heroVideo: string;
  introTitle: string;
  intro: string;
  painsTitle: string; // headline del bloque "¿te suena esta situación?"
  pains: string[]; // dolores en primera persona del prospecto
  capabilities: Capability[];
  cases: Case[];
  tech: string[];
  brands: string[]; // claves de TECH_LOGOS que se muestran a color en la portada
  brandsLabel?: string; // label sobre los logos (default: "Partner certificado de")
  benefitsTitle: string;
  benefits: string[];
  industries?: string[];
  industryContent?: Record<string, IndustryContent>;
  metaTitle: string;
  metaDescription: string;
};

export const SOLUTIONS: Record<string, Solution> = {
  networking: {
    slug: "networking",
    name: "Networking",
    icon: Network,
    eyebrow: "Soluciones IT",
    title: "Networking de",
    highlight: "alta disponibilidad.",
    subtitle:
      "Diseñamos, instalamos y mantenemos la infraestructura de red que tu operación necesita — del cableado a la nube, sin puntos ciegos.",
    heroImage: photo(4682189),
    heroVideo: video(3141210),
    introTitle: "Una sola red. Un solo responsable.",
    intro:
      "Como Partner Certificado de las principales marcas de networking, integramos redes robustas, seguras y escalables para medianas y grandes empresas. Nos ocupamos de cada capa — cableado, switching, wireless, voz y seguridad — para que tu operación nunca se detenga.",
    painsTitle: "¿Te suena alguna de estas situaciones?",
    pains: [
      "Tu red quedó chica frente al crecimiento de la operación.",
      "Tenés cortes o lentitud que frenan la productividad y nadie los resuelve de fondo.",
      "Sumaste sucursales o usuarios remotos sin una arquitectura que los unifique.",
      "Dependés de varios proveedores y ninguno se hace responsable de punta a punta.",
    ],
    capabilities: [
      { icon: Cable, title: "Cableado estructurado", desc: "Integración certificada de voz, datos, video, seguridad y domótica sobre una infraestructura ordenada y lista para escalar." },
      { icon: Waypoints, title: "Switching & Routing", desc: "Conmutación y ruteo Cisco / Meraki para conectar cada dispositivo con performance y baja latencia." },
      { icon: Wifi, title: "Wireless corporativo", desc: "Wi-Fi de alta densidad con acceso seguro y cobertura total en toda la organización." },
      { icon: Phone, title: "Telefonía IP · VoIP", desc: "Telefonía IP integrada que unifica las comunicaciones de tu empresa en una sola plataforma." },
      { icon: ShieldCheck, title: "Seguridad de red", desc: "Protección perimetral y segmentación contra amenazas y ataques cifrados." },
      { icon: Server, title: "Contingencia & Entorno", desc: "Redundancia y recuperación ante fallos de hardware o software para máxima continuidad." },
    ],
    cases: [
      { industry: "Logística", challenge: "Depósitos y sucursales sobre redes dispares, con cortes frecuentes que frenaban la operación.", solution: "Arquitectura unificada con switching Cisco, Wi-Fi gestionado y enlaces redundantes.", result: "Red única monitoreada, caídas reducidas al mínimo y un solo responsable de punta a punta.", body: ["El operador manejaba varios centros de distribución y sucursales conectados con equipos de distintas marcas y sin una arquitectura común. Los cortes eran frecuentes y, cuando algo fallaba, no había un responsable claro: cada proveedor señalaba a otro.", "Rediseñamos la red de punta a punta con switching Cisco, Wi-Fi gestionado de alta densidad y enlaces redundantes con failover automático. Unificamos el monitoreo en una sola consola y definimos un SLA con Accedra como único interlocutor. Hoy la operación funciona sin cortes críticos y cualquier incidente se resuelve desde un solo lugar."] },
      { industry: "Salud", challenge: "Segmentación deficiente y riesgo sobre sistemas críticos en varias sedes.", solution: "Rediseño de red con segmentación, redundancia y seguridad perimetral.", result: "Operación estable y continuidad asegurada en la infraestructura crítica.", body: ["Una red de centros de salud tenía sus sistemas críticos sobre una red plana, sin segmentación, lo que exponía equipos y datos sensibles ante cualquier incidente en alguna de las sedes.", "Implementamos un rediseño con segmentación por área, redundancia y seguridad perimetral, separando el tráfico crítico del administrativo y sumando recuperación ante fallos. El resultado fue una operación estable, con continuidad asegurada en una infraestructura que no puede detenerse."] },
      { industry: "Retail", challenge: "Sucursales aisladas, sin una arquitectura común ni visibilidad central.", solution: "Red multi-sede con gestión centralizada y Wi-Fi seguro para clientes.", result: "Todas las sucursales conectadas y monitoreadas desde un solo lugar.", body: ["La cadena crecía sumando sucursales, pero cada una era una isla: sin arquitectura común, sin visibilidad central y con el Wi-Fi de clientes mezclado con la operación.", "Desplegamos una red multi-sede con gestión centralizada, separando la red de clientes de la operativa y estandarizando el equipamiento. Ahora todas las sucursales están conectadas y monitoreadas desde un solo panel, y sumar una nueva es cuestión de días, no de semanas."] },
    ],
    tech: ["Cisco", "Meraki", "Aruba", "Juniper", "Huawei", "Ubiquiti", "Avaya", "APC", "Vertiv", "SonicWall"],
    brands: ["Cisco", "Meraki", "Aruba", "Juniper", "Huawei", "Ubiquiti", "Avaya", "APC", "Vertiv", "SonicWall"],
    benefitsTitle: "Por qué elegir a Accedra",
    benefits: [
      "Partner certificado de las marcas líderes",
      "Integración de voz, datos, video y seguridad",
      "Monitoreo proactivo de la infraestructura",
      "Transición rápida a sistemas redundantes",
      "SLA definido por contrato y soporte on-site",
      "Un único interlocutor de punta a punta",
    ],
    industryContent: {
      logistica: {
        subtitle:
          "Conectividad de misión crítica para centros de distribución, depósitos y flotas — sin cortes que frenen la operación 24/7.",
        pains: [
          "Un corte de red frena la operación y retrasa entregas.",
          "Tus depósitos y sucursales no comparten una red unificada y segura.",
          "El Wi-Fi no llega a toda la planta o pierde señal en zonas críticas.",
          "No tenés redundancia ni un responsable único ante fallas.",
        ],
      },
      retail: {
        subtitle:
          "Redes que sostienen múltiples sucursales, puntos de venta y picos de demanda — con Wi-Fi seguro para clientes y operación.",
        pains: [
          "Sumás sucursales y cada una es una isla sin arquitectura común.",
          "El punto de venta se cae en el peor momento (picos de venta).",
          "Ofrecés Wi-Fi a clientes sin separar la red de la operación.",
          "No tenés visibilidad centralizada de todas las sucursales.",
        ],
      },
      bancos: {
        subtitle:
          "Conectividad de misión crítica para sucursales, cajeros y datacenter — con la disponibilidad y seguridad que exige el sector financiero.",
        pains: [
          "Un corte de red frena cajeros, sucursales y operaciones críticas.",
          "Necesitás segmentar y proteger la red según normativa financiera.",
          "Tus sucursales no comparten una arquitectura unificada y segura.",
          "No tenés redundancia ni un responsable único ante incidentes.",
        ],
      },
      seguros: {
        subtitle:
          "Redes que conectan casa central, sucursales y productores con la disponibilidad y seguridad para operar sin interrupciones.",
        pains: [
          "Sucursales y productores trabajan sobre redes dispares y poco seguras.",
          "Los cortes afectan la atención y la emisión de pólizas.",
          "No tenés visibilidad centralizada de toda la red.",
          "Falta redundancia para sostener la operación crítica.",
        ],
      },
      juridicos: {
        subtitle:
          "Infraestructura de red segura y confiable para estudios que manejan información confidencial y no pueden permitirse cortes.",
        pains: [
          "Manejás información confidencial sobre una red sin protección adecuada.",
          "Cortes o lentitud frenan la operación diaria del estudio.",
          "El Wi-Fi no cubre bien todas las áreas de trabajo.",
          "No tenés un único responsable de tu infraestructura.",
        ],
      },
      laboratorios: {
        subtitle:
          "Redes de alta disponibilidad para laboratorios y centros de salud, donde una caída interrumpe la operación y la atención.",
        pains: [
          "Un corte de red interrumpe equipos, sistemas y atención.",
          "Manejás datos sensibles sobre una red que debe estar protegida.",
          "Distintas sedes no comparten una red unificada.",
          "No contás con redundancia ni soporte on-site rápido.",
        ],
      },
    },
    metaTitle: "Networking · Accedra",
    metaDescription:
      "Infraestructura de red de alta disponibilidad: cableado estructurado, switching, wireless y VoIP. Partner certificado Cisco, Aruba y más.",
  },

  "firma-biometrica": {
    slug: "firma-biometrica",
    name: "Firma Biométrica",
    icon: SquarePen,
    eyebrow: "Nuestro diferencial",
    title: "Firma electrónica, biométrica y",
    highlight: "digital.",
    subtitle:
      "Soluciones de firma electrónica, biométrica y digital según el caso de uso, el proceso y el marco normativo aplicable — con trazabilidad total y sin demoras.",
    heroImage: photo(9929279),
    heroVideo: video(5311423),
    introTitle: "El papel es opcional. La validez legal, no.",
    intro:
      "Somos de los pocos integradores del país con una vertical propia de firma electrónica, biométrica y digital. Digitalizamos los procesos documentales de bancos, aseguradoras y salud, eliminando el papel y resguardando la validez jurídica de cada proceso según la normativa aplicable.",
    painsTitle: "¿Te suena alguna de estas situaciones?",
    pains: [
      "Seguís moviendo papel, firmas y expedientes físicos que frenan tus procesos.",
      "Necesitás digitalizar trámites sin perder validez jurídica ni trazabilidad.",
      "Perdés clientes por procesos de firma lentos, presenciales o con fricción.",
      "Tenés que garantizar identidad y respaldo probatorio y no sabés con qué herramienta.",
    ],
    capabilities: [
      { icon: PenTool, title: "Firma manuscrita biométrica", desc: "Captura de la firma con datos biométricos sobre tabletas Wacom certificadas, con validez legal según el marco normativo aplicable.", photo: photo(4021256) },
      { icon: FileSignature, title: "eSignAnywhere", desc: "Plataforma empresarial para leer, editar y firmar documentos desde cualquier dispositivo, en cualquier momento y lugar.", photo: photo(590020) },
      { icon: Receipt, title: "Factoring digital", desc: "Soluciones de factoring 100% digital, ágiles, auditables y sin fricción.", photo: photo(6693655) },
      { icon: Smartphone, title: "Firma mobile", desc: "Firma de documentos desde el celular, integrada de forma nativa a tus procesos.", photo: photo(5240544) },
      { icon: Fingerprint, title: "Multibiometría", desc: "Múltiples factores biométricos para máxima seguridad de identidad y no repudio.", photo: photo(5380664) },
      { icon: Blocks, title: "Integración homogénea", desc: "Se integra a tus sistemas, canales y flujos existentes de forma transparente.", photo: photo(546819) },
    ],
    cases: [
      { industry: "Banca", challenge: "Onboarding presencial con papeleo que generaba fricción y demoras en el alta de clientes.", solution: "Firma digital biométrica integrada al proceso de apertura, con identidad verificada.", result: "Aperturas 100% digitales, con respaldo probatorio y sin traslado de papel.", body: ["El alta de clientes seguía dependiendo de firmas presenciales y papeleo, lo que generaba fricción, demoras y abandono durante el onboarding.", "Integramos firma digital biométrica directamente al proceso de apertura, con verificación de identidad y respaldo probatorio de cada operación. Los clientes pueden abrir su cuenta de forma 100% digital, sin traslado de papel, y el banco conserva la validez jurídica de punta a punta."] },
      { industry: "Seguros", challenge: "Emisión de pólizas y siniestros dependiente de trámites presenciales.", solution: "eSignAnywhere integrado a los procesos de suscripción y siniestros.", result: "Firma a distancia, menos tiempos de contratación y trazabilidad completa.", body: ["La emisión de pólizas y la gestión de siniestros dependían de trámites presenciales y expedientes en papel, alargando los tiempos de contratación.", "Incorporamos eSignAnywhere a los procesos de suscripción y siniestros, permitiendo firmar a distancia desde cualquier dispositivo. Se redujeron los tiempos, se eliminó el papel y quedó una trazabilidad completa de cada firma."] },
      { industry: "Salud", challenge: "Consentimientos y protocolos en papel, difíciles de auditar y resguardar.", solution: "Firma digital de consentimientos con identidad y trazabilidad.", result: "Archivo sin papel, con trazabilidad total y cumplimiento probatorio.", body: ["Los consentimientos y protocolos se manejaban en papel, lo que dificultaba auditar, resguardar y encontrar la documentación cuando se la necesitaba.", "Digitalizamos la firma de consentimientos con identidad verificada y trazabilidad de cada documento. El archivo pasó a ser 100% digital, con cumplimiento probatorio y acceso inmediato a cada expediente."] },
    ],
    tech: ["Wacom", "Namirial", "eSignAnywhere", "Gemalto", "Criptografía RSA", "SHA-256", "ISO"],
    brands: ["Wacom", "Namirial", "Thales"],
    benefitsTitle: "Beneficios",
    benefits: [
      "Validez jurídica y no repudio",
      "Auditoría completa y control de cambios",
      "Criptografía avanzada (RSA / SHA-256)",
      "Alineado a la normativa vigente y estándares ISO",
      "Menos papel: responsabilidad ambiental",
      "ROI demostrable en el corto plazo",
    ],
    industries: ["Banca", "Fintech", "Seguros", "Salud", "Telco", "Logística", "Retail", "Educación", "Automotriz", "Farmacéutica"],
    industryContent: {
      juridicos: {
        subtitle:
          "Firmá contratos, poderes y escritos con validez legal y trazabilidad total — sin imprimir, escanear ni trasladar papel.",
        pains: [
          "Seguís gestionando firmas de clientes de forma presencial o en papel.",
          "Necesitás resguardo probatorio y confidencialidad de cada documento.",
          "Los tiempos de firma demoran la operación de tus expedientes.",
          "Tenés que garantizar la identidad del firmante de forma fehaciente.",
        ],
      },
      bancos: {
        subtitle:
          "Onboarding, aperturas y contratos firmados digitalmente con identidad verificada y respaldo probatorio de nivel financiero.",
        pains: [
          "El alta de clientes exige presencialidad o papeleo que genera fricción.",
          "Necesitás no repudio e identidad verificada en cada operación.",
          "Los procesos documentales no escalan al volumen del banco.",
          "Debés cumplir requisitos de trazabilidad y auditoría estrictos.",
        ],
      },
      seguros: {
        subtitle:
          "Pólizas, siniestros y endosos firmados a distancia — más rápido, sin papel y con validez jurídica de punta a punta.",
        pains: [
          "La firma de pólizas y siniestros depende de trámites presenciales.",
          "Perdés clientes por procesos de contratación lentos.",
          "Necesitás trazabilidad y respaldo probatorio de cada firma.",
          "Los expedientes en papel complican la auditoría y el archivo.",
        ],
      },
      laboratorios: {
        subtitle:
          "Consentimientos, informes y trazabilidad documental firmados digitalmente — con identidad y respaldo probatorio.",
        pains: [
          "Los consentimientos y protocolos siguen dependiendo del papel.",
          "Necesitás trazabilidad e identidad en documentación sensible.",
          "El archivo físico complica auditorías y cumplimiento.",
          "Los procesos de firma frenan la operación clínica o de laboratorio.",
        ],
      },
      logistica: {
        subtitle:
          "Remitos, contratos y conformidades firmados digitalmente — sin papel, con trazabilidad de punta a punta.",
        pains: [
          "Los remitos y conformidades siguen en papel y se pierden.",
          "Necesitás trazabilidad de cada entrega y firma.",
          "Los procesos de firma en papel frenan la operación.",
          "El archivo físico complica auditorías y reclamos.",
        ],
      },
      retail: {
        subtitle:
          "Contratos con proveedores, empleados y clientes firmados digitalmente — ágil, sin papel y con validez jurídica.",
        pains: [
          "La firma de contratos y altas depende de papel y presencialidad.",
          "Coordinás firmas entre múltiples sucursales y proveedores.",
          "Los procesos lentos generan fricción y demoras.",
          "El archivo físico complica el control y la auditoría.",
        ],
      },
    },
    metaTitle: "Firma Digital & Biométrica · Accedra",
    metaDescription:
      "Firma electrónica, biométrica y digital según la normativa aplicable: eSignAnywhere, tabletas Wacom, factoring digital. Digitalización documental sin papel.",
  },

  consultoria: {
    slug: "consultoria",
    name: "Consultoría Microsoft",
    icon: LayoutDashboard,
    eyebrow: "Soluciones IT",
    title: "Tus datos, convertidos en",
    highlight: "decisiones.",
    subtitle:
      "Convertimos la tecnología Microsoft que ya tenés en una ventaja competitiva real — de la colaboración diaria a la analítica ejecutiva.",
    heroImage: photo(577210),
    heroVideo: video(3195394),
    introTitle: "El conocimiento, al alcance de toda la organización.",
    intro:
      "Consultores certificados que implementan y optimizan el ecosistema Microsoft completo: Power BI, Microsoft 365, Dynamics, SharePoint y Azure. Datos que se conectan, se ordenan y se convierten en decisiones con una perspectiva de 360°.",
    painsTitle: "¿Te suena alguna de estas situaciones?",
    pains: [
      "Tenés datos por todos lados, pero no información clara para decidir.",
      "Pagás licencias Microsoft que tu equipo usa a medias.",
      "Tu gente pierde horas en tareas manuales y repetitivas.",
      "Los reportes llegan tarde, armados a mano y sin una única fuente de verdad.",
    ],
    capabilities: [
      { icon: BarChart3, title: "Power BI", desc: "Dashboards ejecutivos y análisis ad hoc: conexión a múltiples orígenes, informes en web y móvil, y una perspectiva de 360°." },
      { icon: Users, title: "Microsoft 365 & Teams", desc: "Colaboración y productividad unificada para todos tus equipos." },
      { icon: Database, title: "Dynamics 365 & SharePoint", desc: "CRM/ERP y gestión documental integrados a tu operación." },
      { icon: Cloud, title: "Azure Cloud", desc: "Migración e infraestructura en la nube de Microsoft, con gobernanza y seguridad." },
      { icon: Workflow, title: "Power Automate", desc: "Automatización de flujos de trabajo repetitivos para ganar tiempo." },
      { icon: BadgeCheck, title: "Licenciamiento & CSP", desc: "Gestión y optimización de licencias como Cloud Solution Provider." },
    ],
    cases: [
      { industry: "Retail", challenge: "Reportes de venta y stock armados a mano, sin una única fuente de verdad entre sucursales.", solution: "Tableros Power BI conectados a todos los orígenes de datos del negocio.", result: "Decisiones en tiempo real, con ventas, stock y márgenes consolidados.", body: ["Los reportes de venta y stock se armaban a mano en planillas, cada sucursal con su propio criterio, sin una única fuente de verdad para decidir.", "Conectamos Power BI a todos los orígenes de datos del negocio y construimos tableros ejecutivos. Hoy la dirección ve ventas, stock y márgenes consolidados en tiempo real, y las decisiones dejaron de depender de la intuición."] },
      { industry: "Seguros", challenge: "Datos de cartera dispersos y sin gobierno, con reportes que llegaban tarde.", solution: "Microsoft 365 + Power BI con gobernanza y seguridad integradas.", result: "Analítica de cartera y productividad unificada en toda la organización.", body: ["Los datos de cartera estaban dispersos entre sistemas, sin gobierno ni seguridad, y los reportes llegaban tarde para la toma de decisiones.", "Implementamos Microsoft 365 y Power BI con gobernanza y seguridad integradas. La analítica de cartera quedó unificada y la productividad de los equipos subió al trabajar sobre una misma plataforma."] },
      { industry: "Industria", challenge: "Procesos manuales y repetitivos que consumían horas del equipo.", solution: "Automatización de flujos con Power Automate integrada a sus sistemas.", result: "Horas de trabajo recuperadas cada semana y menos errores.", body: ["Buena parte del día del equipo se iba en tareas manuales y repetitivas —copiar datos, generar reportes, mover información entre sistemas— con el consiguiente riesgo de error.", "Automatizamos esos flujos con Power Automate, integrándolos a los sistemas existentes. El equipo recuperó horas cada semana para tareas de mayor valor y bajaron los errores del proceso."] },
    ],
    tech: ["Power BI", "Microsoft 365", "Dynamics 365", "SharePoint", "Azure", "Power Automate"],
    brands: ["Microsoft", "Power BI", "Dynamics 365", "SharePoint", "Azure", "Power Automate"],
    benefitsTitle: "Beneficios",
    benefits: [
      "Decisiones basadas en datos, no en intuición",
      "Perspectiva empresarial de 360°",
      "Análisis ad hoc para toda la organización",
      "Escalabilidad corporativa",
      "Seguridad y gobernanza integradas",
      "Consultores Microsoft certificados",
    ],
    industryContent: {
      seguros: {
        subtitle:
          "Convertí los datos de pólizas, siniestros y cartera en tableros ejecutivos que anticipan el negocio.",
        pains: [
          "Tenés datos de pólizas y siniestros dispersos y sin consolidar.",
          "La dirección pide reportes que llegan tarde y armados a mano.",
          "No podés medir la rentabilidad por producto o cartera en tiempo real.",
          "Tu equipo pierde horas en tareas manuales y repetitivas.",
        ],
      },
      retail: {
        subtitle:
          "Analítica de ventas, stock y sucursales en un solo tablero — de los datos a la decisión, sin planillas.",
        pains: [
          "Cada sucursal reporta distinto y no hay una única fuente de verdad.",
          "No ves ventas, stock y márgenes consolidados en tiempo real.",
          "Los reportes se arman a mano y llegan tarde para decidir.",
          "Pagás licencias Microsoft que aprovechás a medias.",
        ],
      },
      bancos: {
        subtitle:
          "Convertí los datos del banco en tableros de riesgo, cartera y rentabilidad — con gobierno y seguridad de nivel financiero.",
        pains: [
          "Tenés datos dispersos en múltiples sistemas sin consolidar.",
          "La dirección necesita reportes de riesgo y cartera en tiempo real.",
          "Tu equipo pierde horas armando reportes a mano.",
          "Falta gobierno y seguridad sobre la información sensible.",
        ],
      },
      juridicos: {
        subtitle:
          "Ordená la gestión documental, la colaboración y los datos del estudio con el ecosistema Microsoft, sin fricción.",
        pains: [
          "La información del estudio está dispersa y sin una fuente única.",
          "La colaboración entre profesionales es desordenada.",
          "Perdés tiempo buscando documentos y versiones.",
          "No aprovechás las licencias Microsoft que ya pagás.",
        ],
      },
      laboratorios: {
        subtitle:
          "De los datos de laboratorio a decisiones: analítica, colaboración y automatización sobre Microsoft, con seguridad.",
        pains: [
          "Los datos de operación y resultados no se consolidan para decidir.",
          "Los reportes llegan tarde y armados a mano.",
          "Tareas repetitivas consumen tiempo del equipo.",
          "Falta gobierno sobre información sensible de pacientes.",
        ],
      },
      logistica: {
        subtitle:
          "Visibilidad de la operación logística en tableros en tiempo real — entregas, flota y costos, sin planillas.",
        pains: [
          "No ves en tiempo real entregas, flota y costos operativos.",
          "Cada área reporta distinto, sin una única fuente de verdad.",
          "Los reportes se arman a mano y llegan tarde.",
          "Tareas repetitivas frenan a tu equipo.",
        ],
      },
    },
    metaTitle: "Consultoría Microsoft & Power BI · Accedra",
    metaDescription:
      "Consultoría Microsoft: Power BI, Microsoft 365, Dynamics, SharePoint y Azure. Analítica y productividad para tu empresa.",
  },

  seguridad: {
    slug: "seguridad",
    name: "Seguridad IT",
    icon: ShieldCheck,
    eyebrow: "Soluciones IT",
    title: "Ciberseguridad de",
    highlight: "nivel corporativo.",
    subtitle:
      "Detectá y detené amenazas antes de que impacten. Protegemos cada capa de tu organización con soluciones de clase empresarial.",
    heroImage: photo(1181244),
    heroVideo: video(6963744),
    introTitle: "Detectar y detener amenazas, efectivamente.",
    intro:
      "Arquitecturas Zero Trust y seguridad gestionada con las mejores marcas del mercado (Cisco, Palo Alto, Check Point). La ciberseguridad de clase empresarial que exigen las organizaciones más demandantes, al alcance de tu empresa.",
    painsTitle: "¿Te suena alguna de estas situaciones?",
    pains: [
      "No sabés qué pasaría hoy si sufrieras un ataque de ransomware.",
      "No tenés visibilidad real de lo que entra y sale de tu red.",
      "Tu gente trabaja remota sin una capa de seguridad que la proteja.",
      "Clientes o auditorías te exigen requisitos de seguridad que hoy no podés cumplir.",
    ],
    capabilities: [
      { icon: Flame, title: "Firewalls de nueva generación", desc: "Previenen filtraciones, dan visibilidad total y automatizan operaciones de seguridad." },
      { icon: Bug, title: "Protección contra malware", desc: "Prevención, supervisión de comportamiento malicioso y eliminación rápida con Cisco AMP." },
      { icon: CloudCog, title: "Seguridad en la nube", desc: "Acceso seguro, protección de Office 365 y control de aplicaciones SaaS con Cisco Umbrella." },
      { icon: Laptop, title: "Seguridad de endpoints", desc: "Detención de malware conocido y desconocido, más investigación de incidentes." },
      { icon: MailCheck, title: "Protección de email", desc: "Bloqueo de phishing, ransomware y spam en toda la organización." },
      { icon: Lock, title: "VPN & acceso remoto", desc: "Conectividad segura y protección continua de terminales, dentro y fuera de la red." },
    ],
    cases: [
      { industry: "Banca", challenge: "Superficie de ataque creciente y exigencias de auditoría difíciles de cumplir.", solution: "Arquitectura Zero Trust con firewalls NGFW y protección de endpoints.", result: "Visibilidad total del tráfico y cumplimiento de los requisitos de auditoría.", body: ["La superficie de ataque crecía con el trabajo remoto y las nuevas aplicaciones, mientras las auditorías exigían controles cada vez más estrictos que eran difíciles de sostener.", "Implementamos una arquitectura Zero Trust con firewalls de nueva generación y protección de endpoints, más visibilidad total del tráfico. El banco logró aprobar sus auditorías y responder ante incidentes con evidencia y control."] },
      { industry: "Salud", challenge: "Datos sensibles expuestos y trabajo remoto sin una capa de seguridad adecuada.", solution: "Seguridad de endpoints, protección de email y acceso remoto seguro.", result: "Datos protegidos y continuidad operativa frente a amenazas y ransomware.", body: ["Los datos sensibles de pacientes quedaban expuestos y el trabajo remoto se hacía sin una capa de seguridad adecuada, con riesgo real de ransomware.", "Desplegamos seguridad de endpoints, protección de email y acceso remoto seguro. Los datos quedaron protegidos y la operación mantuvo su continuidad incluso frente a intentos de ataque."] },
      { industry: "Logística", challenge: "Operación 24/7 vulnerable, sin monitoreo ni respuesta ante incidentes.", solution: "Seguridad gestionada de la cadena logística con monitoreo continuo.", result: "Operación protegida las 24 horas, sin frenar la logística.", body: ["Una operación logística 24/7 era vulnerable: sin monitoreo ni un plan de respuesta, un incidente podía frenar toda la cadena.", "Pusimos en marcha seguridad gestionada de la cadena, con monitoreo continuo y respuesta ante incidentes. La operación quedó protegida las 24 horas, sin frenar la logística."] },
    ],
    tech: ["Cisco", "Palo Alto Networks", "Check Point", "Cisco Umbrella", "Cisco AMP"],
    brands: ["Cisco", "Palo Alto Networks", "Check Point"],
    benefitsTitle: "Beneficios",
    benefits: [
      "Arquitectura Zero Trust",
      "Visibilidad total del tráfico",
      "Respuesta y auditoría ante incidentes",
      "Administración local, en nube o centralizada",
      "Monitoreo y actualización permanente",
      "Cumplimiento y continuidad del negocio",
    ],
    industryContent: {
      bancos: {
        subtitle:
          "Protección de nivel financiero: Zero Trust, prevención de fraude y visibilidad total para cada operación crítica.",
        pains: [
          "Un incidente puede impactar operaciones y reputación en minutos.",
          "Necesitás cumplir requisitos de seguridad y auditorías estrictas.",
          "No tenés visibilidad completa del tráfico y los accesos.",
          "El fraude y el phishing amenazan a clientes y empleados.",
        ],
      },
      laboratorios: {
        subtitle:
          "Protección de datos sensibles de pacientes y continuidad operativa frente a ransomware y accesos indebidos.",
        pains: [
          "Manejás datos sensibles de pacientes que debés proteger por normativa.",
          "Un ransomware podría frenar la operación clínica o de laboratorio.",
          "No tenés control claro de quién accede a qué información.",
          "El trabajo remoto expandió la superficie de ataque.",
        ],
      },
      seguros: {
        subtitle:
          "Ciberseguridad que protege la cartera de clientes, los datos y la continuidad del negocio asegurador.",
        pains: [
          "Custodiás datos personales y financieros que son blanco de ataques.",
          "Un incidente afecta la confianza y la continuidad del negocio.",
          "Necesitás cumplir requisitos regulatorios y de auditoría.",
          "No tenés visibilidad ni respuesta rápida ante incidentes.",
        ],
      },
      juridicos: {
        subtitle:
          "Protegé la información confidencial de tus clientes y la continuidad del estudio frente a ransomware y filtraciones.",
        pains: [
          "Custodiás información confidencial que es blanco de ataques.",
          "Una filtración compromete la confianza y la responsabilidad legal.",
          "No tenés control claro de accesos a documentos sensibles.",
          "El trabajo remoto amplió la superficie de ataque.",
        ],
      },
      logistica: {
        subtitle:
          "Ciberseguridad para operaciones 24/7: protegé la cadena logística, los sistemas y los datos sin frenar la operación.",
        pains: [
          "Un ataque puede frenar toda la cadena logística.",
          "Tu operación 24/7 no puede permitirse tiempo de inactividad.",
          "No tenés visibilidad de amenazas en una red distribuida.",
          "Depósitos y flota amplían la superficie de ataque.",
        ],
      },
      retail: {
        subtitle:
          "Protegé los datos de clientes, los medios de pago y la operación de todas tus sucursales.",
        pains: [
          "Manejás datos de clientes y pagos que son blanco de ataques.",
          "Cada sucursal es una posible puerta de entrada.",
          "Un incidente frena las ventas y daña la marca.",
          "No tenés visibilidad ni respuesta centralizada.",
        ],
      },
    },
    metaTitle: "Ciberseguridad · Accedra",
    metaDescription:
      "Ciberseguridad de nivel corporativo: firewalls de nueva generación, Zero Trust, Cisco Umbrella y AMP, protección de endpoints y email.",
  },

  "software-ai": {
    slug: "software-ai",
    name: "Software & AI",
    icon: Sparkles,
    eyebrow: "Soluciones IT",
    title: "Software a medida e",
    highlight: "inteligencia artificial.",
    subtitle:
      "Desarrollamos el software que tu operación necesita e integramos inteligencia artificial en tus procesos — de la idea al producto en producción, con un partner que se involucra.",
    heroImage: photo(546819),
    heroVideo: video(3252919),
    introTitle: "Del proceso manual al producto inteligente.",
    intro:
      "Diseñamos, desarrollamos y mantenemos software a medida, y aplicamos IA sobre tus propios datos y procesos. Desde una integración puntual hasta un producto completo: te acompañamos de la estrategia a la puesta en producción, con estándares de calidad enterprise.",
    painsTitle: "¿Te suena alguna de estas situaciones?",
    pains: [
      "Tu operación depende de planillas y procesos manuales que no escalan.",
      "El software que usás no se adapta a cómo trabaja realmente tu empresa.",
      "Tenés datos por todos lados pero no los estás aprovechando con IA.",
      "Querés incorporar inteligencia artificial y no sabés por dónde empezar.",
    ],
    capabilities: [
      { icon: Code2, title: "Desarrollo a medida", desc: "Aplicaciones web y móviles hechas a la medida de tu operación, con arquitectura escalable y código mantenible." },
      { icon: Workflow, title: "Integraciones & APIs", desc: "Conectamos tus sistemas, ERPs y servicios externos con APIs robustas y flujos de datos confiables." },
      { icon: BrainCircuit, title: "Modelos de IA / ML", desc: "Machine learning e IA generativa aplicados a tus datos para predecir, clasificar y automatizar decisiones." },
      { icon: Bot, title: "Chatbots & Copilotos", desc: "Asistentes con IA integrados a tus canales y sistemas, entrenados con el conocimiento de tu empresa." },
      { icon: Database, title: "Data & Analytics", desc: "Pipelines de datos, tableros y analítica avanzada para convertir información dispersa en decisiones." },
      { icon: Cpu, title: "Automatización de procesos", desc: "Automatizamos tareas repetitivas con software e IA para liberar tiempo y reducir errores." },
    ],
    cases: [
      { industry: "Fintech", challenge: "Onboarding y scoring de clientes 100% manuales que no escalaban con el crecimiento.", solution: "Plataforma a medida con un modelo de scoring por IA integrado al flujo de alta.", result: "Onboarding más rápido y decisiones de crédito consistentes y auditables.", body: ["El área de originación dependía de planillas y revisiones manuales para dar de alta y evaluar clientes. A medida que crecía el volumen, el proceso se volvía lento, inconsistente y difícil de auditar.", "Construimos una plataforma a medida que integra un modelo de scoring por IA directamente en el flujo de alta. Hoy el onboarding es más rápido, las decisiones de crédito son consistentes y cada evaluación queda registrada y auditable."] },
      { industry: "Retail", challenge: "Demanda difícil de anticipar y quiebres de stock frecuentes en varias sucursales.", solution: "Modelo de predicción de demanda integrado al sistema de compras.", result: "Menos quiebres de stock y reposición basada en datos, no en intuición.", body: ["La cadena decidía la reposición a ojo, lo que provocaba quiebres de stock en los productos de mayor rotación y sobrestock en otros, inmovilizando capital.", "Entrenamos un modelo de predicción de demanda sobre su histórico de ventas y lo integramos al sistema de compras. La reposición pasó a basarse en datos: menos quiebres, menos sobrestock y decisiones que el equipo puede explicar."] },
      { industry: "Salud", challenge: "Atención saturada por consultas repetitivas y turnos gestionados a mano.", solution: "Chatbot con IA integrado a la agenda y a las preguntas frecuentes.", result: "Consultas resueltas al instante y agenda liberada para lo importante.", body: ["El equipo de atención dedicaba gran parte del día a responder las mismas consultas y a coordinar turnos manualmente, con demoras y errores.", "Desarrollamos un chatbot con IA, entrenado con la información del centro e integrado a la agenda. Las consultas frecuentes se resuelven al instante y el equipo recuperó tiempo para lo que realmente requiere atención humana."] },
    ],
    tech: ["Python", "TypeScript", "React", "Node.js", "Azure AI", "OpenAI", "PyTorch", "LangChain"],
    brands: ["OpenAI", "Anthropic", "Gemini", "HuggingFace", "LangChain", "Python", "PyTorch", "TensorFlow", "TypeScript", "React", "Node.js", "AWS", "Google Cloud", "Docker", "PostgreSQL", "n8n"],
    brandsLabel: "Tecnologías con las que trabajamos",
    benefitsTitle: "Beneficios",
    benefits: [
      "Software que se adapta a tu operación, no al revés",
      "IA aplicada a tus datos y casos reales",
      "De la idea a producción con un solo equipo",
      "Código propio, documentado y mantenible",
      "Escalabilidad y estándares enterprise",
      "Acompañamiento de largo plazo",
    ],
    metaTitle: "Software a medida & Inteligencia Artificial · Accedra",
    metaDescription:
      "Desarrollo de software a medida e integración de IA: aplicaciones, APIs, modelos de machine learning, chatbots y automatización de procesos.",
  },
};

export const SOLUTION_SLUGS = Object.keys(SOLUTIONS);
