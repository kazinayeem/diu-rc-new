"use client";

import React from "react";
import Image from "next/image";
import { Mail, Phone } from "lucide-react";

export default function ConvenerMessage() {
  return (
    <section className="relative py-20 bg-gradient-to-br from-[#071024] via-[#082135] to-[#0e2840] overflow-hidden">
      {/* Background Grid */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            "linear-gradient(#12324b 1px, transparent 1px), linear-gradient(90deg, #12324b 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-2xl blur opacity-25"></div>
              <div className="relative rounded-2xl overflow-hidden border border-cyan-500/20 bg-black/50">
                <Image
                  src="https://diurc.vercel.app/hafizul_imran.jpg"
                  alt="Md. Hafizul Imran - Convener"
                  width={350}
                  height={400}
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6">
            <div>
              <h2 className="text-cyan-300 text-sm font-semibold tracking-widest uppercase mb-2">
                Message from Convener
              </h2>
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-1">
                Md. Hafizul Imran
              </h3>
              <p className="text-cyan-400 font-medium">
                Assistant Professor, Department of Software Engineering
              </p>
              <p className="text-cyan-300 font-semibold mt-1">Convener, DIU Robotics Club</p>
            </div>

            {/* Contact Info */}
            <div className="space-y-3 pt-4 border-t border-white/10">
              <a
                href="mailto:hafizulimran.swe@diu.edu.bd"
                className="flex items-center gap-3 text-white/80 hover:text-cyan-400 transition-colors group"
              >
                <Mail size={20} className="text-cyan-400 group-hover:scale-110 transition-transform" />
                <span>hafizulimran.swe@diu.edu.bd</span>
              </a>
              <a
                href="tel:01740064708"
                className="flex items-center gap-3 text-white/80 hover:text-cyan-400 transition-colors group"
              >
                <Phone size={20} className="text-cyan-400 group-hover:scale-110 transition-transform" />
                <span>01740064708</span>
              </a>
            </div>

            {/* Message */}
            <div className="pt-4">
              <p className="text-white/70 leading-relaxed text-justify">
                "The DIU Robotics Club stands as a beacon of innovation and technological excellence at Daffodil 
                International University. Our mission is to nurture the next generation of engineers, innovators, and 
                problem-solvers who will shape the future of robotics and automation. Through hands-on projects, 
                workshops, and collaborative research, we empower students to transform theoretical knowledge into 
                practical solutions that address real-world challenges."
              </p>

              <p className="text-white/70 leading-relaxed text-justify mt-4">
                "I am immensely proud of our students' achievements and their dedication to pushing the boundaries of 
                what's possible in robotics. The club provides a platform where creativity meets technology, and where 
                students can develop not just technical skills, but also leadership, teamwork, and innovative thinking."
              </p>
            </div>

            {/* Decorative Element */}
            <div className="pt-4 flex gap-2">
              <div className="w-12 h-1 bg-gradient-to-r from-cyan-500 to-transparent rounded-full"></div>
              <div className="w-8 h-1 bg-gradient-to-r from-blue-500 to-transparent rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
