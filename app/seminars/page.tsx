"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGetSeminarsQuery } from "@/lib/api/api";
import { motion } from "framer-motion";
import { Calendar, Users, MapPin, ChevronRight } from "lucide-react";

export default function SeminarsPage() {
  const [page, setPage] = useState(1);
  const limit = 12;
  const [search, setSearch] = useState("");

  const { data: seminarsData, isLoading } = useGetSeminarsQuery({
    query: `page=${page}&limit=${limit}&${search ? `search=${search}` : ""}`,
  });

  const seminars = seminarsData?.data?.data || [];
  const totalPages = seminarsData?.data?.pages || 1;

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
            <h1 className="text-5xl sm:text-6xl font-bold mb-6 bg-gradient-to-r from-[#4CC9F0] via-[#00E5FF] to-[#4361EE] bg-clip-text text-transparent">
              Seminars
            </h1>
            <p className="text-lg sm:text-xl text-[#90E0EF]/80 max-w-2xl mx-auto">
              Join expert-led seminars and panel discussions on cutting-edge technologies
            </p>
          </motion.div>
        </div>
      </section>

      {/* SEARCH */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 border-b border-[rgba(76,201,240,0.1)]">
        <div className="max-w-6xl mx-auto">
          <input
            type="text"
            placeholder="Search seminars..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full px-4 py-3 bg-[rgba(76,201,240,0.05)] border border-[rgba(76,201,240,0.2)] rounded-lg text-[#90E0EF] placeholder-[#90E0EF]/40 focus:outline-none focus:ring-2 focus:ring-[#4CC9F0]"
          />
        </div>
      </section>

      {/* CARDS GRID */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {isLoading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#4CC9F0]"></div>
              <p className="text-[#90E0EF]/60 mt-4">Loading seminars...</p>
            </div>
          ) : seminars.length === 0 ? (
            <div className="text-center py-20 text-[#90E0EF]/60">
              No seminars found
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {seminars.map((seminar: any) => (
                <motion.div key={seminar._id} variants={itemVariants}>
                  <Link href={`/seminars/${seminar.slug}`}>
                    <div className="group h-full bg-[rgba(2,29,46,0.8)] border border-[rgba(76,201,240,0.12)] rounded-xl overflow-hidden hover:border-[rgba(76,201,240,0.3)] transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-[#4CC9F0]/10">
                      {/* IMAGE */}
                      <div className="relative h-48 overflow-hidden bg-[rgba(76,201,240,0.05)]">
                        {seminar.image ? (
                          <Image
                            src={seminar.image}
                            alt={seminar.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                            onError={(e) => {
                              (e.target as any).src =
                                "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&q=80";
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-[#4361EE]/20 to-[#3A0CA3]/20 flex items-center justify-center">
                            <Users size={48} className="text-[#90E0EF]/30" />
                          </div>
                        )}
                      </div>

                      {/* CONTENT */}
                      <div className="p-5 space-y-3">
                        {/* TITLE */}
                        <h3 className="font-semibold text-[#4CC9F0] group-hover:text-[#00E5FF] line-clamp-2 transition-colors">
                          {seminar.title}
                        </h3>

                        {/* META INFO */}
                        <div className="space-y-2 text-sm text-[#90E0EF]/70">
                          {seminar.eventDate && (
                            <div className="flex items-center gap-2">
                              <Calendar size={16} className="text-[#4CC9F0]" />
                              <span>
                                {new Date(seminar.eventDate).toLocaleDateString(
                                  "en-US",
                                  { month: "short", day: "numeric" }
                                )}
                              </span>
                            </div>
                          )}

                          {seminar.location && (
                            <div className="flex items-center gap-2">
                              <MapPin size={16} className="text-[#4CC9F0]" />
                              <span className="truncate">{seminar.location}</span>
                            </div>
                          )}
                        </div>

                        {/* HOST/GUEST */}
                        {seminar.host && seminar.host.length > 0 && (
                          <div className="pt-2 border-t border-[rgba(76,201,240,0.1)]">
                            <p className="text-xs text-[#90E0EF]/60 mb-1">Host:</p>
                            <p className="text-xs text-[#4CC9F0]">
                              {Array.isArray(seminar.host)
                                ? seminar.host.slice(0, 2).join(", ")
                                : seminar.host}
                              {Array.isArray(seminar.host) && seminar.host.length > 2
                                ? ` +${seminar.host.length - 2}`
                                : ""}
                            </p>
                          </div>
                        )}

                        {/* STATUS BADGE */}
                        <div className="flex items-center justify-between pt-2">
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              seminar.status === "upcoming"
                                ? "bg-blue-500/20 text-blue-300"
                                : seminar.status === "ongoing"
                                ? "bg-green-500/20 text-green-300"
                                : "bg-gray-500/20 text-gray-300"
                            }`}
                          >
                            {seminar.status?.charAt(0).toUpperCase() +
                              seminar.status?.slice(1)}
                          </span>
                          <ChevronRight
                            size={16}
                            className="text-[#4CC9F0] group-hover:translate-x-1 transition-transform"
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
                className="px-4 py-2 bg-[rgba(76,201,240,0.1)] border border-[rgba(76,201,240,0.2)] rounded-lg text-[#4CC9F0] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[rgba(76,201,240,0.2)] transition-colors"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-[#90E0EF]/80">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 bg-[rgba(76,201,240,0.1)] border border-[rgba(76,201,240,0.2)] rounded-lg text-[#4CC9F0] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[rgba(76,201,240,0.2)] transition-colors"
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

