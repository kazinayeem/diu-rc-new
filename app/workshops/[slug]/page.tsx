"use client";

import React, { useEffect, useState } from "react";
import { useGetEventsQuery, useGetEventQuery } from "@/lib/api/api";
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
  const [notFound, setNotFound] = useState(false);

  const { data: listData, isFetching: fetchingList } = useGetEventsQuery({ query: `slug=${params.slug}` });

  const foundId = listData?.success ? listData.data?.[0]?._id : "";
  const { data: detailData, isFetching: fetchingDetail } = useGetEventQuery(foundId || "");

  useEffect(() => {
    // Still loading if either query is fetching
    if (fetchingList || fetchingDetail) {
      setLoading(true);
      return;
    }

    // Both queries are done loading
    try {
      const found = listData?.success ? listData.data?.[0] : undefined;

      if (!found) {
        setWorkshop(null);
        setNotFound(true);
        setLoading(false);
        return;
      }

      if (detailData?.success) {
        setWorkshop(detailData.data);
      } else {
        setWorkshop(found);
      }
      
      setNotFound(false);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching workshop:", error);
      setWorkshop(null);
      setNotFound(true);
      setLoading(false);
    }
  }, [fetchingList, fetchingDetail, listData, detailData]);

  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-transparent text-black dark:text-white text-xl">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mb-4"></div>
          <p>Loading workshop details...</p>
        </div>
      </div>
    );
  }

  
  if (notFound || !workshop) {
    return (
      <div className="min-h-screen flex flex-col bg-white dark:bg-transparent text-black dark:text-white">
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Workshop not found</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">The workshop you're looking for doesn't exist.</p>
            <a href="/workshops" className="text-cyan-600 dark:text-cyan-400 underline hover:no-underline">
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
    <div className="min-h-screen flex flex-col bg-white dark:bg-transparent text-black dark:text-white">
      <main className="flex-grow">
        {/* HERO */}
        <AnimatedWorkshopHero workshop={workshop} />

        {/* CONTENT */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8 items-start">
              {/* LEFT CONTENT */}
              <div className="md:col-span-2 bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-2xl p-6 dark:backdrop-blur-md">
                <AnimatedWorkshopContent workshop={workshop} />
              </div>

              {/* RIGHT SIDEBAR */}
              <div className="md:col-span-1 sticky top-24">
                <div className="bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-2xl dark:backdrop-blur-md">
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
