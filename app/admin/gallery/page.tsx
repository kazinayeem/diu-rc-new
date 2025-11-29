'use client';

import React, { useState, useEffect } from 'react';
import DataTable from '@/components/admin/DataTable';
import { Button } from '@/components/ui/Button';
import { Plus } from 'lucide-react';
import Image from 'next/image';

export default function GalleryPage() {
  const [gallery, setGallery] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/gallery?limit=50');
      const data = await res.json();
      if (data.success) {
        setGallery(data.data);
      }
    } catch (error) {
      console.error('Error fetching gallery:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (item: any) => {
    if (!confirm(`Are you sure you want to delete "${item.title}"?`)) return;

    try {
      const res = await fetch(`/api/gallery/${item._id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchGallery();
      }
    } catch (error) {
      console.error('Error deleting gallery item:', error);
    }
  };

  const columns = [
    {
      key: 'image',
      label: 'Image',
      render: (value: string, row: any) => (
        <div className="w-16 h-16 relative">
          <Image
            src={value || '/placeholder.jpg'}
            alt={row.title}
            fill
            className="object-cover rounded"
          />
        </div>
      ),
    },
    { key: 'title', label: 'Title' },
    {
      key: 'category',
      label: 'Category',
      render: (value: string) => (
        <span className="px-2 py-1 bg-primary-100 text-primary-800 rounded-full text-xs font-semibold capitalize">
          {value}
        </span>
      ),
    },
    {
      key: 'featured',
      label: 'Featured',
      render: (value: boolean) => (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${value ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
          {value ? 'Yes' : 'No'}
        </span>
      ),
    },
    { key: 'createdAt', label: 'Uploaded', render: (value: string) => new Date(value).toLocaleDateString() },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-dark-900 mb-2">Gallery</h1>
          <p className="text-dark-600">Manage gallery images</p>
        </div>
        <Button onClick={() => alert('Gallery upload form coming soon!')}>
          <Plus size={20} className="mr-2" />
          Upload Image
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-dark-600">Loading...</p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={gallery}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}

