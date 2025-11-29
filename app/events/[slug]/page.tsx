"use client";

import React from "react";
import Footer from "@/components/public/Footer";
import AnimatedWorkshopHero from "@/components/public/AnimatedWorkshopHero";
import AnimatedWorkshopContent from "@/components/public/AnimatedWorkshopContent";
import AnimatedWorkshopRegistration from "@/components/public/AnimatedWorkshopRegistration";
import Link from "next/link";

async function getEvent(slug: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const res = await fetch(`${baseUrl}/api/events?slug=${slug}`, {
      cache: "no-store",
    });

    if (!res.ok) return null;

    const data = await res.json();
    const event = data.data?.[0];
    if (!event) return null;

    const detailRes = await fetch(`${baseUrl}/api/events/${event._id}`, {
      cache: "no-store",
    });

    if (detailRes.ok) {
      return (await detailRes.json()).data || event;
    }

    return event;
  } catch (error) {
    console.error("Error fetching event:", error);
    return null;
  }
}

export default async function EventDetailPage({ params }: { params: { slug: string } }) {
  const event = await getEvent(params.slug);

  if (!event) {
    return (
      <div className="min-h-screen bg-[#071024] flex flex-col justify-center items-center text-center">
        <h1 className="text-3xl font-bold text-white mb-4">Event Not Found</h1>
        <Link href="/events" className="text-white/70 hover:text-white underline">
          ← Back to Events
        </Link>
      </div>
    );
  }

  const isWorkshop = event.type === "workshop";
  const registrationCount = event.registrationCount || 0;
  const isRegistrationOpen =
    isWorkshop &&
    event.registrationOpen &&
    (!event.registrationLimit || registrationCount < event.registrationLimit);

  return (
    <div className="min-h-screen flex flex-col bg-[#071024] text-white">
      
      {/* HERO */}
      <AnimatedWorkshopHero workshop={event} />

      <main className="flex-grow">
        <section className="py-16 relative">
        
          {/* Transparent grid background */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(#0d1b2a40 1px, transparent 1px), linear-gradient(90deg, #0d1b2a40 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className={`grid gap-10 ${isWorkshop ? "md:grid-cols-3" : "md:grid-cols-1"}`}>
              
              {/* MAIN CONTENT */}
              <div className={isWorkshop ? "md:col-span-2" : ""}>
                <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-8">
                  <AnimatedWorkshopContent workshop={event} />
                </div>
              </div>

              {/* REGISTRATION (only for workshops) */}
              {isWorkshop && (
                <div className="md:col-span-1">
                  <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-6 sticky top-24">
                    <AnimatedWorkshopRegistration
                      workshopId={event._id}
                      isRegistrationOpen={isRegistrationOpen}
                      workshop={event}
                    />
                  </div>
                </div>
              )}

            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
