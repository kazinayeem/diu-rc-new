"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Linkedin } from "lucide-react";

type HallEntry = {
  _id: string;
  name: string;
  imageUrl: string;
  achievement: string;
  position: string;
  year: string;
  linkedinUrl?: string;
};

interface HallOfFameCarouselProps {
  entries: HallEntry[];
}

export default function HallOfFameCarousel({ entries }: HallOfFameCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState<"left" | "right">("right");

  const go = useCallback(
    (next: number) => {
      if (animating || entries.length <= 1) return;
      setAnimating(true);
      setDirection(next > current ? "right" : "left");
      setTimeout(() => {
        setCurrent(next);
        setAnimating(false);
      }, 350);
    },
    [animating, current, entries.length]
  );

  const prev = () => go(current === 0 ? entries.length - 1 : current - 1);
  const next = () => go(current === entries.length - 1 ? 0 : current + 1);

  useEffect(() => {
    if (entries.length <= 1) return;
    const id = setInterval(() => {
      go(current === entries.length - 1 ? 0 : current + 1);
    }, 5000);
    return () => clearInterval(id);
  }, [current, entries.length, go]);

  if (!entries || entries.length === 0) return null;

  const entry = entries[current];

  return (
    <div className="relative w-full flex flex-col items-center gap-8 px-12 sm:px-16 py-4">
      {/* Prev button */}
      <button
        onClick={prev}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-cyan-500/20 hover:bg-cyan-500/40 border border-cyan-400/30 text-cyan-300 hover:text-white shadow-lg transition-all duration-200 backdrop-blur"
        aria-label="Previous"
      >
        <ChevronLeft size={20} />
      </button>

      {/* Card */}
      <div
        style={{ transition: "opacity 350ms ease, transform 350ms ease" }}
        className={`w-full max-w-md ${
          animating
            ? direction === "right"
              ? "opacity-0 translate-x-10"
              : "opacity-0 -translate-x-10"
            : "opacity-100 translate-x-0"
        }`}
      >
        <div className="relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-8 flex flex-col items-center gap-5 shadow-2xl overflow-hidden">
          {/* Subtle glow behind avatar */}
          <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 h-40 w-40 rounded-full bg-cyan-400/10 blur-2xl" />

          {/* Circular photo */}
          <div className="relative h-28 w-28 rounded-full overflow-hidden border-4 border-cyan-400/60 shadow-lg shadow-cyan-400/20 z-10">
            {entry.imageUrl ? (
              <Image
                src={entry.imageUrl}
                alt={entry.name}
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="h-full w-full bg-white/5 flex items-center justify-center text-white/40 text-sm">
                No photo
              </div>
            )}
          </div>

          {/* Name */}
          <h3 className="text-white text-xl font-bold text-center leading-tight">
            {entry.name}
          </h3>

          {/* Achievement */}
          <p className="text-cyan-200/70 text-sm text-center leading-relaxed">
            {entry.achievement}
          </p>

          {/* Position + Year block */}
          <div className="w-full border-l-2 border-cyan-400/50 pl-4 py-1 space-y-1 bg-white/5 rounded-r-xl">
            <p className="text-white/80 text-sm">
              <span className="font-semibold text-cyan-300">Position:</span>{" "}
              {entry.position}
            </p>
            <p className="text-white/80 text-sm">
              <span className="font-semibold text-cyan-300">Year:</span>{" "}
              {entry.year}
            </p>
          </div>

          {/* LinkedIn button */}
          {entry.linkedinUrl ? (
            <a
              href={entry.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/30 text-cyan-300 hover:text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 shadow"
            >
              <Linkedin size={16} />
              LinkedIn Profile
            </a>
          ) : (
            <div className="h-10" />
          )}
        </div>
      </div>

      {/* Next button */}
      <button
        onClick={next}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-cyan-500/20 hover:bg-cyan-500/40 border border-cyan-400/30 text-cyan-300 hover:text-white shadow-lg transition-all duration-200 backdrop-blur"
        aria-label="Next"
      >
        <ChevronRight size={20} />
      </button>

      {/* Dot indicators */}
      {entries.length > 1 && (
        <div className="flex gap-2 mt-2">
          {entries.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === current
                  ? "w-6 bg-cyan-400"
                  : "w-2 bg-white/20 hover:bg-white/40"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
