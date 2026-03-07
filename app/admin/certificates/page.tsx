"use client";

import React, { useState, useEffect } from "react";
import DataTable from "@/components/admin/DataTable";
import { Button } from "@/components/ui/Button";
import { Plus, Copy, Check } from "lucide-react";
import CertificateForm from "@/components/admin/forms/CertificateForm";

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCertificate, setEditingCertificate] = useState<any>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [eventType, setEventType] = useState("");

  // Listen to admin search
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

  const fetchCertificates = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        ...(search && { search }),
        ...(eventType && { eventType }),
      });

      const res = await fetch(`/api/admin/certificates?${params}`);
      const data = await res.json();

      if (res.ok) {
        setCertificates(data.certificates || []);
        setTotalPages(data.totalPages || 1);
      }
    } catch (error) {
      console.error("Error fetching certificates:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCertificates();
  }, [page, search, eventType]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this certificate?")) return;

    try {
      const res = await fetch(`/api/admin/certificates/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchCertificates();
      } else {
        alert("Failed to delete certificate");
      }
    } catch (error) {
      console.error("Error deleting certificate:", error);
      alert("An error occurred");
    }
  };

  const handleEdit = (certificate: any) => {
    setEditingCertificate(certificate);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingCertificate(null);
  };

  const handleFormSuccess = () => {
    fetchCertificates();
    handleCloseForm();
  };

  const handleCopyId = (certId: string) => {
    navigator.clipboard.writeText(certId);
    setCopiedId(certId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const columns = [
    { 
      key: "certificateId", 
      label: "Certificate ID", 
      sortable: true,
      render: (val: string) => (
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs">{val}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCopyId(val);
            }}
            className="text-white/40 hover:text-white transition-colors"
            title="Copy Certificate ID"
          >
            {copiedId === val ? (
              <Check size={14} className="text-green-400" />
            ) : (
              <Copy size={14} />
            )}
          </button>
        </div>
      ),
    },
    { key: "recipientName", label: "Recipient", sortable: true },
    { key: "event", label: "Event", sortable: true },
    {
      key: "eventType",
      label: "Type",
      sortable: true,
      render: (val: string) => (
        <span className="capitalize px-2 py-1 rounded-full text-xs bg-blue-500/20 text-blue-300">
          {val}
        </span>
      ),
    },
    {
      key: "issueDate",
      label: "Issue Date",
      sortable: true,
      render: (val: string) => new Date(val).toLocaleDateString(),
    },
    {
      key: "isActive",
      label: "Status",
      render: (val: boolean) => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            val
              ? "bg-green-500/20 text-green-300"
              : "bg-red-500/20 text-red-300"
          }`}
        >
          {val ? "Active" : "Inactive"}
        </span>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Certificates</h1>
          <p className="text-white/60">Manage certificates and verifications</p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-[#3DB5D8] hover:bg-[#3DB5D8]/90 text-white px-4 py-2 rounded-lg"
        >
          <Plus size={20} />
          Add Certificate
        </Button>
      </div>

      {/* Important Notice */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <div className="text-blue-400 text-xl">ℹ️</div>
          <div className="flex-1">
            <h3 className="text-blue-300 font-semibold text-sm mb-1">
              Certificate Template
            </h3>
            <p className="text-blue-100/70 text-xs leading-relaxed">
              All certificates use the default template (/ce.png). Recipient data is displayed dynamically on the verification page.
              Click the copy icon next to any Certificate ID to quickly copy it for verification.
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-white/60 mb-2">
              Search
            </label>
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search certificates..."
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#3DB5D8]/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/60 mb-2">
              Event Type
            </label>
            <select
              value={eventType}
              onChange={(e) => {
                setEventType(e.target.value);
                setPage(1);
              }}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#3DB5D8]/50"
            >
              <option value="">All Types</option>
              <option value="workshop">Workshop</option>
              <option value="seminar">Seminar</option>
              <option value="bootcamp">Bootcamp</option>
              <option value="competition">Competition</option>
              <option value="training">Training</option>
              <option value="course">Course</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={certificates}
        onEdit={handleEdit}
        onDelete={handleDelete}
        pagination={{
          page,
          limit,
          total: certificates.length * totalPages,
          pages: totalPages,
          onPageChange: setPage,
        }}
      />

      {/* Form Modal */}
      {showForm && (
        <CertificateForm
          certificate={editingCertificate}
          onClose={handleCloseForm}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
}
