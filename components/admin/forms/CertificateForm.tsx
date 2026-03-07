"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { X, Copy, Check } from "lucide-react";

interface CertificateFormProps {
  certificate?: any;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function CertificateForm({ certificate, onClose, onSuccess }: CertificateFormProps) {
  const [formData, setFormData] = useState({
    certificateId: "",
    recipientName: "",
    recipientEmail: "",
    event: "",
    eventType: "workshop",
    category: "",
    issueDate: "",
    description: "",
    skills: "",
    duration: "",
    instructor: "",
    isActive: true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (certificate) {
      setFormData({
        certificateId: certificate.certificateId || "",
        recipientName: certificate.recipientName || "",
        recipientEmail: certificate.recipientEmail || "",
        event: certificate.event || "",
        eventType: certificate.eventType || "workshop",
        category: certificate.category || "",
        issueDate: certificate.issueDate
          ? new Date(certificate.issueDate).toISOString().split("T")[0]
          : "",
        description: certificate.description || "",
        skills: certificate.skills ? certificate.skills.join(", ") : "",
        duration: certificate.duration || "",
        instructor: certificate.instructor || "",
        isActive: certificate.isActive !== undefined ? certificate.isActive : true,
      });
    }
  }, [certificate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const url = certificate
        ? `/api/admin/certificates/${certificate._id}`
        : "/api/admin/certificates";
      const method = certificate ? "PUT" : "POST";

      const submitData = {
        ...formData,
        certificateImageUrl: "/ce.png", // Default template
        skills: formData.skills
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s),
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to save certificate");
      }

      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "An error occurred");
    }

    setLoading(false);
  };

  const handleCopyId = () => {
    if (formData.certificateId) {
      navigator.clipboard.writeText(formData.certificateId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4 overflow-y-auto">
      <Card className="w-full max-w-3xl my-8 bg-[#0f192d] border border-white/10 shadow-xl rounded-2xl">
        <CardHeader>
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">
              {certificate ? "Edit Certificate" : "Add New Certificate"}
            </h2>
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white"
            >
              <X size={24} />
            </button>
          </div>
        </CardHeader>

        <CardContent className="text-white">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-500/20 border border-red-400/40 text-red-300 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-4">
              {/* Certificate ID */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Certificate ID <span className="text-red-400">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.certificateId}
                    onChange={(e) =>
                      setFormData({ ...formData, certificateId: e.target.value.toUpperCase() })
                    }
                    className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#3DB5D8]/50"
                    placeholder="CERT-2025-001"
                    required
                    disabled={!!certificate}
                  />
                  {formData.certificateId && (
                    <button
                      type="button"
                      onClick={handleCopyId}
                      className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-all flex items-center gap-2"
                      title="Copy Certificate ID"
                    >
                      {copied ? (
                        <>
                          <Check size={16} className="text-green-400" />
                          <span className="text-xs text-green-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={16} />
                          <span className="text-xs">Copy</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Event Type */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Event Type <span className="text-red-400">*</span>
                </label>
                <select
                  value={formData.eventType}
                  onChange={(e) =>
                    setFormData({ ...formData, eventType: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#3DB5D8]/50"
                  required
                >
                  <option value="workshop">Workshop</option>
                  <option value="seminar">Seminar</option>
                  <option value="bootcamp">Bootcamp</option>
                  <option value="competition">Competition</option>
                  <option value="training">Training</option>
                  <option value="course">Course</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {/* Recipient Name */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Recipient Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.recipientName}
                  onChange={(e) =>
                    setFormData({ ...formData, recipientName: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#3DB5D8]/50"
                  placeholder="John Doe"
                  required
                />
              </div>

              {/* Recipient Email */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Recipient Email <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  value={formData.recipientEmail}
                  onChange={(e) =>
                    setFormData({ ...formData, recipientEmail: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#3DB5D8]/50"
                  placeholder="john@example.com"
                  required
                />
              </div>
            </div>

            {/* Event Name */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Event Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.event}
                onChange={(e) =>
                  setFormData({ ...formData, event: e.target.value })
                }
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#3DB5D8]/50"
                placeholder="Competitive Line Follower Workshop"
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {/* Category */}
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#3DB5D8]/50"
                  placeholder="Robotics"
                />
              </div>

              {/* Issue Date */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Issue Date <span className="text-red-400">*</span>
                </label>
                <input
                  type="date"
                  value={formData.issueDate}
                  onChange={(e) =>
                    setFormData({ ...formData, issueDate: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#3DB5D8]/50"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#3DB5D8]/50 min-h-[100px]"
                placeholder="Brief description of the certificate..."
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {/* Duration */}
              <div>
                <label className="block text-sm font-medium mb-2">Duration</label>
                <input
                  type="text"
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData({ ...formData, duration: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#3DB5D8]/50"
                  placeholder="3 Days"
                />
              </div>

              {/* Instructor */}
              <div>
                <label className="block text-sm font-medium mb-2">Instructor</label>
                <input
                  type="text"
                  value={formData.instructor}
                  onChange={(e) =>
                    setFormData({ ...formData, instructor: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#3DB5D8]/50"
                  placeholder="Dr. John Smith"
                />
              </div>
            </div>

            {/* Skills */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Skills (comma-separated)
              </label>
              <input
                type="text"
                value={formData.skills}
                onChange={(e) =>
                  setFormData({ ...formData, skills: e.target.value })
                }
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#3DB5D8]/50"
                placeholder="Arduino, Circuit Design, Sensor Integration"
              />
            </div>

            {/* Certificate Template Info */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="text-blue-400 text-xl">ℹ️</div>
                <div>
                  <h4 className="text-blue-300 font-semibold text-sm mb-1">
                    Certificate Template
                  </h4>
                  <p className="text-blue-100/70 text-xs leading-relaxed">
                    All certificates will use the default template (/ce.png). The recipient's data will be displayed dynamically on the verification page.
                  </p>
                </div>
              </div>
            </div>

            {/* Is Active */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) =>
                  setFormData({ ...formData, isActive: e.target.checked })
                }
                className="w-4 h-4 bg-white/5 border border-white/10 rounded focus:ring-[#3DB5D8]"
              />
              <label htmlFor="isActive" className="text-sm font-medium">
                Active (visible in verification)
              </label>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-[#3DB5D8] hover:bg-[#3DB5D8]/90 text-white font-medium py-2.5 rounded-lg"
              >
                {loading ? "Saving..." : certificate ? "Update Certificate" : "Create Certificate"}
              </Button>
              <Button
                type="button"
                onClick={onClose}
                variant="outline"
                className="px-6 border-white/20 hover:bg-white/5"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
