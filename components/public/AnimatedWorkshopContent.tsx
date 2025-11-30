"use client";

import { motion } from "framer-motion";
import { Tag } from "lucide-react";

interface AnimatedWorkshopContentProps {
  workshop: any;
}

export default function AnimatedWorkshopContent({
  workshop,
}: AnimatedWorkshopContentProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="text-white"
    >
      <h2 className="text-3xl font-bold mb-4 text-white">
        About This Workshop
      </h2>

      {/* Content Section */}
      {workshop.content ? (
        <div
          className="prose prose-invert max-w-none text-white/70 leading-relaxed prose-headings:text-white prose-strong:text-white prose-h3:text-white"
          dangerouslySetInnerHTML={{ __html: workshop.content }}
        />
      ) : (
        <p className="text-white/70 leading-relaxed">{workshop.description}</p>
      )}

      {/* TAGS */}
      {workshop.tags && workshop.tags.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-3 text-white">Tags</h3>

          <div className="flex flex-wrap gap-2">
            {workshop.tags.map((tag: string, index: number) => (
              <span
                key={index}
                className="px-3 py-1.5 bg-white/10 border border-white/20 backdrop-blur-md text-white rounded-full text-sm flex items-center gap-1 shadow-sm"
              >
                <Tag size={14} className="text-blue-300" />
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
