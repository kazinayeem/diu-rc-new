"use client";

import React, { useCallback, useEffect, useState } from "react";
import AnimatedWorkshopHero from "@/components/public/AnimatedWorkshopHero";
import AnimatedWorkshopContent from "@/components/public/AnimatedWorkshopContent";
import AnimatedWorkshopRegistration from "@/components/public/AnimatedWorkshopRegistration";

interface Workshop {
  _id: string;
  title: string;
  description: string;
  image?: string;
  content?: string;
  eventDate: string;
  eventTime: string;
  location: string;
  registrationLimit?: number;
  registrationOpen?: boolean;
  registrationCount?: number;
  type: string;
  isPaid?: boolean;
}

export default function WorkshopDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const [workshop, setWorkshop] = useState<Workshop | null>(null);
  const [loading, setLoading] = useState(true);

  const getWorkshop = useCallback(async () => {
    try {
     
      const res = await fetch(`/api/events?slug=${params.slug}`);

      const data = await res.json();
      const found = data?.data?.[0];

      if (!found) {
        setWorkshop(null);
        setLoading(false);
        return;
      }

      const detailRes = await fetch(`/api/events/${found._id}`);

      if (detailRes.ok) {
        const detailData = await detailRes.json();
        setWorkshop(detailData.data);
      } else {
        setWorkshop(found);
      }
    } catch (error) {
      console.error("Error fetching workshop:", error);
      setWorkshop(null);
    }

    setLoading(false);
  }, [params.slug]); // <-- dependency

  // --- FIX: add "getWorkshop" ---
  useEffect(() => {
    getWorkshop();
  }, [getWorkshop]);

  // === Loading State ===
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white text-xl">
        Loading workshop...
      </div>
    );
  }

  // === Not Found ===
  if (!workshop) {
    return (
      <div className="min-h-screen flex flex-col text-white">
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Workshop not found</h1>
            <a href="/workshops" className="text-cyan-400 underline">
              ← Back to Workshops
            </a>
          </div>
        </main>
      </div>
    );
  }

  const registrationCount = workshop.registrationCount ?? 0;

  const isRegistrationOpen =
    Boolean(workshop.registrationOpen) &&
    (workshop.registrationLimit === undefined ||
      registrationCount < workshop.registrationLimit);

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-white">
      <main className="flex-grow">
        {/* HERO */}
        <AnimatedWorkshopHero workshop={workshop} />

        {/* CONTENT */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8 items-start">
              {/* LEFT CONTENT */}
              <div className="md:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
                <AnimatedWorkshopContent workshop={workshop} />
              </div>

              {/* RIGHT SIDEBAR */}
              <div className="md:col-span-1 sticky top-24">
                <div className="bg-white/5 border border-white/10 rounded-2xl  backdrop-blur-md">
                  <AnimatedWorkshopRegistration
                    workshopId={workshop._id}
                    isRegistrationOpen={isRegistrationOpen}
                    workshop={workshop}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
