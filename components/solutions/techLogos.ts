// Logos wordmark A COLOR de las marcas de cada solución, para la franja
// "Trabajamos con" (fondo claro estilo Stripe). Se pueden swappear las URLs.

const wiki = (file: string, width = 220) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${file}?width=${width}`;
const si = (slug: string) => `https://cdn.simpleicons.org/${slug}`;

// showName: para isotipos sin texto (ej. iconos de Power BI/Azure/SharePoint/
// Power Automate) mostramos el nombre al lado, así se reconocen.
// color: isotipos que solo se reconocen a color (ej. Power BI amarillo, Azure
// azul). Se muestran a color sobre un chip claro en vez de blanqueados.
export type TechLogo = { name: string; logo: string; showName?: boolean; color?: boolean };

export const TECH_LOGOS: Record<string, TechLogo> = {
  // Networking
  Cisco: { name: "Cisco", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Cisco_logo_blue_2016.svg/250px-Cisco_logo_blue_2016.svg.png" },
  Meraki: { name: "Cisco Meraki", logo: wiki("Meraki%20Logo%202016.svg") },
  Aruba: { name: "HPE Aruba", logo: wiki("Hpe-aruba-networking-logo.svg") },
  Juniper: { name: "Juniper Networks", logo: wiki("Juniper%20Networks%20logo.svg") },
  Huawei: { name: "Huawei", logo: "https://cdn.simpleicons.org/huawei" },
  Ubiquiti: { name: "Ubiquiti", logo: wiki("Ubiquiti%20Logo%202023.svg") },
  Avaya: { name: "Avaya", logo: wiki("Avaya%20Logo.svg") },
  APC: { name: "APC by Schneider", logo: wiki("APC%20by%20Schneider%20Electric.png") },
  Vertiv: { name: "Vertiv", logo: wiki("Vertiv%20logo.svg") },
  SonicWall: { name: "SonicWall", logo: wiki("SonicWall%20logo.svg") },
  // Cableado estructurado (líneas de producto → mostramos el nombre)
  "CommScope NetConnect": { name: "NetConnect", logo: wiki("Commscope-logo.png"), showName: true },
  "CommScope Systimax": { name: "SYSTIMAX", logo: wiki("Commscope-logo.png"), showName: true },
  Furukawa: { name: "Furukawa", logo: "", showName: true },
  Siemon: { name: "Siemon", logo: "", showName: true },
  "Schneider Electric": { name: "Schneider Electric", logo: wiki("Schneider%20Electric%202007.svg") },

  // Firma
  Wacom: { name: "Wacom", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Wacom_logo.svg/250px-Wacom_logo.svg.png" },
  Namirial: { name: "Namirial", logo: wiki("Namirial%20logo.svg") },
  Thales: { name: "Thales", logo: wiki("Thales%20Logo.svg") },

  // Seguridad
  "Palo Alto Networks": { name: "Palo Alto Networks", logo: wiki("Palo-Alto-Networks-logo.svg") },
  "Check Point": { name: "Check Point", logo: wiki("Check%20Point%20logo%202022.svg") },

  // Consultoría Microsoft
  Microsoft: { name: "Microsoft", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Microsoft_logo_%282012%29.svg/250px-Microsoft_logo_%282012%29.svg.png" },
  "Power BI": { name: "Power BI", logo: wiki("New%20Power%20BI%20Logo.svg", 120), showName: true, color: true },
  Azure: { name: "Azure", logo: wiki("Microsoft%20azure-icon.svg", 120), showName: true, color: true },
  "Dynamics 365": { name: "Dynamics 365", logo: wiki("Microsoft%20Dynamics%20365%20Logo%20(2021%E2%80%93present).svg", 200) },
  SharePoint: { name: "SharePoint", logo: wiki("Microsoft%20Office%20SharePoint%20(2025%E2%80%93present).svg", 120), showName: true, color: true },
  "Power Automate": { name: "Power Automate", logo: wiki("Microsoft%20Power%20Automate.svg", 120), showName: true, color: true },

  // Software & AI (se muestran en blanco monocromo en la portada)
  OpenAI: { name: "OpenAI", logo: wiki("OpenAI%20Logo.svg", 200) },
  Anthropic: { name: "Anthropic", logo: si("anthropic") },
  Gemini: { name: "Google Gemini", logo: si("googlegemini") },
  HuggingFace: { name: "Hugging Face", logo: si("huggingface") },
  LangChain: { name: "LangChain", logo: si("langchain") },
  Python: { name: "Python", logo: si("python") },
  PyTorch: { name: "PyTorch", logo: si("pytorch") },
  TensorFlow: { name: "TensorFlow", logo: si("tensorflow") },
  TypeScript: { name: "TypeScript", logo: si("typescript") },
  React: { name: "React", logo: si("react") },
  "Node.js": { name: "Node.js", logo: si("nodedotjs") },
  AWS: { name: "AWS", logo: wiki("Amazon%20Web%20Services%20Logo.svg", 200) },
  "Google Cloud": { name: "Google Cloud", logo: si("googlecloud") },
  Docker: { name: "Docker", logo: si("docker") },
  PostgreSQL: { name: "PostgreSQL", logo: si("postgresql") },
  n8n: { name: "n8n", logo: si("n8n") },
};
