import React from "react";
import EventCard from "@/components/public/EventCard";
import SeminarCard from "@/components/public/SeminarCard";
import AnimatedMissionVision from "@/components/public/AnimatedMissionVision";
import AnimatedWhatWeDo from "@/components/public/AnimatedWhatWeDo";
import AnimatedAchievements from "@/components/public/AnimatedAchievements";
import {
  AnimatedSection,
  AnimatedCTA,
} from "@/components/public/AnimatedSections";
import DataPrefetcher from "@/components/DataPrefetcher";

import dynamic from "next/dynamic";


import LatestEvents from "@/components/public/LatestEvents";
import LatestWorkshops from "@/components/public/LatestWorkshops";

const HeroWithRobot = dynamic(() => import("@/components/public/With3drobot"), {
  ssr: false,
});

async function getFeaturedContent() {
  try {
  

    const [eventsRes, seminarsRes, membersRes] = await Promise.all([
      fetch(`/api/events?featured=true&limit=3`),
      fetch(`/api/seminars?featured=true&limit=3`),
      fetch(`/api/members?role=main&limit=4`),
    ]);

    return {
      events: eventsRes.ok ? (await eventsRes.json()).data : [],
      seminars: seminarsRes.ok ? (await seminarsRes.json()).data : [],
      members: membersRes.ok ? (await membersRes.json()).data : [],
    };
  } catch {
    return { events: [], seminars: [], members: [] };
  }
}

export default async function HomePage() {
  const { events, seminars, members } = await getFeaturedContent();

  return (
    <div className="min-h-screen flex flex-col bg-[#071024] text-white">
      {/* Prefetch all page data on load */}
      <DataPrefetcher />

      <main className="flex-grow relative">
        {/* Background Grid */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(#12324b 1px, transparent 1px), linear-gradient(90deg, #12324b 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <HeroWithRobot />
        <AnimatedMissionVision />
        <AnimatedWhatWeDo />
        <AnimatedAchievements />

        {/* Featured Seminars */}
        {seminars.length > 0 && (
          <AnimatedSection className="py-16">
            <div className="max-w-7xl mx-auto px-6">
              <h2 className="text-3xl font-bold mb-6 text-cyan-200">
                Upcoming Seminars
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {seminars.map((s: any) => (
                  <SeminarCard key={s._id} seminar={s} />
                ))}
              </div>
            </div>
          </AnimatedSection>
        )}
        {/* Featured Events */}
        {events.length > 0 && (
          <AnimatedSection className="py-16">
            <div className="max-w-7xl mx-auto px-6">
              <h2 className="text-3xl font-bold mb-6 text-cyan-200">
                Featured Events
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {events.map((ev: any) => (
                  <EventCard key={ev._id} event={ev} />
                ))}
              </div>
            </div>
          </AnimatedSection>
        )}

        {/* 🚀 NEW BOTTOM SECTIONS */}
        <LatestEvents />
        <LatestWorkshops />

        <AnimatedCTA />
      </main>
    </div>
  );
}
