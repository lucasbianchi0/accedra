import type { Dict } from "./es";

export const en: Dict = {
  nav: {
    services: "Solutions",
    partners: "Partners",
    about: "About",
    contact: "Contact",
    cta: "Talk to an expert",
    followLinkedin: "Follow us on LinkedIn",
    language: "Language",
  },

  hero: {
    badge: "17 years leading IT transformation in Argentina",
    titlePre: "IT infrastructure",
    titleHighlight: "for companies",
    titlePost: "that lead.",
    subtitlePre:
      "We represent and integrate the best technologies in the world so your company runs on the ",
    subtitleStrong: "infrastructure it deserves",
    ctaExpert: "Talk to an expert",
    ctaServices: "View services",
    stats: [
      "Years of experience",
      "Projects delivered",
      "Technology partners",
      "Active clients",
    ],
  },

  services: {
    eyebrow: "What we do",
    title: "End-to-end IT solutions",
    subtitle:
      "From cabling to the cloud, we cover every layer of your infrastructure.",
    featuredBadge: "Our edge",
    viewSolution: "View solution",
    ctaText: "Not sure where to start?",
    ctaButton: "Request an assessment",
    columns: [
      {
        title: "Networking",
        desc: "Robust, high-availability network infrastructure — from cabling to the cloud.",
        items: [
          "Switching & Routing",
          "Wireless",
          "IP Telephony",
          "Security",
          "Contingency & Environment",
          "Structured cabling",
        ],
      },
      {
        title: "Biometric Signature",
        desc: "Electronic, biometric and digital signature with legal validity and full traceability.",
        items: [
          "Digital Transformation",
          "Digital Factoring Solutions",
          "Biometric Digital Signature",
          "eSignAnyWhere",
          "Mobile Solutions",
          "Multi-biometrics",
        ],
      },
      {
        title: "Consulting",
        desc: "The Microsoft ecosystem and analytics that turn your data into decisions.",
        items: [
          "Collaboration",
          "Power BI",
          "Dynamics 365",
          "SharePoint",
          "Office 365",
          "Document Management",
        ],
      },
      {
        title: "Security",
        desc: "Enterprise-grade cybersecurity at every layer, with Zero Trust architecture.",
        items: ["Cisco", "Palo Alto", "Umbrella", "AMP", "Cloud Security"],
      },
      {
        title: "Software & AI",
        desc: "Custom software and artificial intelligence applied to your processes.",
        items: [
          "Custom development",
          "Integrations & APIs",
          "AI / ML models",
          "Chatbots & Copilots",
          "Data & Analytics",
          "Automation",
        ],
      },
    ],
  },

  partners: {
    eyebrow: "Technology ecosystem",
    title: "We integrate the best technologies",
    subtitle:
      "Certified partners and authorized distributors of the leading brands in the IT market.",
    pill: "Certified partner and authorized distributor of every manufacturer",
    // Alineado al orden del array `partners` en Partners.tsx
    blurbs: [
      "World leader in enterprise networking: switching, routing and high-availability connectivity.",
      "Azure cloud, identity and corporate productivity with built-in governance and security.",
      "Next-generation firewalls and Zero Trust security to protect the entire network.",
      "Hyperconverged infrastructure and hybrid cloud that simplify the datacenter.",
      "Signature tablets and biometric digitization for 100% paperless processes.",
      "High-performance all-flash storage with efficiency and management simplicity.",
      "Automated vulnerability management and remediation in real time.",
      "Virtualization and software-defined infrastructure on a single platform.",
      "Uninterruptible power (UPS) and electrical protection for critical infrastructure.",
      "Enterprise Wi-Fi networks and secure access with intelligence at the edge.",
      "Structured cabling and mission-critical connectivity infrastructure.",
      "AI-based video surveillance and electronic security solutions.",
      "IP cameras and intelligent video surveillance systems for every environment.",
      "Reliable networking and Wi-Fi connectivity for companies and branch offices.",
      "Electronic signature and process digitization with legal validity.",
      "Cybersecurity and perimeter network protection with advanced threat prevention.",
    ],
  },

  whyUs: {
    eyebrow: "Our work",
    titlePre: "The projects",
    titleHighlight: "speak for us.",
    body:
      "17 years and more than 400 projects: training, security deployments, networking and critical infrastructure for Argentina's leading companies. This is a sample of what we do every day.",
    cta: "Let's talk about your project",
    followText: "Follow all our projects on LinkedIn.",
    followButton: "Follow us on LinkedIn",
    // Alineado al orden del array `works` en WhyUs.tsx (la ubicación queda igual)
    works: [
      {
        tag: "Training",
        title: "Cybersecurity training session",
        text:
          "We trained an enterprise client's IT team in threat prevention and security best practices.",
      },
      {
        tag: "IT Security",
        title: "Next-generation perimeter firewall",
        text:
          "Design and implementation of a Zero Trust architecture with Palo Alto to protect critical operations.",
      },
      {
        tag: "Infrastructure",
        title: "Certified structured cabling",
        text:
          "Complete cabling and networking installation at the new corporate headquarters, ready to scale.",
      },
      {
        tag: "Digital Signature",
        title: "Biometric signature rollout",
        text:
          "Document digitization with legal validity for thousands of monthly transactions, with no paper or delays.",
      },
      {
        tag: "Networking",
        title: "Corporate network overhaul",
        text:
          "High-density wireless and Cisco switching to connect every branch with a contractually defined SLA.",
      },
    ],
  },

  testimonials: {
    eyebrow: "Testimonials",
    titlePre: "The voice of",
    titleHighlight: "our clients",
    subtitle:
      "Leading companies that trust their critical infrastructure to our team.",
    // Alineado al orden del array `testimonials` en Testimonials.tsx (el nombre queda igual)
    items: [
      {
        quote:
          "You can tell that everyone at Accedra strives to add value to every project. They became our trusted strategic partner.",
        role: "IT Manager · Mapfre Argentina",
      },
      {
        quote:
          "We have managed to bring in technology to sustain the business optimally. The quality of service and the team's commitment are exceptional.",
        role: "Technology Director · Andreani",
      },
      {
        quote:
          "They understand our technical needs and translate them into solutions that truly work for the business. True strategic partners.",
        role: "IT Manager · Finning Argentina",
      },
    ],
  },

  contact: {
    eyebrow: "Contact",
    titlePre: "Ready to transform",
    titleHighlight: "your IT infrastructure?",
    body:
      "Tell us your challenge and an Accedra expert will get in touch with you in less than 24 business hours. No commitment.",
    whatsappLabel: "WhatsApp",
    whatsappValue: "Immediate response",
    phoneValue: "Mon–Fri 9:00–18:00",
    emailValue: "Reply within 24h",
    addressValue: "Argentina",
    badge: "Response in under 24h",
    formTitle: "Send your inquiry",
    formSubtitle: "The more details you give us, the better we can help you.",
    fieldName: "Name",
    fieldCompany: "Company",
    fieldEmail: "Corporate email",
    fieldService: "Service of interest",
    fieldMessage: "How can we help you?",
    placeholderName: "John Smith",
    placeholderCompany: "My Company Inc.",
    placeholderEmail: "john@company.com",
    placeholderMessage: "Tell us about your project or need...",
    selectDefault: "Select...",
    serviceOptions: {
      networking: "Networking",
      seguridad: "IT Security",
      biometrica: "Biometric Signature",
      consultoria: "Microsoft Consulting",
      otro: "Other",
    },
    submit: "Send inquiry",
    submitting: "Sending...",
    disclaimer: "No commitment · We reply in under 24 business hours",
    successTitle: "Message sent!",
    successBody:
      "Thanks for reaching out. An Accedra specialist will write to you in less than 24 business hours.",
  },

  footer: {
    tagline:
      "End-to-end provider of technology infrastructure, services and projects for Argentina's leading companies. 17 years, 400+ projects.",
    servicesTitle: "Services",
    servicesItems: [
      "Networking",
      "IT Security",
      "Biometric Signature",
      "Microsoft Consulting",
      "Software & AI",
    ],
    companyTitle: "Company",
    companyItems: ["About Accedra", "Partners", "Clients", "Contact"],
    rights: "All rights reserved.",
    madeIn: "Made with precision in Buenos Aires, Argentina.",
  },

  // Chrome de las landings de soluciones (solo páginas base, no industria)
  solution: {
    ctaPrimary: "Request advice",
    ctaSeeSolution: "View solutions",
    home: "Home",
    whatsapp: "WhatsApp",
    painsEyebrow: "The problem",
    painsFooter: "If any of these sound familiar, we can help.",
    painsCta: "Request an assessment",
    capsEyebrow: "What's included",
    capsTitle: "Solution capabilities",
    techLabel: "We work with",
    benefitsHeading: "The backing of an integrator that gets involved.",
    benefitsBody:
      "We don't just drop off a box and walk away. We design, implement and sustain the solution alongside your team, with local support and enterprise standards.",
    ctaTitlePre: "Ready to move forward with",
    ctaBody:
      "Tell us your challenge and an Accedra expert will get in touch with you in less than 24 business hours.",
    ctaPrimary2: "Schedule a meeting",
    ctaSecondary: "View other solutions",
  },
};
