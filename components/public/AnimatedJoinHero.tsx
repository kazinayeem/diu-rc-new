"use client";

import { motion } from "framer-motion";

export default function AnimatedJoinHero() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative py-24 px-6 text-white overflow-hidden"
    >
     
     
      <div className="max-w-5xl mx-auto text-center">
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="text-5xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-300"
        >
          Join DIU Robotic Club
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.7 }}
          className="mt-5 text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed"
        >
          Become a part of a community shaping the future of{" "}
          <span className="text-blue-300 font-semibold">
            robotics, AI, and automation.
          </span>
          <br />
          Innovate. Build. Compete. Inspire.
        </motion.p>

        {/* Call to Action Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-10"
        >
          <a
            href="#join-form"
            className="px-8 py-4 text-lg font-semibold bg-blue-600 hover:bg-blue-500 rounded-xl shadow-lg shadow-blue-600/20 transition-all"
          >
            Apply Now
          </a>
        </motion.div>
      </div>
    </motion.section>
  );
}
