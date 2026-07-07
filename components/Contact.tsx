"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, MapPin, Phone, Mail, MessageCircle, CheckCircle, ArrowUpRight } from "lucide-react";

const BLUE = "#2B6FD4";
const BLUE_RGB = "43,111,212";

const contactInfo = [
  { icon: MessageCircle, label: "WhatsApp", value: "Respuesta inmediata", href: "https://wa.link/78b9n9" },
  { icon: Phone, label: "(+54 11) 5365-9887", value: "Lun–Vie 9:00–18:00", href: "tel:+541153659887" },
  { icon: Mail, label: "info@accedra.com.ar", value: "Respuesta en 24hs", href: "mailto:info@accedra.com.ar" },
  { icon: MapPin, label: "Irala 1950, 2° piso · CABA", value: "Argentina", href: "#" },
];

const SERVICES = [
  { value: "networking", label: "Networking" },
  { value: "seguridad", label: "Seguridad IT" },
  { value: "biometrica", label: "Firma Biométrica" },
  { value: "consultoria", label: "Consultoría Microsoft" },
  { value: "otro", label: "Otro" },
];

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
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "", company: "", email: "", service: "", message: "",
  });

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
              Contacto
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-[42px] font-bold text-white leading-[1.1] mb-5">
              ¿Listo para transformar{" "}
              <span className="gradient-text">tu infraestructura IT?</span>
            </h2>
            <p className="text-gray-400 text-[15px] leading-relaxed mb-10 max-w-sm">
              Contanos tu desafío y un experto de Accedra te contacta en menos de 24 horas hábiles. Sin compromiso.
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
                      style={{ background: `rgba(${BLUE_RGB},0.12)`, border: `1px solid rgba(${BLUE_RGB},0.25)` }}
                    >
                      <Icon size={18} style={{ color: "#7FB3F8" }} />
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
              className="rounded-[26px] p-px h-full"
              style={{ background: `linear-gradient(150deg, rgba(${BLUE_RGB},0.5) 0%, rgba(255,255,255,0.06) 35%, rgba(255,255,255,0.03) 100%)` }}
            >
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
                      <h3 className="text-white font-bold text-2xl mb-1.5">Enviá tu consulta</h3>
                      <p className="text-gray-500 text-sm">Cuantos más datos nos des, mejor te podemos ayudar.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid sm:grid-cols-2 gap-5">
                        <Field label="Nombre">
                          <input type="text" required value={form.name}
                            onChange={(e) => set("name", e.target.value)}
                            placeholder="Juan García" className={fieldClass} />
                        </Field>
                        <Field label="Empresa">
                          <input type="text" required value={form.company}
                            onChange={(e) => set("company", e.target.value)}
                            placeholder="Mi Empresa S.A." className={fieldClass} />
                        </Field>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-5">
                        <Field label="Email corporativo">
                          <input type="email" required value={form.email}
                            onChange={(e) => set("email", e.target.value)}
                            placeholder="juan@empresa.com" className={fieldClass} />
                        </Field>
                        <Field label="Servicio de interés">
                          <select value={form.service} onChange={(e) => set("service", e.target.value)}
                            className={`${fieldClass} appearance-none cursor-pointer`}>
                            <option value="" className="bg-[#0A1221]">Seleccionar...</option>
                            {SERVICES.map((s) => (
                              <option key={s.value} value={s.value} className="bg-[#0A1221]">{s.label}</option>
                            ))}
                          </select>
                        </Field>
                      </div>

                      <Field label="¿En qué podemos ayudarte?">
                        <textarea required rows={3} value={form.message}
                          onChange={(e) => set("message", e.target.value)}
                          placeholder="Contanos tu proyecto o necesidad..."
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
                        {loading ? "Enviando..." : "Enviar consulta"}
                      </button>

                      <p className="text-center text-gray-600 text-xs">
                        Sin compromiso · Respondemos en menos de 24hs hábiles
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
                    <h3 className="text-white text-3xl font-bold mb-3">¡Mensaje enviado!</h3>
                    <p className="text-gray-400 text-base max-w-sm mx-auto">
                      Gracias por contactarnos. Un especialista de Accedra te escribirá en menos de 24 horas hábiles.
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
