"use client";

import React, { useEffect, useState } from "react";
import {
  Plus, Trash2, Edit2, X, Loader2,
  Eye, EyeOff, ExternalLink, GripVertical,
} from "lucide-react";
import Image from "next/image";

const TIERS = [
  { key: "platinum", label: "Platinum", color: "bg-cyan-400/15 text-cyan-300 ring-cyan-400/30" },
  { key: "gold",     label: "Gold",     color: "bg-amber-400/15 text-amber-300 ring-amber-400/30" },
  { key: "silver",   label: "Silver",   color: "bg-slate-400/15 text-slate-300 ring-slate-400/30" },
  { key: "community",label: "Community",color: "bg-emerald-400/15 text-emerald-300 ring-emerald-400/30" },
];

type Sponsor = {
  _id: string;
  name: string;
  logoUrl: string;
  websiteUrl: string;
  tier: string;
  isVisible: boolean;
  order: number;
};

const emptyForm = {
  name: "",
  logoUrl: "",
  websiteUrl: "",
  tier: "community",
  isVisible: true,
  order: 0,
};

export default function AdminSponsorsPage() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...emptyForm });

  async function fetchSponsors() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/sponsors");
      const json = await res.json();
      setSponsors(json.data ?? []);
    } catch {
      setSponsors([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchSponsors(); }, []);

  function openCreate() {
    setEditId(null);
    setForm({ ...emptyForm });
    setError("");
    setShowModal(true);
  }

  function openEdit(s: Sponsor) {
    setEditId(s._id);
    setForm({
      name: s.name,
      logoUrl: s.logoUrl,
      websiteUrl: s.websiteUrl ?? "",
      tier: s.tier,
      isVisible: s.isVisible,
      order: s.order ?? 0,
    });
    setError("");
    setShowModal(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const url = editId ? `/api/admin/sponsors/${editId}` : "/api/admin/sponsors";
    const method = editId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    let json: any = {};
    try { json = await res.json(); } catch {}

    if (!res.ok) {
      setError(json.error ?? "Something went wrong");
      setSaving(false);
      return;
    }
    await fetchSponsors();
    setShowModal(false);
    setSaving(false);
  }

  async function toggleVisible(s: Sponsor) {
    const res = await fetch(`/api/admin/sponsors/${s._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isVisible: !s.isVisible }),
    });
    if (res.ok) await fetchSponsors();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this sponsor?")) return;
    const res = await fetch(`/api/admin/sponsors/${id}`, { method: "DELETE" });
    if (res.ok) await fetchSponsors();
  }

  const tierInfo = (key: string) => TIERS.find((t) => t.key === key) ?? TIERS[3];

  return (
    <div className="text-slate-100">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold mb-1">Sponsors & Partners</h1>
          <p className="text-slate-400">Manage homepage sponsors. Logo is loaded from URL.</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-[#071024] font-semibold rounded-xl transition-colors"
        >
          <Plus size={18} /> Add Sponsor
        </button>
      </div>

      {loading ? (
        <div className="flex items-center gap-3 text-slate-400">
          <Loader2 size={20} className="animate-spin" /> Loading…
        </div>
      ) : (
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 text-xs uppercase tracking-wider">
                <th className="px-5 py-4 text-left">Sponsor</th>
                <th className="px-5 py-4 text-left">Tier</th>
                <th className="px-5 py-4 text-left">Website</th>
                <th className="px-5 py-4 text-left">Order</th>
                <th className="px-5 py-4 text-left">Visible</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sponsors.map((s) => {
                const t = tierInfo(s.tier);
                return (
                  <tr key={s._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                          {s.logoUrl ? (
                            <img
                              src={s.logoUrl}
                              alt={s.name}
                              className="w-full h-full object-contain p-1"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = "none";
                              }}
                            />
                          ) : (
                            <span className="text-slate-500 text-xs">No img</span>
                          )}
                        </div>
                        <span className="font-medium text-slate-100">{s.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ring-1 ${t.color}`}>
                        {t.label}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {s.websiteUrl ? (
                        <a
                          href={s.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-cyan-400 hover:underline text-xs"
                        >
                          <ExternalLink size={12} /> Visit
                        </a>
                      ) : (
                        <span className="text-slate-500 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-slate-400 text-xs">{s.order}</td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => toggleVisible(s)}
                        className={`flex items-center gap-1 text-xs font-medium transition-colors ${
                          s.isVisible ? "text-emerald-400 hover:text-emerald-300" : "text-slate-500 hover:text-slate-300"
                        }`}
                      >
                        {s.isVisible ? <Eye size={14} /> : <EyeOff size={14} />}
                        {s.isVisible ? "Visible" : "Hidden"}
                      </button>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(s)}
                          className="p-2 rounded-lg hover:bg-white/10 text-slate-300 hover:text-cyan-300 transition-colors"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(s._id)}
                          className="p-2 rounded-lg hover:bg-white/10 text-slate-300 hover:text-red-400 transition-colors"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {sponsors.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-500">
                    No sponsors yet. Click &quot;Add Sponsor&quot; to add one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Modal ── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-[#0f172a] border border-white/15 rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
              <h2 className="text-lg font-semibold text-slate-100">
                {editId ? "Edit Sponsor" : "Add Sponsor"}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-white/10 text-slate-400">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Preview */}
              {form.logoUrl && (
                <div className="flex items-center gap-4 p-3 bg-white/5 border border-white/10 rounded-xl">
                  <img
                    src={form.logoUrl}
                    alt="preview"
                    className="w-16 h-16 object-contain rounded-lg bg-white/5 p-1"
                    onError={(e) => { (e.target as HTMLImageElement).style.opacity = "0.3"; }}
                  />
                  <span className="text-slate-400 text-xs">Logo preview</span>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Name *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 text-slate-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                  placeholder="e.g. Innovation Hub"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Logo URL *</label>
                <input
                  type="url"
                  required
                  value={form.logoUrl}
                  onChange={(e) => setForm({ ...form, logoUrl: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 text-slate-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                  placeholder="https://example.com/logo.png"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Website URL</label>
                <input
                  type="text"
                  value={form.websiteUrl}
                  onChange={(e) => setForm({ ...form, websiteUrl: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 text-slate-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                  placeholder="https://example.com"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Tier</label>
                  <select
                    value={form.tier}
                    onChange={(e) => setForm({ ...form, tier: e.target.value })}
                    className="w-full bg-[#0b1117] border border-white/10 text-slate-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                  >
                    {TIERS.map((t) => (
                      <option key={t.key} value={t.key}>{t.label}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Order</label>
                  <input
                    type="number"
                    value={form.order}
                    onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
                    className="w-full bg-white/5 border border-white/10 text-slate-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Visible on homepage</label>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, isVisible: !form.isVisible })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    form.isVisible ? "bg-emerald-500" : "bg-slate-600"
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    form.isVisible ? "translate-x-6" : "translate-x-1"
                  }`} />
                </button>
                <span className="text-sm text-slate-300">{form.isVisible ? "Visible" : "Hidden"}</span>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-slate-300 hover:bg-white/10 transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-[#071024] font-semibold transition-colors text-sm disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {saving && <Loader2 size={15} className="animate-spin" />}
                  {editId ? "Save Changes" : "Add Sponsor"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
