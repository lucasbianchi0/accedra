import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AmbientLight from "@/components/AmbientLight";
import { ORG } from "@/lib/seo/site";

// Fecha de última revisión del texto. Se muestra al pie del documento y hay que
// actualizarla a mano cada vez que cambie lo que se recolecta — es lo que le da
// validez a la política frente a un reclamo.
const ULTIMA_ACTUALIZACION = "3 de agosto de 2026";

export const metadata: Metadata = {
  title: { absolute: `Política de Privacidad · ${ORG.shortName}` },
  description:
    "Qué datos personales recolecta Accedra a través de su sitio web, con qué finalidad, con quién se comparten y cómo ejercer tus derechos según la Ley 25.326.",
  alternates: { canonical: "/privacidad" },
  openGraph: {
    type: "website",
    url: "/privacidad",
    title: `Política de Privacidad · ${ORG.shortName}`,
    description:
      "Qué datos personales recolecta Accedra, con qué finalidad y cómo ejercer tus derechos.",
  },
};

function Section({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <section className="mb-11">
      <h2 className="text-white font-bold text-[21px] lg:text-[24px] leading-snug mb-4">
        <span className="text-accent mr-2.5">{n}.</span>
        {title}
      </h2>
      <div className="space-y-4 text-gray-400 text-[15px] leading-[1.75]">{children}</div>
    </section>
  );
}

/** Fila de la tabla de datos: qué se guarda, para qué y por cuánto tiempo. */
function DataRow({ dato, finalidad, plazo }: { dato: string; finalidad: string; plazo: string }) {
  return (
    <tr className="border-t border-white/10 align-top">
      <td className="py-3 pr-5 text-gray-200 font-medium">{dato}</td>
      <td className="py-3 pr-5">{finalidad}</td>
      <td className="py-3 whitespace-nowrap text-gray-500">{plazo}</td>
    </tr>
  );
}

export default function PrivacidadPage() {
  return (
    <main className="relative bg-navy-800 min-h-screen">
      <AmbientLight variant="solution" />
      <Navbar />

      <div className="relative z-10 container-x pt-32 lg:pt-40 pb-20 lg:pb-28">
        <div className="max-w-[760px]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-accent mb-4">
            Legales
          </p>
          <h1 className="text-[38px] md:text-[48px] font-bold text-white leading-[1.08] tracking-[-0.02em] mb-5">
            Política de Privacidad
          </h1>
          <p className="text-gray-300 text-lg leading-relaxed mb-14">
            Esta política explica qué datos personales recolecta {ORG.legalName} a través de{" "}
            <span className="text-gray-200">www.accedra.com.ar</span>, con qué finalidad los usa,
            con quién los comparte y cómo podés ejercer tus derechos.
          </p>

          <Section n="1" title="Quién es el responsable">
            <p>
              El responsable del tratamiento de los datos es <strong className="text-gray-200">{ORG.legalName}</strong>,
              con domicilio en {ORG.address.street}, {ORG.address.locality} ({ORG.address.postalCode}),
              Argentina.
            </p>
            <p>
              Para cualquier consulta sobre esta política o sobre tus datos, escribinos a{" "}
              <a href={`mailto:${ORG.email}`} className="text-accent hover:text-white transition-colors">
                {ORG.email}
              </a>
              .
            </p>
          </Section>

          <Section n="2" title="Qué datos recolectamos y para qué">
            <p>
              Solo recolectamos lo que necesitamos para responderte y para entender cómo se usa el
              sitio. No vendemos ni cedemos datos personales a terceros con fines comerciales.
            </p>

            <div className="overflow-x-auto -mx-1 px-1">
              <table className="w-full text-[14.5px] leading-relaxed min-w-[560px]">
                <thead>
                  <tr className="text-left text-[11px] uppercase tracking-wider text-gray-500">
                    <th className="pb-3 pr-5 font-semibold">Dato</th>
                    <th className="pb-3 pr-5 font-semibold">Finalidad</th>
                    <th className="pb-3 font-semibold">Conservación</th>
                  </tr>
                </thead>
                <tbody>
                  <DataRow
                    dato="Nombre, empresa y email"
                    finalidad="Responder tu consulta y dar seguimiento comercial. Los completás vos en el formulario de contacto."
                    plazo="5 años"
                  />
                  <DataRow
                    dato="Mensaje y servicio de interés"
                    finalidad="Entender qué necesitás y derivarte al equipo correcto."
                    plazo="5 años"
                  />
                  <DataRow
                    dato="Dirección IP y navegador"
                    finalidad="Seguridad: limitar envíos automatizados y abuso del formulario."
                    plazo="12 meses"
                  />
                  <DataRow
                    dato="Origen de la visita"
                    finalidad="Saber si llegaste desde un buscador, un anuncio o una red social, para medir qué canales funcionan. Incluye identificadores de campaña publicitaria."
                    plazo="24 meses"
                  />
                  <DataRow
                    dato="Páginas visitadas"
                    finalidad="Estadísticas agregadas de uso del sitio. No se asocian a una persona identificada."
                    plazo="18 meses"
                  />
                </tbody>
              </table>
            </div>

            <p>
              <strong className="text-gray-200">No recolectamos</strong> datos sensibles (salud,
              origen étnico, opiniones políticas o religiosas, datos biométricos de visitantes) ni
              datos de menores de edad. El sitio no está dirigido a menores.
            </p>
          </Section>

          <Section n="3" title="Cookies y analítica">
            <p>
              <strong className="text-gray-200">Este sitio no usa cookies publicitarias ni de
              seguimiento entre sitios.</strong>
            </p>
            <p>
              Para las estadísticas de uso empleamos una herramienta de analítica web alojada en
              nuestra propia infraestructura, que no instala cookies y no construye perfiles
              individuales: registra visitas de forma agregada y anónima.
            </p>
            <p>
              Usamos almacenamiento local del navegador (<em>localStorage</em>) únicamente para dos
              cosas: recordar el idioma que elegiste y conservar el origen de tu visita, de modo que
              si completás el formulario después de navegar varias páginas sepamos por qué canal
              llegaste. Esa información no se comparte con terceros y podés borrarla en cualquier
              momento desde la configuración de tu navegador.
            </p>
          </Section>

          <Section n="4" title="Publicidad">
            <p>
              Hacemos campañas publicitarias en plataformas de terceros. Si llegás al sitio desde un
              anuncio, la URL puede incluir un identificador del clic que nos permite saber qué
              campaña te trajo. Ese identificador se guarda junto con tu consulta si decidís
              contactarnos.
            </p>
            <p>
              Podemos informar a la plataforma publicitaria que una consulta se convirtió en cliente,
              para que sus sistemas optimicen a quién muestran nuestros anuncios. Esa información se
              transmite de forma que la plataforma no recibe tu mensaje ni el detalle de tu consulta.
            </p>
          </Section>

          <Section n="5" title="Con quién compartimos los datos">
            <p>
              No vendemos datos personales. Los compartimos únicamente con proveedores que nos
              prestan servicios y que están obligados contractualmente a protegerlos:
            </p>
            <ul className="space-y-2.5 mt-1">
              {[
                ["Alojamiento del sitio", "Infraestructura donde corre esta web."],
                ["Base de datos", "Donde se almacenan las consultas recibidas."],
                ["Envío de correo", "Para hacernos llegar tu consulta por email."],
                ["Plataforma publicitaria", "Solo para medir resultados de campañas, según lo descripto arriba."],
              ].map(([t, d]) => (
                <li key={t} className="flex gap-3">
                  <span className="mt-[9px] h-1 w-1 rounded-full bg-accent flex-shrink-0" />
                  <span>
                    <strong className="text-gray-200">{t}:</strong> {d}
                  </span>
                </li>
              ))}
            </ul>
            <p>
              Algunos de estos proveedores operan servidores fuera de la Argentina. En esos casos la
              transferencia se realiza al amparo de las cláusulas y garantías previstas por la
              normativa vigente en materia de transferencia internacional de datos.
            </p>
          </Section>

          <Section n="6" title="Tus derechos">
            <p>
              De acuerdo con la <strong className="text-gray-200">Ley 25.326 de Protección de los
              Datos Personales</strong>, tenés derecho a acceder a los datos que tenemos sobre vos,
              a rectificarlos si son inexactos, a actualizarlos y a solicitar su supresión.
            </p>
            <p>
              Para ejercerlos, escribinos a{" "}
              <a href={`mailto:${ORG.email}`} className="text-accent hover:text-white transition-colors">
                {ORG.email}
              </a>{" "}
              indicando qué querés hacer. Respondemos dentro de los plazos que fija la ley: diez días
              corridos para los pedidos de acceso y cinco días hábiles para los de rectificación,
              actualización o supresión.
            </p>
            <p className="text-gray-500 text-[14px] border-l-2 border-white/15 pl-4">
              La <strong className="text-gray-400">Agencia de Acceso a la Información Pública</strong>,
              en su carácter de órgano de control de la Ley 25.326, tiene la atribución de atender
              las denuncias y reclamos que interpongan quienes resulten afectados en sus derechos por
              incumplimiento de las normas vigentes en materia de protección de datos personales.
            </p>
          </Section>

          <Section n="7" title="Seguridad">
            <p>
              El sitio se sirve íntegramente sobre conexión cifrada (HTTPS). Las consultas recibidas
              se almacenan en una base de datos con acceso restringido, al que solo llegan sistemas
              del lado del servidor y personal autorizado de Accedra. Aplicamos controles para
              limitar envíos automatizados y detectar abusos del formulario.
            </p>
            <p>
              Ningún sistema es infalible: si detectáramos un incidente que afecte tus datos
              personales, actuaremos conforme a la normativa aplicable.
            </p>
          </Section>

          <Section n="8" title="Cambios en esta política">
            <p>
              Podemos actualizar esta política cuando cambie lo que recolectamos o cómo lo usamos. La
              versión vigente es siempre la publicada en esta página, con su fecha de última
              actualización al pie.
            </p>
          </Section>

          <div className="border-t border-white/10 pt-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <p className="text-gray-500 text-[13px]">
              Última actualización: {ULTIMA_ACTUALIZACION}
            </p>
            <Link
              href="/"
              className="text-accent hover:text-white text-[13px] font-semibold transition-colors"
            >
              ← Volver al inicio
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
