"use client";

import React, { useState, useEffect, useMemo } from "react";
import DataTable from "@/components/admin/DataTable";
import { Button } from "@/components/ui/Button";
import { Eye, Trash2, Upload, Download, Plus, Loader2, Search, X, Pencil, Save, Mail } from "lucide-react";
import Link from "next/link";
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
  const [editingRegistration, setEditingRegistration] = useState<any>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  // Math verification for delete all
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
  const [mathProblem, setMathProblem] = useState<any>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [deleteAllData, setDeleteAllData] = useState<any>(null);
  const [verificationError, setVerificationError] = useState("");

  // Generate random math problem for Delete All safety
  const generateMathProblem = () => {
    const factorial = (n: number): number => {
      let result = 1;
      for (let i = 2; i <= n; i++) result *= i;
      return result;
    };

    const fibonacci = (n: number): number => {
      if (n <= 1) return n;
      let a = 0;
      let b = 1;
      for (let i = 2; i <= n; i++) {
        const next = a + b;
        a = b;
        b = next;
      }
      return b;
    };

    const permutation = (n: number, r: number): number => {
      let result = 1;
      for (let i = 0; i < r; i++) result *= n - i;
      return result;
    };

    const combination = (n: number, r: number): number => {
      const rr = Math.min(r, n - r);
      let numerator = 1;
      let denominator = 1;
      for (let i = 1; i <= rr; i++) {
        numerator *= n - rr + i;
        denominator *= i;
      }
      return Math.round(numerator / denominator);
    };

    const operations = [
      // Basic arithmetic: x + y
      () => {
        const x = Math.floor(Math.random() * 50) + 10;
        const y = Math.floor(Math.random() * 50) + 10;
        return { problem: `${x} + ${y}`, answer: x + y };
      },

      // Basic arithmetic: x - y
      () => {
        const x = Math.floor(Math.random() * 80) + 20;
        const y = Math.floor(Math.random() * 40) + 5;
        return { problem: `${x} - ${y}`, answer: x - y };
      },

      // Basic algebra: solve x in x + a = b
      () => {
        const x = Math.floor(Math.random() * 30) + 5;
        const a = Math.floor(Math.random() * 25) + 5;
        const b = x + a;
        return { problem: `Solve x: x + ${a} = ${b}`, answer: x };
      },

      // Basic algebra: solve x in ax + b = c
      () => {
        const a = Math.floor(Math.random() * 5) + 2;
        const x = Math.floor(Math.random() * 12) + 2;
        const b = Math.floor(Math.random() * 20) + 1;
        const c = a * x + b;
        return { problem: `Solve x: ${a}x + ${b} = ${c}`, answer: x };
      },

      // Basic calculus: derivative value at a point (requested format)
      () => {
        const a = Math.floor(Math.random() * 6) + 2;
        const b = Math.floor(Math.random() * 10) + 1;
        const n = Math.floor(Math.random() * 6) + 1;
        // f(x) = ax^2 + bx => f'(n) = 2an + b
        return { problem: `If f(x)=${a}x^2+${b}x, find f'(${n})`, answer: 2 * a * n + b };
      },

      // Basic calculus: definite integral with integer result (requested format)
      () => {
        const kOptions = [2, 4, 6, 8];
        const k = kOptions[Math.floor(Math.random() * kOptions.length)];
        const nOptions = [2, 3, 4, 5, 6];
        const n = nOptions[Math.floor(Math.random() * nOptions.length)];
        // integral_0^n (k*x) dx = k*n^2/2
        return { problem: `Integral 0..${n} of ${k}x dx`, answer: (k * n * n) / 2 };
      },

      // Extra calculus variant to increase appearance frequency
      () => {
        const a = Math.floor(Math.random() * 5) + 3;
        const b = Math.floor(Math.random() * 10) + 2;
        const n = Math.floor(Math.random() * 5) + 2;
        return { problem: `If f(x)=${a}x^2+${b}x, find f'(${n})`, answer: 2 * a * n + b };
      },

      // Extra integral variant to increase appearance frequency
      () => {
        const kOptions = [2, 4, 6, 10];
        const k = kOptions[Math.floor(Math.random() * kOptions.length)];
        const nOptions = [2, 3, 4, 5, 6];
        const n = nOptions[Math.floor(Math.random() * nOptions.length)];
        return { problem: `Integral 0..${n} of ${k}x dx`, answer: (k * n * n) / 2 };
      },

      // Factorials: 3!, 4!, 5! (+ a bit harder variants)
      () => {
        const options = [3, 4, 5, 6, 7];
        const n = options[Math.floor(Math.random() * options.length)];
        return { problem: `${n}!`, answer: factorial(n) };
      },

      // Factorial division: like 7! / 4!
      () => {
        const n = Math.floor(Math.random() * 3) + 7; // 7..9
        const r = Math.floor(Math.random() * 3) + 3; // 3..5
        return { problem: `${n}! / ${r}!`, answer: Math.round(factorial(n) / factorial(r)) };
      },

      // Fibonacci sequences: Fib(8) .. Fib(12)
      () => {
        const n = Math.floor(Math.random() * 5) + 8;
        return { problem: `Fib(${n})`, answer: fibonacci(n) };
      },

      // Power operations: 2^5, 3^6, etc.
      () => {
        const base = Math.floor(Math.random() * 4) + 2; // 2..5
        const exp = Math.floor(Math.random() * 3) + 5; // 5..7
        return { problem: `${base}^${exp}`, answer: Math.pow(base, exp) };
      },

      // Exponential division: a^m / a^n
      () => {
        const base = Math.floor(Math.random() * 4) + 2; // 2..5
        const high = Math.floor(Math.random() * 3) + 6; // 6..8
        const low = Math.floor(Math.random() * 3) + 2; // 2..4
        return { problem: `${base}^${high} / ${base}^${low}`, answer: Math.pow(base, high - low) };
      },

      // Algebraic expressions: ax + b where x substituted
      () => {
        const a = Math.floor(Math.random() * 15) + 6;
        const b = Math.floor(Math.random() * 30) + 5;
        const x = Math.floor(Math.random() * 9) + 2;
        return { problem: `${a}x + ${b} (x=${x})`, answer: a * x + b };
      },

      // Quadratic: ax^2 - bx with x substituted
      () => {
        const a = Math.floor(Math.random() * 8) + 3;
        const b = Math.floor(Math.random() * 12) + 4;
        const x = Math.floor(Math.random() * 7) + 3;
        return { problem: `${a}x^2 - ${b}x (x=${x})`, answer: a * x * x - b * x };
      },

      // Cubic polynomials: ax^3 + bx - c
      () => {
        const a = Math.floor(Math.random() * 5) + 2;
        const b = Math.floor(Math.random() * 14) + 5;
        const c = Math.floor(Math.random() * 30) + 6;
        const x = Math.floor(Math.random() * 6) + 2;
        return {
          problem: `${a}x^3 + ${b}x - ${c} (x=${x})`,
          answer: a * x * x * x + b * x - c,
        };
      },

      // Sum formula: Sum(1..n)
      () => {
        const n = Math.floor(Math.random() * 21) + 10; // 10..30
        const sum = (n * (n + 1)) / 2;
        return { problem: `Sum(1..${n})`, answer: sum };
      },

      // Sum of squares
      () => {
        const n = Math.floor(Math.random() * 10) + 8; // 8..17
        const sumSquares = (n * (n + 1) * (2 * n + 1)) / 6;
        return { problem: `1^2 + 2^2 + ... + ${n}^2`, answer: sumSquares };
      },

      // Permutations: P(n,r)
      () => {
        const n = Math.floor(Math.random() * 5) + 8; // 8..12
        const r = Math.floor(Math.random() * 3) + 3; // 3..5
        return { problem: `P(${n},${r})`, answer: permutation(n, r) };
      },

      // Combinations: C(n,r)
      () => {
        const n = Math.floor(Math.random() * 8) + 10; // 10..17
        const r = Math.floor(Math.random() * 4) + 3; // 3..6
        return { problem: `C(${n},${r})`, answer: combination(n, r) };
      },
    ];

    const randomOp = operations[Math.floor(Math.random() * operations.length)];
    return randomOp();
  };

  const openEdit = (row: any) => {
    setEditingRegistration(row);
    setEditForm({
      name: row.name || "",
      studentId: row.studentId || "",
      email: row.email || "",
      phone: row.phone || "",
      department: row.department || "",
      batch: row.batch || "",
      currentYear: row.currentYear || "",
      cgpa: row.cgpa || "",
      previousExperience: row.previousExperience || "",
      whyJoin: row.whyJoin || "",
      skills: (row.skills || []).join(", "),
      paymentMethod: row.paymentMethod || "",
      paymentNumber: row.paymentNumber || "",
      transactionId: row.transactionId || "",
      paymentStatus: row.paymentStatus || "pending",
      status: row.status || "pending",
    });
  };

  const handleEditSave = async () => {
    if (!editingRegistration) return;
    setIsSavingEdit(true);
    try {
      const body = {
        ...editForm,
        skills: editForm.skills
          ? editForm.skills.split(",").map((s: string) => s.trim()).filter(Boolean)
          : [],
      };
      await updateMemberRegistration({ id: editingRegistration._id, body }).unwrap();
      setEditingRegistration(null);
    } catch (err) {
      console.error("Edit save error:", err);
      alert("Failed to save changes");
    } finally {
      setIsSavingEdit(false);
    }
  };

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
    if (totalRecords === 0) {
      alert("No registrations to delete");
      return;
    }

    // Generate math problem and show modal instead of confirm dialog
    const problem = generateMathProblem();
    setMathProblem(problem);
    setUserAnswer("");
    setVerificationError("");
    setDeleteAllData({
      filters: {
        ...(selectedStatus ? { status: selectedStatus } : {}),
        ...(search ? { search } : {}),
      },
      isFiltered: selectedStatus || search,
    });
    setShowDeleteAllModal(true);
  };

  const verifyAndDelete = async () => {
    if (!mathProblem || !deleteAllData) return;

    const userValue = parseInt(userAnswer.trim());
    if (isNaN(userValue) || userValue !== mathProblem.answer) {
      setVerificationError("❌ Incorrect answer. Please try again.");
      setUserAnswer("");
      return;
    }

    // Correct answer - proceed with deletion
    setVerificationError("");
    setShowDeleteAllModal(false);
    setDeletingBulk(true);

    try {
      const deleteResponse = await fetch("/api/admin/member-registrations/delete-all", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(deleteAllData.filters),
      });

      const deleteResult = await deleteResponse.json();

      if (deleteResult.success) {
        setSelectedIds([]);
        alert(deleteResult.message);
        if (page !== 1) {
          setPage(1);
        } else {
          refetch();
        }
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
    {
      key: "name",
      label: "Name",
      render: (value: string, row: any) => (
        <span
          onDoubleClick={() => openEdit(row)}
          className="cursor-pointer group inline-flex items-center gap-1 hover:text-cyan-300 transition-colors"
          title="Double-click to edit"
        >
          {value}
          <Pencil size={11} className="opacity-0 group-hover:opacity-50 transition-opacity flex-shrink-0" />
        </span>
      ),
    },
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
            <Link href="/admin/member-registrations/create-mail">
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Mail size={18} className="mr-2" />
                Send Mail
              </Button>
            </Link>

            {selectedIds.length > 0 && (              <Button
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

      {/* EDIT MODAL */}
      {editingRegistration && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-6 z-50"
          onClick={(e) => { if (e.target === e.currentTarget && !isSavingEdit) setEditingRegistration(null); }}
        >
          <div className="bg-[#0f192d] border border-white/10 rounded-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Pencil size={18} className="text-cyan-400" />
                Edit Registration
              </h2>
              <button
                onClick={() => setEditingRegistration(null)}
                disabled={isSavingEdit}
                className="text-2xl hover:text-red-400 disabled:opacity-50 transition-colors"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {([
                ["name", "Name"],
                ["studentId", "Student ID"],
                ["email", "Email"],
                ["phone", "Phone"],
                ["department", "Department"],
                ["batch", "Batch"],
                ["currentYear", "Current Year"],
                ["cgpa", "CGPA"],
                ["paymentMethod", "Payment Method"],
                ["paymentNumber", "Sender Number"],
                ["transactionId", "Transaction ID"],
              ] as [string, string][]).map(([field, label]) => (
                <div key={field} className={field === "email" ? "col-span-2" : ""}>
                  <label className="block text-xs text-white/50 mb-1">{label}</label>
                  <input
                    value={editForm[field]}
                    onChange={(e) => setEditForm((prev: any) => ({ ...prev, [field]: e.target.value }))}
                    className="w-full px-3 py-2 bg-white/5 border border-white/15 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              ))}

              <div>
                <label className="block text-xs text-white/50 mb-1">Status</label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm((prev: any) => ({ ...prev, status: e.target.value }))}
                  className="w-full px-3 py-2 bg-[#0f192d] border border-white/15 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  {["pending","reviewed","approved","rejected"].map(s => (
                    <option key={s} value={s} className="text-black bg-white">{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-white/50 mb-1">Payment Status</label>
                <select
                  value={editForm.paymentStatus}
                  onChange={(e) => setEditForm((prev: any) => ({ ...prev, paymentStatus: e.target.value }))}
                  className="w-full px-3 py-2 bg-[#0f192d] border border-white/15 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  {["pending","approved","rejected"].map(s => (
                    <option key={s} value={s} className="text-black bg-white">{s}</option>
                  ))}
                </select>
              </div>

              <div className="col-span-2">
                <label className="block text-xs text-white/50 mb-1">Previous Experience</label>
                <textarea
                  rows={2}
                  value={editForm.previousExperience}
                  onChange={(e) => setEditForm((prev: any) => ({ ...prev, previousExperience: e.target.value }))}
                  className="w-full px-3 py-2 bg-white/5 border border-white/15 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-xs text-white/50 mb-1">Why Join?</label>
                <textarea
                  rows={3}
                  value={editForm.whyJoin}
                  onChange={(e) => setEditForm((prev: any) => ({ ...prev, whyJoin: e.target.value }))}
                  className="w-full px-3 py-2 bg-white/5 border border-white/15 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-xs text-white/50 mb-1">Skills (comma-separated)</label>
                <input
                  value={editForm.skills}
                  onChange={(e) => setEditForm((prev: any) => ({ ...prev, skills: e.target.value }))}
                  placeholder="e.g. Python, Arduino, CAD"
                  className="w-full px-3 py-2 bg-white/5 border border-white/15 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6 pt-4 border-t border-white/10">
              <Button
                onClick={handleEditSave}
                disabled={isSavingEdit}
                className="flex-1 bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSavingEdit ? (
                  <><Loader2 size={16} className="mr-2 animate-spin" />Saving...</>
                ) : (
                  <><Save size={16} className="mr-2" />Save Changes</>
                )}
              </Button>
              <Button
                onClick={() => setEditingRegistration(null)}
                disabled={isSavingEdit}
                variant="outline"
                className="flex-1 border-white/20 text-white/70 hover:bg-white/5 disabled:opacity-50"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODAL */}
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
                {/* Accept button — hidden when already approved */}
                {selectedRegistration.status !== "approved" && (
                  <Button
                    onClick={() =>
                      handleStatusUpdate(selectedRegistration._id, "approved")
                    }
                    disabled={isUpdating}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUpdating ? "Processing..." : "Accept"}
                  </Button>
                )}

                {/* Approved badge — shown instead of Accept when already approved */}
                {selectedRegistration.status === "approved" && (
                  <div className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-green-500/15 border border-green-500/30 text-green-400 font-medium text-sm">
                    ✅ Approved
                  </div>
                )}

                {/* Reject button — hidden when already rejected */}
                {selectedRegistration.status !== "rejected" && (
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
                )}

                {/* Rejected badge — shown instead of Reject when already rejected */}
                {selectedRegistration.status === "rejected" && (
                  <div className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-500/15 border border-red-500/30 text-red-400 font-medium text-sm">
                    ❌ Rejected
                  </div>
                )}
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

      {/* Math Verification Modal for Delete All */}
      {showDeleteAllModal && mathProblem && deleteAllData && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget && !deletingBulk) {
              setShowDeleteAllModal(false);
              setVerificationError("");
              setUserAnswer("");
            }
          }}
        >
          <div className="bg-[#0f192d] border border-white/10 rounded-xl max-w-md w-full p-4 sm:p-6 space-y-4 sm:space-y-5 relative max-h-[92vh] overflow-y-auto">
            {/* Close button */}
            <button
              onClick={() => {
                if (!deletingBulk) {
                  setShowDeleteAllModal(false);
                  setVerificationError("");
                  setUserAnswer("");
                }
              }}
              disabled={deletingBulk}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 text-white/50 hover:text-white disabled:opacity-50 transition-colors"
            >
              <X size={20} />
            </button>

            {/* Header */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-red-500/20 border border-red-500/30 rounded-full mb-3">
                <Trash2 size={22} className="text-red-400" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white mb-1.5">Security Verification</h2>
              <p className="text-white/60 text-xs sm:text-sm leading-relaxed">
                {deleteAllData.isFiltered 
                  ? "Solve this math problem to confirm filtered deletion"
                  : "This will delete ALL records. Solve this problem to confirm"}
              </p>
            </div>

            {/* Warning Banner */}
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 sm:p-4">
              <p className="text-xs sm:text-sm text-red-300 leading-relaxed">
                <strong>⚠️ Warning:</strong> This action {deleteAllData.isFiltered ? "deletes filtered registrations" : "cannot be undone!"} and is permanent.
              </p>
            </div>

            {/* Math Problem */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-3 sm:p-4 text-center space-y-2 sm:space-y-3">
              <p className="text-white/60 text-xs sm:text-sm font-medium">Solve this problem:</p>
              <div className="text-lg sm:text-2xl md:text-3xl font-bold text-cyan-300 font-mono break-words leading-snug">
                {mathProblem.problem} = ?
              </div>
            </div>

            {/* Input and Error */}
            <div className="space-y-1.5 sm:space-y-2">
              <input
                type="number"
                value={userAnswer}
                onChange={(e) => {
                  setUserAnswer(e.target.value);
                  setVerificationError("");
                }}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !deletingBulk) {
                    verifyAndDelete();
                  }
                }}
                placeholder="Enter your answer..."
                disabled={deletingBulk}
                className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-white/5 border border-white/15 rounded-lg text-white placeholder-white/30 text-center text-base sm:text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50"
                autoFocus
              />
              {verificationError && (
                <p className="text-red-400 text-xs sm:text-sm font-medium">{verificationError}</p>
              )}
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3">
              <Button
                onClick={() => {
                  setShowDeleteAllModal(false);
                  setVerificationError("");
                  setUserAnswer("");
                }}
                variant="outline"
                disabled={deletingBulk}
                className="flex-1 border-white/20 text-white/70 hover:bg-white/5 disabled:opacity-50 text-sm"
              >
                Cancel
              </Button>
              <Button
                onClick={verifyAndDelete}
                disabled={deletingBulk || !userAnswer.trim()}
                className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {deletingBulk ? (
                  <>
                    <Loader2 size={16} className="mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={16} className="mr-2" />
                    Verify & Delete
                  </>
                )}
              </Button>
            </div>

            {/* Info */}
            <p className="text-[11px] sm:text-xs text-white/40 text-center">
              This verification is required for data security
            </p>
          </div>
        </div>
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
