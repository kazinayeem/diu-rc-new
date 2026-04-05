"use client";

import React, { useState, useEffect } from "react";
import { Loader, AlertCircle } from "lucide-react";

// Decode HTML entities - runs in client context
const decodeHTML = (html: string): string => {
  if (!html) return "";
  if (typeof document === "undefined") return html; // Fallback for server
  const textArea = document.createElement("textarea");
  textArea.innerHTML = html;
  return textArea.value || html;
};

interface ContentPageRendererProps {
  slug: "terms" | "privacy" | "refunds";
  title: string;
  defaultContent?: React.ReactNode;
}

export default function ContentPageRenderer({
  slug,
  title,
  defaultContent,
}: ContentPageRendererProps) {
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchContent();
  }, [slug]);

  const fetchContent = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/content-pages?slug=${slug}`);
      const data = await response.json();

      if (data.success && data.data) {
        // Decode HTML entities if needed
        let contentText = data.data.content;
        const textArea = document.createElement("textarea");
        textArea.innerHTML = contentText;
        contentText = textArea.value;
        setContent(contentText);
      } else {
        // No content in database, use default
        setContent("");
      }
    } catch (err: any) {
      console.error(`Error fetching ${slug} content:`, err);
      setError("Failed to load content");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader className="w-8 h-8 animate-spin text-cyan-600 dark:text-cyan-400" />
      </div>
    );
  }

  if (error && !defaultContent) {
    return (
      <div className="p-4 bg-red-100 dark:bg-red-500/20 border border-red-300 dark:border-red-400 rounded-lg text-red-700 dark:text-red-300 flex items-center gap-3">
        <AlertCircle className="w-5 h-5 flex-shrink-0" />
        <span>{error}</span>
      </div>
    );
  }

  // Use database content if available, otherwise fall back to default
  if (content) {
    return (
      <div className="prose dark:prose-invert max-w-4xl mx-auto px-6 py-16 space-y-6">
        <div
          className="text-gray-700 dark:text-gray-300 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    );
  }

  // Fall back to default content
  return <>{defaultContent}</>;
}
