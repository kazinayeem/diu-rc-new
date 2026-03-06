"use client";

import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";

interface FAQItem {
  q: string;
  a: string;
}

interface FAQAccordionProps {
  items: FAQItem[];
}

export default function FAQAccordion({ items }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={index}
            className={`rounded-xl border transition-all duration-200 overflow-hidden ${
              isOpen
                ? "border-cyan-500/40 bg-cyan-500/5"
                : "border-white/8 bg-white/3 hover:border-white/15 hover:bg-white/5"
            }`}
          >
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
            >
              <span className={`font-medium text-sm sm:text-base transition-colors ${
                isOpen ? "text-cyan-300" : "text-white/90"
              }`}>
                {item.q}
              </span>
              <span className={`flex-shrink-0 flex items-center justify-center h-7 w-7 rounded-full border transition-all duration-200 ${
                isOpen
                  ? "border-cyan-400/50 bg-cyan-500/20 text-cyan-400"
                  : "border-white/15 bg-white/5 text-white/50"
              }`}>
                {isOpen ? <Minus size={14} /> : <Plus size={14} />}
              </span>
            </button>

            <div
              className={`grid transition-all duration-300 ease-in-out ${
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <p className="px-6 pb-5 text-white/60 text-sm leading-relaxed">
                  {item.a}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
