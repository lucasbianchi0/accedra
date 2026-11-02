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
  Rect,
  Stop,
  StyleSheet,
  Svg,
  Text,
  View,
  renderToBuffer,
} from "@react-pdf/renderer";
import { ORG, SITE_URL } from "@/lib/seo/site";
import { WORDMARK_TRAZOS, WORDMARK_VIEWBOX } from "./logo-pdf";
import { tarjetaCaso } from "./conocimiento";
import { SERVICIO_SIMPLE, type Relevamiento } from "./tipos";

/**
 * El PDF de relevamiento, con la estética de la propuesta comercial del
 * backoffice: portada oscura con foto dentro de un marco claro, interior blanco
 * con aire y sin tarjetas, y un cierre oscuro que repite la portada.
 *
 * El contenido sigue las ideas del equipo comercial (01/11/2026):
 *
 * - Portada con el logo, nuestros datos, los del cliente y lo que busca en un
 *   título concreto ("Cableado estructurado · Cambio de AP · Pilar").
 * - Una segunda hoja con lo que nos contaron, en un solo resumen. Sin
 *   prioridades, sin "lo que falta" ni porcentajes: es una primera lectura, no
 *   un diagnóstico confirmado.
 * - El caso de éxito y el blog sólo si el asistente encontró uno que aplique.
 * - "Hablemos de tu caso" como siguiente paso, sin prometer la visita sin
 *   costo: según dónde sea, tiene costo.
 * - Al cierre, una presentación breve de la empresa.
 *
 * Las fuentes y las fotos se piden por URL al mismo sitio: en Vercel la
 * carpeta public no está en el disco de la función, pero sí detrás del CDN.
 */

const TINTA = "#0D1A2D";
const TINTA2 = "#45546A";
const GRIS = "#5B6A80";
const LINEA = "#E3E8EF";
const PAPEL = "#F6F7F9";
const AZUL = "#2560BC";
const CIELO = "#8DBBF5";
const NAVY = "#0A1424";
const TEXTO = "#1F2C40";

const M = 48;

let fuentesDe: string | null = null;

/** Inter Tight para los títulos, Inter para el texto. Una vez por instancia. */
function registrarFuentes(origen: string) {
  if (fuentesDe === origen) return;
  fuentesDe = origen;
  Font.register({
    family: "Tight",
    fonts: [
      { src: `${origen}/fuentes/InterTight-Medium.woff`, fontWeight: 500 },
      { src: `${origen}/fuentes/InterTight-SemiBold.woff`, fontWeight: 600 },
    ],
  });
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
  pagina: {
    fontFamily: "Inter",
    fontSize: 10.5,
    color: TEXTO,
    backgroundColor: "#fff",
    paddingHorizontal: M,
    paddingTop: 96,
    paddingBottom: 64,
    lineHeight: 1.65,
  },
  cabeza: {
    position: "absolute",
    top: 38,
    left: M,
    right: M,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  chico: { fontSize: 8.5, color: GRIS },
  pie: {
    position: "absolute",
    bottom: 30,
    left: M,
    right: M,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  subtitulo: { fontFamily: "Tight", fontWeight: 500, fontSize: 15.5, color: TINTA, letterSpacing: -0.3, marginBottom: 8 },
  eyebrow: { fontSize: 8.5, color: AZUL, fontWeight: 600, letterSpacing: 0.9 },
  parrafo: { fontSize: 10.2, lineHeight: 1.6 },
  boton: {
    alignSelf: "flex-start",
    backgroundColor: AZUL,
    color: "#fff",
    fontSize: 9.5,
    fontWeight: 700,
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 14,
    textDecoration: "none",
  },

  canales: { flexDirection: "row", flexWrap: "wrap", gap: 7 },
  canal: {
    width: "48.9%",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    paddingVertical: 11,
    paddingHorizontal: 13,
    textDecoration: "none",
  },
  canalIcono: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 9,
  },
  canalNombre: { fontSize: 11.5, color: "#fff", fontWeight: 700, lineHeight: 1.25 },
  canalDato: { fontSize: 9.5, color: "rgba(255,255,255,0.9)", marginTop: 2, lineHeight: 1.25 },
  canalFlecha: { marginLeft: "auto", fontSize: 13, color: "#fff" },
});

/* ── Piezas ───────────────────────────────────────────────────────────────── */

function Wordmark({ ancho, color }: { ancho: number; color: string }) {
  const [, , w, h] = WORDMARK_VIEWBOX.split(" ").map(Number);
  return (
    <Svg viewBox={WORDMARK_VIEWBOX} style={{ width: ancho, height: (ancho * h) / w }}>
      {WORDMARK_TRAZOS.map((t, i) => (
        <Path key={i} d={t.d} fill={t.fill === "#ffffff" ? color : t.fill} />
      ))}
    </Svg>
  );
}

const ICONO_WHATSAPP =
  "M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.39-1.47-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.21 3.07.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2-1.42.25-.69.25-1.29.18-1.41-.08-.13-.28-.2-.57-.35M12.05 21.78a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.89-9.88 2.64 0 5.12 1.03 6.99 2.9a9.82 9.82 0 0 1 2.89 6.99c0 5.45-4.44 9.88-9.89 9.88M20.46 3.49A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.89 0-3.18-1.24-6.17-3.48-8.42Z";
const ICONO_LINKEDIN =
  "M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45Z";
const ICONO_MAIL = "M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm1 2.4V17h16V7.4l-7.4 5.3a1 1 0 0 1-1.2 0L4 7.4Zm1.7-.4L12 11.6 18.3 7H5.7Z";

type TipoCanal = "whatsapp" | "mail" | "linkedin" | "web";

function IconoCanal({ tipo }: { tipo: TipoCanal }) {
  return (
    <View style={s.canalIcono}>
      <Svg viewBox="0 0 24 24" style={{ width: 14, height: 14 }}>
        {tipo === "web" ? (
          <>
            <Circle cx="12" cy="12" r="9.5" stroke="#fff" strokeWidth={1.8} fill="none" />
            <Path
              d="M2.5 12h19M12 2.5c2.6 2.8 3.8 6 3.8 9.5s-1.2 6.7-3.8 9.5c-2.6-2.8-3.8-6-3.8-9.5S9.4 5.3 12 2.5Z"
              stroke="#fff"
              strokeWidth={1.6}
              fill="none"
            />
          </>
        ) : (
          <Path d={tipo === "whatsapp" ? ICONO_WHATSAPP : tipo === "linkedin" ? ICONO_LINKEDIN : ICONO_MAIL} fill="#fff" />
        )}
      </Svg>
    </View>
  );
}

type Canal = { tipo: TipoCanal; nombre: string; dato: string; color: string; href: string };

function Canales({ canales }: { canales: Canal[] }) {
  return (
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
  );
}

function DatoPortada({ rotulo, valor, ancho }: { rotulo: string; valor: string; ancho: string }) {
  return (
    <View style={{ width: ancho, paddingRight: 10 }}>
      <Text style={{ fontSize: 8.5, color: "rgba(255,255,255,.65)" }}>{rotulo}</Text>
      <Text style={{ fontSize: 10.5, color: "#fff", marginTop: 5, lineHeight: 1.35 }}>{valor}</Text>
    </View>
  );
}

/** El título baja de tamaño con el largo: "Firma digital" y un pedido de tres
 *  partes tienen que entrar en el mismo lugar. */
const tamanoTitulo = (t: string) => (t.length > 70 ? 26 : t.length > 46 ? 31 : t.length > 26 ? 37 : 44);

/** Con `junta`, la sección entera va en una hoja: el título nunca queda solo al pie. */
function Seccion({ titulo, children, junta = false }: { titulo: string; children: React.ReactNode; junta?: boolean }) {
  return (
    <View style={{ marginTop: 22 }} wrap={!junta}>
      <Text style={s.subtitulo} minPresenceAhead={60}>
        {titulo}
      </Text>
      {children}
    </View>
  );
}

function Punto({ children, color = AZUL }: { children: React.ReactNode; color?: string }) {
  return (
    <View style={{ flexDirection: "row", marginBottom: 4 }} wrap={false}>
      <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: color, marginTop: 6.5, marginRight: 12 }} />
      <View style={{ flex: 1 }}>{children}</View>
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

/* ── El documento ─────────────────────────────────────────────────────────── */

function Documento({ d, origen }: { d: Relevamiento; origen: string }) {
  const servicio = d.servicio || SERVICIO_SIMPLE[d.areas[0]?.solucion] || d.areas[0]?.nombre || "";
  const titulo = d.titulo || [servicio, d.ubicacion].filter(Boolean).join(" · ") || "Tu caso";
  const tamano = tamanoTitulo(titulo);
  const fecha = fechaLarga(d.fecha);
  // Sólo lo que la persona dijo: lo que falta lo ve el equipo, no el cliente.
  const sabemos = (d.datosCotizacion ?? []).filter((x) => x.valor);
  const consulta = encodeURIComponent(`Hola, vengo del relevamiento ${d.referencia} (${d.empresa}).`);
  const canales: Canal[] = [
    { tipo: "whatsapp", nombre: "WhatsApp", dato: "+54 11 3300-1233", color: "#1fa855", href: `https://wa.me/${ORG.whatsapp}?text=${consulta}` },
    {
      tipo: "mail",
      nombre: "Escribinos un mail",
      dato: ORG.email,
      color: "#d14334",
      href: `mailto:${ORG.email}?subject=${encodeURIComponent(`Relevamiento ${d.referencia} — ${d.empresa}`)}`,
    },
    { tipo: "linkedin", nombre: "LinkedIn", dato: "Accedra S.A.", color: "#0a66c2", href: "https://www.linkedin.com/company/accedra-s.a." },
    { tipo: "web", nombre: "accedra.com.ar", dato: "Soluciones y casos", color: AZUL, href: SITE_URL },
  ];
  const hayLecturas = (d.lecturas?.length ?? 0) > 0 || Boolean(d.evento);

  return (
    <Document title={`Relevamiento preliminar — ${d.empresa}`} author={ORG.legalName} creator="Accedra" producer="Accedra">
      {/* ── Portada: logo, el cliente, lo que busca y cómo hablarnos ── */}
      <Page size="A4" style={{ backgroundColor: PAPEL, padding: 9, fontFamily: "Inter" }}>
        <View style={{ flex: 1, borderRadius: 14, overflow: "hidden", backgroundColor: NAVY, position: "relative" }}>
          {/* eslint-disable-next-line jsx-a11y/alt-text -- es el Image de react-pdf, no un <img>: no tiene alt. */}
          <Image
            src={`${origen}/relevamiento/portada.jpg`}
            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover" }}
          />
          <Svg style={{ position: "absolute", top: 0, left: 0 }} width="577" height="824" viewBox="0 0 577 824">
            <Defs>
              <LinearGradient id="portada" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor={NAVY} stopOpacity={0.55} />
                <Stop offset=".22" stopColor={NAVY} stopOpacity={0.12} />
                <Stop offset=".42" stopColor={NAVY} stopOpacity={0.88} />
                <Stop offset="1" stopColor={NAVY} stopOpacity={0.98} />
              </LinearGradient>
            </Defs>
            <Rect x="0" y="0" width="577" height="824" fill="url(#portada)" />
          </Svg>

          <View style={{ position: "absolute", top: 42, left: 42, right: 42, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <Wordmark ancho={134} color="#fff" />
            <Text style={{ fontSize: 8.5, color: "rgba(255,255,255,.6)" }}>{d.referencia}</Text>
          </View>

          <View style={{ position: "absolute", left: 42, right: 42, bottom: 48 }}>
            <Text style={{ fontSize: 10, letterSpacing: 0.9, color: CIELO, fontWeight: 600 }}>RELEVAMIENTO PRELIMINAR</Text>
            <Text
              style={{
                fontFamily: "Tight",
                fontWeight: 500,
                fontSize: tamano,
                color: "#fff",
                letterSpacing: -tamano * 0.04,
                lineHeight: 1.05,
                marginTop: 12,
              }}
            >
              {titulo}
            </Text>
            <Text style={{ fontFamily: "Tight", fontWeight: 500, fontSize: 19, color: "rgba(255,255,255,.9)", letterSpacing: -0.4, marginTop: 14 }}>
              Para {d.empresa}
            </Text>
            <Text style={{ fontSize: 10.5, color: "rgba(255,255,255,.78)", lineHeight: 1.6, marginTop: 12, maxWidth: 440 }}>{d.resumen}</Text>

            <View
              style={{
                flexDirection: "row",
                marginTop: 34,
                paddingTop: 18,
                borderTopWidth: 0.5,
                borderTopColor: "rgba(255,255,255,.28)",
              }}
            >
              <DatoPortada ancho="28%" rotulo="Cliente" valor={d.empresa} />
              <DatoPortada ancho="26%" rotulo="Ubicación" valor={d.ubicacion || "A confirmar"} />
              <DatoPortada ancho="24%" rotulo="Servicio" valor={servicio || "A definir"} />
              <DatoPortada ancho="22%" rotulo="Fecha" valor={fecha} />
            </View>

          </View>
        </View>
      </Page>

      {/* ── Interior blanco: lo que nos contaste, la primera lectura y el paso siguiente ── */}
      <Page size="A4" style={s.pagina}>
        <View style={s.cabeza} fixed>
          <Wordmark ancho={92} color={TINTA} />
          <Text style={s.chico}>Relevamiento preliminar · {d.referencia}</Text>
        </View>
        <View style={s.pie} fixed>
          <Text style={s.chico}>accedra.com.ar</Text>
          <Text
            style={s.chico}
            render={({ pageNumber, totalPages }) => `Página ${pageNumber - 1} de ${(totalPages ?? pageNumber) - 1}`}
          />
        </View>

        {/* La nota del equipo: lo que diría un especialista en persona. */}
        <Text style={{ fontSize: 12.5, color: TINTA2, lineHeight: 1.6, maxWidth: 450 }}>{d.nota}</Text>

        <Seccion titulo="Lo que nos contaste">
          <Text style={s.parrafo}>{d.situacion}</Text>
          {sabemos.length > 0 && (
            <View style={{ marginTop: 10, borderTopWidth: 0.5, borderTopColor: LINEA }}>
              {sabemos.map((x, i) => (
                <View key={i} style={{ flexDirection: "row", paddingVertical: 4, borderBottomWidth: 0.5, borderBottomColor: LINEA }} wrap={false}>
                  <Text style={{ width: 170, fontSize: 9.5, color: GRIS, paddingRight: 12, lineHeight: 1.45 }}>{x.dato}</Text>
                  <Text style={{ flex: 1, fontSize: 10, color: TINTA, lineHeight: 1.45 }}>{x.valor}</Text>
                </View>
              ))}
            </View>
          )}
        </Seccion>

        <Seccion titulo="Cómo lo vemos de entrada">
          {d.hallazgos.slice(0, 3).map((h, i) => (
            <Punto key={i}>
              <Text style={{ fontSize: 10.2, lineHeight: 1.55 }}>{h.texto}</Text>
            </Punto>
          ))}
          {/* Lo que haríamos, en palabras del cliente: el nombre de la línea
              ("Conectividad Crítica") es nuestro y no se entiende de afuera. */}
          {d.areas.map((a) => (
            <View
              key={a.solucion}
              style={{ marginTop: 10, padding: 14, backgroundColor: PAPEL, borderRadius: 10, borderLeftWidth: 3, borderLeftColor: a.accent }}
              wrap={false}
            >
              <Text style={{ fontSize: 8.5, color: GRIS, fontWeight: 600, letterSpacing: 0.6 }}>
                {`QUÉ HARÍAMOS · ${(SERVICIO_SIMPLE[a.solucion] ?? a.nombre).toUpperCase()}`}
              </Text>
              <Text style={{ fontSize: 10.5, color: TINTA, lineHeight: 1.55, marginTop: 5 }}>{a.propuesta}</Text>
              <Link src={`${SITE_URL}/soluciones/${a.solucion}`} style={[s.boton, { marginTop: 9 }]}>
                Ver cómo lo hacemos →
              </Link>
            </View>
          ))}
          <Text style={{ fontSize: 9, color: GRIS, marginTop: 8 }}>
            Es una primera lectura con lo que nos contaste: el especialista la confirma con vos.
          </Text>
        </Seccion>

        {d.casos.length > 0 && (
          <Seccion titulo={d.casos.length === 1 ? "Un caso parecido" : "Casos parecidos"} junta>
            {d.casos.map((c) => {
              const caso = tarjetaCaso(c.id);
              const logro = caso?.logro || c.cifra;
              return (
                <View
                  key={c.id}
                  style={{ flexDirection: "row", borderWidth: 0.5, borderColor: LINEA, borderRadius: 10, overflow: "hidden", marginBottom: 10 }}
                  wrap={false}
                >
                  {/* eslint-disable-next-line jsx-a11y/alt-text -- Image de react-pdf, sin alt. */}
                  {caso ? <Image src={`${origen}${caso.imagen}`} style={{ width: 130, objectFit: "cover" }} /> : null}
                  <View style={{ flex: 1, padding: 13 }}>
                    <Text style={s.eyebrow}>{c.cliente.toUpperCase()}</Text>
                    <Text style={{ fontFamily: "Tight", fontWeight: 500, fontSize: 14, color: TINTA, marginTop: 6, lineHeight: 1.25 }}>{c.titulo}</Text>
                    {logro ? <Text style={{ fontSize: 10, color: TINTA2, marginTop: 6, lineHeight: 1.5 }}>{logro}</Text> : null}
                    {caso ? (
                      <Link src={`${SITE_URL}${caso.href}`} style={[s.boton, { marginTop: 9 }]}>
                        Ver el caso completo →
                      </Link>
                    ) : null}
                  </View>
                </View>
              );
            })}
          </Seccion>
        )}

        {hayLecturas && (
          <Seccion titulo="Para leer sobre tu tema" junta>
            {(d.lecturas ?? []).map((l) => (
              <View key={l.slug} style={{ padding: 14, borderWidth: 0.5, borderColor: LINEA, borderRadius: 10, marginBottom: 8 }} wrap={false}>
                <Text style={s.eyebrow}>NOTA DE NUESTRO BLOG</Text>
                <Text style={{ fontFamily: "Tight", fontWeight: 500, fontSize: 13, color: TINTA, marginTop: 5, lineHeight: 1.3 }}>{l.titulo}</Text>
                {l.resumen ? <Text style={{ fontSize: 9.8, color: TINTA2, marginTop: 4, lineHeight: 1.5 }}>{l.resumen}</Text> : null}
                <Link src={`${SITE_URL}/blog/${l.slug}`} style={[s.boton, { marginTop: 9 }]}>
                  Leer la nota →
                </Link>
              </View>
            ))}
            {d.evento ? (
              <View style={{ padding: 14, borderWidth: 0.5, borderColor: LINEA, borderRadius: 10, marginBottom: 8 }} wrap={false}>
                <Text style={s.eyebrow}>{`PRÓXIMO EVENTO · ${d.evento.modalidad.toUpperCase()}`}</Text>
                <Text style={{ fontFamily: "Tight", fontWeight: 500, fontSize: 13, color: TINTA, marginTop: 5, lineHeight: 1.3 }}>{d.evento.titulo}</Text>
                <Text style={{ fontSize: 9.8, color: TINTA2, marginTop: 4 }}>{d.evento.fecha}</Text>
                <Link src={`${SITE_URL}/eventos/${d.evento.slug}`} style={[s.boton, { marginTop: 9 }]}>
                  Quiero ir →
                </Link>
              </View>
            ) : null}
          </Seccion>
        )}

        {/* ── Siguiente paso: hablar con alguien ── */}
        <View style={{ marginTop: 26 }} wrap={false}>
          <Text style={s.eyebrow}>SIGUIENTE PASO</Text>
          <Text style={{ fontFamily: "Tight", fontWeight: 500, fontSize: 22, color: TINTA, letterSpacing: -0.7, marginTop: 6, lineHeight: 1.15 }}>
            Hablemos de <Text style={{ color: AZUL }}>tu caso.</Text>
          </Text>
          <Text style={{ fontSize: 10.2, color: TINTA2, lineHeight: 1.55, marginTop: 6, marginBottom: 12, maxWidth: 470 }}>
            Un analista técnico de Accedra revisa este relevamiento y te contacta con el plan de acción adecuado para tu
            caso. Si hace falta, coordinamos una visita técnica. Escribinos por donde te quede más cómodo:
          </Text>
          <Canales canales={canales} />
          <Text style={{ fontSize: 8, color: GRIS, lineHeight: 1.5, marginTop: 9 }}>
            Relevamiento preliminar armado con lo que nos contaste en la conversación con el asistente de Accedra. No es un
            diagnóstico confirmado: las recomendaciones, el equipamiento y los plazos se validan con el especialista.
          </Text>
        </View>

        {/* ── Cierre: quiénes somos, breve, como la franja de la propuesta. Va al
            pie de la última hoja: si no entra con el resto, queda de contratapa. ── */}
        <View style={{ marginTop: "auto", paddingTop: 20 }} wrap={false}>
        <View style={{ borderRadius: 12, overflow: "hidden", backgroundColor: NAVY, position: "relative" }} wrap={false}>
          {/* eslint-disable-next-line jsx-a11y/alt-text -- Image de react-pdf, sin alt. */}
          <Image
            src={`${origen}/relevamiento/banda.jpg`}
            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover" }}
          />
          <View style={{ paddingHorizontal: 22, paddingVertical: 18 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <Wordmark ancho={104} color="#fff" />
              {/* eslint-disable-next-line jsx-a11y/alt-text -- Image de react-pdf, sin alt. */}
              <Image src={`${origen}/relevamiento/partners-blanco.png`} style={{ width: 250, height: 25, opacity: 0.9 }} />
            </View>
            <Text style={{ fontSize: 9.5, color: "rgba(255,255,255,.85)", lineHeight: 1.55, marginTop: 12, maxWidth: 440 }}>
              Desde {ORG.foundingYear} diseñamos, implementamos y damos soporte a la infraestructura tecnológica de empresas en
              todo el país: redes, seguridad, firma digital, datos y automatización, llave en mano.
            </Text>
            <View
              style={{
                flexDirection: "row",
                marginTop: 12,
                paddingTop: 10,
                borderTopWidth: 0.5,
                borderTopColor: "rgba(255,255,255,.25)",
              }}
            >
              {[
                ["17+", "años"],
                ["400+", "proyectos"],
                ["26+", "partners"],
                ["100+", "clientes"],
              ].map(([v, r]) => (
                <View key={r} style={{ flex: 1 }}>
                  <Text style={{ fontFamily: "Tight", fontWeight: 500, fontSize: 16, color: "#fff", letterSpacing: -0.5 }}>{v}</Text>
                  <Text style={{ fontSize: 8.5, color: "rgba(255,255,255,.7)" }}>{r}</Text>
                </View>
              ))}
              <View style={{ flex: 1.6 }}>
                <Text style={{ fontSize: 9.5, color: "#fff" }}>{ORG.phoneDisplay}</Text>
                <Text style={{ fontSize: 8.5, color: "rgba(255,255,255,.7)", marginTop: 2 }}>
                  {ORG.address.street}, CABA
                </Text>
              </View>
            </View>
          </View>
        </View>
        </View>
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
    titulo: t(d.titulo ?? ""),
    ubicacion: t(d.ubicacion ?? ""),
    servicio: t(d.servicio ?? ""),
    industria: t(d.industria),
    tamano: t(d.tamano),
    resumen: t(d.resumen),
    nota: t(d.nota ?? ""),
    situacion: t(d.situacion),
    hallazgos: d.hallazgos.map((h) => ({ ...h, texto: t(h.texto) })),
    areas: d.areas.map((a) => ({ ...a, nombre: t(a.nombre), porque: t(a.porque), propuesta: t(a.propuesta) })),
    casos: d.casos.map((c) => ({ ...c, cliente: t(c.cliente), titulo: t(c.titulo), cifra: t(c.cifra) })),
    proximosPasos: d.proximosPasos.map(t),
    datosCotizacion: d.datosCotizacion?.map((x) => ({ dato: t(x.dato), valor: t(x.valor) })),
    enfoques: d.enfoques?.map((e) => ({ titulo: t(e.titulo), detalle: t(e.detalle) })),
    lecturas: d.lecturas?.map((l) => ({ ...l, titulo: t(l.titulo), resumen: t(l.resumen) })),
    evento: d.evento ? { ...d.evento, titulo: t(d.evento.titulo) } : null,
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
