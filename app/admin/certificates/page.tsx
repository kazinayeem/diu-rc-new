"use client";

import React, { useEffect, useRef, useState } from "react";
import jsPDF from "jspdf";
import DataTable from "@/components/admin/DataTable";
import { Button } from "@/components/ui/Button";
import {
  Plus,
  Copy,
  Check,
  Download,
  Upload,
  FileSpreadsheet,
  Files,
} from "lucide-react";
import CertificateForm from "@/components/admin/forms/CertificateForm";

type CertificateRow = {
  _id: string;
  certificateId?: string;
  recipientName?: string;
  recipientEmail?: string;
  event?: string;
  issueDate?: string;
  description?: string;
  eventType?: string;
  isActive?: boolean;
};

const CERT_WIDTH = 1123;
const CERT_HEIGHT = 794;

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<CertificateRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCertificate, setEditingCertificate] = useState<CertificateRow | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [eventType, setEventType] = useState("");

  const [importFile, setImportFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [importSummary, setImportSummary] = useState<{
    totalRowsDetected: number;
    imported: number;
    duplicates?: number;
    invalid?: number;
    errors?: number;
    emptyRowsIgnored?: number;
  } | null>(null);
  const [importMessage, setImportMessage] = useState("");
  const [importError, setImportError] = useState("");
  const [showImportGuide, setShowImportGuide] = useState(false);

  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [bulkDownloading, setBulkDownloading] = useState(false);
  const templateDataUrlRef = useRef<string | null>(null);

  useEffect(() => {
    const handler = (event: Event) => {
      const detail = (event as CustomEvent<string>).detail || "";
      setPage(1);
      setSearch(detail);
    };

    window.addEventListener("admin-search", handler as EventListener);
    return () => window.removeEventListener("admin-search", handler as EventListener);
  }, []);

  const fetchCertificates = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        ...(search ? { search } : {}),
        ...(eventType ? { eventType } : {}),
      });

      const res = await fetch(`/api/admin/certificates?${params}`);
      const data = await res.json();

      if (res.ok) {
        setCertificates(data.certificates || []);
        setTotal(data.total || 0);
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

  const handleDelete = async (row: CertificateRow) => {
    if (!row?._id) return;
    if (!confirm("Are you sure you want to delete this certificate?")) return;

    try {
      const res = await fetch(`/api/admin/certificates/${row._id}`, {
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

  const handleEdit = (certificate: CertificateRow) => {
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

  const toLongDate = (value?: string) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const certificateDescription = (cert: CertificateRow) => {
    // Just return a completing message without duplicating name
    return `for successfully completing ${cert.event || "the program"}`;
  };

  const readBlobAsDataUrl = (blob: Blob) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ""));
      reader.onerror = () => reject(new Error("Failed to read image"));
      reader.readAsDataURL(blob);
    });

  const getTemplateDataUrl = async () => {
    if (templateDataUrlRef.current) return templateDataUrlRef.current;

    const res = await fetch("/ce.png");
    if (!res.ok) {
      throw new Error("Failed to load certificate template image");
    }

    const blob = await res.blob();
    const dataUrl = await readBlobAsDataUrl(blob);
    templateDataUrlRef.current = dataUrl;
    return dataUrl;
  };

  const drawCertificatePage = (
    pdf: jsPDF,
    cert: CertificateRow,
    templateDataUrl: string,
    firstPage: boolean
  ) => {
    if (!firstPage) pdf.addPage([CERT_WIDTH, CERT_HEIGHT], "landscape");

    pdf.addImage(templateDataUrl, "PNG", 0, 0, CERT_WIDTH, CERT_HEIGHT);

    pdf.setTextColor(255, 255, 255);
    pdf.setFont("courier", "bold");
    pdf.setFontSize(12);
    pdf.text(`ID: ${cert.certificateId || ""}`, 42, 42);
    pdf.text(`DATE: ${toLongDate(cert.issueDate)}`, 42, 62);

    pdf.setTextColor(30, 58, 138);
    pdf.setFont("times", "italic");
    pdf.setFontSize(38);
    pdf.text("of appreciation", CERT_WIDTH / 2, 278, { align: "center" });

    pdf.setFont("times", "normal");
    pdf.setFontSize(26);
    pdf.text("This is to certify that", CERT_WIDTH / 2, 316, { align: "center" });

    const recipient = cert.recipientName || "";
    const recipientFontSize = recipient.length > 24 ? 52 : recipient.length > 18 ? 58 : 64;
    pdf.setFont("times", "bolditalic");
    pdf.setFontSize(recipientFontSize);
    pdf.text(recipient, CERT_WIDTH / 2, 386, { align: "center" });

    // Add event name below recipient name
    pdf.setFont("times", "normal");
    pdf.setFontSize(20);
    pdf.setTextColor(30, 58, 138);
    pdf.text(`${cert.event || ""}`, CERT_WIDTH / 2, 420, { align: "center" });

    pdf.setTextColor(30, 58, 138);
    const desc = certificateDescription(cert);
    const descFont = desc.length > 150 ? 14 : desc.length > 115 ? 16 : 18;
    pdf.setFont("times", "normal");
    pdf.setFontSize(descFont);
    const wrapped = pdf.splitTextToSize(desc, 840);
    pdf.text(wrapped, CERT_WIDTH / 2, 474, { align: "center" });

    // Add best wishes text at the bottom
    pdf.setFont("times", "italic");
    pdf.setFontSize(16);
    pdf.setTextColor(30, 58, 138);
    pdf.text("Best Wishes!", CERT_WIDTH / 2, 590, { align: "center" });
  };

  const downloadOneCertificate = async (cert: CertificateRow) => {
    if (!cert.certificateId) return;
    setDownloadingId(cert._id);

    try {
      const templateDataUrl = await getTemplateDataUrl();
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [CERT_WIDTH, CERT_HEIGHT],
      });

      drawCertificatePage(pdf, cert, templateDataUrl, true);
      pdf.save(`Certificate_${cert.certificateId}.pdf`);
    } catch (error) {
      console.error("Single certificate download error:", error);
      alert("Failed to download certificate PDF");
    } finally {
      setDownloadingId(null);
    }
  };

  const downloadBulkCertificates = async () => {
    setBulkDownloading(true);

    try {
      const params = new URLSearchParams({
        page: "1",
        limit: "10000",
        ...(search ? { search } : {}),
        ...(eventType ? { eventType } : {}),
      });

      const listRes = await fetch(`/api/admin/certificates?${params}`);
      const listData = await listRes.json();

      const items: CertificateRow[] = listData.certificates || [];
      if (items.length === 0) {
        alert("No certificates found for bulk download");
        return;
      }

      const templateDataUrl = await getTemplateDataUrl();
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [CERT_WIDTH, CERT_HEIGHT],
      });

      items.forEach((cert, index) => {
        drawCertificatePage(pdf, cert, templateDataUrl, index === 0);
      });

      pdf.save(`Certificates_Bulk_${items.length}.pdf`);
    } catch (error) {
      console.error("Bulk certificate download error:", error);
      alert("Failed to bulk download certificates");
    } finally {
      setBulkDownloading(false);
    }
  };

  const handleImportData = async () => {
    if (!importFile || importing) return;

    setImporting(true);
    setImportMessage("");
    setImportError("");
    setImportSummary(null);

    try {
      const body = new FormData();
      body.append("file", importFile);

      const res = await fetch("/api/admin/certificates/import", {
        method: "POST",
        body,
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Import failed");
      }

      setImportMessage(data.message || "File uploaded successfully");
      setImportSummary({
        totalRowsDetected: data.totalRowsDetected || 0,
        imported: data.imported || 0,
        duplicates: data.duplicates || 0,
        invalid: data.invalid || 0,
        errors: data.errors || 0,
      });
      setImportFile(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Import failed";
      setImportError(message);
    } finally {
      setImporting(false);
    }
  };

  const columns = [
    {
      key: "certificateId",
      label: "Certificate ID",
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
            {copiedId === val ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
          </button>
        </div>
      ),
    },
    { key: "recipientName", label: "Recipient" },
    { key: "event", label: "Event" },
    {
      key: "eventType",
      label: "Type",
      render: (val: string) => (
        <span className="capitalize px-2 py-1 rounded-full text-xs bg-blue-500/20 text-blue-300">
          {val}
        </span>
      ),
    },
    {
      key: "issueDate",
      label: "Issue Date",
      render: (val: string) => toLongDate(val),
    },
    {
      key: "download",
      label: "Download",
      render: (_: unknown, row: CertificateRow) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            downloadOneCertificate(row);
          }}
          disabled={downloadingId === row._id}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#3DB5D8]/20 text-[#9de6f8] hover:bg-[#3DB5D8]/30 disabled:opacity-50"
        >
          <Download size={14} />
          {downloadingId === row._id ? "Downloading..." : "PDF"}
        </button>
      ),
    },
    {
      key: "isActive",
      label: "Status",
      render: (val: boolean) => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            val ? "bg-green-500/20 text-green-300" : "bg-red-500/20 text-red-300"
          }`}
        >
          {val ? "Active" : "Inactive"}
        </span>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Certificates</h1>
          <p className="text-white/60">Manage certificates, import Excel, and download PDFs</p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={downloadBulkCertificates}
            disabled={bulkDownloading || loading}
            className="flex items-center gap-2 bg-indigo-500/80 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg"
          >
            <Files size={18} />
            {bulkDownloading ? "Bulk Downloading..." : "Bulk Download All"}
          </Button>

          <Button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-[#3DB5D8] hover:bg-[#3DB5D8]/90 text-white px-4 py-2 rounded-lg"
          >
            <Plus size={20} />
            Add Certificate
          </Button>
        </div>
      </div>

      <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <div className="text-blue-400 text-xl">ℹ️</div>
          <div className="flex-1">
            <h3 className="text-blue-300 font-semibold text-sm mb-1">Certificate Template</h3>
            <p className="text-blue-100/70 text-xs leading-relaxed">
              All certificates use the default template (/ce.png). Download a single certificate with the PDF button, or use Bulk Download All for one multi-page PDF.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <FileSpreadsheet size={18} className="text-[#3DB5D8]" />
            Import Certificate Excel
          </h2>
          <button
            onClick={() => setShowImportGuide(!showImportGuide)}
            className="text-sm text-[#3DB5D8] hover:text-[#5cc8e6] underline"
          >
            {showImportGuide ? "Hide" : "Show"} Format Guide
          </button>
        </div>

        {showImportGuide && (
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 space-y-3 text-sm">
            <div>
              <h3 className="font-semibold text-blue-200 mb-2">✓ Required Columns:</h3>
              <p className="text-white/70">Your Excel file must include columns for:</p>
              <ul className="list-disc list-inside text-white/60 mt-1 space-y-1">
                <li><span className="font-mono text-blue-300">Certificate ID</span> (or: ID, Cert ID, Certificate No)</li>
                <li><span className="font-mono text-blue-300">Name</span> (or: Recipient Name, Full Name, Student Name)</li>
                <li><span className="font-mono text-blue-300">Email</span> (or: Email Address, Recipient Email)</li>
                <li><span className="font-mono text-blue-300">Workshop/Event</span> (or: Event, Event Name, Course, Program)</li>
                <li><span className="font-mono text-blue-300">Issue Date</span> (or: Date, Issued Date, Completion Date)</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-blue-200 mb-2">ℹ️ Optional Columns:</h3>
              <p className="text-white/70">Name Filled Up - for display variant of recipient name</p>
            </div>
            <div>
              <h3 className="font-semibold text-blue-200 mb-2">📝 Example Format:</h3>
              <div className="bg-black/20 rounded p-2 font-mono text-xs text-white/50 overflow-x-auto">
                <div>Certificate ID | Name | Email | Event | Date Issued</div>
                <div>CERT-001 | John Doe | john@email.com | Workshop | 2026-04-05</div>
              </div>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-[1fr_auto_auto] gap-3">
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={(e) => {
              setImportFile(e.target.files?.[0] || null);
              setImportError("");
              setImportMessage("");
            }}
            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:bg-[#3DB5D8]/20 file:text-[#9de6f8]"
          />
          <Button
            onClick={() => {
              const link = document.createElement('a');
              link.href = '/templates/certificate-import-template.xlsx';
              link.download = 'certificate-import-template.xlsx';
              link.click();
            }}
            className="flex items-center gap-2 bg-blue-500/80 hover:bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            <Download size={16} />
            Download Template
          </Button>
          <Button
            onClick={handleImportData}
            disabled={!importFile || importing}
            className="flex items-center gap-2 bg-emerald-500/80 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg disabled:opacity-50"
          >
            <Upload size={16} />
            {importing ? "Importing..." : "Import Data"}
          </Button>
        </div>

        {importError && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-sm text-red-300 space-y-2">
            <p className="font-semibold">❌ Import Failed:</p>
            <p>{importError}</p>
          </div>
        )}

        {(importMessage || importSummary) && (
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 text-sm text-green-300 space-y-2">
            {importMessage && <p className="font-semibold">✓ {importMessage}</p>}
            {importSummary && (
              <div className="space-y-1 text-xs">
                <p>📊 Total data rows: <span className="font-semibold">{importSummary.totalRowsDetected}</span></p>
                <p>✅ Successfully imported: <span className="font-semibold text-green-400">{importSummary.imported}</span></p>
                {importSummary.emptyRowsIgnored ? <p>⏭️ Empty rows ignored: <span className="font-semibold text-gray-400">{importSummary.emptyRowsIgnored}</span></p> : null}
                {importSummary.duplicates ? <p>⚠️ Duplicates skipped: <span className="font-semibold text-yellow-400">{importSummary.duplicates}</span></p> : null}
                {importSummary.invalid ? <p>❌ Invalid/incomplete rows: <span className="font-semibold text-red-400">{importSummary.invalid}</span></p> : null}
                {importSummary.errors ? <p>❌ Errors during import: <span className="font-semibold text-red-400">{importSummary.errors}</span></p> : null}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-white/60 mb-2">Search</label>
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
            <label className="block text-sm font-medium text-white/60 mb-2">Event Type</label>
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

      <DataTable
        columns={columns}
        data={certificates}
        onEdit={handleEdit}
        onDelete={handleDelete}
        pagination={{
          page,
          limit,
          total,
          pages: totalPages,
          onPageChange: setPage,
        }}
      />

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
