import React from "react";
import { Space_Grotesk } from "next/font/google";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Sidebar from "@/components/admin/Sidebar";
import Topbar from "@/components/admin/Topbar";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

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
    <div
      className={`min-h-screen relative overflow-hidden text-slate-100 ${spaceGrotesk.className} bg-[#0b1117]`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(1200px_circle_at_0%_0%,_rgba(34,197,94,0.18),_transparent_55%),radial-gradient(900px_circle_at_100%_10%,_rgba(14,165,233,0.16),_transparent_45%),linear-gradient(180deg,_rgba(15,23,42,0.9)_0%,_rgba(10,15,20,1)_100%)]" />
      <div className="pointer-events-none absolute -top-32 right-[-10%] h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-12%] left-[-5%] h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="relative">
        <Sidebar />

        {/* MAIN CONTENT WRAPPER */}
        <div className="md:ml-64">
          {/* Topbar only on desktop */}
          <div className="hidden md:block">
            <Topbar />
          </div>

          <main className="p-6 animate-fade-in">{children}</main>
        </div>
      </div>
    </div>
  );
}
