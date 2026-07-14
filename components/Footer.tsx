"use client";

import { Mail, Phone, MapPin } from "lucide-react";
import { useT } from "@/lib/i18n/useT";

export default function Footer() {
  const t = useT();
  const sections = [
    { title: t.footer.servicesTitle, items: t.footer.servicesItems },
    { title: t.footer.companyTitle, items: t.footer.companyItems },
  ];

  return (
    <footer className="bg-[#07101D] border-t border-white/5">
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12 py-12 lg:py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-14">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="mb-5">
              <span className="logo-word text-2xl text-white tracking-widest">ACCEDRA</span>
              <span className="logo-sub block text-[10px] tracking-[0.25em] text-blue-400 uppercase mt-0.5">
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
                href="https://www.instagram.com/accedra"
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
          </div>

          {/* Links */}
          {sections.map((section) => (
            <div key={section.title}>
              <h4 className="text-white font-semibold text-sm mb-5 tracking-wide">{section.title}</h4>
              <ul className="space-y-3">
                {section.items.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact info bar */}
        <div className="border-t border-white/5 pt-8 grid sm:grid-cols-3 gap-6 mb-8">
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
        </div>

        {/* Bottom */}
        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-gray-600 text-xs">
            © {new Date().getFullYear()} Accedra S.A. {t.footer.rights}
          </p>
          <p className="text-gray-700 text-xs">
            {t.footer.madeIn}
          </p>
        </div>
      </div>
    </footer>
  );
}
