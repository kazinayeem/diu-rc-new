"use client";

import React from "react";
import { Play } from "lucide-react";

interface ClubVideoPreviewProps {
  videoUrl: string;
  title?: string;
}

const ClubVideoPreview: React.FC<ClubVideoPreviewProps> = ({
  videoUrl,
  title = "DIU Robotics Club - Dreaming of building the future",
}) => {
  // Extract YouTube video ID from URL
  const getYouTubeVideoId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const videoId = getYouTubeVideoId(videoUrl);

  if (!videoId) {
    return null;
  }

  const embedUrl = `https://www.youtube.com/embed/${videoId}`;

  return (
    <section className="relative py-20 bg-gradient-to-br from-[#071024] via-[#082135] to-[#0e2840] overflow-hidden">
      {/* Background Grid */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            "linear-gradient(#12324b 1px, transparent 1px), linear-gradient(90deg, #12324b 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-cyan-500/10 backdrop-blur-md px-4 py-2 rounded-full mb-4 border border-cyan-500/20">
            <Play size={18} className="text-cyan-400 animate-pulse" />
            <span className="text-sm font-medium text-cyan-300 tracking-wide">
              Watch Our Journey
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            {title}
          </h2>
          <p className="text-cyan-200/80 text-lg max-w-2xl mx-auto">
            Discover how we're shaping the future through innovation, collaboration, and cutting-edge robotics
          </p>
        </div>

        {/* Video Container */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
          <div className="relative bg-black/50 backdrop-blur-sm rounded-xl overflow-hidden border border-cyan-500/20 shadow-2xl">
            <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src={embedUrl}
                title={title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>

        {/* Stats or CTA (Optional) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12 text-center">
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
            <div className="text-3xl font-bold text-cyan-400 mb-2">500+</div>
            <div className="text-white/70 text-sm">Active Members</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
            <div className="text-3xl font-bold text-cyan-400 mb-2">50+</div>
            <div className="text-white/70 text-sm">Projects Completed</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
            <div className="text-3xl font-bold text-cyan-400 mb-2">20+</div>
            <div className="text-white/70 text-sm">Competitions Won</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClubVideoPreview;
