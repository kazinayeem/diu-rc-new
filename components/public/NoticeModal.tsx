"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

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

interface NoticeModalProps {
  notice: Notice | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function NoticeModal({ notice, isOpen, onClose }: NoticeModalProps) {
  if (!notice) return null;

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
      month: "long",
      day: "numeric",
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 dark:bg-black/70 z-40"
          />

          {/* Flex Container for Centering */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 pointer-events-none">
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto pointer-events-auto"
            >
            {/* Header */}
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-start justify-between">
              <div className="flex-1 pr-4">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white truncate">
                    {notice.title}
                  </h2>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getTypeBadgeColor(
                      notice.type
                    )}`}
                  >
                    {notice.type.charAt(0).toUpperCase() + notice.type.slice(1)}
                  </span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="flex-shrink-0 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Metadata */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Posted On</p>
                  <p>{formatDate(notice.createdAt)}</p>
                </div>
                {notice.createdBy && (
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">Posted By</p>
                    <p>{notice.createdBy.name}</p>
                  </div>
                )}
              </div>

              {/* Notice Content */}
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                  {notice.content}
                </p>
              </div>

              {/* Attachment */}
              {notice.attachment && (
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                  <a
                    href={notice.attachment}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-cyan-600 dark:text-cyan-400 hover:underline font-semibold"
                  >
                    📎 View Attachment
                  </a>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 p-6">
              <button
                onClick={onClose}
                className="w-full px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
