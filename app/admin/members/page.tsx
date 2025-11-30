"use client";

import React, { useState, useEffect, useCallback } from "react";
import DataTable from "@/components/admin/DataTable";
import { Button } from "@/components/ui/Button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import MemberForm from "@/components/admin/forms/MemberForm";

export default function MembersPage() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState<any>(null);

  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [isActive, setIsActive] = useState("");

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  // FETCH MEMBERS
  const fetchMembers = useCallback(async () => {
    try {
      setLoading(true);

      const query = new URLSearchParams({
        page: String(pagination.page),
        limit: String(pagination.limit),
        ...(search ? { search } : {}),
        ...(role ? { role } : {}),
        ...(isActive ? { isActive } : {}),
      }).toString();

      const res = await fetch(`/api/members?${query}`);
      const data = await res.json();

      if (data.success) {
        setMembers(data.data);
        setPagination((prev) => ({
          ...prev,
          total: data.pagination.total,
          pages: data.pagination.pages,
        }));
      }
    } catch (error) {
      console.error("Error fetching members:", error);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, search, role, isActive]);
  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const handleEdit = (member: any) => {
    setEditingMember(member);
    setShowForm(true);
  };

  const handleDelete = async (member: any) => {
    if (!confirm(`Are you sure you want to delete ${member.name}?`)) return;

    try {
      const res = await fetch(`/api/members/${member._id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (data.success) fetchMembers();
    } catch (error) {
      console.error("Error deleting member:", error);
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingMember(null);
    fetchMembers();
  };

  // TABLE COLUMNS
  const columns = [
    { key: "name", label: "Name" },
    { key: "studentId", label: "Student ID" },
    { key: "email", label: "Email" },

    {
      key: "role",
      label: "Role",
      render: (value: string) => (
        <span className="px-2 py-1 bg-white/10 text-[#1f8fff] border border-white/20 rounded-full text-xs font-semibold capitalize">
          {value}
        </span>
      ),
    },

    { key: "department", label: "Department" },
    { key: "batch", label: "Batch" },

    {
      key: "isActive",
      label: "Status",
      render: (value: boolean) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            value
              ? "bg-green-500/20 text-green-300 border border-green-500/30"
              : "bg-red-500/20 text-red-300 border border-red-500/30"
          }`}
        >
          {value ? "Active" : "Inactive"}
        </span>
      ),
    },

    {
      key: "actions",
      label: "Actions",
      render: (_: any, row: any) => (
        <div className="flex space-x-3">
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
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Members</h1>
          <p className="text-white/60">Manage club members</p>
        </div>

        <Button
          className="bg-[#1f8fff] hover:bg-[#0e6fd8]"
          onClick={() => setShowForm(true)}
        >
          <Plus size={20} className="mr-2" />
          Add Member
        </Button>
      </div>

      {/* FILTERS */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          className="bg-white/5 border border-white/20 rounded px-3 py-2 text-white placeholder-white/40 focus:ring-2 focus:ring-[#1f8fff] outline-none"
          placeholder="Search name / email / student ID"
          value={search}
          onChange={(e) => {
            setPagination((prev) => ({ ...prev, page: 1 }));
            setSearch(e.target.value);
          }}
        />

        <select
          className="bg-white/5 border border-white/20 rounded px-3 py-2 text-white focus:ring-2 focus:ring-[#1f8fff] outline-none"
          value={role}
          onChange={(e) => {
            setPagination((prev) => ({ ...prev, page: 1 }));
            setRole(e.target.value);
          }}
        >
          <option className="text-black" value="">
            All Roles
          </option>
          <option className="text-black" value="member">
            Member
          </option>
          <option className="text-black" value="executive">
            Executive
          </option>
          <option className="text-black" value="president">
            President
          </option>
        </select>

        <select
          className="bg-white/5 border border-white/20 rounded px-3 py-2 text-white focus:ring-2 focus:ring-[#1f8fff] outline-none"
          value={isActive}
          onChange={(e) => {
            setPagination((prev) => ({ ...prev, page: 1 }));
            setIsActive(e.target.value);
          }}
        >
          <option className="text-black" value="">
            All Status
          </option>
          <option className="text-black" value="true">
            Active
          </option>
          <option className="text-black" value="false">
            Inactive
          </option>
        </select>
      </div>

      {/* FORM MODAL */}
      {showForm && (
        <MemberForm member={editingMember} onClose={handleFormClose} />
      )}

      {/* TABLE */}
      {loading ? (
        <div className="text-center py-12 text-white/60">Loading...</div>
      ) : (
        <DataTable
          columns={columns}
          data={members}
          pagination={{
            ...pagination,
            onPageChange: (page) =>
              setPagination((prev) => ({ ...prev, page })),
          }}
        />
      )}
    </div>
  );
}
