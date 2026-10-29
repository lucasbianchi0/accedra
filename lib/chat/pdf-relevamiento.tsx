import { Document, Font, Page, Path, Svg, Text, View, StyleSheet, renderToBuffer } from "@react-pdf/renderer";
import { ORG } from "@/lib/seo/site";
import { WORDMARK_TRAZOS, WORDMARK_VIEWBOX } from "./logo-pdf";
import type { Prioridad, Relevamiento } from "./tipos";

/**
 * El PDF de relevamiento: lo que la persona se lleva de la conversación, y lo
 * que el equipo comercial recibe con el lead.
 *
 * Diseño de informe de consultora y no de "hecho con IA": página blanca,
 * mucho aire, una sola tinta (navy) con el azul de marca de acento, líneas
 * finas en vez de cajas, y una grilla editorial —número y título de sección a
 * la izquierda, contenido a la derecha—. Nada de degradés, bandas oscuras ni
 * etiquetas espaciadas: es lo que delata una plantilla.
 *
 * Contenido, en el orden en que lo lee un gerente: para quién es y de qué
 * trata; un resumen ejecutivo que se entiende sin leer nada más; la
 * situación; lo que identificamos con su prioridad; qué recomendamos y por
 * qué; antecedentes reales; próximos pasos; el alcance (es preliminar) y un
 * único siguiente paso con cómo pedirlo.
 *
 * Helvetica y Times de base (Times sólo en itálica, para los números de
 * sección y las entradas): cubren acentos y ñ, y no hay que cargar archivos.
 */

// Sin cortar palabras con guion: "logís-tico" en un título se ve descuidado.
Font.registerHyphenationCallback((palabra) => [palabra]);

const TINTA = "#0b1626";
const TEXTO = "#26354a";
const GRIS = "#6b7a90";
const TENUE = "#9aa8bd";
const LINEA = "#dfe5ee";
const AZUL = "#2b6fd4";

const COLOR_PRIORIDAD: Record<Prioridad, string> = { alta: "#b4471b", media: "#9a6a12", baja: GRIS };
const NOMBRE_PRIORIDAD: Record<Prioridad, string> = {
  alta: "Prioridad alta",
  media: "Prioridad media",
  baja: "Prioridad baja",
};

const s = StyleSheet.create({
  pagina: {
    fontFamily: "Helvetica",
    fontSize: 9.5,
    color: TEXTO,
    paddingTop: 44,
    paddingHorizontal: 52,
    paddingBottom: 58,
  },
  cabecera: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" },
  cabeceraDato: { fontSize: 8, color: GRIS, textAlign: "right", lineHeight: 1.45 },
  cabeceraRef: { fontFamily: "Helvetica-Bold", color: TINTA },
  regla: { borderBottomWidth: 0.6, borderBottomColor: LINEA, marginTop: 12 },

  paraQuien: { fontSize: 9, color: GRIS, marginTop: 34 },
  empresa: {
    fontFamily: "Helvetica-Bold",
    fontSize: 30,
    color: TINTA,
    marginTop: 4,
    letterSpacing: -0.6,
    lineHeight: 1.1,
  },
  bajada: { fontFamily: "Times-Italic", fontSize: 14.5, color: GRIS, marginTop: 6 },

  ficha: { flexDirection: "row", marginTop: 22, borderTopWidth: 0.6, borderTopColor: LINEA, paddingTop: 9 },
  fichaCelda: { flex: 1, paddingRight: 10 },
  fichaLabel: { fontSize: 7.5, color: TENUE, marginBottom: 2 },
  fichaValor: { fontSize: 9, color: TINTA },

  resumen: { marginTop: 24, borderLeftWidth: 2, borderLeftColor: TINTA, paddingLeft: 14, paddingVertical: 2 },
  resumenLabel: { fontFamily: "Times-Italic", fontSize: 11, color: GRIS, marginBottom: 4 },
  resumenTexto: { fontSize: 11.5, color: TINTA, lineHeight: 1.5 },

  seccion: { flexDirection: "row", marginTop: 20, borderTopWidth: 0.6, borderTopColor: LINEA, paddingTop: 12 },
  seccionLado: { width: 112, paddingRight: 12 },
  seccionNumero: { fontFamily: "Times-Italic", fontSize: 18, color: TENUE, lineHeight: 1 },
  seccionTitulo: { fontFamily: "Helvetica-Bold", fontSize: 10, color: TINTA, marginTop: 5 },
  seccionCuerpo: { flex: 1 },
  parrafo: { fontSize: 9.8, lineHeight: 1.55 },

  hallazgo: { flexDirection: "row", paddingVertical: 5.5, borderBottomWidth: 0.4, borderBottomColor: LINEA },
  hallazgoTexto: { flex: 1, fontSize: 9.6, lineHeight: 1.5, paddingRight: 14 },
  hallazgoPrioridad: { width: 78, fontSize: 7.8, textAlign: "right", paddingTop: 1.5 },

  area: { marginBottom: 12 },
  areaCabeza: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  areaMarca: { width: 6, height: 6, marginRight: 7 },
  areaNombre: { fontFamily: "Helvetica-Bold", fontSize: 11, color: TINTA },
  areaFila: { flexDirection: "row", marginBottom: 4 },
  areaLabel: { width: 74, fontFamily: "Times-Italic", fontSize: 10, color: GRIS },
  areaTexto: { flex: 1, fontSize: 9.6, lineHeight: 1.5 },

  caso: { flexDirection: "row", paddingVertical: 4 },
  casoCliente: { width: 108, fontFamily: "Helvetica-Bold", fontSize: 9.6, color: TINTA },
  casoTexto: { flex: 1, fontSize: 9.6, lineHeight: 1.45 },
  casoCifra: { color: GRIS },

  paso: { flexDirection: "row", paddingVertical: 4.5, borderBottomWidth: 0.4, borderBottomColor: LINEA },
  pasoNumero: { width: 20, fontFamily: "Helvetica-Bold", fontSize: 9.6, color: AZUL },
  pasoTexto: { flex: 1, fontSize: 9.6, lineHeight: 1.5 },

  alcance: { fontSize: 8.6, color: GRIS, lineHeight: 1.5 },

  cierre: { marginTop: 24, borderTopWidth: 1.4, borderTopColor: TINTA, paddingTop: 14, flexDirection: "row" },
  cierreLado: { flex: 1, paddingRight: 24 },
  cierreLabel: { fontFamily: "Times-Italic", fontSize: 11, color: GRIS },
  cierreTitulo: { fontFamily: "Helvetica-Bold", fontSize: 15, color: TINTA, marginTop: 3, lineHeight: 1.25 },
  cierreTexto: { fontSize: 9.4, marginTop: 6, lineHeight: 1.5 },
  contactos: { width: 170 },
  contacto: { flexDirection: "row", paddingVertical: 3.2, borderBottomWidth: 0.4, borderBottomColor: LINEA },
  contactoLabel: { width: 58, fontSize: 8, color: TENUE, paddingTop: 1 },
  contactoValor: { flex: 1, fontSize: 9, color: TINTA, fontFamily: "Helvetica-Bold" },

  pie: {
    position: "absolute",
    bottom: 26,
    left: 52,
    right: 52,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 7.5,
    color: TENUE,
  },
});

/** El wordmark sobre blanco: el trazo blanco del original pasa a la tinta. */
function Wordmark({ ancho }: { ancho: number }) {
  const [, , w, h] = WORDMARK_VIEWBOX.split(" ").map(Number);
  return (
    <Svg viewBox={WORDMARK_VIEWBOX} style={{ width: ancho, height: (ancho * h) / w }}>
      {WORDMARK_TRAZOS.map((t, i) => (
        <Path key={i} d={t.d} fill={t.fill.toLowerCase() === "#ffffff" ? TINTA : t.fill} />
      ))}
    </Svg>
  );
}

function Seccion({
  n,
  titulo,
  children,
  unida = true,
}: {
  n: number;
  titulo: string;
  children: React.ReactNode;
  /** false si la sección puede partirse entre páginas (la de recomendaciones). */
  unida?: boolean;
}) {
  return (
    <View style={s.seccion} wrap={!unida}>
      <View style={s.seccionLado}>
        <Text style={s.seccionNumero}>{String(n).padStart(2, "0")}</Text>
        <Text style={s.seccionTitulo}>{titulo}</Text>
      </View>
      <View style={s.seccionCuerpo}>{children}</View>
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

/** "Diagnóstico preliminar · Conectividad Crítica y Seguridad IT". */
function bajada(d: Relevamiento): string {
  const temas = d.areas.map((a) => a.nombre);
  const lista = temas.length > 1 ? `${temas.slice(0, -1).join(", ")} y ${temas[temas.length - 1]}` : temas[0];
  return `Diagnóstico preliminar · ${lista}`;
}

function Documento({ d }: { d: Relevamiento }) {
  let n = 0;
  const ficha = [
    { label: "Industria", valor: d.industria || "—" },
    { label: "Tamaño", valor: d.tamano || "—" },
    { label: "Fecha", valor: fechaLarga(d.fecha) },
    { label: "Preparado por", valor: "Accedra IT Solutions" },
  ];
  const contactos = [
    { label: "WhatsApp", valor: "+54 11 3300-1233" },
    { label: "Teléfono", valor: ORG.phoneDisplay },
    { label: "Email", valor: ORG.email },
    { label: "Web", valor: "accedra.com.ar" },
  ];

  return (
    <Document title={`Relevamiento — ${d.empresa}`} author={ORG.name} creator="Accedra" producer="Accedra">
      <Page size="A4" style={s.pagina}>
        <View style={s.cabecera}>
          <Wordmark ancho={112} />
          <View>
            <Text style={s.cabeceraDato}>Relevamiento preliminar</Text>
            <Text style={[s.cabeceraDato, s.cabeceraRef]}>{d.referencia}</Text>
          </View>
        </View>
        <View style={s.regla} />

        <Text style={s.paraQuien}>Preparado para</Text>
        <Text style={s.empresa}>{d.empresa}</Text>
        <Text style={s.bajada}>{bajada(d)}</Text>

        <View style={s.ficha}>
          {ficha.map((f) => (
            <View key={f.label} style={s.fichaCelda}>
              <Text style={s.fichaLabel}>{f.label}</Text>
              <Text style={s.fichaValor}>{f.valor}</Text>
            </View>
          ))}
        </View>

        <View style={s.resumen} wrap={false}>
          <Text style={s.resumenLabel}>En resumen</Text>
          <Text style={s.resumenTexto}>{d.resumen}</Text>
        </View>

        <Seccion n={++n} titulo="Situación actual">
          <Text style={s.parrafo}>{d.situacion}</Text>
        </Seccion>

        <Seccion n={++n} titulo="Lo que identificamos">
          {d.hallazgos.map((h, i) => (
            <View key={i} style={[s.hallazgo, i === d.hallazgos.length - 1 ? { borderBottomWidth: 0 } : {}]}>
              <Text style={s.hallazgoTexto}>{h.texto}</Text>
              <Text style={[s.hallazgoPrioridad, { color: COLOR_PRIORIDAD[h.prioridad] }]}>
                {NOMBRE_PRIORIDAD[h.prioridad]}
              </Text>
            </View>
          ))}
        </Seccion>

        <Seccion n={++n} titulo="Qué recomendamos" unida={false}>
          {d.areas.map((a) => (
            <View key={a.solucion} style={s.area} wrap={false}>
              <View style={s.areaCabeza}>
                <View style={[s.areaMarca, { backgroundColor: a.accent }]} />
                <Text style={s.areaNombre}>{a.nombre}</Text>
              </View>
              <View style={s.areaFila}>
                <Text style={s.areaLabel}>Por qué</Text>
                <Text style={s.areaTexto}>{a.porque}</Text>
              </View>
              <View style={s.areaFila}>
                <Text style={s.areaLabel}>Qué haríamos</Text>
                <Text style={s.areaTexto}>{a.propuesta}</Text>
              </View>
            </View>
          ))}
        </Seccion>

        {d.casos.length > 0 && (
          <Seccion n={++n} titulo="Antecedentes">
            {d.casos.map((c) => (
              <View key={c.id} style={s.caso}>
                <Text style={s.casoCliente}>{c.cliente}</Text>
                <Text style={s.casoTexto}>
                  {c.titulo}
                  {c.cifra ? <Text style={s.casoCifra}>{` — ${c.cifra}.`}</Text> : "."}
                </Text>
              </View>
            ))}
          </Seccion>
        )}

        <Seccion n={++n} titulo="Próximos pasos">
          {d.proximosPasos.map((p, i) => (
            <View key={i} style={[s.paso, i === d.proximosPasos.length - 1 ? { borderBottomWidth: 0 } : {}]}>
              <Text style={s.pasoNumero}>{i + 1}.</Text>
              <Text style={s.pasoTexto}>{p}</Text>
            </View>
          ))}
        </Seccion>

        <Seccion n={++n} titulo="Alcance">
          <Text style={s.alcance}>
            Este relevamiento es preliminar: se arma con lo que nos contaste en la conversación con el asistente de
            Accedra. Las recomendaciones, los plazos y el equipamiento se validan en el relevamiento técnico en sitio,
            que no tiene costo ni compromiso.
          </Text>
        </Seccion>

        <View style={s.cierre} wrap={false}>
          <View style={s.cierreLado}>
            <Text style={s.cierreLabel}>Siguiente paso</Text>
            <Text style={s.cierreTitulo}>Relevamiento técnico en sitio, sin costo.</Text>
            <Text style={s.cierreTexto}>
              Respondé este correo o escribinos y coordinamos la visita de un especialista. Con lo que releve, te
              entregamos una propuesta con alcance, plazos y prioridades.
            </Text>
          </View>
          <View style={s.contactos}>
            {contactos.map((c, i) => (
              <View key={c.label} style={[s.contacto, i === contactos.length - 1 ? { borderBottomWidth: 0 } : {}]}>
                <Text style={s.contactoLabel}>{c.label}</Text>
                <Text style={s.contactoValor}>{c.valor}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={s.pie} fixed>
          <Text>
            {ORG.legalName} · {ORG.address.street}, CABA · accedra.com.ar
          </Text>
          <Text render={({ pageNumber, totalPages }) => `${d.referencia} · ${pageNumber}/${totalPages}`} />
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
      .replace(/[​-‍﻿]/g, "")
      .replace(/[^\u0000-ÿ–—‘’“”•…€‹›]/g, "")
  );
}

function limpio(d: Relevamiento): Relevamiento {
  const t = aWinAnsi;
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
