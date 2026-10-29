import {
  Circle,
  Defs,
  Document,
  Font,
  Image,
  Link,
  LinearGradient,
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
import { SOLUTIONS } from "@/components/solutions/solutionsData";
import { ORG, SITE_URL } from "@/lib/seo/site";
import { WORDMARK_TRAZOS, WORDMARK_VIEWBOX } from "./logo-pdf";
import { tarjetaCaso } from "./conocimiento";
import type { Prioridad, Relevamiento } from "./tipos";

/**
 * El PDF de relevamiento, con el lenguaje de los brochures de Accedra.
 *
 * Es la misma pieza que los brochures de solución (public/brochures): fondo
 * azul noche con un resplandor arriba, una foto de la solución oscurecida en
 * la portada, títulos en Space Grotesk con la última parte en celeste,
 * etiquetas chicas espaciadas en azul con su rayita, números de sección
 * grandes en azul profundo y el pie espaciado con la paginación "02 — 03".
 *
 * Lo que lo hace propio y no una plantilla: una nota del equipo escrita para
 * esa empresa, el caso de éxito con su foto y un botón para verlo, y un cierre
 * "Hablemos" con los canales de verdad —WhatsApp, mail, LinkedIn, la web—
 * como botones de color que se pueden tocar.
 *
 * Las fuentes y las fotos se piden por URL al mismo sitio: en Vercel la
 * carpeta public no está en el disco de la función, pero sí detrás del CDN.
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
const TARJETA = "#0f1c31";
const BORDE = "#22324d";

const PRIORIDAD: Record<Prioridad, { texto: string; fondo: string; label: string }> = {
  alta: { texto: "#ffb08a", fondo: "#3a2219", label: "PRIORIDAD ALTA" },
  media: { texto: "#f1cf7f", fondo: "#33291a", label: "PRIORIDAD MEDIA" },
  baja: { texto: "#a9b6ca", fondo: "#1d2a3e", label: "PRIORIDAD BAJA" },
};

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
  contenido: { paddingTop: 60, paddingBottom: 72 },

  itSolutions: { fontSize: 6.5, color: "#c9d3e3", letterSpacing: 3, marginTop: 7, fontWeight: 600 },

  eyebrow: { fontSize: 7.5, color: CELESTE, letterSpacing: 2.4, fontWeight: 600 },
  rayita: { width: 34, height: 1.5, backgroundColor: AZUL, marginTop: 9 },

  titulo: { fontFamily: "Grotesk", fontSize: 38, color: BLANCO, lineHeight: 1.08, marginTop: 14, letterSpacing: -0.6 },
  celeste: { color: CELESTE },
  resumen: { fontSize: 11.5, color: "#e1e8f2", lineHeight: 1.65, marginTop: 22, maxWidth: 430 },
  ficha: { fontSize: 7, color: "#93a1b8", letterSpacing: 2, marginTop: 18, fontWeight: 600, lineHeight: 1.7 },

  cifras: { flexDirection: "row", marginTop: "auto" },
  cifra: { flex: 1, paddingRight: 12, borderLeftWidth: 0.6, borderLeftColor: "#2a3a55", paddingLeft: 12 },
  cifraPrimera: { borderLeftWidth: 0, paddingLeft: 0 },
  cifraValor: { fontFamily: "Grotesk", fontSize: 32, color: BLANCO, lineHeight: 1, letterSpacing: -0.8 },
  cifraLabel: { fontSize: 6.5, color: "#93a1b8", letterSpacing: 2, marginTop: 7, fontWeight: 600 },

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

  nota: { flexDirection: "row", marginBottom: 34 },
  comillas: { fontFamily: "Grotesk", fontSize: 64, color: CELESTE, lineHeight: 0.8, width: 46 },
  notaTexto: { fontFamily: "Grotesk", fontSize: 16, color: BLANCO, lineHeight: 1.4 },
  notaFirma: { fontSize: 7, color: CELESTE, letterSpacing: 2, marginTop: 12, fontWeight: 600 },

  seccion: { marginBottom: 24 },
  numero: { fontFamily: "Grotesk", fontSize: 46, color: NUMERO, width: 112, lineHeight: 0.95, letterSpacing: -1.5 },
  cuerpo: { flex: 1 },
  seccionTitulo: { fontFamily: "Grotesk", fontSize: 17, color: BLANCO, marginTop: 6, marginBottom: 10 },
  parrafo: { fontSize: 10, lineHeight: 1.65 },

  hallazgo: { flexDirection: "row", paddingVertical: 8, borderBottomWidth: 0.6, borderBottomColor: LINEA },
  hallazgoTexto: { flex: 1, fontSize: 10, lineHeight: 1.55, paddingRight: 14 },
  etiquetaPrioridad: {
    fontSize: 6,
    letterSpacing: 1.4,
    fontWeight: 700,
    borderRadius: 8,
    paddingVertical: 3.5,
    paddingHorizontal: 7,
    marginTop: 1,
    alignSelf: "flex-start",
  },

  area: { backgroundColor: TARJETA, borderWidth: 0.6, borderColor: BORDE, borderRadius: 8, marginBottom: 10 },
  areaCabeza: { flexDirection: "row", alignItems: "center", paddingHorizontal: 14, paddingTop: 13, paddingBottom: 10 },
  areaPunto: { width: 8, height: 8, borderRadius: 4, marginRight: 9 },
  areaNombre: { fontFamily: "Grotesk", fontSize: 13.5, color: BLANCO },
  areaCuerpo: { paddingHorizontal: 14, paddingBottom: 13, flexDirection: "row", gap: 16 },
  areaColumna: { flex: 1 },
  etiqueta: { fontSize: 6.5, color: CELESTE, letterSpacing: 2, marginBottom: 4, fontWeight: 600 },
  areaTexto: { fontSize: 9.4, lineHeight: 1.6 },
  areaLink: { fontSize: 8, color: CELESTE, marginTop: 9, fontWeight: 600, textDecoration: "none" },

  caso: {
    flexDirection: "row",
    backgroundColor: TARJETA,
    borderWidth: 0.6,
    borderColor: BORDE,
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 10,
  },
  casoFoto: { width: 150, objectFit: "cover" },
  casoCuerpo: { flex: 1, padding: 16 },
  casoCliente: { fontSize: 6.5, color: CELESTE, letterSpacing: 2, fontWeight: 600 },
  casoTitulo: { fontFamily: "Grotesk", fontSize: 14, color: BLANCO, marginTop: 6, lineHeight: 1.25 },
  casoCifraValor: { fontFamily: "Grotesk", fontSize: 22, color: CELESTE, marginTop: 10, letterSpacing: -0.4 },
  casoCifraLabel: { fontSize: 8.5, color: TEXTO, marginTop: 2 },
  boton: {
    alignSelf: "flex-start",
    backgroundColor: AZUL,
    color: BLANCO,
    fontSize: 8.5,
    fontWeight: 700,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginTop: 12,
    textDecoration: "none",
  },

  paso: { flexDirection: "row", paddingVertical: 7, borderBottomWidth: 0.6, borderBottomColor: LINEA },
  pasoNumero: { width: 26, fontFamily: "Grotesk", fontSize: 11, color: CELESTE },
  pasoTexto: { flex: 1, fontSize: 10, lineHeight: 1.55 },

  hablemos: { backgroundColor: TARJETA, borderWidth: 0.6, borderColor: "#27406a", borderRadius: 10, padding: 22 },
  hablemosTitulo: { fontFamily: "Grotesk", fontSize: 24, color: BLANCO, lineHeight: 1.15, marginTop: 12 },
  hablemosTexto: { fontSize: 10, lineHeight: 1.6, marginTop: 8, maxWidth: 400 },
  canales: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 16 },
  canal: {
    width: "48.8%",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    paddingVertical: 11,
    paddingHorizontal: 12,
    textDecoration: "none",
  },
  canalIcono: { width: 26, height: 26, borderRadius: 13, backgroundColor: "rgba(255,255,255,0.18)", alignItems: "center", justifyContent: "center", marginRight: 10 },
  canalNombre: { fontSize: 10, color: BLANCO, fontWeight: 700 },
  canalDato: { fontSize: 8, color: "rgba(255,255,255,0.85)", marginTop: 2 },
  canalFlecha: { marginLeft: "auto", fontSize: 12, color: BLANCO },
  alcance: { fontSize: 7.6, color: TENUE, lineHeight: 1.6, marginTop: 14 },
  respaldo: { flexDirection: "row", marginTop: 26 },
  respaldoLabel: { fontSize: 6.5, color: GRIS, letterSpacing: 2, fontWeight: 600, marginBottom: 12 },
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

/** La foto de la solución detrás de la portada, oscurecida como en el brochure. */
function FotoPortada({ src }: { src: string }) {
  return (
    <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}>
      <Image src={src} style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, objectFit: "cover", opacity: 0.42 }} />
      <Svg style={{ position: "absolute", top: 0, left: 0, width: 595.28, height: 841.89 }} viewBox="0 0 595 842">
        <Defs>
          <LinearGradient id="velo" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={FONDO} stopOpacity="0.55" />
            <Stop offset="0.45" stopColor={FONDO} stopOpacity="0.55" />
            <Stop offset="0.8" stopColor={FONDO_HONDO} stopOpacity="0.92" />
            <Stop offset="1" stopColor={FONDO_HONDO} stopOpacity="1" />
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width="595" height="842" fill="url(#velo)" />
      </Svg>
    </View>
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

/**
 * Una sección: número grande a la izquierda, título y contenido a la derecha.
 * El título viaja siempre con el primer bloque —nunca queda solo al pie de una
 * página— y con `junta` la sección entera no se parte.
 */
function Seccion({
  n,
  titulo,
  children,
  junta = false,
}: {
  n: number;
  titulo: string;
  children: React.ReactNode;
  junta?: boolean;
}) {
  const [primero, ...resto] = (Array.isArray(children) ? children : [children]).flat().filter(Boolean);
  return (
    <View style={s.seccion} wrap={!junta}>
      {/* Número, título y primer bloque: juntos, siempre. */}
      <View style={{ flexDirection: "row" }} wrap={false}>
        <Text style={s.numero}>{String(n).padStart(2, "0")}</Text>
        <View style={s.cuerpo}>
          <Text style={s.seccionTitulo}>{titulo}</Text>
          {primero}
        </View>
      </View>
      {resto.length > 0 && (
        <View style={{ flexDirection: "row" }}>
          <View style={{ width: 112 }} />
          <View style={s.cuerpo}>{resto}</View>
        </View>
      )}
    </View>
  );
}

/* ── Íconos de los canales (24×24, en blanco) ───────────────────────────── */

const ICONO_WHATSAPP =
  "M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.39-1.47-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.21 3.07.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2-1.42.25-.69.25-1.29.18-1.41-.08-.13-.28-.2-.57-.35M12.05 21.78a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.89-9.88 2.64 0 5.12 1.03 6.99 2.9a9.82 9.82 0 0 1 2.89 6.99c0 5.45-4.44 9.88-9.89 9.88M20.46 3.49A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.89 0-3.18-1.24-6.17-3.48-8.42Z";
const ICONO_LINKEDIN =
  "M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45Z";
const ICONO_MAIL = "M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm1 2.4V17h16V7.4l-7.4 5.3a1 1 0 0 1-1.2 0L4 7.4Zm1.7-.4L12 11.6 18.3 7H5.7Z";

function IconoCanal({ tipo }: { tipo: "whatsapp" | "mail" | "linkedin" | "web" }) {
  return (
    <View style={s.canalIcono}>
      <Svg viewBox="0 0 24 24" style={{ width: 13, height: 13 }}>
        {tipo === "web" ? (
          <>
            <Circle cx="12" cy="12" r="9.5" stroke={BLANCO} strokeWidth={1.8} fill="none" />
            <Path d="M2.5 12h19M12 2.5c2.6 2.8 3.8 6 3.8 9.5s-1.2 6.7-3.8 9.5c-2.6-2.8-3.8-6-3.8-9.5S9.4 5.3 12 2.5Z" stroke={BLANCO} strokeWidth={1.6} fill="none" />
          </>
        ) : (
          <Path d={tipo === "whatsapp" ? ICONO_WHATSAPP : tipo === "linkedin" ? ICONO_LINKEDIN : ICONO_MAIL} fill={BLANCO} />
        )}
      </Svg>
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

function Documento({ d, origen }: { d: Relevamiento; origen: string }) {
  const cifras = [
    { valor: String(d.hallazgos.length).padStart(2, "0"), label: "HALLAZGOS" },
    { valor: String(d.hallazgos.filter((h) => h.prioridad === "alta").length).padStart(2, "0"), label: "PRIORIDAD ALTA" },
    { valor: String(d.areas.length).padStart(2, "0"), label: "ÁREAS DE MEJORA" },
    { valor: String(d.casos.length).padStart(2, "0"), label: "CASOS SIMILARES" },
  ];
  const ficha = [d.industria, d.tamano, fechaCorta(d.fecha), d.referencia].filter(Boolean).join("  ·  ").toUpperCase();
  const fotoPortada = SOLUTIONS[d.areas[0]?.solucion]?.heroImage;
  const consulta = encodeURIComponent(`Hola, vengo del relevamiento ${d.referencia} (${d.empresa}).`);
  const canales = [
    { tipo: "whatsapp" as const, nombre: "WhatsApp", dato: "+54 11 3300-1233", color: "#1fa855", href: `https://wa.me/541133001233?text=${consulta}` },
    { tipo: "mail" as const, nombre: "Escribinos un mail", dato: ORG.email, color: "#d14334", href: `mailto:${ORG.email}?subject=${encodeURIComponent(`Relevamiento ${d.referencia} — ${d.empresa}`)}` },
    { tipo: "linkedin" as const, nombre: "LinkedIn", dato: "Accedra S.A.", color: "#0a66c2", href: "https://www.linkedin.com/company/accedra-s.a." },
    { tipo: "web" as const, nombre: "accedra.com.ar", dato: "Soluciones y casos", color: AZUL, href: SITE_URL },
  ];
  let n = 0;

  return (
    <Document title={`Relevamiento — ${d.empresa}`} author={ORG.name} creator="Accedra" producer="Accedra">
      {/* ── Portada ── */}
      <Page size="A4" style={[s.pagina, s.portada]}>
        <Fondo />
        {fotoPortada ? <FotoPortada src={`${origen}${fotoPortada}`} /> : null}
        <Wordmark />

        <View style={{ marginTop: 150 }}>
          <Eyebrow>Relevamiento preliminar</Eyebrow>
          <Text style={s.titulo}>
            Relevamiento para{"\n"}
            <Text style={s.celeste}>{d.empresa}.</Text>
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

        {/* La nota del equipo: lo que diría un especialista en persona. */}
        <View style={s.nota} wrap={false}>
          <Text style={s.comillas}>“</Text>
          <View style={{ flex: 1 }}>
            <Text style={s.notaTexto}>{d.nota}</Text>
            <Text style={s.notaFirma}>EQUIPO DE ESPECIALISTAS · ACCEDRA</Text>
          </View>
        </View>

        <Seccion n={++n} titulo="Situación actual">
          <Text style={s.parrafo}>{d.situacion}</Text>
        </Seccion>

        <Seccion n={++n} titulo="Lo que identificamos">
          {d.hallazgos.map((h, i) => (
            <View
              key={i}
              style={[s.hallazgo, i === d.hallazgos.length - 1 ? { borderBottomWidth: 0 } : {}]}
              wrap={false}
            >
              <Text style={s.hallazgoTexto}>{h.texto}</Text>
              <Text
                style={[s.etiquetaPrioridad, { color: PRIORIDAD[h.prioridad].texto, backgroundColor: PRIORIDAD[h.prioridad].fondo }]}
              >
                {PRIORIDAD[h.prioridad].label}
              </Text>
            </View>
          ))}
        </Seccion>

        <Seccion n={++n} titulo="Qué recomendamos">
          {d.areas.map((a) => (
            <View key={a.solucion} style={[s.area, { borderTopWidth: 2, borderTopColor: a.accent }]} wrap={false}>
              <View style={s.areaCabeza}>
                <View style={[s.areaPunto, { backgroundColor: a.accent }]} />
                <Text style={s.areaNombre}>{a.nombre}</Text>
              </View>
              <View style={s.areaCuerpo}>
                <View style={s.areaColumna}>
                  <Text style={s.etiqueta}>POR QUÉ</Text>
                  <Text style={s.areaTexto}>{a.porque}</Text>
                </View>
                <View style={s.areaColumna}>
                  <Text style={s.etiqueta}>QUÉ HARÍAMOS</Text>
                  <Text style={s.areaTexto}>{a.propuesta}</Text>
                  <Link src={`${SITE_URL}/soluciones/${a.solucion}`} style={s.areaLink}>
                    Conocé {a.nombre} →
                  </Link>
                </View>
              </View>
            </View>
          ))}
        </Seccion>

        {d.casos.length > 0 && (
          <Seccion n={++n} titulo="Ya lo resolvimos">
            {d.casos.map((c) => {
              const caso = tarjetaCaso(c.id);
              const [valor, ...resto] = c.cifra.split(" ");
              return (
                <View key={c.id} style={s.caso} wrap={false}>
                  {caso ? <Image src={`${origen}${caso.imagen}`} style={s.casoFoto} /> : null}
                  <View style={s.casoCuerpo}>
                    <Text style={s.casoCliente}>{c.cliente.toUpperCase()}</Text>
                    <Text style={s.casoTitulo}>{c.titulo}</Text>
                    {c.cifra ? (
                      <>
                        <Text style={s.casoCifraValor}>{valor}</Text>
                        <Text style={s.casoCifraLabel}>{resto.join(" ")}</Text>
                      </>
                    ) : null}
                    {caso ? (
                      <Link src={`${SITE_URL}${caso.href}`} style={s.boton}>
                        Ver caso completo →
                      </Link>
                    ) : null}
                  </View>
                </View>
              );
            })}
          </Seccion>
        )}

        <Seccion n={++n} titulo="Próximos pasos" junta>
          {d.proximosPasos.map((p, i) => (
            <View key={i} style={[s.paso, i === d.proximosPasos.length - 1 ? { borderBottomWidth: 0 } : {}]} wrap={false}>
              <Text style={s.pasoNumero}>{String(i + 1).padStart(2, "0")}</Text>
              <Text style={s.pasoTexto}>{p}</Text>
            </View>
          ))}
        </Seccion>

        {/* ── Hablemos: los canales como botones de verdad ── */}
        <View style={s.hablemos} wrap={false}>
          <Eyebrow>Siguiente paso</Eyebrow>
          <Text style={s.hablemosTitulo}>
            Hablemos de <Text style={s.celeste}>tu caso.</Text>
          </Text>
          <Text style={s.hablemosTexto}>
            Coordinamos un relevamiento técnico en sitio, sin costo, y con lo que releve el especialista te entregamos
            una propuesta con alcance, plazos y prioridades. Escribinos por donde te quede más cómodo.
          </Text>
          <View style={s.canales}>
            {canales.map((c) => (
              <Link key={c.tipo} src={c.href} style={[s.canal, { backgroundColor: c.color }]}>
                <IconoCanal tipo={c.tipo} />
                <View>
                  <Text style={s.canalNombre}>{c.nombre}</Text>
                  <Text style={s.canalDato}>{c.dato}</Text>
                </View>
                <Text style={s.canalFlecha}>→</Text>
              </Link>
            ))}
          </View>
          <Text style={s.alcance}>
            Relevamiento preliminar, armado con lo que nos contaste en la conversación con el asistente de Accedra. Las
            recomendaciones, los plazos y el equipamiento se validan en el relevamiento técnico en sitio.
          </Text>
        </View>

        {/* El respaldo, con las mismas cifras de la portada del sitio y del brochure. */}
        <View wrap={false} style={{ marginTop: 26 }}>
          <Text style={s.respaldoLabel}>POR QUÉ ACCEDRA</Text>
          <View style={s.cifras}>
            {[
              { valor: "17+", label: "AÑOS DE EXPERIENCIA" },
              { valor: "400+", label: "PROYECTOS ENTREGADOS" },
              { valor: "26+", label: "PARTNERS TECNOLÓGICOS" },
              { valor: "100+", label: "CLIENTES ACTIVOS" },
            ].map((c, i) => (
              <View key={c.label} style={[s.cifra, i === 0 ? s.cifraPrimera : {}]}>
                <Text style={[s.cifraValor, { fontSize: 26 }]}>{c.valor}</Text>
                <Text style={s.cifraLabel}>{c.label}</Text>
              </View>
            ))}
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
    nota: t(d.nota ?? ""),
    situacion: t(d.situacion),
    hallazgos: d.hallazgos.map((h) => ({ ...h, texto: t(h.texto) })),
    areas: d.areas.map((a) => ({ ...a, nombre: t(a.nombre), porque: t(a.porque), propuesta: t(a.propuesta) })),
    casos: d.casos.map((c) => ({ ...c, cliente: t(c.cliente), titulo: t(c.titulo), cifra: t(c.cifra) })),
    proximosPasos: d.proximosPasos.map(t),
  };
}

/**
 * @param origen el sitio desde donde se piden fuentes y fotos
 *   ("https://accedra.com.ar"; en desarrollo, el localhost del pedido).
 */
export function pdfRelevamiento(datos: Relevamiento, origen: string): Promise<Buffer> {
  registrarFuentes(origen);
  return renderToBuffer(<Documento d={limpio(datos)} origen={origen} />);
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
