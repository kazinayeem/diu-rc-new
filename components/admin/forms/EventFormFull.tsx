"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Loader, AlertCircle, Check } from "lucide-react";
import { useUpdateEventMutation, useCreateEventMutation } from "@/lib/api/api";

interface EventFormFullProps {
  event?: any;
  itemType?: "events" | "seminars" | "bootcamp" | "workshops";
  onSuccess?: () => void;
}

export default function EventFormFull({
  event,
  itemType = "events",
  onSuccess,
}: EventFormFullProps) {
  // Convert itemType to database enum value
  const getDbType = (type: string): "event" | "workshop" | "seminar" | "bootcamp" => {
    const typeMap: Record<string, "event" | "workshop" | "seminar" | "bootcamp"> = {
      events: "event",
      seminars: "seminar",
      bootcamp: "bootcamp",
      workshops: "workshop",
    };
    return typeMap[type] || "event";
  };

  const dbType = getDbType(itemType);
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
    type: dbType,
    status: "upcoming",
    featured: false,
    registrationType: "open", // NEW: "open" | "unlimited" | "closed"
    registrationLimit: "",
    registrationOpen: true,
    isPaid: false,
    registrationFee: "",
    paymentMethod: "both",
    paymentNumber: "",
    host: "",
    guest: "",
    tags: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

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
        mode: event.mode || "offline",
        eventLink: event.eventLink || "",
        image: event.image || "",
        registrationLink: event.registrationLink || "",
        type: event.type || "event",
        status: event.status || "upcoming",
        featured: event.featured || false,
        registrationType: event.registrationLimit
          ? "limited"
          : event.registrationOpen
          ? "open"
          : "closed",
        registrationLimit: event.registrationLimit?.toString() || "",
        registrationOpen:
          event.registrationOpen !== undefined ? event.registrationOpen : true,
        isPaid: event.isPaid || false,
        registrationFee: event.registrationFee?.toString() || "",
        paymentMethod: event.paymentMethod || "both",
        paymentNumber: event.paymentNumber || "",
        host: event.host || "",
        guest: event.guest || "",
        tags: event.tags?.join(", ") || "",
      });
    }
  }, [event]);

  const [updateEvent] = useUpdateEventMutation();
  const [createEvent] = useCreateEventMutation();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleRegistrationTypeChange = (type: string) => {
    setFormData((prev) => ({
      ...prev,
      registrationType: type,
      registrationOpen: type === "open" || type === "limited",
      registrationLimit: type === "limited" ? prev.registrationLimit : "",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    try {
      setLoading(true);

      // Validation
      if (!formData.title.trim()) {
        throw new Error("Title is required");
      }
      if (!formData.description.trim()) {
        throw new Error("Description is required");
      }
      if (!formData.eventDate) {
        throw new Error("Event date is required");
      }

      // Prepare submission data
      const submitData = {
        ...formData,
        registrationLimit:
          formData.registrationType === "limited"
            ? parseInt(formData.registrationLimit) || null
            : null,
        registrationOpen:
          formData.registrationType !== "closed",
        tags: formData.tags
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t),
      };

      let response;

      if (event?._id) {
        // Update
        response = await updateEvent({
          id: event._id,
          body: submitData,
        }).unwrap();
      } else {
        // Create
        response = await createEvent(submitData).unwrap();
      }

      setSuccess(true);
      setTimeout(() => {
        onSuccess?.();
      }, 1000);
    } catch (err: any) {
      console.error("Error submitting form:", err);
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">
          {event ? "Edit" : "Create"} {itemType}
        </h2>
      </div>

      {/* Messages */}
      {error && (
        <div className="bg-red-100 dark:bg-red-500/20 border border-red-300 dark:border-red-500 rounded-lg p-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
          <p className="text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-100 dark:bg-green-500/20 border border-green-300 dark:border-green-500 rounded-lg p-4 flex gap-3">
          <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
          <p className="text-green-700 dark:text-green-300">
            {event ? "Updated" : "Created"} successfully!
          </p>
        </div>
      )}

      {/* Basic Info */}
      <Card>
        <CardHeader>
          <h3 className="font-semibold text-lg">Basic Information</h3>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Title <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Event title"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Description <span className="text-red-600">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Short description"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Content</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Detailed content"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Image URL</label>
            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Tags</label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="robotics, competition, beginner (comma separated)"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white"
            />
          </div>
        </CardContent>
      </Card>

      {/* Event Details */}
      <Card>
        <CardHeader>
          <h3 className="font-semibold text-lg">Event Details</h3>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Date <span className="text-red-600">*</span>
              </label>
              <input
                type="date"
                name="eventDate"
                value={formData.eventDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Time</label>
              <input
                type="time"
                name="eventTime"
                value={formData.eventTime}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Event location"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Mode</label>
              <select
                name="mode"
                value={formData.mode}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white"
              >
                <option value="offline">Offline</option>
                <option value="online">Online</option>
              </select>
            </div>

            {formData.mode === "online" && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">
                  Event Link
                </label>
                <input
                  type="url"
                  name="eventLink"
                  value={formData.eventLink}
                  onChange={handleChange}
                  placeholder="https://zoom.us/..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white"
              >
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
                className="w-4 h-4 rounded"
              />
              <span className="text-sm font-medium">Featured</span>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Registration Settings */}
      <Card>
        <CardHeader>
          <h3 className="font-semibold text-lg">Registration Settings</h3>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-3">
              Registration Type
            </label>
            <div className="space-y-2">
              {[
                { value: "open", label: "Open Registration", desc: "Unlimited spots" },
                { value: "limited", label: "Limited Registration", desc: "Set spot limit" },
                { value: "closed", label: "Closed", desc: "No registration allowed" },
              ].map((option) => (
                <label
                  key={option.value}
                  className="flex items-center gap-3 p-3 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <input
                    type="radio"
                    name="registrationType"
                    value={option.value}
                    checked={formData.registrationType === option.value}
                    onChange={(e) =>
                      handleRegistrationTypeChange(e.target.value)
                    }
                    className="w-4 h-4"
                  />
                  <div>
                    <p className="font-medium">{option.label}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {option.desc}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {formData.registrationType === "limited" && (
            <div>
              <label className="block text-sm font-medium mb-2">
                Registration Limit
              </label>
              <input
                type="number"
                name="registrationLimit"
                value={formData.registrationLimit}
                onChange={handleChange}
                placeholder="e.g., 50"
                min="1"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">
              Registration Link
            </label>
            <input
              type="url"
              name="registrationLink"
              value={formData.registrationLink}
              onChange={handleChange}
              placeholder="https://forms.gle/..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white"
            />
          </div>
        </CardContent>
      </Card>

      {/* Payment Settings */}
      <Card>
        <CardHeader>
          <h3 className="font-semibold text-lg">Payment Settings</h3>
        </CardHeader>
        <CardContent className="space-y-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isPaid"
              checked={formData.isPaid}
              onChange={handleChange}
              className="w-4 h-4 rounded"
            />
            <span className="text-sm font-medium">This is a paid event</span>
          </label>

          {formData.isPaid && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Registration Fee (৳)
                  </label>
                  <input
                    type="number"
                    name="registrationFee"
                    value={formData.registrationFee}
                    onChange={handleChange}
                    placeholder="500"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Payment Method
                  </label>
                  <select
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white"
                  >
                    <option value="bkash">Bkash</option>
                    <option value="nagad">Nagad</option>
                    <option value="both">Both</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Payment Number
                </label>
                <input
                  type="text"
                  name="paymentNumber"
                  value={formData.paymentNumber}
                  onChange={handleChange}
                  placeholder="01700000000"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white"
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Submit */}
      <div className="flex gap-4">
        <Button
          type="submit"
          disabled={loading}
          className="bg-cyan-600 hover:bg-cyan-700 text-white"
        >
          {loading ? (
            <>
              <Loader className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Check className="w-4 h-4 mr-2" />
              {event ? "Update" : "Create"} {itemType}
            </>
          )}
        </Button>

        <Button type="button" variant="outline" disabled={loading}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
