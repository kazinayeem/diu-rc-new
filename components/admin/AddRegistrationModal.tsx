"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { X, Loader2 } from "lucide-react";

interface AddRegistrationModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddRegistrationModal({ onClose, onSuccess }: AddRegistrationModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    studentId: "",
    email: "",
    phone: "",
    department: "",
    batch: "",
    currentYear: "",
    cgpa: "",
    previousExperience: "",
    whyJoin: "",
    skills: "",
    paymentMethod: "bkash",
    paymentNumber: "",
    transactionId: "",
    paymentStatus: "pending",
    status: "pending",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Convert skills string to array
      const payload = {
        ...formData,
        skills: formData.skills ? formData.skills.split(",").map((s) => s.trim()) : [],
        cgpa: formData.cgpa ? parseFloat(formData.cgpa) : null,
      };

      const response = await fetch("/api/member-registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.success) {
        alert("Registration added successfully!");
        onSuccess();
        onClose();
      } else {
        alert(result.message || "Failed to add registration");
      }
    } catch (error: any) {
      console.error("Add registration error:", error);
      alert("Failed to add registration");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-6 z-50 overflow-y-auto">
      <div className="bg-[#0f192d] border border-white/10 rounded-xl max-w-4xl w-full p-6 my-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Add New Registration</h2>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-2xl hover:text-red-400 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Full Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Student ID <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="studentId"
                value={formData.studentId}
                onChange={handleChange}
                required
                placeholder="242-33-001"
                className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                DIU Email <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="example@diu.edu.bd"
                className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Mobile Phone <span className="text-red-400">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="01712345678"
                className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Department</label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                placeholder="CSE"
                className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Batch</label>
              <input
                type="text"
                name="batch"
                value={formData.batch}
                onChange={handleChange}
                placeholder="56"
                className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Current Year</label>
              <select
                name="currentYear"
                value={formData.currentYear}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg"
              >
                <option value="">Select Year</option>
                <option value="1st">1st</option>
                <option value="2nd">2nd</option>
                <option value="3rd">3rd</option>
                <option value="4th">4th</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">CGPA</label>
              <input
                type="number"
                step="0.01"
                name="cgpa"
                value={formData.cgpa}
                onChange={handleChange}
                placeholder="3.75"
                className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg"
              />
            </div>
          </div>

          {/* Additional Information */}
          <div>
            <label className="block text-sm font-medium mb-1">Previous Experience</label>
            <textarea
              name="previousExperience"
              value={formData.previousExperience}
              onChange={handleChange}
              rows={3}
              placeholder="Any previous robotics or tech experience..."
              className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Why Join?</label>
            <textarea
              name="whyJoin"
              value={formData.whyJoin}
              onChange={handleChange}
              rows={3}
              placeholder="Why do you want to join the robotics club..."
              className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Skills (comma-separated)</label>
            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="Programming, Electronics, 3D Design"
              className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg"
            />
          </div>

          {/* Payment Information */}
          <div className="border-t border-white/10 pt-4 mt-4">
            <h3 className="text-lg font-semibold mb-4">Payment Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Payment Method</label>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg"
                >
                  <option value="bkash">bKash</option>
                  <option value="nagad">Nagad</option>
                  <option value="rocket">Rocket</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Payment Number</label>
                <input
                  type="text"
                  name="paymentNumber"
                  value={formData.paymentNumber}
                  onChange={handleChange}
                  placeholder="01712345678"
                  className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Transaction ID</label>
                <input
                  type="text"
                  name="transactionId"
                  value={formData.transactionId}
                  onChange={handleChange}
                  placeholder="ABC123XYZ"
                  className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Payment Status</label>
                <select
                  name="paymentStatus"
                  value={formData.paymentStatus}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg"
                >
                  <option value="pending">Pending</option>
                  <option value="verified">Verified</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Registration Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg"
                >
                  <option value="pending">Pending</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 mt-6 border-t border-white/10 pt-4">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="flex-1"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-cyan-600 hover:bg-cyan-700"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Registration"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
