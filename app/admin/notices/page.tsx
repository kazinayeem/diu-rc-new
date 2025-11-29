'use client';

import React, { useState, useEffect } from 'react';
import DataTable from '@/components/admin/DataTable';
import { Button } from '@/components/ui/Button';
import { Plus } from 'lucide-react';

export default function NoticesPage() {
  const [notices, setNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/notices?limit=50');
      const data = await res.json();
      if (data.success) {
        setNotices(data.data);
      }
    } catch (error) {
      console.error('Error fetching notices:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (notice: any) => {
    if (!confirm(`Are you sure you want to delete "${notice.title}"?`)) return;

    try {
      const res = await fetch(`/api/notices/${notice._id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchNotices();
      }
    } catch (error) {
      console.error('Error deleting notice:', error);
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
    { key: 'createdAt', label: 'Created', render: (value: string) => new Date(value).toLocaleDateString() },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-dark-900 mb-2">Notices</h1>
          <p className="text-dark-600">Manage club notices</p>
        </div>
        <Button onClick={() => alert('Notice form coming soon!')}>
          <Plus size={20} className="mr-2" />
          Add Notice
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-dark-600">Loading...</p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={notices}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}

