"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin } from "lucide-react";
import { useT } from "@/lib/i18n/useT";
import { Reveal, RevealGroup, revealItem } from "@/components/Reveal";

// Destinos no traducibles, alineados POR ÍNDICE con footer.servicesItems y
// footer.companyItems del diccionario (mismo patrón que services.columns).
// Si se agrega o reordena un item en el diccionario, hay que tocar estos arrays.
const SERVICE_HREFS = [
  "/soluciones/networking",
  "/soluciones/seguridad",
  "/soluciones/firma-biometrica",
  "/soluciones/consultoria",
  "/soluciones/software-ai",
];
const COMPANY_HREFS = ["/#nosotros", "/#partners", "/#clientes", "/#contacto"];

export default function Footer() {
  const t = useT();
  const sections = [
    { title: t.footer.servicesTitle, items: t.footer.servicesItems, hrefs: SERVICE_HREFS },
    { title: t.footer.companyTitle, items: t.footer.companyItems, hrefs: COMPANY_HREFS },
  ];

  // Transparente y sin `border-t`: era el último bloque con fondo propio (navy-900
  // sobre un canvas navy-800) MÁS una línea de 1px a todo el ancho — o sea, un
  // escalón de color y una costura dibujada, las dos cosas que estamos sacando.
  // Apoya sobre el canvas de su página: navy-800 en el home, navy-900 en las
  // páginas de solución, seamless en ambos casos.
  return (
    <footer className="bg-transparent">
      <div className="container-x py-12 lg:py-16">
        <RevealGroup className="grid sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr] gap-10 lg:gap-16 mb-14" stagger={0.1}>
          {/* Brand — a `1.5fr` la marca queda ancha pero sin la columna hueca que
              dejaba el `col-span-2` sobre 4 columnas iguales. En tablet ocupa la
              fila completa y los dos bloques de links se reparten debajo. */}
          <motion.div variants={revealItem} className="sm:col-span-2 lg:col-span-1">
            <div className="mb-5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logos/accedra-outlined.svg" alt="Accedra" className="h-7 w-auto" />
              <span className="logo-sub block text-[11px] tracking-[0.25em] text-blue-400 uppercase mt-2">
                IT Solutions
              </span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs mb-6">
              {t.footer.tagline}
            </p>
            <div className="flex gap-3">
              <a
                href="https://www.linkedin.com/company/accedra-s.a."
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Accedra en LinkedIn"
                className="w-9 h-9 rounded-lg bg-white/5 hover:bg-blue-600/30 border border-white/10 hover:border-blue-500/40 flex items-center justify-center text-gray-400 hover:text-white transition-all"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
                  <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.22.79 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/accedra_sa/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Accedra en Instagram"
                className="w-9 h-9 rounded-lg bg-white/5 hover:bg-blue-600/30 border border-white/10 hover:border-blue-500/40 flex items-center justify-center text-gray-400 hover:text-white transition-all"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
                  <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41 1.27-.06 1.65-.07 4.85-.07zM12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63a5.9 5.9 0 0 0-2.12 1.38A5.9 5.9 0 0 0 .63 4.14C.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.31.79.72 1.46 1.38 2.12.66.66 1.33 1.07 2.12 1.38.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56.79-.31 1.46-.72 2.12-1.38.66-.66 1.07-1.33 1.38-2.12.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91a5.9 5.9 0 0 0-1.38-2.12A5.9 5.9 0 0 0 19.86.63c-.76-.3-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0zm0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.4-10.85a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z" />
                </svg>
              </a>
            </div>
          </motion.div>

          {/* Links */}
          {sections.map((section) => (
            <motion.div key={section.title} variants={revealItem}>
              <h4 className="text-white font-semibold text-sm mb-5 tracking-wide">{section.title}</h4>
              <ul className="space-y-1">
                {section.items.map((item, i) => (
                  <li key={item}>
                    {/* `py-2` sube el target táctil de ~20px a 36px; el `space-y`
                        del <ul> baja a 1 para que el alto visual no cambie. */}
                    <Link
                      href={section.hrefs[i] ?? "/"}
                      className="block py-2 text-gray-500 hover:text-gray-300 text-sm transition-colors"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </RevealGroup>

        {/* Contact info bar */}
        <Reveal as="div" y={16} blur={false} className="border-t border-white/10 pt-8 grid sm:grid-cols-3 gap-6 mb-8">
          <div className="flex items-center gap-3">
            <MapPin size={14} className="text-blue-400 flex-shrink-0" />
            <span className="text-gray-500 text-xs">Irala 1950, 2° piso · CABA, Argentina</span>
          </div>
          <div className="flex items-center gap-3">
            <Phone size={14} className="text-blue-400 flex-shrink-0" />
            <span className="text-gray-500 text-xs">(+54 11) 5365-9887</span>
          </div>
          <div className="flex items-center gap-3">
            <Mail size={14} className="text-blue-400 flex-shrink-0" />
            <span className="text-gray-500 text-xs">info@accedra.com.ar</span>
          </div>
        </Reveal>

        {/* Bottom */}
        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-gray-500 text-xs">
            © {new Date().getFullYear()} Accedra S.A. {t.footer.rights}
          </p>
          <div className="flex items-center gap-4">
            {/* Requisito para publicar en plataformas de anuncios cuando el sitio
                recolecta datos personales, además de la obligación de la Ley 25.326. */}
            <Link
              href="/privacidad"
              className="text-gray-500 hover:text-gray-300 text-xs transition-colors"
            >
              Política de Privacidad
            </Link>
            <span className="text-gray-500 text-xs">{t.footer.madeIn}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
