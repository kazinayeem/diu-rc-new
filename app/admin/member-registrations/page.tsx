"use client";

import React, { useState, useEffect, useMemo } from "react";
import DataTable from "@/components/admin/DataTable";
import { Button } from "@/components/ui/Button";
import { Eye, Trash2, Upload, Download, Plus, Loader2, Search, X } from "lucide-react";
import { useGetMemberRegistrationsQuery, useUpdateMemberRegistrationMutation, useDeleteMemberRegistrationMutation } from "@/lib/api/api";
import ImportExportModal from "@/components/admin/ImportExportModal";
import AddRegistrationModal from "@/components/admin/AddRegistrationModal";

export default function MemberRegistrationsPage() {
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalClosing, setIsModalClosing] = useState(false);
  const [showImportExport, setShowImportExport] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deletingBulk, setDeletingBulk] = useState(false);

  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const [selectedRegistration, setSelectedRegistration] = useState<any>(null);

  useEffect(() => {
    const handler = (event: Event) => {
      const detail = (event as CustomEvent<string>).detail || "";
      setPage(1);
      setSearch(detail);
    };

    window.addEventListener("admin-search", handler as EventListener);
    return () => {
      window.removeEventListener("admin-search", handler as EventListener);
    };
  }, []);

  const queryStr = useMemo(() =>
    new URLSearchParams({
      page: String(page),
      limit: String(limit),
      ...(selectedStatus ? { status: selectedStatus } : {}),
      ...(search ? { search } : {}),
    }).toString(),
  [page, limit, selectedStatus, search]);

  const { data, isFetching, refetch } = useGetMemberRegistrationsQuery({ query: queryStr });
  const [updateMemberRegistration, { isLoading: isUpdating }] = useUpdateMemberRegistrationMutation();
  const [deleteMemberRegistration, { isLoading: isDeleting }] = useDeleteMemberRegistrationMutation();

  // Smooth modal close with animation
  const closeModal = () => {
    setIsModalClosing(true);
    setTimeout(() => {
      setSelectedRegistration(null);
      setIsModalClosing(false);
    }, 200);
  };

  useEffect(() => {
    setLoading(isFetching);
    if (data?.success) {
      setRegistrations(data.data);
      setTotalPages(data.pagination.pages);
      setTotalRecords(data.pagination.total || 0);
      // Clear selected IDs when data changes
      setSelectedIds([]);
    } else {
      setRegistrations([]);
      setTotalPages(1);
      setTotalRecords(0);
      setSelectedIds([]);
    }
  }, [data, isFetching]);

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await updateMemberRegistration({ id, body: { status } }).unwrap();
      // Close modal after successful update with animation
      closeModal();
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status");
    }
  };

  const handlePaymentStatus = async (id: string, paymentStatus: string) => {
    try {
      await updateMemberRegistration({ id, body: { paymentStatus } }).unwrap();
      // Close modal after successful update with animation
      closeModal();
    } catch (err) {
      console.error("Payment update error:", err);
      alert("Failed to update payment status");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this registration?")) return;

    try {
      await deleteMemberRegistration(id).unwrap();
      // Close modal if deleted registration was open
      if (selectedRegistration?._id === id) {
        closeModal();
      }
    } catch (error) {
      console.error("Error deleting:", error);
      alert("Failed to delete registration");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) {
      alert("Please select registrations to delete");
      return;
    }

    if (!confirm(`Are you sure you want to delete ${selectedIds.length} registration(s)?`)) {
      return;
    }

    setDeletingBulk(true);

    try {
      const response = await fetch("/api/admin/member-registrations/bulk-delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedIds }),
      });

      const result = await response.json();

      if (result.success) {
        setSelectedIds([]);
        alert(result.message);
        // Trigger refetch
        setPage(page);
      } else {
        alert(result.message || "Failed to delete registrations");
      }
    } catch (error) {
      console.error("Bulk delete error:", error);
      alert("Failed to delete registrations");
    } finally {
      setDeletingBulk(false);
    }
  };

  const handleDeleteAll = async () => {
    if (registrations.length === 0) {
      alert("No registrations to delete");
      return;
    }

    // Fetch ALL registration IDs (not just current page)
    setDeletingBulk(true);

    try {
      const params = new URLSearchParams({
        page: "1",
        limit: "999999", // Get all registrations
        ...(selectedStatus ? { status: selectedStatus } : {}),
        ...(search ? { search } : {}),
      }).toString();

      const response = await fetch(`/api/member-registrations?${params}`);
      const result = await response.json();

      if (!result.success || !result.data) {
        throw new Error("Failed to fetch all registrations");
      }

      const totalCount = result.data.length;
      const allIds = result.data.map((reg: any) => reg._id);

      const confirmMsg = selectedStatus || search
        ? `Are you sure you want to delete all ${totalCount} filtered registration(s)?`
        : `⚠️ WARNING: This will delete ALL ${totalCount} registration(s) from the database! This action cannot be undone!`;

      if (!confirm(confirmMsg)) {
        setDeletingBulk(false);
        return;
      }

      const deleteResponse = await fetch("/api/admin/member-registrations/bulk-delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: allIds }),
      });

      const deleteResult = await deleteResponse.json();

      if (deleteResult.success) {
        setSelectedIds([]);
        alert(deleteResult.message);
        // Trigger refetch
        setPage(1);
      } else {
        alert(deleteResult.message || "Failed to delete all registrations");
      }
    } catch (error) {
      console.error("Delete all error:", error);
      alert("Failed to delete all registrations");
    } finally {
      setDeletingBulk(false);
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === registrations.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(registrations.map(reg => reg._id));
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
          checked={registrations.length > 0 && selectedIds.length === registrations.length}
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
    { key: "department", label: "Department" },

    {
      key: "paymentStatus",
      label: "Payment",
      render: (v: string) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold capitalize border 
            ${
              v === "approved"
                ? "bg-green-500/20 text-green-300 border-green-400/30"
                : v === "rejected"
                ? "bg-red-500/20 text-red-300 border-red-400/30"
                : "bg-yellow-500/20 text-yellow-300 border-yellow-400/30"
            }
          `}
        >
          {v}
        </span>
      ),
    },

    {
      key: "status",
      label: "Status",
      render: (value: string) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold capitalize border 
            ${
              value === "approved"
                ? "bg-green-500/20 text-green-300 border-green-500/30"
                : value === "rejected"
                ? "bg-red-500/20 text-red-300 border-red-500/30"
                : value === "reviewed"
                ? "bg-blue-500/20 text-blue-300 border-blue-500/30"
                : "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
            }
          `}
        >
          {value}
        </span>
      ),
    },

    {
      key: "actions",
      label: "Actions",
      render: (_: any, row: any) => (
        <div className="flex space-x-3">
          <button
            onClick={() => setSelectedRegistration(row)}
            disabled={isDeleting}
            className="text-blue-400 hover:text-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
            title="View Details"
          >
            <Eye size={18} />
          </button>

          <button
            onClick={() => handleDelete(row._id)}
            disabled={isDeleting}
            className="text-red-400 hover:text-red-300 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Delete"
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
      <div className="flex flex-col gap-4 mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-1">Member Registrations</h1>
            <p className="text-white/60">
              Review and manage membership applications
              {totalRecords > 0 && (
                <span className="ml-2 text-cyan-400">
                  (Total: {totalRecords})
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
              disabled={deletingBulk || registrations.length === 0}
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
              onClick={() => setShowAddModal(true)}
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus size={18} className="mr-2" />
              Add New
            </Button>
            <Button
              onClick={() => setShowImportExport(true)}
              className="bg-cyan-600 hover:bg-cyan-700"
            >
              <Upload size={18} className="mr-2" />
              <Download size={18} className="mr-2" />
              Import/Export
            </Button>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by name, email, ID, phone, department, transaction ID..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-9 pr-8 px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:ring-2 focus:ring-cyan-500 outline-none"
            />
            {search && (
              <button
                onClick={() => { setSearch(""); setPage(1); }}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 bg-white/5 border border-white/20 rounded-lg"
          >
            <option className="text-black" value="">
              All Status
            </option>
            <option className="text-black" value="pending">
              Pending
            </option>
            <option className="text-black" value="reviewed">
              Reviewed
            </option>
            <option className="text-black" value="approved">
              approved
            </option>
            <option className="text-black" value="rejected">
              Rejected
            </option>
          </select>

          <select
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setPage(1);
            }}
            className="px-4 py-2 bg-white/5 border border-white/20 rounded-lg"
          >
            <option className="text-black" value="10">
              Show 10
            </option>
            <option className="text-black" value="20">
              Show 20
            </option>
            <option className="text-black" value="50">
              Show 50
            </option>
            <option className="text-black" value="100">
              Show 100
            </option>
          </select>
        </div>
      </div>

      {/* MODAL */}
      {selectedRegistration && (
        <div 
          className={`fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-6 z-50 transition-opacity duration-200 ${
            isModalClosing ? "opacity-0" : "opacity-100"
          }`}
          onClick={(e) => {
            // Close modal when clicking backdrop
            if (e.target === e.currentTarget && !isUpdating) {
              closeModal();
            }
          }}
        >
          <div className={`bg-[#0f192d] border border-white/10 rounded-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto transition-transform duration-200 ${
            isModalClosing ? "scale-95 opacity-0" : "scale-100 opacity-100"
          }`}>
            {/* HEADER */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Application Details</h2>
              <button 
                onClick={closeModal}
                disabled={isUpdating}
                className="text-2xl hover:text-red-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                ×
              </button>
            </div>

            {/* MAIN INFO */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Detail label="Name" value={selectedRegistration.name} />
                <Detail
                  label="Student ID"
                  value={selectedRegistration.studentId}
                />
                <Detail label="Email" value={selectedRegistration.email} />
                <Detail label="Phone" value={selectedRegistration.phone} />
                <Detail
                  label="Department"
                  value={selectedRegistration.department}
                />
                <Detail label="Batch" value={selectedRegistration.batch} />
                <Detail
                  label="Current Year"
                  value={selectedRegistration.currentYear}
                />
                <Detail
                  label="CGPA"
                  value={selectedRegistration.cgpa || "N/A"}
                />
              </div>

              {/* Experience */}
              {selectedRegistration.previousExperience && (
                <Detail
                  label="Previous Experience"
                  value={selectedRegistration.previousExperience}
                />
              )}

              {/* Why Join */}
              <Detail label="Why Join?" value={selectedRegistration.whyJoin} />

              {/* Skills */}
              {selectedRegistration.skills?.length > 0 && (
                <div>
                  <p className="text-sm text-white/60 mb-1">Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedRegistration.skills.map((s: string) => (
                      <span
                        key={s}
                        className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-sm"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* PAYMENT SECTION */}
              <div className="mt-4 border-t border-white/10 pt-4">
                <h3 className="text-lg font-semibold mb-3">
                  Payment Information
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <Detail
                    label="Payment Method"
                    value={selectedRegistration.paymentMethod}
                  />
                  <Detail
                    label="Sender Number"
                    value={selectedRegistration.paymentNumber}
                  />
                  <Detail
                    label="Transaction ID"
                    value={selectedRegistration.transactionId}
                  />

                  <div>
                    <p className="text-sm text-white/60">Payment Status</p>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold border mt-1 inline-block
                        ${
                          selectedRegistration.paymentStatus === "approved"
                            ? "bg-green-500/20 text-green-300 border-green-400/30"
                            : selectedRegistration.paymentStatus === "rejected"
                            ? "bg-red-500/20 text-red-300 border-red-400/30"
                            : "bg-yellow-500/20 text-yellow-300 border-yellow-400/30"
                        }
                      `}
                    >
                      {selectedRegistration.paymentStatus}
                    </span>
                  </div>
                </div>

                {/* Payment Buttons */}
                {selectedRegistration.paymentStatus === "pending" && (
                  <div className="flex gap-3 mt-4">
                    <Button
                      onClick={() =>
                        handlePaymentStatus(
                          selectedRegistration._id,
                          "approved"
                        )
                      }
                      disabled={isUpdating}
                      className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isUpdating ? "Processing..." : "Approve Payment"}
                    </Button>

                    <Button
                      onClick={() =>
                        handlePaymentStatus(
                          selectedRegistration._id,
                          "rejected"
                        )
                      }
                      disabled={isUpdating}
                      className="flex-1 border-red-400 text-red-400 hover:bg-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                      variant="outline"
                    >
                      {isUpdating ? "Processing..." : "Reject Payment"}
                    </Button>
                  </div>
                )}
              </div>

              {/* Accept / Reject */}
              <div className="flex gap-3 mt-6 border-t border-white/10 pt-4">
                <Button
                  onClick={() =>
                    handleStatusUpdate(selectedRegistration._id, "approved")
                  }
                  disabled={isUpdating}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUpdating ? "Processing..." : "Accept"}
                </Button>

                <Button
                  onClick={() =>
                    handleStatusUpdate(selectedRegistration._id, "rejected")
                  }
                  disabled={isUpdating}
                  className="flex-1 border-red-400 text-red-400 hover:bg-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  variant="outline"
                >
                  {isUpdating ? "Processing..." : "Reject"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TABLE */}
      {loading && registrations.length === 0 ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
          <p className="text-white/60 mt-4">Loading registrations...</p>
        </div>
      ) : registrations.length === 0 ? (
        <div className="text-center py-12 text-white/60">
          <p>No registrations found</p>
        </div>
      ) : (
        <div className="relative">
          {loading && (
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-500"></div>
            </div>
          )}
          <DataTable columns={columns} data={registrations} />
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <div className="text-sm text-white/60">
          {totalRecords > 0 && (
            <>
              Showing {(page - 1) * limit + 1}-{Math.min(page * limit, totalRecords)} of{" "}
              {totalRecords} registration(s)
            </>
          )}
        </div>

        <div className="flex items-center space-x-3">
          <Button
            disabled={page === 1 || loading}
            onClick={() => setPage((p) => p - 1)}
            className="bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Prev
          </Button>

          <span className="flex items-center">
            Page {page} / {totalPages}
          </span>

          <Button
            disabled={page === totalPages || loading}
            onClick={() => setPage((p) => p + 1)}
            className="bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </Button>
        </div>
      </div>

      {/* Import/Export Modal */}
      {showImportExport && (
        <ImportExportModal
          onClose={() => setShowImportExport(false)}
          onImportComplete={() => {
            setShowImportExport(false);
            // Force refetch the data
            refetch();
          }}
          currentFilters={{ status: selectedStatus, search }}
        />
      )}

      {/* Add Registration Modal */}
      {showAddModal && (
        <AddRegistrationModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            // Trigger refetch
            setPage(page);
          }}
        />
      )}
    </div>
  );
}

/* =============================
   Reusable Detail Component
============================= */

function Detail({ label, value }: { label: string; value: any }) {
  return (
    <div>
      <p className="text-sm text-white/60">{label}</p>
      <p className="font-semibold">{String(value)}</p>
    </div>
  );
}
