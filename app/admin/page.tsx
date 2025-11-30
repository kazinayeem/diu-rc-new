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
  // const stats = await getStats();

  return (
    <div className="text-white">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-white/60">Welcome to the admin dashboard</p>
      </div>
    </div>
  );
}
