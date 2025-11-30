"use client";

import React, { useCallback, useEffect, useState } from "react";
import DataTable from "@/components/admin/DataTable";
import { Button } from "@/components/ui/Button";
import ProjectForm from "@/components/admin/forms/ProjectForm";
import { Plus, Pencil, Trash2 } from "lucide-react";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const [page, setPage] = useState(1);
  const limit = 10;
  const [pages, setPages] = useState(1);

  const fetchProjects = useCallback(async () => {
    setLoading(true);

    const res = await fetch(`/api/projects?page=${page}&limit=${limit}`);
    const data = await res.json();

    setProjects(data.data);
    setPages(data.pagination.pages);
    setLoading(false);
  }, [page]);
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const deleteProject = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    await fetch(`/api/projects/${id}`, { method: "DELETE" });
    fetchProjects();
  };

  const columns = [
    {
      key: "title",
      label: "Title",
      render: (v: any) => <span className="font-medium text-white">{v}</span>,
    },

    {
      key: "status",
      label: "Status",
      render: (v: any) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            v === "Completed"
              ? "bg-green-700/20 text-green-400"
              : v === "Under Development"
              ? "bg-yellow-700/20 text-yellow-400"
              : "bg-blue-700/20 text-blue-400"
          }`}
        >
          {v}
        </span>
      ),
    },

    {
      key: "featured",
      label: "Featured",
      render: (v: any) => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            v ? "bg-blue-600/20 text-blue-400" : "text-gray-400"
          }`}
        >
          {v ? "Yes" : "No"}
        </span>
      ),
    },

    {
      key: "actions",
      label: "Actions",
      render: (_: any, row: any) => (
        <div className="flex gap-3 justify-end">
          <button
            className="text-blue-400 hover:text-blue-300"
            onClick={() => {
              setEditing(row);
              setShowForm(true);
            }}
          >
            <Pencil size={18} />
          </button>

          <button
            className="text-red-400 hover:text-red-300"
            onClick={() => deleteProject(row._id)}
          >
            <Trash2 size={18} />
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
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-gray-400 mt-1">
            Manage robotics & AI project showcase entries
          </p>
        </div>

        <Button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-500"
        >
          <Plus size={20} className="mr-2" /> Add Project
        </Button>
      </div>

      {/* FORM MODAL */}
      {showForm && (
        <ProjectForm
          project={editing}
          onClose={() => {
            setShowForm(false);
            setEditing(null);
            fetchProjects();
          }}
        />
      )}

      {/* TABLE */}
      {loading ? (
        <div className="text-center py-16 text-gray-400">Loading...</div>
      ) : (
        <DataTable
          columns={columns}
          data={projects}
          pagination={{
            page,
            limit,
            pages,
            total: pages * limit,
            onPageChange: setPage,
          }}
        />
      )}
    </div>
  );
}
