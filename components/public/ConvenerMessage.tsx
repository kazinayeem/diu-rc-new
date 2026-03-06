"use client";

import React from "react";
import Image from "next/image";
import { Mail, Phone, Quote, GraduationCap, Building2 } from "lucide-react";

export default function ConvenerMessage() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0B1F3A] via-[#0B1F3A] to-[#0B1F3A]" />
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#4cc9f0 1px, transparent 1px), linear-gradient(90deg, #4cc9f0 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      {/* Glow blobs */}
      <div className="pointer-events-none absolute -top-24 left-1/4 h-72 w-72 rounded-full bg-cyan-500/8 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-1/4 h-64 w-64 rounded-full bg-blue-500/8 blur-3xl" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section label */}
        <div className="flex items-center justify-center gap-3 mb-14">
          <div className="h-px flex-1 max-w-[80px] bg-gradient-to-r from-transparent to-cyan-500/50" />
          <span className="text-cyan-400 text-xs font-semibold tracking-[0.2em] uppercase">
            Message from Convener
          </span>
          <div className="h-px flex-1 max-w-[80px] bg-gradient-to-l from-transparent to-cyan-500/50" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16 items-start">

          {/* ── LEFT: Photo + Identity card ─────────────────────────── */}
          <div className="lg:col-span-2 flex flex-col items-center lg:items-start gap-6">

            {/* Photo */}
            <div className="relative group w-56 sm:w-64 lg:w-full max-w-[280px]">
              {/* Animated border ring */}
              <div className="absolute -inset-[3px] rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-cyan-400/0 opacity-60 group-hover:opacity-90 transition-opacity duration-500" />
              <div className="relative rounded-2xl overflow-hidden bg-[#0a1929]">
                <Image
                  src="https://diurc.vercel.app/hafizul_imran.jpg"
                  alt="Md. Hafizul Imran"
                  width={320}
                  height={380}
                  className="w-full h-auto object-cover"
                  unoptimized
                />
                {/* Bottom overlay */}
                <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#0B1F3A]/90 to-transparent" />
              </div>
            </div>

            {/* Identity card */}
            <div className="w-full max-w-[280px] rounded-2xl border border-white/8 bg-white/3 backdrop-blur p-5 space-y-4">
              <div>
                <h3 className="text-white text-xl font-bold leading-tight">Md. Hafizul Imran</h3>
                <div className="mt-2 space-y-1">
                  <div className="flex items-start gap-2 text-sm text-white/60">
                    <GraduationCap size={14} className="mt-0.5 text-cyan-400 flex-shrink-0" />
                    <span>Assistant Professor, Dept. of Software Engineering</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <Building2 size={14} className="mt-0.5 text-cyan-400 flex-shrink-0" />
                    <span className="text-cyan-300 font-semibold">Convener, Daffodil International University Robotics Club</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-white/8 pt-4 space-y-2.5">
                <a
                  href="mailto:hafizulimran.swe@diu.edu.bd"
                  className="flex items-center gap-3 text-white/60 hover:text-cyan-400 transition-colors text-sm group"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 border border-cyan-500/20 group-hover:bg-cyan-500/20 transition-colors flex-shrink-0">
                    <Mail size={14} className="text-cyan-400" />
                  </span>
                  <span className="truncate">hafizulimran.swe@diu.edu.bd</span>
                </a>
                <a
                  href="tel:01740064708"
                  className="flex items-center gap-3 text-white/60 hover:text-cyan-400 transition-colors text-sm group"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 border border-cyan-500/20 group-hover:bg-cyan-500/20 transition-colors flex-shrink-0">
                    <Phone size={14} className="text-cyan-400" />
                  </span>
                  <span>01740064708</span>
                </a>
              </div>
            </div>
          </div>

          {/* ── RIGHT: Message ───────────────────────────────────────── */}
          <div className="lg:col-span-3 flex flex-col justify-center gap-8">

            {/* Large decorative quote */}
            <Quote size={52} className="text-cyan-500/15 -mb-4" strokeWidth={1.5} />

            {/* Quote 1 */}
            <div className="relative pl-5 border-l-2 border-cyan-500/50">
              <p className="text-white/80 text-base sm:text-lg leading-relaxed">
                The Daffodil International University Robotics Club stands as a beacon of innovation and technological excellence at
                Daffodil International University. Our mission is to nurture the next generation of
                engineers, innovators, and problem-solvers who will shape the future of robotics and
                automation. Through hands-on projects, workshops, and collaborative research, we empower
                students to transform theoretical knowledge into practical solutions that address
                real-world challenges.
              </p>
            </div>

            {/* Quote 2 */}
            <div className="relative pl-5 border-l-2 border-blue-400/40">
              <p className="text-white/65 text-sm sm:text-base leading-relaxed">
                I am immensely proud of our students' achievements and their dedication to pushing the
                boundaries of what's possible in robotics. The club provides a platform where creativity
                meets technology, and where students can develop not just technical skills, but also
                leadership, teamwork, and innovative thinking.
              </p>
            </div>

            {/* Signature */}
            <div className="flex items-center gap-4 pt-2">
              <div className="space-y-1">
                <div className="flex gap-1.5">
                  <div className="h-1 w-10 rounded-full bg-cyan-400/70" />
                  <div className="h-1 w-6 rounded-full bg-blue-400/50" />
                  <div className="h-1 w-3 rounded-full bg-cyan-400/30" />
                </div>
                <p className="text-white/40 text-xs tracking-wide">— Md. Hafizul Imran, Convener</p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}

