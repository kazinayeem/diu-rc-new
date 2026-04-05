"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AlertCircle, CheckCircle, Info, Loader } from "lucide-react";
import Link from "next/link";
import NoticeModal from "@/components/public/NoticeModal";

interface Notice {
  _id: string;
  title: string;
  content: string;
  type: "general" | "important" | "urgent";
  priority: number;
  attachment?: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: {
    name: string;
    email: string;
  };
}

export default function NoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/notices?limit=50");
      const data = await response.json();

      if (data.success) {
        setNotices(data.data || []);
      } else {
        setError("Failed to load notices");
      }
    } catch (err) {
      console.error("Error fetching notices:", err);
      setError("Failed to load notices");
    } finally {
      setLoading(false);
    }
  };

  const openModal = (notice: Notice) => {
    setSelectedNotice(notice);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedNotice(null);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "urgent":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case "important":
        return <AlertCircle className="w-5 h-5 text-amber-500" />;
      case "general":
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case "urgent":
        return "bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-400";
      case "important":
        return "bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-400";
      case "general":
      default:
        return "bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-400";
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0B1F3A] text-black dark:text-white">
      {/* Hero Section */}
      <section className="py-20 text-center bg-gray-50 dark:bg-transparent border-b border-gray-200 dark:border-white/10">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Notices</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xl mx-auto">
          Stay updated with important announcements, events, and updates from DIU Robotics Club
        </p>
      </section>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-16">
        {/* Error State */}
        {error && (
          <div className="mb-8 p-4 bg-red-100 dark:bg-red-500/20 border border-red-300 dark:border-red-400 rounded-lg text-red-700 dark:text-red-300 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader className="w-8 h-8 animate-spin text-cyan-400" />
          </div>
        ) : notices.length === 0 ? (
          /* Empty State */
          <div className="text-center py-20">
            <CheckCircle className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              No active notices at the moment
            </p>
            <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
              Check back later for updates
            </p>
          </div>
        ) : (
          /* Notices List */
          <div className="space-y-4">
            {notices.map((notice, index) => (
              <motion.div
                key={notice._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => openModal(notice)}
                className="group p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-cyan-400 dark:hover:border-cyan-400 hover:shadow-lg dark:hover:shadow-cyan-500/10 transition-all cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="flex-shrink-0 pt-1">
                    {getTypeIcon(notice.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors truncate">
                        {notice.title}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getTypeBadgeColor(
                          notice.type
                        )}`}
                      >
                        {notice.type.charAt(0).toUpperCase() + notice.type.slice(1)}
                      </span>
                    </div>

                    {/* Preview */}
                    <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-3">
                      {notice.content}
                    </p>

                    {/* Meta */}
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500">
                      <time dateTime={notice.createdAt}>
                        {formatDate(notice.createdAt)}
                      </time>
                      <span className="text-cyan-600 dark:text-cyan-400 group-hover:text-cyan-700 dark:group-hover:text-cyan-300 font-semibold transition-colors">
                        Read more →
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* Notice Modal */}
      <NoticeModal notice={selectedNotice} isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
}
