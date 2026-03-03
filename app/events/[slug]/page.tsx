"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import Link from "next/link";
import EventRegistrationForm from "@/components/public/EventRegistrationForm";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Share2,
  ChevronLeft,
  AlertCircle,
  Loader,
} from "lucide-react";

interface EventDetails {
  _id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  image?: string;
  eventDate: string;
  eventTime: string;
  location: string;
  mode?: "online" | "offline";
  eventLink?: string;
  registrationLink?: string;
  registrationLimit?: number;
  registrationOpen: boolean;
  isPaid: boolean;
  registrationFee?: number;
  paymentMethods?: Array<{
    method: "bkash" | "nagad";
    number: string;
    instructions?: string;
  }>;
  type: "event" | "workshop" | "seminar" | "bootcamp";
  status: "upcoming" | "ongoing" | "completed" | "cancelled";
  featured: boolean;
  attendees?: number;
  registrationCount?: number;
  spotsRemaining?: number;
  tags?: string[];
  hosts?: Array<{
    name: string;
    image?: string;
  }>;
  guests?: Array<{
    name: string;
    image?: string;
  }>;
  createdBy?: {
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export default function EventDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [event, setEvent] = useState<EventDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  const handleRegistrationSuccess = () => {
    // Trigger refetch by updating state
    setRefetchTrigger(prev => prev + 1);
  };

  useEffect(() => {
    if (!slug) {
      setError("Event slug not provided");
      setLoading(false);
      return;
    }

    const fetchEvent = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch event by slug from the general endpoint with cache busting
        const response = await fetch(
          `/api/events?slug=${encodeURIComponent(slug)}&_=${Date.now()}`,
          { cache: 'no-store' }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || "Failed to fetch event");
        }

        if (!data.data || data.data.length === 0) {
          throw new Error("Event not found");
        }

        setEvent(data.data[0]);
      } catch (err: any) {
        console.error("Error fetching event:", err);
        setError(
          err.message || "Something went wrong. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [slug, refetchTrigger]);

  // Handle share
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: event?.title,
          text: event?.description,
          url: window.location.href,
        });
      } else {
        // Fallback: Copy URL to clipboard
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error("Share error:", err);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (e) {
      return dateString;
    }
  };

  // Status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-400/40";
      case "ongoing":
        return "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300 border border-green-300 dark:border-green-400/40";
      case "completed":
        return "bg-gray-100 dark:bg-gray-500/20 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-400/40";
      case "cancelled":
        return "bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-400/40";
      default:
        return "bg-gray-100 dark:bg-gray-500/20 text-gray-700 dark:text-gray-300";
    }
  };

  // Mode badge color
  const getModeColor = (mode: string) => {
    return mode === "online"
      ? "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300 border border-green-300 dark:border-green-400/40"
      : "bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 border border-yellow-300 dark:border-yellow-400/40";
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-transparent">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="text-4xl"
        >
          <Loader className="text-cyan-600 dark:text-cyan-400 w-12 h-12" />
        </motion.div>
      </div>
    );
  }

  // Error state
  if (error || !event) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-transparent px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="mb-4 flex justify-center">
            <div className="bg-red-100 dark:bg-red-500/20 rounded-full p-4">
              <AlertCircle className="text-red-600 dark:text-red-400 w-12 h-12" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-black dark:text-white mb-2">
            Event Not Found
          </h1>

          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 max-w-md">
            {error || "The event you're looking for doesn't exist or has been removed."}
          </p>

          <Link href="/events">
            <Button className="bg-cyan-600 hover:bg-cyan-700 text-white">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Events
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-transparent text-black dark:text-white">
      {/* Back Button */}
      <div className="sticky top-[104px] z-30 bg-white/80 dark:bg-black/40 backdrop-blur-sm border-b border-gray-200 dark:border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Back to Events</span>
          </Link>
        </div>
      </div>

      {/* Hero Image */}
      {event.image && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative h-96 w-full overflow-hidden bg-gray-200 dark:bg-gray-800"
        >
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </motion.div>
      )}

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Event Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2"
          >
            {/* Title & Badges */}
            <div className="mb-6">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {event.title}
              </h1>

              <div className="flex flex-wrap gap-3 mb-4">
                {/* Status Badge */}
                <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(event.status)}`}>
                  {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                </span>

                {/* Mode Badge */}
                {event.mode && (
                  <span className={`px-4 py-2 rounded-full text-sm font-medium ${getModeColor(event.mode)}`}>
                    {event.mode === "online" ? "🌐 Online" : "📍 Offline"}
                  </span>
                )}

                {/* Type Badge */}
                <span className="px-4 py-2 rounded-full text-sm font-medium bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-400/40">
                  {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                </span>

                {/* Featured Badge */}
                {event.featured && (
                  <span className="px-4 py-2 rounded-full text-sm font-medium bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 border border-yellow-300 dark:border-yellow-400/40">
                    ⭐ Featured
                  </span>
                )}
              </div>
            </div>

            {/* Quick Info */}
            <div className="grid sm:grid-cols-2 gap-4 mb-8 bg-gray-50 dark:bg-white/5 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <Calendar className="text-cyan-600 dark:text-cyan-400 w-5 h-5 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Date</p>
                  <p className="font-semibold">{formatDate(event.eventDate)}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="text-cyan-600 dark:text-cyan-400 w-5 h-5 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Time</p>
                  <p className="font-semibold">{event.eventTime}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="text-cyan-600 dark:text-cyan-400 w-5 h-5 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {event.mode === "online" ? "Event Link" : "Location"}
                  </p>
                  {event.mode === "online" && event.eventLink ? (
                    <a
                      href={event.eventLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-cyan-600 dark:text-cyan-400 hover:underline break-all"
                    >
                      Join Event →
                    </a>
                  ) : (
                    <p className="font-semibold">{event.location}</p>
                  )}
                </div>
              </div>

              {event.attendees !== undefined && (
                <div className="flex items-start gap-3">
                  <Users className="text-cyan-600 dark:text-cyan-400 w-5 h-5 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Attendees</p>
                    <p className="font-semibold">{event.attendees}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">About This Event</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                {event.description}
              </p>

              {event.content && (
                <div className="mt-6 p-6 bg-gray-50 dark:bg-white/5 rounded-xl">
                  <h3 className="text-lg font-semibold mb-3">Event Details</h3>
                  <div 
                    className="prose prose-invert max-w-none text-gray-700 dark:text-gray-300 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-4 [&_h2]:mb-2 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-3 [&_h3]:mb-2 [&_p]:mb-3 [&_ul]:mb-3 [&_ul]:ml-4 [&_li]:mb-1 [&_li]:list-disc"
                    dangerouslySetInnerHTML={{ __html: event.content }}
                  />
                </div>
              )}
            </div>

            {/* Hosts Section */}
            {event.hosts && event.hosts.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Hosts</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {event.hosts.map((host, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex flex-col items-center"
                    >
                      <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full p-1 mb-3 overflow-hidden">
                        {host.image ? (
                          <img
                            src={host.image}
                            alt={host.name}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                            <Users className="w-10 h-10 text-gray-500" />
                          </div>
                        )}
                      </div>
                      <p className="text-center font-semibold text-sm">{host.name}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Guests Section */}
            {event.guests && event.guests.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Special Guests</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {event.guests.map((guest, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex flex-col items-center"
                    >
                      <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full p-1 mb-3 overflow-hidden">
                        {guest.image ? (
                          <img
                            src={guest.image}
                            alt={guest.name}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                            <Users className="w-10 h-10 text-gray-500" />
                          </div>
                        )}
                      </div>
                      <p className="text-center font-semibold text-sm">{guest.name}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {event.tags && event.tags.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {event.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-cyan-100 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 rounded-full text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Creator Info */}
            {event.createdBy && (
              <div className="mt-8 p-6 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/10">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Event Creator
                </p>
                <p className="font-semibold text-lg">{event.createdBy.name}</p>
                <p className="text-gray-600 dark:text-gray-400">
                  {event.createdBy.email}
                </p>
              </div>
            )}
          </motion.div>

          {/* Right Column - Registration Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-24 bg-white dark:bg-white/5 rounded-2xl p-5 border border-gray-200 dark:border-white/10 shadow-xl backdrop-blur-sm">
              {/* Registration Status */}
              {event.status === "cancelled" ? (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-lg"
                >
                  <p className="text-red-700 dark:text-red-400 font-semibold text-sm">
                    🚫 This event has been cancelled.
                  </p>
                </motion.div>
              ) : event.status === "completed" ? (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-3 bg-gray-50 dark:bg-gray-500/10 border border-gray-200 dark:border-gray-500/30 rounded-lg"
                >
                  <p className="text-gray-700 dark:text-gray-400 font-semibold text-sm">
                    ✓ Event concluded
                  </p>
                </motion.div>
              ) : (
                <>
                  {/* Fee Display - Compact */}
                  {event.isPaid && event.registrationFee && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.1 }}
                      className="mb-5 p-3 bg-gradient-to-br from-cyan-50 dark:from-cyan-500/20 to-blue-50 dark:to-blue-500/20 rounded-lg border border-cyan-200 dark:border-cyan-500/30"
                    >
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Fee</p>
                      <div className="flex items-baseline gap-2">
                        <p className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">
                          ৳{event.registrationFee}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">per person</p>
                      </div>
                    </motion.div>
                  )}

                  {/* Payment Via - Compact */}
                  {event.isPaid && event.paymentMethods && event.paymentMethods.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.15 }}
                      className="mb-5 p-3 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/10"
                    >
                      <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">Pay via:</p>
                      <div className="space-y-2">
                        {event.paymentMethods.map((method, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 + idx * 0.08 }}
                            className="flex items-center justify-between p-2 bg-white dark:bg-white/10 rounded-lg border border-gray-200 dark:border-white/10 hover:border-cyan-300 dark:hover:border-cyan-500/50 transition-all group"
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-lg">
                                {method.method === "bkash" ? "🏦" : "📱"}
                              </span>
                              <div>
                                <p className="font-semibold text-xs text-gray-900 dark:text-white">
                                  {method.method === "bkash" ? "bKash" : "Nagad"}
                                </p>
                                <p className="font-mono text-xs text-gray-600 dark:text-gray-400">
                                  {method.number}
                                </p>
                              </div>
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => {
                                navigator.clipboard.writeText(method.number);
                                setCopied(true);
                                setTimeout(() => setCopied(false), 1500);
                              }}
                              className="text-xs px-2 py-1 bg-cyan-100 dark:bg-cyan-500/30 text-cyan-700 dark:text-cyan-300 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              {copied ? "✓" : "Copy"}
                            </motion.button>
                          </motion.div>
                        ))}
                      </div>
                      {event.paymentMethods[0]?.instructions && (
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 pt-2 border-t border-gray-200 dark:border-white/10">
                          💡 {event.paymentMethods[0].instructions}
                        </p>
                      )}
                    </motion.div>
                  )}

                  {/* Seat Availability - Compact */}
                  {event.registrationOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.2 }}
                      className="mb-5 p-3 bg-gradient-to-br from-purple-50 dark:from-purple-500/15 to-pink-50 dark:to-pink-500/15 rounded-lg border border-purple-200 dark:border-purple-500/30"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">Availability</p>
                        {!event.registrationLimit ? (
                          <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-500/30 text-green-700 dark:text-green-300 rounded-full font-semibold">
                            ∞ Unlimited
                          </span>
                        ) : (event.spotsRemaining || 0) > 5 ? (
                          <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-500/30 text-green-700 dark:text-green-300 rounded-full font-semibold">
                            ✓ Open
                          </span>
                        ) : (event.spotsRemaining || 0) > 0 ? (
                          <span className="text-xs px-2 py-1 bg-yellow-100 dark:bg-yellow-500/30 text-yellow-700 dark:text-yellow-300 rounded-full font-semibold">
                            ⚡ {event.spotsRemaining} left
                          </span>
                        ) : (
                          <span className="text-xs px-2 py-1 bg-red-100 dark:bg-red-500/30 text-red-700 dark:text-red-300 rounded-full font-semibold">
                            Full
                          </span>
                        )}
                      </div>

                      {event.registrationLimit && (
                        <>
                          <div className="flex items-end gap-3 mb-2">
                            <div className="flex-1">
                              <p className="text-xs text-gray-600 dark:text-gray-400">Available</p>
                              <p className="text-lg font-bold text-green-600 dark:text-green-400">
                                {event.spotsRemaining || 0}
                              </p>
                            </div>
                            <div className="w-12 h-12 flex items-center justify-center bg-white dark:bg-white/10 rounded-lg border border-gray-200 dark:border-white/20">
                              <p className="text-xs text-center">
                                <p className="font-bold text-gray-900 dark:text-white">{event.registrationCount || 0}</p>
                                <p className="text-gray-500 dark:text-gray-400">/</p>
                                <p className="text-gray-600 dark:text-gray-300">{event.registrationLimit}</p>
                              </p>
                            </div>
                          </div>

                          <motion.div
                            className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-2 overflow-hidden"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          >
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{
                                width: `${
                                  event.registrationLimit > 0
                                    ? ((event.registrationCount || 0) / event.registrationLimit) * 100
                                    : 0
                                }%`,
                              }}
                              transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
                              className={`h-full rounded-full transition-all ${
                                (event.spotsRemaining || 0) > 5
                                  ? "bg-gradient-to-r from-green-500 to-emerald-500"
                                  : (event.spotsRemaining || 0) > 0
                                  ? "bg-gradient-to-r from-yellow-500 to-orange-500"
                                  : "bg-gradient-to-r from-red-500 to-rose-500"
                              }`}
                            />
                          </motion.div>
                        </>
                      )}
                    </motion.div>
                  )}

                  {/* Registration Form or Link */}
                  {event.registrationOpen && (event.spotsRemaining === null || event.spotsRemaining === undefined || event.spotsRemaining > 0) ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.25 }}
                    >
                      <EventRegistrationForm
                        eventId={event._id}
                        eventTitle={event.title}
                        isPaid={event.isPaid}
                        registrationFee={event.registrationFee}
                        paymentMethods={event.paymentMethods}
                        onRegistrationSuccess={handleRegistrationSuccess}
                      />
                    </motion.div>
                  ) : event.registrationLimit && event.spotsRemaining === 0 ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.25 }}
                      className="w-full bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 font-semibold py-3 px-4 rounded-lg text-center border border-red-200 dark:border-red-500/30"
                    >
                      🚫 Fully Booked
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.25 }}
                      className="w-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold py-3 px-4 rounded-lg text-center cursor-not-allowed"
                    >
                      Registration Closed
                    </motion.div>
                  )}

                  {!event.registrationOpen && event.registrationLimit && event.spotsRemaining !== 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.27 }}
                      className="mt-3 p-2.5 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 rounded-lg"
                    >
                      <p className="text-blue-700 dark:text-blue-400 text-xs font-semibold">
                        ℹ️ Registration will open soon
                      </p>
                    </motion.div>
                  )}
                </>
              )}

              {/* Share Button */}
              <motion.button
                onClick={handleShare}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="w-full mt-4 border border-cyan-300 dark:border-cyan-500/50 text-cyan-600 dark:text-cyan-400 bg-white dark:bg-white/5 hover:bg-cyan-50 dark:hover:bg-cyan-500/10 font-semibold py-2.5 px-4 rounded-lg transition-all flex items-center justify-center gap-2 text-sm"
              >
                <Share2 className="w-4 h-4" />
                {copied ? "Copied!" : "Share"}
              </motion.button>

              {/* Quick Info Footer */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.35 }}
                className="mt-4 pt-4 border-t border-gray-200 dark:border-white/10 space-y-2"
              >
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-600 dark:text-gray-400">Type:</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">
                    {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                  </span>
                </div>
                {event.mode && (
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-600 dark:text-gray-400">Mode:</span>
                    <span className="font-semibold text-gray-800 dark:text-gray-200">
                      {event.mode.charAt(0).toUpperCase() + event.mode.slice(1)}
                    </span>
                  </div>
                )}
                {event.createdAt && (
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-600 dark:text-gray-400">Created:</span>
                    <span className="font-semibold text-gray-800 dark:text-gray-200">
                      {new Date(event.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
