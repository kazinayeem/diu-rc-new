"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import DataTable from "@/components/admin/DataTable";
import { Button } from "@/components/ui/Button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import ResearchPaperForm from "@/components/admin/forms/ResearchPaperForm";
import { useGetResearchPapersQuery, useDeleteResearchPaperMutation } from "@/lib/api/api";

export default function ResearchPapersPage() {
  const [papers, setPapers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPaper, setEditingPaper] = useState(null);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;
  const [pages, setPages] = useState(1);

  const query = useMemo(() => {
    return new URLSearchParams({
      page: String(page),
      limit: String(limit),
      ...(search ? { search } : {}),
    }).toString();
  }, [page, search]);

  const { data, isFetching } = useGetResearchPapersQuery({ query });
  const [deleteResearchPaper] = useDeleteResearchPaperMutation();

  useEffect(() => {
    setLoading(isFetching);
    if (data?.success) {
      setPapers(data.data);
      setPages(data.pagination.pages);
    } else {
      setPapers([]);
      setPages(1);
    }
  }, [data, isFetching]);

  const handleEdit = (paper: any) => {
    setEditingPaper(paper);
    setShowForm(true);
  };

  const handleDelete = async (paper: any) => {
    if (!confirm(`Delete paper: ${paper.title}?`)) return;
    try {
      await deleteResearchPaper(paper._id).unwrap();
    } catch (err) {
      console.error(err);
    }
  };

  const columns = [
    { key: "title", label: "Title" },
    { key: "authors", label: "Authors", render: (v: string[]) => v.join(", ") },
    { key: "conference", label: "Conference" },
    { key: "year", label: "Year" },
    {
      key: "status",
      label: "Status",
      render: (v: any) => (
        <span className="px-2 py-1 text-xs rounded-full bg-[#1f3b70] text-blue-200 border border-blue-400/20">
          {v}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (_: any, row: any) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleEdit(row)}
            className="text-blue-400 hover:text-blue-300 transition"
          >
            <Pencil size={18} />
          </button>

          <button
            onClick={() => handleDelete(row)}
            className="text-red-400 hover:text-red-300 transition"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="text-white">
      {/* ---------- HEADER ---------- */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Research Papers</h1>
          <p className="text-white/50 mt-1">
            Manage published and draft papers
          </p>
        </div>

        <Button
          onClick={() => setShowForm(true)}
          className="flex items-center bg-blue-600 hover:bg-blue-500 text-white"
        >
          <Plus size={20} className="mr-2" />
          Add Paper
        </Button>
      </div>

      {/* ---------- SEARCH ---------- */}
      <div className="mb-6 w-full md:w-1/2">
        <input
          placeholder="Search by title..."
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
          className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {/* ---------- MODAL FORM ---------- */}
      {showForm && (
        <ResearchPaperForm
          paper={editingPaper}
          onClose={() => {
            setShowForm(false);
            setEditingPaper(null);
          }}
        />
      )}

      {/* ---------- TABLE ---------- */}
      {loading ? (
        <div className="text-center py-10 text-white/70">Loading...</div>
      ) : (
        <div className="bg-[#0b1424] border border-white/10 rounded-xl shadow-xl overflow-hidden">
          <DataTable
            columns={columns}
            data={papers}
            pagination={{
              page,
              limit,
              total: pages * limit,
              pages,
              onPageChange: setPage,
            }}
          />
        </div>
      )}
    </div>
  );
}
