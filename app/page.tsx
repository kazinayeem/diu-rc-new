import React from "react";
import type { Metadata } from "next";
import EventCard from "@/components/public/EventCard";
import SeminarCard from "@/components/public/SeminarCard";
import AnimatedMissionVision from "@/components/public/AnimatedMissionVision";
import AnimatedWhatWeDo from "@/components/public/AnimatedWhatWeDo";
import AnimatedAchievements from "@/components/public/AnimatedAchievements";
import HomeImageSlider from "@/components/public/HomeImageSlider";
import ClubVideoPreview from "@/components/public/ClubVideoPreview";
import ConvenerMessage from "@/components/public/ConvenerMessage";
import FAQAccordion from "@/components/public/FAQAccordion";
import {
  AnimatedSection,
  AnimatedCTA,
} from "@/components/public/AnimatedSections";
import DataPrefetcher from "@/components/DataPrefetcher";
import connectDB from "@/lib/db";
import Sponsor from "@/lib/models/Sponsor";
import HomeContent from "@/lib/models/HomeContent";
import HallOfFame from "@/lib/models/HallOfFame";
import SponsorsMarquee from "@/components/public/SponsorsMarquee";
import HallOfFameCarousel from "@/components/public/HallOfFameCarousel";

import dynamic from "next/dynamic";


import LatestEvents from "@/components/public/LatestEvents";
import LatestWorkshops from "@/components/public/LatestWorkshops";
import LatestSeminars from "@/components/public/LatestSeminars";
import LatestBootcamps from "@/components/public/LatestBootcamps";

const HeroWithRobot = dynamic(() => import("@/components/public/With3drobot"), {
  ssr: false,
});

export const metadata: Metadata = {
  title: "Home | DIU Robotics Club — Innovation Through Robotics",
  description:
    "Welcome to the Daffodil International University Robotics Club (DIU RC). Join us to explore robotics, automation, AI, participate in workshops, seminars, hackathons, and competitions. Open to all DIU students.",
  keywords: [
    "DIU Robotics Club",
    "Daffodil International University Robotics",
    "robotics Bangladesh",
    "DIU RC membership",
    "robotics workshop Dhaka",
    "automation club DIU",
    "engineering students Bangladesh",
    "STEM Bangladesh",
    "robotics seminar DIU",
    "university robotics competition Bangladesh",
  ],
  alternates: { canonical: "https://diu-rc-new.vercel.app" },
  openGraph: {
    type: "website",
    url: "https://diu-rc-new.vercel.app",
    title: "DIU Robotics Club — Innovation Through Robotics",
    description:
      "Join DIU Robotics Club to explore robotics, automation, AI, workshops, seminars and competitions at Daffodil International University, Bangladesh.",
    images: [
      {
        url: "https://diu-rc-new.vercel.app/diurc_logo.png",
        width: 512,
        height: 512,
        alt: "Daffodil International University Robotics Club",
      },
    ],
    siteName: "DIU Robotics Club",
  },
  twitter: {
    card: "summary_large_image",
    title: "DIU Robotics Club — Innovation Through Robotics",
    description:
      "Join DIU Robotics Club to explore robotics, automation, AI, workshops, seminars and competitions at Daffodil International University.",
    images: ["https://diu-rc-new.vercel.app/diurc_logo.png"],
  },
};

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

async function getHomeContent() {
  try {
    await connectDB();
    const doc = await HomeContent.findOne({ isActive: true }).sort({ updatedAt: -1 }).lean();

    if (!doc) {
      return { heroSlides: [], achievements: [] };
    }

    const heroSlides = (doc.heroSlides ?? [])
      .filter((item: any) => item?.isVisible !== false && item?.imageUrl)
      .sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0));

    const achievements = (doc.achievements ?? [])
      .filter(
        (item: any) =>
          item?.isVisible !== false && item?.name && item?.shortDescription && item?.imageUrl
      )
      .sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0));

    return { heroSlides, achievements };
  } catch {
    return { heroSlides: [], achievements: [] };
  }
}

export default async function HomePage() {
  const { events, seminars, members } = await getFeaturedContent();
  const { heroSlides, achievements } = await getHomeContent();

  // Fetch sponsors directly from DB
  let sponsors: any[] = [];
  try {
    await connectDB();
    sponsors = await Sponsor.find({ isVisible: true }).sort({ order: 1, createdAt: 1 }).lean();
  } catch {}

  // Fetch Hall of Fame entries
  let hallOfFame: any[] = [];
  try {
    await connectDB();
    hallOfFame = await HallOfFame.find({ isVisible: true }).sort({ order: 1, createdAt: 1 }).lean();
  } catch {}

  return (
    <div className="min-h-screen flex flex-col bg-[#0B1F3A] text-white">
      {/* Structured Data — WebSite with SearchAction */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "DIU Robotics Club",
            "url": "https://diu-rc-new.vercel.app",
            "description":
              "Daffodil International University Robotics Club — Bangladesh's leading student robotics community for workshops, automation, AI, and competitions.",
            "potentialAction": {
              "@type": "SearchAction",
              "target": {
                "@type": "EntryPoint",
                "urlTemplate": "https://diu-rc-new.vercel.app/members?search={search_term_string}",
              },
              "query-input": "required name=search_term_string",
            },
            "publisher": {
              "@type": "Organization",
              "name": "Daffodil International University Robotics Club",
              "logo": {
                "@type": "ImageObject",
                "url": "https://diu-rc-new.vercel.app/diurc_logo.png",
                "width": 512,
                "height": 512,
              },
            },
          }),
        }}
      />
      {/* Prefetch all page data on load */}
      <DataPrefetcher />

      <main className="flex-grow relative">
        {/* Background Grid */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(#1a3a5c 1px, transparent 1px), linear-gradient(90deg, #1a3a5c 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <HeroWithRobot />
        <HomeImageSlider slides={heroSlides} />
        <AnimatedCTA />
        <ClubVideoPreview videoUrl="https://youtu.be/ZBL3rCvjtQU" />
        <AnimatedMissionVision />
        <AnimatedWhatWeDo />
        <AnimatedAchievements achievements={achievements} />

        {/* Hall of Fame */}
        {hallOfFame.length > 0 && (
          <AnimatedSection className="py-16">
            <div className="max-w-3xl mx-auto px-6">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-cyan-200">🎓 Hall of Fame</h2>
                <p className="text-white/60 mt-2">
                  Meet our distinguished alumni who have made remarkable achievements in their careers
                </p>
              </div>
              <div className="pb-10">
                <HallOfFameCarousel
                  entries={hallOfFame.map((e: any) => ({
                    _id: e._id.toString(),
                    name: e.name,
                    imageUrl: e.imageUrl,
                    achievement: e.achievement,
                    position: e.position,
                    year: e.year,
                    linkedinUrl: e.linkedinUrl,
                  }))}
                />
              </div>
            </div>
          </AnimatedSection>
        )}

        {/* Campus Labs + Impact */}
        <AnimatedSection className="py-20">
          <div className="max-w-7xl mx-auto px-6">

            {/* Section header */}
            <div className="mb-12">
              <div className="inline-flex items-center gap-2 bg-cyan-500/8 border border-cyan-500/15 px-3.5 py-1.5 rounded-full mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-[11px] font-bold text-cyan-400 tracking-[0.14em] uppercase">Environment</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                Where We{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                  Learn &amp; Grow
                </span>
              </h2>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">

              {/* Labs Card */}
              <div
                className="group relative rounded-2xl overflow-hidden"
                style={{
                  background: "linear-gradient(145deg, #0c1f3a 0%, #0B1F3A 100%)",
                  border: "1px solid rgba(34,211,238,0.18)",
                }}
              >
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
                  style={{ boxShadow: "inset 0 0 50px rgba(34,211,238,0.06)" }} />

                <div className="p-7 sm:p-8">
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center"
                      style={{ boxShadow: "0 0 16px rgba(34,211,238,0.1)" }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-400"><path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2v-4M9 21H5a2 2 0 0 1-2-2v-4m0 0h18"/></svg>
                    </div>
                    <h3 className="text-xl font-bold text-white">Labs &amp; Facilities</h3>
                  </div>

                  <p className="text-white/50 text-sm leading-relaxed mb-7">
                    Hands-on learning happens in our dedicated robotics lab. Members explore embedded systems,
                    rapid prototyping, and AI-driven perception using real hardware and guided mentorship.
                  </p>

                  <div className="h-px w-full bg-gradient-to-r from-transparent via-cyan-500/15 to-transparent mb-7" />

                  {/* Facility grid */}
                  <div className="grid sm:grid-cols-2 gap-3">
                    {[
                      { icon: "⚡", label: "Electronics workbench", desc: "Full soldering & PCB station" },
                      { icon: "🖨️", label: "3D printing & prototyping", desc: "FDM printers & laser cutter" },
                      { icon: "👁️", label: "Vision & sensor kits", desc: "OpenCV, LiDAR, depth cameras" },
                      { icon: "🏆", label: "Competition prep zone", desc: "Dedicated arena & test tracks" },
                    ].map((f) => (
                      <div
                        key={f.label}
                        className="rounded-xl px-4 py-3.5 border border-white/6 bg-white/3 hover:bg-white/6 hover:border-cyan-500/20 transition-all duration-200"
                      >
                        <p className="text-sm font-semibold text-white/85 mb-0.5">{f.icon} {f.label}</p>
                        <p className="text-xs text-white/35">{f.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Community Card */}
              <div
                className="group relative rounded-2xl overflow-hidden"
                style={{
                  background: "linear-gradient(145deg, #130d2e 0%, #0B1F3A 100%)",
                  border: "1px solid rgba(167,139,250,0.18)",
                }}
              >
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-violet-400 to-transparent" />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
                  style={{ boxShadow: "inset 0 0 50px rgba(167,139,250,0.06)" }} />

                <div className="p-7 sm:p-8">
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center"
                      style={{ boxShadow: "0 0 16px rgba(167,139,250,0.1)" }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-violet-400"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                    </div>
                    <h3 className="text-xl font-bold text-white">Community &amp; Impact</h3>
                  </div>

                  <p className="text-white/50 text-sm leading-relaxed mb-7">
                    We build a supportive community around robotics, research, and innovation.
                    From workshops to national competitions, we grow skills that matter beyond campus.
                  </p>

                  <div className="h-px w-full bg-gradient-to-r from-transparent via-violet-500/15 to-transparent mb-7" />

                  {/* Pillars */}
                  <div className="space-y-4">
                    {[
                      {
                        color: "#a78bfa",
                        glow: "rgba(167,139,250,0.12)",
                        title: "Workshops",
                        desc: "Weekly sessions on Arduino, ROS, and ML basics."
                      },
                      {
                        color: "#60a5fa",
                        glow: "rgba(96,165,250,0.12)",
                        title: "Research",
                        desc: "Guided projects with faculty and peer review."
                      },
                      {
                        color: "#34d399",
                        glow: "rgba(52,211,153,0.12)",
                        title: "Competitions",
                        desc: "Team-based challenges that build real confidence."
                      },
                    ].map((item) => (
                      <div
                        key={item.title}
                        className="flex items-start gap-4 rounded-xl px-4 py-3.5 border border-white/6 bg-white/3 hover:bg-white/6 transition-all duration-200"
                      >
                        <div
                          className="mt-0.5 w-1.5 h-1.5 rounded-full flex-shrink-0 mt-2"
                          style={{ background: item.color, boxShadow: `0 0 8px ${item.glow}` }}
                        />
                        <div>
                          <p className="text-sm font-semibold text-white/85">{item.title}</p>
                          <p className="text-xs text-white/40 mt-0.5">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </AnimatedSection>

        {/* Focus Areas */}
        <AnimatedSection className="py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-end justify-between gap-6 mb-8 flex-wrap">
              <div>
                <h2 className="text-3xl font-bold text-cyan-200">
                  Our Focus Areas
                </h2>
                <p className="text-white/60 mt-2">
                  Practical tracks built for real-world engineering skills.
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: "Robotics & Control",
                  desc: "Kinematics, PID, and autonomous motion.",
                },
                {
                  title: "Embedded Systems",
                  desc: "Microcontrollers, sensors, and PCB basics.",
                },
                {
                  title: "AI & Vision",
                  desc: "Object detection, tracking, and perception.",
                },
                {
                  title: "Product Build",
                  desc: "Rapid prototyping to full system demos.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition"
                >
                  <p className="text-white font-semibold mb-2">{item.title}</p>
                  <p className="text-white/70 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* Timeline */}
        <AnimatedSection className="py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-cyan-200">Timeline</h2>
              <p className="text-white/60 mt-2">
                A quick look at our yearly activity flow.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  title: "Spring Intake",
                  desc: "Member onboarding, orientation, and basics.",
                },
                {
                  title: "Summer Build",
                  desc: "Prototyping, lab sessions, and research starts.",
                },
                {
                  title: "Autumn Competitions",
                  desc: "National contests and demo showcases.",
                },
                {
                  title: "Winter Workshops",
                  desc: "Community training and leadership handover.",
                },
              ].map((item, index) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-white/10 bg-white/5 p-6"
                >
                  <div className="flex items-center gap-4 mb-3">
                    <div className="h-9 w-9 rounded-full bg-cyan-400/20 border border-cyan-300/30 flex items-center justify-center text-cyan-200 font-semibold">
                      {index + 1}
                    </div>
                    <p className="text-white font-semibold">{item.title}</p>
                  </div>
                  <p className="text-white/70 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* Sponsors / Partners */}
        <AnimatedSection className="py-16">
          <div className="max-w-7xl mx-auto px-6 mb-8">
            <h2 className="text-3xl font-bold text-cyan-200">
              Sponsors & Partners
            </h2>
            <p className="text-white/60 mt-2">
              We grow together with industry and community support.
            </p>
          </div>
          <SponsorsMarquee sponsors={sponsors.map((s: any) => ({
            _id: s._id.toString(),
            name: s.name,
            logoUrl: s.logoUrl,
            websiteUrl: s.websiteUrl,
          }))} />
        </AnimatedSection>

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

        {/* Latest Events Section */}
        <ConvenerMessage />
        <LatestEvents />
        <LatestWorkshops />
        <LatestSeminars />
        <LatestBootcamps />

        {/* FAQ */}
        <AnimatedSection className="py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-[1fr_2fr] gap-12 lg:gap-16 items-start">

              {/* Left: sticky heading block */}
              <div className="lg:sticky lg:top-28">
                <div className="inline-flex items-center gap-2 bg-cyan-500/8 border border-cyan-500/15 px-3.5 py-1.5 rounded-full mb-5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="text-[11px] font-bold text-cyan-400 tracking-[0.14em] uppercase">FAQ</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight mb-4">
                  Frequently<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                    Asked Questions
                  </span>
                </h2>
                <p className="text-white/45 text-sm leading-relaxed mb-8">
                  Answers to the most common questions about joining, participating, and growing with the club.
                </p>
                <div className="flex flex-col gap-3">
                  {[
                    { n: "12", label: "Questions answered" },
                    { n: "200 BDT", label: "Membership fee" },
                    { n: "Open", label: "All years & departments" },
                  ].map((s) => (
                    <div key={s.label} className="flex items-center gap-3">
                      <span className="text-sm font-bold text-cyan-400 min-w-[60px]">{s.n}</span>
                      <span className="text-xs text-white/40">{s.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: accordion */}
              <div>
                <FAQAccordion
                  items={[
                    { q: "How do I join the club?", a: "Apply through the Join page and attend the orientation session." },
                    { q: "Do I need prior robotics experience?", a: "No. We run beginner tracks and pair new members with mentors." },
                    { q: "What projects can I work on?", a: "You can join ongoing research, build competition bots, or start a new idea." },
                    { q: "How often are workshops held?", a: "Weekly sessions with focused topics, plus seasonal bootcamps." },
                    { q: "Is there any membership fee?", a: "Yes, the membership fee is 200 BDT. Some events may have additional small participation costs." },
                    { q: "Can first-year students apply?", a: "Yes, we welcome students from all years and departments." },
                    { q: "Do I need to own hardware?", a: "No, lab resources are provided for learning and projects." },
                    { q: "How are teams formed?", a: "Teams are formed by interest and skill balance after onboarding." },
                    { q: "Can I switch tracks later?", a: "Yes, you can move between tracks after completing basics." },
                    { q: "What is the time commitment?", a: "Most members spend 2-4 hours per week, more during competitions." },
                    { q: "How do I get updates?", a: "Follow the club pages and announcements on the website." },
                    { q: "Who can I contact for help?", a: "Use the Contact section or message the club on social media." },
                  ]}
                />
              </div>

            </div>
          </div>
        </AnimatedSection>
      </main>
    </div>
  );
}
