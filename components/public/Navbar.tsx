"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/teams", label: "Team" },
  { href: "/projects", label: "Projects" },
  { href: "/publications", label: "Publications" },
  { href: "/verify", label: "Verify" },
];

const EVENT_LINKS = [
  { href: "/events", label: "Events" },
  { href: "/seminars", label: "Seminars" },
  { href: "/workshops", label: "Workshops" },
  { href: "/bootcamp", label: "Bootcamp" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [eventsOpen, setEventsOpen] = useState(false);
  const [mobileEventsOpen, setMobileEventsOpen] = useState(false);
  const eventsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (eventsRef.current && !eventsRef.current.contains(e.target as Node))
        setEventsOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setMobileEventsOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);
  const isEventsActive = EVENT_LINKS.some((l) => pathname.startsWith(l.href));

  return (
    <nav
      className={cn(
        "w-full transition-all duration-300",
        scrolled
          ? "bg-[#0B1F3A]/85 backdrop-blur-2xl border-b border-white/[0.10] shadow-[0_4px_30px_rgba(0,0,0,0.45)]"
          : "bg-[#0B1F3A]/30 backdrop-blur-xl border-b border-white/[0.06]"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* ── Logo ─────────────────────────────── */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group">
            <div className="relative h-9 w-28 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center px-2 transition-all duration-300 group-hover:border-cyan-400/50 group-hover:bg-cyan-500/15 group-hover:shadow-[0_0_16px_rgba(34,211,238,0.25)]">
              <Image
                src="/diurc_logo_rec.png"
                alt="DIURC"
                width={96}
                height={28}
                className="object-contain w-full h-full"
                priority
              />
            </div>
            <div className="leading-tight">
              <span className="block text-[14px] font-bold text-white tracking-wide group-hover:text-cyan-300 transition-colors duration-200">
                DIU Robotics Club
              </span>
              <span className="block text-[10px] text-cyan-400/60 tracking-[0.1em] font-medium">
                Innovation &amp; Automation
              </span>
            </div>
          </Link>

          {/* ── Desktop Nav ──────────────────────── */}
          <div className="hidden md:flex items-center gap-0.5">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative px-3.5 py-2 text-[15px] font-medium rounded-lg transition-all duration-200",
                  isActive(link.href)
                    ? "text-cyan-300 bg-cyan-500/[0.08]"
                    : "text-white/55 hover:text-white hover:bg-white/[0.05]"
                )}
              >
                {link.label}
                {isActive(link.href) && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-cyan-400" />
                )}
              </Link>
            ))}

            {/* Events dropdown */}
            <div ref={eventsRef} className="relative">
              <button
                onClick={() => setEventsOpen((v) => !v)}
                className={cn(
                  "relative flex items-center gap-1 px-3.5 py-2 text-[15px] font-medium rounded-lg transition-all duration-200",
                  isEventsActive
                    ? "text-cyan-300 bg-cyan-500/[0.08]"
                    : "text-white/55 hover:text-white hover:bg-white/[0.05]"
                )}
              >
                Events
                <ChevronDown size={12} className={cn("transition-transform duration-200 opacity-60", eventsOpen && "rotate-180")} />
                {isEventsActive && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-cyan-400" />
                )}
              </button>
              <div className={cn(
                "absolute top-full left-0 mt-1.5 w-40 rounded-xl border border-white/[0.10] bg-[#0B1F3A]/90 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden transition-all duration-200 origin-top-left z-50",
                eventsOpen ? "opacity-100 scale-100 translate-y-0 pointer-events-auto" : "opacity-0 scale-95 -translate-y-1 pointer-events-none"
              )}>
                <div className="p-1.5">
                  {EVENT_LINKS.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setEventsOpen(false)}
                      className={cn(
                        "flex items-center px-3 py-2 rounded-lg text-[14px] font-medium transition-all duration-150",
                        pathname.startsWith(item.href)
                          ? "bg-cyan-500/10 text-cyan-300"
                          : "text-white/60 hover:bg-white/[0.05] hover:text-white"
                      )}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <div className="w-px h-4 bg-white/10 mx-1.5" />

            <Link
              href="/join"
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-white text-[15px] font-semibold transition-all duration-200"
              style={{
                background: "linear-gradient(135deg, #3DB5D8 0%, #2F6BFF 55%, #5B4BFF 100%)",
                boxShadow: "0 0 16px rgba(47,107,255,0.3)",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.boxShadow = "0 0 28px rgba(47,107,255,0.5), 0 0 50px rgba(91,75,255,0.2)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.boxShadow = "0 0 16px rgba(47,107,255,0.3)")}
            >
              <Zap size={12} strokeWidth={2.5} />
              Join Us
            </Link>
          </div>

          {/* ── Mobile toggle ────────────────────── */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="md:hidden p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/[0.05] transition-all duration-200"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* ── Mobile Menu ──────────────────────────── */}
      <div
        className={cn(
          "md:hidden overflow-hidden transition-all duration-300 ease-in-out border-t border-white/[0.06]",
          mobileOpen ? "max-h-[420px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="bg-[#0B1F3A]/95 backdrop-blur-2xl px-4 py-3 space-y-0.5">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
                isActive(link.href)
                  ? "bg-cyan-500/10 text-cyan-300"
                  : "text-white/60 hover:bg-white/[0.05] hover:text-white"
              )}
            >
              {link.label}
            </Link>
          ))}
          <button
            onClick={() => setMobileEventsOpen((v) => !v)}
            className={cn(
              "w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
              isEventsActive
                ? "bg-cyan-500/10 text-cyan-300"
                : "text-white/60 hover:bg-white/[0.05] hover:text-white"
            )}
          >
            Events
            <ChevronDown size={14} className={cn("transition-transform duration-200 opacity-60", mobileEventsOpen && "rotate-180")} />
          </button>
          {mobileEventsOpen && (
            <div className="pl-3 space-y-0.5 border-l border-cyan-500/20 ml-3">
              {EVENT_LINKS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150",
                    pathname.startsWith(item.href) ? "text-cyan-300" : "text-white/50 hover:text-white"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          )}
          <div className="pt-2 pb-1">
            <Link
              href="/join"
              className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl text-white text-sm font-semibold transition-all duration-200"
              style={{ background: "linear-gradient(135deg, #3DB5D8 0%, #2F6BFF 55%, #5B4BFF 100%)" }}
            >
              <Zap size={14} strokeWidth={2.5} />
              Join Us
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
