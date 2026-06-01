"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, MapPin, Phone, Mail, MessageCircle, CheckCircle, ArrowUpRight } from "lucide-react";

const BLUE = "#2B6FD4";
const BLUE_RGB = "43,111,212";

const contactInfo = [
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: "Respuesta inmediata",
    href: "https://wa.link/78b9n9",
  },
  {
    icon: Phone,
    label: "(+54 11) 5365-9887",
    value: "Lun–Vie 9:00–18:00",
    href: "tel:+541153659887",
  },
  {
    icon: Mail,
    label: "info@accedra.com.ar",
    value: "Respuesta en 24hs",
    href: "mailto:info@accedra.com.ar",
  },
  {
    icon: MapPin,
    label: "Irala 1950, 2° piso · CABA",
    value: "Argentina",
    href: "#",
  },
];

const inputBase: React.CSSProperties = {
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.14)",
  transition: "border-color 0.2s, box-shadow 0.2s",
};

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", company: "", email: "", service: "", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setSent(true);
  };

  const focusBorder = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = `rgba(${BLUE_RGB},0.75)`;
    e.currentTarget.style.boxShadow = `0 0 0 3px rgba(${BLUE_RGB},0.12)`;
  };
  const blurBorder = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = "rgba(255,255,255,0.14)";
    e.currentTarget.style.boxShadow = "none";
  };

  return (
    <section id="contacto" className="relative py-20 lg:py-28 overflow-hidden bg-[#07101D]">
      {/* Ambient glows */}
      <div className="absolute top-0 right-0 w-[700px] h-[700px] pointer-events-none"
        style={{ background: `radial-gradient(circle at top right, rgba(${BLUE_RGB},0.13) 0%, transparent 60%)` }} />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] pointer-events-none"
        style={{ background: `radial-gradient(circle at bottom left, rgba(${BLUE_RGB},0.08) 0%, transparent 70%)` }} />

      {/* Dot grid */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(${BLUE_RGB},0.14) 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
          opacity: 0.4,
        }} />

      <div className="relative z-10 max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12">
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-start">

          {/* ── Left: info panel ── */}
          <motion.div
            initial={{ opacity: 0, x: -28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="lg:col-span-2 pt-2"
          >
            <span className="text-xs font-semibold tracking-[0.22em] uppercase text-blue-400 mb-5 block">
              Contacto
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-[1.1] mb-5">
              ¿Listo para transformar<br className="hidden lg:block" />{" "}
              <span className="gradient-text">tu infraestructura IT?</span>
            </h2>
            <p className="text-gray-400 text-[15px] leading-relaxed mb-10 max-w-sm">
              Contanos tu desafío y un experto de Accedra te contacta en menos de 24 horas.
            </p>

            <div className="w-10 h-px mb-10" style={{ background: `rgba(${BLUE_RGB},0.45)` }} />

            {/* Contact list — no bulky cards */}
            <div className="space-y-7">
              {contactInfo.map((m, i) => {
                const Icon = m.icon;
                return (
                  <a
                    key={i}
                    href={m.href}
                    target={m.href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 group"
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-110"
                      style={{ background: `rgba(${BLUE_RGB},0.12)`, border: `1px solid rgba(${BLUE_RGB},0.25)` }}
                    >
                      <Icon size={18} style={{ color: "#7FB3F8" }} />
                    </div>
                    <div>
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

          {/* ── Right: form ── */}
          <motion.div
            initial={{ opacity: 0, x: 28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="lg:col-span-3"
          >
            {!sent ? (
              <div
                className="rounded-3xl overflow-hidden"
                style={{
                  background: "#080F1E",
                  border: "1px solid rgba(255,255,255,0.09)",
                  boxShadow: `0 40px 80px rgba(0,0,0,0.35), 0 0 0 1px rgba(${BLUE_RGB},0.06)`,
                }}
              >
                {/* Blue top accent line */}
                <div
                  className="h-[2px] w-full"
                  style={{ background: `linear-gradient(to right, transparent 0%, rgba(${BLUE_RGB},0.9) 40%, rgba(${BLUE_RGB},0.9) 60%, transparent 100%)` }}
                />

                <div className="p-6 sm:p-9 md:p-12">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-10">
                    <div>
                      <h3 className="text-white font-bold text-2xl mb-1">Enviar consulta</h3>
                      <p className="text-gray-500 text-sm">Te respondemos en menos de 24 horas hábiles.</p>
                    </div>
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: `rgba(${BLUE_RGB},0.12)`, border: `1px solid rgba(${BLUE_RGB},0.2)` }}
                    >
                      <Send size={16} style={{ color: `rgba(${BLUE_RGB},0.9)` }} />
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="flex items-center gap-1.5 text-gray-400 text-xs font-semibold uppercase tracking-widest mb-2.5">
                          <span className="w-1 h-1 rounded-full bg-blue-500 inline-block" />
                          Nombre
                        </label>
                        <input
                          type="text" required value={form.name}
                          onChange={e => setForm({ ...form, name: e.target.value })}
                          placeholder="Juan García"
                          onFocus={focusBorder} onBlur={blurBorder}
                          className="w-full rounded-xl px-4 py-4 text-sm text-white outline-none placeholder:text-gray-600"
                          style={inputBase}
                        />
                      </div>
                      <div>
                        <label className="flex items-center gap-1.5 text-gray-400 text-xs font-semibold uppercase tracking-widest mb-2.5">
                          <span className="w-1 h-1 rounded-full bg-blue-500 inline-block" />
                          Empresa
                        </label>
                        <input
                          type="text" required value={form.company}
                          onChange={e => setForm({ ...form, company: e.target.value })}
                          placeholder="Mi Empresa S.A."
                          onFocus={focusBorder} onBlur={blurBorder}
                          className="w-full rounded-xl px-4 py-4 text-sm text-white outline-none placeholder:text-gray-600"
                          style={inputBase}
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="flex items-center gap-1.5 text-gray-400 text-xs font-semibold uppercase tracking-widest mb-2.5">
                          <span className="w-1 h-1 rounded-full bg-blue-500 inline-block" />
                          Email
                        </label>
                        <input
                          type="email" required value={form.email}
                          onChange={e => setForm({ ...form, email: e.target.value })}
                          placeholder="juan@empresa.com"
                          onFocus={focusBorder} onBlur={blurBorder}
                          className="w-full rounded-xl px-4 py-4 text-sm text-white outline-none placeholder:text-gray-600"
                          style={inputBase}
                        />
                      </div>
                      <div>
                        <label className="flex items-center gap-1.5 text-gray-400 text-xs font-semibold uppercase tracking-widest mb-2.5">
                          <span className="w-1 h-1 rounded-full bg-blue-500 inline-block" />
                          Servicio de interés
                        </label>
                        <select
                          value={form.service}
                          onChange={e => setForm({ ...form, service: e.target.value })}
                          onFocus={focusBorder} onBlur={blurBorder}
                          className="w-full rounded-xl px-4 py-4 text-sm text-white outline-none appearance-none cursor-pointer"
                          style={inputBase}
                        >
                          <option value="" className="bg-[#080F1E]">Seleccionar...</option>
                          <option value="networking" className="bg-[#080F1E]">Networking</option>
                          <option value="seguridad" className="bg-[#080F1E]">Seguridad IT</option>
                          <option value="biometrica" className="bg-[#080F1E]">Firma Biométrica</option>
                          <option value="consultoria" className="bg-[#080F1E]">Consultoría Microsoft</option>
                          <option value="otro" className="bg-[#080F1E]">Otro</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="flex items-center gap-1.5 text-gray-400 text-xs font-semibold uppercase tracking-widest mb-2.5">
                        <span className="w-1 h-1 rounded-full bg-blue-500 inline-block" />
                        ¿En qué podemos ayudarte?
                      </label>
                      <textarea
                        required rows={4} value={form.message}
                        onChange={e => setForm({ ...form, message: e.target.value })}
                        placeholder="Contanos tu proyecto o necesidad..."
                        onFocus={focusBorder} onBlur={blurBorder}
                        className="w-full rounded-xl px-4 py-4 text-sm text-white outline-none resize-none placeholder:text-gray-600"
                        style={inputBase}
                      />
                    </div>

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
                        : <Send size={15} />
                      }
                      {loading ? "Enviando..." : "Enviar consulta"}
                    </button>

                    <p className="text-center text-gray-600 text-xs">
                      Sin compromiso · Respondemos en menos de 24hs hábiles
                    </p>
                  </form>
                </div>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-3xl p-16 text-center"
                style={{ background: "#0D1A2D", border: "1px solid rgba(34,197,94,0.2)" }}
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
          </motion.div>
        </div>
      </div>
    </section>
  );
}
