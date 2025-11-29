"use client";

import React from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Cpu } from "lucide-react";

const RobotCanvas = dynamic(
  () => import("@/components/public/client-only/With3drobot"),
  { ssr: false }
);

const HeroWithRobot: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#071024] via-[#082135] to-[#0e2840] text-white">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#12324b 1px, transparent 1px), linear-gradient(90deg, #12324b 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-40">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* LEFT TEXT BLOCK */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full mb-6 border border-white/20">
              <Cpu size={18} className="text-cyan-300 animate-pulse" />
              <span className="text-sm font-medium text-cyan-200 tracking-wide">
                Robotics • Automation • AI
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 leading-tight text-cyan-100">
              DIU Robotics Club
            </h1>

            <p className="text-lg sm:text-xl text-cyan-200/90 max-w-xl mb-6">
              Empowering innovators at Daffodil International University through
              hands-on robotics, intelligent systems, and real-world
              competitions.
            </p>

            <p className="text-sm text-gray-300 max-w-xl mb-6">
              Welcome to the{" "}
              <span className="font-semibold text-cyan-300">
                Daffodil International University Robotics Club
              </span>
              . We are a vibrant community of students building robots,
              exploring electronics, and competing in national & global robotics
              events.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/events">
                <Button
                  size="lg"
                  className="group bg-cyan-500 hover:bg-cyan-400 text-black font-semibold shadow-lg shadow-cyan-500/30"
                >
                  Explore Events
                  <ArrowRight
                    className="ml-2 inline-block group-hover:translate-x-1 transition-transform"
                    size={20}
                  />
                </Button>
              </Link>

              <Link href="/members">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-cyan-300 text-cyan-300 hover:bg-cyan-300 hover:text-black transition"
                >
                  Meet Our Team
                </Button>
              </Link>
            </div>
          </div>

          {/* ROBOT CANVAS */}
          <div className="flex justify-center items-center w-full h-[500px] mt-10 lg:mt-0">
            <RobotCanvas />
          </div>
        </div>
      </div>

      {/* FIXED WAVE — moved DOWN and Z-index FIXED */}
      <div className="absolute -bottom-2 left-0 right-0 z-20">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <defs>
            <linearGradient id="waveGradient" gradientTransform="rotate(90)">
              <stop offset="0%" stopColor="#0e2840" />
              <stop offset="100%" stopColor="#071024" />
            </linearGradient>
          </defs>

          <path
            fill="url(#waveGradient)"
            d="M0,320L80,288C160,256,320,192,480,192C640,192,800,256,960,250.7C1120,245,1280,171,1360,133.3L1440,96L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
          />
        </svg>
      </div>
    </section>
  );
};

export default HeroWithRobot;
