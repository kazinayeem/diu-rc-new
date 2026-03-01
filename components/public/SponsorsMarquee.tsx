"use client";

import React from "react";

type Sponsor = {
  _id: string;
  name: string;
  logoUrl: string;
  websiteUrl?: string;
};

const FALLBACK = [
  { _id: "1", name: "Innovation Hub", logoUrl: "" },
  { _id: "2", name: "Tech Partner", logoUrl: "" },
  { _id: "3", name: "Research Lab", logoUrl: "" },
  { _id: "4", name: "Community Sponsor", logoUrl: "" },
  { _id: "5", name: "Global Partner", logoUrl: "" },
];

function SponsorCard({ s }: { s: Sponsor }) {
  const inner = (
    <div className="flex flex-col items-center gap-3 px-8 py-5 mx-3 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-cyan-500/30 transition-all duration-300 min-w-[140px] group cursor-pointer">
      {s.logoUrl ? (
        <div className="w-14 h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
          <img
            src={s.logoUrl}
            alt={s.name}
            className="w-full h-full object-contain p-1"
            onError={(e) => {
              const t = e.target as HTMLImageElement;
              t.style.display = "none";
              const parent = t.parentElement;
              if (parent) {
                parent.innerHTML = `<span class="text-cyan-400/60 text-xs font-bold">${s.name.slice(0, 2).toUpperCase()}</span>`;
              }
            }}
          />
        </div>
      ) : (
        <div className="w-14 h-14 rounded-xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center">
          <span className="text-cyan-400/80 text-sm font-bold">
            {s.name.slice(0, 2).toUpperCase()}
          </span>
        </div>
      )}
      <p className="text-sm font-medium text-white/70 group-hover:text-white transition-colors whitespace-nowrap">
        {s.name}
      </p>
    </div>
  );

  if (s.websiteUrl) {
    return (
      <a href={s.websiteUrl} target="_blank" rel="noopener noreferrer">
        {inner}
      </a>
    );
  }
  return <div>{inner}</div>;
}

export default function SponsorsMarquee({ sponsors }: { sponsors: Sponsor[] }) {
  const items = sponsors.length > 0 ? sponsors : FALLBACK;
  // Duplicate enough times to fill screen and loop seamlessly
  const repeated = [...items, ...items, ...items];

  return (
    <div className="sponsors-marquee relative w-full overflow-hidden">
      {/* Left fade */}
      <div className="pointer-events-none absolute left-0 top-0 h-full w-24 z-10 bg-gradient-to-r from-[#021825] to-transparent" />
      {/* Right fade */}
      <div className="pointer-events-none absolute right-0 top-0 h-full w-24 z-10 bg-gradient-to-l from-[#021825] to-transparent" />

      <div className="flex animate-marquee">
        {repeated.map((s, i) => (
          <SponsorCard key={`${s._id}-${i}`} s={s} />
        ))}
      </div>
    </div>
  );
}
