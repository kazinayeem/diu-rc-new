"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import {
  Eye,
  EyeOff,
  Check,
  X,
  Download,
  Loader,
  AlertCircle,
  DollarSign,
  RefreshCw,
} from "lucide-react";
import { motion } from "framer-motion";

interface Registration {
  _id: string;
  name: string;
  email: string;
  phone: string;
  studentId?: string;
  department?: string;
  batch?: string;
  status: "pending" | "confirmed" | "rejected";
  isPaid?: boolean;
  paymentStatus?: "paid" | "pending" | "rejected";
  paymentMethod?: string;
  paymentNumber?: string;
  transactionId?: string;
  amount?: number;
  createdAt: string;
  notes?: string;
  message?: string;
}

interface RegistrationManagementProps {
  eventId: string;
}

export default function RegistrationManagement({
  eventId,
}: RegistrationManagementProps) {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "confirmed" | "rejected">("all");
  const [filterPayment, setFilterPayment] = useState<"all" | "paid" | "pending" | "rejected">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [paginationData, setPaginationData] = useState<{
    total: number;
    page: number;
    limit: number;
    pages: number;
  } | null>(null);

  useEffect(() => {
    fetchRegistrations();
  }, [eventId, page, limit, filterStatus, filterPayment]);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      setError(null);

      // Build query params
      const params = new URLSearchParams({
        eventId,
        page: page.toString(),
        limit: limit.toString(),
      });
      
      if (filterStatus !== "all") params.append("status", filterStatus);
      if (filterPayment !== "all") params.append("paymentStatus", filterPayment);

      // Fetch from workshop registrations endpoint with pagination
      const response = await fetch(`/api/registrations?${params.toString()}`);

      if (!response.ok) throw new Error("Failed to fetch registrations");

      const data = await response.json();
      if (!data.success) throw new Error(data.error || "Failed to fetch registrations");

      setRegistrations(Array.isArray(data.data) ? data.data : []);
      setPaginationData(data.pagination || null);
    } catch (err: any) {
      console.error("Error fetching registrations:", err);
      setError(err.message || "Failed to load registrations");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmRegistration = async (id: string, confirm: boolean) => {
    try {
      setConfirmingId(id);

      const response = await fetch(`/api/registrations/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: confirm ? "confirmed" : "rejected",
        }),
      });

      if (!response.ok) throw new Error("Failed to update registration");

      const data = await response.json();
      if (!data.success) throw new Error(data.error);

      // Update local state
      setRegistrations((prev) =>
        prev.map((reg) =>
          reg._id === id
            ? { ...reg, status: confirm ? "confirmed" : "rejected" }
            : reg
        )
      );
    } catch (err: any) {
      console.error("Error updating registration:", err);
      alert(err.message || "Failed to update registration");
    } finally {
      setConfirmingId(null);
    }
  };

  const handlePaymentStatus = async (
    id: string,
    paymentStatus: "paid" | "pending" | "rejected"
  ) => {
    try {
      setPaymentId(id);

      const response = await fetch(`/api/registrations/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentStatus,
          // Auto-confirm if marking as paid
          ...(paymentStatus === "paid" && { status: "confirmed" }),
        }),
      });

      if (!response.ok) throw new Error("Failed to update payment status");

      const data = await response.json();
      if (!data.success) throw new Error(data.error);

      // Update local state
      setRegistrations((prev) =>
        prev.map((reg) =>
          reg._id === id
            ? {
                ...reg,
                paymentStatus,
                status: paymentStatus === "paid" ? "confirmed" : reg.status,
              }
            : reg
        )
      );
    } catch (err: any) {
      console.error("Error updating payment status:", err);
      alert(err.message || "Failed to update payment status");
    } finally {
      setPaymentId(null);
    }
  };

  // Filter registrations (now handled by API)
  const filteredRegistrations = registrations;

  // Pagination data from API
  const totalFiltered = paginationData?.total || 0;
  const totalPages = paginationData?.pages || 1;
  const startIndex = ((paginationData?.page || 1) - 1) * (paginationData?.limit || limit);
  const endIndex = Math.min(startIndex + (paginationData?.limit || limit), totalFiltered);

  // Statistics - showing current page data
  const stats = {
    total: totalFiltered,
    pending: registrations.filter((r) => r.status === "pending").length,
    confirmed: registrations.filter((r) => r.status === "confirmed").length,
    paid: registrations.filter((r) => r.paymentStatus === "paid").length,
  };

  // Reset to page 1 when filters or limit change
  useEffect(() => {
    setPage(1);
  }, [filterStatus, filterPayment, limit]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader className="animate-spin w-8 h-8 text-cyan-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total", value: stats.total, color: "bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300" },
          { label: "Pending", value: stats.pending, color: "bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-300" },
          { label: "Confirmed", value: stats.confirmed, color: "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300" },
          { label: "Paid", value: stats.paid, color: "bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300" },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${stat.color} rounded-lg p-4`}
          >
            <p className="text-sm font-medium opacity-75">{stat.label}</p>
            <p className="text-3xl font-bold">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg">Filters</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Total: <span className="font-semibold">{totalFiltered}</span> registration{totalFiltered !== 1 ? 's' : ''}
              </p>
            </div>
            <Button
              onClick={fetchRegistrations}
              disabled={loading}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              Reload
            </Button>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Registration Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Payment Status</label>
            <select
              value={filterPayment}
              onChange={(e) => setFilterPayment(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white"
            >
              <option value="all">All Payments</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Per Page</label>
            <select
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white"
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Registrations List */}
      {error ? (
        <Card className="border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10">
          <CardContent className="p-6">
            <div className="flex gap-3 items-start">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-900 dark:text-red-200">{error}</p>
                <Button
                  onClick={fetchRegistrations}
                  variant="outline"
                  size="sm"
                  className="mt-3"
                >
                  Try Again
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : totalFiltered === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              No registrations found
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredRegistrations.map((reg, index) => (
            <motion.div
              key={reg._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  {/* Main Row */}
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-grow">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-lg">{reg.name}</h4>
                        <div className="flex gap-2">
                          {/* Status Badge */}
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${
                              reg.status === "confirmed"
                                ? "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300"
                                : reg.status === "rejected"
                                ? "bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300"
                                : "bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-300"
                            }`}
                          >
                            {reg.status.charAt(0).toUpperCase() + reg.status.slice(1)}
                          </span>

                          {/* Payment Badge */}
                          {reg.paymentStatus && (
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded-full ${
                                reg.paymentStatus === "paid"
                                  ? "bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300"
                                  : reg.paymentStatus === "pending"
                                  ? "bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-300"
                                  : "bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300"
                              }`}
                            >
                              {reg.paymentStatus === "paid" 
                                ? "💳 Paid" 
                                : reg.paymentStatus === "pending"
                                ? "⏳ Pending"
                                : "❌ Rejected"}
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 dark:text-gray-400">{reg.email}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{reg.phone}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          setExpandedId(expandedId === reg._id ? null : reg._id)
                        }
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        title="View details"
                      >
                        {expandedId === reg._id ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>

                      {reg.status === "pending" && (
                        <>
                          <Button
                            onClick={() => handleConfirmRegistration(reg._id, true)}
                            disabled={confirmingId === reg._id}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 h-auto text-sm"
                          >
                            {confirmingId === reg._id ? (
                              <Loader className="w-4 h-4 animate-spin" />
                            ) : (
                              <>
                                <Check className="w-4 h-4 mr-1" />
                                Confirm
                              </>
                            )}
                          </Button>

                          <Button
                            onClick={() => handleConfirmRegistration(reg._id, false)}
                            disabled={confirmingId === reg._id}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 h-auto text-sm"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </>
                      )}

                      {/* Payment Actions */}
                      {reg.isPaid && reg.paymentStatus === "pending" && (
                        <>
                          <Button
                            onClick={() => handlePaymentStatus(reg._id, "paid")}
                            disabled={paymentId === reg._id}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 h-auto text-sm"
                          >
                            {paymentId === reg._id ? (
                              <Loader className="w-4 h-4 animate-spin" />
                            ) : (
                              <>
                                <Check className="w-4 h-4 mr-1" />
                                Approve Payment
                              </>
                            )}
                          </Button>
                          <Button
                            onClick={() => handlePaymentStatus(reg._id, "rejected")}
                            disabled={paymentId === reg._id}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 h-auto text-sm"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {expandedId === reg._id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2"
                    >
                      {reg.studentId && (
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              Student ID
                            </p>
                            <p className="font-medium">{reg.studentId}</p>
                          </div>

                          {reg.department && (
                            <div>
                              <p className="text-xs text-gray-600 dark:text-gray-400">
                                Department
                              </p>
                              <p className="font-medium">{reg.department}</p>
                            </div>
                          )}
                        </div>
                      )}

                      {reg.batch && (
                        <div>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            Batch
                          </p>
                          <p className="font-medium">{reg.batch}</p>
                        </div>
                      )}

                      {reg.isPaid && (
                        <div className="bg-yellow-50 dark:bg-yellow-500/10 p-3 rounded-lg border border-yellow-200 dark:border-yellow-500/20">
                          <p className="text-xs font-semibold text-yellow-800 dark:text-yellow-300 mb-2">
                            💳 Payment Information
                          </p>
                          
                          {reg.paymentMethod && (
                            <div className="mb-2">
                              <p className="text-xs text-yellow-700 dark:text-yellow-400">
                                Payment Method
                              </p>
                              <p className="font-medium text-yellow-900 dark:text-yellow-200">
                                {reg.paymentMethod.toUpperCase()}
                              </p>
                            </div>
                          )}

                          {reg.paymentNumber && (
                            <div className="mb-2">
                              <p className="text-xs text-yellow-700 dark:text-yellow-400">
                                Sender's Number
                              </p>
                              <p className="font-mono font-semibold text-yellow-900 dark:text-yellow-200">
                                {reg.paymentNumber}
                              </p>
                            </div>
                          )}

                          {reg.transactionId && (
                            <div className="mb-2">
                              <p className="text-xs text-yellow-700 dark:text-yellow-400">
                                Transaction ID
                              </p>
                              <p className="font-mono font-bold text-yellow-900 dark:text-yellow-200 bg-yellow-100 dark:bg-yellow-500/20 px-2 py-1 rounded inline-block">
                                {reg.transactionId}
                              </p>
                            </div>
                          )}
                          
                          {reg.amount && (
                            <div>
                              <p className="text-xs text-yellow-700 dark:text-yellow-400">
                                Amount
                              </p>
                              <p className="font-medium text-yellow-900 dark:text-yellow-200">
                                ৳{reg.amount}
                              </p>
                            </div>
                          )}
                        </div>
                      )}

                      {reg.message && (
                        <div>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            Message
                          </p>
                          <p className="font-medium">{reg.message}</p>
                        </div>
                      )}

                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Registered
                        </p>
                        <p className="font-medium">
                          {new Date(reg.createdAt).toLocaleString()}
                        </p>
                      </div>

                      {reg.notes && (
                        <div>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            Notes
                          </p>
                          <p className="font-medium">{reg.notes}</p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalFiltered > 0 && totalPages > 1 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Showing {startIndex + 1} to {Math.min(endIndex, totalFiltered)} of {totalFiltered} registrations
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  variant="outline"
                  size="sm"
                >
                  Previous
                </Button>
                
                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (page <= 3) {
                      pageNum = i + 1;
                    } else if (page >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = page - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                          page === pageNum
                            ? "bg-cyan-600 text-white"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                
                <Button
                  onClick={() => setPage(page + 1)}
                  disabled={page === totalPages}
                  variant="outline"
                  size="sm"
                >
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Export Button */}
      {filteredRegistrations.length > 0 && (
        <div className="flex gap-3">
          <Button
            onClick={() => {
              // Generate CSV
              const headers = [
                "Name",
                "Email",
                "Phone",
                "Student ID",
                "Department",
                "Status",
                "Payment Status",
                "Registered",
              ];
              const rows = filteredRegistrations.map((reg) => [
                reg.name,
                reg.email,
                reg.phone,
                reg.studentId || "",
                reg.department || "",
                reg.status,
                reg.paymentStatus || "",
                new Date(reg.createdAt).toLocaleString(),
              ]);

              const csv =
                [headers, ...rows]
                  .map((row) => row.map((v) => `"${v}"`).join(","))
                  .join("\n") + "\n";

              const blob = new Blob([csv], { type: "text/csv" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `registrations-${Date.now()}.csv`;
              a.click();
              URL.revokeObjectURL(url);
            }}
            className="bg-cyan-600 hover:bg-cyan-700 text-white"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      )}
    </div>
  );
}
