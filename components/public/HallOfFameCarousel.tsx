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
      }, 280);
    },
    [animating, current, entries.length]
  );

  const prev = () => go(current === 0 ? entries.length - 1 : current - 1);
  const next = () => go(current === entries.length - 1 ? 0 : current + 1);

  // Auto-advance every 5 seconds
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
    <div className="relative flex items-center justify-center w-full px-16 py-4">
      {/* Prev button */}
      <button
        onClick={prev}
        className="absolute left-0 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-[#1a6a9a] hover:bg-[#1d7ab5] text-white shadow-lg transition"
        aria-label="Previous"
      >
        <ChevronLeft size={22} />
      </button>

      {/* Card */}
      <div
        className={`transition-all duration-280 ease-in-out w-full max-w-sm ${
          animating
            ? direction === "right"
              ? "opacity-0 translate-x-8"
              : "opacity-0 -translate-x-8"
            : "opacity-100 translate-x-0"
        }`}
      >
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 flex flex-col items-center gap-4">
          {/* Circular photo */}
          <div className="relative h-28 w-28 rounded-full overflow-hidden border-4 border-[#1a6a9a] shadow-md">
            {entry.imageUrl ? (
              <Image
                src={entry.imageUrl}
                alt={entry.name}
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="h-full w-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
                No photo
              </div>
            )}
          </div>

          {/* Name */}
          <h3 className="text-gray-900 text-xl font-bold text-center">{entry.name}</h3>

          {/* Achievement */}
          <p className="text-gray-500 text-sm text-center leading-relaxed">
            {entry.achievement}
          </p>

          {/* Position + Year block */}
          <div className="w-full border-l-2 border-[#1a6a9a] pl-4 py-1 space-y-1">
            <p className="text-gray-700 text-sm">
              <span className="font-semibold">Position:</span> {entry.position}
            </p>
            <p className="text-gray-700 text-sm">
              <span className="font-semibold">Year:</span> {entry.year}
            </p>
          </div>

          {/* LinkedIn button */}
          {entry.linkedinUrl ? (
            <a
              href={entry.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#1a6a9a] hover:bg-[#1d7ab5] text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition shadow"
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
        className="absolute right-0 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-[#1a6a9a] hover:bg-[#1d7ab5] text-white shadow-lg transition"
        aria-label="Next"
      >
        <ChevronRight size={22} />
      </button>

      {/* Dot indicators */}
      {entries.length > 1 && (
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {entries.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              className={`h-2 rounded-full transition-all ${
                i === current ? "w-6 bg-[#1a6a9a]" : "w-2 bg-gray-300"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
