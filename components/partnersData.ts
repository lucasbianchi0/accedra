// Fuente única de los partners tecnológicos. La usa el muro del home (Partners.tsx)
// y el strip de la portada de cada solución (SolutionPage.tsx).
export type Partner = {
  name: string;
  logo: string;
  filter: string; // filtro para el muro del home (cards claras)
  blurb: string;
};

export const partners: Partner[] = [
  { name: "Cisco",              logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Cisco_logo_blue_2016.svg/250px-Cisco_logo_blue_2016.svg.png",                                              filter: "brightness(1.1) saturate(1.1)", blurb: "Líder mundial en redes empresariales: switching, routing y conectividad de alta disponibilidad." },
  { name: "Microsoft",          logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Microsoft_logo_%282012%29.svg/250px-Microsoft_logo_%282012%29.svg.png",                                    filter: "brightness(1.1) saturate(1.1)", blurb: "Nube Azure, identidad y productividad corporativa con gobernanza y seguridad integradas." },
  { name: "Palo Alto Networks", logo: "https://commons.wikimedia.org/wiki/Special:FilePath/Palo-Alto-Networks-logo.svg?width=240",     filter: "brightness(0) invert(1)", blurb: "Firewalls de nueva generación y seguridad Zero Trust para proteger toda la red." },
  { name: "Nutanix",            logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Nutanix-Logo-Charcoal-Gray-Digital.svg/250px-Nutanix-Logo-Charcoal-Gray-Digital.svg.png", filter: "brightness(0) invert(1)", blurb: "Infraestructura hiperconvergente y nube híbrida que simplifica el datacenter." },
  { name: "Wacom",              logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Wacom_logo.svg/250px-Wacom_logo.svg.png",                                                 filter: "brightness(0) invert(1)", blurb: "Tabletas de firma y digitalización biométrica para trámites 100% digitales." },
  { name: "Pure Storage",       logo: "https://commons.wikimedia.org/wiki/Special:FilePath/Pure-storage-vector-logo.svg?width=240",     filter: "brightness(0) invert(1)", blurb: "Almacenamiento all-flash de alto rendimiento con eficiencia y simplicidad de gestión." },
  { name: "Vicarius",           logo: "https://www.google.com/s2/favicons?domain=vicarius.io&sz=128",                                    filter: "brightness(1.1) saturate(1.1)", blurb: "Gestión y remediación automática de vulnerabilidades en tiempo real." },
  { name: "Verge.IO",           logo: "https://www.google.com/s2/favicons?domain=verge.io&sz=128",                                       filter: "brightness(1.1) saturate(1.1)", blurb: "Virtualización e infraestructura definida por software en una sola plataforma." },
  { name: "APC by Schneider",   logo: "https://commons.wikimedia.org/wiki/Special:FilePath/APC%20by%20Schneider%20Electric.png?width=240", filter: "brightness(1.1) saturate(1.1)", blurb: "Energía ininterrumpida (UPS) y protección eléctrica para infraestructura crítica." },
  { name: "HPE Aruba",          logo: "https://commons.wikimedia.org/wiki/Special:FilePath/Hpe-aruba-networking-logo.svg?width=240",     filter: "brightness(1.1) saturate(1.1)", blurb: "Redes Wi-Fi empresariales y acceso seguro con inteligencia en el borde." },
  { name: "CommScope",          logo: "https://commons.wikimedia.org/wiki/Special:FilePath/Commscope-logo.png?width=240",                filter: "brightness(0) invert(1)", blurb: "Cableado estructurado e infraestructura de conectividad de misión crítica." },
  { name: "Dahua",              logo: "https://commons.wikimedia.org/wiki/Special:FilePath/Dahua%20Technology%20logo.svg?width=240",     filter: "brightness(1.1) saturate(1.1)", blurb: "Videovigilancia y soluciones de seguridad electrónica basadas en IA." },
  { name: "Hikvision",          logo: "https://commons.wikimedia.org/wiki/Special:FilePath/Hikvision%20logo.svg?width=240",             filter: "brightness(1.1) saturate(1.1)", blurb: "Cámaras IP y sistemas de videovigilancia inteligente para todo tipo de entorno." },
  { name: "TP-Link",            logo: "https://www.google.com/s2/favicons?domain=tp-link.com&sz=128",                                    filter: "brightness(1.1) saturate(1.1)", blurb: "Networking y conectividad Wi-Fi confiable para empresas y sucursales." },
  { name: "Namirial",           logo: "https://www.google.com/s2/favicons?domain=namirial.com&sz=128",                                   filter: "brightness(1.1) saturate(1.1)", blurb: "Firma electrónica y digitalización de procesos con validez legal." },
  { name: "Check Point",        logo: "https://commons.wikimedia.org/wiki/Special:FilePath/Check%20Point%20logo%202022.svg?width=240",  filter: "brightness(1.1) saturate(1.1)", blurb: "Ciberseguridad y protección perimetral de red con prevención de amenazas avanzada." },
];
