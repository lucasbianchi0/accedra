import { Network, SquarePen, LayoutDashboard, ShieldCheck, type LucideIcon } from "lucide-react";

const photo = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1400`;

export type Capability = { title: string; desc: string };

export type Solution = {
  slug: string;
  name: string;
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  highlight: string; // gradient-highlighted tail of the title
  subtitle: string;
  heroImage: string;
  introTitle: string;
  intro: string;
  capabilities: Capability[];
  tech: string[];
  benefitsTitle: string;
  benefits: string[];
  industries?: string[];
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
    introTitle: "Una sola red. Un solo responsable.",
    intro:
      "Como Partner Certificado de las principales marcas de networking, integramos redes robustas, seguras y escalables para medianas y grandes empresas. Nos ocupamos de cada capa — cableado, switching, wireless, voz y seguridad — para que tu operación nunca se detenga.",
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
      "Monitoreo proactivo 24/7",
      "Transición rápida a sistemas redundantes",
      "SLA garantizado y soporte on-site",
      "Un único interlocutor de punta a punta",
    ],
    metaTitle: "Networking · Accedra",
    metaDescription:
      "Infraestructura de red de alta disponibilidad: cableado estructurado, switching, wireless y VoIP. Partner certificado Cisco, Aruba y más.",
  },

  "firma-biometrica": {
    slug: "firma-biometrica",
    name: "Firma Biométrica",
    icon: SquarePen,
    eyebrow: "Nuestro diferencial",
    title: "Firma digital y biométrica con",
    highlight: "validez legal.",
    subtitle:
      "Firmá cualquier documento electrónico como si fuera papel — con plena validez jurídica, trazabilidad total y sin demoras.",
    heroImage: photo(9929279),
    introTitle: "El papel es opcional. La validez legal, no.",
    intro:
      "Somos de los pocos integradores del país con una vertical propia de firma biométrica y digital. Digitalizamos los procesos documentales de bancos, aseguradoras y salud, eliminando el papel sin perder una sola garantía jurídica.",
    capabilities: [
      { title: "Firma manuscrita biométrica", desc: "Captura de la firma con datos biométricos sobre tabletas Wacom certificadas, con validez legal plena." },
      { title: "eSignAnywhere", desc: "Plataforma empresarial para leer, editar y firmar documentos desde cualquier dispositivo, en cualquier momento y lugar." },
      { title: "Factoring digital", desc: "Soluciones de factoring 100% digital, ágiles, auditables y sin fricción." },
      { title: "Firma mobile", desc: "Firma de documentos desde el celular, integrada de forma nativa a tus procesos." },
      { title: "Multibiometría", desc: "Múltiples factores biométricos para máxima seguridad de identidad y no repudio." },
      { title: "Integración homogénea", desc: "Se integra a tus sistemas, canales y flujos existentes de forma transparente." },
    ],
    tech: ["Wacom", "Namirial", "eSignAnywhere", "Gemalto", "Criptografía RSA", "SHA-256", "ISO"],
    benefitsTitle: "Beneficios",
    benefits: [
      "Validez jurídica e inviolabilidad",
      "Auditoría completa y control de cambios",
      "Criptografía avanzada (RSA / SHA-256)",
      "Cumplimiento AFIP / BCRA / normas ISO",
      "Menos papel: responsabilidad ambiental",
      "ROI demostrable en el corto plazo",
    ],
    industries: ["Banca", "Fintech", "Seguros", "Salud", "Telco", "Logística", "Retail", "Educación", "Automotriz", "Farmacéutica"],
    metaTitle: "Firma Digital & Biométrica · Accedra",
    metaDescription:
      "Firma digital y biométrica con validez legal: eSignAnywhere, tabletas Wacom, factoring digital. Digitalización documental sin papel.",
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
    introTitle: "El conocimiento, al alcance de toda la organización.",
    intro:
      "Consultores certificados que implementan y optimizan el ecosistema Microsoft completo: Power BI, Microsoft 365, Dynamics, SharePoint y Azure. Datos que se conectan, se ordenan y se convierten en decisiones con una perspectiva de 360°.",
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
    metaTitle: "Consultoría Microsoft & Power BI · Accedra",
    metaDescription:
      "Consultoría Microsoft: Power BI, Microsoft 365, Dynamics, SharePoint y Azure. Analítica y productividad para tu empresa.",
  },

  seguridad: {
    slug: "seguridad",
    name: "Seguridad IT",
    icon: ShieldCheck,
    eyebrow: "Soluciones IT",
    title: "Ciberseguridad",
    highlight: "nivel bancario.",
    subtitle:
      "Detectá y detené amenazas antes de que impacten. Protegemos cada capa de tu organización con soluciones de clase empresarial.",
    heroImage: photo(1181244),
    introTitle: "Detectar y detener amenazas, efectivamente.",
    intro:
      "Arquitecturas Zero Trust y seguridad gestionada con las mejores marcas del mercado (Cisco, Palo Alto, Fortinet). La ciberseguridad que eligen bancos y grandes corporaciones, ahora al alcance de tu empresa.",
    capabilities: [
      { title: "Firewalls de nueva generación", desc: "Previenen filtraciones, dan visibilidad total y automatizan operaciones de seguridad." },
      { title: "Protección contra malware", desc: "Prevención, supervisión de comportamiento malicioso y eliminación rápida con Cisco AMP." },
      { title: "Seguridad en la nube", desc: "Acceso seguro, protección de Office 365 y control de aplicaciones SaaS con Cisco Umbrella." },
      { title: "Seguridad de endpoints", desc: "Detención de malware conocido y desconocido, más investigación de incidentes." },
      { title: "Protección de email", desc: "Bloqueo de phishing, ransomware y spam en toda la organización." },
      { title: "VPN & acceso remoto", desc: "Conectividad segura y protección continua de terminales, dentro y fuera de la red." },
    ],
    tech: ["Cisco", "Palo Alto Networks", "Cisco Umbrella", "Cisco AMP", "Fortinet"],
    benefitsTitle: "Beneficios",
    benefits: [
      "Arquitectura Zero Trust",
      "Visibilidad total del tráfico",
      "Respuesta y auditoría ante incidentes",
      "Administración local, en nube o centralizada",
      "Monitoreo y actualización permanente",
      "Cumplimiento y continuidad del negocio",
    ],
    metaTitle: "Ciberseguridad · Accedra",
    metaDescription:
      "Ciberseguridad nivel bancario: firewalls de nueva generación, Zero Trust, Cisco Umbrella y AMP, protección de endpoints y email.",
  },
};

export const SOLUTION_SLUGS = Object.keys(SOLUTIONS);
