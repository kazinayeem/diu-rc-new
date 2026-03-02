"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { X, Plus } from "lucide-react";
import { useCreateEventMutation } from "@/lib/api/api";

interface EventFormPageProps {
  itemType?: "events" | "seminars" | "bootcamp" | "workshops";
}

export default function EventFormPage({ itemType = "events" }: EventFormPageProps) {
  // Convert itemType to internal type format
  const getInitialType = (): "event" | "workshop" | "seminar" | "bootcamp" => {
    switch (itemType) {
      case "seminars": return "seminar";
      case "workshops": return "workshop";
      case "bootcamp": return "bootcamp";
      case "events":
      default: return "event";
    }
  };

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
    type: getInitialType(),
    status: "upcoming",
    featured: false,
    registrationLimit: "",
    registrationOpen: true,
    isPaid: false,
    registrationFee: "",
    paymentMethod: "both",
    paymentNumber: "",
    hosts: [] as string[],
    guests: [] as string[],
  });

  const [currentHost, setCurrentHost] = useState("");
  const [currentGuest, setCurrentGuest] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [createEvent] = useCreateEventMutation();

  const handleAddHost = () => {
    if (currentHost.trim()) {
      setFormData((prev) => ({
        ...prev,
        hosts: [...prev.hosts, currentHost],
      }));
      setCurrentHost("");
    }
  };

  const handleRemoveHost = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      hosts: prev.hosts.filter((_, i) => i !== index),
    }));
  };

  const handleAddGuest = () => {
    if (currentGuest.trim()) {
      setFormData((prev) => ({
        ...prev,
        guests: [...prev.guests, currentGuest],
      }));
      setCurrentGuest("");
    }
  };

  const handleRemoveGuest = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      guests: prev.guests.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const submitData = {
        ...formData,
        host: formData.hosts.length > 0 ? formData.hosts : undefined,
        guest: formData.guests.length > 0 ? formData.guests : undefined,
        registrationLimit: formData.registrationLimit
          ? parseInt(formData.registrationLimit)
          : 0,
        registrationFee:
          formData.isPaid && formData.registrationFee
            ? parseFloat(formData.registrationFee)
            : undefined,
        paymentMethod: formData.isPaid ? formData.paymentMethod : undefined,
        paymentNumber: formData.isPaid ? formData.paymentNumber : undefined,
        eventLink: formData.mode === "online" ? formData.eventLink : undefined,
      };

      // Remove hosts and guests array from submit
      const { hosts, guests, ...cleanData } = submitData as any;

      await createEvent(cleanData).unwrap();
      setSuccess("Program created successfully!");

      // Reset form
      setFormData({
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
        registrationLimit: "",
        registrationOpen: true,
        isPaid: false,
        registrationFee: "",
        paymentMethod: "both",
        paymentNumber: "",
        hosts: [],
        guests: [],
      });
      setCurrentHost("");
      setCurrentGuest("");
    } catch (err: any) {
      setError(err?.data?.message || err?.message || "Failed to create program");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[rgba(2,29,46,0.8)] border border-[rgba(76,201,240,0.12)] rounded-xl p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-500/20 border border-red-400/40 text-red-300 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-500/20 border border-green-400/40 text-green-300 px-4 py-3 rounded-lg">
            {success}
          </div>
        )}

        {/* ROW 1: Title */}
        <div>
          <label className="block text-sm mb-2 text-white/80" htmlFor="title">
            Title *
          </label>
          <input
            id="title"
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Event title"
            className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40"
          />
        </div>

        {/* Type Selector */}
        <div>
          <label className="block text-sm mb-2 text-white/80" htmlFor="type">
            Type *
          </label>
          <select
            id="type"
            required
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as "event" | "workshop" | "seminar" | "bootcamp" })}
            className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white"
          >
            <option value="event">Event</option>
            <option value="workshop">Workshop</option>
            <option value="seminar">Seminar</option>
            <option value="bootcamp">Bootcamp</option>
          </select>
        </div>

        {/* ROW 2: Description (Rich Text) */}
        <div>
          <label className="block text-sm mb-2 text-white/80" htmlFor="description">
            Description *
          </label>
          <textarea
            id="description"
            rows={6}
            required
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Event description (supports markdown and HTML)"
            className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 font-mono text-sm"
          />
          <p className="text-xs text-white/40 mt-2">
            Supports: **bold**, *italic*, - lists, [link](url), &lt;b&gt;, &lt;i&gt;, &lt;u&gt;
          </p>
        </div>

        {/* ROW 3: Image */}
        <div>
          <label className="block text-sm mb-2 text-white/80" htmlFor="image">
            Image URL
          </label>
          <input
            id="image"
            type="url"
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            placeholder="https://example.com/image.jpg"
            className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40"
          />
          {formData.image && (
            <div className="mt-3 p-2 bg-white/5 border border-white/10 rounded-lg">
              <img
                src={formData.image}
                alt="Preview"
                className="w-full h-40 object-cover rounded"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
          )}
        </div>

        {/* ROW 4: Date & Time */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-2 text-white/80" htmlFor="date">
              Date *
            </label>
            <input
              id="date"
              type="date"
              required
              value={formData.eventDate}
              onChange={(e) =>
                setFormData({ ...formData, eventDate: e.target.value })
              }
              className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white"
            />
          </div>

          <div>
            <label className="block text-sm mb-2 text-white/80" htmlFor="time">
              Time *
            </label>
            <input
              id="time"
              type="time"
              required
              value={formData.eventTime}
              onChange={(e) =>
                setFormData({ ...formData, eventTime: e.target.value })
              }
              className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white"
            />
          </div>
        </div>

        {/* ROW 5: Location */}
        <div>
          <label className="block text-sm mb-2 text-white/80" htmlFor="location">
            Location *
          </label>
          <input
            id="location"
            type="text"
            required
            value={formData.location}
            onChange={(e) =>
              setFormData({ ...formData, location: e.target.value })
            }
            placeholder="Event location"
            className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40"
          />
        </div>

        {/* ROW 6: Mode */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-2 text-white/80" htmlFor="mode">
              Mode *
            </label>
            <select
              id="mode"
              value={formData.mode}
              onChange={(e) => setFormData({ ...formData, mode: e.target.value })}
              className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white"
            >
              <option className="text-black" value="offline">
                Offline
              </option>
              <option className="text-black" value="online">
                Online
              </option>
            </select>
          </div>

          {formData.mode === "online" && (
            <div>
              <label
                className="block text-sm mb-2 text-white/80"
                htmlFor="eventLink"
              >
                Event Link *
              </label>
              <input
                id="eventLink"
                type="url"
                required
                value={formData.eventLink}
                onChange={(e) =>
                  setFormData({ ...formData, eventLink: e.target.value })
                }
                placeholder="https://meet.google.com/..."
                className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40"
              />
            </div>
          )}
        </div>

        {/* ROW 7: Host & Guest (Multiple) */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-2 text-white/80">
              Hosts (Multiple)
            </label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={currentHost}
                  onChange={(e) => setCurrentHost(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddHost();
                    }
                  }}
                  placeholder="Add host name"
                  className="flex-1 px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40"
                />
                <button
                  type="button"
                  onClick={handleAddHost}
                  className="px-4 py-2 bg-[#4361EE]/20 border border-[#4361EE]/40 text-[#4CC9F0] rounded-lg hover:bg-[#4361EE]/30 transition-colors flex items-center gap-2"
                >
                  <Plus size={16} />
                </button>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto">
                {formData.hosts.map((host, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between px-3 py-2 bg-[#4361EE]/10 border border-[#4361EE]/30 rounded-lg text-white/80 text-sm"
                  >
                    <span>{host}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveHost(idx)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm mb-2 text-white/80">
              Guests (Multiple)
            </label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={currentGuest}
                  onChange={(e) => setCurrentGuest(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddGuest();
                    }
                  }}
                  placeholder="Add guest name"
                  className="flex-1 px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40"
                />
                <button
                  type="button"
                  onClick={handleAddGuest}
                  className="px-4 py-2 bg-[#3A0CA3]/20 border border-[#3A0CA3]/40 text-[#00E5FF] rounded-lg hover:bg-[#3A0CA3]/30 transition-colors flex items-center gap-2"
                >
                  <Plus size={16} />
                </button>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto">
                {formData.guests.map((guest, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between px-3 py-2 bg-[#3A0CA3]/10 border border-[#3A0CA3]/30 rounded-lg text-white/80 text-sm"
                  >
                    <span>{guest}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveGuest(idx)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ROW 8: Seat Limit */}
        <div>
          <label className="block text-sm mb-2 text-white/80" htmlFor="capacity">
            Seat Limit (Capacity)
          </label>
          <input
            id="capacity"
            type="number"
            min="0"
            value={formData.registrationLimit}
            onChange={(e) =>
              setFormData({
                ...formData,
                registrationLimit: e.target.value,
              })
            }
            placeholder="0 = Unlimited"
            className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40"
          />
          <p className="text-xs text-white/40 mt-1">(0 = unlimited seats)</p>
        </div>

        {/* ROW 9: Registration Settings */}
        <div className="grid grid-cols-2 gap-4">
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
              className="w-4 h-4 accent-[#4CC9F0]"
            />
            <label
              htmlFor="registrationOpen"
              className="ml-2 text-sm text-white/80"
            >
              Registration Open
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="featured"
              checked={formData.featured}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  featured: e.target.checked,
                })
              }
              className="w-4 h-4 accent-[#4CC9F0]"
            />
            <label htmlFor="featured" className="ml-2 text-sm text-white/80">
              Featured
            </label>
          </div>
        </div>

        {/* ROW 10: Paid Options */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isPaid"
            checked={formData.isPaid}
            onChange={(e) => setFormData({ ...formData, isPaid: e.target.checked })}
            className="w-4 h-4 accent-[#4CC9F0]"
          />
          <label htmlFor="isPaid" className="ml-2 text-sm text-white/80">
            Paid Program
          </label>
        </div>

        {formData.isPaid && (
          <div className="grid grid-cols-3 gap-4 bg-white/5 p-4 rounded-lg border border-white/10">
            <div>
              <label
                className="block text-sm mb-2 text-white/80"
                htmlFor="fee"
              >
                Fee (৳)
              </label>
              <input
                id="fee"
                type="number"
                step="0.01"
                value={formData.registrationFee}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    registrationFee: e.target.value,
                  })
                }
                className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white"
              />
            </div>

            <div>
              <label
                className="block text-sm mb-2 text-white/80"
                htmlFor="paymentMethod"
              >
                Payment Method
              </label>
              <select
                id="paymentMethod"
                value={formData.paymentMethod}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    paymentMethod: e.target.value,
                  })
                }
                className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white"
              >
                <option className="text-black" value="both">
                  bKash & Nagad
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
              <label
                className="block text-sm mb-2 text-white/80"
                htmlFor="paymentNumber"
              >
                Payment Number
              </label>
              <input
                id="paymentNumber"
                type="tel"
                value={formData.paymentNumber}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    paymentNumber: e.target.value,
                  })
                }
                placeholder="017xxxxxxxx"
                className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40"
              />
            </div>
          </div>
        )}

        {/* ROW 11: Status */}
        <div>
          <label className="block text-sm mb-2 text-white/80" htmlFor="status">
            Status *
          </label>
          <select
            id="status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white"
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

        {/* SUBMIT BUTTONS */}
        <div className="flex justify-end gap-4 pt-6 border-t border-white/10">
          <button
            type="reset"
            onClick={() => {
              setFormData({
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
                type: itemType,
                status: "upcoming",
                featured: false,
                registrationLimit: "",
                registrationOpen: true,
                isPaid: false,
                registrationFee: "",
                paymentMethod: "both",
                paymentNumber: "",
                hosts: [],
                guests: [],
              });
              setCurrentHost("");
              setCurrentGuest("");
              setError("");
              setSuccess("");
            }}
            className="px-6 py-2.5 border border-white/30 text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            Clear Form
          </button>

          <Button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-[#4361EE] to-[#3A0CA3] hover:shadow-lg px-8"
          >
            {loading ? "Creating..." : `➕ Create ${formData.type.charAt(0).toUpperCase() + formData.type.slice(1)}`}
          </Button>
        </div>
      </form>
    </div>
  );
}
