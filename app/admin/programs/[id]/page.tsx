"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { ChevronLeft, Loader } from "lucide-react";
import Link from "next/link";
import EventFormEnhanced from "@/components/admin/forms/EventFormEnhanced";
import RegistrationManagement from "@/components/admin/RegistrationManagement";

export default function ProgramEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"details" | "registrations">("details");

  useEffect(() => {
    if (!id) {
      setError("Program ID not provided");
      setLoading(false);
      return;
    }

    const fetchEvent = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/events/${id}`);
        if (!response.ok) throw new Error("Failed to fetch event");

        const data = await response.json();
        if (!data.success) throw new Error(data.error || "Failed to fetch event");

        setEvent(data.data);
      } catch (err: any) {
        console.error("Error fetching event:", err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="animate-spin w-8 h-8 text-cyan-600" />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <Link href="/admin/programs">
          <Button variant="outline" className="mb-6">
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Programs
          </Button>
        </Link>
        <div className="bg-red-100 dark:bg-red-500/20 border border-red-300 dark:border-red-400 rounded-lg p-4 text-red-700 dark:text-red-300">
          {error || "Program not found"}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/programs">
              <Button variant="outline" size="sm">
                <ChevronLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {event.title}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {event.type.charAt(0).toUpperCase() + event.type.slice(1)} • {event.status}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-8">
            <button
              onClick={() => setActiveTab("details")}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "details"
                  ? "border-cyan-600 text-cyan-600 dark:text-cyan-400"
                  : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300"
              }`}
            >
              Edit Details
            </button>
            <button
              onClick={() => setActiveTab("registrations")}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "registrations"
                  ? "border-cyan-600 text-cyan-600 dark:text-cyan-400"
                  : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300"
              }`}
            >
              Registrations
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "details" && (
          <EventFormEnhanced 
            event={event} 
            itemType={event.type}
            onSuccess={() => {
              // Refresh event data
              const fetchEvent = async () => {
                const response = await fetch(`/api/events/${id}`);
                if (response.ok) {
                  const data = await response.json();
                  if (data.success) setEvent(data.data);
                }
              };
              fetchEvent();
            }}
          />
        )}

        {activeTab === "registrations" && <RegistrationManagement eventId={id} />}
      </div>
    </div>
  );
}
