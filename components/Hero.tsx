"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";

const stats = [
  { value: "15", suffix: "+", label: "Años de experiencia" },
  { value: "400", suffix: "+", label: "Proyectos entregados" },
  { value: "12", suffix: "+", label: "Partners tecnológicos" },
  { value: "100", suffix: "+", label: "Clientes activos" },
];

function Counter({ value, suffix }: { value: string; suffix: string }) {
  const [count, setCount] = useState(0);
  const target = parseInt(value);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          let start = 0;
          const duration = 2000;
          const step = Math.ceil(target / (duration / 16));
          const timer = setInterval(() => {
            start += step;
            if (start >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(start);
            }
          }, 16);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.75;
    }
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      {/* Video background */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          poster="https://images.pexels.com/photos/4682189/pexels-photo-4682189.jpeg?auto=compress&cs=tinysrgb&w=1920"
          className="w-full h-full object-cover"
        >
          <source
            src="https://videos.pexels.com/video-files/5028622/5028622-hd_1920_1080_25fps.mp4"
            type="video/mp4"
          />
        </video>
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0D1A2D]/95 via-[#0D1A2D]/80 to-[#0D1A2D]/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D1A2D] via-transparent to-[#0D1A2D]/30" />
      </div>

      {/* Blue glow orb */}
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl z-1 pointer-events-none" />
      <div className="absolute bottom-1/3 left-1/4 w-64 h-64 bg-blue-500/8 rounded-full blur-3xl z-1 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 w-full px-8 lg:px-16 xl:px-24 pt-28 pb-20">
        <div className="max-w-3xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 badge-shimmer border border-blue-500/30 text-blue-300 text-xs font-semibold tracking-widest uppercase px-4 py-2 rounded-full mb-8"
          >
            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
            15 años liderando la transformación IT en Argentina
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.08] tracking-tight mb-6"
          >
            Infraestructura IT<br className="hidden sm:block" />{" "}
            <span className="gradient-text">para empresas</span>
            <br className="hidden sm:block" />{" "}
            que lideran.
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-lg md:text-xl text-gray-400 leading-relaxed mb-10 max-w-2xl"
          >
            Integramos las mejores tecnologías del mundo —{" "}
            <span className="text-gray-200 font-medium">Cisco, Microsoft, Palo Alto, Dell EMC</span> —
            para que tu empresa opere con la infraestructura que merece.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <a
              href="#contacto"
              className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-4 rounded-full transition-all duration-200 hover:shadow-xl hover:shadow-blue-500/30 group text-base"
            >
              Hablar con un experto
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#servicios"
              className="inline-flex items-center justify-center gap-2 border border-white/20 hover:border-white/40 text-white font-semibold px-8 py-4 rounded-full transition-all duration-200 hover:bg-white/5 text-base"
            >
              Ver servicios
            </a>
          </motion.div>
        </div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55 }}
          className="mt-16 lg:mt-20 max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10 rounded-2xl overflow-hidden border border-white/10"
        >
          {stats.map((s, i) => (
            <div
              key={i}
              className="bg-white/5 backdrop-blur-sm px-4 py-5 md:px-8 md:py-6 flex flex-col items-center text-center hover:bg-white/10 transition-colors"
            >
              <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                <Counter value={s.value} suffix={s.suffix} />
              </div>
              <div className="text-xs text-gray-400 font-medium tracking-wide">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 text-gray-500"
      >
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <ChevronDown size={16} />
        </motion.div>
      </motion.div>
    </section>
  );
}
