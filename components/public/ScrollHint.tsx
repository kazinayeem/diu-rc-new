"use client";

import { useEffect, useState } from "react";

export default function ScrollHint() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 80) setHidden(true);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20"
      style={{
        opacity: hidden ? 0 : 1,
        transform: `translateX(-50%) translateY(${hidden ? "12px" : "0px"})`,
        transition: "opacity 0.5s ease, transform 0.5s ease",
        animation: "scrollHintFadeIn 1.2s ease 1.8s both",
      }}
    >
      {/* Mouse shell */}
      <div className="relative w-6 h-10 rounded-full border-2 border-cyan-400/50 flex justify-center pt-1.5 overflow-hidden">
        {/* Glowing outline pulse */}
        <div
          className="absolute inset-0 rounded-full border-2 border-cyan-400/20"
          style={{ animation: "mousePulse 2s ease-in-out infinite" }}
        />
        {/* Scroll wheel dot */}
        <div
          className="w-1 h-1.5 rounded-full bg-cyan-400"
          style={{ animation: "scrollDot 1.8s ease-in-out infinite" }}
        />
      </div>

      {/* Label */}
      <span
        className="text-[10px] tracking-[0.25em] uppercase text-cyan-400/50 font-medium"
        style={{ animation: "scrollLabelBlink 1.8s ease-in-out infinite" }}
      >
        scroll
      </span>

      {/* Arrow chevrons */}
      <div className="flex flex-col items-center -mt-0.5 gap-0.5">
        {[0, 1, 2].map((i) => (
          <svg
            key={i}
            width="10"
            height="6"
            viewBox="0 0 10 6"
            fill="none"
            style={{
              animation: `chevronFade 1.8s ease-in-out ${i * 0.2}s infinite`,
            }}
          >
            <polyline
              points="1,1 5,5 9,1"
              stroke="rgb(34,211,238)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ))}
      </div>

      <style>{`
        @keyframes scrollHintFadeIn {
          from { opacity: 0; transform: translateX(-50%) translateY(16px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        @keyframes scrollDot {
          0%   { transform: translateY(0);    opacity: 1; }
          50%  { transform: translateY(10px); opacity: 0.3; }
          100% { transform: translateY(0);    opacity: 1; }
        }
        @keyframes mousePulse {
          0%, 100% { opacity: 0; transform: scale(1); }
          50%       { opacity: 1; transform: scale(1.15); }
        }
        @keyframes scrollLabelBlink {
          0%, 100% { opacity: 0.5; }
          50%       { opacity: 1; }
        }
        @keyframes chevronFade {
          0%   { opacity: 0.15; }
          50%  { opacity: 0.9; }
          100% { opacity: 0.15; }
        }
      `}</style>
    </div>
  );
}
