"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Calendar, MapPin, Clock, Users } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface AnimatedWorkshopHeroProps {
  workshop: any;
}

export default function AnimatedWorkshopHero({
  workshop,
}: AnimatedWorkshopHeroProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative bg-transparent text-white py-16"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-4"
            >
              {workshop.type?.toUpperCase() || "WORKSHOP"}
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-5xl font-bold mb-6"
            >
              {workshop.title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-primary-100 mb-6"
            >
              {workshop.description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-2 gap-4"
            >
              <div className="flex items-center space-x-2">
                <Calendar className="text-primary-200" size={20} />
                <div>
                  <p className="text-sm text-primary-200">Date</p>
                  <p className="font-semibold">
                    {formatDate(workshop.eventDate)}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="text-primary-200" size={20} />
                <div>
                  <p className="text-sm text-primary-200">Time</p>
                  <p className="font-semibold">{workshop.eventTime}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="text-primary-200" size={20} />
                <div>
                  <p className="text-sm text-primary-200">Location</p>
                  <p className="font-semibold">{workshop.location}</p>
                </div>
              </div>
              {workshop.registrationLimit && (
                <div className="flex items-center space-x-2">
                  <Users className="text-primary-200" size={20} />
                  <div>
                    <p className="text-sm text-primary-200">Spots</p>
                    <p className="font-semibold">
                      {workshop.spotsRemaining || 0} /{" "}
                      {workshop.registrationLimit}
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {workshop.image && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="relative h-64 md:h-96 rounded-xl overflow-hidden shadow-2xl"
            >
              <Image
                src={workshop.image}
                alt={workshop.title}
                fill
                className="object-cover"
              />
            </motion.div>
          )}
        </div>
      </div>
    </motion.section>
  );
}
