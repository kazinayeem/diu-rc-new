import React from "react";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import EventCard from "@/components/public/EventCard";
import SeminarCard from "@/components/public/SeminarCard";
import AnimatedMissionVision from "@/components/public/AnimatedMissionVision";
import AnimatedWhatWeDo from "@/components/public/AnimatedWhatWeDo";
import AnimatedAchievements from "@/components/public/AnimatedAchievements";
import {
  AnimatedSection,
  AnimatedCTA,
} from "@/components/public/AnimatedSections";

import { Button } from "@/components/ui/Button";
import Link from "next/link";
import dynamic from "next/dynamic";

// 3D Robot Hero Section
const HeroWithRobot = dynamic(() => import("@/components/public/With3drobot"), {
  ssr: false,
});

// Fetch featured content
async function getFeaturedContent() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const [eventsRes, seminarsRes, membersRes] = await Promise.all([
      fetch(`${baseUrl}/api/events?featured=true&limit=3`, {
        cache: "no-store",
      }),
      fetch(`${baseUrl}/api/seminars?featured=true&limit=3`, {
        cache: "no-store",
      }),
      fetch(`${baseUrl}/api/members?role=main&limit=4`, { cache: "no-store" }),
    ]);

    return {
      events: eventsRes.ok ? (await eventsRes.json()).data : [],
      seminars: seminarsRes.ok ? (await seminarsRes.json()).data : [],
      members: membersRes.ok ? (await membersRes.json()).data : [],
    };
  } catch (error) {
    console.error("Error loading homepage:", error);
    return { events: [], seminars: [], members: [] };
  }
}

export default async function HomePage() {
  const { events, seminars, members } = await getFeaturedContent();

  return (
    <div className="min-h-screen flex flex-col bg-[#071024]bg-gradient-to-br from-[#071024] via-[#082135] to-[#0e2840] text-white">
      {/* MAIN WITH GLOBAL TRANSPARENT GRID BACKGROUND */}
      <main className="flex-grow relative">
        {/* 🔥 GLOBAL GRID BACKGROUND (APPLIES TO ENTIRE PAGE) */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(#12324b 1px, transparent 1px), linear-gradient(90deg, #12324b 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* HERO WITH ROBOT */}
        <HeroWithRobot />

        {/* MISSION & VISION */}
        <AnimatedMissionVision />

        {/* WHAT WE DO SECTION */}
        <AnimatedWhatWeDo />

        {/* ACHIEVEMENTS */}
        <AnimatedAchievements />

        {/* FEATURED EVENTS */}
        {events.length > 0 && (
          <AnimatedSection className="py-16 bg-[#071024]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-cyan-200 mb-2">
                    Featured Events
                  </h2>
                  <p className="text-cyan-100/70">
                    Join us for exciting robotics events and competitions
                  </p>
                </div>

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
          </AnimatedSection>
        )}

        {/* FEATURED SEMINARS */}
        {seminars.length > 0 && (
          <AnimatedSection className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-cyan-200 mb-2">
                    Upcoming Seminars
                  </h2>
                  <p className="text-cyan-100/70">
                    Learn from industry experts and researchers
                  </p>
                </div>

                <Link href="/seminars">
                  <Button variant="outline">View All</Button>
                </Link>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {seminars.map((seminar: any) => (
                  <SeminarCard key={seminar._id} seminar={seminar} />
                ))}
              </div>
            </div>
          </AnimatedSection>
        )}

        {/* FEATURED MEMBERS */}
        {members.length > 0 && (
          <AnimatedSection className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-cyan-200 mb-4">
                  Our Team
                </h2>
                <p className="text-cyan-100/70 max-w-2xl mx-auto">
                  Meet the passionate members driving innovation in our club
                </p>
              </div>

              <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
                {members.map((member: any) => (
                  <div key={member._id} className="text-center">
                    <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 border-cyan-400/40">
                      {member.image ? (
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-cyan-600/40 flex items-center justify-center text-white text-3xl font-bold">
                          {member.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>

                    <h3 className="text-lg font-bold text-white">
                      {member.name}
                    </h3>

                    {member.position && (
                      <p className="text-sm text-cyan-300 font-medium">
                        {member.position}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <div className="text-center mt-8">
                <Link href="/members">
                  <Button>View All Members</Button>
                </Link>
              </div>
            </div>
          </AnimatedSection>
        )}

        {/* CALL TO ACTION */}
        <AnimatedCTA />
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
