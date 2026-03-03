"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import DataTable from "@/components/admin/DataTable";
import { Button } from "@/components/ui/Button";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import MemberForm from "@/components/admin/forms/MemberForm";
import { useGetMembersQuery, useDeleteMemberMutation } from "@/lib/api/api";

export default function MembersPage() {
  const [members, setMembers] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deletingBulk, setDeletingBulk] = useState(false);

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

  useEffect(() => {
    const handler = (event: Event) => {
      const detail = (event as CustomEvent<string>).detail || "";
      setPagination((prev) => ({ ...prev, page: 1 }));
      setSearch(detail);
    };

    window.addEventListener("admin-search", handler as EventListener);
    return () => {
      window.removeEventListener("admin-search", handler as EventListener);
    };
  }, []);

  const queryStr = useMemo(() =>
    new URLSearchParams({
      page: String(pagination.page),
      limit: String(pagination.limit),
      ...(search ? { search } : {}),
      ...(role ? { role } : {}),
      ...(isActive ? { isActive } : {}),
    }).toString(),
  [pagination.page, pagination.limit, search, role, isActive]);

  
  const { data, isFetching } = useGetMembersQuery({ query: queryStr });
  const [deleteMember] = useDeleteMemberMutation();

  useEffect(() => {
    if (data?.success && data?.data) {
      console.log("Members data received:", data);
      setMembers(Array.isArray(data.data) ? data.data : []);
      setPagination((prev) => ({
        ...prev,
        total: data.pagination?.total || 0,
        pages: data.pagination?.pages || 0,
      }));
    } else {
      console.warn("No valid data from API:", data);
      setMembers([]);
      setPagination((prev) => ({ ...prev, total: 0, pages: 0 }));
    }
  }, [data, isFetching]);

  const handleEdit = (member: any) => {
    setEditingMember(member);
    setShowForm(true);
  };

  const handleDelete = async (member: any) => {
    if (!confirm(`Are you sure you want to delete ${member.name}?`)) return;

    try {
      await deleteMember(member._id).unwrap();
      
    } catch (error) {
      console.error("Error deleting member:", error);
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingMember(null);
    
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;

    if (!confirm(`Are you sure you want to delete ${selectedIds.length} member(s)?`)) {
      return;
    }

    setDeletingBulk(true);
    try {
      const deletePromises = selectedIds.map(id => deleteMember(id).unwrap());
      await Promise.all(deletePromises);
      setSelectedIds([]);
      alert(`Successfully deleted ${selectedIds.length} member(s)`);
    } catch (error) {
      console.error("Bulk delete error:", error);
      alert("Failed to delete some members");
    } finally {
      setDeletingBulk(false);
    }
  };

  const handleDeleteAll = async () => {
    if (members.length === 0) {
      alert("No members to delete");
      return;
    }

    const confirmMsg = `⚠️ WARNING: This will delete ALL members from the database! This action cannot be undone! Are you sure?`;

    if (!confirm(confirmMsg)) {
      return;
    }

    setDeletingBulk(true);
    try {
      const allIds = members.map((member: any) => member._id);
      const deletePromises = allIds.map(id => deleteMember(id).unwrap());
      await Promise.all(deletePromises);
      setSelectedIds([]);
      alert(`Successfully deleted all ${allIds.length} member(s)`);
    } catch (error) {
      console.error("Delete all error:", error);
      alert("Failed to delete all members");
    } finally {
      setDeletingBulk(false);
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === members.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(members.map(member => member._id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  
  const columns = [
    {
      key: "select",
      label: (
        <input
          type="checkbox"
          checked={members.length > 0 && selectedIds.length === members.length}
          onChange={toggleSelectAll}
          className="cursor-pointer"
        />
      ),
      render: (_: any, row: any) => (
        <input
          type="checkbox"
          checked={selectedIds.includes(row._id)}
          onChange={() => toggleSelectOne(row._id)}
          className="cursor-pointer"
        />
      ),
    },
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
          <p className="text-white/60">
            Manage club members
            {pagination.total > 0 && (
              <span className="ml-2 text-cyan-400">
                (Total: {pagination.total})
              </span>
            )}
            {selectedIds.length > 0 && (
              <span className="ml-2 text-yellow-400">
                - {selectedIds.length} selected
              </span>
            )}
          </p>
        </div>

        <div className="flex gap-3">
          {selectedIds.length > 0 && (
            <Button
              onClick={handleBulkDelete}
              disabled={deletingBulk}
              className="bg-red-600 hover:bg-red-700"
            >
              {deletingBulk ? (
                <>
                  <Loader2 size={18} className="mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 size={18} className="mr-2" />
                  Delete Selected ({selectedIds.length})
                </>
              )}
            </Button>
          )}
          <Button
            onClick={handleDeleteAll}
            disabled={deletingBulk || members.length === 0}
            className="bg-red-700 hover:bg-red-800"
          >
            {deletingBulk ? (
              <>
                <Loader2 size={18} className="mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 size={18} className="mr-2" />
                Delete All
              </>
            )}
          </Button>
          <Button
            className="bg-[#1f8fff] hover:bg-[#0e6fd8]"
            onClick={() => setShowForm(true)}
          >
            <Plus size={20} className="mr-2" />
            Add Member
          </Button>
        </div>
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
          <optgroup label="Advising Panel" className="text-black font-bold">
            <option className="text-black" value="advisor">Advisor</option>
            <option className="text-black" value="convener">Convener</option>
          </optgroup>
          <optgroup label="Executive Committee" className="text-black font-bold">
            <option className="text-black" value="president">President</option>
            <option className="text-black" value="vice-president">Vice-president</option>
            <option className="text-black" value="vice president">Vice President</option>
            <option className="text-black" value="general secretary">General Secretary</option>
            <option className="text-black" value="treasurer">Treasurer</option>
            <option className="text-black" value="joint secretary">Joint Secretary</option>
            <option className="text-black" value="assistant general secretary">Assistant General Secretary</option>
            <option className="text-black" value="organizing secretary">Organizing Secretary</option>
            <option className="text-black" value="assistant organizing secretary">Assistant Organizing Secretary</option>
            <option className="text-black" value="training secretary">Training Secretary</option>
            <option className="text-black" value="training secretory">Training secretory</option>
            <option className="text-black" value="assistant training secretary">Assistant Training Secretary</option>
            <option className="text-black" value="media and press secretary">Media and Press Secretary</option>
            <option className="text-black" value="senior assistant media and press secretary">Senior Assistant Media and Press Secretary</option>
            <option className="text-black" value="assistant media and press secretary">Assistant Media and Press Secretary</option>
            <option className="text-black" value="public relation and communication secretary">Public Relation and Communication Secretary</option>
            <option className="text-black" value="assistant public relation and communication secretary">Assistant Public Relation and Communication Secretary</option>
            <option className="text-black" value="executive">Executive</option>
          </optgroup>
          <optgroup label="Team Roles" className="text-black font-bold">
            <option className="text-black" value="deputy">Deputy</option>
            <option className="text-black" value="general">General</option>
            <option className="text-black" value="member">Member</option>
          </optgroup>
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
      {isFetching ? (
        <div className="text-center py-12">
          <div className="inline-block">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#1f8fff]"></div>
            <p className="text-white/60 mt-4">Loading members...</p>
          </div>
        </div>
      ) : members.length > 0 ? (
        <DataTable
          columns={columns}
          data={members}
          pagination={{
            ...pagination,
            onPageChange: (page) =>
              setPagination((prev) => ({ ...prev, page })),
          }}
        />
      ) : (
        <div className="text-center py-12 text-white/60">
          <p>No members found. Add your first member to get started.</p>
        </div>
      )}
    </div>
  );
}
