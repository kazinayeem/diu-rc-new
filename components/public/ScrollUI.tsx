"use client";

import { useEffect, useState, useCallback } from "react";
import { ArrowUp } from "lucide-react";

export default function ScrollUI() {
  const [scrollPct, setScrollPct] = useState(0);
  const [visible, setVisible] = useState(false);

  const onScroll = useCallback(() => {
    const el = document.documentElement;
    const scrolled = el.scrollTop || document.body.scrollTop;
    const total = el.scrollHeight - el.clientHeight;
    const pct = total > 0 ? (scrolled / total) * 100 : 0;
    setScrollPct(pct);
    setVisible(scrolled > 300);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [onScroll]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Circular progress ring
  const radius = 19;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scrollPct / 100) * circumference;

  return (
    <>
      {/* ── Scroll progress bar ─────────────────────────── */}
      <div className="fixed top-0 left-0 right-0 z-[9999] h-[3px] pointer-events-none">
        <div
          className="h-full origin-left"
          style={{
            width: `${scrollPct}%`,
            background: "linear-gradient(90deg, #22d3ee 0%, #3b82f6 50%, #22d3ee 100%)",
            transition: "width 80ms linear",
            boxShadow: "0 0 8px rgba(34,211,238,0.7)",
          }}
        />
      </div>

      {/* ── Scroll-to-top button ─────────────────────────── */}
      <button
        onClick={scrollToTop}
        aria-label="Scroll to top"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0) scale(1)" : "translateY(24px) scale(0.85)",
          pointerEvents: visible ? "auto" : "none",
          transition: "opacity 0.35s ease, transform 0.35s cubic-bezier(0.34,1.56,0.64,1)",
        }}
        className="fixed bottom-8 right-6 z-[9998] w-12 h-12 flex items-center justify-center rounded-full
          bg-[#0B1F3A]/80 backdrop-blur-md border border-cyan-500/30
          shadow-[0_4px_24px_rgba(6,182,212,0.15)]
          hover:border-cyan-400/60 hover:shadow-[0_4px_32px_rgba(6,182,212,0.35)]
          group"
      >
        {/* Circular progress ring */}
        <svg
          className="absolute inset-0 w-full h-full -rotate-90"
          viewBox="0 0 48 48"
          aria-hidden="true"
        >
          {/* Track */}
          <circle
            cx="24"
            cy="24"
            r={radius}
            fill="none"
            stroke="rgba(34,211,238,0.12)"
            strokeWidth="2.5"
          />
          {/* Filled arc */}
          <circle
            cx="24"
            cy="24"
            r={radius}
            fill="none"
            stroke="rgb(34,211,238)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: "stroke-dashoffset 120ms linear" }}
          />
        </svg>

        {/* Arrow icon */}
        <ArrowUp
          size={16}
          strokeWidth={2.5}
          className="relative z-10 text-cyan-400 group-hover:text-white transition-colors duration-200"
        />
      </button>
    </>
  );
}
