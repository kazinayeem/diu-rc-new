"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface PaymentOption {
  _id: string;
  name: string;
  number: string;
  instruction: string;
}

interface PaymentOptionForm {
  name: string;
  number: string;
  instruction: string;
}

export default function AdminPaymentPage() {
  const [form, setForm] = useState<PaymentOptionForm>({
    name: "",
    number: "",
    instruction: "",
  });
  const [options, setOptions] = useState<PaymentOption[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string>("");

  const seedDefaults = async () => {
    const defaults: PaymentOptionForm[] = [
      {
        name: "bKash",
        number: "01700000001",
        instruction: "Send money and keep the transaction ID.",
      },
      {
        name: "Nagad",
        number: "01800000002",
        instruction: "Send money and keep the transaction ID.",
      },
      {
        name: "Rocket",
        number: "01900000003",
        instruction: "Send money and keep the transaction ID.",
      },
      {
        name: "BRAC Bank",
        number: "0200000000001",
        instruction: "Transfer and keep the reference ID.",
      },
      {
        name: "IBBL Bank",
        number: "0210000000002",
        instruction: "Transfer and keep the reference ID.",
      },
    ];

    setSaving(true);
    setMessage("");

    try {
      for (const item of defaults) {
        await fetch("/api/payment-options", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(item),
        });
      }

      const refresh = await fetch("/api/payment-options");
      const refreshData = await refresh.json();
      setOptions(Array.isArray(refreshData?.data) ? refreshData.data : []);
    } catch {
      setMessage("Failed to add default payment options.");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const res = await fetch("/api/payment-options");
        const data = await res.json();
        const loaded = Array.isArray(data?.data) ? data.data : [];
        setOptions(loaded);
        if (loaded.length === 0) {
          await seedDefaults();
        }
      } catch {
        setMessage("Failed to load payment options");
      }
    };

    loadOptions();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const isEditing = Boolean(editingId);
      const endpoint = isEditing
        ? `/api/payment-options/${editingId}`
        : "/api/payment-options";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Failed to save settings");
      }

      setMessage(
        isEditing ? "Payment option updated." : "Payment option added successfully."
      );
      setForm({ name: "", number: "", instruction: "" });
      setEditingId(null);
      const refresh = await fetch("/api/payment-options");
      const refreshData = await refresh.json();
      setOptions(Array.isArray(refreshData?.data) ? refreshData.data : []);
    } catch (error: any) {
      setMessage(error?.message || "Failed to save payment option");
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (option: PaymentOption) => {
    setEditingId(option._id);
    setForm({
      name: option.name,
      number: option.number,
      instruction: option.instruction,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ name: "", number: "", instruction: "" });
  };

  const deleteOption = async (optionId: string) => {
    const confirmed = window.confirm("Delete this payment option?");
    if (!confirmed) return;

    setSaving(true);
    setMessage("");

    try {
      const res = await fetch(`/api/payment-options/${optionId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Failed to delete payment option");
      }

      if (editingId === optionId) {
        cancelEdit();
      }

      const refresh = await fetch("/api/payment-options");
      const refreshData = await refresh.json();
      setOptions(Array.isArray(refreshData?.data) ? refreshData.data : []);
      setMessage("Payment option deleted.");
    } catch (error: any) {
      setMessage(error?.message || "Failed to delete payment option");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="text-slate-100">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold">Payment Options</h1>
        <p className="text-slate-400">
          Add multiple payment options shown on the Join form.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="bg-white/5 border border-white/10">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {message && (
                <div className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
                  {message}
                </div>
              )}

              <div>
                <label className="block text-sm text-slate-200 mb-2">
                  Payment Method Name (e.g., bKash)
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-black/30 border border-white/20 text-white"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-200 mb-2">
                  Number
                </label>
                <input
                  type="text"
                  value={form.number}
                  onChange={(e) =>
                    setForm({ ...form, number: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg bg-black/30 border border-white/20 text-white"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-200 mb-2">
                  Instruction (single language)
                </label>
                <textarea
                  value={form.instruction}
                  onChange={(e) =>
                    setForm({ ...form, instruction: e.target.value })
                  }
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg bg-black/30 border border-white/20 text-white"
                />
              </div>

              <Button type="submit" disabled={saving}>
                {saving
                  ? "Saving..."
                  : editingId
                  ? "Update Payment Option"
                  : "Add Payment Option"}
              </Button>
              {editingId && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={cancelEdit}
                  className="ml-3"
                >
                  Cancel
                </Button>
              )}
            </form>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border border-white/10 lg:col-span-2">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-slate-100 mb-4">
              Available Options
            </h2>
            {options.length === 0 ? (
              <p className="text-slate-400 text-sm">No payment options yet.</p>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {options.map((option) => (
                  <div
                    key={option._id}
                    className="rounded-xl border border-white/10 bg-white/5 p-4"
                  >
                    <p className="text-slate-100 font-semibold">
                      {option.name}
                    </p>
                    <p className="text-slate-300 text-sm mt-1">
                      {option.number}
                    </p>
                    <p className="text-slate-400 text-xs mt-2">
                      {option.instruction}
                    </p>
                    <div className="mt-4 flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => startEdit(option)}
                      >
                        Edit
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => deleteOption(option._id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
