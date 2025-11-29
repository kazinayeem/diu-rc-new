"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { Bell, Search, User } from "lucide-react";

export default function Topbar() {
  const { data: session } = useSession();

  return (
    // hidden on mobile → only visible on md and above
    <header className="hidden md:block sticky top-0 z-40 bg-white/5 backdrop-blur-xl border-b border-white/10 shadow-lg">
      <div className="ml-64 px-6 py-4">
        <div className="flex items-center justify-between">
          {/* SEARCH BAR */}
          <div className="flex-1 max-w-xl">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50"
                size={20}
              />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#1f8fff]"
              />
            </div>
          </div>

          {/* RIGHT ACTIONS */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="p-2 text-white/70 hover:bg-white/10 rounded-lg transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* USER PROFILE */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#1f8fff] to-[#005bbb] rounded-full flex items-center justify-center text-white font-semibold shadow-lg shadow-black/40">
                {session?.user?.name?.charAt(0)?.toUpperCase() || (
                  <User size={20} />
                )}
              </div>

              <div className="hidden lg:block">
                <p className="text-sm font-medium text-white">
                  {session?.user?.name || "Admin"}
                </p>
                <p className="text-xs text-white/60">
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
