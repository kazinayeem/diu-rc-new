"use client";

import React, { useState, useEffect } from "react";
import DataTable from "@/components/admin/DataTable";
import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";
import EventForm from "@/components/admin/forms/EventForm";
import Link from "next/link";

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [featured, setFeatured] = useState("");
  const fetchEvents = React.useCallback(async () => {
    try {
      setLoading(true);

      const query = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        ...(search ? { search } : {}),
        ...(status ? { status } : {}),
        ...(type ? { type } : {}),
        ...(featured ? { featured } : {}),
      }).toString();

      const res = await fetch(`/api/events?${query}`);
      const data = await res.json();

      if (data.success) {
        setEvents(data.data);
        setTotalPages(data.pagination.pages);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, status, type, featured]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleDelete = async (event: any) => {
    if (!confirm(`Are you sure you want to delete "${event.title}"?`)) return;

    try {
      const res = await fetch(`/api/events/${event._id}`, { method: "DELETE" });
      if (res.ok) fetchEvents();
    } catch (error: any) {
      console.error("Error deleting event:", error);
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingEvent(null);
    fetchEvents();
  };

  // 🌙 DARK MODE COLUMNS
  const columns = [
    { key: "title", label: "Title" },

    {
      key: "type",
      label: "Type",
      render: (value: string) => (
        <span className="px-2 py-1 bg-white/10 border border-white/20 text-blue-300 rounded-full text-xs font-semibold capitalize">
          {value}
        </span>
      ),
    },

    {
      key: "status",
      label: "Status",
      render: (value: string) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold border ${
            value === "upcoming"
              ? "bg-green-500/20 text-green-300 border-green-500/30"
              : value === "ongoing"
              ? "bg-blue-500/20 text-blue-300 border-blue-500/30"
              : value === "completed"
              ? "bg-gray-500/20 text-gray-300 border-gray-500/30"
              : "bg-red-500/20 text-red-300 border-red-500/30"
          }`}
        >
          {value}
        </span>
      ),
    },

    {
      key: "eventDate",
      label: "Date",
      render: (value: string) => (
        <span className="text-white/70">
          {new Date(value).toLocaleDateString()}
        </span>
      ),
    },

    { key: "location", label: "Location" },

    {
      key: "isPaid",
      label: "Payment",
      render: (value: boolean, row: any) =>
        value ? (
          <span className="px-2 py-1 bg-yellow-500/20 border border-yellow-400/30 text-yellow-300 rounded-full text-xs font-semibold">
            BDT {row.registrationFee}
          </span>
        ) : (
          <span className="text-white/50 text-xs">Free</span>
        ),
    },

    {
      key: "actions",
      label: "Actions",
      render: (_: any, row: any) => (
        <div className="flex space-x-3">
          {row.type === "workshop" && (
            <a
              href={`/admin/workshops/${row._id}/registrations`}
              className="text-blue-400 hover:text-blue-300 text-sm"
            >
              View Registrations
            </a>
          )}

          <Link
            href={`/admin/events/${row._id}/edit`}
            className="text-green-400 hover:text-green-300"
          >
            Edit
          </Link>

          <button
            onClick={() => handleDelete(row)}
            className="text-red-400 hover:text-red-300"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="text-white">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Events</h1>
          <p className="text-white/60">Manage club events</p>
        </div>
        <Link href={"/admin/events/add"}>
          <Button
            // onClick={() => setShowForm(true)}
            className="bg-[#1f8fff] hover:bg-[#0e6fd8]"
          >
            <Plus size={20} className="mr-2" />
            Add Event
          </Button>
        </Link>
      </div>

      {/* FILTERS */}
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-4 gap-3">
        <input
          type="text"
          placeholder="Search by title..."
          className="px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:ring-2 focus:ring-[#1f8fff]"
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
        />

        <select
          className="px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-[#1f8fff]"
          value={status}
          onChange={(e) => {
            setPage(1);
            setStatus(e.target.value);
          }}
        >
          <option className="text-black" value="">
            All Status
          </option>
          <option className="text-black" value="upcoming">
            Upcoming
          </option>
          <option className="text-black" value="ongoing">
            Ongoing
          </option>
          <option className="text-black" value="completed">
            Completed
          </option>
        </select>

        <select
          className="px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-[#1f8fff]"
          value={type}
          onChange={(e) => {
            setPage(1);
            setType(e.target.value);
          }}
        >
          <option className="text-black" value="">
            All Types
          </option>
          <option className="text-black" value="workshop">
            Workshop
          </option>
          <option className="text-black" value="seminar">
            Seminar
          </option>
          <option className="text-black" value="competition">
            Competition
          </option>
          <option className="text-black" value="webinar">
            Webinar
          </option>
        </select>

        <select
          className="px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-[#1f8fff]"
          value={featured}
          onChange={(e) => {
            setPage(1);
            setFeatured(e.target.value);
          }}
        >
          <option className="text-black" value="">
            Featured?
          </option>
          <option className="text-black" value="true">
            Featured
          </option>
          <option className="text-black" value="false">
            Not Featured
          </option>
        </select>
      </div>

      {/* FORM */}
      {showForm && <EventForm event={editingEvent} onClose={handleFormClose} />}

      {/* TABLE */}
      {loading ? (
        <div className="text-center py-12 text-white/60">Loading...</div>
      ) : (
        <DataTable columns={columns} data={events} />
      )}

      {/* PAGINATION */}
      <div className="flex justify-center mt-6 space-x-3">
        <Button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="bg-white/10 hover:bg-white/20"
        >
          Prev
        </Button>

        <span className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg">
          Page {page} / {totalPages}
        </span>

        <Button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="bg-white/10 hover:bg-white/20"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
