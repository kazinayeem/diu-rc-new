"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/Button";
import { useCreateEventMutation } from "@/lib/api/api";
import { useRouter } from "next/navigation";

// Load ReactQuill (client only)
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

export default function AddEventPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    eventDate: "",
    eventTime: "",
    location: "",
    mode: "offline",
    eventLink: "",
    image: "",
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

  const [createEvent] = useCreateEventMutation();

  // SUBMIT FORM
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
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
        eventLink: formData.mode === "online" ? formData.eventLink : undefined,
      };

      try {
        await createEvent(submitData).unwrap();
        router.push("/admin/events");
      } catch (err: any) {
        setError(err?.data?.message || err?.message || "Something went wrong");
      }
    } catch {
      setError("Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0f192d] text-white p-10">
      <div className="max-w-4xl mx-auto bg-white/5 p-8 rounded-2xl border border-white/10">
        <h1 className="text-3xl font-bold mb-6">Add New Event</h1>

        {error && (
          <div className="bg-red-500/20 border border-red-400/40 text-red-300 px-4 py-3 rounded-lg mb-5">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* =======================================
                  TITLE
          ======================================== */}
          <div>
            <label className="text-sm text-white/80">Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg"
            />
          </div>

          {/* =======================================
                  DESCRIPTION
          ======================================== */}
          <div>
            <label className="text-sm text-white/80">Short Description *</label>
            <textarea
              required
              rows={3}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg"
            />
          </div>

          {/* =======================================
                  RICH TEXT EDITOR
          ======================================== */}
          <div>
            <label className="text-sm text-white/80">Event Content</label>

            <div className="quill-dark">
              <ReactQuill
                theme="snow"
                value={formData.content}
                onChange={(val) => setFormData({ ...formData, content: val })}
              />
            </div>
          </div>

          {/* =======================================
                  IMAGE
          ======================================== */}
          <div>
            <label className="text-sm text-white/80">Image URL</label>
            <input
              type="url"
              value={formData.image}
              onChange={(e) =>
                setFormData({ ...formData, image: e.target.value })
              }
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg"
            />
          </div>

          {/* =======================================
                  DATE + TIME
          ======================================== */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-white/80">Date *</label>
              <input
                type="date"
                required
                value={formData.eventDate}
                onChange={(e) =>
                  setFormData({ ...formData, eventDate: e.target.value })
                }
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg"
              />
            </div>

            <div>
              <label className="text-sm text-white/80">Time *</label>
              <input
                type="time"
                required
                value={formData.eventTime}
                onChange={(e) =>
                  setFormData({ ...formData, eventTime: e.target.value })
                }
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg"
              />
            </div>
          </div>

          {/* =======================================
                  LOCATION
          ======================================== */}
          <div>
            <label className="text-sm text-white/80">Location *</label>
            <input
              type="text"
              required
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg"
            />
          </div>

          {/* =======================================
                  TYPE
          ======================================== */}
          <div>
            <label className="text-sm text-white/80">Type *</label>
            <select
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg"
            >
              <option value="event" className="text-black">
                Event
              </option>
              <option value="workshop" className="text-black">
                Workshop
              </option>
              <option value="seminar" className="text-black">
                Seminar
              </option>
            </select>
          </div>

          {/* =======================================
                  EVENT MODE (Only non-workshop)
          ======================================== */}
          {formData.type !== "workshop" && (
            <div className="space-y-4 bg-white/5 p-4 rounded-lg border border-white/10">
              <div>
                <label className="text-sm text-white/80">Event Mode *</label>
                <select
                  value={formData.mode}
                  onChange={(e) =>
                    setFormData({ ...formData, mode: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg"
                >
                  <option value="offline" className="text-black">
                    Offline
                  </option>
                  <option value="online" className="text-black">
                    Online
                  </option>
                </select>
              </div>

              {formData.mode === "online" && (
                <div>
                  <label className="text-sm text-white/80">Event Link *</label>
                  <input
                    type="url"
                    required
                    value={formData.eventLink}
                    onChange={(e) =>
                      setFormData({ ...formData, eventLink: e.target.value })
                    }
                    placeholder="https://meet.google.com/..."
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg"
                  />
                </div>
              )}
            </div>
          )}

          {/* =======================================
                  WORKSHOP SETTINGS
          ======================================== */}
          {formData.type === "workshop" && (
            <div className="space-y-4 bg-white/5 p-4 border border-white/10 rounded-lg">
              <div>
                <label className="text-sm text-white/80">
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
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.registrationOpen}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      registrationOpen: e.target.checked,
                    })
                  }
                />
                <label>Registration Open</label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isPaid}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      isPaid: e.target.checked,
                    })
                  }
                />
                <label>Paid Workshop</label>
              </div>

              {formData.isPaid && (
                <div className="space-y-4 bg-white/5 p-4 border border-white/10 rounded-lg">
                  <div>
                    <label className="text-sm text-white/80">
                      Registration Fee (৳)
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
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-white/80">
                      Payment Method
                    </label>
                    <select
                      value={formData.paymentMethod}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          paymentMethod: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg"
                    >
                      <option className="text-black" value="both">
                        Both (bKash & Nagad)
                      </option>
                      <option className="text-black" value="bkash">
                        bKash
                      </option>
                      <option className="text-black" value="nagad">
                        Nagad
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm text-white/80">
                      Payment Number
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
                      placeholder="017xxxxxxxx"
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* =======================================
                  STATUS + FEATURED
          ======================================== */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-white/80">Status</label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg"
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

            <div className="flex items-center gap-2 pt-8">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) =>
                  setFormData({ ...formData, featured: e.target.checked })
                }
              />
              <label>Featured</label>
            </div>
          </div>

          {/* =======================================
                  SUBMIT BUTTON
          ======================================== */}
          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600"
            >
              {loading ? "Saving..." : "Create Event"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
