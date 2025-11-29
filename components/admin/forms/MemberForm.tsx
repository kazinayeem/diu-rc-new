"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { X } from "lucide-react";

interface MemberFormProps {
  member?: any;
  onClose: () => void;
}

export default function MemberForm({ member, onClose }: MemberFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    studentId: "",
    email: "",
    phone: "",
    role: "general",
    position: "",
    department: "",
    batch: "",
    bio: "",
    isActive: true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (member) {
      setFormData({
        name: member.name || "",
        studentId: member.studentId || "",
        email: member.email || "",
        phone: member.phone || "",
        role: member.role || "general",
        position: member.position || "",
        department: member.department || "",
        batch: member.batch || "",
        bio: member.bio || "",
        isActive: member.isActive !== undefined ? member.isActive : true,
      });
    }
  }, [member]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const url = member ? `/api/members/${member._id}` : "/api/members";
      const method = member ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        onClose();
      } else {
        setError(data.error || "An error occurred");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#0f192d] border border-white/10 shadow-xl">
        {/* HEADER */}
        <CardHeader>
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">
              {member ? "Edit Member" : "Add New Member"}
            </h2>
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white"
            >
              <X size={24} />
            </button>
          </div>
        </CardHeader>

        {/* CONTENT */}
        <CardContent className="text-white">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error */}
            {error && (
              <div className="bg-red-500/20 border border-red-500/30 text-red-300 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Name + Student ID */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1 text-white/80">
                  Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 bg-white/5 border border-white/20 text-white rounded-lg focus:ring-[#1f8fff]"
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-white/80">
                  Student ID *
                </label>
                <input
                  type="text"
                  value={formData.studentId}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      studentId: e.target.value.toUpperCase(),
                    })
                  }
                  required
                  className="w-full px-4 py-2 bg-white/5 border border-white/20 text-white rounded-lg focus:ring-[#1f8fff]"
                />
              </div>
            </div>

            {/* Email + Phone */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1 text-white/80">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 bg-white/5 border border-white/20 text-white rounded-lg focus:ring-[#1f8fff]"
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-white/80">
                  Phone *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 bg-white/5 border border-white/20 text-white rounded-lg focus:ring-[#1f8fff]"
                />
              </div>
            </div>

            {/* Role + Position */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1 text-white/80">
                  Role *
                </label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:ring-[#1f8fff]"
                >
                  <option className="text-black" value="general">
                    General
                  </option>
                  <option className="text-black" value="deputy">
                    Deputy
                  </option>
                  <option className="text-black" value="executive">
                    Executive
                  </option>
                  <option className="text-black" value="main">
                    Main
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-sm mb-1 text-white/80">
                  Position
                </label>
                <input
                  type="text"
                  value={formData.position}
                  onChange={(e) =>
                    setFormData({ ...formData, position: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-white/5 border border-white/20 text-white rounded-lg focus:ring-[#1f8fff]"
                />
              </div>
            </div>

            {/* Department + Batch */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1 text-white/80">
                  Department *
                </label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) =>
                    setFormData({ ...formData, department: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 bg-white/5 border border-white/20 text-white rounded-lg focus:ring-[#1f8fff]"
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-white/80">
                  Batch *
                </label>
                <input
                  type="text"
                  value={formData.batch}
                  onChange={(e) =>
                    setFormData({ ...formData, batch: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 bg-white/5 border border-white/20 text-white rounded-lg focus:ring-[#1f8fff]"
                />
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm mb-1 text-white/80">Bio</label>
              <textarea
                rows={3}
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
                className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:ring-[#1f8fff]"
              />
            </div>

            {/* Active Member */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) =>
                  setFormData({ ...formData, isActive: e.target.checked })
                }
                className="w-4 h-4 accent-[#1f8fff]"
              />
              <label htmlFor="isActive" className="ml-2 text-sm text-white/80">
                Active Member
              </label>
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="border-white/30 text-white hover:bg-white/10"
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={loading}
                className="bg-[#1f8fff] hover:bg-[#0e6fd8]"
              >
                {loading ? "Saving..." : member ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
