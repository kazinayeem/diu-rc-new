"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

type AchievementItem = {
  name: string;
  shortDescription: string;
  imageUrl: string;
  order?: number;
  isVisible?: boolean;
};

function AchievementSlideImage({ src, alt }: { src: string; alt: string }) {
  const [fitMode, setFitMode] = useState<"cover" | "contain">("cover");
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <div className="relative h-56 sm:h-64 md:h-full md:min-h-[340px] bg-gradient-to-br from-cyan-900/20 to-[#071024] flex items-center justify-center overflow-hidden">
      {!imageFailed ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={(e) => {
            const img = e.currentTarget;
            const width = img.naturalWidth;
            const height = img.naturalHeight;
            const ratio = width / Math.max(height, 1);
            const isVeryWide = ratio > 2.1;
            const isVeryTall = ratio < 0.65;
            const isSmallImage = width < 900 || height < 600;

            setFitMode(isVeryWide || isVeryTall || isSmallImage ? "contain" : "cover");
          }}
          onError={() => setImageFailed(true)}
          className={`w-full h-full transition-all duration-500 ${
            fitMode === "contain" ? "object-contain p-3" : "object-cover"
          }`}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-cyan-100/70 text-sm px-4 text-center">
          Image unavailable
        </div>
      )}
    </div>
  );
}

const fallbackAchievements: AchievementItem[] = [
  {
    name: "National Competition Winner",
    shortDescription: "Top performance in university robotics competitions.",
    imageUrl: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?q=80&w=1200&auto=format&fit=crop",
    order: 0,
    isVisible: true,
  },
  {
    name: "Growing Robotics Community",
    shortDescription: "Built an active learning ecosystem through workshops and mentorship.",
    imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop",
    order: 1,
    isVisible: true,
  },
  {
    name: "Project Showcases",
    shortDescription: "Delivered impactful robotics projects and demos throughout the year.",
    imageUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1200&auto=format&fit=crop",
    order: 2,
    isVisible: true,
  },
];

export default function AnimatedAchievements({
  achievements,
}: {
  achievements?: AchievementItem[];
}) {
  const items = useMemo(() => {
    const source = achievements?.length ? achievements : fallbackAchievements;
    return source
      .filter((item) => item?.isVisible !== false && item?.name && item?.shortDescription && item?.imageUrl)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [achievements]);

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (items.length <= 1) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % items.length);
    }, 4200);

    return () => clearInterval(interval);
  }, [items.length]);

  useEffect(() => {
    if (current >= items.length) setCurrent(0);
  }, [current, items.length]);

  if (!items.length) return null;

  return (
    <section className="py-16 bg-[#071024]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-cyan-200 mb-4">
            Our Achievements
          </h2>
          <p className="text-cyan-100/70 max-w-2xl mx-auto">
            Celebrating milestones that reflect our dedication and innovation.
          </p>
        </motion.div>

        <div className="relative overflow-hidden">
          <div
            className="flex transition-transform duration-700 ease-out"
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {items.map((item, index) => (
              <motion.div
                key={`${item.name}-${index}`}
                initial={{ opacity: 0.3, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="w-full flex-shrink-0"
              >
                <div className="max-w-4xl mx-auto rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl overflow-hidden min-h-[460px] md:min-h-[340px]">
                  <div className="grid md:grid-cols-2 h-full">
                    <AchievementSlideImage src={item.imageUrl} alt={item.name} />
                    <div className="p-6 md:p-8 flex flex-col justify-center min-h-[220px]">
                      <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                        {item.name}
                      </h3>
                      <p className="text-cyan-100/80 leading-relaxed">
                        {item.shortDescription}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {items.length > 1 && (
            <div className="mt-6 flex items-center justify-center gap-2">
              {items.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrent(idx)}
                  aria-label={`Go to achievement ${idx + 1}`}
                  className={`h-2.5 rounded-full transition-all ${
                    current === idx
                      ? "w-8 bg-cyan-300"
                      : "w-2.5 bg-white/40 hover:bg-white/70"
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
