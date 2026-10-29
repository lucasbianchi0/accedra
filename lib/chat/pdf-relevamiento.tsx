import {
  Document,
  Font,
  Page,
  Path,
  Rect,
  Svg,
  Text,
  View,
  LinearGradient,
  Defs,
  Stop,
  StyleSheet,
  renderToBuffer,
} from "@react-pdf/renderer";
import { ORG } from "@/lib/seo/site";
import { WORDMARK_TRAZOS, WORDMARK_VIEWBOX } from "./logo-pdf";
import type { Relevamiento } from "./tipos";

/**
 * El PDF de relevamiento: lo que la persona se lleva de la conversación.
 *
 * Está escrito como una pieza de venta y no como un acta: arranca por lo que
 * nos contó (para que se reconozca), sigue con lo que identificamos y dónde
 * podemos ayudar, lo respalda con casos reales y cierra con un solo próximo
 * paso claro —el relevamiento técnico sin costo— y cómo pedirlo. Una carilla
 * casi siempre; dos como mucho.
 *
 * Helvetica de base y no una fuente propia: cubre los acentos y la ñ, y no
 * hay que cargar archivos en la función.
 */

// Sin cortar palabras con guion: "logís-tico" en un título se ve descuidado.
Font.registerHyphenationCallback((palabra) => [palabra]);

const NAVY = "#0a1424";
const TINTA = "#0f1b2d";
const GRIS = "#5b6b82";
const SUAVE = "#eef3fa";
const LINEA = "#e1e8f2";
const AZUL = "#2b6fd4";
const CELESTE = "#7fb3f8";
const VIOLETA = "#7c6cf6";

const s = StyleSheet.create({
  pagina: { fontFamily: "Helvetica", fontSize: 10, color: TINTA, paddingBottom: 46 },
  banda: { backgroundColor: NAVY, paddingHorizontal: 44, paddingTop: 20, paddingBottom: 18 },
  bandaArriba: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  eyebrow: { fontSize: 7.5, letterSpacing: 1.6, color: CELESTE, fontFamily: "Helvetica-Bold" },
  fechaBanda: { fontSize: 8.5, color: "#9fb0c7", marginTop: 3, textAlign: "right" },
  titulo: { fontSize: 22, color: "#ffffff", fontFamily: "Helvetica-Bold", marginTop: 16, lineHeight: 1.15 },
  meta: { flexDirection: "row", marginTop: 10, gap: 6 },
  chip: {
    fontSize: 8.5,
    color: "#dbe6f7",
    borderWidth: 0.8,
    borderColor: "#2a3b5c",
    borderRadius: 10,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  cuerpo: { paddingHorizontal: 44, paddingTop: 14 },
  seccion: { marginTop: 11 },
  seccionEyebrow: { fontSize: 7.5, letterSpacing: 1.6, color: AZUL, fontFamily: "Helvetica-Bold" },
  seccionTitulo: { fontSize: 13, fontFamily: "Helvetica-Bold", marginTop: 2, marginBottom: 6 },
  cita: {
    backgroundColor: SUAVE,
    borderLeftWidth: 3,
    borderLeftColor: VIOLETA,
    borderRadius: 4,
    padding: 9,
    fontSize: 10,
    lineHeight: 1.4,
    color: TINTA,
  },
  item: { flexDirection: "row", marginBottom: 4, alignItems: "flex-start" },
  numero: {
    width: 17,
    height: 17,
    borderRadius: 9,
    backgroundColor: NAVY,
    color: "#fff",
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    paddingTop: 4,
    marginRight: 9,
  },
  itemTexto: { flex: 1, fontSize: 9.5, lineHeight: 1.4, paddingTop: 1.5 },
  area: { borderWidth: 0.8, borderColor: LINEA, borderRadius: 6, padding: 9, marginBottom: 5, borderLeftWidth: 3.5 },
  areaNombre: { fontSize: 11, fontFamily: "Helvetica-Bold", marginBottom: 4 },
  etiqueta: { fontSize: 7, letterSpacing: 1.2, color: GRIS, fontFamily: "Helvetica-Bold", marginBottom: 2 },
  areaTexto: { fontSize: 9.2, lineHeight: 1.4, marginBottom: 4 },
  casos: { gap: 6 },
  dosColumnas: { flexDirection: "row", gap: 18 },
  caso: { backgroundColor: SUAVE, borderRadius: 6, padding: 10 },
  casoCliente: { fontSize: 7.5, letterSpacing: 1.2, color: AZUL, fontFamily: "Helvetica-Bold" },
  casoTitulo: { fontSize: 10, fontFamily: "Helvetica-Bold", marginTop: 4, lineHeight: 1.3 },
  casoCifra: { fontSize: 9, color: GRIS, marginTop: 6 },
  cierre: {
    marginTop: 12,
    backgroundColor: NAVY,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    gap: 18,
    alignItems: "center",
  },
  cierreTitulo: { fontSize: 12.5, color: "#fff", fontFamily: "Helvetica-Bold" },
  cierreTexto: { fontSize: 8.8, color: "#c4cfde", marginTop: 4, lineHeight: 1.4 },
  contactos: { gap: 3, borderLeftWidth: 0.8, borderLeftColor: "#2a3b5c", paddingLeft: 16 },
  contacto: { fontSize: 9, color: "#ffffff", fontFamily: "Helvetica-Bold" },
  contactoLabel: { fontSize: 7, color: CELESTE, letterSpacing: 1.2, marginBottom: 2, fontFamily: "Helvetica-Bold" },
  pie: {
    position: "absolute",
    bottom: 18,
    left: 44,
    right: 44,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 7.5,
    color: GRIS,
    borderTopWidth: 0.6,
    borderTopColor: LINEA,
    paddingTop: 8,
  },
});

function Wordmark({ ancho }: { ancho: number }) {
  const [, , w, h] = WORDMARK_VIEWBOX.split(" ").map(Number);
  return (
    <Svg viewBox={WORDMARK_VIEWBOX} style={{ width: ancho, height: (ancho * h) / w }}>
      {WORDMARK_TRAZOS.map((t, i) => (
        <Path key={i} d={t.d} fill={t.fill} />
      ))}
    </Svg>
  );
}

/** El filo violeta → azul de Accedra AI, debajo de la banda. */
function Filo() {
  return (
    <Svg style={{ width: "100%", height: 3 }} viewBox="0 0 100 3" preserveAspectRatio="none">
      <Defs>
        <LinearGradient id="filo" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0" stopColor="#c26cf5" />
          <Stop offset="0.5" stopColor={VIOLETA} />
          <Stop offset="1" stopColor={AZUL} />
        </LinearGradient>
      </Defs>
      <Rect x="0" y="0" width="100" height="3" fill="url(#filo)" />
    </Svg>
  );
}

function Seccion({ eyebrow, titulo, children }: { eyebrow: string; titulo: string; children: React.ReactNode }) {
  return (
    <View style={s.seccion} wrap={false}>
      <Text style={s.seccionEyebrow}>{eyebrow.toUpperCase()}</Text>
      <Text style={s.seccionTitulo}>{titulo}</Text>
      {children}
    </View>
  );
}

function Numerada({ items }: { items: string[] }) {
  return (
    <View>
      {items.map((t, i) => (
        <View key={i} style={s.item}>
          <Text style={s.numero}>{i + 1}</Text>
          <Text style={s.itemTexto}>{t}</Text>
        </View>
      ))}
    </View>
  );
}

const fechaLarga = (iso: string) =>
  new Date(iso).toLocaleDateString("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "America/Argentina/Buenos_Aires",
  });

function Documento({ d }: { d: Relevamiento }) {
  const meta = [d.industria, d.tamano].filter(Boolean);
  return (
    <Document title={`Relevamiento — ${d.empresa}`} author={ORG.name} creator="Accedra AI" producer="Accedra">
      <Page size="A4" style={s.pagina}>
        <View style={s.banda}>
          <View style={s.bandaArriba}>
            <Wordmark ancho={128} />
            <View>
              <Text style={[s.eyebrow, { textAlign: "right" }]}>RELEVAMIENTO PRELIMINAR</Text>
              <Text style={s.fechaBanda}>{fechaLarga(d.fecha)}</Text>
            </View>
          </View>
          <Text style={s.titulo}>Relevamiento para {d.empresa}</Text>
          {meta.length > 0 && (
            <View style={s.meta}>
              {meta.map((m) => (
                <Text key={m} style={s.chip}>
                  {m}
                </Text>
              ))}
            </View>
          )}
        </View>
        <Filo />

        <View style={s.cuerpo}>
          <Seccion eyebrow="Tu situación" titulo="Lo que nos contaste">
            <Text style={s.cita}>{d.situacion}</Text>
          </Seccion>

          <Seccion eyebrow="Diagnóstico" titulo="Lo que identificamos">
            <Numerada items={d.hallazgos} />
          </Seccion>

          <View style={s.seccion}>
            <Text style={s.seccionEyebrow}>CÓMO TE AYUDAMOS</Text>
            <Text style={s.seccionTitulo}>Dónde podemos sumar</Text>
            {d.areas.map((a) => (
              <View key={a.solucion} style={[s.area, { borderLeftColor: a.accent }]} wrap={false}>
                <Text style={[s.areaNombre, { color: TINTA }]}>{a.nombre}</Text>
                <Text style={s.etiqueta}>POR QUÉ</Text>
                <Text style={s.areaTexto}>{a.porque}</Text>
                <Text style={s.etiqueta}>QUÉ HARÍAMOS</Text>
                <Text style={[s.areaTexto, { marginBottom: 0 }]}>{a.propuesta}</Text>
              </View>
            ))}
          </View>

          {/* Casos y próximos pasos lado a lado: así el relevamiento entra en
              una carilla, que es lo que se reenvía y se imprime. */}
          {/* Casos, pasos y cierre van juntos: si no entran, pasan a la hoja
              siguiente como bloque y el cierre nunca queda solo. */}
          <View wrap={false}>
            <View style={s.dosColumnas}>
              {d.casos.length > 0 && (
                <View style={[s.seccion, { flex: 1 }]}>
                  <Text style={s.seccionEyebrow}>ANTECEDENTES</Text>
                  <Text style={s.seccionTitulo}>Ya lo resolvimos</Text>
                  <View style={s.casos}>
                    {d.casos.map((c) => (
                      <View key={c.id} style={s.caso}>
                        <Text style={s.casoCliente}>{c.cliente.toUpperCase()}</Text>
                        <Text style={s.casoTitulo}>{c.titulo}</Text>
                        {c.cifra ? <Text style={s.casoCifra}>{c.cifra}</Text> : null}
                      </View>
                    ))}
                  </View>
                </View>
              )}
              <View style={[s.seccion, { flex: 1.25 }]}>
                <Text style={s.seccionEyebrow}>PRÓXIMOS PASOS</Text>
                <Text style={s.seccionTitulo}>Cómo seguimos</Text>
                <Numerada items={d.proximosPasos} />
              </View>
            </View>

            <View style={s.cierre}>
              <View style={{ flex: 1 }}>
                <Text style={s.cierreTitulo}>Coordinemos el relevamiento técnico, sin costo</Text>
                <Text style={s.cierreTexto}>
                  Un especialista de Accedra revisa este diagnóstico con tu equipo, valida lo que hace falta y te arma
                  una propuesta con alcance, plazos y prioridades.
                </Text>
              </View>
              <View style={s.contactos}>
                <View>
                  <Text style={s.contactoLabel}>WHATSAPP</Text>
                  <Text style={s.contacto}>+54 11 3300-1233</Text>
                </View>
                <View>
                  <Text style={s.contactoLabel}>EMAIL</Text>
                  <Text style={s.contacto}>{ORG.email}</Text>
                </View>
                <View>
                  <Text style={s.contactoLabel}>WEB</Text>
                  <Text style={s.contacto}>accedra.com.ar</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View style={s.pie} fixed>
          <Text>
            {ORG.legalName} · Relevamiento preliminar armado con Accedra AI a partir de la conversación. Lo valida un
            especialista.
          </Text>
          <Text render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
        </View>
      </Page>
    </Document>
  );
}

/**
 * Helvetica base sólo trae los caracteres de WinAnsi: una flecha o un emoji
 * salen como basura en el PDF. Se cambian por lo más parecido que sí existe.
 */
function aWinAnsi(t: string): string {
  return (
    t
      // "5→<1 caídas" se lee mejor dicho que con signos.
      .replace(/(\d[\d.,]*)\s*(?:→|->)\s*<\s*(\d[\d.,]*)/g, "de $1 a menos de $2")
      .replace(/(\d[\d.,]*)\s*(?:→|->)\s*(\d[\d.,]*)/g, "de $1 a $2")
      .replace(/→|⟶|➝/g, "›")
      .replace(/←/g, "‹")
      .replace(/≤/g, "<=")
      .replace(/≥/g, ">=")
      .replace(/≈/g, "~")
      .replace(/[\u200B-\u200D\uFEFF]/g, "")
      .replace(/[^\u0000-\u00FF\u2013\u2014\u2018\u2019\u201C\u201D\u2022\u2026\u20AC\u2039\u203A]/g, "")
  );
}

function limpio(d: Relevamiento): Relevamiento {
  const t = aWinAnsi;
  return {
    ...d,
    empresa: t(d.empresa),
    industria: t(d.industria),
    tamano: t(d.tamano),
    situacion: t(d.situacion),
    hallazgos: d.hallazgos.map(t),
    areas: d.areas.map((a) => ({ ...a, nombre: t(a.nombre), porque: t(a.porque), propuesta: t(a.propuesta) })),
    casos: d.casos.map((c) => ({ ...c, cliente: t(c.cliente), titulo: t(c.titulo), cifra: t(c.cifra) })),
    proximosPasos: d.proximosPasos.map(t),
  };
}

export function pdfRelevamiento(datos: Relevamiento): Promise<Buffer> {
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
