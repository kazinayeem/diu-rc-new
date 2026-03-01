"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGetEventBySlugQuery, useCreateRegistrationMutation } from "@/lib/api/api";
import { motion } from "framer-motion";
import { Calendar, MapPin, Users, Zap, ChevronLeft, Send } from "lucide-react";

export default function BootcampDetailPage({ params }: { params: { slug: string } }) {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [submitted, setSubmitted] = useState(false);

  const { data: bootcampData, isLoading } = useGetEventBySlugQuery(params.slug);
  const bootcamp = bootcampData?.data;

  const [register, { isLoading: isRegistering }] = useCreateRegistrationMutation();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register({
        eventId: bootcamp?._id,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
      }).unwrap();
      setSubmitted(true);
      setFormData({ name: "", email: "", phone: "" });
      setTimeout(() => setSubmitted(false), 3000);
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0d1b2a] to-[#1a2f4a] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4CC9F0]"></div>
      </div>
    );
  }

  if (!bootcamp) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0d1b2a] to-[#1a2f4a] flex flex-col items-center justify-center px-4">
        <h1 className="text-2xl font-bold text-[#4CC9F0] mb-4">Bootcamp Not Found</h1>
        <Link href="/bootcamp" className="text-[#90E0EF] hover:text-[#4CC9F0]">
          Back to Bootcamps
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0d1b2a] to-[#1a2f4a]">
      {/* BACK BUTTON */}
      <div className="sticky top-0 z-10 bg-[rgba(13,27,42,0.8)] border-b border-[rgba(76,201,240,0.1)] backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link
            href="/bootcamp"
            className="inline-flex items-center gap-2 text-[#4CC9F0] hover:text-[#00E5FF] transition-colors"
          >
            <ChevronLeft size={20} />
            Back to Bootcamps
          </Link>
        </div>
      </div>

      {/* HERO IMAGE */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative h-96 bg-[rgba(76,201,240,0.05)]"
      >
        {bootcamp.image ? (
          <Image
            src={bootcamp.image}
            alt={bootcamp.title}
            fill
            className="object-cover"
            onError={(e) => {
              (e.target as any).src =
                "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80";
            }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#4361EE]/20 to-[#3A0CA3]/20 flex items-center justify-center">
            <Users size={64} className="text-[#90E0EF]/30" />
          </div>
        )}
      </motion.div>

      {/* CONTENT */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* MAIN CONTENT */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2"
          >
            {/* TITLE */}
            <h1 className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-[#4CC9F0] to-[#4361EE] bg-clip-text text-transparent">
              {bootcamp.title}
            </h1>

            {/* STATUS BADGE */}
            <div className="mb-6">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  bootcamp.status === "upcoming"
                    ? "bg-blue-500/20 text-blue-300"
                    : bootcamp.status === "ongoing"
                    ? "bg-green-500/20 text-green-300"
                    : "bg-gray-500/20 text-gray-300"
                }`}
              >
                {bootcamp.status?.charAt(0).toUpperCase() + bootcamp.status?.slice(1)}
              </span>
            </div>

            {/* META INFO */}
            <div className="space-y-4 mb-8 pb-8 border-b border-[rgba(76,201,240,0.1)]">
              {bootcamp.eventDate && (
                <div className="flex items-start gap-3">
                  <Calendar size={20} className="text-[#4CC9F0] mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-[#90E0EF]/60 text-sm">Date & Time</p>
                    <p className="text-[#4CC9F0] font-medium">
                      {new Date(bootcamp.eventDate).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}{" "}
                      {bootcamp.eventTime && `at ${bootcamp.eventTime}`}
                    </p>
                  </div>
                </div>
              )}

              {bootcamp.location && (
                <div className="flex items-start gap-3">
                  <MapPin size={20} className="text-[#4CC9F0] mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-[#90E0EF]/60 text-sm">Location</p>
                    <p className="text-[#4CC9F0] font-medium">{bootcamp.location}</p>
                    {bootcamp.mode === "online" && bootcamp.eventLink && (
                      <a
                        href={bootcamp.eventLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#00E5FF] hover:underline mt-1 text-sm"
                      >
                        Join online →
                      </a>
                    )}
                  </div>
                </div>
              )}

              {bootcamp.host && bootcamp.host.length > 0 && (
                <div className="flex items-start gap-3">
                  <Users size={20} className="text-[#4CC9F0] mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-[#90E0EF]/60 text-sm">Hosts</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {Array.isArray(bootcamp.host) ? (
                        bootcamp.host.map((h: string, idx: number) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-[rgba(76,201,240,0.1)] text-[#4CC9F0] rounded-full text-sm"
                          >
                            {h}
                          </span>
                        ))
                      ) : (
                        <span className="px-3 py-1 bg-[rgba(76,201,240,0.1)] text-[#4CC9F0] rounded-full text-sm">
                          {bootcamp.host}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {bootcamp.guest && bootcamp.guest.length > 0 && (
                <div className="flex items-start gap-3">
                  <Zap size={20} className="text-[#00E5FF] mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-[#90E0EF]/60 text-sm">Guest Speakers</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {Array.isArray(bootcamp.guest) ? (
                        bootcamp.guest.map((g: string, idx: number) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-[rgba(0,229,255,0.1)] text-[#00E5FF] rounded-full text-sm"
                          >
                            {g}
                          </span>
                        ))
                      ) : (
                        <span className="px-3 py-1 bg-[rgba(0,229,255,0.1)] text-[#00E5FF] rounded-full text-sm">
                          {bootcamp.guest}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* DESCRIPTION */}
            <div className="prose prose-invert max-w-none">
              <h2 className="text-2xl font-bold text-[#4CC9F0] mb-4">About</h2>
              <p className="text-[#90E0EF]/80 leading-relaxed whitespace-pre-wrap">
                {bootcamp.description || "No description available"}
              </p>
            </div>
          </motion.div>

          {/* SIDEBAR */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-1"
          >
            {/* PRICING CARD */}
            <div className="sticky top-24 bg-[rgba(2,29,46,0.8)] border border-[rgba(76,201,240,0.2)] rounded-xl p-6 space-y-6">
              <div>
                <p className="text-[#90E0EF]/60 text-sm mb-2">Registration</p>
                {bootcamp.registrationOpen ? (
                  <p className="text-xl font-bold text-green-400">Open</p>
                ) : (
                  <p className="text-xl font-bold text-red-400">Closed</p>
                )}
              </div>

              {bootcamp.isPaid && (
                <div>
                  <p className="text-[#90E0EF]/60 text-sm mb-2">Fee</p>
                  <p className="text-2xl font-bold text-[#4CC9F0]">
                    ৳{bootcamp.registrationFee}
                  </p>
                  <p className="text-xs text-[#90E0EF]/60 mt-1">
                    Payment: {bootcamp.paymentMethod === "both" ? "bKash & Nagad" : bootcamp.paymentMethod === "bkash" ? "bKash" : "Nagad"}
                  </p>
                  {bootcamp.paymentNumber && (
                    <p className="text-xs text-[#90E0EF]/60 mt-1">
                      @{bootcamp.paymentNumber}
                    </p>
                  )}
                </div>
              )}

              {bootcamp.registrationLimit > 0 && (
                <div>
                  <p className="text-[#90E0EF]/60 text-sm mb-2">Seats Available</p>
                  <p className="text-lg font-bold text-[#4CC9F0]">
                    {bootcamp.registrationLimit}
                  </p>
                </div>
              )}

              {/* REGISTRATION FORM */}
              {bootcamp.registrationOpen ? (
                <form onSubmit={handleRegister} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-[rgba(76,201,240,0.05)] border border-[rgba(76,201,240,0.2)] rounded-lg text-[#90E0EF] placeholder-[#90E0EF]/40 focus:outline-none focus:ring-2 focus:ring-[#4CC9F0] text-sm"
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 bg-[rgba(76,201,240,0.05)] border border-[rgba(76,201,240,0.2)] rounded-lg text-[#90E0EF] placeholder-[#90E0EF]/40 focus:outline-none focus:ring-2 focus:ring-[#4CC9F0] text-sm"
                    required
                  />
                  <input
                    type="tel"
                    placeholder="Phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-[rgba(76,201,240,0.05)] border border-[rgba(76,201,240,0.2)] rounded-lg text-[#90E0EF] placeholder-[#90E0EF]/40 focus:outline-none focus:ring-2 focus:ring-[#4CC9F0] text-sm"
                    required
                  />

                  {submitted && (
                    <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                      <p className="text-green-300 text-sm text-center">
                        ✓ Registered successfully!
                      </p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isRegistering}
                    className="w-full px-4 py-3 bg-gradient-to-r from-[#4CC9F0] to-[#4361EE] text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-[#4CC9F0]/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                  >
                    <Send size={16} />
                    {isRegistering ? "Registering..." : "Register Now"}
                  </button>
                </form>
              ) : (
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <p className="text-red-300 text-center font-medium">
                    Registration Closed
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
