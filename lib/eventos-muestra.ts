/**
 * Eventos de ejemplo, SÓLO para desarrollo.
 *
 * Sirven para ver cómo queda la sección sin cargar nada en la base, que es la
 * misma que usa producción. Se piden con `?muestra=1` (en la portada y en
 * /eventos). Sus ids empiezan con `muestra-`: el endpoint de inscripción los
 * acepta en desarrollo sin tocar la base ni mandar correo.
 *
 * En producción las dos funciones devuelven vacío pase lo que pase: un evento
 * inventado publicado en accedra.com.ar sería un anuncio falso.
 */

import type { EventoSitio, MarcaSitio } from "@/lib/eventos";

const enDesarrollo = process.env.NODE_ENV !== "production";

const logo = (id: string, nombre: string, archivo: string): MarcaSitio => ({ id, nombre, logoUrl: `/logos/${archivo}` });

const MS = logo("ms", "Microsoft", "microsoft-logo-2012.png");
const PA = logo("pa", "Power Automate", "microsoft-power-automate.png");
const SP = logo("sp", "SharePoint", "microsoft-office-sharepoint-2025-present.png");
const WACOM = logo("wacom", "Wacom", "wacom-logo-svg.png");
const NAMIRIAL = logo("namirial", "Namirial", "namirial-logo.png");
const PALO = logo("palo", "Palo Alto Networks", "palo-alto-networks-logo.png");
const CISCO = logo("cisco", "Cisco", "cisco-logo-blue-2016.png");
const MERAKI = logo("meraki", "Meraki", "meraki-logo-2016.png");
const N8N = logo("n8n", "n8n", "si-n8n.svg");
const OPENAI = logo("openai", "OpenAI", "openai-logo.png");
const ANTHROPIC = logo("anthropic", "Anthropic", "si-anthropic.svg");

/** Una fecha a `dias` de hoy, a la hora dada de Buenos Aires (UTC−3). */
function dia(dias: number, hora: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + dias);
  d.setUTCHours(hora + 3, 0, 0, 0);
  return d.toISOString();
}

function sumarHoras(iso: string, h: number): string {
  return new Date(new Date(iso).getTime() + h * 3_600_000).toISOString();
}

function base(e: Partial<EventoSitio> & Pick<EventoSitio, "slug" | "titulo" | "inicio">): EventoSitio {
  return {
    id: e.slug,
    destacado: false,
    tipo: "workshop",
    modalidad: "presencial",
    resumen: "",
    descripcion: "",
    tags: [],
    categorias: [],
    fin: sumarHoras(e.inicio, 3),
    lugar: "",
    inscripcionUrl: "",
    cupo: null,
    precio: "",
    oradores: [],
    marcas: [],
    portadaUrl: null,
    ...e,
  };
}

function todos(): EventoSitio[] {
  return [
    base({
      slug: "muestra-copilot-equipos-comerciales",
      categorias: ["software-ai", "consultoria"],
      destacado: true,
      titulo: "Microsoft Copilot para equipos comerciales",
      resumen:
        "Tres horas prácticas para que tu equipo use Copilot en Outlook, Teams y Excel desde el día siguiente. Con casos reales de propuestas y seguimiento de clientes.",
      descripcion:
        "Un workshop con la computadora abierta: cada participante trabaja sobre su propio Microsoft 365.\n\nVamos a ver cómo resumir hilos de correo y redactar respuestas en Outlook, sacar tareas y decisiones de una reunión de Teams, analizar un pipeline de ventas en Excel en lenguaje natural y armar una propuesta comercial desde un documento base.\n\nPensado para gerentes y ejecutivos comerciales. No hace falta experiencia previa con IA.",
      inicio: dia(12, 18),
      lugar: "Oficinas Accedra · Irala 1950, CABA",
      cupo: 30,
      precio: "Sin costo",
      inscripcionUrl: "https://forms.office.com/",
      tags: ["IA", "Microsoft 365", "Productividad"],
      oradores: [{ nombre: "Martín Arjona", cargo: "Services Professional", empresa: "Accedra" }],
      marcas: [MS, SP, PA],
      portadaUrl: "/images/3184292.jpg",
    }),
    base({
      slug: "muestra-firma-biometrica-2027",
      categorias: ["firma-biometrica"],
      tipo: "webinar",
      modalidad: "online",
      titulo: "Firma biométrica con validez legal: qué cambia en 2027",
      resumen: "Una hora, online. Cómo se firma un contrato de punta a punta con validez legal y qué exige la nueva normativa.",
      descripcion:
        "Repasamos el marco legal de la firma digital y biométrica en Argentina, mostramos una implementación real en sucursales bancarias y respondemos preguntas en vivo.",
      inicio: dia(20, 11),
      fin: sumarHoras(dia(20, 11), 1),
      lugar: "Microsoft Teams",
      precio: "Sin costo",
      tags: ["Firma digital", "Legal", "Banca"],
      marcas: [WACOM, NAMIRIAL],
      portadaUrl: "/images/1181244.jpg",
    }),
    base({
      slug: "muestra-zero-trust",
      categorias: ["seguridad", "networking"],
      tipo: "capacitacion",
      modalidad: "hibrido",
      titulo: "Zero Trust en la práctica con Palo Alto y Cisco",
      resumen: "Segmentación, acceso remoto seguro y visibilidad de la red, con laboratorio en vivo.",
      inicio: dia(34, 9),
      fin: sumarHoras(dia(34, 9), 6),
      lugar: "Oficinas Accedra y online",
      cupo: 20,
      precio: "USD 150 + IVA",
      tags: ["Ciberseguridad", "Networking"],
      marcas: [PALO, CISCO, MERAKI],
    }),
    base({
      slug: "muestra-automatizacion-power-automate-n8n",
      categorias: ["software-ai", "consultoria"],
      titulo: "Automatización de procesos con Power Automate y n8n",
      resumen: "Del formulario al ERP sin tocar código: flujos reales de aprobación, facturación y alertas.",
      inicio: dia(-25, 18),
      lugar: "Oficinas Accedra",
      tags: ["Automatización"],
      marcas: [PA, N8N],
      portadaUrl: "/images/3183197.jpg",
    }),
    base({
      slug: "muestra-ia-generativa-soporte",
      categorias: ["software-ai"],
      tipo: "charla",
      modalidad: "online",
      titulo: "IA generativa para áreas de soporte y mesa de ayuda",
      resumen: "Cómo reducir tiempos de respuesta con asistentes entrenados sobre la documentación propia.",
      inicio: dia(-60, 16),
      lugar: "Microsoft Teams",
      tags: ["IA", "Soporte"],
      marcas: [OPENAI, ANTHROPIC],
      portadaUrl: "/cases/andreani.jpg",
    }),
  ];
}

export function eventosMuestra(): { proximos: EventoSitio[]; pasados: EventoSitio[] } {
  if (!enDesarrollo) return { proximos: [], pasados: [] };
  const ahora = Date.now();
  const lista = todos();
  return {
    proximos: lista.filter((e) => new Date(e.inicio).getTime() > ahora),
    pasados: lista.filter((e) => new Date(e.inicio).getTime() <= ahora),
  };
}
