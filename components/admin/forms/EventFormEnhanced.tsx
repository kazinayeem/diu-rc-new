"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Loader, AlertCircle, Check, Plus, X, Edit2 } from "lucide-react";
import { useUpdateEventMutation, useCreateEventMutation } from "@/lib/api/api";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

interface EventFormEnhancedProps {
  event?: any;
  itemType?: "events" | "seminars" | "bootcamp" | "workshops";
  onSuccess?: () => void;
}

interface Host {
  name: string;
  image?: string;
}

interface Guest {
  name: string;
  image?: string;
}

interface PaymentMethod {
  method: "bkash" | "nagad";
  number: string;
  instructions?: string;
}

export default function EventFormEnhanced({
  event,
  itemType = "events",
  onSuccess,
}: EventFormEnhancedProps) {
  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ font: [] }],
      [{ size: ["small", false, "large", "huge"] }],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ align: [] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      ["blockquote", "code-block"],
      ["link", "image", "video"],
      ["clean"],
    ],
  };

  const quillFormats = [
    "header",
    "font",
    "size",
    "align",
    "indent",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "color",
    "background",
    "link",
    "image",
    "video",
    "blockquote",
    "code-block",
  ];

  const getPlainText = (html: string) =>
    html
      .replace(/<[^>]*>/g, " ")
      .replace(/&nbsp;/g, " ")
      .trim();

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
    type: getInitialType(),
    status: "upcoming",
    featured: false,
    registrationType: "open",
    registrationLimit: "",
    registrationOpen: true,
    isPaid: false,
    registrationFee: "",
    tags: "",
  });

  const [hosts, setHosts] = useState<Host[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);

  const [newHost, setNewHost] = useState({ name: "", image: "" });
  const [newGuest, setNewGuest] = useState({ name: "", image: "" });
  const [newPayment, setNewPayment] = useState<PaymentMethod>({ method: "bkash", number: "", instructions: "" });

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
        tags: event.tags?.join(", ") || "",
      });

      setHosts(event.hosts || []);
      setGuests(event.guests || []);
      setPaymentMethods(event.paymentMethods || []);
    }
  }, [event]);

  const [updateEvent] = useUpdateEventMutation();
  const [createEvent] = useCreateEventMutation();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddHost = () => {
    if (newHost.name.trim()) {
      setHosts([...hosts, { ...newHost }]);
      setNewHost({ name: "", image: "" });
    }
  };

  const handleRemoveHost = (index: number) => {
    setHosts(hosts.filter((_, i) => i !== index));
  };

  const handleAddGuest = () => {
    if (newGuest.name.trim()) {
      setGuests([...guests, { ...newGuest }]);
      setNewGuest({ name: "", image: "" });
    }
  };

  const handleRemoveGuest = (index: number) => {
    setGuests(guests.filter((_, i) => i !== index));
  };

  const handleAddPaymentMethod = () => {
    if (newPayment.number.trim()) {
      setPaymentMethods([...paymentMethods, { ...newPayment }]);
      setNewPayment({ method: "bkash", number: "", instructions: "" });
    }
  };

  const handleRemovePaymentMethod = (index: number) => {
    setPaymentMethods(paymentMethods.filter((_, i) => i !== index));
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

      if (!formData.title.trim()) {
        throw new Error("Title is required");
      }
      if (!getPlainText(formData.description)) {
        throw new Error("Description is required");
      }
      if (!formData.eventDate) {
        throw new Error("Event date is required");
      }

      const submitData = {
        ...formData,
        registrationLimit:
          formData.registrationType === "limited"
            ? parseInt(formData.registrationLimit) || null
            : null,
        registrationOpen: formData.registrationType !== "closed",
        registrationFee: formData.isPaid && formData.registrationFee && formData.registrationFee.trim()
          ? parseFloat(formData.registrationFee) || 0
          : 0,
        tags: formData.tags
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t),
        hosts,
        guests,
        paymentMethods: formData.isPaid ? paymentMethods : [],
      };

      let response;

      if (event?._id) {
        response = await updateEvent({
          id: event._id,
          body: submitData,
        }).unwrap();
      } else {
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
          {event ? "Edit" : "Create"} Event/Program
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
              Type <span className="text-red-600">*</span>
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white"
              required
            >
              <option value="event">Event</option>
              <option value="workshop">Workshop</option>
              <option value="seminar">Seminar</option>
              <option value="bootcamp">Bootcamp</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Description <span className="text-red-600">*</span>
            </label>
            <ReactQuill
              theme="snow"
              value={formData.description}
              onChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  description: value,
                }))
              }
              modules={quillModules}
              formats={quillFormats}
              placeholder="Short description"
              className="bg-white dark:bg-gray-800 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Rich Content / Details</label>
            <ReactQuill
              theme="snow"
              value={formData.content}
              onChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  content: value,
                }))
              }
              modules={quillModules}
              formats={quillFormats}
              placeholder="Detailed content, agenda, links, images, and formatting"
              className="bg-white dark:bg-gray-800 rounded-lg"
            />
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
              Full editor enabled: headings, colors, alignment, lists, links, image/video embed, and code block.
            </p>
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
                <label className="block text-sm font-medium mb-2">Event Link</label>
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
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">Registration Settings</h3>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
              formData.registrationType === "closed"
                ? "bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300"
                : formData.registrationType === "limited"
                ? "bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-300"
                : "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300"
            }`}>
              {formData.registrationType === "closed" ? "🔒 Registration Closed" : 
               formData.registrationType === "limited" ? "⚠️ Limited Spots" : 
               "✅ Open Registration"}
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Quick Toggle */}
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
            <p className="text-sm font-medium mb-3">Quick Toggle: Registration Status</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleRegistrationTypeChange("open")}
                className={`flex-1 py-2 px-3 rounded-lg font-medium transition-colors ${
                  formData.registrationType !== "closed"
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300"
                }`}
              >
                ✅ ON
              </button>
              <button
                type="button"
                onClick={() => handleRegistrationTypeChange("closed")}
                className={`flex-1 py-2 px-3 rounded-lg font-medium transition-colors ${
                  formData.registrationType === "closed"
                    ? "bg-red-600 text-white"
                    : "bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300"
                }`}
              >
                🔒 OFF
              </button>
            </div>
          </div>

          {/* Detailed Options */}
          <div>
            <label className="block text-sm font-medium mb-3">Registration Type (Advanced)</label>
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
                    onChange={(e) => handleRegistrationTypeChange(e.target.value)}
                    className="w-4 h-4"
                  />
                  <div>
                    <p className="font-medium">{option.label}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{option.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {formData.registrationType === "limited" && (
            <div>
              <label className="block text-sm font-medium mb-2">Registration Limit</label>
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

          <p className="text-sm text-gray-600 dark:text-gray-400 bg-blue-50 dark:bg-blue-500/10 p-3 rounded-lg border border-blue-200 dark:border-blue-500/20">
            📝 Note: Built-in registration form is now enabled on the public event page. Users register directly with name, email, and mobile.
          </p>
        </CardContent>
      </Card>

      {/* Hosts */}
      <Card>
        <CardHeader>
          <h3 className="font-semibold text-lg">Hosts & Speakers</h3>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            {hosts.map((host, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                <div className="flex items-center gap-3">
                  {host.image && (
                    <img src={host.image} alt={host.name} className="w-10 h-10 rounded-full object-cover" />
                  )}
                  <span className="font-medium">{host.name}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveHost(index)}
                  className="text-red-600 dark:text-red-400 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 dark:border-gray-600 pt-4 space-y-3">
            <input
              type="text"
              value={newHost.name}
              onChange={(e) => setNewHost({ ...newHost, name: e.target.value })}
              placeholder="Host name"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white"
            />
            <input
              type="text"
              value={newHost.image}
              onChange={(e) => setNewHost({ ...newHost, image: e.target.value })}
              placeholder="Host image URL"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white"
            />
            <Button
              type="button"
              onClick={handleAddHost}
              variant="outline"
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Host
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Guests */}
      <Card>
        <CardHeader>
          <h3 className="font-semibold text-lg">Special Guests</h3>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            {guests.map((guest, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                <div className="flex items-center gap-3">
                  {guest.image && (
                    <img src={guest.image} alt={guest.name} className="w-10 h-10 rounded-full object-cover" />
                  )}
                  <span className="font-medium">{guest.name}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveGuest(index)}
                  className="text-red-600 dark:text-red-400 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 dark:border-gray-600 pt-4 space-y-3">
            <input
              type="text"
              value={newGuest.name}
              onChange={(e) => setNewGuest({ ...newGuest, name: e.target.value })}
              placeholder="Guest name"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white"
            />
            <input
              type="text"
              value={newGuest.image}
              onChange={(e) => setNewGuest({ ...newGuest, image: e.target.value })}
              placeholder="Guest image URL"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white"
            />
            <Button
              type="button"
              onClick={handleAddGuest}
              variant="outline"
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Guest
            </Button>
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
              <div>
                <label className="block text-sm font-medium mb-2">Registration Fee (৳)</label>
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

              {/* Payment Methods */}
              <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                <h4 className="font-medium mb-3">Payment Methods</h4>
                <div className="space-y-2 mb-4">
                  {paymentMethods.map((method, index) => (
                    <div key={index} className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold">
                          {method.method.toUpperCase()}: {method.number}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemovePaymentMethod(index)}
                          className="text-red-600 dark:text-red-400 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      {method.instructions && (
                        <p className="text-sm text-gray-700 dark:text-gray-300">{method.instructions}</p>
                      )}
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-200 dark:border-gray-600 pt-4 space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-2">Method</label>
                    <select
                      value={newPayment.method}
                      onChange={(e) =>
                        setNewPayment({
                          ...newPayment,
                          method: e.target.value as "bkash" | "nagad",
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white"
                    >
                      <option value="bkash">Bkash</option>
                      <option value="nagad">Nagad</option>
                    </select>
                  </div>

                  <input
                    type="text"
                    value={newPayment.number}
                    onChange={(e) => setNewPayment({ ...newPayment, number: e.target.value })}
                    placeholder="Payment number (e.g., 01700000000)"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white"
                  />

                  <textarea
                    value={newPayment.instructions}
                    onChange={(e) => setNewPayment({ ...newPayment, instructions: e.target.value })}
                    placeholder="Payment instructions (optional)"
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white"
                  />

                  <Button
                    type="button"
                    onClick={handleAddPaymentMethod}
                    variant="outline"
                    className="w-full"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Payment Method
                  </Button>
                </div>
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
