"use client";

import React from "react";
import EventCard from "@/components/public/EventCard";
import { useGetEventsQuery } from "@/lib/api/api";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function LatestSeminars() {
  const { data, isLoading } = useGetEventsQuery({ query: "type=seminar&limit=3&sort=latest" });
  const seminars = data?.data || [];

  if (isLoading)
    return (
      <div className="text-center text-white/60 py-10">Loading Seminars...</div>
    );

  if (seminars.length === 0) return null;

  return (
    <section className="py-16 bg-[#0B1F3A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-cyan-200">Latest Seminars</h2>

          <Link href="/seminars">
            <Button variant="outline">View All</Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {seminars.map((seminar: any) => (
            <EventCard key={seminar._id} event={seminar} />
          ))}
        </div>
      </div>
    </section>
  );
}
