"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, AlertCircle, CheckCircle, Loader } from "lucide-react";
import { Button } from "@/components/ui/Button";
import dynamic from "next/dynamic";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["blockquote", "code-block"],
    [{ align: [] }],
    ["link"],
    ["clean"],
  ],
};

interface ContentPageEditorProps {
  slug: "terms" | "privacy" | "refunds";
  title: string;
}

export default function ContentPageEditor({ slug, title }: ContentPageEditorProps) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchContent();
  }, [slug]);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/content-pages?slug=${slug}`);
      const data = await response.json();

      if (data.success && data.data) {
        setContent(data.data.content);
      } else if (response.status === 404) {
        // Page doesn't exist yet - start with empty content
        setContent("");
      } else {
        // Other errors
        setError("Failed to load content");
      }
    } catch (err: any) {
      console.error("Error fetching content:", err);
      // Don't show error on fetch fail - user can still create new content
      setContent("");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!content.trim()) {
      setError("Content cannot be empty");
      return;
    }

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const method = "PUT";
      const url = `/api/content-pages?slug=${slug}`;

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess("Content saved successfully!");
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(data.error || "Failed to save content");
      }
    } catch (err: any) {
      setError(err.message || "Failed to save content");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="w-8 h-8 animate-spin text-cyan-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {title}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Edit and manage {title.toLowerCase()} page content
          </p>
        </div>
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-cyan-600 hover:bg-cyan-700 text-white flex items-center gap-2"
        >
          {saving ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      {/* Error and Success Messages */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-100 dark:bg-red-500/20 border border-red-300 dark:border-red-400 rounded-lg flex items-center gap-3 text-red-700 dark:text-red-300"
        >
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </motion.div>
      )}

      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-green-100 dark:bg-green-500/20 border border-green-300 dark:border-green-400 rounded-lg flex items-center gap-3 text-green-700 dark:text-green-300"
        >
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <span>{success}</span>
        </motion.div>
      )}

      {/* Editor */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <ReactQuill
          value={content}
          onChange={setContent}
          modules={modules}
          theme="snow"
          placeholder="Enter content here..."
          style={{
            height: "500px",
            marginBottom: "50px",
          }}
        />
      </div>
    </div>
  );
}
