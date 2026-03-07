"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { Lock, ShieldOff, Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function AdminProfilePage() {
  const { data: session } = useSession();
  const role = (session?.user as any)?.role;
  const isManager = role === "manager";

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }
    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/profile/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || "Failed to update password.");
      } else {
        setSuccess("Password updated successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-white max-w-xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1">My Profile</h1>
        <p className="text-white/50">Account information and settings</p>
      </div>

      {/* Account Info Card */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center text-2xl font-black text-[#0B1F3A] shadow-lg">
            {session?.user?.name?.charAt(0)?.toUpperCase() ?? "?"}
          </div>
          <div>
            <p className="font-bold text-lg">{session?.user?.name}</p>
            <p className="text-white/50 text-sm">{session?.user?.email}</p>
            <span className={`inline-block mt-1 px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-widest border ${
              isManager
                ? "bg-cyan-500/15 text-cyan-300 border-cyan-400/30"
                : "bg-purple-500/15 text-purple-300 border-purple-400/30"
            }`}>
              {role ?? "—"}
            </span>
          </div>
        </div>
      </div>

      {/* Change Password */}
      {isManager ? (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-lg font-bold mb-5 flex items-center gap-2">
            <Lock size={18} className="text-cyan-400" />
            Change Password
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Current Password */}
            <div>
              <label className="block text-xs text-white/50 mb-1">Current Password</label>
              <div className="relative">
                <input
                  type={showCurrent ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 pr-10 bg-white/5 border border-white/15 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
                  placeholder="Enter current password"
                />
                <button type="button" onClick={() => setShowCurrent(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                  {showCurrent ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-xs text-white/50 mb-1">New Password</label>
              <div className="relative">
                <input
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={8}
                  className="w-full px-4 py-2.5 pr-10 bg-white/5 border border-white/15 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
                  placeholder="At least 8 characters"
                />
                <button type="button" onClick={() => setShowNew(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                  {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs text-white/50 mb-1">Confirm New Password</label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 pr-10 bg-white/5 border border-white/15 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
                  placeholder="Repeat new password"
                />
                <button type="button" onClick={() => setShowConfirm(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                  {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-red-400 text-sm flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                {error}
              </p>
            )}
            {success && (
              <p className="text-green-400 text-sm flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-2">
                <CheckCircle2 size={15} /> {success}
              </p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <><Loader2 size={16} className="mr-2 animate-spin" />Updating...</>
              ) : (
                <><Lock size={16} className="mr-2" />Update Password</>
              )}
            </Button>
          </form>
        </div>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center text-center gap-3 text-white/40">
          <ShieldOff size={32} />
          <p className="font-semibold text-white/60">Password Change Restricted</p>
          <p className="text-sm">Super-admins cannot change their password from here. Please contact the system administrator.</p>
        </div>
      )}
    </div>
  );
}
