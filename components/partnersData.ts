// Fuente única de los partners tecnológicos. La usa el muro del home (Partners.tsx)
// y el strip de la portada de cada solución (SolutionPage.tsx).
export type Partner = {
  name: string;
  logo: string;
  filter: string; // filtro para el muro del home (cards claras)
  blurb: string;
};

export const partners: Partner[] = [
  { name: "Cisco",              logo: "/logos/cisco-logo-blue-2016.png",                                              filter: "brightness(1.1) saturate(1.1)", blurb: "Líder mundial en redes empresariales: switching, routing y conectividad de alta disponibilidad." },
  { name: "Microsoft",          logo: "/logos/microsoft-logo-2012.png",                                    filter: "brightness(1.1) saturate(1.1)", blurb: "Nube Azure, identidad y productividad corporativa con gobernanza y seguridad integradas." },
  { name: "Palo Alto Networks", logo: "/logos/palo-alto-networks-logo.png",     filter: "brightness(0) invert(1)", blurb: "Firewalls de nueva generación y seguridad Zero Trust para proteger toda la red." },
  { name: "Nutanix",            logo: "/logos/nutanix-logo-charcoal-gray-digital.png", filter: "brightness(0) invert(1)", blurb: "Infraestructura hiperconvergente y nube híbrida que simplifica el datacenter." },
  { name: "Wacom",              logo: "/logos/wacom-logo-svg.png",                                                 filter: "brightness(0) invert(1)", blurb: "Tabletas de firma y digitalización biométrica para trámites 100% digitales." },
  { name: "Pure Storage",       logo: "/logos/pure-storage-vector-logo.png",     filter: "brightness(0) invert(1)", blurb: "Almacenamiento all-flash de alto rendimiento con eficiencia y simplicidad de gestión." },
  { name: "Vicarius",           logo: "https://www.google.com/s2/favicons?domain=vicarius.io&sz=128",                                    filter: "brightness(1.1) saturate(1.1)", blurb: "Gestión y remediación automática de vulnerabilidades en tiempo real." },
  { name: "APC by Schneider",   logo: "/logos/apc-by-schneider-electric.png", filter: "brightness(1.1) saturate(1.1)", blurb: "Energía ininterrumpida (UPS) y protección eléctrica para infraestructura crítica." },
  { name: "HPE Aruba",          logo: "/logos/hpe-aruba-networking-logo.png",     filter: "brightness(1.1) saturate(1.1)", blurb: "Redes Wi-Fi empresariales y acceso seguro con inteligencia en el borde." },
  { name: "CommScope",          logo: "/logos/commscope-logo.png",                filter: "brightness(0) invert(1)", blurb: "Cableado estructurado e infraestructura de conectividad de misión crítica." },
  { name: "Dahua",              logo: "/logos/dahua-technology-logo.png",     filter: "brightness(1.1) saturate(1.1)", blurb: "Videovigilancia y soluciones de seguridad electrónica basadas en IA." },
  { name: "Hikvision",          logo: "/logos/hikvision-logo.png",             filter: "brightness(1.1) saturate(1.1)", blurb: "Cámaras IP y sistemas de videovigilancia inteligente para todo tipo de entorno." },
  { name: "TP-Link",            logo: "https://www.google.com/s2/favicons?domain=tp-link.com&sz=128",                                    filter: "brightness(1.1) saturate(1.1)", blurb: "Networking y conectividad Wi-Fi confiable para empresas y sucursales." },
  { name: "Namirial",           logo: "https://www.google.com/s2/favicons?domain=namirial.com&sz=128",                                   filter: "brightness(1.1) saturate(1.1)", blurb: "Firma electrónica y digitalización de procesos con validez legal." },
  { name: "Check Point",        logo: "/logos/check-point-logo-2022.png",  filter: "brightness(1.1) saturate(1.1)", blurb: "Ciberseguridad y protección perimetral de red con prevención de amenazas avanzada." },
];
