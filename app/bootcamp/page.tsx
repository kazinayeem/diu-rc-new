"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGetBootcampsQuery } from "@/lib/api/api";
import { motion } from "framer-motion";
import { Calendar, Users, MapPin, ChevronRight } from "lucide-react";

export default function BootcampPage() {
  const [page, setPage] = useState(1);
  const limit = 12;
  const [search, setSearch] = useState("");

  const { data: bootcampsData, isLoading } = useGetBootcampsQuery({
    query: `page=${page}&limit=${limit}&${search ? `search=${search}` : ""}`,
  });

  const bootcamps = bootcampsData?.data || [];
  const totalPages = bootcampsData?.pagination?.pages || 1;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0d1b2a] to-[#1a2f4a]">
      {/* HERO */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl sm:text-6xl font-bold mb-6 bg-gradient-to-r from-[#3DB5D8] via-[#3DB5D8] to-[#2F6BFF] bg-clip-text text-transparent">
              Bootcamps
            </h1>
            <p className="text-lg sm:text-xl text-[#8ED6E6]/80 max-w-2xl mx-auto">
              Immersive intensive training programs to accelerate your skills
            </p>
          </motion.div>
        </div>
      </section>

      {/* SEARCH */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 border-b border-[rgba(61,181,216,0.1)]">
        <div className="max-w-6xl mx-auto">
          <input
            type="text"
            placeholder="Search bootcamps..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full px-4 py-3 bg-[rgba(61,181,216,0.05)] border border-[rgba(61,181,216,0.2)] rounded-lg text-[#8ED6E6] placeholder-[#8ED6E6]/40 focus:outline-none focus:ring-2 focus:ring-[#3DB5D8]"
          />
        </div>
      </section>

      {/* CARDS GRID */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {isLoading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#3DB5D8]"></div>
              <p className="text-[#8ED6E6]/60 mt-4">Loading bootcamps...</p>
            </div>
          ) : bootcamps.length === 0 ? (
            <div className="text-center py-20 text-[#8ED6E6]/60">
              No bootcamps found
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {bootcamps.map((bootcamp: any) => (
                <motion.div key={bootcamp._id} variants={itemVariants}>
                  <Link href={`/bootcamp/${bootcamp.slug}`}>
                    <div className="group h-full bg-[rgba(11,31,58,0.8)] border border-[rgba(61,181,216,0.12)] rounded-xl overflow-hidden hover:border-[rgba(61,181,216,0.3)] transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-[#3DB5D8]/10">
                      {/* IMAGE */}
                      <div className="relative h-48 overflow-hidden bg-[rgba(61,181,216,0.05)]">
                        {bootcamp.image ? (
                          <Image
                            src={bootcamp.image}
                            alt={bootcamp.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                            onError={(e) => {
                              (e.target as any).src =
                                "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&q=80";
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-[#2F6BFF]/20 to-[#5B4BFF]/20 flex items-center justify-center">
                            <Users size={48} className="text-[#8ED6E6]/30" />
                          </div>
                        )}
                      </div>

                      {/* CONTENT */}
                      <div className="p-5 space-y-3">
                        {/* TITLE */}
                        <h3 className="font-semibold text-[#3DB5D8] group-hover:text-[#3DB5D8] line-clamp-2 transition-colors">
                          {bootcamp.title}
                        </h3>

                        {/* META INFO */}
                        <div className="space-y-2 text-sm text-[#8ED6E6]/70">
                          {bootcamp.eventDate && (
                            <div className="flex items-center gap-2">
                              <Calendar size={16} className="text-[#3DB5D8]" />
                              <span>
                                {new Date(bootcamp.eventDate).toLocaleDateString(
                                  "en-US",
                                  { month: "short", day: "numeric" }
                                )}
                              </span>
                            </div>
                          )}

                          {bootcamp.location && (
                            <div className="flex items-center gap-2">
                              <MapPin size={16} className="text-[#3DB5D8]" />
                              <span className="truncate">{bootcamp.location}</span>
                            </div>
                          )}
                        </div>

                        {/* HOST/GUEST */}
                        {bootcamp.host && bootcamp.host.length > 0 && (
                          <div className="pt-2 border-t border-[rgba(61,181,216,0.1)]">
                            <p className="text-xs text-[#8ED6E6]/60 mb-1">Host:</p>
                            <p className="text-xs text-[#3DB5D8]">
                              {Array.isArray(bootcamp.host)
                                ? bootcamp.host.slice(0, 2).join(", ")
                                : bootcamp.host}
                              {Array.isArray(bootcamp.host) && bootcamp.host.length > 2
                                ? ` +${bootcamp.host.length - 2}`
                                : ""}
                            </p>
                          </div>
                        )}

                        {/* STATUS BADGE */}
                        <div className="flex items-center justify-between pt-2">
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              bootcamp.status === "upcoming"
                                ? "bg-blue-500/20 text-blue-300"
                                : bootcamp.status === "ongoing"
                                ? "bg-green-500/20 text-green-300"
                                : "bg-gray-500/20 text-gray-300"
                            }`}
                          >
                            {bootcamp.status?.charAt(0).toUpperCase() +
                              bootcamp.status?.slice(1)}
                          </span>
                          <ChevronRight
                            size={16}
                            className="text-[#3DB5D8] group-hover:translate-x-1 transition-transform"
                          />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-4 mt-12">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-[rgba(61,181,216,0.1)] border border-[rgba(61,181,216,0.2)] rounded-lg text-[#3DB5D8] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[rgba(61,181,216,0.2)] transition-colors"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-[#8ED6E6]/80">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 bg-[rgba(61,181,216,0.1)] border border-[rgba(61,181,216,0.2)] rounded-lg text-[#3DB5D8] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[rgba(61,181,216,0.2)] transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
