import type { Metadata } from "next";
import Link from "next/link";
import { BadgeCheck, ShieldAlert } from "lucide-react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AmbientLight from "@/components/AmbientLight";
import { verificarCertificado } from "@/lib/eventos-server";

/**
 * Verificación de un certificado de asistencia.
 *
 * Es la dirección que va impresa al pie de cada certificado. Quien la abre suele
 * ser un área de RR. HH. que quiere saber si el papel es real: la respuesta
 * tiene que ser inequívoca en un vistazo —válido o no— y mostrar exactamente lo
 * que dice el papel para poder compararlo.
 *
 * No indexable: cada página es el dato de una persona, no contenido del sitio.
 * Dinámica: un certificado borrado tiene que dejar de verificar en el acto, no
 * al minuto.
 */

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Verificación de certificado",
  robots: { index: false, follow: false },
};

type Props = { params: Promise<{ codigo: string }> };

export default async function CertificadoPage({ params }: Props) {
  const { codigo } = await params;
  const c = await verificarCertificado(decodeURIComponent(codigo));

  return (
    <main className="relative min-h-screen bg-navy-800">
      <AmbientLight />
      <Navbar />
      <div className="relative z-10">
        <section className="container-x flex min-h-[80vh] items-center justify-center pb-20 pt-32">
          <div
            className="w-full max-w-xl overflow-hidden rounded-panel border border-white/[0.12]"
            style={{
              background: "linear-gradient(180deg, #1B2D49 0%, #13223A 50%, #0C1826 100%)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.14), 0 30px 80px rgba(0,0,0,0.55)",
            }}
          >
            {c ? (
              <>
                <div className="relative px-8 pb-8 pt-9" style={{ background: "linear-gradient(128deg, #0B2466 0%, #1640A0 45%, #2F79E0 100%)" }}>
                  <div className="flex items-center gap-3">
                    <BadgeCheck size={30} className="text-emerald-300" />
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#BBD5FB]">Certificado válido</p>
                      <p className="font-mono text-[14px] text-white">{c.codigo}</p>
                    </div>
                  </div>
                  <p className="mt-7 text-[14px] text-white/70">Accedra IT Solutions certifica que</p>
                  <h1 className="mt-1 text-[34px] font-semibold leading-tight text-white">{c.nombre}</h1>
                </div>
                <dl className="grid gap-5 px-8 py-8 text-[14.5px] sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/45">Asistió a</dt>
                    <dd className="mt-1 text-[17px] font-semibold text-white">{c.cursoTexto}</dd>
                  </div>
                  <div>
                    <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/45">Fecha</dt>
                    <dd className="mt-1 text-white">{c.fechaTexto}</dd>
                  </div>
                  <div>
                    <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/45">Carga horaria</dt>
                    <dd className="mt-1 text-white">
                      {c.horas.toLocaleString("es-AR", { maximumFractionDigits: 1 })} {c.horas === 1 ? "hora" : "horas"}
                    </dd>
                  </div>
                </dl>
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 px-8 py-5 text-[12.5px] text-white/55">
                  <span>Emitido por Accedra S.A. · CUIT 30-71158886-4</span>
                  {c.evento.publicado && c.evento.slug && (
                    <Link href={`/eventos?evento=${encodeURIComponent(c.evento.slug)}`} className="text-[#7FB3F8] hover:text-white">
                      Ver el evento →
                    </Link>
                  )}
                </div>
              </>
            ) : (
              <div className="px-8 py-12 text-center">
                <ShieldAlert size={36} className="mx-auto text-amber-300" />
                <h1 className="mt-5 text-[26px] font-semibold text-white">No encontramos ese certificado</h1>
                <p className="mx-auto mt-3 max-w-sm text-[15px] leading-relaxed text-[#9FB0C7]">
                  Revisá que el código <span className="font-mono text-white">{decodeURIComponent(codigo)}</span> esté escrito igual que en el papel. Si
                  sigue sin aparecer, escribinos a{" "}
                  <a href="mailto:info@accedra.com.ar" className="text-[#7FB3F8] hover:text-white">
                    info@accedra.com.ar
                  </a>
                  .
                </p>
              </div>
            )}
          </div>
        </section>
        <Footer />
      </div>
    </main>
  );
}
