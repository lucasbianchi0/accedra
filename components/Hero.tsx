"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useT } from "@/lib/i18n/useT";
import CountUp from "@/components/CountUp";

const stats = ["17+", "400+", "26+", "100+"];

const HERO_POSTER =
  "https://images.pexels.com/photos/4682189/pexels-photo-4682189.jpeg?auto=compress&cs=tinysrgb&w=1920";

export default function Hero() {
  const t = useT();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // En mobile no cargamos el video (ahorra datos y mejora LCP): solo el poster.
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.playbackRate = 0.75;
    const p = v.play();
    if (p !== undefined) p.catch(() => {});
  }, [isMobile]);

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      {/* Video background (with a static image fallback that always renders) */}
      <div className="absolute inset-0 z-0 bg-[#0D1A2D]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={HERO_POSTER}
          alt=""
          aria-hidden="true"
          className="hero-zoom absolute inset-0 w-full h-full object-cover"
        />
        {!isMobile && (
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={HERO_POSTER}
            onPlaying={() => setVideoPlaying(true)}
            className={`hero-zoom absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
              videoPlaying ? "opacity-100" : "opacity-0"
            }`}
          >
            <source
              src="https://videos.pexels.com/video-files/5028622/5028622-hd_1920_1080_25fps.mp4"
              type="video/mp4"
            />
          </video>
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0D1A2D]/95 via-[#0D1A2D]/80 to-[#0D1A2D]/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D1A2D] via-transparent to-[#0D1A2D]/30" />
      </div>

      {/* Blue glow orbs (decorativos — se ocultan en mobile por performance) */}
      <div className="hidden sm:block absolute top-1/3 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl z-1 pointer-events-none animate-float" />
      <div className="hidden sm:block absolute bottom-1/3 left-1/4 w-64 h-64 bg-blue-500/8 rounded-full blur-3xl z-1 pointer-events-none animate-float-slow" />

      {/* Content */}
      <div className="relative z-10 w-full px-8 lg:px-16 xl:px-24 pt-28 pb-20">
        <div className="max-w-3xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 badge-shimmer border border-blue-500/30 text-blue-300 text-xs font-semibold tracking-widest uppercase px-4 py-2 rounded-full mb-8"
          >
            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
            {t.hero.badge}
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.06 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.08] tracking-tight mb-6"
          >
            {t.hero.titlePre}<br className="hidden sm:block" />{" "}
            <span className="gradient-text">{t.hero.titleHighlight}</span>
            <br className="hidden sm:block" />{" "}
            {t.hero.titlePost}
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.14 }}
            className="text-lg md:text-xl text-gray-400 leading-relaxed mb-10 max-w-2xl"
          >
            {t.hero.subtitlePre}
            <span className="text-gray-200 font-medium">{t.hero.subtitleStrong}</span>.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.22 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <a
              href="#contacto"
              className="relative overflow-hidden shine inline-flex items-center justify-center gap-2 text-white font-semibold px-8 py-4 rounded-full transition-all duration-200 hover:-translate-y-0.5 hover:gap-3 group text-base"
              style={{ background: "#2B6FD4", boxShadow: "0 8px 28px rgba(43,111,212,0.35)" }}
            >
              {t.services.ctaButton}
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href="#servicios"
              className="inline-flex items-center justify-center gap-2 border border-white/20 hover:border-white/40 text-white font-semibold px-8 py-4 rounded-full transition-all duration-200 hover:bg-white/5 text-base"
            >
              {t.hero.ctaServices}
            </a>
          </motion.div>
        </div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.34 }}
          className="mt-16 lg:mt-20 max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10 rounded-2xl overflow-hidden border border-white/10"
        >
          {stats.map((s, i) => (
            <div
              key={i}
              className="bg-white/5 backdrop-blur-sm px-4 py-5 md:px-8 md:py-6 flex flex-col items-center text-center hover:bg-white/10 transition-colors"
            >
              <CountUp value={s} className="text-3xl md:text-4xl font-bold text-white mb-1" />
              <div className="text-xs text-gray-400 font-medium tracking-wide">{t.hero.stats[i]}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
