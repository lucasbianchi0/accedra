import type { Dict } from "./es";

export const pt: Dict = {
  nav: {
    services: "Soluções",
    partners: "Partners",
    about: "Casos de sucesso",
    contact: "Contato",
    cta: "Fale com um especialista",
    followLinkedin: "Siga-nos no LinkedIn",
    language: "Idioma",
  },

  hero: {
    badge: "17 anos liderando a transformação de TI na Argentina",
    titlePre: "Infraestrutura de TI",
    titleHighlight: "para empresas",
    titlePost: "que lideram.",
    subtitlePre:
      "Representamos e integramos as melhores tecnologias do mundo para que sua empresa opere com a ",
    subtitleStrong: "infraestrutura que merece",
    ctaExpert: "Fale com um especialista",
    ctaServices: "Ver serviços",
    stats: [
      "Anos de experiência",
      "Projetos entregues",
      "Partners tecnológicos",
      "Clientes ativos",
    ],
  },

  services: {
    eyebrow: "Nossas soluções",
    title: "Toda a sua TI, em um só lugar",
    subtitle:
      "Da rede à nuvem, assinatura digital, dados e IA: cobrimos cada camada para que sua operação não pare.",
    featuredBadge: "Diferencial",
    viewSolution: "Ver solução",
    tabBento: "Opção 1 · Bento",
    tabCards: "Opção 2 · Cards",
    ctaText: "Não sabe por onde começar?",
    ctaButton: "Solicitar um diagnóstico",
    ctaTrust: "Gratuito e sem compromisso · respondemos em 24 h",
    columns: [
      {
        title: "Networking",
        desc: "Infraestrutura de rede robusta e de alta disponibilidade, do cabeamento à nuvem.",
        items: [
          "Switching & Routing",
          "Wireless",
          "Telefonia IP",
          "Segurança",
          "Contingência & Ambiente",
          "Cabeamento estruturado",
        ],
      },
      {
        title: "Assinatura Biométrica",
        desc: "Assinatura eletrônica, biométrica e digital com validade legal e rastreabilidade total.",
        items: [
          "Soluções de Factoring Digital",
          "Assinatura Digital Biométrica",
          "eSignAnyWhere",
          "Soluções Mobile",
          "Multibiometria",
        ],
      },
      {
        title: "Consultoria",
        desc: "O ecossistema Microsoft e análise que transformam seus dados em decisões.",
        items: [
          "Colaboração",
          "Power BI",
          "Dynamics 365",
          "SharePoint",
          "Office 365",
          "Gestão Documental",
        ],
      },
      {
        title: "Segurança",
        desc: "Cibersegurança de nível corporativo em cada camada, com arquitetura Zero Trust.",
        items: ["Cisco", "Palo Alto", "Umbrella", "AMP", "Cloud Security"],
      },
      {
        title: "Software & AI",
        desc: "Software sob medida e inteligência artificial aplicada aos seus processos.",
        items: [
          "Desenvolvimento sob medida",
          "Integrações & APIs",
          "Modelos de IA / ML",
          "Chatbots & Copilotos",
          "Data & Analytics",
          "Automação",
        ],
      },
    ],
  },

  partners: {
    eyebrow: "Com o que fazemos",
    title: "Cada solução, sobre tecnologia líder",
    subtitle:
      "Tudo o que você vê acima se apoia no ecossistema dos fabricantes líderes do mercado.",
    pill: "Partner certificado e distribuidor autorizado de cada fabricante",
    mobileMore: "+20 parceiros certificados",
    mobileMoreSub: "Tem mais. Mas paramos por aqui.",
    mobileShowAll: "Ver todos os parceiros",
    mobileShowLess: "Ver menos",
    // Alineado al orden del array `partners` en Partners.tsx
    blurbs: [
      "Líder mundial em redes corporativas: switching, routing e conectividade de alta disponibilidade.",
      "Nuvem Azure, identidade e produtividade corporativa com governança e segurança integradas.",
      "Firewalls de nova geração e segurança Zero Trust para proteger toda a rede.",
      "Infraestrutura hiperconvergente e nuvem híbrida que simplifica o datacenter.",
      "Tablets de assinatura e digitalização biométrica para processos 100% digitais.",
      "Armazenamento all-flash de alto desempenho com eficiência e simplicidade de gestão.",
      "Gestão e remediação automática de vulnerabilidades em tempo real.",
      "Energia ininterrupta (UPS) e proteção elétrica para infraestrutura crítica.",
      "Redes Wi-Fi corporativas e acesso seguro com inteligência na borda.",
      "Cabeamento estruturado e infraestrutura de conectividade de missão crítica.",
      "Videomonitoramento e soluções de segurança eletrônica baseadas em IA.",
      "Câmeras IP e sistemas de videomonitoramento inteligente para todo tipo de ambiente.",
      "Networking e conectividade Wi-Fi confiável para empresas e filiais.",
      "Assinatura eletrônica e digitalização de processos com validade legal.",
      "Cibersegurança e proteção perimetral de rede com prevenção de ameaças avançada.",
    ],
  },

  whyUs: {
    eyebrow: "Nosso trabalho",
    titlePre: "Os projetos",
    titleHighlight: "falam por nós.",
    body:
      "17 anos e mais de 400 projetos: treinamentos, implantações de segurança, redes e infraestrutura crítica para as empresas líderes da Argentina. Esta é uma amostra do que fazemos todos os dias.",
    cta: "Vamos falar do seu projeto",
    followText: "Acompanhe todos os nossos projetos no LinkedIn.",
    followButton: "Siga-nos no LinkedIn",
    // Alineado al orden del array `works` en WhyUs.tsx (la ubicación queda igual)
    works: [
      {
        tag: "Treinamento",
        title: "Jornada de treinamento em cibersegurança",
        text:
          "Capacitamos a equipe de TI de um cliente enterprise em prevenção de ameaças e boas práticas de segurança.",
      },
      {
        tag: "Segurança de TI",
        title: "Firewall perimetral de nova geração",
        text:
          "Projeto e implementação de uma arquitetura Zero Trust com Palo Alto para proteger a operação crítica.",
      },
      {
        tag: "Infraestrutura",
        title: "Cabeamento estruturado certificado",
        text:
          "Instalação completa de cabeamento e networking na nova sede corporativa, pronta para escalar.",
      },
      {
        tag: "Assinatura Digital",
        title: "Implantação de assinatura biométrica",
        text:
          "Digitalização documental com validade legal para milhares de operações mensais, sem papel nem demoras.",
      },
      {
        tag: "Networking",
        title: "Renovação de rede corporativa",
        text:
          "Wireless de alta densidade e switching Cisco para conectar todas as filiais com SLA definido em contrato.",
      },
    ],
  },

  testimonials: {
    eyebrow: "Depoimentos",
    titlePre: "O que dizem",
    titleHighlight: "sobre nós",
    subtitle:
      "Empresas líderes que confiam sua infraestrutura crítica à nossa equipe.",
    // Alineado al orden del array `testimonials` en Testimonials.tsx (el nombre queda igual)
    items: [
      {
        quote:
          "Dá para ver que todos os integrantes da Accedra buscam agregar valor em cada projeto. Tornaram-se nosso parceiro estratégico de confiança.",
        role: "Gerente de TI · Mapfre Argentina",
      },
      {
        quote:
          "Conseguimos incorporar tecnologia para sustentar o negócio de forma ideal. A qualidade do serviço e o comprometimento da equipe são excepcionais.",
        role: "Diretor de Tecnologia · Andreani",
      },
      {
        quote:
          "Entendem nossas necessidades técnicas e as traduzem em soluções que realmente funcionam para o negócio. Parceiros estratégicos de verdade.",
        role: "IT Manager · Finning Argentina",
      },
    ],
  },

  contact: {
    eyebrow: "Contato",
    titlePre: "Pronto para transformar",
    titleHighlight: "sua infraestrutura de TI?",
    body:
      "Conte seu desafio e um especialista da Accedra entra em contato em menos de 24 horas úteis. Sem compromisso.",
    whatsappLabel: "WhatsApp",
    whatsappValue: "Resposta imediata",
    phoneValue: "Seg–Sex 9:00–18:00",
    emailValue: "Resposta em 24h",
    addressValue: "Argentina",
    badge: "Resposta em menos de 24h",
    formTitle: "Conte-nos seu caso",
    formSubtitle: "Sem apresentação comercial: um especialista analisa e diz se podemos resolver.",
    fieldName: "Nome",
    fieldCompany: "Empresa",
    fieldEmail: "E-mail corporativo",
    fieldService: "Serviço de interesse",
    fieldMessage: "Como podemos ajudar você? (opcional)",
    placeholderName: "João Silva",
    placeholderCompany: "Minha Empresa Ltda.",
    placeholderEmail: "joao@empresa.com",
    placeholderMessage: "Se quiser, conte-nos brevemente seu caso...",
    selectDefault: "Selecionar...",
    serviceOptions: {
      networking: "Networking",
      seguridad: "Segurança de TI",
      biometrica: "Assinatura Biométrica",
      consultoria: "Consultoria Microsoft",
      otro: "Outro",
    },
    submit: "Fale com um especialista",
    submitting: "Enviando...",
    disclaimer: "Sem compromisso · Respondemos em menos de 24h úteis",
    successTitle: "Mensagem enviada!",
    successBody:
      "Obrigado por entrar em contato. Um especialista da Accedra escreverá para você em menos de 24 horas úteis.",
    errorGeneric:
      "Não conseguimos enviar sua mensagem. Tente novamente ou escreva para info@accedra.com.ar.",
    errorRate:
      "Recebemos várias mensagens da sua conexão. Aguarde alguns minutos ou escreva para info@accedra.com.ar.",
  },

  events: {
    speakers: "Palestrantes",
    registerTitle: "Garanta sua vaga",
    registerSub: "Deixe seu e-mail e enviamos a confirmação com o convite para sua agenda.",
    emailPlaceholder: "voce@empresa.com",
    submit: "Quero me inscrever",
    sending: "Inscrevendo…",
    successTitle: "Pronto, você está inscrito!",
    successMail: "Enviamos a confirmação para",
    successNoMail: "Sua inscrição foi salva, mas não conseguimos enviar o e-mail. Entraremos em contato antes do evento.",
    errorFull: "As vagas deste evento estão esgotadas.",
    errorClosed: "As inscrições deste evento já foram encerradas.",
    errorRate: "Recebemos várias tentativas seguidas. Tente novamente em alguns minutos.",
    errorEmail: "Confira o endereço de e-mail: parece que falta algo.",
    errorGeneric: "Não conseguimos fazer sua inscrição. Tente novamente em instantes.",
    privacy: "Usamos seu e-mail apenas para este evento. Não compartilhamos com ninguém.",
    doneMessage: "Este evento já aconteceu. Veja os próximos na lista.",
    all: "Todas",
    noneInCategory: "Ainda não há eventos nesta categoria.",
    // Las soluciones, con los slugs de /soluciones/<slug>.
    categories: {
      networking: "Networking",
      "firma-biometrica": "Assinatura biométrica",
      consultoria: "Consultoria",
      seguridad: "Cibersegurança",
      "software-ai": "IA & Software",
    },
    tab: "Eventos",
    drawerSub: "Workshops e capacitações com as tecnologias que implementamos todos os dias.",
    participate: "Participar",
    close: "Fechar",
    upcoming: "Próximos eventos",
    past: "Eventos realizados",
    featured: "Destaque",
    live: "Ao vivo",
    done: "Realizado",
    register: "Quero me inscrever",
    contactToRegister: "Consultar inscrição",
    details: "Ver detalhes",
    seats: "Vagas",
    viewAll: "Ver todos os eventos",
    technologies: "Tecnologias",
    types: {
      workshop: "Workshop",
      webinar: "Webinar",
      capacitacion: "Capacitação",
      charla: "Palestra",
      meetup: "Meetup",
      lanzamiento: "Lançamento",
    },
    modes: { presencial: "Presencial", online: "Online", hibrido: "Híbrido" },
    agenda: {
      kicker: "Agenda Accedra",
      title: "Eventos",
      lead: "Workshops, webinars e capacitações com a equipe que depois implementa. Turmas pequenas, computador aberto.",
      upcomingOne: "próximo",
      upcomingMany: "próximos",
      doneMany: "realizados",
      nextOne: "O próximo",
      today: "é hoje",
      tomorrow: "é amanhã",
      inDays: "em {n} dias",
    },
  },

  footer: {
    tagline:
      "Fornecedor integral de infraestrutura, serviços e projetos de tecnologia para as empresas líderes da Argentina. 17 anos, 400+ projetos.",
    servicesTitle: "Serviços",
    servicesItems: [
      "Networking",
      "Segurança de TI",
      "Assinatura Biométrica",
      "Consultoria Microsoft",
      "Software & AI",
    ],
    companyTitle: "Empresa",
    companyItems: ["Sobre a Accedra", "Partners", "Clientes", "Recursos", "Contato"],
    rights: "Todos os direitos reservados.",
    madeIn: "Feito com precisão em Buenos Aires, Argentina.",
  },

  // Chrome de las landings de soluciones (solo páginas base, no industria)
  solution: {
    ctaPrimary: "Solicitar assessoria",
    ctaSeeSolution: "Ver soluções",
    ctaWhatsapp: "Consultar por WhatsApp",
    home: "Início",
    whatsapp: "WhatsApp",
    painsEyebrow: "O problema",
    painsFooter: "Se você se reconhece em alguma delas, podemos ajudar.",
    painsCta: "Solicitar um diagnóstico",
    capsEyebrow: "O que inclui",
    capsTitle: "Capacidades da solução",
    techLabel: "Trabalhamos com",
    benefitsHeading: "O respaldo de um integrador que se envolve.",
    benefitsBody:
      "Não entregamos uma caixa e vamos embora. Projetamos, implementamos e sustentamos a solução junto à sua equipe, com suporte local e padrões enterprise.",
    ctaTitlePre: "Pronto para avançar com",
    ctaBody:
      "Conte seu desafio e um especialista da Accedra entra em contato em menos de 24 horas úteis.",
    ctaPrimary2: "Agendar uma reunião",
    ctaSecondary: "Ver outras soluções",
    // Brochure — o link do hero.
    brochureCta: "Baixar o material em PDF",
    brochureEmail: "voce@empresa.com",
    brochureSend: "Receber o PDF",
    brochureNote: "Sem compromisso. Não compartilhamos seu e-mail.",
    brochureReady: "Baixar o PDF",
    brochureSentTo: "Também enviamos para",
    brochureError: "Não conseguimos enviar. Tente de novo em instantes.",
    brochureRate: "Você já pediu há pouco. Verifique seu e-mail ou tente mais tarde.",
    brochureEyebrow: "Material",
    brochureBody: "O que a solução inclui, as entregas de cada etapa e casos reais de implementação.",
    brochureChips: ["O que inclui", "Entregas", "Casos reais"],
    brochureClose: "Fechar",
  },
};
