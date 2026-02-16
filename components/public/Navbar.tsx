"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
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
            <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shadow-[0_8px_20px_rgba(0,0,0,0.35)] group-hover:shadow-[0_10px_24px_rgba(0,0,0,0.45)] transition-all">
              <Image
                src="/diurc_logo.png"
                alt="DIU Robotics Club"
                width={32}
                height={32}
                className="object-contain"
                priority
              />
            </div>
            <span className="text-lg font-semibold text-amber-200 group-hover:text-amber-100 transition-colors">
              DIU Robotics Club
            </span>
          </Link>

          {/* DESKTOP NAV */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-slate-200/80 hover:text-amber-100 transition-all"
              >
                {link.label}
              </Link>
            ))}

          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-slate-200 hover:bg-white/10 transition"
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
                className="block px-4 py-3 text-slate-200 hover:bg-white/10 hover:text-amber-100 rounded-lg transition-all"
              >
                {link.label}
              </Link>
            ))}

          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
