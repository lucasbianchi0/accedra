import type Anthropic from "@anthropic-ai/sdk";
import type { NextRequest } from "next/server";

import { crearClienteClaude, hayClaveClaude } from "@/lib/chat/claude";
import { IDS_CASO, SLUGS_SOLUCION, tarjetaCaso, tarjetaSolucion } from "@/lib/chat/conocimiento";
import { systemPrompt } from "@/lib/chat/prompt";
import { LIMITES_CHAT, type Entrada, type Tarjeta } from "@/lib/chat/tipos";
import { armarRelevamiento } from "@/lib/chat/relevamiento";
import { clientIp } from "@/lib/contact/clientIp";
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

/** Por IP. Una conversación larga de verdad son 15-20 mensajes. */
const LIMITE_IP = [
  { suffix: "burst", limit: 30, windowSec: 10 * 60 },
  { suffix: "day", limit: 80, windowSec: 24 * 60 * 60 },
] as const;
/** Techo del endpoint entero: corta un ataque distribuido antes de que lo pague la cuenta. */
const LIMITE_GLOBAL = [
  { suffix: "hour", limit: 600, windowSec: 60 * 60 },
  { suffix: "day", limit: 3000, windowSec: 24 * 60 * 60 },
] as const;

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
      "Muestra botones de respuesta rápida debajo de tu pregunta (la persona igual puede escribir). Usala cuando la respuesta tiene alternativas típicas: tamaño de la empresa, cantidad de sedes, tipo de problema, urgencia, sí/no. Escribí la pregunta en el texto y llamá a esta herramienta en el mismo mensaje. Una sola vez por mensaje.",
    input_schema: {
      type: "object",
      properties: {
        opciones: {
          type: "array",
          items: { type: "string" },
          minItems: 2,
          maxItems: 6,
          description: "De 2 a 6 opciones cortas (máx. 32 caracteres), en el orden natural.",
        },
        multiple: { type: "boolean", description: "true si tiene sentido elegir más de una (p. ej. varios problemas)." },
      },
      required: ["opciones"],
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
      },
      required: ["empresa", "resumen", "situacion", "hallazgos", "areas"],
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

function texto(v: unknown, max: number): string {
  return typeof v === "string" ? v.replace(/[\u0000-\u001F\u007F]/g, " ").trim().slice(0, max) : "";
}

/** Convierte un pedido de herramienta en la tarjeta que se le muestra a la persona. */
function armarTarjeta(nombre: string, entrada: Record<string, unknown>): Tarjeta | null {
  switch (nombre) {
    case "mostrar_solucion":
      return tarjetaSolucion(texto(entrada.slug, 40), texto(entrada.motivo, 220));
    case "mostrar_caso":
      return tarjetaCaso(texto(entrada.id, 40));
    case "pedir_contacto": {
      const solucion = texto(entrada.solucion, 40);
      return {
        tipo: "contacto",
        resumen: texto(entrada.resumen, 800),
        solucion: SLUGS_SOLUCION.includes(solucion) ? solucion : null,
        nombre: texto(entrada.nombre, 80),
        empresa: texto(entrada.empresa, 80),
      };
    }
    case "derivar_a_persona":
      return { tipo: "humano", resumen: texto(entrada.resumen, 600) };
    case "ofrecer_opciones": {
      const opciones = (Array.isArray(entrada.opciones) ? entrada.opciones : [])
        .map((o) => texto(o, 40))
        .filter(Boolean)
        .slice(0, 6);
      return opciones.length >= 2 ? { tipo: "opciones", opciones, multiple: entrada.multiple === true } : null;
    }
    case "armar_relevamiento":
      return armarRelevamiento(entrada);
  }
  return null;
}

function leerHistorial(body: unknown): Entrada[] | null {
  const crudo = (body as { messages?: unknown } | null)?.messages;
  if (!Array.isArray(crudo) || crudo.length === 0 || crudo.length > LIMITES_CHAT.historial) return null;

  const mensajes: Entrada[] = [];
  for (const m of crudo) {
    const { role, content } = (m ?? {}) as Record<string, unknown>;
    if ((role !== "user" && role !== "assistant") || typeof content !== "string") return null;
    const limpio = content.trim();
    const tope = role === "user" ? LIMITES_CHAT.mensaje : LIMITES_CHAT.respuesta;
    if (!limpio || limpio.length > tope) return null;
    // Dos turnos seguidos del mismo rol los rechaza la API: se juntan.
    const previo = mensajes[mensajes.length - 1];
    if (previo?.role === role) previo.content += `\n\n${limpio}`;
    else mensajes.push({ role, content: limpio });
  }

  if (mensajes[0].role !== "user" || mensajes[mensajes.length - 1].role !== "user") return null;
  if (mensajes.reduce((n, m) => n + m.content.length, 0) > LIMITES_CHAT.total) return null;
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

export async function POST(req: NextRequest) {
  if (!hayClaveClaude()) {
    console.error("[chat] falta OPENROUTER_API_KEY / ANTHROPIC_API_KEY");
    return error("El asistente no está disponible ahora. Escribinos por WhatsApp.", 503);
  }

  const raw = await req.text();
  if (raw.length > LIMITES_CHAT.total * 2) return error("La conversación es demasiado larga.", 413);
  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return error("Pedido inválido", 400);
  }
  const historial = leerHistorial(body);
  if (!historial) return error("Pedido inválido", 400);

  const ip = clientIp(req);
  const porIp = await consume("chat", ip, LIMITE_IP);
  const global = await consume("chat-global", "todos", LIMITE_GLOBAL);
  if (!porIp.allowed || !global.allowed) {
    return error("Llegamos al límite de mensajes por ahora. Seguimos por WhatsApp, así no se pierde nada.", 429);
  }

  const client = crearClienteClaude();
  const mensajes: Anthropic.MessageParam[] = historial.map((m) => ({ role: m.role, content: m.content }));
  // El prompt es igual para todos: cacheado una hora, cada conversación paga
  // sólo lo suyo.
  // La página va en un bloque aparte y sin marca: dentro de lo cacheado haría
  // que cada página tuviera su propia caché.
  const pagina = contextoDePagina(body);
  const system: Anthropic.TextBlockParam[] = [
    { type: "text", text: systemPrompt(), cache_control: { type: "ephemeral", ttl: "1h" } },
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
      // Una sola tanda de opciones y un solo relevamiento por respuesta: el
      // modelo a veces los repite en la vuelta siguiente.
      const yaMostradas = new Set<string>();
      const uso = { vueltas: 0, entrada: 0, lecturaCache: 0, salida: 0 };
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
              max_tokens: 4000,
              system,
              messages: mensajes,
              tools: HERRAMIENTAS,
              tool_choice: ultima ? { type: "none" } : { type: "auto" },
            },
            { signal: req.signal },
          );

          respuesta.on("text", (t) => {
            if (separar) {
              enviar("texto", "\n\n");
              separar = false;
            }
            huboTexto = true;
            enviar("texto", t);
          });

          const final = await respuesta.finalMessage();
          uso.vueltas++;
          uso.entrada += final.usage.input_tokens;
          uso.lecturaCache += final.usage.cache_read_input_tokens ?? 0;
          uso.salida += final.usage.output_tokens;

          if (final.stop_reason !== "tool_use") break;

          const llamadas = final.content.filter((b): b is Anthropic.ToolUseBlock => b.type === "tool_use");
          mensajes.push({ role: "assistant", content: final.content });

          const resultados: Anthropic.ToolResultBlockParam[] = llamadas.map((l) => {
            const unica = l.name === "ofrecer_opciones" || l.name === "armar_relevamiento";
            const repetida = unica && yaMostradas.has(l.name);
            if (unica) yaMostradas.add(l.name);
            const tarjeta = repetida ? null : armarTarjeta(l.name, (l.input ?? {}) as Record<string, unknown>);
            if (tarjeta) enviar("tarjeta", tarjeta);
            return {
              type: "tool_result",
              tool_use_id: l.id,
              content: !tarjeta
                ? "No se pudo mostrar: no lo menciones."
                : tarjeta.tipo === "opciones"
                  ? "Listo, las opciones están debajo de tu pregunta. No las repitas en texto y no escribas nada más."
                  : tarjeta.tipo === "relevamiento"
                    ? "Listo, la persona ya ve la tarjeta para descargar el PDF. Contalo en una oración, sin repetir el contenido."
                    : "Listo, la persona ya la está viendo. No repitas su contenido.",
              is_error: !tarjeta,
            };
          });
          // Después de una tarjeta el texto vuelve a arrancar en otro párrafo.
          huboTexto = true;
          // Las opciones cierran el turno: la pregunta ya está escrita y lo
          // que sigue es la respuesta de la persona. Otra vuelta sólo
          // agregaría relleno (o las repetiría).
          if (llamadas.some((l) => l.name === "ofrecer_opciones")) break;
          mensajes.push({ role: "user", content: resultados });
        }
        enviar("fin", { ok: true });
      } catch (e) {
        if (!req.signal.aborted) {
          // Sin el contenido: la conversación no se guarda en los logs.
          console.error("[chat] falló:", (e as Error).message);
          enviar("error", { mensaje: "Se me cortó la respuesta. Probá de nuevo o seguí por WhatsApp." });
        }
      } finally {
        if (uso.vueltas > 0) console.info("[chat] uso", uso);
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
