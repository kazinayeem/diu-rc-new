import React from "react";
import AnalyticsCard from "@/components/admin/AnalyticsCard";
import {
  Users,
  Calendar,
  BookOpen,
  FileText,
  Bell,
  Image as ImageIcon,
} from "lucide-react";

async function getStats() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/admin/stats`, {
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      return data.data;
    }
    return null;
  } catch (error) {
    console.error("Error fetching stats:", error);
    return null;
  }
}

export default async function AdminDashboard() {
  const stats = await getStats();

  return (
    <div className="text-white">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-white/60">Welcome to the admin dashboard</p>
      </div>

      {stats && (
        <>
          {/* Member Stats */}
          <div className="mb-10">
            <h2 className="text-xl font-semibold mb-4 text-[#1f8fff] tracking-wide">
              Members
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <AnalyticsCard
                title="Total Members"
                value={stats.members.total}
                icon={Users}
              />
              <AnalyticsCard
                title="Active Members"
                value={stats.members.active}
                icon={Users}
              />
              <AnalyticsCard
                title="Main Members"
                value={stats.members.byRole.main}
                icon={Users}
              />
              <AnalyticsCard
                title="Executive Members"
                value={stats.members.byRole.executive}
                icon={Users}
              />
            </div>
          </div>

          {/* Content Stats */}
          <div className="mb-10">
            <h2 className="text-xl font-semibold mb-4 text-[#1f8fff] tracking-wide">
              Content
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <AnalyticsCard
                title="Total Events"
                value={stats.events.total}
                icon={Calendar}
              />
              <AnalyticsCard
                title="Upcoming Events"
                value={stats.events.upcoming}
                icon={Calendar}
              />
              <AnalyticsCard
                title="Total Seminars"
                value={stats.seminars.total}
                icon={BookOpen}
              />
              <AnalyticsCard
                title="Upcoming Seminars"
                value={stats.seminars.upcoming}
                icon={BookOpen}
              />
            </div>
          </div>

          {/* Other Stats */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-[#1f8fff] tracking-wide">
              Other
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <AnalyticsCard
                title="Published Posts"
                value={stats.posts.published}
                icon={FileText}
              />
              <AnalyticsCard
                title="Active Notices"
                value={stats.notices.active}
                icon={Bell}
              />
              <AnalyticsCard
                title="Gallery Images"
                value={stats.gallery.total}
                icon={ImageIcon}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
