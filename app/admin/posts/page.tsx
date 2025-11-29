'use client';

import React, { useState, useEffect } from 'react';
import DataTable from '@/components/admin/DataTable';
import { Button } from '@/components/ui/Button';
import { Plus } from 'lucide-react';

export default function PostsPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/posts?limit=50');
      const data = await res.json();
      if (data.success) {
        setPosts(data.data);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (post: any) => {
    if (!confirm(`Are you sure you want to delete "${post.title}"?`)) return;

    try {
      const res = await fetch(`/api/posts/${post._id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchPosts();
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const columns = [
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
      key: 'status',
      label: 'Status',
      render: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
          value === 'published' ? 'bg-green-100 text-green-800' :
          value === 'draft' ? 'bg-yellow-100 text-yellow-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {value}
        </span>
      ),
    },
    { key: 'views', label: 'Views' },
    { key: 'createdAt', label: 'Created', render: (value: string) => new Date(value).toLocaleDateString() },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-dark-900 mb-2">Posts</h1>
          <p className="text-dark-600">Manage blog posts and research articles</p>
        </div>
        <Button onClick={() => alert('Post form coming soon!')}>
          <Plus size={20} className="mr-2" />
          Add Post
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-dark-600">Loading...</p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={posts}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}

