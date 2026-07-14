"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, MapPin, Phone, Mail, CheckCircle, ArrowUpRight } from "lucide-react";
import { whatsappLink } from "@/lib/whatsapp";
import { useT } from "@/lib/i18n/useT";

const BLUE = "#2B6FD4";
const BLUE_RGB = "43,111,212";

// Official WhatsApp glyph
function WhatsAppIcon({ size = 18, style }: { size?: number; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" style={style} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

// Orden de los servicios en el <select>; las etiquetas salen del diccionario.
const SERVICE_VALUES = ["networking", "seguridad", "biometrica", "consultoria", "otro"] as const;

// Shared field styling
function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-gray-400 text-[11px] font-semibold uppercase tracking-[0.14em] mb-2">
        {label}
      </label>
      {children}
    </div>
  );
}

const fieldClass =
  "w-full rounded-xl px-4 py-3.5 text-sm text-white outline-none bg-white/[0.04] border border-white/10 transition-all duration-200 placeholder:text-gray-600 focus:border-blue-500/70 focus:bg-white/[0.06] focus:ring-4 focus:ring-blue-500/10";

export default function Contact() {
  const t = useT();
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "", company: "", email: "", service: "", message: "",
  });

  const contactInfo = [
    { icon: WhatsAppIcon, label: t.contact.whatsappLabel, value: t.contact.whatsappValue, href: whatsappLink(), rgb: "37,211,102", iconColor: "#ffffff", solid: true },
    { icon: Phone, label: "(+54 11) 5365-9887", value: t.contact.phoneValue, href: "tel:+541153659887", rgb: BLUE_RGB, iconColor: "#7FB3F8", solid: false },
    { icon: Mail, label: "info@accedra.com.ar", value: t.contact.emailValue, href: "mailto:info@accedra.com.ar", rgb: BLUE_RGB, iconColor: "#7FB3F8", solid: false },
    { icon: MapPin, label: "Irala 1950, 2° piso · CABA", value: t.contact.addressValue, href: "#", rgb: BLUE_RGB, iconColor: "#7FB3F8", solid: false },
  ];

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // TODO: conectar a route handler / CRM real (hoy es un placeholder)
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setSent(true);
  };

  return (
    <section id="contacto" className="relative py-20 lg:py-28 overflow-hidden">
      {/* Clean gradient base */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0D1A2D] via-[#0A1526] to-[#07101D]" />
      {/* Soft glows */}
      <div
        className="absolute top-0 right-0 w-[720px] h-[720px] pointer-events-none"
        style={{ background: `radial-gradient(circle at top right, rgba(${BLUE_RGB},0.14) 0%, transparent 58%)` }}
      />
      <div
        className="absolute -bottom-20 -left-20 w-[520px] h-[520px] pointer-events-none animate-float-slow"
        style={{ background: `radial-gradient(circle, rgba(${BLUE_RGB},0.08) 0%, transparent 70%)` }}
      />

      <div className="relative z-10 max-w-[1200px] mx-auto px-5 sm:px-8 lg:px-12">
        <div className="grid lg:grid-cols-5 gap-10 lg:gap-14 items-stretch">

          {/* ── Left: info panel ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2 flex flex-col"
          >
            <span className="text-xs font-semibold tracking-[0.22em] uppercase text-blue-400 mb-5 block">
              {t.contact.eyebrow}
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-[42px] font-bold text-white leading-[1.1] mb-5">
              {t.contact.titlePre}{" "}
              <span className="gradient-text">{t.contact.titleHighlight}</span>
            </h2>
            <p className="text-gray-400 text-[15px] leading-relaxed mb-10 max-w-sm">
              {t.contact.body}
            </p>

            <div className="space-y-3 mt-auto">
              {contactInfo.map((m, i) => {
                const Icon = m.icon;
                return (
                  <a
                    key={i}
                    href={m.href}
                    target={m.href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 group rounded-2xl p-3 -mx-3 hover:bg-white/[0.04] transition-colors"
                  >
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-105"
                      style={
                        m.solid
                          ? {
                              background: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)",
                              border: "1px solid rgba(37,211,102,0.5)",
                              boxShadow: "0 6px 18px rgba(37,211,102,0.35), inset 0 1px 0 rgba(255,255,255,0.25)",
                            }
                          : { background: `rgba(${m.rgb},0.12)`, border: `1px solid rgba(${m.rgb},0.25)` }
                      }
                    >
                      <Icon size={m.solid ? 20 : 18} style={{ color: m.iconColor }} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-white text-sm font-semibold group-hover:text-blue-300 transition-colors flex items-center gap-1">
                        {m.label}
                        <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-60 transition-opacity" />
                      </p>
                      <p className="text-gray-500 text-xs mt-0.5">{m.value}</p>
                    </div>
                  </a>
                );
              })}
            </div>
          </motion.div>

          {/* ── Right: form card ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="lg:col-span-3"
          >
            {/* Gradient border wrapper */}
            <div
              className="relative rounded-[26px] p-px h-full"
              style={{ background: `linear-gradient(150deg, rgba(${BLUE_RGB},0.5) 0%, rgba(255,255,255,0.06) 35%, rgba(255,255,255,0.03) 100%)` }}
            >
              {/* Premium "respuesta < 24hs" badge */}
              <div className="absolute -top-3.5 right-5 sm:right-8 z-20">
                <div
                  className="animate-badge-pulse flex items-center gap-2 pl-2.5 pr-3.5 py-1.5 rounded-full text-[11px] font-semibold text-white whitespace-nowrap"
                  style={{
                    background: "linear-gradient(135deg, rgba(34,197,94,0.24), rgba(10,18,33,0.92))",
                    border: "1px solid rgba(34,197,94,0.45)",
                    backdropFilter: "blur(10px)",
                    WebkitBackdropFilter: "blur(10px)",
                  }}
                >
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
                  </span>
                  {t.contact.badge}
                </div>
              </div>

              <div
                className="rounded-[25px] h-full p-6 sm:p-9 md:p-10"
                style={{
                  background: "rgba(10,18,33,0.85)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  boxShadow: "0 40px 90px rgba(0,0,0,0.4)",
                }}
              >
                {!sent ? (
                  <>
                    <div className="mb-8">
                      <h3 className="text-white font-bold text-2xl mb-1.5">{t.contact.formTitle}</h3>
                      <p className="text-gray-500 text-sm">{t.contact.formSubtitle}</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid sm:grid-cols-2 gap-5">
                        <Field label={t.contact.fieldName}>
                          <input type="text" required value={form.name}
                            onChange={(e) => set("name", e.target.value)}
                            placeholder={t.contact.placeholderName} className={fieldClass} />
                        </Field>
                        <Field label={t.contact.fieldCompany}>
                          <input type="text" required value={form.company}
                            onChange={(e) => set("company", e.target.value)}
                            placeholder={t.contact.placeholderCompany} className={fieldClass} />
                        </Field>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-5">
                        <Field label={t.contact.fieldEmail}>
                          <input type="email" required value={form.email}
                            onChange={(e) => set("email", e.target.value)}
                            placeholder={t.contact.placeholderEmail} className={fieldClass} />
                        </Field>
                        <Field label={t.contact.fieldService}>
                          <select value={form.service} onChange={(e) => set("service", e.target.value)}
                            className={`${fieldClass} appearance-none cursor-pointer`}>
                            <option value="" className="bg-[#0A1221]">{t.contact.selectDefault}</option>
                            {SERVICE_VALUES.map((v) => (
                              <option key={v} value={v} className="bg-[#0A1221]">{t.contact.serviceOptions[v]}</option>
                            ))}
                          </select>
                        </Field>
                      </div>

                      <Field label={t.contact.fieldMessage}>
                        <textarea required rows={3} value={form.message}
                          onChange={(e) => set("message", e.target.value)}
                          placeholder={t.contact.placeholderMessage}
                          className={`${fieldClass} resize-none`} />
                      </Field>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-3 py-4 rounded-xl text-white font-semibold text-[15px] transition-all duration-200 disabled:opacity-60 hover:brightness-110 active:scale-[0.99]"
                        style={{
                          background: `linear-gradient(135deg, #4f8ef7 0%, ${BLUE} 50%, #1a4fa0 100%)`,
                          boxShadow: `0 8px 32px rgba(${BLUE_RGB},0.4), inset 0 1px 0 rgba(255,255,255,0.15)`,
                        }}
                      >
                        {loading
                          ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          : <Send size={15} />}
                        {loading ? t.contact.submitting : t.contact.submit}
                      </button>

                      <p className="text-center text-gray-600 text-xs">
                        {t.contact.disclaimer}
                      </p>
                    </form>
                  </>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-16 text-center h-full flex flex-col justify-center"
                  >
                    <div
                      className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                      style={{ background: "rgba(34,197,94,0.10)", border: "1px solid rgba(34,197,94,0.3)" }}
                    >
                      <CheckCircle size={36} className="text-green-400" />
                    </div>
                    <h3 className="text-white text-3xl font-bold mb-3">{t.contact.successTitle}</h3>
                    <p className="text-gray-400 text-base max-w-sm mx-auto">
                      {t.contact.successBody}
                    </p>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
