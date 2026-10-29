import {
  Defs,
  Document,
  Font,
  Page,
  Path,
  RadialGradient,
  Rect,
  Stop,
  StyleSheet,
  Svg,
  Text,
  View,
  renderToBuffer,
} from "@react-pdf/renderer";
import { ORG } from "@/lib/seo/site";
import { WORDMARK_TRAZOS, WORDMARK_VIEWBOX } from "./logo-pdf";
import type { Prioridad, Relevamiento } from "./tipos";

/**
 * El PDF de relevamiento, con el lenguaje de los brochures de Accedra.
 *
 * Es la misma pieza que los brochures de solución (public/brochures): fondo
 * azul noche con un resplandor arriba, títulos en Space Grotesk con la última
 * parte en celeste, etiquetas chicas espaciadas en azul con su rayita, números
 * de sección grandes en azul profundo, cifras con divisores finos y el pie con
 * texto espaciado y la paginación "02 — 03". Quien ya recibió un brochure
 * tiene que reconocer la marca al abrir esto.
 *
 * Portada (para quién, el resumen y la ficha) y después el contenido: la
 * situación, lo que identificamos con su prioridad, qué recomendamos, un caso
 * real, los próximos pasos y el cierre con un único siguiente paso.
 *
 * Las fuentes son las de la marca (public/fuentes) y se piden por URL al
 * mismo sitio: en Vercel la carpeta public no está en el disco de la función,
 * pero sí detrás del CDN.
 */

const FONDO = "#0a1424";
const FONDO_HONDO = "#060d19";
const BLANCO = "#ffffff";
const TEXTO = "#b9c4d6";
const GRIS = "#7d8aa1";
const TENUE = "#56647c";
const CELESTE = "#7fb3f8";
const AZUL = "#2b6fd4";
const NUMERO = "#1f3f7c";
const LINEA = "#1c2a40";

const COLOR_PRIORIDAD: Record<Prioridad, string> = { alta: "#f59a6b", media: "#e8c26a", baja: GRIS };

let fuentesDe: string | null = null;

/** Registra Space Grotesk e Inter desde el sitio. Una vez por instancia. */
function registrarFuentes(origen: string) {
  if (fuentesDe === origen) return;
  fuentesDe = origen;
  Font.register({ family: "Grotesk", src: `${origen}/fuentes/SpaceGrotesk-Bold.ttf`, fontWeight: 700 });
  Font.register({
    family: "Inter",
    fonts: [
      { src: `${origen}/fuentes/Inter-Regular.ttf`, fontWeight: 400 },
      { src: `${origen}/fuentes/Inter-SemiBold.ttf`, fontWeight: 600 },
      { src: `${origen}/fuentes/Inter-Bold.ttf`, fontWeight: 700 },
    ],
  });
  // Sin cortar palabras con guion: "logís-tico" en un título se ve descuidado.
  Font.registerHyphenationCallback((palabra) => [palabra]);
}

const s = StyleSheet.create({
  pagina: { fontFamily: "Inter", fontSize: 10, color: TEXTO, backgroundColor: FONDO, paddingHorizontal: 56 },
  portada: { paddingTop: 58, paddingBottom: 54 },
  contenido: { paddingTop: 64, paddingBottom: 72 },

  marca: { width: 128 },
  itSolutions: { fontSize: 6.5, color: "#c9d3e3", letterSpacing: 3, marginTop: 7, fontWeight: 600 },

  eyebrow: { fontSize: 7.5, color: CELESTE, letterSpacing: 2.4, fontWeight: 600 },
  rayita: { width: 34, height: 1.5, backgroundColor: AZUL, marginTop: 9 },

  titulo: { fontFamily: "Grotesk", fontSize: 38, color: BLANCO, lineHeight: 1.08, marginTop: 14, letterSpacing: -0.6 },
  tituloCeleste: { color: CELESTE },
  resumen: { fontSize: 11.5, color: "#dbe3ee", lineHeight: 1.65, marginTop: 22, maxWidth: 420 },
  ficha: { fontSize: 7, color: GRIS, letterSpacing: 2, marginTop: 18, fontWeight: 600, lineHeight: 1.7 },

  cifras: { flexDirection: "row", marginTop: "auto" },
  cifra: { flex: 1, paddingRight: 12, borderLeftWidth: 0.6, borderLeftColor: "#2a3a55", paddingLeft: 12 },
  cifraPrimera: { borderLeftWidth: 0, paddingLeft: 0 },
  cifraValor: { fontFamily: "Grotesk", fontSize: 32, color: BLANCO, lineHeight: 1, letterSpacing: -0.8 },
  cifraLabel: { fontSize: 6.5, color: GRIS, letterSpacing: 2, marginTop: 7, fontWeight: 600 },

  pie: {
    position: "absolute",
    left: 56,
    right: 56,
    bottom: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 0.6,
    borderTopColor: LINEA,
    paddingTop: 12,
  },
  pieTexto: { fontSize: 6.5, color: TENUE, letterSpacing: 2, fontWeight: 600 },

  seccion: { flexDirection: "row", marginBottom: 24 },
  numero: { fontFamily: "Grotesk", fontSize: 46, color: NUMERO, width: 112, lineHeight: 0.95, letterSpacing: -1.5 },
  cuerpo: { flex: 1 },
  seccionTitulo: { fontFamily: "Grotesk", fontSize: 17, color: BLANCO, marginTop: 6, marginBottom: 10 },
  parrafo: { fontSize: 10, lineHeight: 1.65 },

  hallazgo: { flexDirection: "row", paddingVertical: 7, borderBottomWidth: 0.6, borderBottomColor: LINEA },
  hallazgoTexto: { flex: 1, fontSize: 10, lineHeight: 1.55, paddingRight: 16 },
  prioridad: { width: 50, fontSize: 6.5, letterSpacing: 1.8, textAlign: "right", paddingTop: 3, fontWeight: 600 },

  area: {
    backgroundColor: "#0f1c31",
    borderWidth: 0.6,
    borderColor: "#22324d",
    borderLeftWidth: 2,
    borderRadius: 6,
    padding: 13,
    marginBottom: 8,
  },
  areaNombre: { fontFamily: "Grotesk", fontSize: 13, color: BLANCO, marginBottom: 9 },
  etiqueta: { fontSize: 6.5, color: CELESTE, letterSpacing: 2, marginBottom: 3, fontWeight: 600 },
  areaTexto: { fontSize: 9.6, lineHeight: 1.6, marginBottom: 8 },

  caso: { backgroundColor: "#0f1c31", borderWidth: 0.6, borderColor: "#22324d", borderRadius: 6, padding: 14, marginBottom: 8 },
  casoCliente: { fontSize: 6.5, color: CELESTE, letterSpacing: 2, fontWeight: 600 },
  casoTitulo: { fontFamily: "Grotesk", fontSize: 13, color: BLANCO, marginTop: 6, lineHeight: 1.3 },
  casoCifra: { fontSize: 9.6, color: TEXTO, marginTop: 6 },

  paso: { flexDirection: "row", paddingVertical: 6, borderBottomWidth: 0.6, borderBottomColor: LINEA },
  pasoNumero: { width: 26, fontFamily: "Grotesk", fontSize: 11, color: CELESTE },
  pasoTexto: { flex: 1, fontSize: 10, lineHeight: 1.55 },

  alcance: { fontSize: 7.8, color: TENUE, lineHeight: 1.6, marginTop: 14 },

  cierre: { backgroundColor: "#0f1c31", borderWidth: 0.6, borderColor: "#25385a", borderRadius: 8, padding: 18, marginTop: 4 },
  cierreTitulo: { fontFamily: "Grotesk", fontSize: 19, color: BLANCO, lineHeight: 1.2, marginTop: 10 },
  cierreTexto: { fontSize: 9.8, lineHeight: 1.6, marginTop: 8, maxWidth: 400 },
  contactos: { flexDirection: "row", marginTop: 14, borderTopWidth: 0.6, borderTopColor: "#25385a", paddingTop: 12 },
  contacto: { flex: 1 },
  contactoLabel: { fontSize: 6.5, color: GRIS, letterSpacing: 2, fontWeight: 600 },
  contactoValor: { fontSize: 10, color: BLANCO, marginTop: 5, fontWeight: 600 },
});

/** El fondo de todas las páginas: azul noche con el resplandor de arriba. */
function Fondo() {
  return (
    <Svg fixed style={{ position: "absolute", top: 0, left: 0, width: 595.28, height: 841.89 }} viewBox="0 0 595 842">
      <Defs>
        <RadialGradient id="resplandor" cx="0.62" cy="0.1" r="0.75">
          <Stop offset="0" stopColor="#173867" stopOpacity="0.95" />
          <Stop offset="0.45" stopColor={FONDO} stopOpacity="1" />
          <Stop offset="1" stopColor={FONDO_HONDO} stopOpacity="1" />
        </RadialGradient>
      </Defs>
      <Rect x="0" y="0" width="595" height="842" fill="url(#resplandor)" />
    </Svg>
  );
}

function Wordmark() {
  const [, , w, h] = WORDMARK_VIEWBOX.split(" ").map(Number);
  return (
    <View>
      <Svg viewBox={WORDMARK_VIEWBOX} style={{ width: 128, height: (128 * h) / w }}>
        {WORDMARK_TRAZOS.map((t, i) => (
          <Path key={i} d={t.d} fill={t.fill} />
        ))}
      </Svg>
      <Text style={s.itSolutions}>IT SOLUTIONS</Text>
    </View>
  );
}

function Eyebrow({ children }: { children: string }) {
  return (
    <View>
      <Text style={s.eyebrow}>{children.toUpperCase()}</Text>
      <View style={s.rayita} />
    </View>
  );
}

function Pie({ empresa }: { empresa: string }) {
  return (
    <View style={s.pie} fixed>
      <Text style={s.pieTexto}>{`RELEVAMIENTO PRELIMINAR · ${empresa.toUpperCase()}`}</Text>
      <Text
        style={s.pieTexto}
        render={({ pageNumber, totalPages }) =>
          `${String(pageNumber).padStart(2, "0")} — ${String(totalPages).padStart(2, "0")}`
        }
      />
    </View>
  );
}

function Seccion({ n, titulo, children }: { n: number; titulo: string; children: React.ReactNode }) {
  return (
    <View style={s.seccion}>
      <Text style={s.numero}>{String(n).padStart(2, "0")}</Text>
      <View style={s.cuerpo}>
        <Text style={s.seccionTitulo}>{titulo}</Text>
        {children}
      </View>
    </View>
  );
}

const fechaCorta = (iso: string) =>
  new Date(iso).toLocaleDateString("es-AR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "America/Argentina/Buenos_Aires",
  });

function Documento({ d }: { d: Relevamiento }) {
  // Cifras grandes como las del brochure; lo descriptivo (rubro, tamaño) va
  // en la línea espaciada de abajo del resumen, que es donde entra.
  const cifras = [
    { valor: String(d.hallazgos.length).padStart(2, "0"), label: "HALLAZGOS" },
    { valor: String(d.hallazgos.filter((h) => h.prioridad === "alta").length).padStart(2, "0"), label: "PRIORIDAD ALTA" },
    { valor: String(d.areas.length).padStart(2, "0"), label: "ÁREAS DE MEJORA" },
    { valor: String(d.casos.length).padStart(2, "0"), label: "CASOS SIMILARES" },
  ];
  const ficha = [d.industria, d.tamano, fechaCorta(d.fecha), d.referencia].filter(Boolean).join("  ·  ").toUpperCase();
  let n = 0;

  return (
    <Document title={`Relevamiento — ${d.empresa}`} author={ORG.name} creator="Accedra" producer="Accedra">
      {/* ── Portada ── */}
      <Page size="A4" style={[s.pagina, s.portada]}>
        <Fondo />
        <Wordmark />

        <View style={{ marginTop: 150 }}>
          <Eyebrow>Relevamiento preliminar</Eyebrow>
          <Text style={s.titulo}>
            Relevamiento para{"\n"}
            <Text style={s.tituloCeleste}>{d.empresa}.</Text>
          </Text>
          <Text style={s.resumen}>{d.resumen}</Text>
          <Text style={s.ficha}>{ficha}</Text>
        </View>

        <View style={s.cifras}>
          {cifras.map((c, i) => (
            <View key={c.label} style={[s.cifra, i === 0 ? s.cifraPrimera : {}]}>
              <Text style={s.cifraValor}>{c.valor}</Text>
              <Text style={s.cifraLabel}>{c.label}</Text>
            </View>
          ))}
        </View>
        <Pie empresa={d.empresa} />
      </Page>

      {/* ── Contenido ── */}
      <Page size="A4" style={[s.pagina, s.contenido]}>
        <Fondo />

        <View style={{ marginBottom: 34 }}>
          <Eyebrow>Diagnóstico</Eyebrow>
        </View>

        <Seccion n={++n} titulo="Situación actual">
          <Text style={s.parrafo}>{d.situacion}</Text>
        </Seccion>

        <Seccion n={++n} titulo="Lo que identificamos">
          {d.hallazgos.map((h, i) => (
            <View key={i} style={s.hallazgo} wrap={false}>
              <Text style={s.hallazgoTexto}>{h.texto}</Text>
              <Text style={[s.prioridad, { color: COLOR_PRIORIDAD[h.prioridad] }]}>{h.prioridad.toUpperCase()}</Text>
            </View>
          ))}
        </Seccion>

        <Seccion n={++n} titulo="Qué recomendamos">
          {d.areas.map((a) => (
            <View key={a.solucion} style={[s.area, { borderLeftColor: a.accent }]} wrap={false}>
              <Text style={s.areaNombre}>{a.nombre}</Text>
              <Text style={s.etiqueta}>POR QUÉ</Text>
              <Text style={s.areaTexto}>{a.porque}</Text>
              <Text style={s.etiqueta}>QUÉ HARÍAMOS</Text>
              <Text style={[s.areaTexto, { marginBottom: 0 }]}>{a.propuesta}</Text>
            </View>
          ))}
        </Seccion>

        {d.casos.length > 0 && (
          <Seccion n={++n} titulo="Ya lo resolvimos">
            {d.casos.map((c) => (
              <View key={c.id} style={s.caso} wrap={false}>
                <Text style={s.casoCliente}>{c.cliente.toUpperCase()}</Text>
                <Text style={s.casoTitulo}>{c.titulo}</Text>
                {c.cifra ? <Text style={s.casoCifra}>{c.cifra}</Text> : null}
              </View>
            ))}
          </Seccion>
        )}

        <Seccion n={++n} titulo="Próximos pasos">
          {d.proximosPasos.map((p, i) => (
            <View key={i} style={s.paso} wrap={false}>
              <Text style={s.pasoNumero}>{String(i + 1).padStart(2, "0")}</Text>
              <Text style={s.pasoTexto}>{p}</Text>
            </View>
          ))}
        </Seccion>

        <View wrap={false}>
          <View style={s.cierre}>
            <Eyebrow>Siguiente paso</Eyebrow>
            <Text style={s.cierreTitulo}>
              Relevamiento técnico en sitio, <Text style={s.tituloCeleste}>sin costo.</Text>
            </Text>
            <Text style={s.cierreTexto}>
              Coordinamos la visita de un especialista y, con lo que releve, te entregamos una propuesta con alcance,
              plazos y prioridades.
            </Text>
            <View style={s.contactos}>
              {[
                { label: "WHATSAPP", valor: "+54 11 3300-1233" },
                { label: "EMAIL", valor: ORG.email },
                { label: "WEB", valor: "accedra.com.ar" },
              ].map((c) => (
                <View key={c.label} style={s.contacto}>
                  <Text style={s.contactoLabel}>{c.label}</Text>
                  <Text style={s.contactoValor}>{c.valor}</Text>
                </View>
              ))}
            </View>
            <Text style={s.alcance}>
              Relevamiento preliminar, armado con lo que nos contaste en la conversación con el asistente de Accedra.
              Las recomendaciones, los plazos y el equipamiento se validan en el relevamiento técnico en sitio.
            </Text>
          </View>
        </View>

        <Pie empresa={d.empresa} />
      </Page>
    </Document>
  );
}

/** Saca lo que ninguna de las fuentes dibuja (emojis, caracteres invisibles). */
function sinRaros(t: string): string {
  return t.replace(/[​-‍﻿]/g, "").replace(/\p{Extended_Pictographic}/gu, "").trim();
}

function limpio(d: Relevamiento): Relevamiento {
  const t = sinRaros;
  return {
    ...d,
    empresa: t(d.empresa),
    industria: t(d.industria),
    tamano: t(d.tamano),
    resumen: t(d.resumen),
    situacion: t(d.situacion),
    hallazgos: d.hallazgos.map((h) => ({ ...h, texto: t(h.texto) })),
    areas: d.areas.map((a) => ({ ...a, nombre: t(a.nombre), porque: t(a.porque), propuesta: t(a.propuesta) })),
    casos: d.casos.map((c) => ({ ...c, cliente: t(c.cliente), titulo: t(c.titulo), cifra: t(c.cifra) })),
    proximosPasos: d.proximosPasos.map(t),
  };
}

/**
 * @param origen el sitio desde donde se piden las fuentes
 *   ("https://accedra.com.ar"; en desarrollo, el localhost del pedido).
 */
export function pdfRelevamiento(datos: Relevamiento, origen: string): Promise<Buffer> {
  registrarFuentes(origen);
  return renderToBuffer(<Documento d={limpio(datos)} />);
}

/** Nombre de archivo prolijo: "relevamiento-distribuidora-norte.pdf". */
export function nombreArchivo(datos: Relevamiento): string {
  const base = datos.empresa
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
  return `relevamiento-${base || "accedra"}.pdf`;
}
