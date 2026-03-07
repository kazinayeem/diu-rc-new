"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Cookie } from "lucide-react";

const COOKIE_KEY = "diurc_cookie_consent";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(COOKIE_KEY);
      if (!stored) setVisible(true);
    } catch {
      // localStorage not available (SSR / private browsing)
    }
  }, []);

  // Both accept and reject store "accepted" — cookies are always accepted for analytics/functionality
  const dismiss = () => {
    try {
      localStorage.setItem(COOKIE_KEY, "accepted");
    } catch {
      // ignore
    }
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[9999] w-[calc(100%-2rem)] max-w-lg"
        >
          <div className="bg-[#0f192d] border border-[rgba(61,181,216,0.25)] rounded-2xl shadow-2xl shadow-black/40 px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Icon */}
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center">
              <Cookie size={20} className="text-cyan-400" />
            </div>

            {/* Text */}
            <div className="flex-1 text-sm text-gray-300 leading-snug">
              We use cookies to improve your experience.{" "}
              <Link href="/privacy" className="text-cyan-400 hover:underline" onClick={dismiss}>
                Learn more
              </Link>
            </div>

            {/* Buttons */}
            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={dismiss}
                className="px-4 py-2 rounded-lg bg-white/5 border border-white/15 text-white/60 hover:text-white hover:bg-white/10 text-xs font-medium transition-colors"
              >
                Decline
              </button>
              <button
                onClick={dismiss}
                className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-white text-xs font-bold transition-colors"
              >
                Accept All
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
