"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, AlertCircle, CheckCircle, Loader } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ContactUsData {
  email: string;
  phone: string;
  address: string;
  description?: string;
  socialLinks?: {
    github?: string;
    linkedin?: string;
    facebook?: string;
    twitter?: string;
  };
}

export default function ContactUsManagement() {
  const [formData, setFormData] = useState<ContactUsData>({
    email: "",
    phone: "",
    address: "",
    description: "",
    socialLinks: {
      github: "",
      linkedin: "",
      facebook: "",
      twitter: "",
    },
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchContactInfo();
  }, []);

  const fetchContactInfo = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/contact-us");
      const data = await response.json();

      if (data.success && data.data) {
        setFormData(data.data);
      }
    } catch (err: any) {
      console.error("Error fetching contact info:", err);
      setError("Failed to load contact information");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSocialChange = (platform: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value,
      },
    }));
  };

  const handleSave = async () => {
    if (!formData.email || !formData.phone || !formData.address) {
      setError("Email, phone, and address are required");
      return;
    }

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const response = await fetch("/api/contact-us", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess("Contact information saved successfully!");
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(data.error || "Failed to save contact information");
      }
    } catch (err: any) {
      setError(err.message || "Failed to save contact information");
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
            Contact Us Information
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your contact details and social links
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

      {/* Form */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 space-y-6">
        {/* Contact Details */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Contact Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Address
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description (Optional)
            </label>
            <textarea
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
              rows={2}
              placeholder="Brief description about your organization"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>

        {/* Social Links */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Social Links
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                GitHub
              </label>
              <input
                type="url"
                placeholder="https://github.com/..."
                value={formData.socialLinks?.github || ""}
                onChange={(e) => handleSocialChange("github", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                LinkedIn
              </label>
              <input
                type="url"
                placeholder="https://linkedin.com/..."
                value={formData.socialLinks?.linkedin || ""}
                onChange={(e) => handleSocialChange("linkedin", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Facebook
              </label>
              <input
                type="url"
                placeholder="https://facebook.com/..."
                value={formData.socialLinks?.facebook || ""}
                onChange={(e) => handleSocialChange("facebook", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Twitter
              </label>
              <input
                type="url"
                placeholder="https://twitter.com/..."
                value={formData.socialLinks?.twitter || ""}
                onChange={(e) => handleSocialChange("twitter", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
