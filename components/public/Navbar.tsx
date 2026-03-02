"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showEventDropdown, setShowEventDropdown] = useState(false);
  const [showMobileEventDropdown, setShowMobileEventDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/events", label: "Events" },
    { href: "/teams", label: "Team & Members" },
    { href: "/projects", label: "Projects" },
    { href: "/workshops", label: "Workshops" },
    { href: "/publications", label: "Publications" },
  ];

  const eventDropdown = [
    { href: "/events", label: "Events" },
    { href: "/seminars", label: "Seminars" },
    { href: "/workshops", label: "Workshops" },
    { href: "/bootcamp", label: "Bootcamp" },
  ];

  return (
    <nav
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-500 border-b backdrop-blur-xl mt-[40px]",
        !scrolled && "bg-transparent border-transparent shadow-none",
        scrolled &&
          "bg-[rgba(2,29,46,0.88)] border-[rgba(76,201,240,0.15)] shadow-[0_4px_30px_rgba(0,229,255,0.08)]"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-[rgba(63,182,214,0.08)] border border-[rgba(76,201,240,0.2)] flex items-center justify-center shadow-[0_0_16px_rgba(76,201,240,0.15)] group-hover:shadow-[0_0_24px_rgba(0,229,255,0.3)] transition-all duration-300">
              <Image
                src="/diurc_logo.png"
                alt="DIU Robotics Club"
                width={32}
                height={32}
                className="object-contain"
                priority
              />
            </div>
            <span className="text-base font-bold tracking-wide bg-gradient-to-r from-[#4CC9F0] to-[#3FB6D6] bg-clip-text text-transparent group-hover:from-[#00E5FF] group-hover:to-[#4CC9F0] transition-all duration-300">
              DIU Robotics Club
            </span>
          </Link>

          {/* DESKTOP NAV */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => 
              link.label === "Events" ? (
                <div
                  key={link.href}
                  className="relative group"
                  onMouseEnter={() => setShowEventDropdown(true)}
                  onMouseLeave={() => setShowEventDropdown(false)}
                >
                  <button className="flex items-center gap-1 text-[#90E0EF]/80 hover:text-[#00E5FF] text-sm font-medium transition-all duration-200 hover:drop-shadow-[0_0_8px_rgba(0,229,255,0.6)] group-hover:text-[#00E5FF]">
                    {link.label}
                    <ChevronDown 
                      size={16} 
                      className={cn(
                        "transition-transform duration-300",
                        showEventDropdown && "rotate-180"
                      )}
                    />
                  </button>

                  {/* DROPDOWN MENU */}
                  <div
                    className={cn(
                      "absolute top-full left-0 mt-2 w-48 bg-[rgba(2,29,46,0.95)] border border-[rgba(76,201,240,0.2)] rounded-lg shadow-lg backdrop-blur-xl transition-all duration-300 z-50",
                      showEventDropdown ? "opacity-100 visible translate-y-0" : "opacity-0 invisible translate-y-2 pointer-events-none"
                    )}
                  >
                    <div className="py-2">
                      {eventDropdown.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="block px-4 py-2.5 text-[#90E0EF] hover:text-[#00E5FF] hover:bg-[rgba(76,201,240,0.1)] text-sm font-medium transition-all duration-200"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-[#90E0EF]/80 hover:text-[#00E5FF] text-sm font-medium transition-all duration-200 hover:drop-shadow-[0_0_8px_rgba(0,229,255,0.6)]"
                >
                  {link.label}
                </Link>
              )
            )}
            
            {/* HIGHLIGHTED JOIN BUTTON */}
            <Link
              href="/join"
              className="px-6 py-2.5 bg-gradient-to-r from-[#4361EE] to-[#3A0CA3] hover:from-[#00E5FF] hover:to-[#4CC9F0] text-white text-sm font-semibold rounded-lg transition-all duration-300 shadow-lg shadow-[#4361EE]/50 hover:shadow-[#00E5FF]/50 transform hover:scale-105 border border-[rgba(67,97,238,0.3)] hover:border-[rgba(0,229,255,0.5)]"
            >
              Join Us
            </Link>
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-xl text-[#90E0EF] hover:bg-[rgba(76,201,240,0.08)] border border-transparent hover:border-[rgba(76,201,240,0.2)] transition-all"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* MOBILE NAV */}
        <div
          className={cn(
            "md:hidden transition-all duration-300 ease-in-out bg-[rgba(2,29,46,0.96)] backdrop-blur-2xl border-t border-[rgba(76,201,240,0.1)] rounded-b-2xl",
            isOpen ? "max-h-96 opacity-100 py-4" : "max-h-0 opacity-0 overflow-hidden"
          )}
        >
          <div className="space-y-1 px-2">
            {navLinks.map((link) => 
              link.label === "Events" ? (
                <div key={link.href}>
                  <button
                    onClick={() => setShowMobileEventDropdown(!showMobileEventDropdown)}
                    className="w-full flex items-center justify-between px-4 py-3 text-[#90E0EF] hover:bg-[rgba(76,201,240,0.07)] hover:text-[#00E5FF] rounded-xl text-sm font-medium transition-all"
                  >
                    {link.label}
                    <ChevronDown 
                      size={16} 
                      className={cn(
                        "transition-transform duration-300",
                        showMobileEventDropdown && "rotate-180"
                      )}
                    />
                  </button>
                  {showMobileEventDropdown && (
                    <div className="pl-4 space-y-1">
                      {eventDropdown.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => {
                            setIsOpen(false);
                            setShowMobileEventDropdown(false);
                          }}
                          className="block px-4 py-3 text-[#90E0EF] hover:bg-[rgba(76,201,240,0.07)] hover:text-[#00E5FF] rounded-xl text-sm font-medium transition-all ml-2 border-l border-[rgba(76,201,240,0.3)]"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 text-[#90E0EF] hover:bg-[rgba(76,201,240,0.07)] hover:text-[#00E5FF] rounded-xl text-sm font-medium transition-all"
                >
                  {link.label}
                </Link>
              )
            )}
            
            {/* MOBILE JOIN BUTTON */}
            <Link
              href="/join"
              onClick={() => setIsOpen(false)}
              className="block mx-2 mt-4 px-4 py-3 bg-gradient-to-r from-[#4361EE] to-[#3A0CA3] hover:from-[#00E5FF] hover:to-[#4CC9F0] text-white text-sm font-semibold rounded-lg text-center transition-all duration-300 shadow-lg shadow-[#4361EE]/50 hover:shadow-[#00E5FF]/50 border border-[rgba(67,97,238,0.3)] hover:border-[rgba(0,229,255,0.5)]"
            >
              Join Us
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
