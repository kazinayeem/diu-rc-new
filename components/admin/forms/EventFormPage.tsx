"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { useGetEventQuery, useCreateEventMutation, useUpdateEventMutation } from "@/lib/api/api";


const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

export default function EventFormPage({ eventId }: { eventId?: string }) {
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

  
  const { data: eventData, isFetching: loadingEvent } = useGetEventQuery(eventId || "");
  
  const [createEvent, { isLoading: creating }] = useCreateEventMutation();
  const [updateEvent, { isLoading: updating }] = useUpdateEventMutation();
  useEffect(() => {
    if (!eventId) return;
    if (eventData?.success) {
      const e = eventData.data;

      setFormData({
        title: e.title,
        description: e.description,
        content: e.content,
        eventDate: e.eventDate ? e.eventDate.split("T")[0] : "",
        eventTime: e.eventTime || "",
        location: e.location || "",
        mode: e.mode || "offline",
        eventLink: e.eventLink || "",
        image: e.image || "",
        registrationLink: e.registrationLink || "",
        type: e.type || "event",
        status: e.status || "upcoming",
        featured: e.featured || false,
        registrationLimit: e.registrationLimit?.toString() || "",
        registrationOpen: e.registrationOpen ?? true,
        isPaid: e.isPaid || false,
        registrationFee: e.registrationFee?.toString() || "",
        paymentMethod: e.paymentMethod || "both",
        paymentNumber: e.paymentNumber || "",
      });
    }
  }, [eventId, eventData]);

  
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    

    try {
      const method = eventId ? "PUT" : "POST";
      const url = eventId ? `/api/events/${eventId}` : "/api/events";

      const submitData = {
        ...formData,
        registrationLimit: formData.registrationLimit
          ? parseInt(formData.registrationLimit)
          : undefined,
        registrationFee:
          formData.isPaid && formData.registrationFee
            ? parseFloat(formData.registrationFee)
            : undefined,
        eventLink: formData.mode === "online" ? formData.eventLink : undefined,
      };

      if (eventId) {
        await updateEvent({ id: eventId, body: submitData }).unwrap();
      } else {
        await createEvent(submitData).unwrap();
      }
      router.push("/admin/events");
    } catch (err) {
      setError("Something went wrong.");
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-[#0f192d] text-white p-10">
      <div className="max-w-4xl mx-auto bg-white/5 p-8 rounded-2xl border border-white/10">
        <h1 className="text-3xl font-bold mb-6">
          {eventId ? "Edit Event" : "Add New Event"}
        </h1>

        {error && (
          <div className="bg-red-500/20 border border-red-400/40 text-red-300 px-4 py-3 rounded-lg mb-5">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="text-sm text-white/70">Title *</label>
            <input
              type="text"
              required
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </div>

          {/* Short Description */}
          <div>
            <label className="text-sm text-white/70">Short Description *</label>
            <textarea
              rows={3}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          {/* Rich Text Content */}
          <div>
            <label className="text-sm text-white/70 mb-2 block">
              Full Content (Rich Text)
            </label>

            <div className="bg-white rounded-lg text-black">
              <ReactQuill
                theme="snow"
                value={formData.content}
                onChange={(value) =>
                  setFormData({ ...formData, content: value })
                }
              />
            </div>
          </div>

          {/* IMAGE */}
          <div>
            <label className="text-sm text-white/70">Image URL</label>
            <input
              type="url"
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2"
              value={formData.image}
              onChange={(e) =>
                setFormData({ ...formData, image: e.target.value })
              }
            />
          </div>

          {/* DATE / TIME */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-white/70">Date *</label>
              <input
                type="date"
                required
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2"
                value={formData.eventDate}
                onChange={(e) =>
                  setFormData({ ...formData, eventDate: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-sm text-white/70">Time *</label>
              <input
                type="time"
                required
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2"
                value={formData.eventTime}
                onChange={(e) =>
                  setFormData({ ...formData, eventTime: e.target.value })
                }
              />
            </div>
          </div>

          {/* LOCATION */}
          <div>
            <label className="text-sm text-white/70">Location *</label>
            <input
              type="text"
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
            />
          </div>

          {/* MODE */}
          <div>
            <label className="text-sm text-white/70">Mode *</label>
            <select
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2"
              value={formData.mode}
              onChange={(e) =>
                setFormData({ ...formData, mode: e.target.value })
              }
            >
              <option value="offline">Offline</option>
              <option value="online">Online</option>
            </select>
          </div>

          {/* EVENT LINK (online only) */}
          {formData.mode === "online" && (
            <div>
              <label className="text-sm text-white/70">
                Online Event Link *
              </label>
              <input
                type="url"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2"
                value={formData.eventLink}
                onChange={(e) =>
                  setFormData({ ...formData, eventLink: e.target.value })
                }
              />
            </div>
          )}

          {/* TYPE */}
          <div>
            <label className="text-sm text-white/70">Type *</label>
            <select
              value={formData.type}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2"
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
            >
              <option value="event">Event</option>
              <option value="workshop">Workshop</option>
              <option value="seminar">Seminar</option>
            </select>
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={loading}
              className="bg-[#1f8fff] hover:bg-[#0e6fd8]"
            >
              {loading
                ? "Saving..."
                : eventId
                ? "Update Event"
                : "Create Event"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
