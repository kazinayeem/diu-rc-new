"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import Link from "next/link";

interface WorkshopItem {
  _id: string;
  title: string;
  slug: string;
  description: string;
  image?: string;
  eventDate: string;
  eventTime: string;
  location: string;
  mode?: string;
  isPaid: boolean;
  registrationFee?: number;
  registrationOpen?: boolean;
}

export default function WorkshopsPage() {
  const [workshops, setWorkshops] = useState<WorkshopItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState("");

  const limit = 6;

  // === Fetch Workshops ===
  const fetchWorkshops = async (pageNum: number) => {
    setLoading(true);


    const res = await fetch(
      `/api/events?type=workshop&page=${pageNum}&limit=${limit}`
    );

    const data = await res.json();

    // Backend already sorts by { eventDate: -1 } so newest first
    setWorkshops(data.data || []);
    setTotalPages(data.pagination?.pages || 1);
    setLoading(false);
  };

  useEffect(() => {
    fetchWorkshops(page);
  }, [page]);

  // === Search Filter ===
  const filteredWorkshops = useMemo(() => {
    return workshops.filter((item) =>
      item.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, workshops]);

  // Convert time to AM/PM
  const formatTime = (time: string) => {
    if (!time) return "";
    return new Date("1970-01-01T" + time + ":00")
      .toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
      .toUpperCase();
  };

  const SkeletonCard = () => (
    <div className="animate-pulse bg-white/10 rounded-xl h-72 w-full" />
  );

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-white">
      {/* HERO SECTION */}
      <section className="py-16 shadow-inner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-3">Workshops</h1>
          <p className="text-lg text-cyan-100">
            Learn, build & explore robotics with our hands-on workshops.
          </p>

          {/* SEARCH BOX */}
          <div className="max-w-md mt-6">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search workshops..."
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl outline-none text-white placeholder-gray-300 focus:ring-2 focus:ring-cyan-400"
            />
          </div>
        </div>
      </section>

      {/* WORKSHOPS SECTION */}
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* WORKSHOP GRID */}
          {!loading ? (
            filteredWorkshops.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredWorkshops.map((workshop, index) => (
                  <motion.div
                    key={workshop._id}
                    initial={{ opacity: 0, y: 25 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.07 }}
                    className="bg-white/10 border border-white/20 rounded-xl overflow-hidden shadow-lg group"
                  >
                    <Link href={`/workshops/${workshop.slug}`}>
                      {/* IMAGE */}
                      {workshop.image && (
                        <div className="h-40 w-full overflow-hidden">
                          <img
                            src={workshop.image}
                            className="w-full h-full object-cover group-hover:scale-105 duration-300"
                          />
                        </div>
                      )}

                      {/* BODY */}
                      <div className="p-4">
                        <h2 className="text-xl font-bold mb-2 group-hover:text-cyan-300 duration-300">
                          {workshop.title}
                        </h2>

                        <p className="text-sm text-gray-300 line-clamp-3 mb-3">
                          {workshop.description}
                        </p>

                        {/* Free/Paid Badge */}
                        {workshop.isPaid ? (
                          <span className="px-3 py-1 text-sm rounded-full bg-red-500/20 text-red-300 border border-red-400/40">
                            Paid — ৳{workshop.registrationFee}
                          </span>
                        ) : (
                          <span className="px-3 py-1 text-sm rounded-full bg-green-500/20 text-green-300 border border-green-400/40">
                            Free Workshop
                          </span>
                        )}

                        {/* Date & Time */}
                        <div className="mt-3 text-gray-300 text-sm space-y-1">
                          <p>
                            📅 {new Date(workshop.eventDate).toDateString()}
                          </p>
                          <p>⏰ {formatTime(workshop.eventTime)}</p>
                          <p>📍 {workshop.location}</p>
                        </div>
                      </div>
                    </Link>

                    {/* REGISTER */}
                    {workshop.registrationOpen && (
                      <div className="p-4 pt-0">
                        <Button
                          onClick={() =>
                            (window.location.href = `/workshops/${workshop.slug}`)
                          }
                          className="w-full bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg"
                        >
                          {workshop.isPaid
                            ? `Register – ৳${workshop.registrationFee}`
                            : "Register Now"}
                        </Button>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-cyan-300 text-lg">No workshops found.</p>
              </div>
            )
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          )}

          {/* PAGINATION */}
          {!loading && totalPages > 1 && (
            <div className="flex justify-center mt-10 gap-4">
              <Button
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="border-cyan-400 text-cyan-300 hover:bg-cyan-500 hover:text-black"
              >
                Previous
              </Button>

              <span className="text-cyan-200 font-medium py-2 px-4 bg-white/10 rounded-lg border border-white/10">
                Page {page} of {totalPages}
              </span>

              <Button
                variant="outline"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className="border-cyan-400 text-cyan-300 hover:bg-cyan-500 hover:text-black"
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
