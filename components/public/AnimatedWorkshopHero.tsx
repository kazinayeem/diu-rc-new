"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Calendar, MapPin, Clock, Users } from "lucide-react";
import { formatDate } from "@/lib/utils";
import React from "react";

interface AnimatedWorkshopHeroProps {
  workshop: any;
}

export default function AnimatedWorkshopHero({
  workshop,
}: AnimatedWorkshopHeroProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative text-white py-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* LEFT CONTENT */}
          <div>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="inline-block px-4 py-1.5 bg-white/10 border border-white/20 backdrop-blur-sm rounded-full text-sm font-semibold tracking-wide mb-4"
            >
              {workshop.type?.toUpperCase() || "WORKSHOP"}
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="text-4xl md:text-5xl font-extrabold leading-tight mb-6"
            >
              {workshop.title}
            </motion.h1>

            {workshop.description && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
                className="text-lg md:text-xl text-white/70 leading-relaxed mb-8"
              >
                {workshop.description}
              </motion.p>
            )}

            {/* INFO GRID */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="grid grid-cols-2 gap-6"
            >
              <InfoItem
                icon={<Calendar size={20} className="text-blue-300" />}
                label="Date"
                value={formatDate(workshop.eventDate)}
              />

              <InfoItem
                icon={<Clock size={20} className="text-blue-300" />}
                label="Time"
                value={workshop.eventTime}
              />

              <InfoItem
                icon={<MapPin size={20} className="text-blue-300" />}
                label="Location"
                value={workshop.location}
              />

              {workshop.registrationLimit && (
                <InfoItem
                  icon={<Users size={20} className="text-blue-300" />}
                  label="Spots"
                  value={`${workshop.spotsRemaining || 0} / ${
                    workshop.registrationLimit
                  }`}
                />
              )}
            </motion.div>
          </div>

          {/* RIGHT IMAGE */}
          {workshop.image && (
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              className="relative h-64 md:h-96 rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)] border border-white/10"
            >
              <Image
                src={workshop.image}
                alt={workshop.title}
                fill
                priority
                className="object-cover rounded-2xl"
              />
            </motion.div>
          )}
        </div>
      </div>
    </motion.section>
  );
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      {icon}
      <div>
        <p className="text-sm text-white/50">{label}</p>
        <p className="font-semibold text-white">{value}</p>
      </div>
    </div>
  );
}
