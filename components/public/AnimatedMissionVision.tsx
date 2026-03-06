"use client";

import { motion } from "framer-motion";
import { Target, Eye, Lightbulb, Globe, FlaskConical, Users } from "lucide-react";

const missionPillars = [
  { icon: Lightbulb, label: "Foster Innovation", desc: "Hands-on labs, hackathons & real hardware builds" },
  { icon: FlaskConical, label: "Research-Driven", desc: "Faculty-mentored projects with publishable outcomes" },
  { icon: Users, label: "Inclusive Learning", desc: "Beginner to advanced tracks with peer mentorship" },
];

const visionPillars = [
  { icon: Globe, label: "National Impact", desc: "Lead robotics adoption across Bangladesh universities" },
  { icon: Target, label: "World-Class Engineers", desc: "Produce graduates competing at global stages" },
  { icon: Eye, label: "Open Innovation", desc: "Open-source contributions that benefit the wider community" },
];

export default function AnimatedMissionVision() {
  return (
    <section className="relative py-20 bg-[#0B1F3A] overflow-hidden">

      {/* Ambient glows */}
      <div className="pointer-events-none absolute inset-0 -z-0">
        <div className="absolute top-0 left-1/4 w-96 h-64 rounded-full bg-cyan-500/6 blur-[130px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-64 rounded-full bg-violet-500/6 blur-[130px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs font-semibold text-cyan-400 tracking-[0.14em] uppercase">
              Purpose &amp; Direction
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
            Why We{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400">
              Exist &amp; Where We&apos;re Going
            </span>
          </h2>
        </motion.div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-6">

          {/* MISSION */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="group relative rounded-2xl overflow-hidden"
            style={{
              background: "linear-gradient(145deg, #0D2248 0%, #0B1F3A 100%)",
              border: "1px solid rgba(34,211,238,0.2)",
            }}
          >
            {/* Top accent */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
            {/* Hover glow */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
              style={{ boxShadow: "inset 0 0 50px rgba(34,211,238,0.07)" }} />

            <div className="p-7 sm:p-8 flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center gap-4 mb-5">
                <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center flex-shrink-0"
                  style={{ boxShadow: "0 0 18px rgba(34,211,238,0.12)" }}>
                  <Target size={20} className="text-cyan-400" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-cyan-400/70 tracking-[0.15em] uppercase mb-0.5">01</p>
                  <h3 className="text-xl font-bold text-white">Our Mission</h3>
                </div>
              </div>

              {/* Body */}
              <p className="text-white/55 text-sm leading-relaxed mb-7">
                To foster innovation and excellence in robotics and automation by providing a platform for students
                to learn, experiment, and create cutting-edge solutions that address real-world challenges.
              </p>

              {/* Divider */}
              <div className="h-px w-full bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent mb-6" />

              {/* Pillars */}
              <div className="space-y-4 mt-auto">
                {missionPillars.map((p) => (
                  <div key={p.label} className="flex items-start gap-3">
                    <div className="mt-0.5 w-7 h-7 rounded-lg bg-cyan-500/8 border border-cyan-500/15 flex items-center justify-center flex-shrink-0">
                      <p.icon size={13} className="text-cyan-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white/85">{p.label}</p>
                      <p className="text-xs text-white/40 mt-0.5">{p.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* VISION */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="group relative rounded-2xl overflow-hidden"
            style={{
              background: "linear-gradient(145deg, #150A35 0%, #0B1F3A 100%)",
              border: "1px solid rgba(167,139,250,0.2)",
            }}
          >
            {/* Top accent */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-violet-400 to-transparent" />
            {/* Hover glow */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
              style={{ boxShadow: "inset 0 0 50px rgba(167,139,250,0.07)" }} />

            <div className="p-7 sm:p-8 flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center gap-4 mb-5">
                <div className="w-11 h-11 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center flex-shrink-0"
                  style={{ boxShadow: "0 0 18px rgba(167,139,250,0.12)" }}>
                  <Eye size={20} className="text-violet-400" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-violet-400/70 tracking-[0.15em] uppercase mb-0.5">02</p>
                  <h3 className="text-xl font-bold text-white">Our Vision</h3>
                </div>
              </div>

              {/* Body */}
              <p className="text-white/55 text-sm leading-relaxed mb-7">
                To become a leading robotics club that produces innovative engineers and researchers who
                contribute significantly to robotics and automation technology in Bangladesh and beyond.
              </p>

              {/* Divider */}
              <div className="h-px w-full bg-gradient-to-r from-transparent via-violet-500/20 to-transparent mb-6" />

              {/* Pillars */}
              <div className="space-y-4 mt-auto">
                {visionPillars.map((p) => (
                  <div key={p.label} className="flex items-start gap-3">
                    <div className="mt-0.5 w-7 h-7 rounded-lg bg-violet-500/8 border border-violet-500/15 flex items-center justify-center flex-shrink-0">
                      <p.icon size={13} className="text-violet-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white/85">{p.label}</p>
                      <p className="text-xs text-white/40 mt-0.5">{p.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
