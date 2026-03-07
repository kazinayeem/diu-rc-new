"use client";

import React, { useEffect, useState, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { Bell, Search, User, LogOut, UserCircle } from "lucide-react";
import Link from "next/link";

export default function Topbar() {
  const { data: session } = useSession();
  const [query, setQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const event = new CustomEvent("admin-search", { detail: query });
    window.dispatchEvent(event);
  }, [query]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className="hidden md:block sticky top-0 z-40 bg-[rgba(2,24,37,0.85)] backdrop-blur-xl border-b border-[rgba(61,181,216,0.1)] shadow-lg">
      <div className="ml-64 px-6 py-4">
        <div className="flex items-center justify-between">
          {/* SEARCH BAR */}
          <div className="flex-1 max-w-xl">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3DB5D8]/40"
              />
            </div>
          </div>

          {/* RIGHT ACTIONS */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="p-2 text-slate-300 hover:bg-white/5 rounded-xl transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#3DB5D8] rounded-full"></span>
            </button>

            {/* USER PROFILE DROPDOWN */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((v) => !v)}
                className="flex items-center space-x-3 focus:outline-none group"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-[#3DB5D8] to-[#2F6BFF] rounded-full flex items-center justify-center text-[#0B1F3A] font-semibold shadow-lg shadow-black/40 group-hover:ring-2 group-hover:ring-cyan-400/50 transition-all">
                  {session?.user?.name?.charAt(0)?.toUpperCase() || (
                    <User size={20} />
                  )}
                </div>

                <div className="hidden lg:block text-left">
                  <p className="text-sm font-semibold text-slate-100">
                    {session?.user?.name || "Admin"}
                  </p>
                  <p className="text-xs text-slate-400">
                    {session?.user?.email || ""}
                  </p>
                </div>
              </button>

              {/* Dropdown */}
              {dropdownOpen && (
                <div className="absolute right-0 top-12 w-48 bg-[#0f1c2e] border border-white/10 rounded-xl shadow-2xl shadow-black/50 overflow-hidden z-50">
                  <Link
                    href="/admin/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-slate-200 hover:bg-white/5 transition-colors"
                  >
                    <UserCircle size={16} className="text-cyan-400" />
                    Profile
                  </Link>
                  <div className="border-t border-white/10" />
                  <button
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
