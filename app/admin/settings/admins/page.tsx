"use client";

import React, { useEffect, useState } from "react";
import {
  Plus,
  Trash2,
  Edit2,
  ShieldCheck,
  User,
  CheckCircle2,
  XCircle,
  X,
  Loader2,
} from "lucide-react";

const ALL_PERMISSIONS = [
  { key: "dashboard", label: "Dashboard" },
  { key: "members", label: "Team" },
  { key: "member-registrations", label: "Members / Registrations" },
  { key: "events", label: "Events" },
  { key: "seminars", label: "Seminars" },
  { key: "workshops", label: "Workshops" },
  { key: "research", label: "Research" },
  { key: "projects", label: "Projects" },
  { key: "posts", label: "Posts" },
  { key: "notices", label: "Notices" },
  { key: "payment", label: "Payment" },
  { key: "sponsors", label: "Sponsors & Partners" },
];

type AdminRecord = {
  _id: string;
  name: string;
  email: string;
  role: "super-admin" | "manager";
  permissions: string[];
  isActive: boolean;
  createdAt: string;
};

const emptyForm = {
  name: "",
  email: "",
  password: "",
  role: "manager" as "super-admin" | "manager",
  permissions: [] as string[],
  isActive: true,
};

export default function ManageAdminsPage() {
  const [admins, setAdmins] = useState<AdminRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...emptyForm });

  async function fetchAdmins() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/admins");
      const json = await res.json();
      setAdmins(json.data ?? []);
    } catch {
      setAdmins([]);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchAdmins();
  }, []);

  function openCreate() {
    setEditId(null);
    setForm({ ...emptyForm });
    setError("");
    setShowModal(true);
  }

  function openEdit(admin: AdminRecord) {
    setEditId(admin._id);
    setForm({
      name: admin.name,
      email: admin.email,
      password: "",
      role: admin.role,
      permissions: admin.permissions ?? [],
      isActive: admin.isActive,
    });
    setError("");
    setShowModal(true);
  }

  function togglePermission(key: string) {
    setForm((f) => ({
      ...f,
      permissions: f.permissions.includes(key)
        ? f.permissions.filter((p) => p !== key)
        : [...f.permissions, key],
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const url = editId ? `/api/admin/admins/${editId}` : "/api/admin/admins";
    const method = editId ? "PUT" : "POST";

    const body: Record<string, unknown> = {
      name: form.name,
      role: form.role,
      permissions: form.role === "manager" ? form.permissions : [],
      isActive: form.isActive,
    };
    if (!editId) {
      body.email = form.email;
      body.password = form.password;
    }

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    let json: any = {};
    try { json = await res.json(); } catch { /* empty body */ }

    if (!res.ok) {
      setError(json.error ?? "Something went wrong");
      setSaving(false);
      return;
    }
    await fetchAdmins();
    setShowModal(false);
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this admin? This cannot be undone.")) return;
    const res = await fetch(`/api/admin/admins/${id}`, { method: "DELETE" });
    let json: any = {};
    try { json = await res.json(); } catch { /* empty body */ }
    if (!res.ok) {
      alert(json.error ?? "Failed to delete");
      return;
    }
    await fetchAdmins();
  }

  return (
    <div className="text-slate-100">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold mb-1">Manage Admins</h1>
          <p className="text-slate-400">Create managers and assign their permissions</p>
        </div>
        <button
          onClick={openCreate}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-[#071024] font-semibold rounded-xl transition-colors"
        >
          <Plus size={18} />
          Add Admin
        </button>
      </div>

      {loading ? (
        <div className="flex items-center gap-3 text-slate-400">
          <Loader2 size={20} className="animate-spin" /> Loading admins…
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-3 md:hidden">
            {admins.map((admin) => (
              <div
                key={admin._id}
                className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium text-slate-100 break-words">{admin.name}</p>
                    <p className="text-slate-400 text-xs break-all">{admin.email}</p>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold flex-shrink-0 ${
                      admin.role === "super-admin"
                        ? "bg-amber-400/15 text-amber-300 ring-1 ring-amber-400/30"
                        : "bg-cyan-400/15 text-cyan-300 ring-1 ring-cyan-400/30"
                    }`}
                  >
                    <ShieldCheck size={11} />
                    {admin.role === "super-admin" ? "Super Admin" : "Manager"}
                  </span>
                </div>

                <div className="mt-3">
                  <p className="text-[11px] uppercase tracking-wider text-slate-500 mb-1">Permissions</p>
                  {admin.role === "super-admin" ? (
                    <span className="text-slate-400 text-xs">All access</span>
                  ) : admin.permissions?.length ? (
                    <div className="flex flex-wrap gap-1">
                      {admin.permissions.map((p) => (
                        <span
                          key={p}
                          className="px-1.5 py-0.5 bg-slate-700 rounded text-xs text-slate-300"
                        >
                          {ALL_PERMISSIONS.find((x) => x.key === p)?.label ?? p}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-slate-500 text-xs">No permissions</span>
                  )}
                </div>

                <div className="mt-3 flex items-center justify-between">
                  {admin.isActive ? (
                    <span className="flex items-center gap-1 text-emerald-400 text-xs">
                      <CheckCircle2 size={13} /> Active
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-red-400 text-xs">
                      <XCircle size={13} /> Inactive
                    </span>
                  )}

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEdit(admin)}
                      className="p-2 rounded-lg hover:bg-white/10 text-slate-300 hover:text-cyan-300 transition-colors"
                      title="Edit"
                    >
                      <Edit2 size={15} />
                    </button>
                    <button
                      onClick={() => handleDelete(admin._id)}
                      className="p-2 rounded-lg hover:bg-white/10 text-slate-300 hover:text-red-400 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {admins.length === 0 && (
              <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur text-center py-12 text-slate-500">
                No admins found.
              </div>
            )}
          </div>

          <div className="hidden md:block rounded-2xl border border-white/10 bg-white/5 backdrop-blur overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[850px]">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400 text-xs uppercase tracking-wider">
                    <th className="px-5 py-4 text-left">Name / Email</th>
                    <th className="px-5 py-4 text-left">Role</th>
                    <th className="px-5 py-4 text-left">Permissions</th>
                    <th className="px-5 py-4 text-left">Status</th>
                    <th className="px-5 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {admins.map((admin) => (
                    <tr
                      key={admin._id}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="px-5 py-4">
                        <p className="font-medium text-slate-100">{admin.name}</p>
                        <p className="text-slate-400 text-xs">{admin.email}</p>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            admin.role === "super-admin"
                              ? "bg-amber-400/15 text-amber-300 ring-1 ring-amber-400/30"
                              : "bg-cyan-400/15 text-cyan-300 ring-1 ring-cyan-400/30"
                          }`}
                        >
                          <ShieldCheck size={11} />
                          {admin.role === "super-admin" ? "Super Admin" : "Manager"}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        {admin.role === "super-admin" ? (
                          <span className="text-slate-400 text-xs">All access</span>
                        ) : admin.permissions?.length ? (
                          <div className="flex flex-wrap gap-1">
                            {admin.permissions.map((p) => (
                              <span
                                key={p}
                                className="px-1.5 py-0.5 bg-slate-700 rounded text-xs text-slate-300"
                              >
                                {ALL_PERMISSIONS.find((x) => x.key === p)?.label ?? p}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-slate-500 text-xs">No permissions</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        {admin.isActive ? (
                          <span className="flex items-center gap-1 text-emerald-400 text-xs">
                            <CheckCircle2 size={13} /> Active
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-red-400 text-xs">
                            <XCircle size={13} /> Inactive
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEdit(admin)}
                            className="p-2 rounded-lg hover:bg-white/10 text-slate-300 hover:text-cyan-300 transition-colors"
                            title="Edit"
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            onClick={() => handleDelete(admin._id)}
                            className="p-2 rounded-lg hover:bg-white/10 text-slate-300 hover:text-red-400 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {admins.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-12 text-slate-500">
                        No admins found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ── Modal ─────────────────────────────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-[#0f172a] border border-white/15 rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
              <h2 className="text-lg font-semibold text-slate-100">
                {editId ? "Edit Admin" : "Create Admin"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-lg hover:bg-white/10 text-slate-400"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 text-slate-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                />
              </div>

              {!editId && (
                <>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Email</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 text-slate-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Password</label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 text-slate-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                    />
                  </div>
                </>
              )}

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Role</label>
                <select
                  value={form.role}
                  onChange={(e) =>
                    setForm({ ...form, role: e.target.value as "super-admin" | "manager", permissions: [] })
                  }
                  className="w-full bg-[#0b1117] border border-white/10 text-slate-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                >
                  <option value="manager">Manager</option>
                  <option value="super-admin">Super Admin</option>
                </select>
              </div>

              {form.role === "manager" && (
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Permissions
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {ALL_PERMISSIONS.map((p) => (
                      <label
                        key={p.key}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl border cursor-pointer transition-colors text-sm ${
                          form.permissions.includes(p.key)
                            ? "border-cyan-500/50 bg-cyan-500/10 text-cyan-200"
                            : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                        }`}
                      >
                        <input
                          type="checkbox"
                          className="hidden"
                          checked={form.permissions.includes(p.key)}
                          onChange={() => togglePermission(p.key)}
                        />
                        <span
                          className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${
                            form.permissions.includes(p.key)
                              ? "bg-cyan-500 border-cyan-500"
                              : "border-slate-600"
                          }`}
                        >
                          {form.permissions.includes(p.key) && (
                            <CheckCircle2 size={10} className="text-[#071024]" />
                          )}
                        </span>
                        {p.label}
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Status</label>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, isActive: !form.isActive })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    form.isActive ? "bg-emerald-500" : "bg-slate-600"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      form.isActive ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
                <span className="text-sm text-slate-300">{form.isActive ? "Active" : "Inactive"}</span>
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
                  {editId ? "Save Changes" : "Create Admin"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
