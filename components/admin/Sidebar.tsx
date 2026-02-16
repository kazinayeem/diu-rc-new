"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Calendar,
  BookOpen,
  Bell,
  FileText,
  Image as ImageIcon,
  Settings,
  LogOut,
  Menu,
  X,
  Paperclip,
  Layers,
  CreditCard,
} from "lucide-react";
import { signOut } from "next-auth/react";

const menuItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/members", label: "Team", icon: Users },
  {
    href: "/admin/member-registrations",
    label: "Members",
    icon: Users,
  },
  { href: "/admin/events", label: "Events", icon: Calendar },
  { href: "/admin/research", label: "Research", icon: Paperclip },
  { href: "/admin/payment", label: "Payment", icon: CreditCard },
  { href: "/admin/projects", label: "Projects", icon: Layers },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* ─── Mobile Toggle Button ─────────────────────────────────────────── */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 bg-[#0f172a]/80 backdrop-blur-lg p-3 rounded-xl border border-white/10 shadow-lg"
      >
        <Menu size={22} className="text-slate-100" />
      </button>

      {/* ─── Overlay for Mobile ───────────────────────────────────────────── */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      {/* ─── Sidebar (Mobile + Desktop) ───────────────────────────────────── */}
      <aside
        className={cn(
          "fixed left-0 top-0 w-64 h-full text-slate-100 z-50 transition-transform duration-300",
          "bg-[#0f172a]/90 border-r border-white/10 backdrop-blur-xl shadow-2xl",
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="p-6">
          {/* Top Logo */}
          <div className="flex items-center justify-between mb-8">
            <Link href="/admin" className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shadow-lg shadow-black/30">
                <Image
                  src="/diurc_logo.png"
                  alt="DIU Robotics Club"
                  width={32}
                  height={32}
                  className="object-contain"
                  priority
                />
              </div>
              <span className="text-xl font-semibold tracking-wide text-amber-200">
                DIU RC Admin
              </span>
            </Link>

            {/* Mobile Close Button */}
            <button
              onClick={() => setOpen(false)}
              className="md:hidden p-2 rounded-lg bg-white/10 border border-white/10"
            >
              <X size={22} />
            </button>
          </div>

          {/* Menu Items */}
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href || pathname?.startsWith(item.href + "/");

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors",
                    isActive
                      ? "bg-emerald-400/15 text-emerald-100 ring-1 ring-emerald-300/20"
                      : "text-slate-300 hover:bg-white/5 hover:text-slate-100"
                  )}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Logout Button */}
          <div className="mt-10 pt-6 border-t border-white/10">
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="flex items-center space-x-3 px-4 py-3 w-full rounded-xl text-slate-300 hover:bg-white/5 hover:text-slate-100 transition-colors"
            >
              <LogOut size={20} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
