'use client';

import { motion } from 'framer-motion';
import { Cpu, Zap, Code } from 'lucide-react';

export default function AnimatedWhatWeDo() {
  const items = [
    {
      icon: Cpu,
      title: 'Robotics Development',
      description:
        'Build and program robots for industrial automation, service robotics, and autonomous systems.',
      color: 'from-cyan-500 to-blue-600',
    },
    {
      icon: Zap,
      title: 'AI & Machine Learning',
      description:
        'Apply advanced AI models for computer vision, NLP, robotics perception, and predictive analytics.',
      color: 'from-yellow-500 to-orange-600',
    },
    {
      icon: Code,
      title: 'Software Development',
      description:
        'Create reliable software tools for robot control, simulation, automation, and real-time data processing.',
      color: 'from-green-500 to-emerald-600',
    },
  ];

  return (
    <section className="py-16 bg-[#071024]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* SECTION HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-cyan-200 mb-4">What We Do</h2>
          <p className="text-cyan-100/70 max-w-2xl mx-auto">
            Explore the world of robotics, automation, and next-gen intelligent systems
          </p>
        </motion.div>

        {/* CARDS */}
        <div className="grid md:grid-cols-3 gap-6">
          {items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -6 }}
              className="h-full"
            >
              {/* Glass Card */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 shadow-xl rounded-2xl p-6 h-full flex flex-col">

                {/* Icon */}
                <motion.div
                  className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center mb-4 shadow-lg`}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <item.icon className="text-white" size={34} />
                </motion.div>

                {/* Title */}
                <h3 className="text-xl font-bold text-white mb-2">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-cyan-100/80 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
