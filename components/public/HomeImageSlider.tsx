"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Slide = {
  imageUrl: string;
  order?: number;
  isVisible?: boolean;
};

export default function HomeImageSlider({ slides }: { slides?: Slide[] }) {
  const visibleSlides = useMemo(
    () =>
      (slides ?? [])
        .filter((slide) => slide?.isVisible !== false && slide?.imageUrl)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    [slides]
  );

  const [active, setActive] = useState(0);

  useEffect(() => {
    if (visibleSlides.length <= 1) return;
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % visibleSlides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [visibleSlides.length]);

  useEffect(() => {
    if (active >= visibleSlides.length) {
      setActive(0);
    }
  }, [active, visibleSlides.length]);

  if (!visibleSlides.length) return null;

  const currentSlide = visibleSlides[active];

  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="relative h-[220px] sm:h-[300px] md:h-[380px] lg:h-[460px] overflow-hidden rounded-2xl border border-white/10 bg-white/5">
          <AnimatePresence mode="wait">
            <motion.img
              key={`${currentSlide.imageUrl}-${active}`}
              src={currentSlide.imageUrl}
              alt={`Home slide ${active + 1}`}
              initial={{ opacity: 0.2, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0.2, scale: 1.03 }}
              transition={{ duration: 0.65, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </AnimatePresence>

          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A]/70 via-transparent to-transparent" />

          {visibleSlides.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-[#0B1F3A]/45 px-3 py-2 rounded-full border border-white/10 backdrop-blur">
              {visibleSlides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActive(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`h-2.5 rounded-full transition-all ${
                    active === idx ? "w-8 bg-cyan-300" : "w-2.5 bg-white/50 hover:bg-white/80"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
