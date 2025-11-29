'use client';

import React, { useState, useEffect } from 'react';
import DataTable from '@/components/admin/DataTable';
import { Button } from '@/components/ui/Button';
import { Plus } from 'lucide-react';
import EventForm from '@/components/admin/forms/EventForm'; // Reusing EventForm for now - can create SeminarForm later

export default function SeminarsPage() {
  const [seminars, setSeminars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSeminar, setEditingSeminar] = useState<any>(null);

  useEffect(() => {
    fetchSeminars();
  }, []);

  const fetchSeminars = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/seminars?limit=50');
      const data = await res.json();
      if (data.success) {
        setSeminars(data.data);
      }
    } catch (error) {
      console.error('Error fetching seminars:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (seminar: any) => {
    setEditingSeminar(seminar);
    setShowForm(true);
  };

  const handleDelete = async (seminar: any) => {
    if (!confirm(`Are you sure you want to delete "${seminar.title}"?`)) return;

    try {
      const res = await fetch(`/api/seminars/${seminar._id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchSeminars();
      }
    } catch (error) {
      console.error('Error deleting seminar:', error);
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingSeminar(null);
    fetchSeminars();
  };

  const columns = [
    { key: 'title', label: 'Title' },
    { key: 'speaker', label: 'Speaker' },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
          value === 'upcoming' ? 'bg-green-100 text-green-800' :
          value === 'ongoing' ? 'bg-blue-100 text-blue-800' :
          value === 'completed' ? 'bg-gray-100 text-gray-800' :
          'bg-red-100 text-red-800'
        }`}>
          {value}
        </span>
      ),
    },
    { key: 'seminarDate', label: 'Date', render: (value: string) => new Date(value).toLocaleDateString() },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-dark-900 mb-2">Seminars</h1>
          <p className="text-dark-600">Manage club seminars</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus size={20} className="mr-2" />
          Add Seminar
        </Button>
      </div>

      {showForm && (
        <EventForm event={editingSeminar} onClose={handleFormClose} />
      )}

      {loading ? (
        <div className="text-center py-12">
          <p className="text-dark-600">Loading...</p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={seminars}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}

