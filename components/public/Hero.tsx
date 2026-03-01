import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ArrowRight, Sparkles, Cpu, Zap } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative overflow-hidden min-h-[92vh] flex items-center">
      {/* Layered gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#021825] via-[#031d2e] to-[#0d1b3e]" />

      {/* Glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#4361EE]/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#3FB6D6]/15 rounded-full blur-[100px] animate-pulse [animation-delay:1.5s]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#3A0CA3]/10 rounded-full blur-[140px]" />

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(76,201,240,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(76,201,240,0.04)_1px,transparent_1px)] bg-[size:60px_60px]" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 w-full">
        <div className="text-center">
          {/* Badge */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-2 bg-[rgba(67,97,238,0.15)] border border-[rgba(76,201,240,0.2)] px-5 py-2.5 rounded-full backdrop-blur-sm">
              <Sparkles size={14} className="text-[#4CC9F0]" />
              <span className="text-sm font-semibold text-[#90E0EF] tracking-wide">
                Innovation Through Robotics
              </span>
              <Cpu size={14} className="text-[#4361EE]" />
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-6 leading-none tracking-tight">
            <span className="bg-gradient-to-r from-[#4CC9F0] via-[#3FB6D6] to-[#4361EE] bg-clip-text text-transparent">
              DIU Robotic
            </span>
            <br />
            <span className="text-white">Club</span>
          </h1>

          {/* Sub */}
          <p className="text-lg sm:text-xl text-[#90E0EF]/70 mb-10 max-w-2xl mx-auto leading-relaxed">
            Empowering the next generation of engineers and innovators through
            robotics, automation, and cutting-edge technology.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/events">
              <Button size="lg" variant="primary">
                Explore Events
                <ArrowRight size={18} />
              </Button>
            </Link>
            <Link href="/teams">
              <Button size="lg" variant="teal">
                <Zap size={16} />
                Meet Our Team
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-3 gap-8 max-w-lg mx-auto">
            {[['50+', 'Members'], ['30+', 'Projects'], ['20+', 'Events']].map(([n, l]) => (
              <div key={l} className="text-center">
                <div className="text-3xl font-black bg-gradient-to-r from-[#4CC9F0] to-[#4361EE] bg-clip-text text-transparent">{n}</div>
                <div className="text-xs text-[#90E0EF]/50 mt-1 uppercase tracking-widest">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#021825] to-transparent" />
    </section>
  );
};

export default Hero;
