import React from "react";
import AnalyticsCard from "@/components/admin/AnalyticsCard";
import connectDB from "@/lib/db";
import Member from "@/lib/models/Member";
import Event from "@/lib/models/Event";
import MemberRegistration from "@/lib/models/MemberRegistration";
import { Users, Calendar, BookOpen, Image as ImageIcon } from "lucide-react";

export default async function AdminDashboard() {
  
  let stats: any = null;
  try {
    await connectDB();
    const [totalMembers, totalEvents, totalRegistrations] = await Promise.all([
      Member.countDocuments({}),
      Event.countDocuments({}),
      MemberRegistration.countDocuments({}),
    ]);

    stats = {
      members: totalMembers,
      events: totalEvents,

      registrations: totalRegistrations,
    };
  } catch (err) {
    console.error("Error loading admin stats:", err);
  }

  return (
    <div className="text-slate-100">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-slate-100">Dashboard</h1>
        <p className="text-slate-400">Welcome to the admin dashboard</p>
      </div>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <AnalyticsCard
            title="Members"
            value={String(stats.members)}
            icon={Users}
          />
          <AnalyticsCard
            title="Events"
            value={String(stats.events)}
            icon={Calendar}
          />
          <AnalyticsCard
            title="Registrations"
            value={String(stats.registrations)}
            icon={BookOpen}
          />
        </div>
      )}
    </div>
  );
}
