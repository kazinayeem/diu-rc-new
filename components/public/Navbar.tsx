"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/providers/ThemeProvider";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, setTheme, isDark } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/events", label: "Events" },
    { href: "/teams", label: "Teams" },
    { href: "/members", label: "Members" },
    { href: "/projects", label: "Projects" },
    { href: "/workshops", label: "Workshops" },
    { href: "/publications", label: "Publications" },
    { href: "/join", label: "Join Us" },
  ];

  return (
    <nav
      className={cn(
        "sticky top-0 z-[100] w-full transition-all duration-500 border-b backdrop-blur-xl",

        
        !scrolled && "bg-transparent border-white/5 shadow-none",

        
        scrolled &&
          "bg-gradient-to-br from-[#071024]/90 via-[#082135]/90 to-[#0e2840]/90 border-white/20 shadow-[0_0_35px_rgba(0,255,255,0.15)]"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-cyan-700 rounded-lg flex items-center justify-center shadow-[0_0_12px_rgba(0,255,255,0.4)] group-hover:shadow-[0_0_20px_rgba(0,255,255,0.7)] transition-all">
              <span className="text-white font-bold text-xl">RC</span>
            </div>
            <span className="text-lg font-bold text-cyan-200 group-hover:text-white transition-colors">
              DIU Robotics Club
            </span>
          </Link>

          {/* DESKTOP NAV */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-cyan-200/80 hover:text-white transition-all hover:drop-shadow-[0_0_10px_#38e8ff]"
              >
                {link.label}
              </Link>
            ))}

            {/* THEME TOGGLE */}
            <button
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className="p-2 rounded-lg text-cyan-200 hover:bg-white/10 transition"
              title={`Switch to ${isDark ? "light" : "dark"} mode`}
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <Link
              href="/login"
              className="px-4 py-2 bg-cyan-500 text-black font-semibold rounded-lg hover:bg-cyan-400 transition shadow-[0_0_12px_rgba(0,255,255,0.3)]"
            >
              Admin
            </Link>
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-cyan-200 hover:bg-white/10 transition"
          >
            {isOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>

        {/* MOBILE NAVIGATION */}
        <div
          className={cn(
            "md:hidden transition-all duration-300 ease-in-out backdrop-blur-xl bg-[#071024]/95 rounded-b-xl",
            isOpen
              ? "max-h-96 opacity-100 py-4"
              : "max-h-0 opacity-0 overflow-hidden"
          )}
        >
          <div className="space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 text-cyan-200 hover:bg-white/10 hover:text-white rounded-lg transition-all"
              >
                {link.label}
              </Link>
            ))}

            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className="block mx-4 mt-2 px-4 py-2 bg-cyan-500 text-black text-center rounded-lg font-semibold hover:bg-cyan-400 transition"
            >
              Admin
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
