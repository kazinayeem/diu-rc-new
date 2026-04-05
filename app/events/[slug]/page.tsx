"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import Link from "next/link";
import EventRegistrationForm from "@/components/public/EventRegistrationForm";
import parse, { HTMLReactParserOptions, Element, domToReact } from "html-react-parser";
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

// Helper function to decode HTML entities
const decodeHTMLEntities = (text: string): string => {
  const entities: { [key: string]: string } = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&nbsp;': ' ',
    '&apos;': "'",
  };
  
  let decoded = text;
  Object.entries(entities).forEach(([entity, char]) => {
    decoded = decoded.replace(new RegExp(entity, 'g'), char);
  });
  
  // Handle numeric entities
  decoded = decoded.replace(/&#(\d+);/g, (match, decimal) => {
    return String.fromCharCode(parseInt(decimal, 10));
  });
  decoded = decoded.replace(/&#x([0-9A-F]+);/gi, (match, hex) => {
    return String.fromCharCode(parseInt(hex, 16));
  });
  
  return decoded;
};

// HTML Parser options for React Quill content
const htmlParserOptions: HTMLReactParserOptions = {
  replace: (domNode) => {
    if (domNode instanceof Element) {
      const element = domNode as any;
      
      // Remove inline style attributes and replace with Tailwind classes
      delete element.attribs.style;
      
      // Apply Tailwind classes to HTML elements
      switch (element.name) {
        case 'h1':
          element.attribs.class = `text-2xl md:text-3xl font-bold mt-6 mb-4 text-gray-900 dark:text-white ${element.attribs.class || ''}`;
          break;
        case 'h2':
          element.attribs.class = `text-xl md:text-2xl font-bold mt-6 mb-3 text-gray-900 dark:text-white ${element.attribs.class || ''}`;
          break;
        case 'h3':
          element.attribs.class = `text-lg md:text-xl font-semibold mt-5 mb-3 text-gray-900 dark:text-white ${element.attribs.class || ''}`;
          break;
        case 'h4':
          element.attribs.class = `text-base md:text-lg font-semibold mt-4 mb-2 text-gray-900 dark:text-white ${element.attribs.class || ''}`;
          break;
        case 'p':
          element.attribs.class = `mb-4 leading-relaxed text-gray-700 dark:text-gray-300 ${element.attribs.class || ''}`;
          break;
        case 'span':
          element.attribs.class = `text-gray-700 dark:text-gray-300 ${element.attribs.class || ''}`;
          break;
        case 'ul':
          element.attribs.class = `list-disc list-inside mb-4 ml-4 space-y-2 text-gray-700 dark:text-gray-300 ${element.attribs.class || ''}`;
          break;
        case 'ol':
          element.attribs.class = `list-decimal list-inside mb-4 ml-4 space-y-2 text-gray-700 dark:text-gray-300 ${element.attribs.class || ''}`;
          break;
        case 'li':
          element.attribs.class = `mb-2 leading-relaxed text-gray-700 dark:text-gray-300 ${element.attribs.class || ''}`;
          break;
        case 'table':
          element.attribs.class = `w-full border-collapse border border-gray-300 dark:border-gray-600 my-4 ${element.attribs.class || ''}`;
          break;
        case 'thead':
          element.attribs.class = `bg-cyan-600 dark:bg-cyan-700 text-white ${element.attribs.class || ''}`;
          break;
        case 'th':
          element.attribs.class = `px-4 py-3 text-left font-semibold border border-gray-300 dark:border-gray-600 ${element.attribs.class || ''}`;
          break;
        case 'td':
          element.attribs.class = `px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 ${element.attribs.class || ''}`;
          break;
        case 'tr':
          if (element.parent?.name === 'tbody') {
            element.attribs.class = `hover:bg-gray-100 dark:hover:bg-white/10 transition-colors ${element.attribs.class || ''}`;
            const rowIndex = element.parent.children.indexOf(element);
            if (rowIndex % 2 === 0) {
              element.attribs.class += ` bg-gray-50 dark:bg-white/5`;
            }
          }
          break;
        case 'blockquote':
          element.attribs.class = `border-l-4 border-cyan-600 dark:border-cyan-400 pl-4 py-2 mb-4 bg-cyan-50 dark:bg-cyan-900/20 italic text-gray-700 dark:text-gray-300 ${element.attribs.class || ''}`;
          break;
        case 'code':
          element.attribs.class = `bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono text-red-600 dark:text-red-400 ${element.attribs.class || ''}`;
          break;
        case 'pre':
          element.attribs.class = `bg-gray-800 dark:bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-4 font-mono text-sm ${element.attribs.class || ''}`;
          break;
        case 'a':
          element.attribs.class = `text-cyan-600 dark:text-cyan-400 hover:underline transition-colors ${element.attribs.class || ''}`;
          element.attribs.target = '_blank';
          element.attribs.rel = 'noopener noreferrer';
          break;
        case 'strong':
        case 'b':
          element.attribs.class = `font-semibold text-gray-900 dark:text-white ${element.attribs.class || ''}`;
          break;
        case 'em':
        case 'i':
          element.attribs.class = `italic text-gray-700 dark:text-gray-300 ${element.attribs.class || ''}`;
          break;
        case 'hr':
          element.attribs.class = `border-gray-300 dark:border-gray-600 my-6 ${element.attribs.class || ''}`;
          break;
        case 'img':
          element.attribs.class = `max-w-full h-auto rounded-lg my-4 ${element.attribs.class || ''}`;
          break;
        case 'br':
          return <br />;
        default:
          break;
      }
    }
  },
};

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 transition-colors text-sm md:text-base"
          >
            <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
            <span>Back to Events</span>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Hero Section - Image & Title Side by Side */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 items-center"
        >
          {/* Image Column */}
          {event.image && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="relative overflow-hidden rounded-2xl bg-gray-200 dark:bg-gray-800 h-80 md:h-96 order-2 md:order-1"
            >
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </motion.div>
          )}

          {/* Title & Info Column */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="order-1 md:order-2"
          >
            {/* Title & Badges */}
            <div className="mb-6">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                {event.title}
              </h1>

              <div className="flex flex-wrap gap-2 mb-6">
                <span className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium ${getStatusColor(event.status)}`}>
                  {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                </span>

                {event.mode && (
                  <span className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium ${getModeColor(event.mode)}`}>
                    {event.mode === "online" ? "🌐 Online" : "📍 Offline"}
                  </span>
                )}

                {/* Type Badge with Dynamic Icon & Color */}
                <span className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium ${
                  event.type === "workshop"
                    ? "bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-300 border border-orange-300 dark:border-orange-400/40"
                    : event.type === "seminar"
                    ? "bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-400/40"
                    : event.type === "bootcamp"
                    ? "bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-400/40"
                    : "bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-400/40"
                }`}>
                  {event.type === "workshop" && "🛠️"}
                  {event.type === "seminar" && "🎓"}
                  {event.type === "bootcamp" && "🚀"}
                  {event.type === "event" && "📅"}
                  {" "}
                  {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                </span>

                {event.featured && (
                  <span className="px-4 py-2 rounded-full text-xs sm:text-sm font-medium bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 border border-yellow-300 dark:border-yellow-400/40">
                    ⭐ Featured
                  </span>
                )}
              </div>
            </div>

            {/* Quick Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 dark:bg-white/5 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <Calendar className="text-cyan-600 dark:text-cyan-400 w-5 h-5 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Date</p>
                  <p className="font-semibold text-sm sm:text-base">{formatDate(event.eventDate)}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="text-cyan-600 dark:text-cyan-400 w-5 h-5 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Time</p>
                  <p className="font-semibold text-sm sm:text-base">{event.eventTime}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="text-cyan-600 dark:text-cyan-400 w-5 h-5 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    {event.mode === "online" ? "Event Link" : "Location"}
                  </p>
                  {event.mode === "online" && event.eventLink ? (
                    <a
                      href={event.eventLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-cyan-600 dark:text-cyan-400 hover:underline break-all text-sm sm:text-base"
                    >
                      Join Event →
                    </a>
                  ) : (
                    <p className="font-semibold text-sm sm:text-base">{event.location}</p>
                  )}
                </div>
              </div>

              {event.attendees !== undefined && (
                <div className="flex items-start gap-3">
                  <Users className="text-cyan-600 dark:text-cyan-400 w-5 h-5 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Attendees</p>
                    <p className="font-semibold text-sm sm:text-base">{event.attendees}</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Event Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            {/* Description / About Section */}
            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-6">About This Event</h2>
              <div className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6 text-base md:text-lg">
                {parse(decodeHTMLEntities(event.description), htmlParserOptions)}
              </div>

              {event.content && (
                <div className="mt-6 p-6 md:p-8 bg-gray-50 dark:bg-white/5 rounded-2xl">
                  <h3 className="text-lg md:text-xl font-semibold mb-6">Event Details</h3>
                  <div className="prose prose-invert max-w-none">
                    {parse(decodeHTMLEntities(event.content), htmlParserOptions)}
                  </div>
                </div>
              )}
            </div>

            {/* Hosts Section */}
            {event.hosts && event.hosts.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-bold mb-6">Organizers</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {event.hosts.map((host, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex flex-col items-center"
                    >
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full p-1 mb-3 overflow-hidden">
                        {host.image ? (
                          <img
                            src={host.image}
                            alt={host.name}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                            <Users className="w-8 h-8 text-gray-500" />
                          </div>
                        )}
                      </div>
                      <p className="text-center font-semibold text-xs sm:text-sm text-gray-800 dark:text-gray-200 line-clamp-2">{host.name}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Guests Section */}
            {event.guests && event.guests.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-bold mb-6">Guest Speakers</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {event.guests.map((guest, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex flex-col items-center"
                    >
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full p-1 mb-3 overflow-hidden">
                        {guest.image ? (
                          <img
                            src={guest.image}
                            alt={guest.name}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                            <Users className="w-8 h-8 text-gray-500" />
                          </div>
                        )}
                      </div>
                      <p className="text-center font-semibold text-xs sm:text-sm text-gray-800 dark:text-gray-200 line-clamp-2">{guest.name}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {event.tags && event.tags.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg md:text-xl font-semibold mb-4">Topics Covered</h3>
                <div className="flex flex-wrap gap-2">
                  {event.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 sm:px-4 py-1 sm:py-2 bg-cyan-100 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 rounded-full text-xs sm:text-sm font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Creator Info */}
            {event.createdBy && (
              <div className="mt-8 p-6 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10">
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Event Organizer
                </p>
                <p className="font-semibold text-base sm:text-lg text-gray-900 dark:text-white">{event.createdBy.name}</p>
                <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm break-all">
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
