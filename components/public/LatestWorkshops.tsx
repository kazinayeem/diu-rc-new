"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

import { useGetEventsQuery } from "@/lib/api/api";

export default function LatestWorkshops() {
  const { data, isLoading } = useGetEventsQuery({ query: "type=workshop&limit=3&sort=latest" });
  const workshops = data?.data || [];

  if (isLoading)
    return (
      <div className="text-center text-white/60 py-10">
        Loading Workshops...
      </div>
    );

  if (workshops.length === 0) return null;

  return (
    <section className="py-16 bg-[#071024]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-cyan-200">Latest Workshops</h2>

          <Link href="/workshops">
            <Button variant="outline">View All</Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {workshops.map((ws: any) => (
            <Link
              key={ws._id}
              href={`/workshops/${ws.slug}`}
              className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition"
            >
              {ws.image && (
                <img
                  src={ws.image}
                  className="rounded-lg h-40 w-full object-cover mb-3"
                />
              )}

              <h3 className="text-xl font-bold mb-2">{ws.title}</h3>

              <p className="text-white/70 text-sm line-clamp-3">
                {ws.description}
              </p>

              <p className="mt-3 text-white/60 text-sm">
                📅 {new Date(ws.eventDate).toDateString()}
              </p>

              <p className="text-white/60 text-sm">📍 {ws.location}</p>

              {ws.isPaid ? (
                <p className="mt-2 text-red-300 font-semibold">
                  Paid — ৳{ws.registrationFee}
                </p>
              ) : (
                <p className="mt-2 text-green-300 font-semibold">Free</p>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
