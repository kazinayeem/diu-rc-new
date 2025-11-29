"use client";

import { motion } from "framer-motion";
import { Target, Eye } from "lucide-react";

export default function AnimatedMissionVision() {
  return (
    <section className="py-16 bg-[#071024]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* MISSION CARD */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="h-full"
          >
            <div className="bg-white/10 backdrop-blur-md border border-white/20 shadow-xl rounded-2xl p-8 h-full flex flex-col">
              <div className="flex items-center mb-4">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  className="w-12 h-12 bg-cyan-600/20 border border-cyan-400/40 rounded-lg flex items-center justify-center mr-4"
                >
                  <Target className="text-cyan-300" size={26} />
                </motion.div>

                <h2 className="text-2xl font-bold text-white">Our Mission</h2>
              </div>

              <p className="text-cyan-100/80 leading-relaxed">
                To foster innovation and excellence in robotics and automation
                by providing a platform for students to learn, experiment, and
                create cutting-edge solutions that address real-world
                challenges.
              </p>
            </div>
          </motion.div>

          {/* VISION CARD */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="h-full"
          >
            <div className="bg-white/10 backdrop-blur-md border border-white/20 shadow-xl rounded-2xl p-8 h-full flex flex-col">
              <div className="flex items-center mb-4">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  className="w-12 h-12 bg-cyan-600/20 border border-cyan-400/40 rounded-lg flex items-center justify-center mr-4"
                >
                  <Eye className="text-cyan-300" size={26} />
                </motion.div>

                <h2 className="text-2xl font-bold text-white">Our Vision</h2>
              </div>

              <p className="text-cyan-100/80 leading-relaxed">
                To become a leading robotics club that produces innovative
                engineers and researchers who contribute significantly to
                robotics and automation technology in Bangladesh and beyond.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
