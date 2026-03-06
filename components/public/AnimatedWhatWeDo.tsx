'use client';

import { motion } from 'framer-motion';
import { Cpu, Brain, Code2, FlaskConical, Wifi, BarChart3 } from 'lucide-react';

const items = [
  {
    icon: Cpu,
    title: 'Robotics Development',
    description:
      'Design, build, and program autonomous robots for industrial automation, service robotics, drone systems, and real-world competitions.',
    tags: ['Autonomous Systems', 'PID Control', 'ROS', 'Drones'],
    accent: '#22d3ee',       // cyan-400
    glow: 'rgba(34,211,238,0.15)',
    border: 'rgba(34,211,238,0.25)',
    iconBg: 'from-cyan-500 to-sky-600',
  },
  {
    icon: Brain,
    title: 'AI & Machine Learning',
    description:
      'Research and apply deep learning, computer vision, NLP, and reinforcement learning to solve real-world robotic perception challenges.',
    tags: ['Deep Learning', 'Computer Vision', 'NLP', 'PyTorch'],
    accent: '#a78bfa',       // violet-400
    glow: 'rgba(167,139,250,0.15)',
    border: 'rgba(167,139,250,0.25)',
    iconBg: 'from-violet-500 to-purple-700',
  },
  {
    icon: Wifi,
    title: 'IoT & Embedded Systems',
    description:
      'Prototype smart hardware with microcontrollers, sensors, and wireless protocols. Connect devices to the cloud with real-time data pipelines.',
    tags: ['Arduino', 'ESP32', 'MQTT', 'Edge Computing'],
    accent: '#34d399',       // emerald-400
    glow: 'rgba(52,211,153,0.15)',
    border: 'rgba(52,211,153,0.25)',
    iconBg: 'from-emerald-500 to-teal-600',
  },
  {
    icon: FlaskConical,
    title: 'Research & Development',
    description:
      'Conduct faculty-guided research in robotics, automation, and intelligent systems. Publish findings and contribute to open-source projects.',
    tags: ['Publications', 'Prototyping', 'Lab Access', 'Mentorship'],
    accent: '#fb923c',       // orange-400
    glow: 'rgba(251,146,60,0.15)',
    border: 'rgba(251,146,60,0.25)',
    iconBg: 'from-orange-500 to-red-600',
  },
  {
    icon: Code2,
    title: 'Software Development',
    description:
      'Build robust tools for robot control, simulation, real-time data processing, and full-stack automation dashboards.',
    tags: ['ROS', 'Python', 'Next.js', 'Simulation'],
    accent: '#60a5fa',       // blue-400
    glow: 'rgba(96,165,250,0.15)',
    border: 'rgba(96,165,250,0.25)',
    iconBg: 'from-blue-500 to-indigo-600',
  },
  {
    icon: BarChart3,
    title: 'Data Science & Analytics',
    description:
      'Harness robotics and sensor data using statistical models, predictive analytics, and visualization pipelines for smarter decisions.',
    tags: ['Pandas', 'Scikit-learn', 'Dashboards', 'Sensor Fusion'],
    accent: '#f472b6',       // pink-400
    glow: 'rgba(244,114,182,0.15)',
    border: 'rgba(244,114,182,0.25)',
    iconBg: 'from-pink-500 to-rose-600',
  },
];

export default function AnimatedWhatWeDo() {
  return (
    <section className="relative py-20 bg-[#0B1F3A] overflow-hidden">

      {/* Ambient glow blobs */}
      <div className="pointer-events-none absolute inset-0 -z-0">
        <div className="absolute top-10 left-[10%] w-80 h-80 rounded-full bg-cyan-500/8 blur-[120px]" />
        <div className="absolute bottom-10 right-[10%] w-80 h-80 rounded-full bg-violet-500/8 blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 bg-cyan-500/8 border border-cyan-500/15 px-4 py-1.5 rounded-full mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs font-semibold text-cyan-400 tracking-[0.14em] uppercase">
              Our Domains
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 leading-tight">
            What We{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              Research &amp; Build
            </span>
          </h2>
          <p className="text-white/50 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            From hardware to AI — we explore every layer of the intelligent systems stack through
            hands-on projects, research, and real competition experience.
          </p>
        </motion.div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: index * 0.08, duration: 0.5 }}
              whileHover={{ y: -5, transition: { duration: 0.22 } }}
              className="group relative rounded-2xl overflow-hidden"
              style={{
                background: `linear-gradient(145deg, #0D2248 0%, #0B1F3A 100%)`,
                border: `1px solid ${item.border}`,
                boxShadow: `0 0 0 0 ${item.glow}`,
              }}
            >
              {/* Top accent line */}
              <div
                className="absolute top-0 left-0 right-0 h-[2px]"
                style={{
                  background: `linear-gradient(90deg, transparent, ${item.accent}, transparent)`,
                }}
              />

              {/* Hover glow layer */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none rounded-2xl"
                style={{ boxShadow: `inset 0 0 40px ${item.glow}` }}
              />

              <div className="relative p-6 flex flex-col h-full">

                {/* Icon */}
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.iconBg} flex items-center justify-center mb-5 shadow-lg`}
                  style={{ boxShadow: `0 6px 20px ${item.glow}` }}
                >
                  <item.icon size={22} className="text-white" />
                </div>

                {/* Title */}
                <h3 className="text-base font-bold text-white mb-2 group-hover:text-white transition-colors">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-white/50 text-sm leading-relaxed mb-5 flex-1">
                  {item.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full border tracking-wide"
                      style={{
                        color: item.accent,
                        borderColor: item.border,
                        background: item.glow,
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
