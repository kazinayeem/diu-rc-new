"use client";

import React from "react";
import { Play } from "lucide-react";

interface ClubVideoPreviewProps {
  videoUrl: string;
  title?: string;
}

const ClubVideoPreview: React.FC<ClubVideoPreviewProps> = ({
  videoUrl,
  title = "Daffodil International University Robotics Club - Dreaming of building the future",
}) => {
  const getYouTubeVideoId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const videoId = getYouTubeVideoId(videoUrl);
  if (!videoId) return null;

  return (
    <section className="relative py-14 bg-[#0B1F3A] overflow-hidden">
      <div className="relative max-w-3xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="text-center mb-7">
          <div className="inline-flex items-center gap-2 bg-cyan-500/8 border border-cyan-500/15 px-3.5 py-1.5 rounded-full mb-4">
            <Play size={13} className="text-cyan-400" fill="currentColor" />
            <span className="text-xs font-semibold text-cyan-400 tracking-[0.12em] uppercase">
              Watch Our Journey
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white leading-snug mb-2">
            Dreaming of Building the Future
          </h2>
          <p className="text-sm text-white/40 max-w-md mx-auto">
            Discover how we're shaping the future through innovation, collaboration, and cutting-edge robotics.
          </p>
        </div>

        {/* Video */}
        <div className="relative rounded-2xl overflow-hidden border border-white/8 shadow-[0_8px_40px_rgba(0,0,0,0.5)]">
          {/* Subtle glow border */}
          <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-cyan-500/20 via-transparent to-blue-500/10 pointer-events-none z-10" />
          <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src={`https://www.youtube.com/embed/${videoId}`}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>

      </div>
    </section>
  );
};

export default ClubVideoPreview;
