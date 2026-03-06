"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronRight, ChevronDown, Users, Trophy, BookOpen } from "lucide-react";

const STATS = [
  { icon: Users, value: "900+", label: "Members" },
  { icon: Trophy, value: "30+", label: "Competitions" },
  { icon: BookOpen, value: "50+", label: "Projects" },
];

const HeroWithRobot: React.FC = () => {
  return (
    <section className="relative overflow-hidden min-h-[88vh] flex items-center">
      {/* Base background */}
      <div className="absolute inset-0 bg-[#0B1F3A]" />

      {/* Diagonal gradient sweep */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0D2050]/80 via-[#0B1F3A] to-[#150A35]/60" />

      {/* Subtle grid / circuit lines */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(61,181,216,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(61,181,216,0.04) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          opacity: 1,
        }}
      />

      {/* Glow orbs — cyan + purple */}
      <div className="absolute top-1/4 -left-24 w-[560px] h-[560px] rounded-full blur-[140px] pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(61,181,216,0.12) 0%, transparent 70%)" }} />
      <div className="absolute bottom-0 right-0 w-[450px] h-[450px] rounded-full blur-[120px] pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(91,75,255,0.12) 0%, transparent 70%)" }} />
      <div className="absolute top-10 right-1/3 w-[300px] h-[300px] rounded-full blur-[100px] pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(47,107,255,0.08) 0%, transparent 70%)" }} />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* ── LEFT ─────────────────────────────────── */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8"
              style={{
                background: "rgba(61,181,216,0.06)",
                border: "1px solid rgba(61,181,216,0.2)",
              }}>
              <span className="w-1.5 h-1.5 rounded-full bg-[#3DB5D8] animate-pulse" />
              <span className="text-xs font-semibold tracking-[0.15em] uppercase"
                style={{ color: "#3DB5D8" }}>
                Robotics · Automation · AI
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-black leading-[1.08] tracking-tight mb-6 text-white">
              Daffodil International<br />
              <span style={{
                background: "linear-gradient(135deg, #3DB5D8 0%, #2F6BFF 55%, #5B4BFF 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
                University Robotics
              </span>
              <br />Club
            </h1>

            {/* Sub */}
            <p className="text-base sm:text-lg text-white/50 max-w-lg leading-relaxed mb-10">
              Empowering the next generation of engineers and innovators through
              hands-on robotics, intelligent systems, and real-world competitions
              at Daffodil International University.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 mb-12">
              <Link
                href="/events"
                className="group inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-[15px] text-white transition-all duration-250"
                style={{
                  background: "linear-gradient(135deg, #3DB5D8 0%, #2F6BFF 55%, #5B4BFF 100%)",
                  boxShadow: "0 0 28px rgba(47,107,255,0.35), 0 0 60px rgba(91,75,255,0.12)",
                }}
                onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 0 40px rgba(47,107,255,0.55), 0 0 80px rgba(91,75,255,0.2)")}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 0 28px rgba(47,107,255,0.35), 0 0 60px rgba(91,75,255,0.12)")}
              >
                Explore Events
                <ArrowRight size={17} className="group-hover:translate-x-0.5 transition-transform duration-200" />
              </Link>
              <Link
                href="/join"
                className="group inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border bg-white/4 hover:bg-white/8 font-semibold text-[15px] text-white transition-all duration-200"
                style={{ borderColor: "rgba(61,181,216,0.2)" }}
              >
                Join the Club
                <ChevronRight size={17} className="text-white/40 group-hover:translate-x-0.5 transition-transform duration-200" />
              </Link>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-8">
              {STATS.map(({ icon: Icon, value, label }, i) => (
                <React.Fragment key={label}>
                  {i > 0 && <div className="w-px h-8 bg-white/10" />}
                  <div className="flex flex-col items-center lg:items-start">
                    <span className="text-xl font-black text-white">{value}</span>
                    <span className="text-xs text-white/40 font-medium tracking-wide">{label}</span>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* ── RIGHT: Image ─────────────────────────── */}
          <div className="hidden lg:flex justify-center items-center relative">
            <div className="absolute inset-0 rounded-full blur-3xl pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(47,107,255,0.12) 0%, rgba(91,75,255,0.08) 50%, transparent 70%)" }} />
            <div className="relative w-full h-[520px]">
              <Image
                src="/herosectionimage.png"
                alt="DIU Robotics Club"
                fill
                className="object-contain"
                style={{ filter: "drop-shadow(0 8px 60px rgba(47,107,255,0.25)) drop-shadow(0 0 30px rgba(61,181,216,0.15))" }}
                priority
              />
            </div>
          </div>

        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0B1F3A] to-transparent pointer-events-none" />

      {/* Scroll down button */}
      <button
        onClick={() => window.scrollBy({ top: window.innerHeight, behavior: "smooth" })}
        aria-label="Scroll down"
        className="absolute bottom-[100px] left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1.5 group"
        style={{ background: "none", border: "none", cursor: "pointer" }}
      >
        <span className="text-[10px] font-semibold tracking-[0.18em] uppercase"
          style={{ color: "rgba(61,181,216,0.5)" }}>
          Scroll
        </span>
        <span
          className="flex items-center justify-center w-9 h-9 rounded-full"
          style={{
            background: "rgba(61,181,216,0.07)",
            border: "1px solid rgba(61,181,216,0.2)",
            animation: "heroScrollBounce 1.6s ease-in-out infinite",
          }}
        >
          <ChevronDown size={18} style={{ color: "#3DB5D8" }} />
        </span>
        <style>{`
          @keyframes heroScrollBounce {
            0%, 100% { transform: translateY(0); opacity: 0.7; }
            50% { transform: translateY(6px); opacity: 1; }
          }
        `}</style>
      </button>
    </section>
  );
};

export default HeroWithRobot;
