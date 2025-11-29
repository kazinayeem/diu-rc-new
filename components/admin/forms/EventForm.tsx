"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { X } from "lucide-react";

interface EventFormProps {
  event?: any;
  onClose: () => void;
}

export default function EventForm({ event, onClose }: EventFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    eventDate: "",
    eventTime: "",
    location: "",
    registrationLink: "",
    type: "event",
    status: "upcoming",
    featured: false,
    registrationLimit: "",
    registrationOpen: true,
    isPaid: false,
    registrationFee: "",
    paymentMethod: "both",
    paymentNumber: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title || "",
        description: event.description || "",
        content: event.content || "",
        eventDate: event.eventDate
          ? new Date(event.eventDate).toISOString().split("T")[0]
          : "",
        eventTime: event.eventTime || "",
        location: event.location || "",
        registrationLink: event.registrationLink || "",
        type: event.type || "event",
        status: event.status || "upcoming",
        featured: event.featured || false,
        registrationLimit: event.registrationLimit?.toString() || "",
        registrationOpen:
          event.registrationOpen !== undefined ? event.registrationOpen : true,
        isPaid: event.isPaid || false,
        registrationFee: event.registrationFee?.toString() || "",
        paymentMethod: event.paymentMethod || "both",
        paymentNumber: event.paymentNumber || "",
      });
    }
  }, [event]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const url = event ? `/api/events/${event._id}` : "/api/events";
      const method = event ? "PUT" : "POST";

      const submitData = {
        ...formData,
        registrationLimit: formData.registrationLimit
          ? parseInt(formData.registrationLimit)
          : undefined,
        registrationFee:
          formData.isPaid && formData.registrationFee
            ? parseFloat(formData.registrationFee)
            : undefined,
        paymentMethod: formData.isPaid ? formData.paymentMethod : undefined,
        paymentNumber: formData.isPaid ? formData.paymentNumber : undefined,
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
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
      <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[#0f192d] border border-white/10 shadow-xl">
        <CardHeader>
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">
              {event ? "Edit Event" : "Add New Event"}
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

            {/* Title */}
            <div>
              <label className="block text-sm mb-2 text-white/80">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
                className="w-full px-4 py-2 bg-white/5 border border-white/20 text-white rounded-lg focus:ring-[#1f8fff]"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm mb-2 text-white/80">
                Description *
              </label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
                className="w-full px-4 py-2 bg-white/5 border border-white/20 text-white rounded-lg focus:ring-[#1f8fff]"
              />
            </div>

            {/* Date + Time */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-2 text-white/80">
                  Event Date *
                </label>
                <input
                  type="date"
                  value={formData.eventDate}
                  onChange={(e) =>
                    setFormData({ ...formData, eventDate: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 bg-white/5 border border-white/20 text-white rounded-lg focus:ring-[#1f8fff]"
                />
              </div>

              <div>
                <label className="block text-sm mb-2 text-white/80">
                  Event Time *
                </label>
                <input
                  type="time"
                  value={formData.eventTime}
                  onChange={(e) =>
                    setFormData({ ...formData, eventTime: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 bg-white/5 border border-white/20 text-white rounded-lg focus:ring-[#1f8fff]"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm mb-2 text-white/80">
                Location *
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                required
                className="w-full px-4 py-2 bg-white/5 border border-white/20 text-white rounded-lg focus:ring-[#1f8fff]"
              />
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm mb-2 text-white/80">Type *</label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:ring-[#1f8fff]"
              >
                <option className="text-black" value="event">
                  Event
                </option>
                <option className="text-black" value="workshop">
                  Workshop
                </option>
                <option className="text-black" value="seminar">
                  Seminar
                </option>
              </select>
            </div>

            {/* Registration Limit */}
            <div>
              <label className="block text-sm mb-2 text-white/80">
                Registration Limit
              </label>
              <input
                type="number"
                value={formData.registrationLimit}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    registrationLimit: e.target.value,
                  })
                }
                placeholder="Leave empty for unlimited"
                className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:ring-[#1f8fff]"
              />
            </div>

            {/* Registration Open */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="registrationOpen"
                checked={formData.registrationOpen}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    registrationOpen: e.target.checked,
                  })
                }
                className="w-4 h-4 accent-[#1f8fff]"
              />
              <label
                htmlFor="registrationOpen"
                className="ml-2 text-sm text-white/80"
              >
                Registration Open
              </label>
            </div>

            {/* Paid Section */}
            <div className="border-t border-white/10 pt-4">
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="isPaid"
                  checked={formData.isPaid}
                  onChange={(e) =>
                    setFormData({ ...formData, isPaid: e.target.checked })
                  }
                  className="w-4 h-4 accent-[#1f8fff]"
                />
                <label
                  htmlFor="isPaid"
                  className="ml-2 text-sm text-white/80 font-medium"
                >
                  Paid Workshop/Event
                </label>
              </div>

              {formData.isPaid && (
                <div className="space-y-4 bg-white/5 p-4 border border-white/10 rounded-lg">
                  <div>
                    <label className="block text-sm mb-2 text-white/80">
                      Registration Fee (৳) *
                    </label>
                    <input
                      type="number"
                      value={formData.registrationFee}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          registrationFee: e.target.value,
                        })
                      }
                      required={formData.isPaid}
                      className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:ring-[#1f8fff]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2 text-white/80">
                      Payment Method *
                    </label>
                    <select
                      value={formData.paymentMethod}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          paymentMethod: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:ring-[#1f8fff]"
                    >
                      <option className="text-black" value="both">
                        Both (bKash & Nagad)
                      </option>
                      <option className="text-black" value="bkash">
                        bKash Only
                      </option>
                      <option className="text-black" value="nagad">
                        Nagad Only
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm mb-2 text-white/80">
                      Payment Number *
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
                      required={formData.isPaid}
                      placeholder="017xxxxxxx"
                      className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:ring-[#1f8fff]"
                    />
                    <p className="text-xs text-white/50 mt-1">
                      bKash or Nagad number to receive payments
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Registration Link */}
            <div>
              <label className="block text-sm mb-2 text-white/80">
                Registration Link
              </label>
              <input
                type="url"
                value={formData.registrationLink}
                onChange={(e) =>
                  setFormData({ ...formData, registrationLink: e.target.value })
                }
                className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:ring-[#1f8fff]"
              />
            </div>

            {/* Status + Featured */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-2 text-white/80">
                  Status *
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:ring-[#1f8fff]"
                >
                  <option className="text-black" value="upcoming">
                    Upcoming
                  </option>
                  <option className="text-black" value="ongoing">
                    Ongoing
                  </option>
                  <option className="text-black" value="completed">
                    Completed
                  </option>
                  <option className="text-black" value="cancelled">
                    Cancelled
                  </option>
                </select>
              </div>

              <div className="flex items-center pt-8">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) =>
                    setFormData({ ...formData, featured: e.target.checked })
                  }
                  className="w-4 h-4 accent-[#1f8fff]"
                />
                <label
                  htmlFor="featured"
                  className="ml-2 text-sm text-white/80"
                >
                  Featured Event
                </label>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-4 pt-6">
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
                {loading ? "Saving..." : event ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
