// Diccionario base (español). Es la FUENTE DE VERDAD de la estructura:
// en.ts y pt.ts deben replicar exactamente estas claves (solo cambian los valores).
export const es = {
  nav: {
    services: "Soluciones",
    partners: "Partners",
    about: "Casos de éxito",
    contact: "Contacto",
    cta: "Hablar con un experto",
    followLinkedin: "Seguinos en LinkedIn",
    language: "Idioma",
  },

  hero: {
    badge: "17 años liderando la transformación IT en Argentina",
    titlePre: "Infraestructura IT",
    titleHighlight: "para empresas",
    titlePost: "que lideran.",
    subtitlePre:
      "Representamos e integramos las mejores tecnologías del mundo para que tu empresa opere con la ",
    subtitleStrong: "infraestructura que merece",
    ctaExpert: "Hablar con un experto",
    ctaServices: "Ver servicios",
    stats: [
      "Años de experiencia",
      "Proyectos entregados",
      "Partners tecnológicos",
      "Clientes activos",
    ],
  },

  services: {
    eyebrow: "Nuestras soluciones",
    title: "Todo tu IT, de una sola mano",
    subtitle:
      "De la red a la nube, la firma digital, los datos y la IA: resolvemos cada capa para que tu operación no se detenga.",
    featuredBadge: "Diferencial",
    viewSolution: "Ver solución",
    tabBento: "Opción 1 · Bento",
    tabCards: "Opción 2 · Cards",
    ctaText: "¿No sabés por dónde empezar?",
    ctaButton: "Solicitar un diagnóstico",
    ctaTrust: "Gratuito y sin compromiso · te respondemos en 24 h",
    columns: [
      {
        title: "Networking",
        desc: "Infraestructura de red robusta y de alta disponibilidad, del cableado a la nube.",
        items: [
          "Switching & Routing",
          "Wireless",
          "Telefonía IP",
          "Seguridad de red",
          "Contingencia",
          "Cableado",
        ],
      },
      {
        title: "Firma Biométrica",
        desc: "Firma electrónica, biométrica y digital con validez legal y trazabilidad total.",
        items: [
          "Factoring digital",
          "Firma biométrica",
          "eSignAnywhere",
          "Firma mobile",
          "Multibiometría",
        ],
      },
      {
        title: "Consultoría",
        desc: "Ecosistema Microsoft y analítica que convierten tus datos en decisiones.",
        items: [
          "Colaboración",
          "Power BI",
          "Dynamics 365",
          "SharePoint",
          "Office 365",
          "Gestión Documental",
        ],
      },
      {
        title: "Seguridad",
        desc: "Ciberseguridad de nivel corporativo en cada capa, con arquitectura Zero Trust.",
        items: ["Cisco", "Palo Alto", "Umbrella", "AMP", "Cloud Security"],
      },
      {
        title: "Software & AI",
        desc: "Software a medida e inteligencia artificial aplicada a tus procesos.",
        items: [
          "Desarrollo a medida",
          "Integraciones & APIs",
          "Modelos de IA / ML",
          "Chatbots & Copilotos",
          "Data & Analytics",
          "Automatización",
        ],
      },
    ],
  },

  partners: {
    eyebrow: "Con qué lo hacemos",
    title: "Cada solución, sobre tecnología líder",
    subtitle:
      "Todo lo que ves arriba se apoya en el ecosistema de los fabricantes líderes del mercado.",
    pill: "Partner certificado y distribuidor autorizado de cada fabricante",
    mobileMore: "+20 partners certificados",
    mobileMoreSub: "Hay más. Pero lo dejamos acá.",
    mobileShowAll: "Ver todos los partners",
    mobileShowLess: "Ver menos",
    // Alineado al orden del array `partners` en Partners.tsx
    blurbs: [
      "Líder mundial en redes empresariales: switching, routing y conectividad de alta disponibilidad.",
      "Nube Azure, identidad y productividad corporativa con gobernanza y seguridad integradas.",
      "Firewalls de nueva generación y seguridad Zero Trust para proteger toda la red.",
      "Infraestructura hiperconvergente y nube híbrida que simplifica el datacenter.",
      "Tabletas de firma y digitalización biométrica para trámites 100% digitales.",
      "Almacenamiento all-flash de alto rendimiento con eficiencia y simplicidad de gestión.",
      "Gestión y remediación automática de vulnerabilidades en tiempo real.",
      "Energía ininterrumpida (UPS) y protección eléctrica para infraestructura crítica.",
      "Redes Wi-Fi empresariales y acceso seguro con inteligencia en el borde.",
      "Cableado estructurado e infraestructura de conectividad de misión crítica.",
      "Videovigilancia y soluciones de seguridad electrónica basadas en IA.",
      "Cámaras IP y sistemas de videovigilancia inteligente para todo tipo de entorno.",
      "Networking y conectividad Wi-Fi confiable para empresas y sucursales.",
      "Firma electrónica y digitalización de procesos con validez legal.",
      "Ciberseguridad y protección perimetral de red con prevención de amenazas avanzada.",
    ],
  },

  whyUs: {
    eyebrow: "Nuestro trabajo",
    titlePre: "Los proyectos",
    titleHighlight: "hablan por nosotros.",
    body:
      "17 años y más de 400 proyectos: capacitaciones, despliegues de seguridad, redes e infraestructura crítica para las empresas líderes de Argentina. Esto es una muestra de lo que hacemos cada día.",
    cta: "Hablemos de tu proyecto",
    followText: "Seguí todos nuestros proyectos en LinkedIn.",
    followButton: "Seguinos en LinkedIn",
    // Alineado al orden del array `works` en WhyUs.tsx (la ubicación queda igual)
    works: [
      {
        tag: "Capacitación",
        title: "Jornada de capacitación en ciberseguridad",
        text:
          "Formamos al equipo de IT de un cliente enterprise en prevención de amenazas y buenas prácticas de seguridad.",
      },
      {
        tag: "Seguridad IT",
        title: "Firewall perimetral de nueva generación",
        text:
          "Diseño e implementación de una arquitectura Zero Trust con Palo Alto para proteger la operación crítica.",
      },
      {
        tag: "Infraestructura",
        title: "Cableado estructurado certificado",
        text:
          "Instalación completa de cableado y networking en la nueva sede corporativa, lista para escalar.",
      },
      {
        tag: "Firma Digital",
        title: "Despliegue de firma biométrica",
        text:
          "Digitalización documental con validez legal para miles de operaciones mensuales, sin papel ni demoras.",
      },
      {
        tag: "Networking",
        title: "Renovación de red corporativa",
        text:
          "Wireless de alta densidad y switching Cisco para conectar todas las sucursales con SLA definido por contrato.",
      },
    ],
  },

  testimonials: {
    eyebrow: "Testimonios",
    titlePre: "Lo que dicen",
    titleHighlight: "de nosotros",
    subtitle:
      "Empresas líderes que confían su infraestructura crítica a nuestro equipo.",
    // Alineado al orden del array `testimonials` en Testimonials.tsx (el nombre queda igual)
    items: [
      {
        quote:
          "Se puede ver que todos los integrantes de Accedra buscan dar valor agregado en cada proyecto. Se convirtieron en nuestro socio estratégico de confianza.",
        role: "Gerente de IT · Mapfre Argentina",
      },
      {
        quote:
          "Hemos logrado incorporar tecnología para sostener el negocio de manera óptima. La calidad de servicio y el compromiso del equipo es excepcional.",
        role: "Director de Tecnología · Andreani",
      },
      {
        quote:
          "Entienden nuestras necesidades técnicas y las traducen en soluciones que realmente funcionan para el negocio. Socios estratégicos de verdad.",
        role: "IT Manager · Finning Argentina",
      },
    ],
  },

  contact: {
    eyebrow: "Contacto",
    titlePre: "¿Listo para transformar",
    titleHighlight: "tu infraestructura IT?",
    body:
      "Contanos tu desafío y un experto de Accedra te contacta en menos de 24 horas hábiles. Sin compromiso.",
    whatsappLabel: "WhatsApp",
    whatsappValue: "Respuesta inmediata",
    phoneValue: "Lun–Vie 9:00–18:00",
    emailValue: "Respuesta en 24hs",
    addressValue: "Argentina",
    badge: "Respuesta en menos de 24 hs",
    formTitle: "Contanos tu caso",
    formSubtitle: "Sin presentación comercial: un especialista lo revisa y te dice si podemos resolverlo.",
    fieldName: "Nombre",
    fieldCompany: "Empresa",
    fieldEmail: "Email corporativo",
    fieldService: "Servicio de interés",
    fieldMessage: "¿En qué podemos ayudarte? (opcional)",
    placeholderName: "Juan García",
    placeholderCompany: "Mi Empresa S.A.",
    placeholderEmail: "juan@empresa.com",
    placeholderMessage: "Si querés, contanos brevemente tu caso...",
    selectDefault: "Seleccionar...",
    serviceOptions: {
      networking: "Networking",
      seguridad: "Seguridad IT",
      biometrica: "Firma Biométrica",
      consultoria: "Consultoría Microsoft",
      otro: "Otro",
    },
    submit: "Hablar con un experto",
    submitting: "Enviando...",
    disclaimer: "Sin compromiso · Respondemos en menos de 24hs hábiles",
    successTitle: "¡Mensaje enviado!",
    successBody:
      "Gracias por contactarnos. Un especialista de Accedra te escribirá en menos de 24 horas hábiles.",
    errorGeneric:
      "No pudimos enviar tu consulta. Probá de nuevo o escribinos a info@accedra.com.ar.",
    errorRate:
      "Recibimos varias consultas desde tu conexión. Esperá unos minutos o escribinos a info@accedra.com.ar.",
  },

  // Eventos: la pestaña lateral de la portada y la página /eventos. El contenido
  // de cada evento llega del backoffice tal como se cargó; acá sólo viven las
  // etiquetas fijas.
  events: {
    speakers: "Oradores",
    registerTitle: "Anotate a este evento",
    registerSub: "Dejá tu mail y te mandamos la confirmación con la invitación para tu calendario.",
    emailPlaceholder: "tu@empresa.com",
    submit: "Anotarme",
    sending: "Anotando…",
    successTitle: "¡Listo, quedaste anotado!",
    successMail: "Te mandamos la confirmación a",
    successNoMail: "Guardamos tu inscripción, pero no pudimos mandarte el mail. Te escribimos antes del evento.",
    errorFull: "El cupo de este evento está completo.",
    errorClosed: "La inscripción a este evento ya cerró.",
    errorRate: "Recibimos varios intentos seguidos. Probá de nuevo en unos minutos.",
    errorEmail: "Revisá la dirección de mail: parece que falta algo.",
    errorGeneric: "No pudimos anotarte. Probá de nuevo en un momento.",
    privacy: "Usamos tu mail sólo para este evento. No lo compartimos con nadie.",
    doneMessage: "Este evento ya se realizó. Mirá los próximos en la lista.",
    all: "Todas",
    noneInCategory: "No hay eventos de esta categoría por ahora.",
    // Las soluciones, con los slugs de /soluciones/<slug>.
    categories: {
      networking: "Networking",
      "firma-biometrica": "Firma biométrica",
      consultoria: "Consultoría",
      seguridad: "Ciberseguridad",
      "software-ai": "IA & Software",
    },
    tab: "Eventos",
    drawerSub: "Workshops y capacitaciones con las tecnologías que implementamos todos los días.",
    participate: "Participar",
    close: "Cerrar",
    upcoming: "Próximos eventos",
    past: "Eventos realizados",
    featured: "Destacado",
    live: "En curso",
    done: "Realizado",
    register: "Quiero inscribirme",
    contactToRegister: "Consultar inscripción",
    details: "Ver detalle",
    seats: "Cupo",
    viewAll: "Ver todos los eventos",
    technologies: "Tecnologías",
    types: {
      workshop: "Workshop",
      webinar: "Webinar",
      capacitacion: "Capacitación",
      charla: "Charla",
      meetup: "Meetup",
      lanzamiento: "Lanzamiento",
    },
    modes: { presencial: "Presencial", online: "Online", hibrido: "Híbrido" },
  },

  footer: {
    tagline:
      "Proveedor integral de infraestructura, servicios y proyectos de tecnología para las empresas líderes de Argentina. 17 años, 400+ proyectos.",
    servicesTitle: "Servicios",
    servicesItems: [
      "Networking",
      "Seguridad IT",
      "Firma Biométrica",
      "Consultoría Microsoft",
      "Software & AI",
    ],
    companyTitle: "Empresa",
    companyItems: ["Sobre Accedra", "Partners", "Clientes", "Recursos", "Contacto"],
    rights: "Todos los derechos reservados.",
    madeIn: "Hecho por Accedra en Buenos Aires, Argentina.",
  },

  // Chrome de las landings de soluciones (solo páginas base, no industria)
  solution: {
    ctaPrimary: "Solicitar asesoramiento",
    ctaSeeSolution: "Ver soluciones",
    ctaWhatsapp: "Consultar por WhatsApp",
    home: "Inicio",
    whatsapp: "WhatsApp",
    painsEyebrow: "El problema",
    painsFooter: "Si te reconocés en alguna, podemos ayudarte.",
    painsCta: "Solicitar un diagnóstico",
    capsEyebrow: "Qué incluye",
    capsTitle: "Capacidades de la solución",
    techLabel: "Trabajamos con",
    benefitsHeading: "El respaldo de un integrador que se involucra.",
    benefitsBody:
      "No entregamos una caja y nos vamos. Diseñamos, implementamos y sostenemos la solución junto a tu equipo, con soporte local y estándares enterprise.",
    ctaTitlePre: "¿Listo para avanzar con",
    ctaBody:
      "Contanos tu desafío y un experto de Accedra te contacta en menos de 24 horas hábiles.",
    ctaPrimary2: "Coordinar una reunión",
    ctaSecondary: "Ver soluciones",
    // Brochure — el mini-link del hero.
    brochureCta: "Descargar el brochure en PDF",
    brochureEmail: "tu@empresa.com",
    brochureSend: "Recibir el PDF",
    brochureNote: "Sin compromiso. No compartimos tu mail.",
    brochureReady: "Descargar el PDF",
    brochureSentTo: "Te lo mandamos a",
    brochureError: "No pudimos enviarlo. Probá de nuevo en un momento.",
    brochureRate: "Ya lo pediste hace un rato. Revisá tu correo o probá más tarde.",
    brochureEyebrow: "Brochure",
    brochureBody: "Qué incluye la solución, los entregables de cada etapa y casos reales de implementación.",
    brochureChips: ["Qué incluye", "Entregables", "Casos reales"],
    brochureClose: "Cerrar",
  },
};

export type Dict = typeof es;
