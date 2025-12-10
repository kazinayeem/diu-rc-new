"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { X } from "lucide-react";
import { useCreateResearchPaperMutation, useUpdateResearchPaperMutation } from "@/lib/api/api";

/* ----------------------------------------------
   Reusable Styled Inputs (TypeScript Safe)
---------------------------------------------- */
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const InputField = ({ label, ...props }: InputProps) => (
  <div>
    <label className="text-white/80 text-sm">{label}</label>
    <input
      {...props}
      className="w-full mt-1 px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:ring-blue-500 outline-none"
    />
  </div>
);

interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

const TextareaField = ({ label, ...props }: TextAreaProps) => (
  <div>
    <label className="text-white/80 text-sm">{label}</label>
    <textarea
      {...props}
      rows={4}
      className="w-full mt-1 px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:ring-blue-500 outline-none"
    />
  </div>
);

/* ----------------------------------------------
   Props Type
---------------------------------------------- */
interface ResearchPaperFormProps {
  paper?: any;
  onClose: () => void;
}

/* ----------------------------------------------
   Component
---------------------------------------------- */
export default function ResearchPaperForm({
  paper,
  onClose,
}: ResearchPaperFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    authors: "",
    conference: "",
    year: "",
    publisher: "IEEE Xplore",
    doi: "",
    pdfLink: "",
    abstract: "",
    featured: false,
    status: "published",
  });

  /* Load Data When Editing */
  useEffect(() => {
    if (paper) {
      setFormData({
        title: paper.title || "",
        authors: paper.authors?.join(", ") || "",
        conference: paper.conference || "",
        year: paper.year?.toString() || "",
        publisher: paper.publisher || "IEEE Xplore",
        doi: paper.doi || "",
        pdfLink: paper.pdfLink || "",
        abstract: paper.abstract || "",
        featured: paper.featured || false,
        status: paper.status || "published",
      });
    }
  }, [paper]);

  const [createResearchPaper] = useCreateResearchPaperMutation();
  const [updateResearchPaper] = useUpdateResearchPaperMutation();

  /* Submit Form */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...formData,
      authors: formData.authors
        .split(",")
        .map((a) => a.trim())
        .filter(Boolean),
      year: formData.year ? Number(formData.year) : undefined,
    };

    const method = paper ? "PUT" : "POST";
    const url = paper
      ? `/api/research-papers/${paper._id}`
      : "/api/research-papers";

    try {
      if (paper) {
        await updateResearchPaper({ id: paper._id, body: payload }).unwrap();
      } else {
        await createResearchPaper(payload).unwrap();
      }
      onClose();
    } catch {
      
    }
  };

  /* ----------------------------------------------
     UI
  ---------------------------------------------- */
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex justify-center items-center p-4 z-50">
      <Card className="w-full max-w-3xl bg-[#0f192d] text-white border border-white/10 overflow-y-auto max-h-[90vh]">
        <CardHeader>
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">
              {paper ? "Edit Research Paper" : "Add Research Paper"}
            </h2>
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white"
            >
              <X size={24} />
            </button>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <InputField
              label="Title *"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />

            <InputField
              label="Authors (comma separated) *"
              value={formData.authors}
              onChange={(e) =>
                setFormData({ ...formData, authors: e.target.value })
              }
            />

            <InputField
              label="Conference *"
              required
              value={formData.conference}
              onChange={(e) =>
                setFormData({ ...formData, conference: e.target.value })
              }
            />

            <InputField
              label="Year"
              type="number"
              value={formData.year}
              onChange={(e) =>
                setFormData({ ...formData, year: e.target.value })
              }
            />

            <InputField
              label="DOI"
              value={formData.doi}
              onChange={(e) =>
                setFormData({ ...formData, doi: e.target.value })
              }
            />

            <InputField
              label="PDF Link"
              value={formData.pdfLink}
              onChange={(e) =>
                setFormData({ ...formData, pdfLink: e.target.value })
              }
            />

            <TextareaField
              label="Abstract"
              value={formData.abstract}
              onChange={(e) =>
                setFormData({ ...formData, abstract: e.target.value })
              }
            />

            <div className="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) =>
                  setFormData({ ...formData, featured: e.target.checked })
                }
              />
              <span>Featured Paper</span>
            </div>

            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              className="bg-white/5 border border-white/20 text-white px-4 py-2 rounded-lg"
            >
              <option className="text-black" value="published">
                Published
              </option>
              <option className="text-black" value="under-review">
                Under Review
              </option>
              <option className="text-black" value="draft">
                Draft
              </option>
            </select>

            <div className="flex justify-end gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="text-white border-white/30"
              >
                Cancel
              </Button>

              <Button type="submit" className="bg-blue-600 hover:bg-blue-500">
                {paper ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
