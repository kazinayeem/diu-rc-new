"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useGetEventsQuery } from "@/lib/api/api";
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

  
  const query = `type=event&page=${page}&limit=${limit}`;
  const { data, isFetching } = useGetEventsQuery({ query });

  useEffect(() => {
    setLoading(isFetching);
    if (data?.success) {
      setEvents(data.data || []);
      setTotalPages(data.pagination?.pages || 1);
    }
  }, [data, isFetching]);

  
  const filteredEvents = useMemo(() => {
    return events.filter((e) =>
      e.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, events]);

  
  const SkeletonCard = () => (
    <div className="animate-pulse bg-white/10 rounded-xl h-72 w-full"></div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-transparent text-black dark:text-white">
      {/* HERO */}
      <section className="py-16 shadow-inner bg-gray-50 dark:bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-3 text-black dark:text-white">Events</h1>
          <p className="text-lg text-gray-600 dark:text-cyan-100">
            Explore our latest robotics events, meetups & competitions.
          </p>

          {/* Search */}
          <div className="max-w-md mt-6">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search events..."
              className="w-full px-4 py-3 bg-gray-100 dark:bg-white/10 border border-gray-300 dark:border-white/20 rounded-xl outline-none text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-300 focus:ring-2 focus:ring-cyan-400"
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
                  >
                    <Link href={`/events/${event.slug}`}>
                      <div className="bg-white dark:bg-white/10 border border-gray-300 dark:border-white/20 rounded-xl overflow-hidden shadow-lg dark:shadow-lg cursor-pointer group hover:shadow-xl dark:hover:shadow-xl hover:border-cyan-400 dark:hover:border-cyan-400/40 transition-all duration-300 h-full">
                        {/* IMAGE */}
                        {event.image && (
                          <div className="h-40 w-full overflow-hidden bg-gray-200 dark:bg-gray-800">
                            <img
                              src={event.image}
                              alt={event.title}
                              className="w-full h-full object-cover group-hover:scale-105 duration-300"
                            />
                          </div>
                        )}

                        {/* BODY */}
                        <div className="p-4">
                          <h2 className="text-xl font-bold mb-2 text-black dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-300 duration-300 line-clamp-2">
                            {event.title}
                          </h2>

                          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-3">
                            {event.description}
                          </p>

                          {/* STATUS BADGE */}
                          <div className="flex items-center gap-2 mb-3 flex-wrap">
                            <span
                              className={`px-2 py-1 text-xs rounded-full font-medium ${
                                event.status === "upcoming"
                                  ? "bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300"
                                  : event.status === "ongoing"
                                  ? "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300"
                                  : event.status === "completed"
                                  ? "bg-gray-100 dark:bg-gray-500/20 text-gray-700 dark:text-gray-300"
                                  : "bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300"
                              }`}
                            >
                              {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                            </span>

                            {/* MODE BADGE */}
                            <span
                              className={`px-2 py-1 text-xs rounded-full font-medium ${
                                event.mode === "online"
                                  ? "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300"
                                  : "bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-300"
                              }`}
                            >
                              {event.mode === "online"
                                ? "🌐 Online"
                                : "📍 Offline"}
                            </span>
                          </div>

                          {/* DATE & TIME */}
                          <div className="text-gray-600 dark:text-gray-300 text-xs space-y-1">
                            <p>📅 {new Date(event.eventDate).toDateString()}</p>
                            <p>⏰ {event.eventTime}</p>
                            <p>📍 {event.location}</p>
                          </div>
                        </div>

                        {/* VIEW DETAILS BUTTON */}
                        <div className="px-4 pb-4">
                          <div className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-semibold py-2 px-3 rounded-lg text-center transition-all duration-300 text-sm">
                            View Details →
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-cyan-600 dark:text-cyan-300 text-lg">No events found.</p>
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
                className="border-cyan-400 text-cyan-600 dark:text-cyan-300 hover:bg-cyan-100 dark:hover:bg-cyan-500 hover:text-black dark:hover:text-black"
              >
                Previous
              </Button>

              <span className="text-cyan-700 dark:text-cyan-200 font-medium py-2 px-4 bg-gray-100 dark:bg-white/10 rounded-lg border border-gray-300 dark:border-white/10">
                Page {page} of {totalPages}
              </span>

              <Button
                variant="outline"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className="border-cyan-400 text-cyan-600 dark:text-cyan-300 hover:bg-cyan-100 dark:hover:bg-cyan-500 hover:text-black dark:hover:text-black"
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
