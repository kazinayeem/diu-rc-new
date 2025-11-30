import React from "react";
import AnalyticsCard from "@/components/admin/AnalyticsCard";
import connectDB from '@/lib/db';
import Member from '@/lib/models/Member';
import Event from '@/lib/models/Event';
import Post from '@/lib/models/Post';
import MemberRegistration from '@/lib/models/MemberRegistration';
import {
  Users,
  Calendar,
  BookOpen,
  FileText,
  Bell,
  Image as ImageIcon,
} from "lucide-react";

// async function getStats() {
//   try {

//     const res = await fetch(`/api/admin/stats`);
//     if (res.ok) {
//       const data = await res.json();
//       return data.data;
//     }
//     return null;
//   } catch (error) {
//     console.error("Error fetching stats:", error);
//     return null;
//   }
// }

export default async function AdminDashboard() {
  // Use direct DB aggregation to render admin stats on the server
  let stats: any = null;
  try {
    await connectDB();
    const [totalMembers, totalEvents, totalPosts, totalRegistrations] = await Promise.all([
      Member.countDocuments({}),
      Event.countDocuments({}),
      Post.countDocuments({ status: 'published' }),
      MemberRegistration.countDocuments({}),
    ]);

    stats = {
      members: totalMembers,
      events: totalEvents,
      posts: totalPosts,
      registrations: totalRegistrations,
    };
  } catch (err) {
    console.error('Error loading admin stats:', err);
  }

  return (
    <div className="text-white">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-white/60">Welcome to the admin dashboard</p>
      </div>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <AnalyticsCard title="Members" value={String(stats.members)} icon={Users} />
          <AnalyticsCard title="Events" value={String(stats.events)} icon={Calendar} />
          <AnalyticsCard title="Posts" value={String(stats.posts)} icon={FileText} />
          <AnalyticsCard title="Registrations" value={String(stats.registrations)} icon={BookOpen} />
        </div>
      )}
    </div>
  );
}
