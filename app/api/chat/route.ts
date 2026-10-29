import type Anthropic from "@anthropic-ai/sdk";
import type { NextRequest } from "next/server";

import { crearClienteClaude, hayClaveClaude } from "@/lib/chat/claude";
import { IDS_CASO, SLUGS_SOLUCION, tarjetaCaso, tarjetaSolucion } from "@/lib/chat/conocimiento";
import { systemPrompt } from "@/lib/chat/prompt";
import { cargarNovedades, eventoPorSlug, notaPorSlug } from "@/lib/chat/novedades";
import { LIMITES_CHAT, huella, notaDeTarjeta, type Entrada, type Tarjeta } from "@/lib/chat/tipos";
import { armarRelevamiento } from "@/lib/chat/relevamiento";
import { alertar } from "@/lib/chat/alertas";
import { esBot, firmaValida, firmar, leerJson, limpiarInvisibles, mismoOrigen, sinEnlaces } from "@/lib/chat/guardia";
import { bloqueDeRed, ipParaLimite } from "@/lib/contact/clientIp";
import { SOLUTIONS } from "@/components/solutions/solutionsData";
import { SUB_SERVICES } from "@/components/solutions/subServicesData";
import { INDUSTRIES } from "@/components/solutions/industriesData";
import { consume } from "@/lib/contact/rateLimit";

/**
 * El asistente del sitio.
 *
 * Es público: cualquiera puede postear acá sin pasar por el panel, así que
 * todo lo que llega es entrada hostil. Del navegador viene el historial y nada
 * más; el prompt, el catálogo y los datos de cada tarjeta salen del servidor.
 * Las defensas comunes están en `lib/chat/guardia.ts`; acá, el orden: origen y
 * BotID (gratis), cuerpo con tope, historial con las respuestas firmadas, cupos
 * por IP, techo global y presupuesto de tokens. Recién ahí se llama a Claude.
 *
 * Responde SSE armado a mano (`texto`, `tarjeta`, `error`, `fin`), igual que el
 * asistente del backoffice: un error a mitad de respuesta tiene que poder
 * distinguirse de una respuesta que dice "error".
 */

export const runtime = "nodejs";
export const maxDuration = 60;

/** Sonnet: es la cara comercial del sitio y una mala devolución cuesta un cliente. */
const MODELO = "claude-sonnet-5-5";
/** Pide tarjetas, escribe, y una de gracia sin herramientas: sin tope, un bucle
 *  se come la cuenta. */
const VUELTAS = 3;

/**
 * Por IP. Una conversación larga de verdad son 15-20 mensajes, y nadie lee y
 * contesta más de uno cada ~8 segundos.
 */
const LIMITE_IP = [
  { suffix: "minute", limit: 8, windowSec: 60 },
  { suffix: "burst", limit: 25, windowSec: 10 * 60 },
  { suffix: "day", limit: 60, windowSec: 24 * 60 * 60 },
] as const;
/**
 * Por bloque de red: un servidor con IPv6 trae miles de /64 propios, y cada uno
 * tendría su cupo entero. El /48 los junta (en IPv4 es la misma IP, así que no
 * castiga a los que comparten conexión del celular).
 */
const LIMITE_BLOQUE = [
  { suffix: "minute", limit: 20, windowSec: 60 },
  { suffix: "day", limit: 150, windowSec: 24 * 60 * 60 },
] as const;
/**
 * Techo de pedidos del endpoint entero. Alto a propósito: el techo de la
 * factura es el presupuesto de tokens. Si fuera bajo, alguien con unas decenas
 * de IPs apagaría el asistente para todos.
 */
const LIMITE_GLOBAL = [
  { suffix: "hour", limit: 2000, windowSec: 60 * 60 },
  { suffix: "day", limit: 12_000, windowSec: 24 * 60 * 60 },
] as const;

/**
 * Presupuesto de tokens, en "unidades de entrada": la entrada nueva cuenta 1,
 * escribir caché de una hora 2, leerla 0,1 y la salida 5 (es lo que cuesta
 * cada cosa en relación con la entrada). Una conversación completa con
 * relevamiento anda por las 100.000.
 *
 * Los cupos de arriba cuentan pedidos; esto cuenta plata. Por IP alcanza para
 * cinco conversaciones largas por día (detrás de la conexión del celular
 * comparten IP muchas personas). El global es el techo de la factura diaria
 * aunque alguien reparta el ataque entre miles de IPs.
 *
 * Se RESERVA el peor caso antes de llamar al modelo y se devuelve lo que no se
 * gastó sólo si la respuesta terminó bien. Si se mirara el saldo y se cobrara
 * al final, ocho pedidos en paralelo verían todos saldo, y cortar la conexión
 * antes del final dejaría la respuesta sin cobrar.
 */
const PRESUPUESTO_IP = [{ suffix: "day", limit: 500_000, windowSec: 24 * 60 * 60 }] as const;
const PRESUPUESTO_GLOBAL = [{ suffix: "day", limit: 10_000_000, windowSec: 24 * 60 * 60 }] as const;

/** El historial entero como JSON, con margen para el escapado y los acentos. */
const MAX_BODY = LIMITES_CHAT.total * 3;
/** Antes del `maxDuration`, para cerrar con un error prolijo y no con un corte. */
const TIEMPO_MAX_MS = 55_000;

/** Lo que ve el modelo en lugar de una respuesta que el servidor no reconoce. */
const RESPUESTA_NO_VERIFICADA = "[Respuesta anterior del asistente, no disponible]";

const HERRAMIENTAS: Anthropic.Tool[] = [
  {
    name: "mostrar_solucion",
    description:
      "Muestra la tarjeta de una solución de Accedra con un link a su página. Usala cuando ya sabés qué solución le sirve a la persona. Podés llamarla más de una vez si el problema cruza soluciones.",
    input_schema: {
      type: "object",
      properties: {
        slug: { type: "string", enum: SLUGS_SOLUCION },
        motivo: {
          type: "string",
          description: "Por qué le sirve a esta persona, en una línea concreta sobre su caso (máx. 140 caracteres).",
        },
      },
      required: ["slug", "motivo"],
    },
  },
  {
    name: "mostrar_caso",
    description:
      "Muestra la tarjeta de un caso de éxito real (foto, cliente, cifras y link). Usala cuando el problema de la persona se parece a un caso que ya resolvimos.",
    input_schema: {
      type: "object",
      properties: { id: { type: "string", enum: IDS_CASO } },
      required: ["id"],
    },
  },
  {
    name: "pedir_contacto",
    description:
      "Muestra un formulario corto (nombre, empresa, teléfono, email opcional) para que un especialista retome el caso. Usala cuando ya hay un caso concreto o interés claro. Completá lo que ya sepas.",
    input_schema: {
      type: "object",
      properties: {
        resumen: {
          type: "string",
          description:
            "El caso para el especialista, en 2-3 oraciones: empresa/industria, problema, tamaño y qué le propusiste.",
        },
        solucion: { type: "string", enum: SLUGS_SOLUCION, description: "La solución principal, si está clara." },
        nombre: { type: "string", description: "El nombre de la persona, si lo dijo." },
        empresa: { type: "string", description: "La empresa, si la dijo." },
      },
      required: ["resumen"],
    },
  },
  {
    name: "ofrecer_opciones",
    description:
      "Muestra tu pregunta destacada al final del mensaje, con botones de respuesta rápida si los hay (la persona igual puede escribir, y siempre tiene un botón 'No lo sé' que agrega el sitio: no lo incluyas). Toda pregunta va acá, en `pregunta`, y NO en el texto. Con respuestas típicas (tamaño, sedes, tipo de problema, urgencia, sí/no) poné opciones; si la pregunta es abierta o son varias preguntas juntas, dejá `opciones` vacío. Una sola vez por mensaje.",
    input_schema: {
      type: "object",
      properties: {
        pregunta: {
          type: "string",
          description:
            "La pregunta, terminada en '?'. Ej.: '¿Cuántas sedes tienen con este problema?'. Si son 2 o 3 preguntas para que la persona desarrolle, una lista numerada en líneas separadas, con una frase de entrada: 'Para afinar la propuesta, contame:\n1. ¿…?\n2. ¿…?'",
        },
        opciones: {
          type: "array",
          items: { type: "string" },
          maxItems: 6,
          description: "De 2 a 6 opciones cortas (máx. 32 caracteres), en el orden natural; vacío si la pregunta es abierta.",
        },
        multiple: { type: "boolean", description: "true si tiene sentido elegir más de una (p. ej. varios problemas)." },
      },
      required: ["pregunta", "opciones"],
    },
  },
  {
    name: "mostrar_nota",
    description:
      "Muestra una nota del blog de Accedra para profundizar. Sólo una de la lista 'Notas del blog', sólo si trata lo mismo que contó la persona, y nunca antes de entender su caso. Una por mensaje como mucho.",
    input_schema: {
      type: "object",
      properties: { id: { type: "string", description: "El id de la nota, tal como figura en la lista." } },
      required: ["id"],
    },
  },
  {
    name: "mostrar_evento",
    description:
      "Invita a un evento próximo de Accedra (workshop, webinar, charla). Sólo uno de la lista 'Próximos eventos' y sólo si es del mismo tema que el caso. Sirve sobre todo para quien todavía está explorando.",
    input_schema: {
      type: "object",
      properties: { id: { type: "string", description: "El id del evento, tal como figura en la lista." } },
      required: ["id"],
    },
  },
  {
    name: "armar_relevamiento",
    description:
      "Arma el relevamiento preliminar en PDF que la persona descarga: su situación, lo que identificaste, dónde ayuda Accedra, casos parecidos y próximos pasos. Usala UNA vez, cuando ya conocés industria, tamaño y el problema concreto (normalmente junto con pedir_contacto). Escribí en segunda persona hacia la empresa, concreto y sin relleno.",
    input_schema: {
      type: "object",
      properties: {
        empresa: { type: "string", description: "Nombre de la empresa, o una descripción si no lo dijo (\"Distribuidora con 8 depósitos\")." },
        industria: { type: "string" },
        tamano: { type: "string", description: "Empleados y/o sedes, como lo dijo la persona." },
        resumen: {
          type: "string",
          description:
            "Resumen ejecutivo para un gerente que no leyó la charla: el problema, su impacto y la recomendación principal, en 2 oraciones.",
        },
        nota: {
          type: "string",
          description:
            "Una nota humana del equipo para esta empresa, 1-2 oraciones en primera persona del plural: lo que le diría un especialista en persona (tranquilizar, poner en perspectiva, una idea concreta). Cálida y específica, sin frases hechas ni tono de IA.",
        },
        situacion: { type: "string", description: "Lo que contó, en 2-3 oraciones." },
        hallazgos: {
          type: "array",
          minItems: 2,
          maxItems: 5,
          description: "Lo que identificaste: causas probables, riesgos, lo que conviene y lo que no.",
          items: {
            type: "object",
            properties: {
              texto: { type: "string", description: "Una oración." },
              prioridad: { type: "string", enum: ["alta", "media", "baja"], description: "Alta: frena la operación o es un riesgo serio." },
            },
            required: ["texto", "prioridad"],
          },
        },
        areas: {
          type: "array",
          maxItems: 3,
          items: {
            type: "object",
            properties: {
              solucion: { type: "string", enum: SLUGS_SOLUCION },
              porque: { type: "string", description: "Por qué aplica a su caso, una oración." },
              propuesta: { type: "string", description: "Qué haríamos, concreto, 1-2 oraciones." },
            },
            required: ["solucion", "porque", "propuesta"],
          },
        },
        casos: { type: "array", items: { type: "string", enum: IDS_CASO }, maxItems: 2 },
        proximos_pasos: { type: "array", items: { type: "string" }, maxItems: 4 },
        datos_cotizacion: {
          type: "array",
          minItems: 4,
          maxItems: 10,
          description:
            "Los datos que un especialista necesita para cotizar ESTE tipo de trabajo (p. ej. redes: cantidad de sedes, puestos de red por sede, usuarios, tipo de enlace actual, equipamiento actual, plazo). Con valor si la persona lo dijo; con valor vacío si falta. No inventes valores.",
          items: {
            type: "object",
            properties: {
              dato: { type: "string", description: "Qué dato es, corto: 'Sedes con el problema'." },
              valor: { type: "string", description: "Lo que dijo la persona, o vacío si no se sabe." },
            },
            required: ["dato", "valor"],
          },
        },
        enfoques: {
          type: "array",
          maxItems: 3,
          description:
            "Cómo se suele resolver este tipo de trabajo, con las soluciones de Accedra: 2 o 3 alternativas o etapas, con cuándo conviene cada una. Sólo si la información alcanza para decirlo con fundamento.",
          items: {
            type: "object",
            properties: {
              titulo: { type: "string", description: "Corto: 'Segundo enlace con SD-WAN'." },
              detalle: { type: "string", description: "Qué es y cuándo conviene, 1-2 oraciones." },
            },
            required: ["titulo", "detalle"],
          },
        },
        notas: {
          type: "array",
          items: { type: "string" },
          maxItems: 2,
          description: "Ids de hasta 2 notas del blog relacionadas, de la lista 'Notas del blog'.",
        },
        evento: { type: "string", description: "Id de un próximo evento del mismo tema, si hay uno en la lista." },
      },
      required: ["empresa", "resumen", "nota", "situacion", "hallazgos", "areas", "datos_cotizacion"],
    },
  },
  {
    name: "derivar_a_persona",
    description:
      "Muestra el botón para seguir por WhatsApp con una persona del equipo, con el caso ya escrito. Usala apenas la persona pida hablar con alguien, esté apurada o el tema requiera a una persona.",
    input_schema: {
      type: "object",
      properties: {
        resumen: {
          type: "string",
          description:
            "El mensaje de WhatsApp en primera persona de quien consulta, corto: 'Hola, soy X de Y. Les escribo por…'.",
        },
      },
      required: ["resumen"],
    },
  },
];

/** Lo que el modelo pone en una tarjeta: sin controles, invisibles ni enlaces. */
function texto(v: unknown, max: number): string {
  return typeof v === "string" ? sinEnlaces(limpiarInvisibles(v.replace(/[\u0000-\u001F\u007F]/g, " "))).slice(0, max) : "";
}

/** Convierte un pedido de herramienta en la tarjeta que se le muestra a la persona. */
function armarTarjeta(nombre: string, entrada: Record<string, unknown>): Tarjeta | null {
  switch (nombre) {
    case "mostrar_solucion":
      return tarjetaSolucion(texto(entrada.slug, 40), texto(entrada.motivo, 220));
    case "mostrar_caso":
      return tarjetaCaso(texto(entrada.id, 40));
    case "pedir_contacto": {
      const crudo = texto(entrada.solucion, 40);
      const solucion = SLUGS_SOLUCION.includes(crudo) ? crudo : null;
      const resumen = texto(entrada.resumen, 800);
      const emitido = Date.now();
      const firma = firmar("contacto", JSON.stringify([resumen, solucion, emitido]));
      if (!firma) return null;
      return {
        tipo: "contacto",
        resumen,
        solucion,
        nombre: texto(entrada.nombre, 80),
        empresa: texto(entrada.empresa, 80),
        emitido,
        firma,
      };
    }
    case "derivar_a_persona":
      return { tipo: "humano", resumen: texto(entrada.resumen, 600) };
    case "ofrecer_opciones": {
      const opciones = (Array.isArray(entrada.opciones) ? entrada.opciones : [])
        .map((o) => texto(o, 40))
        .filter(Boolean)
        .slice(0, 6);
      // Con saltos de línea: la pregunta puede ser una lista numerada.
      const pregunta = typeof entrada.pregunta === "string"
        ? entrada.pregunta.split("\n").map((l) => texto(l, 220)).filter(Boolean).slice(0, 5).join("\n")
        : "";
      return opciones.length >= 2 || (pregunta && opciones.length === 0)
        ? { tipo: "opciones", ...(pregunta ? { pregunta } : {}), opciones, multiple: entrada.multiple === true }
        : null;
    }
    case "armar_relevamiento":
      return armarRelevamiento(entrada);
    case "mostrar_nota":
      return notaPorSlug(texto(entrada.id, 120));
    case "mostrar_evento":
      return eventoPorSlug(texto(entrada.id, 120));
  }
  return null;
}

function leerHistorial(body: unknown, alFalsificar: () => void): Entrada[] | null {
  const crudo = (body as { messages?: unknown } | null)?.messages;
  if (!Array.isArray(crudo) || crudo.length === 0 || crudo.length > LIMITES_CHAT.historial) return null;

  const mensajes: Entrada[] = [];
  // El largo se mide sobre lo que mandó el navegador (que recorta a este
  // mismo techo): medirlo después de reemplazar o juntar mensajes podía
  // pasarse por unos caracteres y trabar la conversación en un 400.
  let largo = 0;
  for (const m of crudo) {
    const { role, content, firma } = (m ?? {}) as Record<string, unknown>;
    if (typeof content === "string") largo += content.length;
    if ((role !== "user" && role !== "assistant") || typeof content !== "string") return null;
    const tope = role === "user" ? LIMITES_CHAT.mensaje : LIMITES_CHAT.respuesta;
    if (content.length > tope) return null;
    let limpio = content.trim();
    if (role === "user") {
      limpio = limpiarInvisibles(limpio).trim();
    } else if (!firmaValida("turno", huella(limpio), firma)) {
      // No la escribió este servidor (o se cortó antes de firmarse): el modelo
      // no la lee. Ver `huella`. Sin firma es un corte; con una firma que no
      // corresponde, alguien editó la respuesta.
      if (typeof firma === "string") alFalsificar();
      limpio = RESPUESTA_NO_VERIFICADA;
    }
    if (!limpio) return null;
    // Dos turnos seguidos del mismo rol los rechaza la API: se juntan.
    const previo = mensajes[mensajes.length - 1];
    if (previo?.role === role) previo.content += `\n\n${limpio}`;
    else mensajes.push({ role, content: limpio });
  }

  if (mensajes[0].role !== "user" || mensajes[mensajes.length - 1].role !== "user") return null;
  if (largo > LIMITES_CHAT.total) return null;
  return mensajes;
}

/**
 * En qué página está la persona, en palabras. No es lo mismo "¿sirve para
 * bancos?" escrito en la home que en la landing de firma para bancos.
 *
 * La ruta la manda el navegador: se acepta sólo con forma de ruta del sitio y
 * se traduce contra el catálogo. Lo que no se reconoce no llega al modelo, así
 * que no hay forma de colarle texto por acá.
 */
function contextoDePagina(body: unknown): string | null {
  const ruta = (body as { pagina?: unknown } | null)?.pagina;
  if (typeof ruta !== "string" || !/^\/[a-z0-9\-/]{0,120}$/.test(ruta)) return null;
  const [, seccion, slug, extra] = ruta.split("/");
  if (seccion === "soluciones" && SOLUTIONS[slug]) {
    const sol = SOLUTIONS[slug];
    const sub = extra ? Object.values(SUB_SERVICES).find((x) => x.parent === slug && x.slug === extra) : undefined;
    const industria = extra ? INDUSTRIES[extra] : undefined;
    const detalle = sub ? ` (servicio: ${sub.name})` : industria ? ` (versión para ${industria.name})` : "";
    return `La persona está escribiendo desde la página de ${sol.name}${detalle}. Asumí ese contexto salvo que diga otra cosa.`;
  }
  if (seccion === "casos" && SOLUTIONS[slug]?.cases[Number(extra)]) {
    return `La persona está mirando el caso de éxito ${slug}:${extra}.`;
  }
  return ruta === "/" ? "La persona está escribiendo desde la portada del sitio." : null;
}

function error(mensaje: string, status: number) {
  return Response.json({ error: mensaje }, { status });
}

const LIMITE_ALCANZADO = "Llegamos al límite de mensajes por ahora. Seguimos por WhatsApp, así no se pierde nada.";

/** Unidades de entrada de una vuelta (ver PRESUPUESTO_IP). */
const unidades = (u: Anthropic.Usage) =>
  Math.ceil(
    u.input_tokens + (u.cache_creation_input_tokens ?? 0) * 2 + (u.cache_read_input_tokens ?? 0) * 0.1 + u.output_tokens * 5,
  );

const MAX_TOKENS = 4000;

/**
 * El peor caso de un pedido: el historial (≈3 caracteres por token, de más) en
 * cada vuelta, la salida máxima de cada vuelta y escribir la caché del prompt
 * (y la del blog y los eventos, que suma unos 3.000 tokens).
 */
const reservaPara = (historial: Entrada[]) =>
  Math.ceil(historial.reduce((n, m) => n + m.content.length, 0) / 3) * VUELTAS + MAX_TOKENS * 5 * VUELTAS + 22_000;

export async function POST(req: NextRequest) {
  if (!mismoOrigen(req)) return error("Pedido inválido", 403);
  if (await esBot(req)) return error("No pudimos verificar el navegador. Escribinos por WhatsApp.", 403);

  if (!hayClaveClaude()) {
    console.error("[chat] falta OPENROUTER_API_KEY / ANTHROPIC_API_KEY");
    return error("El asistente no está disponible ahora. Escribinos por WhatsApp.", 503);
  }

  const body = await leerJson(req, MAX_BODY);
  if (body === "grande") {
    alertar(req, "cuerpo-grande", "Llegó al asistente un pedido más grande que cualquier conversación posible.");
    return error("La conversación es demasiado larga.", 413);
  }
  if (!body) return error("Pedido inválido", 400);
  const historial = leerHistorial(body, () =>
    alertar(
      req,
      "firma-falsa",
      "Llegó una conversación con una respuesta del asistente editada (la firma no coincide): alguien intentó hacerle creer al modelo que ya había dicho otra cosa. El modelo no la leyó. Si justo hubo un deploy que cambió el formato del chat, puede ser una conversación vieja.",
    ),
  );
  if (!historial) return error("Pedido inválido", 400);

  // Primero la IP y sólo si pasa el global: si no, una sola IP bloqueada
  // seguiría sumando al techo global hasta apagar el asistente para todos.
  const ip = ipParaLimite(req);
  // En `next dev` la IP es siempre la de la máquina de quien prueba, y el
  // contador vive en la base compartida: una tarde de pruebas lo llenaba y el
  // chat dejaba de contestar en local. Los cupos por IP no aplican ahí; los
  // globales sí. En Vercel (preview o producción) NODE_ENV es "production".
  const enDesarrollo = process.env.NODE_ENV === "development";
  const [porIp, porBloque] = enDesarrollo
    ? [{ allowed: true }, { allowed: true }]
    : await Promise.all([consume("chat", ip, LIMITE_IP), consume("chat-bloque", bloqueDeRed(req), LIMITE_BLOQUE)]);
  if (!porIp.allowed || !porBloque.allowed) {
    alertar(req, "limite-ip", `Una IP superó el tope de mensajes del asistente (${(porIp.allowed ? porBloque : porIp).rule}).`);
    return error(LIMITE_ALCANZADO, 429);
  }
  const global = await consume("chat-global", "todos", LIMITE_GLOBAL);
  if (!global.allowed) {
    console.error("[chat] techo global de pedidos alcanzado");
    alertar(req, "techo-global", "Se alcanzó el techo global de mensajes del asistente: quedó derivando a WhatsApp para todos.", "chat");
    return error(LIMITE_ALCANZADO, 429);
  }

  // La reserva: si no entra en alguno de los dos presupuestos se devuelve
  // enseguida y no se llama al modelo.
  const reserva = reservaPara(historial);
  const [saldoIp, saldoGlobal] = await Promise.all([
    enDesarrollo ? { allowed: true } : consume("chat-tokens", ip, PRESUPUESTO_IP, reserva),
    consume("chat-tokens-global", "todos", PRESUPUESTO_GLOBAL, reserva),
  ]);
  // Negativa cobra la diferencia (una respuesta que gastó más que la reserva).
  const devolver = (cantidad: number) =>
    cantidad !== 0
      ? Promise.all([
          enDesarrollo ? null : consume("chat-tokens", ip, PRESUPUESTO_IP, -cantidad),
          consume("chat-tokens-global", "todos", PRESUPUESTO_GLOBAL, -cantidad),
        ]).catch(() => {})
      : Promise.resolve();
  if (!saldoIp.allowed || !saldoGlobal.allowed) {
    if (!saldoGlobal.allowed) {
      console.error("[chat] presupuesto global de tokens agotado");
      alertar(req, "presupuesto-agotado", "Se agotó el presupuesto diario de tokens del asistente.", "global");
    } else {
      alertar(req, "presupuesto-ip", "Una IP agotó su presupuesto diario de tokens del asistente.");
    }
    await devolver(reserva);
    return error(LIMITE_ALCANZADO, 429);
  }
  if ((saldoGlobal.fraccion ?? 0) >= 0.5) {
    alertar(req, "presupuesto-mitad", `Se usó el ${Math.round((saldoGlobal.fraccion ?? 0) * 100)}% del presupuesto diario de tokens del asistente.`, "global");
  }

  const client = crearClienteClaude();
  const senal = AbortSignal.any([req.signal, AbortSignal.timeout(TIEMPO_MAX_MS)]);
  const mensajes: Anthropic.MessageParam[] = historial.map((m) => ({ role: m.role, content: m.content }));
  // El prompt es igual para todos: cacheado una hora, cada conversación paga
  // sólo lo suyo.
  // La página va en un bloque aparte y sin marca: dentro de lo cacheado haría
  // que cada página tuviera su propia caché.
  const pagina = contextoDePagina(body);
  // El blog y los eventos cambian cuando se publica algo: en su propio bloque,
  // con su propia caché, para no invalidar la del prompt cada vez.
  const novedades = await cargarNovedades();
  const system: Anthropic.TextBlockParam[] = [
    { type: "text", text: systemPrompt(), cache_control: { type: "ephemeral", ttl: "1h" } },
    ...(novedades.texto ? [{ type: "text" as const, text: novedades.texto, cache_control: { type: "ephemeral" as const } }] : []),
    ...(pagina ? [{ type: "text" as const, text: pagina }] : []),
  ];
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      let cerrado = false;
      const enviar = (evento: string, dato: unknown) => {
        if (cerrado) return;
        try {
          controller.enqueue(encoder.encode(`event: ${evento}\ndata: ${JSON.stringify(dato)}\n\n`));
        } catch {
          cerrado = true;
        }
      };

      let huboTexto = false;
      let terminada = false;
      // Lo que la persona ve, en el mismo orden: es lo que se firma al final.
      let generado = "";
      // Una sola tanda de opciones y un solo relevamiento por respuesta: el
      // modelo a veces los repite en la vuelta siguiente.
      const yaMostradas = new Set<string>();
      const uso = { vueltas: 0, entrada: 0, escrituraCache: 0, lecturaCache: 0, salida: 0, unidades: 0 };
      try {
        for (let vuelta = 0; vuelta < VUELTAS; vuelta++) {
          const ultima = vuelta === VUELTAS - 1;
          let separar = huboTexto;

          const respuesta = client.messages.stream(
            {
              model: MODELO,
              // El relevamiento viaja como argumentos de herramienta, junto con
              // el texto, la solución, el caso y el formulario: con 1800 se
              // cortaba y las herramientas llegaban truncadas (se descartan).
              max_tokens: MAX_TOKENS,
              // Es una charla, no un problema difícil: en "high" (el default)
              // piensa antes de cada respuesta, hasta de un saludo, y el
              // pensamiento se cobra como salida. En "low" piensa sólo cuando
              // hace falta. Fijo: cambiarlo entre pedidos invalida la caché.
              output_config: { effort: "low" },
              system,
              messages: mensajes,
              tools: HERRAMIENTAS,
              tool_choice: ultima ? { type: "none" } : { type: "auto" },
              // La conversación también se cachea (5 minutos, lo que tarda en
              // contestar una persona): la marca va sola al último bloque, así
              // que la vuelta siguiente y el próximo mensaje leen todo lo
              // anterior a un décimo del precio en vez de pagarlo entero.
              cache_control: { type: "ephemeral" },
            },
            { signal: senal },
          );

          // Apenas el modelo empieza a escribir una herramienta, el navegador
          // muestra el esqueleto de su tarjeta: el relevamiento tarda varios
          // segundos en llegar entero y, sin esto, el chat parecía colgado.
          respuesta.on("streamEvent", (e) => {
            if (e.type === "content_block_start" && e.content_block.type === "tool_use") {
              enviar("preparando", e.content_block.name);
            }
          });

          respuesta.on("text", (t) => {
            if (separar) {
              enviar("texto", "\n\n");
              separar = false;
            }
            huboTexto = true;
            generado += t;
            enviar("texto", t);
          });

          const final = await respuesta.finalMessage();
          uso.vueltas++;
          uso.entrada += final.usage.input_tokens;
          uso.escrituraCache += final.usage.cache_creation_input_tokens ?? 0;
          uso.lecturaCache += final.usage.cache_read_input_tokens ?? 0;
          uso.salida += final.usage.output_tokens;
          uso.unidades += unidades(final.usage);

          if (final.stop_reason !== "tool_use") break;

          const llamadas = final.content.filter((b): b is Anthropic.ToolUseBlock => b.type === "tool_use");
          mensajes.push({ role: "assistant", content: final.content });

          // Si ya escribió su mensaje antes de las tarjetas, la vuelta que
          // sigue tiende a repetirlo con otras palabras: sólo le queda cerrar
          // con la pregunta, si le faltaba (y si no, sale casi gratis).
          const cierre = final.content.some((b) => b.type === "text" && b.text.trim())
            ? " Ya escribiste tu mensaje: no agregues nada, salvo la pregunta final si todavía no la hiciste."
            : "";
          const resultados: Anthropic.ToolResultBlockParam[] = llamadas.map((l) => {
            const unica = l.name === "ofrecer_opciones" || l.name === "armar_relevamiento";
            const repetida = unica && yaMostradas.has(l.name);
            if (unica) yaMostradas.add(l.name);
            const tarjeta = repetida ? null : armarTarjeta(l.name, (l.input ?? {}) as Record<string, unknown>);
            if (tarjeta) {
              generado += notaDeTarjeta(tarjeta);
              enviar("tarjeta", tarjeta);
            }
            return {
              type: "tool_result",
              tool_use_id: l.id,
              content: !tarjeta
                ? "No se pudo mostrar: no lo menciones."
                : tarjeta.tipo === "opciones"
                  ? "Listo, las opciones están debajo de tu pregunta. No las repitas en texto y no escribas nada más."
                  : tarjeta.tipo === "relevamiento"
                    ? "Listo, la persona ya ve la tarjeta para descargar el PDF. Contalo en una oración, sin repetir el contenido."
                    : `Listo, la persona ya la está viendo. No repitas su contenido.${cierre}`,
              is_error: !tarjeta,
            };
          });
          // Si ya había escrito antes de las tarjetas, el relevamiento y el
          // botón de WhatsApp también cierran el turno: la vuelta siguiente
          // repetía "ya tenés el PDF" o "escribile al equipo por ahí".
          const yaEscribio = huboTexto;
          // Después de una tarjeta el texto vuelve a arrancar en otro párrafo.
          huboTexto = true;
          // Las opciones cierran el turno: la pregunta ya está escrita y lo
          // que sigue es la respuesta de la persona. Otra vuelta sólo
          // agregaría relleno (o las repetiría).
          if (llamadas.some((l) => l.name === "ofrecer_opciones")) break;
          if (yaEscribio && llamadas.some((l) => l.name === "armar_relevamiento" || l.name === "derivar_a_persona")) break;
          mensajes.push({ role: "user", content: resultados });
        }
        // La firma de esta respuesta: vuelve en el historial del próximo pedido.
        enviar("fin", { ok: true, firma: firmar("turno", huella(generado)) });
        terminada = true;
      } catch (e) {
        if (!req.signal.aborted) {
          // Sin el contenido: la conversación no se guarda en los logs.
          console.error("[chat] falló:", (e as Error).message);
          enviar("error", { mensaje: "Se me cortó la respuesta. Probá de nuevo o seguí por WhatsApp." });
        }
      } finally {
        if (uso.vueltas > 0) console.info("[chat] uso", { ...uso, reserva, terminada });
        // Sólo una respuesta completa devuelve lo que no gastó: una cortada
        // (por la persona, por el tiempo o por un error) se cobra la reserva
        // entera, porque lo generado hasta el corte igual se pagó. Se espera
        // antes de cerrar: con el stream cerrado la función puede congelarse.
        if (terminada) await devolver(reserva - uso.unidades);
        cerrado = true;
        try {
          controller.close();
        } catch {}
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      "X-Accel-Buffering": "no",
    },
  });
}
