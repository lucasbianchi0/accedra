import type { SolutionText } from "./solutions";

export const SOLUTIONS_PT: Record<string, SolutionText> = {
  networking: {
    name: "Networking",
    eyebrow: "Soluções de TI",
    title: "Networking de",
    highlight: "alta disponibilidade.",
    subtitle:
      "Projetamos, instalamos e mantemos a infraestrutura de rede que sua operação precisa — do cabeamento à nuvem, sem pontos cegos.",
    introTitle: "Uma única rede. Um único responsável.",
    intro:
      "Como Partner Certificado das principais marcas de networking, integramos redes robustas, seguras e escaláveis para médias e grandes empresas. Cuidamos de cada camada — cabeamento, switching, wireless, voz e segurança — para que sua operação nunca pare.",
    painsTitle: "Alguma dessas situações soa familiar?",
    pains: [
      "Sua rede ficou pequena diante do crescimento da operação.",
      "Você tem quedas ou lentidão que travam a produtividade e ninguém as resolve de vez.",
      "Você somou filiais ou usuários remotos sem uma arquitetura que os unifique.",
      "Você depende de vários fornecedores e nenhum se responsabiliza de ponta a ponta.",
    ],
    capabilities: [
      { title: "Cabeamento estruturado", desc: "Integração certificada de voz, dados, vídeo, segurança e automação sobre uma infraestrutura organizada e pronta para escalar." },
      { title: "Switching & Routing", desc: "Comutação e roteamento Cisco / Meraki para conectar cada dispositivo com performance e baixa latência." },
      { title: "Wireless corporativo", desc: "Wi-Fi de alta densidade com acesso seguro e cobertura total em toda a organização." },
      { title: "Telefonia IP · VoIP", desc: "Telefonia IP integrada que unifica as comunicações da sua empresa em uma única plataforma." },
      { title: "Segurança de rede", desc: "Proteção perimetral e segmentação contra ameaças e ataques criptografados." },
      { title: "Contingência & Ambiente", desc: "Redundância e recuperação diante de falhas de hardware ou software para máxima continuidade." },
    ],
    benefitsTitle: "Por que escolher a Accedra",
    benefits: [
      "Partner certificado das marcas líderes",
      "Integração de voz, dados, vídeo e segurança",
      "Monitoramento proativo da infraestrutura",
      "Transição rápida para sistemas redundantes",
      "SLA definido em contrato e suporte on-site",
      "Um único interlocutor de ponta a ponta",
    ],
    metaTitle: "Networking · Accedra",
    metaDescription:
      "Infraestrutura de rede de alta disponibilidade: cabeamento estruturado, switching, wireless e VoIP. Partner certificado Cisco, Aruba e mais.",
  },

  "firma-biometrica": {
    name: "Assinatura Biométrica",
    eyebrow: "Nosso diferencial",
    title: "Assinatura eletrônica, biométrica e",
    highlight: "digital.",
    subtitle:
      "Soluções de assinatura eletrônica, biométrica e digital conforme o caso de uso, o processo e o marco normativo aplicável — com rastreabilidade total e sem demoras.",
    introTitle: "O papel é opcional. A validade legal, não.",
    intro:
      "Somos um dos poucos integradores do país com uma vertical própria de assinatura eletrônica, biométrica e digital. Digitalizamos os processos documentais de bancos, seguradoras e saúde, eliminando o papel e resguardando a validade jurídica de cada processo conforme a normativa aplicável.",
    painsTitle: "Alguma dessas situações soa familiar?",
    pains: [
      "Você continua movimentando papel, assinaturas e processos físicos que travam seus fluxos.",
      "Você precisa digitalizar processos sem perder validade jurídica nem rastreabilidade.",
      "Você perde clientes por processos de assinatura lentos, presenciais ou com fricção.",
      "Você precisa garantir identidade e respaldo probatório e não sabe com qual ferramenta.",
    ],
    capabilities: [
      { title: "Assinatura manuscrita biométrica", desc: "Captura da assinatura com dados biométricos em tablets Wacom certificados, com validade legal conforme o marco normativo aplicável." },
      { title: "eSignAnywhere", desc: "Plataforma corporativa para ler, editar e assinar documentos a partir de qualquer dispositivo, a qualquer hora e em qualquer lugar." },
      { title: "Factoring digital", desc: "Soluções de factoring 100% digital, ágeis, auditáveis e sem fricção." },
      { title: "Assinatura mobile", desc: "Assinatura de documentos pelo celular, integrada de forma nativa aos seus processos." },
      { title: "Multibiometria", desc: "Múltiplos fatores biométricos para máxima segurança de identidade e não repúdio." },
      { title: "Integração homogênea", desc: "Integra-se aos seus sistemas, canais e fluxos existentes de forma transparente." },
    ],
    benefitsTitle: "Benefícios",
    benefits: [
      "Validade jurídica e não repúdio",
      "Auditoria completa e controle de alterações",
      "Criptografia avançada (RSA / SHA-256)",
      "Alinhado à normativa vigente e aos padrões ISO",
      "Menos papel: responsabilidade ambiental",
      "ROI demonstrável no curto prazo",
    ],
    industries: ["Bancos", "Fintech", "Seguros", "Saúde", "Telco", "Logística", "Varejo", "Educação", "Automotivo", "Farmacêutico"],
    metaTitle: "Assinatura Digital & Biométrica · Accedra",
    metaDescription:
      "Assinatura eletrônica, biométrica e digital conforme a normativa aplicável: eSignAnywhere, tablets Wacom, factoring digital. Digitalização documental sem papel.",
  },

  consultoria: {
    name: "Consultoria Microsoft",
    eyebrow: "Soluções de TI",
    title: "Seus dados, convertidos em",
    highlight: "decisões.",
    subtitle:
      "Transformamos a tecnologia Microsoft que você já tem em uma vantagem competitiva real — da colaboração diária à análise executiva.",
    introTitle: "O conhecimento, ao alcance de toda a organização.",
    intro:
      "Consultores certificados que implementam e otimizam o ecossistema Microsoft completo: Power BI, Microsoft 365, Dynamics, SharePoint e Azure. Dados que se conectam, se organizam e se convertem em decisões com uma perspectiva de 360°.",
    painsTitle: "Alguma dessas situações soa familiar?",
    pains: [
      "Você tem dados por todos os lados, mas nenhuma informação clara para decidir.",
      "Você paga licenças Microsoft que sua equipe usa pela metade.",
      "Seu pessoal perde horas em tarefas manuais e repetitivas.",
      "Os relatórios chegam tarde, montados à mão e sem uma única fonte de verdade.",
    ],
    capabilities: [
      { title: "Power BI", desc: "Dashboards executivos e análise ad hoc: conexão a múltiplas origens, relatórios na web e no mobile, e uma perspectiva de 360°." },
      { title: "Microsoft 365 & Teams", desc: "Colaboração e produtividade unificada para todas as suas equipes." },
      { title: "Dynamics 365 & SharePoint", desc: "CRM/ERP e gestão documental integrados à sua operação." },
      { title: "Azure Cloud", desc: "Migração e infraestrutura na nuvem da Microsoft, com governança e segurança." },
      { title: "Power Automate", desc: "Automação de fluxos de trabalho repetitivos para ganhar tempo." },
      { title: "Licenciamento & CSP", desc: "Gestão e otimização de licenças como Cloud Solution Provider." },
    ],
    benefitsTitle: "Benefícios",
    benefits: [
      "Decisões baseadas em dados, não em intuição",
      "Perspectiva empresarial de 360°",
      "Análise ad hoc para toda a organização",
      "Escalabilidade corporativa",
      "Segurança e governança integradas",
      "Consultores Microsoft certificados",
    ],
    metaTitle: "Consultoria Microsoft & Power BI · Accedra",
    metaDescription:
      "Consultoria Microsoft: Power BI, Microsoft 365, Dynamics, SharePoint e Azure. Análise e produtividade para sua empresa.",
  },

  seguridad: {
    name: "Segurança de TI",
    eyebrow: "Soluções de TI",
    title: "Cibersegurança de",
    highlight: "nível corporativo.",
    subtitle:
      "Detecte e detenha ameaças antes que elas impactem. Protegemos cada camada da sua organização com soluções de classe empresarial.",
    introTitle: "Detectar e deter ameaças, com eficácia.",
    intro:
      "Arquiteturas Zero Trust e segurança gerenciada com as melhores marcas do mercado (Cisco, Palo Alto, Check Point). A cibersegurança de classe empresarial que as organizações mais exigentes demandam, ao alcance da sua empresa.",
    painsTitle: "Alguma dessas situações soa familiar?",
    pains: [
      "Você não sabe o que aconteceria hoje se sofresse um ataque de ransomware.",
      "Você não tem visibilidade real do que entra e sai da sua rede.",
      "Seu pessoal trabalha remotamente sem uma camada de segurança que o proteja.",
      "Clientes ou auditorias exigem requisitos de segurança que hoje você não consegue cumprir.",
    ],
    capabilities: [
      { title: "Firewalls de nova geração", desc: "Previnem vazamentos, oferecem visibilidade total e automatizam operações de segurança." },
      { title: "Proteção contra malware", desc: "Prevenção, monitoramento de comportamento malicioso e eliminação rápida com Cisco AMP." },
      { title: "Segurança na nuvem", desc: "Acesso seguro, proteção do Office 365 e controle de aplicações SaaS com Cisco Umbrella." },
      { title: "Segurança de endpoints", desc: "Contenção de malware conhecido e desconhecido, além de investigação de incidentes." },
      { title: "Proteção de e-mail", desc: "Bloqueio de phishing, ransomware e spam em toda a organização." },
      { title: "VPN & acesso remoto", desc: "Conectividade segura e proteção contínua dos terminais, dentro e fora da rede." },
    ],
    benefitsTitle: "Benefícios",
    benefits: [
      "Arquitetura Zero Trust",
      "Visibilidade total do tráfego",
      "Resposta e auditoria diante de incidentes",
      "Administração local, na nuvem ou centralizada",
      "Monitoramento e atualização permanente",
      "Conformidade e continuidade do negócio",
    ],
    metaTitle: "Cibersegurança · Accedra",
    metaDescription:
      "Cibersegurança de nível corporativo: firewalls de nova geração, Zero Trust, Cisco Umbrella e AMP, proteção de endpoints e e-mail.",
  },
};
