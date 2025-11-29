"use client";

import { motion } from "framer-motion";
import { Trophy, Users, BookOpen } from "lucide-react";

export default function AnimatedAchievements() {
  const achievements = [
    { icon: Trophy, value: "15+", label: "Competitions Won", delay: 0 },
    { icon: Users, value: "100+", label: "Active Members", delay: 0.1 },
    { icon: BookOpen, value: "50+", label: "Projects Completed", delay: 0.2 },
  ];

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
            Celebrating milestones that reflect our dedication, talent, and
            innovation
          </p>
        </motion.div>

        {/* GRID */}
        <div className="grid md:grid-cols-3 gap-8">
          {achievements.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: item.delay }}
              whileHover={{ scale: 1.06 }}
            >
              {/* GLASS CARD */}
              <div className="p-8 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl text-center">
                {/* ICON ANIMATION */}
                <motion.div
                  animate={{ rotate: [0, 8, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                  className="mx-auto w-16 h-16 rounded-xl bg-cyan-600/20 border border-cyan-400/30 flex items-center justify-center shadow-lg mb-4"
                >
                  <item.icon size={40} className="text-cyan-300" />
                </motion.div>

                {/* VALUE */}
                <motion.h3
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: item.delay + 0.2 }}
                  className="text-3xl font-extrabold text-white mb-2"
                >
                  {item.value}
                </motion.h3>

                {/* LABEL */}
                <p className="text-cyan-100/80 tracking-wide">{item.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
