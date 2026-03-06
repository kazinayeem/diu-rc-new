"use client";

import React, { useEffect, useState } from "react";
import { Plus, Trash2, Edit2, X, Loader2, Eye, EyeOff, Linkedin } from "lucide-react";
import Image from "next/image";

type HallEntry = {
  _id: string;
  name: string;
  imageUrl: string;
  achievement: string;
  position: string;
  year: string;
  linkedinUrl: string;
  isVisible: boolean;
  order: number;
};

const emptyForm = {
  name: "",
  imageUrl: "",
  achievement: "",
  position: "",
  year: "",
  linkedinUrl: "",
  isVisible: true,
  order: 0,
};

export default function AdminHallOfFamePage() {
  const [entries, setEntries] = useState<HallEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [imgError, setImgError] = useState(false);

  async function fetchEntries() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/hall-of-fame");
      const json = await res.json();
      setEntries(json.data ?? []);
    } catch {
      setEntries([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchEntries();
  }, []);

  function openCreate() {
    setEditId(null);
    setForm({ ...emptyForm });
    setError("");
    setImgError(false);
    setShowModal(true);
  }

  function openEdit(e: HallEntry) {
    setEditId(e._id);
    setForm({
      name: e.name,
      imageUrl: e.imageUrl,
      achievement: e.achievement,
      position: e.position,
      year: e.year,
      linkedinUrl: e.linkedinUrl ?? "",
      isVisible: e.isVisible,
      order: e.order ?? 0,
    });
    setError("");
    setImgError(false);
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditId(null);
    setForm({ ...emptyForm });
    setError("");
    setImgError(false);
  }

  async function handleSave() {
    if (!form.name.trim() || !form.imageUrl.trim() || !form.achievement.trim() ||
      !form.position.trim() || !form.year.trim()) {
      setError("Name, Image URL, Achievement, Position, and Year are required.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const url = editId
        ? `/api/admin/hall-of-fame/${editId}`
        : "/api/admin/hall-of-fame";
      const method = editId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        setError(json.error ?? "Failed to save");
        return;
      }

      closeModal();
      fetchEntries();
    } catch (err: any) {
      setError(err.message ?? "Network error");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this Hall of Fame entry?")) return;
    setDeleting(id);

    try {
      const res = await fetch(`/api/admin/hall-of-fame/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        fetchEntries();
      } else {
        alert(json.error ?? "Delete failed");
      }
    } catch {
      alert("Network error");
    } finally {
      setDeleting(null);
    }
  }

  async function toggleVisibility(entry: HallEntry) {
    try {
      await fetch(`/api/admin/hall-of-fame/${entry._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isVisible: !entry.isVisible }),
      });
      fetchEntries();
    } catch {
      alert("Failed to update visibility");
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">🎓 Hall of Fame</h1>
          <p className="text-slate-400 text-sm mt-1">
            Distinguished alumni who have made remarkable achievements.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white px-4 py-2 rounded-xl font-semibold text-sm transition"
        >
          <Plus size={16} /> Add Entry
        </button>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={32} className="animate-spin text-emerald-400" />
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            No entries yet. Click "Add Entry" to create one.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/5 text-slate-300 text-left">
                  <th className="px-4 py-3">Photo</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Achievement</th>
                  <th className="px-4 py-3">Position</th>
                  <th className="px-4 py-3">Year</th>
                  <th className="px-4 py-3">Order</th>
                  <th className="px-4 py-3">Visible</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((e) => (
                  <tr
                    key={e._id}
                    className="border-b border-white/5 hover:bg-white/5 transition"
                  >
                    <td className="px-4 py-3">
                      <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-blue-400/50 bg-slate-700 relative">
                        {e.imageUrl ? (
                          <Image
                            src={e.imageUrl}
                            alt={e.name}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-slate-500 text-xs">
                            No img
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-semibold text-white">{e.name}</td>
                    <td className="px-4 py-3 text-slate-300 max-w-xs truncate">
                      {e.achievement}
                    </td>
                    <td className="px-4 py-3 text-slate-300">{e.position}</td>
                    <td className="px-4 py-3 text-slate-300">{e.year}</td>
                    <td className="px-4 py-3 text-slate-400">{e.order}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleVisibility(e)}
                        className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium transition ${
                          e.isVisible
                            ? "bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30"
                            : "bg-slate-600/30 text-slate-400 hover:bg-slate-600/50"
                        }`}
                      >
                        {e.isVisible ? (
                          <><Eye size={12} /> Visible</>
                        ) : (
                          <><EyeOff size={12} /> Hidden</>
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 justify-end">
                        {e.linkedinUrl && (
                          <a
                            href={e.linkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 transition"
                          >
                            <Linkedin size={16} />
                          </a>
                        )}
                        <button
                          onClick={() => openEdit(e)}
                          className="p-1.5 rounded-lg bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 transition"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(e._id)}
                          disabled={deleting === e._id}
                          className="p-1.5 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 transition disabled:opacity-50"
                        >
                          {deleting === e._id ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <Trash2 size={14} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-[#0d1b2a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <h2 className="text-lg font-bold text-white">
                {editId ? "Edit Entry" : "Add Entry"}
              </h2>
              <button onClick={closeModal} className="text-slate-400 hover:text-white transition">
                <X size={20} />
              </button>
            </div>

            {/* Modal body */}
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              {error && (
                <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              {/* Image preview */}
              {form.imageUrl && !imgError && (
                <div className="flex justify-center">
                  <div className="h-20 w-20 rounded-full overflow-hidden border-2 border-blue-400/50 bg-slate-700 relative">
                    <Image
                      src={form.imageUrl}
                      alt="Preview"
                      fill
                      className="object-cover"
                      unoptimized
                      onError={() => setImgError(true)}
                    />
                  </div>
                </div>
              )}

              <Field
                label="Full Name *"
                value={form.name}
                onChange={(v) => setForm((f) => ({ ...f, name: v }))}
                placeholder="e.g. Md Shafi"
              />
              <Field
                label="Image URL *"
                value={form.imageUrl}
                onChange={(v) => { setForm((f) => ({ ...f, imageUrl: v })); setImgError(false); }}
                placeholder="https://example.com/photo.jpg"
              />
              <Field
                label="Achievement *"
                value={form.achievement}
                onChange={(v) => setForm((f) => ({ ...f, achievement: v }))}
                placeholder="Full funded Erasmus Mundus Scholar under DREAM"
              />
              <Field
                label="Position *"
                value={form.position}
                onChange={(v) => setForm((f) => ({ ...f, position: v }))}
                placeholder="Vice President"
              />
              <Field
                label="Year *"
                value={form.year}
                onChange={(v) => setForm((f) => ({ ...f, year: v }))}
                placeholder="2024"
              />
              <Field
                label="LinkedIn URL"
                value={form.linkedinUrl}
                onChange={(v) => setForm((f) => ({ ...f, linkedinUrl: v }))}
                placeholder="https://linkedin.com/in/username"
              />
              <Field
                label="Display Order"
                type="number"
                value={String(form.order)}
                onChange={(v) => setForm((f) => ({ ...f, order: Number(v) }))}
                placeholder="0"
              />

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isVisible"
                  checked={form.isVisible}
                  onChange={(e) => setForm((f) => ({ ...f, isVisible: e.target.checked }))}
                  className="h-4 w-4 rounded accent-emerald-500"
                />
                <label htmlFor="isVisible" className="text-sm text-slate-300 cursor-pointer">
                  Visible on homepage
                </label>
              </div>
            </div>

            {/* Modal footer */}
            <div className="flex gap-3 px-6 py-4 border-t border-white/10 justify-end">
              <button
                onClick={closeModal}
                className="px-4 py-2 rounded-xl text-sm text-slate-300 hover:text-white border border-white/10 hover:bg-white/5 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-5 py-2 rounded-xl text-sm font-semibold bg-emerald-500 hover:bg-emerald-400 text-white transition disabled:opacity-50 flex items-center gap-2"
              >
                {saving && <Loader2 size={14} className="animate-spin" />}
                {editId ? "Save Changes" : "Create Entry"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-400 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition"
      />
    </div>
  );
}
