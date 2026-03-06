"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import Link from "next/link";
import { AlertCircle } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent multiple submissions
    if (loading || isRedirecting) return;
    
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
        setLoading(false);
      } else if (result?.ok) {
        // Mark as redirecting to prevent multiple clicks
        setIsRedirecting(true);
        // Hard redirect so the server session cookie is properly read by admin layout
        window.location.href = "/admin";
      } else {
        setError("Login failed. Please try again.");
        setLoading(false);
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1F3A] bg-gradient-to-br from-[#0B1F3A] via-[#082135] to-[#0e2840] text-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl">
        <CardHeader>
          <div className="text-center space-y-3">
            <div className="w-16 h-16 bg-gradient-to-br from-[#12345a] to-[#0a1a35] rounded-xl flex items-center justify-center mx-auto shadow-lg shadow-black/40">
              <span className="text-white font-bold text-2xl">RC</span>
            </div>

            <h1 className="text-2xl font-bold text-white tracking-wide">
              Admin Login
            </h1>
            <p className="text-white/70 text-sm">
              Sign in to access the admin dashboard
            </p>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-lg flex items-center space-x-2">
                <AlertCircle size={20} />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading || isRedirecting}
                className="w-full px-4 py-2 bg-white/5 text-white border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1f8fff] placeholder-white/40 disabled:opacity-60"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading || isRedirecting}
                className="w-full px-4 py-2 bg-white/5 text-white border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1f8fff] placeholder-white/40 disabled:opacity-60"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-[#1f8fff] hover:bg-[#0e6fd8] text-white font-semibold py-2 rounded-lg shadow-md shadow-black/30 transition-all"
              disabled={loading || isRedirecting}
            >
              {isRedirecting ? "Redirecting..." : loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-sm text-[#1f8fff] hover:text-[#52a8ff]"
            >
              ← Back to website
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
