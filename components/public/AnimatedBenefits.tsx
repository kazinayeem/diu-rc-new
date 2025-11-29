"use client";

import { motion } from "framer-motion";
import { Users, Target, Trophy, BookOpen } from "lucide-react";

export default function AnimatedBenefits() {
  const benefits = [
    {
      icon: Users,
      title: "Community",
      description:
        "Connect with passionate robotics enthusiasts, developers, and innovators.",
    },
    {
      icon: BookOpen,
      title: "Learning",
      description:
        "Access exclusive workshops, seminars, and hands-on robotics training.",
    },
    {
      icon: Target,
      title: "Projects",
      description:
        "Build real-world robotics and automation projects with expert guidance.",
    },
    {
      icon: Trophy,
      title: "Competitions",
      description:
        "Participate in national and international competitions and challenges.",
    },
  ];

  return (
    <section className="py-20 relative bg-transparent">
      {/* Background Glow Effects */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-600/20 blur-[160px]" />
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-600/20 blur-[160px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-extrabold text-white mb-3">
            Why Join Us?
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto text-lg">
            Unlock opportunities and grow your skills with DIU Robotics Club.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.2 + index * 0.1,
              }}
              viewport={{ once: true }}
              className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md text-center hover:border-blue-500/40 hover:shadow-lg hover:shadow-blue-600/10 transition-all group"
            >
              <div className="flex justify-center mb-4">
                <benefit.icon
                  size={42}
                  className="text-blue-400 group-hover:text-blue-300 transition"
                />
              </div>

              <h3 className="text-xl font-semibold text-white mb-2">
                {benefit.title}
              </h3>

              <p className="text-white/70 text-sm leading-relaxed">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
