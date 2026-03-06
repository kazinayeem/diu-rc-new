"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Bell, Search, User } from "lucide-react";

export default function Topbar() {
  const { data: session } = useSession();
  const [query, setQuery] = useState("");

  useEffect(() => {
    const event = new CustomEvent("admin-search", { detail: query });
    window.dispatchEvent(event);
  }, [query]);

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

            {/* USER PROFILE */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#3DB5D8] to-[#2F6BFF] rounded-full flex items-center justify-center text-[#0B1F3A] font-semibold shadow-lg shadow-black/40">
                {session?.user?.name?.charAt(0)?.toUpperCase() || (
                  <User size={20} />
                )}
              </div>

              <div className="hidden lg:block">
                <p className="text-sm font-semibold text-slate-100">
                  {session?.user?.name || "Admin"}
                </p>
                <p className="text-xs text-slate-400">
                  {session?.user?.email || ""}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
