// Logos wordmark A COLOR de las marcas de cada solución, para la franja
// "Trabajamos con" (fondo claro estilo Stripe). Se pueden swappear las URLs.


// showName: para isotipos sin texto (ej. iconos de Power BI/Azure/SharePoint/
// Power Automate) mostramos el nombre al lado, así se reconocen.
// color: isotipos que solo se reconocen a color (ej. Power BI amarillo, Azure
// azul). Se muestran a color sobre un chip claro en vez de blanqueados.
export type TechLogo = { name: string; logo: string; showName?: boolean; color?: boolean };

export const TECH_LOGOS: Record<string, TechLogo> = {
  // Networking
  Cisco: { name: "Cisco", logo: "/logos/cisco-logo-blue-2016.png" },
  Meraki: { name: "Cisco Meraki", logo: "/logos/meraki-logo-2016.png" },
  Aruba: { name: "HPE Aruba", logo: "/logos/hpe-aruba-networking-logo.png" },
  Juniper: { name: "Juniper Networks", logo: "/logos/juniper-networks-logo.png" },
  Huawei: { name: "Huawei", logo: "/logos/si-huawei.svg" },
  Ubiquiti: { name: "Ubiquiti", logo: "/logos/ubiquiti-logo-2023.png" },
  Avaya: { name: "Avaya", logo: "/logos/avaya-logo.png" },
  APC: { name: "APC by Schneider", logo: "/logos/apc-by-schneider-electric.png" },
  Vertiv: { name: "Vertiv", logo: "/logos/vertiv-logo.png" },
  SonicWall: { name: "SonicWall", logo: "/logos/sonicwall-logo.png" },
  // Cableado estructurado (líneas de producto → mostramos el nombre)
  "CommScope NetConnect": { name: "NetConnect", logo: "/logos/commscope-logo.png", showName: true },
  "CommScope Systimax": { name: "SYSTIMAX", logo: "/logos/commscope-logo.png", showName: true },
  Furukawa: { name: "Furukawa", logo: "", showName: true },
  Siemon: { name: "Siemon", logo: "", showName: true },
  "Schneider Electric": { name: "Schneider Electric", logo: "/logos/schneider-electric-2007.png" },

  // Firma
  Wacom: { name: "Wacom", logo: "/logos/wacom-logo-svg.png" },
  Namirial: { name: "Namirial", logo: "/logos/namirial-logo.png" },
  Thales: { name: "Thales", logo: "/logos/thales-logo.png" },

  // Seguridad
  "Palo Alto Networks": { name: "Palo Alto Networks", logo: "/logos/palo-alto-networks-logo.png" },
  "Check Point": { name: "Check Point", logo: "/logos/check-point-logo-2022.png" },

  // Consultoría Microsoft
  Microsoft: { name: "Microsoft", logo: "/logos/microsoft-logo-2012.png" },
  "Power BI": { name: "Power BI", logo: "/logos/new-power-bi-logo.png", showName: true, color: true },
  Azure: { name: "Azure", logo: "/logos/microsoft-azure-icon.png", showName: true, color: true },
  "Dynamics 365": { name: "Dynamics 365", logo: "/logos/microsoft-dynamics-365-logo-2021-present.png" },
  SharePoint: { name: "SharePoint", logo: "/logos/microsoft-office-sharepoint-2025-present.png", showName: true, color: true },
  "Power Automate": { name: "Power Automate", logo: "/logos/microsoft-power-automate.png", showName: true, color: true },

  // Software & AI — isotipos monocromos: mostramos el nombre al lado (showName)
  // porque blanqueados y sin wordmark eran ilegibles. AWS conserva su wordmark.
  OpenAI: { name: "OpenAI", logo: "/logos/openai-logo.png", showName: true },
  Anthropic: { name: "Anthropic", logo: "/logos/si-anthropic.svg", showName: true },
  Gemini: { name: "Google Gemini", logo: "/logos/si-googlegemini.svg", showName: true },
  HuggingFace: { name: "Hugging Face", logo: "/logos/si-huggingface.svg", showName: true },
  LangChain: { name: "LangChain", logo: "/logos/si-langchain.svg", showName: true },
  Python: { name: "Python", logo: "/logos/si-python.svg", showName: true },
  PyTorch: { name: "PyTorch", logo: "/logos/si-pytorch.svg", showName: true },
  TensorFlow: { name: "TensorFlow", logo: "/logos/si-tensorflow.svg", showName: true },
  TypeScript: { name: "TypeScript", logo: "/logos/si-typescript.svg", showName: true },
  React: { name: "React", logo: "/logos/si-react.svg", showName: true },
  "Node.js": { name: "Node.js", logo: "/logos/si-nodedotjs.svg", showName: true },
  AWS: { name: "AWS", logo: "/logos/amazon-web-services-logo.png" },
  "Google Cloud": { name: "Google Cloud", logo: "/logos/si-googlecloud.svg", showName: true },
  Docker: { name: "Docker", logo: "/logos/si-docker.svg", showName: true },
  PostgreSQL: { name: "PostgreSQL", logo: "/logos/si-postgresql.svg", showName: true },
  n8n: { name: "n8n", logo: "/logos/si-n8n.svg", showName: true },
};
