"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import Link from "next/link";

interface EventItem {
  _id: string;
  title: string;
  slug: string;
  description: string;
  image?: string;
  eventDate: string;
  eventTime: string;
  location: string;
  status: string;
  mode?: string;
  eventLink?: string;
  registrationLink?: string;
  attendees?: number;
}

export default function EventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState("");

  const limit = 6;

  // === Fetch Events ===
  const fetchEvents = async (pageNum: number) => {
    setLoading(true);

    const res = await fetch(
      `/api/events?type=event&page=${pageNum}&limit=${limit}`
    );

    const data = await res.json();
    setEvents(data.data || []);
    setTotalPages(data.pagination?.pages || 1);
    setLoading(false);
  };

  useEffect(() => {
    fetchEvents(page);
  }, [page]);

  // Search
  const filteredEvents = useMemo(() => {
    return events.filter((e) =>
      e.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, events]);

  // Skeleton
  const SkeletonCard = () => (
    <div className="animate-pulse bg-white/10 rounded-xl h-72 w-full"></div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-white">
      {/* HERO */}
      <section className="py-16 shadow-inner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-3">Events</h1>
          <p className="text-lg text-cyan-100">
            Explore our latest robotics events, meetups & competitions.
          </p>

          {/* Search */}
          <div className="max-w-md mt-6">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search events..."
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl outline-none text-white placeholder-gray-300 focus:ring-2 focus:ring-cyan-400"
            />
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* EVENT LIST */}
          {!loading ? (
            filteredEvents.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map((event, index) => (
                  <motion.div
                    key={event._id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.07 }}
                    className="bg-white/10 border border-white/20 rounded-xl overflow-hidden shadow-lg cursor-pointer group"
                  >
                    {/* IMAGE */}
                    {event.image && (
                      <div className="h-40 w-full overflow-hidden">
                        <img
                          src={event.image}
                          className="w-full h-full object-cover group-hover:scale-105 duration-300"
                        />
                      </div>
                    )}

                    {/* BODY */}
                    <div className="p-4">
                      <h2 className="text-xl font-bold mb-2 group-hover:text-cyan-300 duration-300">
                        {event.title}
                      </h2>

                      <p className="text-sm text-gray-300 line-clamp-3 mb-3">
                        {event.description}
                      </p>

                      {/* MODE BADGE */}
                      <span
                        className={`px-3 py-1 text-sm rounded-full ${
                          event.mode === "online"
                            ? "bg-green-500/20 text-green-300 border border-green-400/40"
                            : "bg-yellow-500/20 text-yellow-300 border border-yellow-400/40"
                        }`}
                      >
                        {event.mode === "online"
                          ? "Online Event"
                          : "Offline Event"}
                      </span>

                      {/* DATE & TIME */}
                      <div className="mt-3 text-gray-300 text-sm space-y-1">
                        <p>📅 {new Date(event.eventDate).toDateString()}</p>
                        <p>⏰ {event.eventTime}</p>
                        <p>📍 {event.location}</p>
                      </div>
                    </div>

                    {/* JOIN BUTTON FOR ONLINE EVENTS */}
                    {event.mode === "online" && event.eventLink && (
                      <div className="p-4 pt-0">
                        <Button
                          onClick={() => window.open(event.eventLink, "_blank")}
                          className="w-full bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg"
                        >
                          Join Event →
                        </Button>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-cyan-300 text-lg">No events found.</p>
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
