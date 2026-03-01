"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import DataTable from "@/components/admin/DataTable";
import { Button } from "@/components/ui/Button";
import { Plus, FilterX } from "lucide-react";
import EventForm from "@/components/admin/forms/EventForm";
import {
  useGetEventsQuery,
  useDeleteEventMutation,
  useGetSeminarsQuery,
  useDeleteSeminarMutation,
  useGetBootcampsQuery,
  useGetWorkshopsQuery,
} from "@/lib/api/api";

type ProgramType = "events" | "seminars" | "bootcamp" | "workshops";
type PriceType = "limited" | "unlimited" | "all";
type LocationType = "online" | "offline" | "all";

export default function ProgramsPage() {
  const router = useRouter();
  const [programType, setProgramType] = useState<ProgramType>("events");
  const [priceType, setPriceType] = useState<PriceType>("all");
  const [locationType, setLocationType] = useState<LocationType>("all");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(20);

  // Fetch events
  const { data: eventsData, isLoading: eventsLoading } = useGetEventsQuery({
    query: `type=event&page=${page}&limit=${limit}&${search ? `search=${search}` : ""}${
      status ? `&status=${status}` : ""
    }`,
  });
  const [deleteEvent] = useDeleteEventMutation();

  // Fetch seminars
  const { data: seminarsData, isLoading: seminarsLoading } = useGetSeminarsQuery({
    query: `page=${page}&limit=${limit}&${search ? `search=${search}` : ""}${
      status ? `&status=${status}` : ""
    }`,
  });
  const [deleteSeminar] = useDeleteSeminarMutation();

  // Fetch bootcamp
  const { data: bootcampData, isLoading: bootcampLoading } = useGetBootcampsQuery({
    query: `page=${page}&limit=${limit}&${search ? `search=${search}` : ""}${
      status ? `&status=${status}` : ""
    }`,
  });
  const [deleteBootcamp] = useDeleteEventMutation();

  // Fetch workshops
  const { data: workshopsData, isLoading: workshopsLoading } = useGetWorkshopsQuery({
    query: `page=${page}&limit=${limit}&${search ? `search=${search}` : ""}${
      status ? `&status=${status}` : ""
    }`,
  });
  const [deleteWorkshop] = useDeleteEventMutation();

  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [totalPages, setTotalPages] = useState(1);

  // Determine data based on program type
  const currentData =
    programType === "events"
      ? eventsData?.data || { data: [], total: 0, page: 1, pages: 1 }
      : programType === "seminars"
      ? seminarsData?.data || { data: [], total: 0, page: 1, pages: 1 }
      : programType === "bootcamp"
      ? bootcampData?.data || { data: [], total: 0, page: 1, pages: 1 }
      : workshopsData?.data || { data: [], total: 0, page: 1, pages: 1 };

  const isLoading = 
    programType === "events"
      ? eventsLoading
      : programType === "seminars"
      ? seminarsLoading
      : programType === "bootcamp"
      ? bootcampLoading
      : workshopsLoading;

  useEffect(() => {
    if (currentData?.pages) {
      setTotalPages(currentData.pages);
    }
  }, [currentData]);

  // Define columns
  const columns = [
    { key: "title", label: "Title" },
    { key: "eventDate", label: "Date" },
    { key: "status", label: "Status" },
    { key: "location", label: "Location" },
    { key: "registrationLimit", label: "Capacity" },
  ];

  const filteredData = useMemo(() => {
    let data = Array.isArray(currentData?.data) ? currentData.data : [];

    // Filter by search
    if (search) {
      data = data.filter((item: any) =>
        item.title?.toLowerCase().includes(search.toLowerCase()) ||
        item.description?.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Filter by status
    if (status) {
      data = data.filter((item: any) => item.status === status);
    }

    // Filter by capacity/price
    if (priceType !== "all") {
      data = data.filter((item: any) => {
        if (priceType === "limited") return item.capacity && item.capacity < 100;
        if (priceType === "unlimited") return !item.capacity || item.capacity >= 100;
        return true;
      });
    }

    // Filter by location
    if (locationType !== "all") {
      data = data.filter((item: any) => item.location?.type === locationType);
    }

    return data;
  }, [currentData, search, status, priceType, locationType]);

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleDelete = async (item: any) => {
    if (confirm("Are you sure you want to delete this item?")) {
      try {
        if (programType === "events") {
          await deleteEvent(item._id).unwrap();
        } else if (programType === "seminars") {
          await deleteSeminar(item._id).unwrap();
        } else if (programType === "bootcamp") {
          await deleteBootcamp(item._id).unwrap();
        } else if (programType === "workshops") {
          await deleteWorkshop(item._id).unwrap();
        }
        alert("Item deleted successfully");
      } catch (error) {
        alert("Failed to delete item");
      }
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingItem(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0d1b2a] to-[#1a2f4a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#4CC9F0]">Programs</h1>
            <p className="text-[#90E0EF]/60 text-sm mt-1">
              Manage events, seminars, bootcamps, and workshops
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => {
                router.push(`/admin/programs/create?type=${programType}`);
              }}
              className="px-6 py-2.5 bg-gradient-to-r from-[#3A0CA3] to-[#4361EE] hover:shadow-lg text-white font-semibold rounded-lg transition-all flex items-center gap-2"
            >
              <Plus size={18} /> Full Form
            </button>
            <button
              onClick={() => {
                setEditingItem(null);
                setShowForm(true);
              }}
              className="px-6 py-2.5 bg-gradient-to-r from-[#4361EE] to-[#3A0CA3] hover:shadow-lg text-white font-semibold rounded-lg transition-all flex items-center gap-2"
            >
              <Plus size={18} /> Quick Add
            </button>
          </div>
        </div>

        {/* FILTERS */}
        <div className="bg-[rgba(2,29,46,0.8)] border border-[rgba(76,201,240,0.12)] rounded-xl p-6 mb-6">
          {/* Program Type Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            {(["events", "seminars", "bootcamp", "workshops"] as ProgramType[]).map(
              (type) => (
                <button
                  key={type}
                  onClick={() => {
                    setProgramType(type);
                    setPage(1);
                  }}
                  className={
                    programType === type
                      ? "px-4 py-2 rounded-lg font-medium transition-all bg-gradient-to-r from-[#4361EE]/20 to-[#3A0CA3]/10 text-[#4CC9F0] ring-1 ring-[#4361EE]/30"
                      : "px-4 py-2 rounded-lg font-medium transition-all bg-[rgba(76,201,240,0.05)] text-[#90E0EF]/60 hover:text-[#90E0EF]"
                  }
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              )
            )}
          </div>

          {/* Filter Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <input
              type="text"
              placeholder="Search by title..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 bg-[rgba(76,201,240,0.05)] border border-[rgba(76,201,240,0.1)] rounded-lg text-[#90E0EF] placeholder-[#90E0EF]/40 focus:outline-none focus:ring-2 focus:ring-[#3FB6D6]/40 text-sm"
            />

            {/* Status */}
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 bg-[rgba(76,201,240,0.05)] border border-[rgba(76,201,240,0.1)] rounded-lg text-[#90E0EF] focus:outline-none focus:ring-2 focus:ring-[#3FB6D6]/40 text-sm"
            >
              <option value="">All Status</option>
              <option value="upcoming">Upcoming</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            {/* Location */}
            <select
              value={locationType}
              onChange={(e) => setLocationType(e.target.value as LocationType)}
              className="px-3 py-2 bg-[rgba(76,201,240,0.05)] border border-[rgba(76,201,240,0.1)] rounded-lg text-[#90E0EF] focus:outline-none focus:ring-2 focus:ring-[#3FB6D6]/40 text-sm"
            >
              <option value="all">All Locations</option>
              <option value="online">Online</option>
              <option value="offline">Offline</option>
            </select>
          </div>

          {/* Clear Filters */}
          {(status || priceType !== "all" || locationType !== "all" || search) && (
            <button
              onClick={() => {
                setStatus("");
                setPriceType("all");
                setLocationType("all");
                setSearch("");
                setPage(1);
              }}
              className="mt-4 px-3 py-1.5 text-xs text-[#90E0EF]/60 hover:text-[#4CC9F0] flex items-center gap-1 transition-colors"
            >
              <FilterX size={14} /> Clear Filters
            </button>
          )}
        </div>

        {/* DATA TABLE */}
        {showForm && (
          <EventForm
            event={editingItem}
            itemType={programType}
            onClose={handleFormClose}
          />
        )}
        {!showForm && (
          <div className="bg-[rgba(2,29,46,0.8)] border border-[rgba(76,201,240,0.12)] rounded-xl overflow-hidden">
            {isLoading ? (
              <div className="p-8 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#4CC9F0]"></div>
                <p className="text-[#90E0EF]/60 mt-4">Loading {programType}...</p>
              </div>
            ) : filteredData.length === 0 ? (
              <div className="p-8 text-center text-[#90E0EF]/60">
                No {programType} found. Try adjusting your filters or create a new one.
              </div>
            ) : (
              <DataTable
                columns={columns}
                data={filteredData}
                onEdit={handleEdit}
                onDelete={handleDelete}
                pagination={{
                  page,
                  limit,
                  total: currentData?.total || 0,
                  pages: totalPages,
                  onPageChange: setPage,
                }}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
