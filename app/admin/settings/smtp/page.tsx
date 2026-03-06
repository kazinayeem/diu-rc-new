"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Mail, Save, TestTube, Eye, EyeOff, Loader2 } from "lucide-react";

export default function SMTPSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [testEmail, setTestEmail] = useState("");
  const [testResult, setTestResult] = useState<{ success: boolean; message: string; hint?: string } | null>(null);

  const [formData, setFormData] = useState({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "",
      pass: "",
    },
    from: {
      name: "Daffodil International University Robotics Club",
      email: "",
    },
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/admin/smtp-settings");
      const result = await response.json();

      if (result.success && result.data) {
        setFormData({
          service: result.data.service || "gmail",
          host: result.data.host || "smtp.gmail.com",
          port: result.data.port || 587,
          secure: result.data.secure || false,
          auth: {
            user: result.data.auth?.user || "",
            pass: result.data.auth?.pass || "",
          },
          from: {
            name: result.data.from?.name || "Daffodil International University Robotics Club",
            email: result.data.from?.email || "",
          },
        });
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...(prev as any)[parent],
          [child]: type === "number" ? parseInt(value) : value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "number" ? parseInt(value) : type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
      }));
    }
  };

  const handleSave = async () => {
    if (!formData.auth.user || !formData.auth.pass || !formData.from.email) {
      alert("Please fill in all required fields");
      return;
    }

    setSaving(true);
    setTestResult(null);

    try {
      const response = await fetch("/api/admin/smtp-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        alert("SMTP settings saved successfully!");
      } else {
        alert(result.message || "Failed to save settings");
      }
    } catch (error: any) {
      console.error("Save error:", error);
      alert("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleTest = async () => {
    if (!formData.auth.user || !formData.auth.pass) {
      alert("Please fill in email credentials");
      return;
    }

    setTesting(true);
    setTestResult(null);

    try {
      const response = await fetch("/api/admin/smtp-settings/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Send full current form data so test works WITHOUT saving first
        body: JSON.stringify({ ...formData, testEmail: testEmail.trim() || undefined }),
      });

      const result = await response.json();
      setTestResult(result);
    } catch (error: any) {
      console.error("Test error:", error);
      setTestResult({ success: false, message: "Connection test failed" });
    } finally {
      setTesting(false);
    }
  };

  if (loading) {
    return (
      <div className="text-white flex items-center justify-center py-20">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  return (
    <div className="text-white max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">SMTP Configuration</h1>
        <p className="text-white/60">Configure email settings for notifications and communications</p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-6">
        {/* Gmail App Password Notice */}
        <div className="bg-amber-500/10 border border-amber-500/40 rounded-xl p-5">
          <p className="text-amber-300 font-bold mb-3 flex items-center gap-2">
            <span className="text-xl">⚠️</span> Gmail requires an App Password — your regular Gmail password will NOT work
          </p>
          <ol className="text-sm text-white/80 space-y-2 list-decimal list-inside">
            <li>Go to your Google Account: <a href="https://myaccount.google.com/security" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline font-medium">myaccount.google.com/security</a></li>
            <li>Enable <strong className="text-white">2-Step Verification</strong> (required before App Passwords appear)</li>
            <li>Go to <a href="https://myaccount.google.com/apppasswords" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline font-medium">App Passwords</a> → select <em>Mail</em> + <em>Other device</em> → Generate</li>
            <li>Copy the <strong className="text-white">16-character code</strong> (e.g. <code className="bg-white/10 px-1 rounded text-yellow-300">abcd efgh ijkl mnop</code>) — paste it below as Password</li>
          </ol>
          <p className="mt-3 text-xs text-white/50">Note: paste the App Password without spaces. Example: <code className="bg-white/10 px-1 rounded">abcdefghijklmnop</code></p>
        </div>

        {/* Service Selection */}
        <div>
          <label className="block text-sm font-medium mb-2">Email Service</label>
          <select
            name="service"
            value={formData.service}
            onChange={(e) => {
              const svc = e.target.value;
              if (svc === "gmail") {
                setFormData((prev) => ({
                  ...prev,
                  service: "gmail",
                  host: "smtp.gmail.com",
                  port: 587,
                  secure: false,
                }));
              } else {
                setFormData((prev) => ({ ...prev, service: svc }));
              }
            }}
            className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg"
          >
            <option value="gmail">Gmail</option>
            <option value="custom">Custom SMTP</option>
          </select>
        </div>

        {/* SMTP Settings */}
        {formData.service === "custom" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">SMTP Host</label>
              <input
                type="text"
                name="host"
                value={formData.host}
                onChange={handleChange}
                placeholder="smtp.example.com"
                className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Port</label>
              <select
                name="port"
                value={formData.port}
                onChange={(e) => {
                  const p = parseInt(e.target.value);
                  setFormData((prev) => ({
                    ...prev,
                    port: p,
                    secure: p === 465,
                  }));
                }}
                className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg"
              >
                <option value={587}>587 — TLS/STARTTLS (recommended)</option>
                <option value={465}>465 — SSL</option>
                <option value={25}>25 — Plain (usually blocked)</option>
              </select>
              <p className="text-xs text-white/40 mt-1">Use 587 for most providers. Use 465 for SSL-only.</p>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="secure"
                checked={formData.secure}
                onChange={handleChange}
                className="mr-2"
              />
              <label className="text-sm">Use SSL/TLS (auto-set when port 465 selected)</label>
            </div>
          </div>
        )}

        {/* Gmail port info */}
        {formData.service === "gmail" && (
          <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white/60">
            <span className="text-white/80 font-medium">Gmail SMTP:</span> smtp.gmail.com · Port <strong>587</strong> · TLS
          </div>
        )}

        {/* Authentication */}
        <div className="border-t border-white/10 pt-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Mail className="mr-2" size={20} />
            Email Credentials
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Email Address <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                name="auth.user"
                value={formData.auth.user}
                onChange={handleChange}
                placeholder="your-email@gmail.com"
                className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Password / App Password <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="auth.pass"
                  value={formData.auth.pass}
                  onChange={handleChange}
                  placeholder="••••••••••••••••"
                  className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* From Settings */}
        <div className="border-t border-white/10 pt-6">
          <h3 className="text-lg font-semibold mb-4">Sender Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">From Name</label>
              <input
                type="text"
                name="from.name"
                value={formData.from.name}
                onChange={handleChange}
                placeholder="Daffodil International University Robotics Club"
                className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                From Email <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                name="from.email"
                value={formData.from.email}
                onChange={handleChange}
                placeholder="noreply@diuroboticsclub.com"
                className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Test Result */}
        {testResult && (
          <div
            className={`rounded-lg p-4 border ${
              testResult.success
                ? "bg-green-500/10 border-green-500/30 text-green-400"
                : "bg-red-500/10 border-red-500/30 text-red-400"
            }`}
          >
            <p className="font-semibold">{testResult.message}</p>
            {testResult.hint && (
              <p className="mt-2 text-sm opacity-80">
                💡 <strong>Hint:</strong> {testResult.hint}
              </p>
            )}
          </div>
        )}

        {/* Test Email Input + Actions */}
        <div className="border-t border-white/10 pt-6 space-y-3">
          <div>
            <label className="block text-sm font-medium mb-2">
              Send Test Email To
            </label>
            <input
              type="email"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              placeholder="Leave blank to use configured from-email"
              className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:ring-2 focus:ring-cyan-500 outline-none"
            />
            <p className="text-xs text-white/40 mt-1">Enter any email address to receive the test message.</p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={handleTest}
              variant="outline"
              className="flex-1"
              disabled={saving || testing}
            >
              {testing ? (
                <>
                  <Loader2 size={18} className="mr-2 animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <TestTube size={18} className="mr-2" />
                  Test Connection
                </>
              )}
            </Button>

            <Button
              onClick={handleSave}
              className="flex-1 bg-cyan-600 hover:bg-cyan-700"
              disabled={saving || testing}
            >
              {saving ? (
                <>
                  <Loader2 size={18} className="mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} className="mr-2" />
                  Save Settings
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
