"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import Link from "next/link";
import { AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      } else {
        router.push("/admin");
        router.refresh();
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <body className="min-h-screen bg-[#071024] bg-gradient-to-br from-[#071024] via-[#082135] to-[#0e2840] text-white flex items-center justify-center p-4">
      <Card
        variant="elevated"
        className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl"
      >
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
              <label
                htmlFor="email"
                className="block text-sm font-medium text-white/80 mb-2"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 bg-white/5 text-white border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1f8fff] focus:border-transparent placeholder-white/40"
                placeholder="admin@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-white/80 mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 bg-white/5 text-white border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1f8fff] focus:border-transparent placeholder-white/40"
                placeholder="••••••••"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-[#1f8fff] hover:bg-[#0e6fd8] text-white font-semibold py-2 rounded-lg shadow-md shadow-black/30 transition-all"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
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
    </body>
  );
}
