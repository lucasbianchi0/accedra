import type { SolutionText } from "./solutions";

export const SOLUTIONS_EN: Record<string, SolutionText> = {
  networking: {
    name: "Networking",
    eyebrow: "IT Solutions",
    title: "High-availability",
    highlight: "networking.",
    subtitle:
      "We design, install and maintain the network infrastructure your operation needs — from cabling to the cloud, with no blind spots.",
    introTitle: "One network. One point of contact.",
    intro:
      "As a Certified Partner of the leading networking brands, we integrate robust, secure and scalable networks for mid-sized and large companies. We take care of every layer — cabling, switching, wireless, voice and security — so your operation never stops.",
    painsTitle: "Do any of these situations sound familiar?",
    pains: [
      "Your network has outgrown the pace of your operation.",
      "You face outages or slowdowns that hurt productivity and no one fixes them at the root.",
      "You added branches or remote users without an architecture to unify them.",
      "You rely on several vendors and none takes end-to-end responsibility.",
    ],
    capabilities: [
      { title: "Structured cabling", desc: "Certified integration of voice, data, video, security and building automation over an orderly infrastructure that's ready to scale." },
      { title: "Switching & Routing", desc: "Cisco / Meraki switching and routing to connect every device with performance and low latency." },
      { title: "Corporate wireless", desc: "High-density Wi-Fi with secure access and full coverage across the entire organization." },
      { title: "IP Telephony · VoIP", desc: "Integrated IP telephony that unifies your company's communications on a single platform." },
      { title: "Network security", desc: "Perimeter protection and segmentation against threats and encrypted attacks." },
      { title: "Contingency & Environment", desc: "Redundancy and recovery from hardware or software failures for maximum continuity." },
    ],
    benefitsTitle: "Why choose Accedra",
    benefits: [
      "Certified partner of the leading brands",
      "Integration of voice, data, video and security",
      "Proactive infrastructure monitoring",
      "Fast failover to redundant systems",
      "Contractually defined SLA and on-site support",
      "A single point of contact, end to end",
    ],
    metaTitle: "Networking · Accedra",
    metaDescription:
      "High-availability network infrastructure: structured cabling, switching, wireless and VoIP. Certified partner of Cisco, Aruba and more.",
  },

  "firma-biometrica": {
    name: "Biometric Signature",
    eyebrow: "Our edge",
    title: "Electronic, biometric and",
    highlight: "digital signature.",
    subtitle:
      "Electronic, biometric and digital signature solutions tailored to the use case, the process and the applicable regulatory framework — with full traceability and no delays.",
    introTitle: "Paper is optional. Legal validity isn't.",
    intro:
      "We are among the few integrators in the country with our own electronic, biometric and digital signature practice. We digitize the document processes of banks, insurers and healthcare organizations, eliminating paper and safeguarding the legal validity of every process according to the applicable regulations.",
    painsTitle: "Do any of these situations sound familiar?",
    pains: [
      "You're still moving paper, signatures and physical files that slow down your processes.",
      "You need to digitize procedures without losing legal validity or traceability.",
      "You lose clients due to slow, in-person or high-friction signing processes.",
      "You need to guarantee identity and evidentiary backing and don't know which tool to use.",
    ],
    capabilities: [
      { title: "Biometric handwritten signature", desc: "Signature capture with biometric data on certified Wacom tablets, with legal validity under the applicable regulatory framework." },
      { title: "eSignAnywhere", desc: "Enterprise platform to read, edit and sign documents from any device, anytime and anywhere." },
      { title: "Digital factoring", desc: "100% digital factoring solutions — fast, auditable and frictionless." },
      { title: "Mobile signature", desc: "Sign documents from your phone, natively integrated into your processes." },
      { title: "Multi-biometrics", desc: "Multiple biometric factors for maximum identity security and non-repudiation." },
      { title: "Seamless integration", desc: "It integrates transparently into your existing systems, channels and workflows." },
    ],
    benefitsTitle: "Benefits",
    benefits: [
      "Legal validity and non-repudiation",
      "Full audit trail and change control",
      "Advanced cryptography (RSA / SHA-256)",
      "Aligned with current regulations and ISO standards",
      "Less paper: environmental responsibility",
      "Demonstrable ROI in the short term",
    ],
    industries: ["Banking", "Fintech", "Insurance", "Healthcare", "Telco", "Logistics", "Retail", "Education", "Automotive", "Pharma"],
    metaTitle: "Digital & Biometric Signature · Accedra",
    metaDescription:
      "Electronic, biometric and digital signature according to the applicable regulations: eSignAnywhere, Wacom tablets, digital factoring. Paperless document digitization.",
  },

  consultoria: {
    name: "Microsoft Consulting",
    eyebrow: "IT Solutions",
    title: "Your data, turned into",
    highlight: "decisions.",
    subtitle:
      "We turn the Microsoft technology you already have into a real competitive advantage — from day-to-day collaboration to executive analytics.",
    introTitle: "Knowledge, within reach of the entire organization.",
    intro:
      "Certified consultants who implement and optimize the complete Microsoft ecosystem: Power BI, Microsoft 365, Dynamics, SharePoint and Azure. Data that connects, gets organized and turns into decisions with a 360° perspective.",
    painsTitle: "Do any of these situations sound familiar?",
    pains: [
      "You have data everywhere, but no clear information to make decisions.",
      "You pay for Microsoft licenses your team only half uses.",
      "Your people waste hours on manual, repetitive tasks.",
      "Reports arrive late, built by hand and with no single source of truth.",
    ],
    capabilities: [
      { title: "Power BI", desc: "Executive dashboards and ad hoc analysis: connection to multiple sources, web and mobile reports, and a 360° perspective." },
      { title: "Microsoft 365 & Teams", desc: "Unified collaboration and productivity for all your teams." },
      { title: "Dynamics 365 & SharePoint", desc: "CRM/ERP and document management integrated into your operation." },
      { title: "Azure Cloud", desc: "Migration and infrastructure on Microsoft's cloud, with governance and security." },
      { title: "Power Automate", desc: "Automation of repetitive workflows to save time." },
      { title: "Licensing & CSP", desc: "License management and optimization as a Cloud Solution Provider." },
    ],
    benefitsTitle: "Benefits",
    benefits: [
      "Decisions based on data, not intuition",
      "360° business perspective",
      "Ad hoc analysis for the entire organization",
      "Corporate scalability",
      "Built-in security and governance",
      "Certified Microsoft consultants",
    ],
    metaTitle: "Microsoft Consulting & Power BI · Accedra",
    metaDescription:
      "Microsoft consulting: Power BI, Microsoft 365, Dynamics, SharePoint and Azure. Analytics and productivity for your company.",
  },

  seguridad: {
    name: "IT Security",
    eyebrow: "IT Solutions",
    title: "Enterprise-grade",
    highlight: "cybersecurity.",
    subtitle:
      "Detect and stop threats before they hit. We protect every layer of your organization with enterprise-class solutions.",
    introTitle: "Detecting and stopping threats, effectively.",
    intro:
      "Zero Trust architectures and managed security with the best brands on the market (Cisco, Palo Alto, Check Point). The enterprise-class cybersecurity demanded by the most demanding organizations, within your company's reach.",
    painsTitle: "Do any of these situations sound familiar?",
    pains: [
      "You don't know what would happen today if you suffered a ransomware attack.",
      "You have no real visibility into what enters and leaves your network.",
      "Your people work remotely without a security layer to protect them.",
      "Clients or audits demand security requirements you can't meet today.",
    ],
    capabilities: [
      { title: "Next-generation firewalls", desc: "They prevent breaches, provide full visibility and automate security operations." },
      { title: "Malware protection", desc: "Prevention, monitoring of malicious behavior and rapid removal with Cisco AMP." },
      { title: "Cloud security", desc: "Secure access, Office 365 protection and SaaS application control with Cisco Umbrella." },
      { title: "Endpoint security", desc: "Stopping known and unknown malware, plus incident investigation." },
      { title: "Email protection", desc: "Blocking phishing, ransomware and spam across the entire organization." },
      { title: "VPN & remote access", desc: "Secure connectivity and continuous endpoint protection, inside and outside the network." },
    ],
    benefitsTitle: "Benefits",
    benefits: [
      "Zero Trust architecture",
      "Full traffic visibility",
      "Incident response and auditing",
      "Local, cloud or centralized management",
      "Continuous monitoring and updates",
      "Compliance and business continuity",
    ],
    metaTitle: "Cybersecurity · Accedra",
    metaDescription:
      "Enterprise-grade cybersecurity: next-generation firewalls, Zero Trust, Cisco Umbrella and AMP, endpoint and email protection.",
  },
};
