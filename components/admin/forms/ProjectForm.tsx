"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { X } from "lucide-react";

interface ProjectFormProps {
  project?: any;
  onClose: () => void;
}

export default function ProjectForm({ project, onClose }: ProjectFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    shortDescription: "",
    status: "under-development",
    image: "",
    github: "",
    demo: "",
    featured: false,
  });

  useEffect(() => {
    if (project) {
      setFormData({ ...project });
    }
  }, [project]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    const url = project ? `/api/projects/${project._id}` : `/api/projects`;
    const method = project ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    if (data.success) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex justify-center items-center p-4 animate-fadeIn">
      <Card className="w-full max-w-2xl bg-[#0f192d] text-white border border-white/10 rounded-2xl shadow-2xl animate-scaleIn">
        <CardHeader>
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold tracking-tight">
              {project ? "Edit Project" : "Add New Project"}
            </h2>

            <button
              onClick={onClose}
              className="hover:bg-white/10 p-2 rounded-lg transition"
            >
              <X size={22} className="text-gray-300" />
            </button>
          </div>
        </CardHeader>

        <CardContent>
          <form className="space-y-5" onSubmit={submit}>
            {/* Title */}
            <div>
              <label className="text-sm text-gray-300">Title *</label>
              <input
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
                className="w-full p-3 mt-1 bg-white/5 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>

            {/* Description */}
            <div>
              <label className="text-sm text-gray-300">Description *</label>
              <textarea
                value={formData.shortDescription}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    shortDescription: e.target.value,
                  })
                }
                required
                className="w-full p-3 mt-1 bg-white/5 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-600 outline-none"
                rows={4}
              />
            </div>

            {/* Image */}
            <div>
              <label className="text-sm text-gray-300">Image URL</label>
              <input
                value={formData.image}
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.value })
                }
                className="w-full p-3 mt-1 bg-white/5 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>

            {/* Status */}
            <div>
              <label className="text-sm text-gray-300">Status</label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="w-full p-3 mt-1 bg-white/5 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-600 outline-none"
              >
                <option value="under-development">Under Development</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {/* GitHub / Demo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-300">GitHub Link</label>
                <input
                  value={formData.github}
                  onChange={(e) =>
                    setFormData({ ...formData, github: e.target.value })
                  }
                  className="w-full p-3 mt-1 bg-white/5 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-600 outline-none"
                />
              </div>

              <div>
                <label className="text-sm text-gray-300">Demo Link</label>
                <input
                  value={formData.demo}
                  onChange={(e) =>
                    setFormData({ ...formData, demo: e.target.value })
                  }
                  className="w-full p-3 mt-1 bg-white/5 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-600 outline-none"
                />
              </div>
            </div>

            {/* Featured Checkbox */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) =>
                  setFormData({ ...formData, featured: e.target.checked })
                }
                className="w-4 h-4 rounded accent-blue-600"
              />
              <span className="text-gray-300">Featured Project</span>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-4 pt-4">
              <Button
                variant="outline"
                onClick={onClose}
                type="button"
                className="border-white/30 text-white hover:bg-white/10"
              >
                Cancel
              </Button>

              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-500 text-white px-6"
              >
                {project ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
