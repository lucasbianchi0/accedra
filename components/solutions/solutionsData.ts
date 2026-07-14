import { Network, SquarePen, LayoutDashboard, ShieldCheck, type LucideIcon } from "lucide-react";

const photo = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1920`;

const video = (id: number) =>
  `https://videos.pexels.com/video-files/${id}/${id}-hd_1920_1080_25fps.mp4`;

export type Capability = { title: string; desc: string };

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
  tech: string[];
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
      { title: "Cableado estructurado", desc: "Integración certificada de voz, datos, video, seguridad y domótica sobre una infraestructura ordenada y lista para escalar." },
      { title: "Switching & Routing", desc: "Conmutación y ruteo Cisco / Meraki para conectar cada dispositivo con performance y baja latencia." },
      { title: "Wireless corporativo", desc: "Wi-Fi de alta densidad con acceso seguro y cobertura total en toda la organización." },
      { title: "Telefonía IP · VoIP", desc: "Telefonía IP integrada que unifica las comunicaciones de tu empresa en una sola plataforma." },
      { title: "Seguridad de red", desc: "Protección perimetral y segmentación contra amenazas y ataques cifrados." },
      { title: "Contingencia & Entorno", desc: "Redundancia y recuperación ante fallos de hardware o software para máxima continuidad." },
    ],
    tech: ["Cisco", "Meraki", "Aruba", "Juniper", "Huawei", "Ubiquiti", "Avaya", "APC", "Vertiv", "SonicWall"],
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
      { title: "Firma manuscrita biométrica", desc: "Captura de la firma con datos biométricos sobre tabletas Wacom certificadas, con validez legal según el marco normativo aplicable." },
      { title: "eSignAnywhere", desc: "Plataforma empresarial para leer, editar y firmar documentos desde cualquier dispositivo, en cualquier momento y lugar." },
      { title: "Factoring digital", desc: "Soluciones de factoring 100% digital, ágiles, auditables y sin fricción." },
      { title: "Firma mobile", desc: "Firma de documentos desde el celular, integrada de forma nativa a tus procesos." },
      { title: "Multibiometría", desc: "Múltiples factores biométricos para máxima seguridad de identidad y no repudio." },
      { title: "Integración homogénea", desc: "Se integra a tus sistemas, canales y flujos existentes de forma transparente." },
    ],
    tech: ["Wacom", "Namirial", "eSignAnywhere", "Gemalto", "Criptografía RSA", "SHA-256", "ISO"],
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
      { title: "Power BI", desc: "Dashboards ejecutivos y análisis ad hoc: conexión a múltiples orígenes, informes en web y móvil, y una perspectiva de 360°." },
      { title: "Microsoft 365 & Teams", desc: "Colaboración y productividad unificada para todos tus equipos." },
      { title: "Dynamics 365 & SharePoint", desc: "CRM/ERP y gestión documental integrados a tu operación." },
      { title: "Azure Cloud", desc: "Migración e infraestructura en la nube de Microsoft, con gobernanza y seguridad." },
      { title: "Power Automate", desc: "Automatización de flujos de trabajo repetitivos para ganar tiempo." },
      { title: "Licenciamiento & CSP", desc: "Gestión y optimización de licencias como Cloud Solution Provider." },
    ],
    tech: ["Power BI", "Microsoft 365", "Dynamics 365", "SharePoint", "Azure", "Power Automate"],
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
      { title: "Firewalls de nueva generación", desc: "Previenen filtraciones, dan visibilidad total y automatizan operaciones de seguridad." },
      { title: "Protección contra malware", desc: "Prevención, supervisión de comportamiento malicioso y eliminación rápida con Cisco AMP." },
      { title: "Seguridad en la nube", desc: "Acceso seguro, protección de Office 365 y control de aplicaciones SaaS con Cisco Umbrella." },
      { title: "Seguridad de endpoints", desc: "Detención de malware conocido y desconocido, más investigación de incidentes." },
      { title: "Protección de email", desc: "Bloqueo de phishing, ransomware y spam en toda la organización." },
      { title: "VPN & acceso remoto", desc: "Conectividad segura y protección continua de terminales, dentro y fuera de la red." },
    ],
    tech: ["Cisco", "Palo Alto Networks", "Check Point", "Cisco Umbrella", "Cisco AMP"],
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
};

export const SOLUTION_SLUGS = Object.keys(SOLUTIONS);
