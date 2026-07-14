// Diccionario base (español). Es la FUENTE DE VERDAD de la estructura:
// en.ts y pt.ts deben replicar exactamente estas claves (solo cambian los valores).
export const es = {
  nav: {
    services: "Servicios",
    partners: "Partners",
    about: "Nosotros",
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
    eyebrow: "Lo que hacemos",
    title: "Soluciones IT end-to-end",
    subtitle:
      "Desde el cableado hasta la nube, cubrimos cada capa de tu infraestructura.",
    featuredBadge: "Diferencial",
    viewSolution: "Ver solución",
    ctaText: "¿No sabés por dónde empezar?",
    ctaButton: "Solicitar un diagnóstico",
    columns: [
      {
        title: "Networking",
        items: [
          "Switching & Routing",
          "Wireless",
          "Telefonía IP",
          "Seguridad",
          "Contingencia & Entorno",
          "Cableado estructurado",
        ],
      },
      {
        title: "Firma Biométrica",
        items: [
          "Transformación Digital",
          "Soluciones de Factoring Digital",
          "Firma Digital Biométrica",
          "eSignAnyWhere",
          "Soluciones Mobile",
          "Multi biometría",
        ],
      },
      {
        title: "Consultoría",
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
        items: ["Cisco", "Palo Alto", "Umbrella", "AMP", "Cloud Security"],
      },
    ],
  },

  partners: {
    eyebrow: "Ecosistema tecnológico",
    title: "Integramos las mejores tecnologías",
    subtitle:
      "Partners certificados y distribuidores autorizados de las marcas líderes del mercado IT.",
    pill: "Partner certificado y distribuidor autorizado de cada fabricante",
    // Alineado al orden del array `partners` en Partners.tsx
    blurbs: [
      "Líder mundial en redes empresariales: switching, routing y conectividad de alta disponibilidad.",
      "Nube Azure, identidad y productividad corporativa con gobernanza y seguridad integradas.",
      "Firewalls de nueva generación y seguridad Zero Trust para proteger toda la red.",
      "Infraestructura hiperconvergente y nube híbrida que simplifica el datacenter.",
      "Tabletas de firma y digitalización biométrica para trámites 100% digitales.",
      "Almacenamiento all-flash de alto rendimiento con eficiencia y simplicidad de gestión.",
      "Gestión y remediación automática de vulnerabilidades en tiempo real.",
      "Virtualización e infraestructura definida por software en una sola plataforma.",
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
    titlePre: "La voz de",
    titleHighlight: "nuestros clientes",
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
    formTitle: "Enviá tu consulta",
    formSubtitle: "Cuantos más datos nos des, mejor te podemos ayudar.",
    fieldName: "Nombre",
    fieldCompany: "Empresa",
    fieldEmail: "Email corporativo",
    fieldService: "Servicio de interés",
    fieldMessage: "¿En qué podemos ayudarte?",
    placeholderName: "Juan García",
    placeholderCompany: "Mi Empresa S.A.",
    placeholderEmail: "juan@empresa.com",
    placeholderMessage: "Contanos tu proyecto o necesidad...",
    selectDefault: "Seleccionar...",
    serviceOptions: {
      networking: "Networking",
      seguridad: "Seguridad IT",
      biometrica: "Firma Biométrica",
      consultoria: "Consultoría Microsoft",
      otro: "Otro",
    },
    submit: "Enviar consulta",
    submitting: "Enviando...",
    disclaimer: "Sin compromiso · Respondemos en menos de 24hs hábiles",
    successTitle: "¡Mensaje enviado!",
    successBody:
      "Gracias por contactarnos. Un especialista de Accedra te escribirá en menos de 24 horas hábiles.",
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
    ],
    companyTitle: "Empresa",
    companyItems: ["Sobre Accedra", "Partners", "Clientes", "Contacto"],
    rights: "Todos los derechos reservados.",
    madeIn: "Hecho con precisión en Buenos Aires, Argentina.",
  },

  // Chrome de las landings de soluciones (solo páginas base, no industria)
  solution: {
    ctaPrimary: "Solicitar asesoramiento",
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
    ctaSecondary: "Ver otras soluciones",
  },
};

export type Dict = typeof es;
