"use client";

import React, { useState, useEffect } from "react";
import Footer from "@/components/public/Footer";
import EventCard from "@/components/public/EventCard";
import { Button } from "@/components/ui/Button";

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
  attendees?: number;
}

export default function EventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 6;

  // Fetch events with pagination
  const fetchEvents = async (pageNum: number) => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const res = await fetch(
      `${baseUrl}/api/events?page=${pageNum}&limit=${limit}`,
      { cache: "no-store" }
    );

    if (!res.ok) return;

    const data = await res.json();
    setEvents(data.data || []);
    setTotalPages(data.totalPages || 1);
  };

  useEffect(() => {
    fetchEvents(page);
  }, [page]);

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-white">
      {/* ===== HERO SECTION ===== */}
      <section className="py-16 shadow-inner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-3">Events</h1>
          <p className="text-lg text-cyan-100">
            Explore our robotics events, workshops & competitions.
          </p>
        </div>
      </section>

      {/* ===== CONTENT ===== */}
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {events.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event: EventItem) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-cyan-300 text-lg">
                No events available at the moment.
              </p>
            </div>
          )}

          {/* ===== PAGINATION ===== */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-10 gap-4">
              <Button
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="border-cyan-400 text-cyan-300 hover:bg-cyan-500 hover:text-black"
              >
                Previous
              </Button>

              <span className="text-cyan-200 font-medium py-2 px-4 bg-white/10 rounded-lg backdrop-blur-md border border-white/10">
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

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
