"use client";

import React from "react";
import EventCard from "@/components/public/EventCard";
import { useGetEventsQuery } from "@/lib/api/api";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function LatestEvents() {
  
  const { data, isLoading } = useGetEventsQuery({ query: "limit=3&sort=latest" });
  const events = data?.data || [];

  if (isLoading)
    return (
      <div className="text-center text-white/60 py-10">Loading Events...</div>
    );

  if (events.length === 0) return null;

  return (
    <section className="py-16 bg-[#071024]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-cyan-200">Latest Events</h2>

          <Link href="/events">
            <Button variant="outline">View All</Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {events.map((event: any) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      </div>
    </section>
  );
}
