"use client";

import React, { useState, useEffect } from "react";
import DataTable from "@/components/admin/DataTable";
import { Button } from "@/components/ui/Button";
import { CheckCircle, XCircle, Eye, Trash2 } from "lucide-react";

export default function MemberRegistrationsPage() {
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;
  const [totalPages, setTotalPages] = useState(1);

  const [selectedRegistration, setSelectedRegistration] = useState<any>(null);

  useEffect(() => {
    fetchRegistrations();
  }, [selectedStatus, search, page]);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);

      const query = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        ...(selectedStatus ? { status: selectedStatus } : {}),
        ...(search ? { search } : {}),
      }).toString();

      const res = await fetch(`/api/member-registrations?${query}`);
      const data = await res.json();

      if (data.success) {
        setRegistrations(data.data);
        setTotalPages(data.pagination.pages);
      }
    } catch (error) {
      console.error("Error fetching registrations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/member-registrations/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();
      if (data.success) {
        fetchRegistrations();
        setSelectedRegistration(null);
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handlePaymentStatus = async (id: string, paymentStatus: string) => {
    try {
      const res = await fetch(`/api/member-registrations/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentStatus }),
      });

      const data = await res.json();
      if (data.success) {
        fetchRegistrations();
        setSelectedRegistration(null);
      }
    } catch (err) {
      console.error("Payment update error:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this registration?")) return;

    try {
      const res = await fetch(`/api/member-registrations/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (data.success) fetchRegistrations();
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  // TABLE COLUMNS ======================
  const columns = [
    { key: "name", label: "Name" },
    { key: "studentId", label: "Student ID" },
    { key: "email", label: "Email" },
    { key: "department", label: "Department" },
    { key: "batch", label: "Batch" },

    {
      key: "paymentStatus",
      label: "Payment",
      render: (v: string) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold capitalize border 
            ${
              v === "verified"
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
              value === "accepted"
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
            className="text-blue-400 hover:text-blue-300"
          >
            <Eye size={18} />
          </button>

          <button
            onClick={() => handleDelete(row._id)}
            className="text-red-400 hover:text-red-300"
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
          <h1 className="text-3xl font-bold mb-1">Member Registrations</h1>
          <p className="text-white/60">
            Review and manage membership applications
          </p>
        </div>

        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 bg-white/5 border border-white/20 rounded-lg"
          />

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
            <option className="text-black" value="accepted">
              Accepted
            </option>
            <option className="text-black" value="rejected">
              Rejected
            </option>
          </select>
        </div>
      </div>

      {/* MODAL */}
      {selectedRegistration && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-6 z-50">
          <div className="bg-[#0f192d] border border-white/10 rounded-xl max-w-2xl w-full p-6">
            {/* HEADER */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Application Details</h2>
              <button onClick={() => setSelectedRegistration(null)}>×</button>
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
                          selectedRegistration.paymentStatus === "verified"
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
                          "verified"
                        )
                      }
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      Approve Payment
                    </Button>

                    <Button
                      onClick={() =>
                        handlePaymentStatus(
                          selectedRegistration._id,
                          "rejected"
                        )
                      }
                      className="flex-1 border-red-400 text-red-400 hover:bg-red-500/20"
                      variant="outline"
                    >
                      Reject Payment
                    </Button>
                  </div>
                )}
              </div>

              {/* Accept / Reject */}
              <div className="flex gap-3 mt-6 border-t border-white/10 pt-4">
                <Button
                  onClick={() =>
                    handleStatusUpdate(selectedRegistration._id, "accepted")
                  }
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  Accept
                </Button>

                <Button
                  onClick={() =>
                    handleStatusUpdate(selectedRegistration._id, "rejected")
                  }
                  className="flex-1 border-red-400 text-red-400 hover:bg-red-500/20"
                  variant="outline"
                >
                  Reject
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TABLE */}
      {loading ? (
        <div className="text-center py-12 text-white/60">Loading...</div>
      ) : (
        <DataTable columns={columns} data={registrations} />
      )}

      {/* Pagination */}
      <div className="flex justify-center mt-6 space-x-3">
        <Button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="bg-white/10"
        >
          Prev
        </Button>

        <span>
          Page {page} / {totalPages}
        </span>

        <Button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="bg-white/10"
        >
          Next
        </Button>
      </div>
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
