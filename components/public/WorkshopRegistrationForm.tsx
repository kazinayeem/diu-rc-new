"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { CheckCircle, AlertCircle } from "lucide-react";

interface WorkshopRegistrationFormProps {
  workshopId: string;
}

export default function WorkshopRegistrationForm({
  workshopId,
}: WorkshopRegistrationFormProps) {
  const [workshop, setWorkshop] = useState<any>(null);
  const [loadingWorkshop, setLoadingWorkshop] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    studentId: "",
    department: "",
    batch: "",
    message: "",
    paymentMethod: "bkash" as "bkash" | "nagad",
    paymentNumber: "",
    transactionId: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Fetch workshop details
  useEffect(() => {
    async function fetchWorkshop() {
      try {
        setLoadingWorkshop(true);
        const res = await fetch(`/api/events/${workshopId}`);
        const data = await res.json();
        if (data.success) setWorkshop(data.data);
      } catch (err) {
        console.error("Error fetching workshop:", err);
      }
      setLoadingWorkshop(false);
    }
    if (workshopId) fetchWorkshop();
  }, [workshopId]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`/api/workshops/${workshopId}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setFormData({
          name: "",
          email: "",
          phone: "",
          studentId: "",
          department: "",
          batch: "",
          message: "",
          paymentMethod: "bkash",
          paymentNumber: "",
          transactionId: "",
        });
      } else {
        setError(data.error || "Registration failed. Please try again.");
      }
    } catch {
      setError("Something went wrong. Try again.");
    }
    setLoading(false);
  };

  // Success Screen
  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <Card className="bg-green-900/40 border border-green-700 text-white backdrop-blur-xl shadow-xl rounded-2xl">
          <CardContent className="p-8 text-center">
            <CheckCircle className="text-green-400 mx-auto mb-4" size={48} />
            <h3 className="text-2xl font-semibold mb-2">
              Registration Successful!
            </h3>
            <p className="text-green-200 mb-4">
              Thank you! A confirmation email will be sent shortly.
            </p>

            <Button
              variant="outline"
              onClick={() => setSuccess(false)}
              className="border-green-500 text-green-300 hover:bg-green-700/30"
            >
              Register Another Person
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // Loading workshop
  if (loadingWorkshop) {
    return (
      <Card className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 text-center text-white rounded-xl">
        <p>Loading workshop details...</p>
      </Card>
    );
  }

  // MAIN FORM
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl text-white">
        <CardHeader>
          <h3 className="text-2xl font-bold mb-1">Workshop Registration</h3>
          <p className="text-white/60 text-sm">
            Fill in your details to complete registration
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-500/10 border border-red-500 text-red-300 px-4 py-3 rounded-lg flex items-center gap-2">
                <AlertCircle size={20} />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {/* INPUT FIELD GENERATOR */}
            {[
              { label: "Full Name *", key: "name" },
              { label: "Email *", key: "email", type: "email" },
              { label: "Phone Number *", key: "phone", type: "tel" },
              { label: "Student ID (Optional)", key: "studentId" },
            ].map((field) => (
              <div key={field.key}>
                <label className="block text-sm mb-1 text-white/80">
                  {field.label}
                </label>
                <input
                  type={field.type || "text"}
                  value={(formData as any)[field.key]}
                  onChange={(e) =>
                    setFormData({ ...formData, [field.key]: e.target.value })
                  }
                  required={field.label.includes("*")}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            ))}

            {/* DEPT + BATCH */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-white/80 mb-1 block">
                  Department
                </label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) =>
                    setFormData({ ...formData, department: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="text-sm text-white/80 mb-1 block">
                  Batch
                </label>
                <input
                  type="text"
                  value={formData.batch}
                  onChange={(e) =>
                    setFormData({ ...formData, batch: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            {/* MESSAGE */}
            <div>
              <label className="text-sm text-white/80 mb-1 block">
                Message (Optional)
              </label>
              <textarea
                rows={3}
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              ></textarea>
            </div>

            {/* PAYMENT SECTION */}
            {workshop?.isPaid && (
              <div className="bg-blue-900/20 border border-blue-700 rounded-xl p-4 space-y-4">
                <h4 className="font-semibold text-blue-300">
                  Payment Information
                </h4>

                <p className="text-white/70 text-sm">
                  Registration Fee:{" "}
                  <span className="font-bold text-blue-300">
                    ৳{workshop.registrationFee}
                  </span>
                </p>

                <p className="text-sm text-white/60">
                  Send payment to:{" "}
                  <span className="font-bold">{workshop.paymentNumber}</span>
                </p>

                {/* METHOD */}
                <div>
                  <label className="text-sm text-white/80 mb-1 block">
                    Payment Method *
                  </label>
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        paymentMethod: e.target.value as "bkash" | "nagad",
                      })
                    }
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg"
                  >
                    {workshop.paymentMethod === "both" ? (
                      <>
                        <option value="bkash">bKash</option>
                        <option value="nagad">Nagad</option>
                      </>
                    ) : (
                      <option value={workshop.paymentMethod}>
                        {workshop.paymentMethod.toUpperCase()}
                      </option>
                    )}
                  </select>
                </div>

                {/* NUMBER */}
                <div>
                  <label className="text-sm text-white/80 mb-1 block">
                    Your Payment Number *
                  </label>
                  <input
                    type="tel"
                    value={formData.paymentNumber}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        paymentNumber: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg"
                    required
                  />
                </div>

                {/* TRXID */}
                <div>
                  <label className="text-sm text-white/80 mb-1 block">
                    Transaction ID *
                  </label>
                  <input
                    type="text"
                    value={formData.transactionId}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        transactionId: e.target.value.toUpperCase(),
                      })
                    }
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg"
                  />
                </div>
              </div>
            )}

            {/* SUBMIT BUTTON */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
            >
              {loading
                ? "Registering..."
                : workshop?.isPaid
                ? `Register & Pay ৳${workshop.registrationFee}`
                : "Register Now"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
