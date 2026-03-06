"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function AnimatedSection({
  children,
  className = "",
  delay = 0,
}: AnimatedSectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

export function AnimatedCTA() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="py-16 bg-[#0B1F3A] text-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Ready to Join Us?
        </h2>
        <p className="text-xl text-white/60 mb-8 max-w-2xl mx-auto">
          Become part of a community that's shaping the future of robotics and
          automation
        </p>
        <a href="/join" className="inline-block">
          <button className="px-8 py-4 rounded-xl font-semibold text-lg text-white transition-all duration-300 hover:-translate-y-0.5"
            style={{
              background: "linear-gradient(135deg, #3DB5D8 0%, #2F6BFF 55%, #5B4BFF 100%)",
              boxShadow: "0 0 28px rgba(47,107,255,0.4), 0 0 60px rgba(91,75,255,0.15)"
            }}
          >
            Apply for Membership
          </button>
        </a>
      </div>
    </motion.section>
  );
}
