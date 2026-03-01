import React from "react";
import type { Metadata } from "next";
import EventCard from "@/components/public/EventCard";
import SeminarCard from "@/components/public/SeminarCard";
import AnimatedMissionVision from "@/components/public/AnimatedMissionVision";
import AnimatedWhatWeDo from "@/components/public/AnimatedWhatWeDo";
import AnimatedAchievements from "@/components/public/AnimatedAchievements";
import FAQAccordion from "@/components/public/FAQAccordion";
import {
  AnimatedSection,
  AnimatedCTA,
} from "@/components/public/AnimatedSections";
import DataPrefetcher from "@/components/DataPrefetcher";
import connectDB from "@/lib/db";
import Sponsor from "@/lib/models/Sponsor";
import SponsorsMarquee from "@/components/public/SponsorsMarquee";

import dynamic from "next/dynamic";


import LatestEvents from "@/components/public/LatestEvents";
import LatestWorkshops from "@/components/public/LatestWorkshops";

const HeroWithRobot = dynamic(() => import("@/components/public/With3drobot"), {
  ssr: false,
});

export const metadata: Metadata = {
  title: "DIU Robotic Club | Home",
  description:
    "DIU Robotics Club - robotics, automation, research, workshops, and competitions at DIU.",
  openGraph: {
    title: "DIU Robotic Club | Home",
    description:
      "DIU Robotics Club - robotics, automation, research, workshops, and competitions at DIU.",
    images: ["/diurc_logo.png"],
  },
  twitter: {
    card: "summary",
    title: "DIU Robotic Club | Home",
    description:
      "DIU Robotics Club - robotics, automation, research, workshops, and competitions at DIU.",
    images: ["/diurc_logo.png"],
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

export default async function HomePage() {
  const { events, seminars, members } = await getFeaturedContent();

  // Fetch sponsors directly from DB
  let sponsors: any[] = [];
  try {
    await connectDB();
    sponsors = await Sponsor.find({ isVisible: true }).sort({ order: 1, createdAt: 1 }).lean();
  } catch {}

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

        {/* Campus Labs + Impact */}
        <AnimatedSection className="py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur">
                <h2 className="text-3xl font-bold text-cyan-200 mb-4">
                  Labs & Facilities
                </h2>
                <p className="text-white/70 leading-relaxed mb-6">
                  Hands-on learning happens in our dedicated robotics lab. Members
                  explore embedded systems, rapid prototyping, and AI-driven
                  perception using real hardware and guided mentorship.
                </p>
                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  {[
                    "Electronics workbench",
                    "3D printing & prototyping",
                    "Vision & sensor kits",
                    "Competition prep zone",
                  ].map((item) => (
                    <div
                      key={item}
                      className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white/80"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur">
                <h2 className="text-3xl font-bold text-cyan-200 mb-4">
                  Community & Impact
                </h2>
                <p className="text-white/70 leading-relaxed mb-6">
                  We build a supportive community around robotics, research, and
                  innovation. From workshops to national competitions, we grow
                  skills that matter beyond campus.
                </p>
                <div className="space-y-4">
                  {[
                    {
                      title: "Workshops",
                      desc: "Weekly sessions on Arduino, ROS, and ML basics.",
                    },
                    {
                      title: "Research",
                      desc: "Guided projects with faculty and peer review.",
                    },
                    {
                      title: "Competitions",
                      desc: "Team-based challenges that build real confidence.",
                    },
                  ].map((item) => (
                    <div key={item.title} className="flex gap-4">
                      <div className="h-9 w-1 rounded-full bg-cyan-400/70" />
                      <div>
                        <p className="text-white font-semibold">{item.title}</p>
                        <p className="text-white/70 text-sm">{item.desc}</p>
                      </div>
                    </div>
                  ))}
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

        {/* Team Highlights */}
        <AnimatedSection className="py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-end justify-between gap-6 mb-8 flex-wrap">
              <div>
                <h2 className="text-3xl font-bold text-cyan-200">
                  Team Highlights
                </h2>
                <p className="text-white/60 mt-2">
                  Core leaders and active contributors driving club initiatives.
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  name: "Team Lead",
                  role: "Robotics Systems",
                },
                {
                  name: "Research Lead",
                  role: "AI & Vision",
                },
                {
                  name: "Operations Lead",
                  role: "Events & Community",
                },
                {
                  name: "Build Lead",
                  role: "Embedded & Prototyping",
                },
              ].map((member) => (
                <div
                  key={member.name}
                  className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition"
                >
                  <div className="h-14 w-14 rounded-full bg-cyan-400/20 border border-cyan-300/30 mb-4" />
                  <p className="text-white font-semibold">{member.name}</p>
                  <p className="text-white/70 text-sm">{member.role}</p>
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

        {/* FAQ */}
        <AnimatedSection className="py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-cyan-200">FAQ</h2>
              <p className="text-white/60 mt-2">
                Answers to the most common questions.
              </p>
            </div>

            <FAQAccordion
              items={[
                {
                  q: "How do I join the club? / ক্লাবে কীভাবে যোগ দেব?",
                  a: "Apply through the Join page and attend the orientation session. / Join পেজে আবেদন করুন এবং ওরিয়েন্টেশনে অংশ নিন।",
                },
                {
                  q: "Do I need prior robotics experience? / আগে থেকে অভিজ্ঞতা দরকার?",
                  a: "No. We run beginner tracks and pair new members with mentors. / না, শুরু করার জন্য বেসিক ট্র্যাক ও মেন্টরশিপ আছে।",
                },
                {
                  q: "What projects can I work on? / কী ধরনের প্রজেক্ট করব?",
                  a: "You can join ongoing research, build competition bots, or start a new idea. / রিসার্চ, কম্পিটিশন বট বা নতুন আইডিয়ায় কাজ করতে পারবেন।",
                },
                {
                  q: "How often are workshops held? / ওয়ার্কশপ কত ঘন ঘন হয়?",
                  a: "Weekly sessions with focused topics, plus seasonal bootcamps. / সাপ্তাহিক সেশন এবং মৌসুমি বুটক্যাম্প হয়।",
                },
                {
                  q: "Is there any membership fee? / সদস্যপদ ফি আছে কি?",
                  a: "There is no fixed fee; some events may have small participation costs. / নির্দিষ্ট ফি নেই, তবে কিছু ইভেন্টে ছোট ফি থাকতে পারে।",
                },
                {
                  q: "Can first-year students apply? / প্রথম বর্ষের শিক্ষার্থীরা কি আবেদন করতে পারে?",
                  a: "Yes, we welcome students from all years and departments. / হ্যাঁ, সব বর্ষ ও বিভাগের শিক্ষার্থীরা আবেদন করতে পারে।",
                },
                {
                  q: "Do I need to own hardware? / নিজস্ব হার্ডওয়্যার লাগবে?",
                  a: "No, lab resources are provided for learning and projects. / না, ল্যাব রিসোর্স দিয়ে কাজ করা যায়।",
                },
                {
                  q: "How are teams formed? / টিম কীভাবে গঠন হয়?",
                  a: "Teams are formed by interest and skill balance after onboarding. / আগ্রহ ও দক্ষতা অনুযায়ী টিম গঠন করা হয়।",
                },
                {
                  q: "Can I switch tracks later? / পরে ট্র্যাক বদলাতে পারব?",
                  a: "Yes, you can move between tracks after completing basics. / বেসিক শেষ হলে ট্র্যাক বদলানো যায়।",
                },
                {
                  q: "What is the time commitment? / সময় কতটা দিতে হয়?",
                  a: "Most members spend 2-4 hours per week, more during competitions. / সাধারণত সপ্তাহে ২-৪ ঘণ্টা, কম্পিটিশনের সময়ে বেশি লাগে।",
                },
                {
                  q: "How do I get updates? / আপডেট কীভাবে পাব?",
                  a: "Follow the club pages and announcements on the website. / ক্লাবের পেজ ও ওয়েবসাইটে ঘোষণা দেখুন।",
                },
                {
                  q: "Who can I contact for help? / সাহায্যের জন্য কাকে যোগাযোগ করব?",
                  a: "Use the Contact section or message the club on social media. / Contact সেকশনে অথবা সোশ্যাল মিডিয়ায় যোগাযোগ করুন।",
                },
              ]}
            />
          </div>
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

        {/* 🚀 NEW BOTTOM SECTIONS */}
        <LatestEvents />
        <LatestWorkshops />

        <AnimatedCTA />
      </main>
    </div>
  );
}
