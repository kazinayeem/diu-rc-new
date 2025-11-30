"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import DataTable from "@/components/admin/DataTable";
import { Card, CardContent } from "@/components/ui/Card";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import { useGetWorkshopRegistrationsQuery, useGetEventQuery, useUpdateWorkshopRegistrationMutation } from "@/lib/api/api";

export default function WorkshopRegistrationsPage() {
  const params = useParams();
  const workshopId = params.id as string;

  const [registrations, setRegistrations] = useState<any[]>([]);
  const [workshop, setWorkshop] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    total: 0,
    pendingPayments: 0,
    confirmed: 0,
  });

  const { data: regData, isFetching: fetchingRegs } = useGetWorkshopRegistrationsQuery(workshopId);
  const { data: workshopData, isFetching: fetchingWorkshop } = useGetEventQuery(workshopId);
  const [updateWorkshopRegistration] = useUpdateWorkshopRegistrationMutation();

  // Data comes from RTK Query; keep a loading flag and mirror data when it arrives

  const handlePaymentApproval = async (
    registrationId: string,
    status: "paid" | "rejected"
  ) => {
    try {
      await updateWorkshopRegistration({ id: registrationId, body: { paymentStatus: status } }).unwrap();
    } catch (err: any) {
      console.error("Error updating payment:", err);
      alert(err?.data?.message || err?.message || "An error occurred");
    }
  };

  // 🌙 DARK MODE TABLE COLUMNS
  const columns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "studentId", label: "Student ID" },

    {
      key: "paymentStatus",
      label: "Payment",
      render: (value: string, row: any) => {
        if (!row.isPaid)
          return <span className="text-white/50 text-xs">Free</span>;

        const classes = {
          pending: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
          paid: "bg-green-500/20 text-green-300 border-green-500/30",
          rejected: "bg-red-500/20 text-red-300 border-red-500/30",
        };

        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-semibold border ${
              classes[value as keyof typeof classes]
            }`}
          >
            {value}
          </span>
        );
      },
    },

    {
      key: "transactionId",
      label: "TXN ID",
      render: (value: string) => (
        <span className="font-mono text-white/80 text-sm">{value || "-"}</span>
      ),
    },

    {
      key: "paymentNumber",
      label: "Payment Number",
      render: (value: string) => value || "-",
    },

    {
      key: "status",
      label: "Status",
      render: (value: string) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold border ${
            value === "confirmed"
              ? "bg-green-500/20 text-green-300 border-green-500/30"
              : value === "pending"
              ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
              : "bg-red-500/20 text-red-300 border-red-500/30"
          }`}
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
          {row.isPaid && row.paymentStatus === "pending" && (
            <>
              <button
                onClick={() => handlePaymentApproval(row._id, "paid")}
                className="text-green-400 hover:text-green-300"
                title="Approve Payment"
              >
                <CheckCircle size={18} />
              </button>

              <button
                onClick={() => handlePaymentApproval(row._id, "rejected")}
                className="text-red-400 hover:text-red-300"
                title="Reject Payment"
              >
                <XCircle size={18} />
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  useEffect(() => {
    setLoading(fetchingRegs || fetchingWorkshop);
    // update state when rtk data changes
    if (regData?.success) {
      setRegistrations(regData.data);
      setStats({
        total: regData.total,
        pendingPayments: regData.pendingPayments,
        confirmed: regData.data.filter((r: any) => r.status === "confirmed")
          .length,
      });
    }
    if (workshopData?.success) setWorkshop(workshopData.data);
  }, [regData, workshopData, fetchingRegs, fetchingWorkshop]);

  return (
    <div className="text-white">
      {/* PAGE HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1">
          {workshop?.title || "Workshop"} – Registrations
        </h1>
        <p className="text-white/60">
          Manage workshop registrations & payments
        </p>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-white/5 border border-white/10 backdrop-blur-xl shadow-xl">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-white/60">Total Registrations</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <Clock className="text-blue-400" size={32} />
          </CardContent>
        </Card>

        <Card className="bg-white/5 border border-white/10 backdrop-blur-xl shadow-xl">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-300/80">Pending Payments</p>
              <p className="text-2xl font-bold text-yellow-300">
                {stats.pendingPayments}
              </p>
            </div>
            <Clock className="text-yellow-300" size={32} />
          </CardContent>
        </Card>

        <Card className="bg-white/5 border border-white/10 backdrop-blur-xl shadow-xl">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-green-300/80">Confirmed</p>
              <p className="text-2xl font-bold text-green-300">
                {stats.confirmed}
              </p>
            </div>
            <CheckCircle className="text-green-300" size={32} />
          </CardContent>
        </Card>
      </div>

      {/* TABLE */}
      {loading ? (
        <div className="text-center py-12 text-white/60">Loading...</div>
      ) : (
        <DataTable columns={columns} data={registrations} />
      )}
    </div>
  );
}
