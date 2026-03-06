'use client';

import React, { useState, useEffect } from 'react';
import DataTable from '@/components/admin/DataTable';
import { Button } from '@/components/ui/Button';
import { Plus, X, Megaphone } from 'lucide-react';
import {
  useGetNoticesQuery,
  useCreateNoticeMutation,
  useUpdateNoticeMutation,
  useDeleteNoticeMutation,
} from '@/lib/api/api';

const EMPTY_FORM = {
  title: '',
  content: '',
  type: 'general' as 'general' | 'important' | 'urgent',
  priority: 0,
  isActive: true,
  isMarquee: false,
  expiresAt: '',
};

export default function NoticesPage() {
  const [notices, setNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingNotice, setEditingNotice] = useState<any | null>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const { data, isFetching } = useGetNoticesQuery({ query: 'limit=100' });
  const [createNotice] = useCreateNoticeMutation();
  const [updateNotice] = useUpdateNoticeMutation();
  const [deleteNotice] = useDeleteNoticeMutation();

  useEffect(() => {
    setLoading(isFetching);
    if (data?.success) setNotices(data.data);
    else setNotices([]);
  }, [data, isFetching]);

  const openCreate = () => {
    setEditingNotice(null);
    setForm({ ...EMPTY_FORM });
    setError('');
    setShowModal(true);
  };

  const openEdit = (notice: any) => {
    setEditingNotice(notice);
    setForm({
      title: notice.title ?? '',
      content: notice.content ?? '',
      type: notice.type ?? 'general',
      priority: notice.priority ?? 0,
      isActive: notice.isActive ?? true,
      isMarquee: notice.isMarquee ?? false,
      expiresAt: notice.expiresAt ? notice.expiresAt.slice(0, 10) : '',
    });
    setError('');
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.content.trim()) {
      setError('Title and Content are required.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const payload = { ...form, expiresAt: form.expiresAt || undefined };
      if (editingNotice) {
        const res = await updateNotice({ id: editingNotice._id, body: payload }).unwrap();
        if (!res.success) throw new Error(res.error ?? 'Failed to update');
      } else {
        const res = await createNotice(payload).unwrap();
        if (!res.success) throw new Error(res.error ?? 'Failed to create');
      }
      setShowModal(false);
    } catch (err: any) {
      setError(err?.data?.error ?? err?.message ?? 'Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (notice: any) => {
    if (!confirm(`Delete notice "${notice.title}"?`)) return;
    try {
      await deleteNotice(notice._id).unwrap();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSetMarquee = async (notice: any) => {
    try {
      await updateNotice({ id: notice._id, body: { isMarquee: !notice.isMarquee } }).unwrap();
    } catch (err) {
      console.error(err);
    }
  };

  const columns = [
    { key: 'title', label: 'Title' },
    {
      key: 'type',
      label: 'Type',
      render: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
          value === 'urgent' ? 'bg-red-100 text-red-800' :
          value === 'important' ? 'bg-orange-100 text-orange-800' :
          'bg-blue-100 text-blue-800'
        }`}>
          {value}
        </span>
      ),
    },
    {
      key: 'isActive',
      label: 'Status',
      render: (value: boolean) => (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${value ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
          {value ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      key: 'isMarquee',
      label: 'Ticker',
      render: (value: boolean, row: any) => (
        <button
          onClick={() => handleSetMarquee(row)}
          title={value ? 'Remove from ticker' : 'Set as ticker'}
          className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold transition-colors ${
            value ? 'bg-cyan-500 text-white' : 'bg-gray-100 text-gray-500 hover:bg-cyan-100 hover:text-cyan-700'
          }`}
        >
          <Megaphone size={12} />
          {value ? 'Live' : 'Off'}
        </button>
      ),
    },
    {
      key: 'createdAt',
      label: 'Created',
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Notices</h1>
          <p className="text-gray-400">
            Manage club notices. Toggle the <Megaphone size={14} className="inline mb-0.5" /> ticker to show a notice in the site-wide marquee bar.
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus size={20} className="mr-2" />
          Add Notice
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading…</div>
      ) : (
        <DataTable
          columns={columns}
          data={notices}
          onEdit={openEdit}
          onDelete={handleDelete}
        />
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#0f1f3d] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-xl font-bold text-white">
                {editingNotice ? 'Edit Notice' : 'Create Notice'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              {error && (
                <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              <div>
                <label className="block text-sm text-gray-300 mb-1">Title *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Notice title"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-1">Content *</label>
                <textarea
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  rows={4}
                  placeholder="Notice content…"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Type</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value as any })}
                    className="w-full bg-[#0B1F3A] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="general">General</option>
                    <option value="important">Important</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-1">Priority (0–10)</label>
                  <input
                    type="number"
                    min={0}
                    max={10}
                    value={form.priority}
                    onChange={(e) => setForm({ ...form, priority: Number(e.target.value) })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-1">Expires At (optional)</label>
                <input
                  type="date"
                  value={form.expiresAt}
                  onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div className="flex items-center gap-6 pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <div
                    onClick={() => setForm({ ...form, isActive: !form.isActive })}
                    className={`relative w-10 h-6 rounded-full transition-colors cursor-pointer ${form.isActive ? 'bg-green-500' : 'bg-gray-600'}`}
                  >
                    <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.isActive ? 'translate-x-5' : 'translate-x-1'}`} />
                  </div>
                  <span className="text-sm text-gray-300">Active</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <div
                    onClick={() => setForm({ ...form, isMarquee: !form.isMarquee })}
                    className={`relative w-10 h-6 rounded-full transition-colors cursor-pointer ${form.isMarquee ? 'bg-cyan-500' : 'bg-gray-600'}`}
                  >
                    <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.isMarquee ? 'translate-x-5' : 'translate-x-1'}`} />
                  </div>
                  <span className="text-sm text-gray-300 flex items-center gap-1">
                    <Megaphone size={13} /> Show in Ticker
                  </span>
                </label>
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 px-6 pb-6">
              <Button onClick={handleSave} disabled={saving} className="flex-1">
                {saving ? 'Saving…' : editingNotice ? 'Save Changes' : 'Create Notice'}
              </Button>
              <Button
                onClick={() => setShowModal(false)}
                className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

