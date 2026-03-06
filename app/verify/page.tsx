"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Search,
  CheckCircle2,
  XCircle,
  Loader2,
  Award,
  User,
  Calendar,
  Tag,
  Hash,
} from "lucide-react";

interface CertificateResult {
  valid: boolean;
  id?: string;
  recipientName?: string;
  event?: string;
  category?: string;
  issueDate?: string;
  message?: string;
}

export default function VerifyCertificatePage() {
  const [certId, setCertId] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CertificateResult | null>(null);
  const [touched, setTouched] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!certId.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch(`/api/certificates/verify?id=${encodeURIComponent(certId.trim())}`);
      const data = await res.json();
      setResult(data);
    } catch {
      setResult({ valid: false, message: "Unable to reach verification server. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleInput = (val: string) => {
    setCertId(val);
    setTouched(true);
    if (result) setResult(null);
  };

  return (
    <main className="min-h-screen bg-[#0B1F3A] relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0D2050]/60 via-[#0B1F3A] to-[#150A35]/40 pointer-events-none" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(61,181,216,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(61,181,216,0.04) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(61,181,216,0.10) 0%, transparent 70%)" }} />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full blur-[120px] pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(91,75,255,0.10) 0%, transparent 70%)" }} />

      <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 pt-20 pb-28">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6"
            style={{ background: "linear-gradient(135deg, rgba(61,181,216,0.15) 0%, rgba(91,75,255,0.15) 100%)", border: "1px solid rgba(61,181,216,0.2)" }}>
            <ShieldCheck size={30} style={{ color: "#3DB5D8" }} />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-3 tracking-tight">
            Certificate Verification
          </h1>
          <p className="text-white/50 text-base max-w-md mx-auto leading-relaxed">
            Verify the authenticity of DIU Robotics Club certificates instantly.
          </p>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="rounded-2xl p-8"
          style={{
            background: "linear-gradient(145deg, #0D2248 0%, #0B1F3A 100%)",
            border: "1px solid rgba(61,181,216,0.12)",
            boxShadow: "0 8px 40px rgba(0,0,0,0.4)",
          }}
        >
          <form onSubmit={handleVerify} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-white/70 mb-2 tracking-wide">
                Certificate ID
              </label>
              <div className="relative">
                <Hash
                  size={17}
                  className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color: "#3DB5D8" }}
                />
                <input
                  type="text"
                  value={certId}
                  onChange={(e) => handleInput(e.target.value)}
                  placeholder="e.g., DIURC2024001"
                  spellCheck={false}
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl text-white placeholder-white/25 text-sm font-medium outline-none transition-all duration-200"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: touched && certId.trim() === ""
                      ? "1px solid rgba(239,68,68,0.4)"
                      : "1px solid rgba(61,181,216,0.18)",
                  }}
                  onFocus={(e) => (e.currentTarget.style.border = "1px solid rgba(61,181,216,0.45)")}
                  onBlur={(e) =>
                    (e.currentTarget.style.border =
                      touched && certId.trim() === ""
                        ? "1px solid rgba(239,68,68,0.4)"
                        : "1px solid rgba(61,181,216,0.18)")
                  }
                />
              </div>
              <p className="mt-1.5 text-xs text-white/30">
                The certificate ID is printed at the bottom of your certificate.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || !certId.trim()}
              className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl font-semibold text-[15px] text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: "linear-gradient(135deg, #3DB5D8 0%, #2F6BFF 55%, #5B4BFF 100%)",
                boxShadow: "0 0 24px rgba(47,107,255,0.3)",
              }}
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Search size={18} />
              )}
              {loading ? "Verifying…" : "Verify Certificate"}
            </button>
          </form>
        </motion.div>

        {/* Result */}
        <AnimatePresence>
          {result && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="mt-6 rounded-2xl p-7"
              style={{
                background: result.valid
                  ? "linear-gradient(145deg, rgba(16,42,32,0.9) 0%, rgba(11,31,58,0.9) 100%)"
                  : "linear-gradient(145deg, rgba(42,14,20,0.9) 0%, rgba(11,31,58,0.9) 100%)",
                border: result.valid
                  ? "1px solid rgba(34,197,94,0.25)"
                  : "1px solid rgba(239,68,68,0.25)",
                boxShadow: result.valid
                  ? "0 8px 40px rgba(34,197,94,0.08)"
                  : "0 8px 40px rgba(239,68,68,0.08)",
              }}
            >
              {result.valid ? (
                <div className="space-y-5">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 size={26} className="text-emerald-400 flex-shrink-0" />
                    <div>
                      <h2 className="text-lg font-black text-white">Certificate Verified</h2>
                      <p className="text-sm text-emerald-400/80">This certificate is authentic and valid.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {result.id && (
                      <InfoRow icon={<Hash size={15} />} label="Certificate ID" value={result.id} />
                    )}
                    {result.recipientName && (
                      <InfoRow icon={<User size={15} />} label="Recipient" value={result.recipientName} />
                    )}
                    {result.event && (
                      <InfoRow icon={<Award size={15} />} label="Event / Program" value={result.event} />
                    )}
                    {result.category && (
                      <InfoRow icon={<Tag size={15} />} label="Category" value={result.category} />
                    )}
                    {result.issueDate && (
                      <InfoRow icon={<Calendar size={15} />} label="Issue Date" value={result.issueDate} />
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-3">
                  <XCircle size={26} className="text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h2 className="text-lg font-black text-white">Certificate Not Found</h2>
                    <p className="text-sm text-red-400/80 mt-0.5">
                      {result.message || "No certificate matches this ID. Please check and try again."}
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Info note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center text-xs text-white/25 mt-10"
        >
          Certificates issued by DIU Robotics Club are digitally recorded. For support, contact{" "}
          <a href="mailto:diuroboticsclub@diu.edu.bd" className="text-white/40 hover:text-white/60 transition-colors">
            diuroboticsclub@diu.edu.bd
          </a>
        </motion.p>
      </div>
    </main>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div
      className="flex items-start gap-2.5 px-4 py-3 rounded-xl"
      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
    >
      <span className="mt-0.5 text-white/40">{icon}</span>
      <div className="min-w-0">
        <p className="text-xs text-white/40 font-medium">{label}</p>
        <p className="text-sm text-white font-semibold truncate">{value}</p>
      </div>
    </div>
  );
}
