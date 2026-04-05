"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
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
  ShieldCheck,
  GraduationCap,
  Megaphone,
  Star,
  Mail,
  Palette,
  Award,
  ScrollText,
  HelpCircle,
  MapPin,
} from "lucide-react";
import { signOut } from "next-auth/react";

type MenuItem = {
  href: string;
  label: string;
  icon: React.ElementType;
  permission?: string; // if undefined, always visible to super-admin; managers need explicit permission
  superAdminOnly?: boolean;
};

const ALL_MENU_ITEMS: MenuItem[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, permission: "dashboard" },
  { href: "/admin/members", label: "Team", icon: Users, permission: "members" },
  { href: "/admin/member-registrations", label: "Members", icon: Users, permission: "member-registrations" },
  { href: "/admin/programs", label: "Programs", icon: Calendar, permission: "events" },
  { href: "/admin/research", label: "Research", icon: Paperclip, permission: "research" },
  { href: "/admin/projects", label: "Projects", icon: Layers, permission: "projects" },
  { href: "/admin/posts", label: "Posts", icon: FileText, permission: "posts" },
  { href: "/admin/notices", label: "Notices", icon: Megaphone, permission: "notices" },
  { href: "/admin/certificates", label: "Certificates", icon: Award, permission: "certificates" },
  { href: "/admin/payment", label: "Payment", icon: CreditCard, permission: "payment" },
  { href: "/admin/sponsors", label: "Sponsors", icon: Star, permission: "sponsors" },
  { href: "/admin/hall-of-fame", label: "Hall of Fame", icon: GraduationCap, permission: "hall-of-fame" },
  { href: "/admin/settings/homepage", label: "Homepage Content", icon: ImageIcon, superAdminOnly: true },
  { href: "/admin/content-pages", label: "Content Pages", icon: ScrollText, superAdminOnly: true },
  { href: "/admin/faq", label: "FAQ", icon: HelpCircle, superAdminOnly: true },
  { href: "/admin/contact-us", label: "Contact Us", icon: MapPin, superAdminOnly: true },
  { href: "/admin/settings/smtp", label: "SMTP Config", icon: Mail, superAdminOnly: true },
  { href: "/admin/settings/admins", label: "Manage Admins", icon: ShieldCheck, superAdminOnly: true },
  { href: "/admin/settings", label: "Settings", icon: Settings, superAdminOnly: true },
  { href: "/admin/photo-templates", label: "Photo Templates", icon: Palette, permission: "photo-templates" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();

  const role = (session?.user as any)?.role ?? "";
  const permissions: string[] = (session?.user as any)?.permissions ?? [];
  const isSuperAdmin = role === "super-admin";

  const visibleItems = ALL_MENU_ITEMS.filter((item) => {
    if (isSuperAdmin) return true;
    if (item.superAdminOnly) return false;
    if (item.permission) return permissions.includes(item.permission);
    return false;
  });

  return (
    <>
      {/* ─── Mobile Toggle Button ─────────────────────────────────────────── */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 bg-[rgba(11,31,58,0.85)] backdrop-blur-lg p-3 rounded-xl border border-[rgba(61,181,216,0.15)] shadow-lg"
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
          "bg-[rgba(11,31,58,0.92)] border-r border-[rgba(61,181,216,0.12)] backdrop-blur-xl shadow-2xl",
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          {/* ── Fixed Top: Logo + Role Badge ── */}
          <div className="p-6 pb-3 flex-shrink-0">
            <div className="flex items-center justify-between mb-5">
              <Link href="/admin" className="flex items-center space-x-2">
                <div className="w-10 h-10 rounded-lg bg-[rgba(61,181,216,0.1)] border border-[rgba(61,181,216,0.2)] flex items-center justify-center shadow-lg shadow-[rgba(0,229,255,0.1)]">
                  <Image
                    src="/diurc_logo.png"
                    alt="Daffodil International University Robotics Club"
                    width={32}
                    height={32}
                    className="object-contain"
                    priority
                  />
                </div>
                <span className="text-xl font-semibold tracking-wide bg-gradient-to-r from-[#3DB5D8] to-[#3DB5D8] bg-clip-text text-transparent">
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

            {/* Role Badge */}
            <div className="px-1">
              <span className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold",
                isSuperAdmin
                  ? "bg-[rgba(0,229,255,0.12)] text-[#3DB5D8] ring-1 ring-[rgba(0,229,255,0.3)]"
                  : "bg-[rgba(61,181,216,0.12)] text-[#3DB5D8] ring-1 ring-[rgba(61,181,216,0.3)]"
              )}>
                <ShieldCheck size={12} />
                {isSuperAdmin ? "Super Admin" : "Manager"}
              </span>
            </div>
          </div>

          {/* ── Scrollable Nav ── */}
          <nav className="flex-1 overflow-y-auto px-6 py-3 space-y-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
            {visibleItems.map((item) => {
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
                      ? "bg-gradient-to-r from-[#2F6BFF]/15 to-[#5B4BFF]/10 text-[#3DB5D8] ring-1 ring-[#2F6BFF]/30"
                      : "text-[#8ED6E6]/60 hover:bg-[rgba(61,181,216,0.06)] hover:text-[#8ED6E6]"
                  )}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* ── Fixed Bottom: Logout ── */}
          <div className="p-6 pt-4 flex-shrink-0 border-t border-white/10">
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
