"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Mail, Save, TestTube, Eye, EyeOff, Loader2 } from "lucide-react";

export default function SMTPSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

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
      name: "DIU Robotics Club",
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
            name: result.data.from?.name || "DIU Robotics Club",
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
      const response = await fetch("/api/admin/smtp-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
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
        {/* Gmail Notice */}
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
          <p className="text-sm text-blue-300 mb-2">
            <strong>Gmail Setup Instructions:</strong>
          </p>
          <ul className="text-sm text-white/70 space-y-1 list-disc list-inside">
            <li>Enable 2-Step Verification on your Google Account</li>
            <li>Generate an App Password: <a href="https://myaccount.google.com/apppasswords" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">myaccount.google.com/apppasswords</a></li>
            <li>Use your Gmail address and the generated App Password below</li>
          </ul>
        </div>

        {/* Service Selection */}
        <div>
          <label className="block text-sm font-medium mb-2">Email Service</label>
          <select
            name="service"
            value={formData.service}
            onChange={handleChange}
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
              <input
                type="number"
                name="port"
                value={formData.port}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="secure"
                checked={formData.secure}
                onChange={handleChange}
                className="mr-2"
              />
              <label className="text-sm">Use SSL/TLS (Port 465)</label>
            </div>
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
                placeholder="DIU Robotics Club"
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
            {testResult.message}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-4">
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
  );
}
