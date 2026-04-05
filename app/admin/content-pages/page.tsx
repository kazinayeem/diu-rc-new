"use client";

import React, { useState } from "react";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import ContentPageEditor from "@/components/admin/ContentPageEditor";

export default function ContentPagesAdminPage() {
  const [activeTab, setActiveTab] = useState<"terms" | "privacy" | "refunds">("terms");

  const pages = [
    { slug: "terms", title: "Terms & Conditions" },
    { slug: "privacy", title: "Privacy Policy" },
    { slug: "refunds", title: "Refund Policy" },
  ] as const;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Button variant="outline" size="sm">
                <ChevronLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Content Pages
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Manage legal and policy pages
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-8 overflow-x-auto">
            {pages.map((page) => (
              <button
                key={page.slug}
                onClick={() => setActiveTab(page.slug)}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                  activeTab === page.slug
                    ? "border-cyan-600 text-cyan-600 dark:text-cyan-400"
                    : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300"
                }`}
              >
                {page.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {pages.map((page) => (
          <div key={page.slug} className={activeTab === page.slug ? "block" : "hidden"}>
            <ContentPageEditor slug={page.slug} title={page.title} />
          </div>
        ))}
      </div>
    </div>
  );
}
