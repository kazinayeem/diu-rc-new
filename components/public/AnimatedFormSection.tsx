"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface AnimatedFormSectionProps {
  children: ReactNode;
}

export default function AnimatedFormSection({
  children,
}: AnimatedFormSectionProps) {
  return (
    <section className="py-16 bg-transparent" id="join-form">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          {children}
        </motion.div>
      </div>
    </section>
  );
}
