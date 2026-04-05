"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Edit2, Trash2, AlertCircle, CheckCircle, Loader } from "lucide-react";
import { Button } from "@/components/ui/Button";
import dynamic from "next/dynamic";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

const modules = {
  toolbar: [
    ["bold", "italic", "underline"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link"],
    ["clean"],
  ],
};

interface FAQ {
  _id: string;
  question: string;
  answer: string;
  order: number;
  isActive: boolean;
}

export default function FAQManagement() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    order: 0,
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/faq");
      const data = await response.json();

      if (data.success) {
        setFaqs(data.data);
      }
    } catch (err: any) {
      console.error("Error fetching FAQs:", err);
      setError("Failed to load FAQs");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!formData.question.trim() || !formData.answer.trim()) {
      setError("Question and answer are required");
      return;
    }

    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `/api/faq?id=${editingId}` : "/api/faq";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(editingId ? "FAQ updated successfully" : "FAQ created successfully");
        resetForm();
        await fetchFAQs();
      } else {
        setError(data.error || "Failed to save FAQ");
      }
    } catch (err: any) {
      setError(err.message || "Failed to save FAQ");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this FAQ?")) {
      try {
        const response = await fetch(`/api/faq?id=${id}`, {
          method: "DELETE",
        });

        const data = await response.json();

        if (data.success) {
          setSuccess("FAQ deleted successfully");
          await fetchFAQs();
        } else {
          setError(data.error || "Failed to delete FAQ");
        }
      } catch (err: any) {
        setError(err.message || "Failed to delete FAQ");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      question: "",
      answer: "",
      order: 0,
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (faq: FAQ) => {
    setFormData({
      question: faq.question,
      answer: faq.answer,
      order: faq.order,
    });
    setEditingId(faq._id);
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            FAQ Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage frequently asked questions
          </p>
        </div>
        <Button
          onClick={() => {
            if (showForm) resetForm();
            else setShowForm(true);
          }}
          className="bg-cyan-600 hover:bg-cyan-700 text-white flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          {showForm ? "Cancel" : "Add FAQ"}
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

      {/* Form */}
      {showForm && (
        <motion.form
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Question
            </label>
            <input
              type="text"
              value={formData.question}
              onChange={(e) => setFormData({ ...formData, question: e.target.value })}
              placeholder="Enter question"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Answer
            </label>
            <ReactQuill
              value={formData.answer}
              onChange={(value) => setFormData({ ...formData, answer: value })}
              modules={modules}
              theme="snow"
              style={{ height: "200px", marginBottom: "50px" }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Order
            </label>
            <input
              type="number"
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" className="bg-cyan-600 hover:bg-cyan-700 text-white">
              {editingId ? "Update FAQ" : "Create FAQ"}
            </Button>
            <Button type="button" onClick={resetForm} className="bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white">
              Cancel
            </Button>
          </div>
        </motion.form>
      )}

      {/* FAQs List */}
      <div className="space-y-3">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader className="w-8 h-8 animate-spin text-cyan-600" />
          </div>
        ) : faqs.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No FAQs yet. Create one to get started!
          </div>
        ) : (
          faqs.map((faq, idx) => (
            <motion.div
              key={faq._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    {faq.question}
                  </h3>
                  <div
                    className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2"
                    dangerouslySetInnerHTML={{
                      __html: faq.answer.replace(/<[^>]*>/g, ""),
                    }}
                  />
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <Button
                    onClick={() => handleEdit(faq)}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    size="sm"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => handleDelete(faq._id)}
                    className="bg-red-600 hover:bg-red-700 text-white"
                    size="sm"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
