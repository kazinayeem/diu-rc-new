"use client";

import React, { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useGetEventsQuery,
  useGetSeminarsQuery,
  useGetPostsQuery,
} from "@/lib/api/api";
import EventFormEnhanced from "@/components/admin/forms/EventFormEnhanced";
import DataTable from "@/components/admin/DataTable";
import { ArrowLeft, Plus } from "lucide-react";

type ProgramType = "events" | "seminars" | "bootcamp" | "workshops";

export default function CreateProgramPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = (searchParams.get("type") || "events") as ProgramType;
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [search, setSearch] = useState("");

  // Fetch programs based on type
  const { data: eventsData } = useGetEventsQuery({
    query: `page=${page}&limit=${limit}&${search ? `search=${search}` : ""}`,
  });

  const { data: seminarsData } = useGetSeminarsQuery({
    query: `page=${page}&limit=${limit}&${search ? `search=${search}` : ""}`,
  });

  const { data: bootcampData } = useGetPostsQuery({
    query: `page=${page}&limit=${limit}&${search ? `search=${search}` : ""}`,
  });

  // Get current data based on type
  const currentData =
    type === "events"
      ? eventsData?.data || { data: [], total: 0, pages: 1 }
      : type === "seminars"
      ? seminarsData?.data || { data: [], total: 0, pages: 1 }
      : bootcampData?.data || { data: [], total: 0, pages: 1 };

  const filteredData = useMemo(() => {
    let data = Array.isArray(currentData?.data) ? currentData.data : [];

    if (search) {
      data = data.filter((item: any) =>
        item.title?.toLowerCase().includes(search.toLowerCase()) ||
        item.description?.toLowerCase().includes(search.toLowerCase())
      );
    }

    return data;
  }, [currentData, search]);

  const columns: any[] = [
    {
      key: "title",
      label: "Title",
      render: (value: any) => <span className="font-medium">{value}</span>,
    },
    {
      key: "eventDate",
      label: "Date",
      render: (value: any) =>
        value ? new Date(value).toLocaleDateString("en-US") : "-",
    },
    {
      key: "host",
      label: "Host",
      render: (value: any) =>
        Array.isArray(value) ? value.join(", ") : value || "-",
    },
    {
      key: "guest",
      label: "Guest",
      render: (value: any) =>
        Array.isArray(value) ? value.join(", ") : value || "-",
    },
    {
      key: "status",
      label: "Status",
      render: (value: any) => (
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${
            value === "upcoming"
              ? "bg-blue-500/20 text-blue-300"
              : value === "ongoing"
              ? "bg-green-500/20 text-green-300"
              : value === "completed"
              ? "bg-gray-500/20 text-gray-300"
              : "bg-red-500/20 text-red-300"
          }`}
        >
          {value?.charAt(0).toUpperCase() + value?.slice(1)}
        </span>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0d1b2a] to-[#1a2f4a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* HEADER */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} className="text-[#3DB5D8]" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-[#3DB5D8]">
              Add {type.charAt(0).toUpperCase() + type.slice(1)}
            </h1>
            <p className="text-[#8ED6E6]/60 text-sm mt-1">
              Create new {type} with rich text editor support
            </p>
          </div>
        </div>

        {/* FORM SECTION */}
        <div className="mb-12">
          <EventFormEnhanced 
            itemType={type}
            onSuccess={() => {
              // Refresh data after creation
              window.location.reload();
            }}
          />
        </div>

        {/* LIST SECTION */}
        <div className="mt-12">
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-xl font-bold text-[#3DB5D8]">
              All {type.charAt(0).toUpperCase() + type.slice(1)}
            </h2>
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="px-4 py-2 bg-[rgba(61,181,216,0.05)] border border-[rgba(61,181,216,0.1)] rounded-lg text-[#8ED6E6] placeholder-[#8ED6E6]/40 focus:outline-none focus:ring-2 focus:ring-[#3DB5D8]/40"
            />
          </div>

          <div className="bg-[rgba(11,31,58,0.8)] border border-[rgba(61,181,216,0.12)] rounded-xl overflow-hidden">
            <DataTable
              columns={columns}
              data={filteredData}
              pagination={{
                page,
                limit,
                total: currentData?.total || 0,
                pages: currentData?.pages || 1,
                onPageChange: setPage,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
