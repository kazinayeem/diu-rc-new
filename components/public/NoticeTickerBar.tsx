"use client";

import { useEffect, useState } from "react";
import { Megaphone, X } from "lucide-react";

interface MarqueeNotice {
  _id: string;
  title: string;
  content: string;
  type: "general" | "important" | "urgent";
}

const typeStyles = {
  urgent: {
    bar: "bg-red-600/90 border-red-500",
    badge: "bg-red-800 text-red-100",
    text: "text-white",
    label: "URGENT",
  },
  important: {
    bar: "bg-orange-500/90 border-orange-400",
    badge: "bg-orange-700 text-orange-100",
    text: "text-white",
    label: "NOTICE",
  },
  general: {
    bar: "bg-cyan-600/80 border-cyan-400",
    badge: "bg-cyan-800 text-cyan-100",
    text: "text-white",
    label: "INFO",
  },
};

export default function NoticeTickerBar() {
  const [notice, setNotice] = useState<MarqueeNotice | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    async function fetchMarquee() {
      try {
        const res = await fetch("/api/notices/marquee", { cache: "no-store" });
        const json = await res.json();
        if (json.success && json.data) {
          setNotice(json.data);
          setDismissed(false);
        }
      } catch {
        // silently fail
      }
    }
    fetchMarquee();

    // Re-poll every 60 seconds so the ticker updates without a page reload
    const interval = setInterval(fetchMarquee, 60_000);
    return () => clearInterval(interval);
  }, []);

  const styles = notice ? (typeStyles[notice.type] ?? typeStyles.general) : typeStyles.general;
  const ticker = notice ? `${notice.title}  —  ${notice.content}` : "";
  const isVisible = notice && !dismissed;

  return (
    <div
      className={`w-full ${isVisible ? styles.bar : 'bg-transparent'} ${isVisible ? 'border-b' : ''} backdrop-blur-sm flex items-center gap-3 pr-3 overflow-hidden transition-all duration-300`}
      style={{ height: isVisible ? "40px" : "0px" }}
    >
      {isVisible && (
        <>
          {/* Label badge */}
          <span
            className={`flex-shrink-0 flex items-center gap-1 px-3 h-full ${styles.badge} text-xs font-bold tracking-widest uppercase`}
          >
            <Megaphone size={13} />
            {styles.label}
          </span>

          {/* Scrolling text */}
          <div className="flex-1 overflow-hidden relative">
            <div className="notice-ticker flex whitespace-nowrap">
              <span className={`${styles.text} text-[13px] font-medium pr-24`}>
                {ticker}
              </span>
              {/* Duplicate for seamless loop */}
              <span className={`${styles.text} text-[13px] font-medium pr-24`} aria-hidden>
                {ticker}
              </span>
            </div>
          </div>

          {/* Dismiss */}
          <button
            onClick={() => setDismissed(true)}
            className="flex-shrink-0 text-white/70 hover:text-white transition-colors"
            aria-label="Dismiss notice"
          >
            <X size={16} />
          </button>
        </>
      )}
    </div>
  );
}
