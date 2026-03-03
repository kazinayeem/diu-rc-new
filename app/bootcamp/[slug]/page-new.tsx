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

export default function BootcampDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [event, setEvent] = useState<EventDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  const handleRegistrationSuccess = () => {
    setRefetchTrigger(prev => prev + 1);
  };

  useEffect(() => {
    if (!slug) {
      setError("Bootcamp slug not provided");
      setLoading(false);
      return;
    }

    const fetchEvent = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `/api/events?slug=${encodeURIComponent(slug)}&_=${Date.now()}`,
          { cache: 'no-store' }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || "Failed to fetch bootcamp");
        }

        if (!data.data || data.data.length === 0) {
          throw new Error("Bootcamp not found");
        }

        setEvent(data.data[0]);
      } catch (err: any) {
        console.error("Error fetching bootcamp:", err);
        setError(
          err.message || "Something went wrong. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [slug, refetchTrigger]);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: event?.title,
          text: event?.description,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error("Share error:", err);
    }
  };

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

  const getModeColor = (mode: string) => {
    return mode === "online"
      ? "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300 border border-green-300 dark:border-green-400/40"
      : "bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 border border-yellow-300 dark:border-yellow-400/40";
  };

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
            Bootcamp Not Found
          </h1>

          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 max-w-md">
            {error || "The bootcamp you're looking for doesn't exist or has been removed."}
          </p>

          <Link href="/bootcamp">
            <Button className="bg-cyan-600 hover:bg-cyan-700 text-white">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Bootcamps
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
            href="/bootcamp"
            className="inline-flex items-center gap-2 text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Back to Bootcamps</span>
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
          {/* Left Column - Bootcamp Details */}
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
                <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(event.status)}`}>
                  {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                </span>

                {event.mode && (
                  <span className={`px-4 py-2 rounded-full text-sm font-medium ${getModeColor(event.mode)}`}>
                    {event.mode === "online" ? "🌐 Online" : "📍 Offline"}
                  </span>
                )}

                <span className="px-4 py-2 rounded-full text-sm font-medium bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-400/40">
                  🎓 Bootcamp
                </span>

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
                      Join Bootcamp →
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
                    <p className="text-sm text-gray-600 dark:text-gray-400">Participants</p>
                    <p className="font-semibold">{event.attendees}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">About This Bootcamp</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                {event.description}
              </p>

              {event.content && (
                <div className="mt-6 p-6 bg-gray-50 dark:bg-white/5 rounded-xl">
                  <h3 className="text-lg font-semibold mb-3">Bootcamp Details</h3>
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
                <h2 className="text-2xl font-bold mb-4">Instructors</h2>
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
                <h2 className="text-2xl font-bold mb-4">Guest Speakers</h2>
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
                <h3 className="text-lg font-semibold mb-3">Topics Covered</h3>
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
                  Bootcamp Organizer
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
            className="lg:col-span-1"
          >
            <div className="sticky top-24 bg-gradient-to-br from-cyan-50 dark:from-cyan-500/10 to-blue-50 dark:to-blue-500/10 rounded-xl p-6 border border-cyan-200 dark:border-cyan-500/30 shadow-lg">
              {/* Registration Status */}
              {event.status === "cancelled" ? (
                <div className="mb-6 p-4 bg-red-100 dark:bg-red-500/20 border border-red-300 dark:border-red-400/40 rounded-lg">
                  <p className="text-red-700 dark:text-red-300 font-semibold">
                    This bootcamp has been cancelled.
                  </p>
                </div>
              ) : event.status === "completed" ? (
                <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-500/20 border border-gray-300 dark:border-gray-400/40 rounded-lg">
                  <p className="text-gray-700 dark:text-gray-300 font-semibold">
                    This bootcamp has already concluded.
                  </p>
                </div>
              ) : (
                <>
                  {/* Registration Info */}
                  {event.registrationLimit && event.spotsRemaining !== null && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        Spots Available
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-cyan-600 dark:bg-cyan-400 h-2 rounded-full transition-all"
                            style={{
                              width: `${
                                event.registrationLimit > 0
                                  ? ((event.registrationLimit -
                                      (event.spotsRemaining || 0)) /
                                      event.registrationLimit) *
                                    100
                                  : 0
                              }%`,
                            }}
                          />
                        </div>
                        <span className="font-semibold text-lg whitespace-nowrap">
                          {event.spotsRemaining}/{event.registrationLimit}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Registration Fee */}
                  {event.isPaid && event.registrationFee && (
                    <div className="mb-6">
                      <div className="bg-white dark:bg-white/10 rounded-lg p-4 text-center mb-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Bootcamp Fee
                        </p>
                        <p className="text-3xl font-bold text-cyan-600 dark:text-cyan-400">
                          ৳{event.registrationFee}
                        </p>
                      </div>

                      {/* Payment Methods */}
                      {event.paymentMethods && event.paymentMethods.length > 0 ? (
                        <div className="space-y-3">
                          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            Pay via:
                          </p>
                          {event.paymentMethods.map((method, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: idx * 0.1 }}
                              className="bg-white dark:bg-white/5 rounded-lg p-3 border border-gray-200 dark:border-white/10"
                            >
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-lg font-bold">
                                    {method.method === "bkash" ? "🏦" : "📱"}
                                  </span>
                                  <span className="font-semibold text-sm">
                                    {method.method === "bkash" ? "bKash" : "Nagad"}
                                  </span>
                                </div>
                                <button
                                  onClick={() => {
                                    navigator.clipboard.writeText(method.number);
                                    setCopied(true);
                                    setTimeout(() => setCopied(false), 2000);
                                  }}
                                  className="text-xs px-2 py-1 bg-cyan-100 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 rounded hover:bg-cyan-200 dark:hover:bg-cyan-500/30 transition"
                                >
                                  {copied ? "Copied!" : "Copy"}
                                </button>
                              </div>
                              <p className="font-mono text-sm font-bold text-gray-800 dark:text-gray-200 mb-2">
                                {method.number}
                              </p>
                              {method.instructions && (
                                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed border-t border-gray-200 dark:border-white/10 pt-2">
                                  💡 {method.instructions}
                                </p>
                              )}
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Contact organizer for payment details
                        </div>
                      )}
                    </div>
                  )}

                  {/* Seat Availability */}
                  {event.registrationOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gradient-to-r from-purple-50 dark:from-purple-500/10 to-pink-50 dark:to-pink-500/10 rounded-xl p-5 border border-purple-200 dark:border-purple-500/30 mb-4"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        <h4 className="font-bold text-gray-900 dark:text-white">
                          Seat Availability
                        </h4>
                      </div>

                      {!event.registrationLimit ? (
                        <div className="flex items-center gap-2">
                          <div className="flex-1">
                            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                              ∞ Unlimited
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              Open for all participants
                            </p>
                          </div>
                          <div className="bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300 px-3 py-1 rounded-full text-xs font-semibold">
                            ✓ Available
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="flex items-end justify-between">
                            <div>
                              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                                Available Seats
                              </p>
                              <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                                {event.spotsRemaining || 0}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                                Total Booked
                              </p>
                              <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                                {event.registrationCount || 0}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                                Total Seats
                              </p>
                              <p className="text-3xl font-bold text-gray-700 dark:text-gray-300">
                                {event.registrationLimit}
                              </p>
                            </div>
                          </div>

                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{
                                width: `${
                                  event.registrationLimit > 0
                                    ? ((event.registrationCount || 0) /
                                        event.registrationLimit) *
                                      100
                                    : 0
                                }%`,
                              }}
                              transition={{ duration: 0.8, ease: "easeOut" }}
                              className={`h-full rounded-full ${
                                (event.spotsRemaining || 0) > 5
                                  ? "bg-gradient-to-r from-green-500 to-green-600"
                                  : (event.spotsRemaining || 0) > 0
                                  ? "bg-gradient-to-r from-yellow-500 to-orange-500"
                                  : "bg-gradient-to-r from-red-500 to-red-600"
                              }`}
                            />
                          </div>

                          {(event.spotsRemaining || 0) === 0 ? (
                            <div className="bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300 px-3 py-2 rounded-lg text-sm font-semibold text-center">
                              🚫 Fully Booked
                            </div>
                          ) : (event.spotsRemaining || 0) <= 5 ? (
                            <div className="bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 px-3 py-2 rounded-lg text-sm font-semibold text-center">
                              ⚡ Only {event.spotsRemaining} seat{event.spotsRemaining === 1 ? '' : 's'} left!
                            </div>
                          ) : (
                            <div className="bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300 px-3 py-2 rounded-lg text-sm font-semibold text-center">
                              ✓ Seats Available
                            </div>
                          )}
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* Registration Form or Link */}
                  {event.registrationOpen && (event.spotsRemaining === null || event.spotsRemaining === undefined || event.spotsRemaining > 0) ? (
                    <EventRegistrationForm
                      eventId={event._id}
                      eventTitle={event.title}
                      isPaid={event.isPaid}
                      registrationFee={event.registrationFee}
                      paymentMethods={event.paymentMethods}
                      onRegistrationSuccess={handleRegistrationSuccess}
                    />
                  ) : event.registrationLimit && event.spotsRemaining === 0 ? (
                    <div className="w-full bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300 font-bold py-4 px-4 rounded-lg text-center border border-red-300 dark:border-red-400/40">
                      <p className="text-lg">🚫 Bootcamp Fully Booked</p>
                      <p className="text-sm mt-2">All {event.registrationLimit} seats have been filled. This bootcamp is no longer accepting registrations.</p>
                    </div>
                  ) : (
                    <div className="w-full bg-gray-300 dark:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg text-center cursor-not-allowed">
                      Registration Closed
                    </div>
                  )}

                  {!event.registrationOpen && event.registrationLimit && event.spotsRemaining !== 0 && (
                      <div className="mt-3 p-3 bg-blue-100 dark:bg-blue-500/20 border border-blue-300 dark:border-blue-400/40 rounded-lg">
                        <p className="text-blue-700 dark:text-blue-300 text-sm font-semibold">
                          ℹ️ Registration for this bootcamp is currently closed.
                        </p>
                      </div>
                    )}
                </>
              )}

              <motion.button
                onClick={handleShare}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full mt-4 border border-cyan-400 dark:border-cyan-500 text-cyan-600 dark:text-cyan-400 font-semibold py-3 px-4 rounded-lg hover:bg-cyan-50 dark:hover:bg-cyan-500/10 transition-all flex items-center justify-center gap-2"
              >
                <Share2 className="w-5 h-5" />
                {copied ? "Copied!" : "Share Bootcamp"}
              </motion.button>

              <div className="mt-6 pt-6 border-t border-cyan-300 dark:border-cyan-500/20 space-y-3">
                <DetailItem label="Event Type" value={event.type} />
                <DetailItem label="Mode" value={event.mode} />
                {event.createdAt && (
                  <DetailItem
                    label="Created"
                    value={new Date(event.createdAt).toLocaleDateString()}
                  />
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-gray-600 dark:text-gray-400">{label}:</span>
      <span className="font-semibold text-gray-800 dark:text-gray-200">
        {value.charAt(0).toUpperCase() + value.slice(1)}
      </span>
    </div>
  );
}
