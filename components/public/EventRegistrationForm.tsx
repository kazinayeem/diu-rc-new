"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import { Check, AlertCircle, Loader } from "lucide-react";

interface EventRegistrationFormProps {
  eventId: string;
  eventTitle: string;
  isPaid: boolean;
  registrationFee?: number;
  paymentMethods?: Array<{
    method: "bkash" | "nagad";
    number: string;
    instructions?: string;
  }>;
  onRegistrationSuccess?: () => void;
}

export default function EventRegistrationForm({
  eventId,
  eventTitle,
  isPaid,
  registrationFee,
  paymentMethods,
  onRegistrationSuccess,
}: EventRegistrationFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    studentId: "",
    department: "",
    batch: "",
    message: "",
    paymentMethod: "",
    paymentNumber: "",
    transactionId: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Validation
      if (!formData.name.trim()) {
        throw new Error("Name is required");
      }
      if (!formData.email.trim()) {
        throw new Error("Email is required");
      }
      if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
        throw new Error("Please provide a valid email");
      }
      if (!formData.phone.trim()) {
        throw new Error("Phone number is required");
      }

      // Validate payment fields for paid events
      if (isPaid) {
        if (!formData.paymentMethod.trim()) {
          throw new Error("Please select a payment method");
        }
        if (!formData.paymentNumber.trim()) {
          throw new Error("Sender's mobile number is required");
        }
        if (!formData.transactionId.trim()) {
          throw new Error("Transaction ID is required");
        }
      }

      const response = await fetch("/api/registrations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          workshopId: eventId,
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          studentId: formData.studentId.trim() || undefined,
          department: formData.department.trim() || undefined,
          batch: formData.batch.trim() || undefined,
          message: formData.message.trim() || undefined,
          isPaid,
          paymentMethod: isPaid ? formData.paymentMethod : undefined,
          paymentNumber: isPaid ? formData.paymentNumber.trim() : undefined,
          transactionId: isPaid ? formData.transactionId : undefined,
          paymentStatus: "pending",
          status: "pending",
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to register for event");
      }

      setSuccess(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        studentId: "",
        department: "",
        batch: "",
        message: "",
        paymentMethod: "",
        paymentNumber: "",
        transactionId: "",
      });

      // Trigger parent refetch
      if (onRegistrationSuccess) {
        onRegistrationSuccess();
      }

      // Hide success message after 5 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
      console.error("Registration error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-cyan-50 dark:from-cyan-500/10 to-blue-50 dark:to-blue-500/10 rounded-xl p-6 border border-cyan-200 dark:border-cyan-500/30"
    >
      <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
        Register for This Event
      </h3>

      {success && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-4 p-4 bg-green-100 dark:bg-green-500/20 border border-green-300 dark:border-green-400/40 rounded-lg flex items-start gap-3"
        >
          <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-green-700 dark:text-green-300">
              Registration Successful!
            </p>
            <p className="text-sm text-green-600 dark:text-green-400">
              We've received your registration. Check your email for confirmation.
            </p>
          </div>
        </motion.div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-4 p-4 bg-red-100 dark:bg-red-500/20 border border-red-300 dark:border-red-400/40 rounded-lg flex items-start gap-3"
        >
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-700 dark:text-red-300">
              Registration Failed
            </p>
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Full Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your full name"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            disabled={loading}
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Email Address *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="your.email@example.com"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            disabled={loading}
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Mobile Number *
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="01XXXXXXXXX"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            disabled={loading}
          />
        </div>

        {/* Optional Fields */}
        <div className="pt-2 border-t border-gray-200 dark:border-white/10">
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
            Optional Information
          </p>

          {/* Student ID */}
          <div className="mb-3">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Student ID
            </label>
            <input
              type="text"
              name="studentId"
              value={formData.studentId}
              onChange={handleChange}
              placeholder="e.g., DIU-2024-001"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              disabled={loading}
            />
          </div>

          {/* Department */}
          <div className="mb-3">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Department
            </label>
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              placeholder="Your department"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              disabled={loading}
            />
          </div>

          {/* Batch */}
          <div className="mb-3">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Batch
            </label>
            <input
              type="text"
              name="batch"
              value={formData.batch}
              onChange={handleChange}
              placeholder="e.g., Fall 2024"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              disabled={loading}
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Additional Message
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Any additional details..."
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
              disabled={loading}
            />
          </div>
        </div>

        {/* Payment Section (for paid events) */}
        {isPaid && (
          <div className="pt-4 border-t border-gray-200 dark:border-white/10">
            <div className="bg-yellow-50 dark:bg-yellow-500/10 p-4 rounded-lg mb-4 border border-yellow-200 dark:border-yellow-500/20">
              <p className="font-semibold text-yellow-800 dark:text-yellow-300 mb-2">
                💳 Payment Required
              </p>
              {registrationFee && (
                <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-400 mb-2">
                  ৳{registrationFee}
                </p>
              )}
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                Please complete the payment before registering.
              </p>
            </div>

            {/* Payment Method Selection */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Payment Method *
              </label>
              {paymentMethods && paymentMethods.length > 0 ? (
                <div className="space-y-2">
                  {paymentMethods.map((method) => (
                    <label key={method.method} className="flex items-center p-3 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.method}
                        checked={formData.paymentMethod === method.method}
                        onChange={handleChange}
                        className="w-4 h-4 accent-cyan-600"
                        disabled={loading}
                        required
                      />
                      <div className="ml-3">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {method.method === "bkash" ? "🏦 bKash" : "📱 Nagad"}
                        </p>
                        <p className="text-sm font-mono text-gray-600 dark:text-gray-400 mt-1">
                          {method.number}
                        </p>
                        {method.instructions && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {method.instructions}
                          </p>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Contact organizer for payment details
                </p>
              )}
            </div>

            {/* Sender's Mobile Number */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Sender's Mobile Number *
              </label>
              <input
                type="tel"
                name="paymentNumber"
                value={formData.paymentNumber}
                onChange={handleChange}
                placeholder="01XXXXXXXXX"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                disabled={loading}
                required
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Enter the mobile number from which you sent the payment
              </p>
            </div>

            {/* Transaction ID */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Transaction ID *
              </label>
              <input
                type="text"
                name="transactionId"
                value={formData.transactionId}
                onChange={handleChange}
                placeholder="e.g., TX123456789"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                disabled={loading}
                required
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Enter the transaction/reference number from your payment
              </p>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={loading || success}
          className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              Registering...
            </>
          ) : success ? (
            <>
              <Check className="w-5 h-5" />
              Registered!
            </>
          ) : (
            "Register Now"
          )}
        </motion.button>

        <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
          Fields marked with * are required
        </p>
      </form>
    </motion.div>
  );
}
