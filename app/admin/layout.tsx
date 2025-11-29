import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Sidebar from "@/components/admin/Sidebar";
import Topbar from "@/components/admin/Topbar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-[#071024] bg-gradient-to-br from-[#071024] via-[#082135] to-[#0e2840] text-white">
      <Sidebar />

      {/* MAIN CONTENT WRAPPER */}
      <div className="md:ml-64">
        {/* Topbar only on desktop */}
        <div className="hidden md:block">
          <Topbar />
        </div>

        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
