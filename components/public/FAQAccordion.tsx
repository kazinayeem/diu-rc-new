"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface FAQItem {
  q: string;
  a: string;
}

interface FAQAccordionProps {
  items: FAQItem[];
}

export default function FAQAccordion({ items }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={item.q}
            className="rounded-2xl border border-white/10 bg-white/5 p-6"
          >
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="w-full flex items-center justify-between text-left"
            >
              <span className="text-white font-semibold pr-4">{item.q}</span>
              <ChevronDown
                size={18}
                className={cn(
                  "text-cyan-200 transition-transform",
                  isOpen ? "rotate-180" : "rotate-0"
                )}
              />
            </button>
            <div
              className={cn(
                "grid transition-all duration-300",
                isOpen ? "grid-rows-[1fr] mt-3" : "grid-rows-[0fr] mt-0"
              )}
            >
              <div className="overflow-hidden">
                <p className="text-white/70 text-sm leading-relaxed">
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
