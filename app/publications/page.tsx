"use client";

import React from "react";
import { useGetResearchPapersQuery } from "@/lib/api/api";

export default function ResearchPublicationsPage() {
  const { data, isLoading } = useGetResearchPapersQuery({});
  const papers = data?.data || [];

  const SkeletonCard = () => (
    <div className="animate-pulse bg-white/10 dark:bg-gray-800 rounded-2xl h-64 w-full" />
  );

  return (
    <div className="min-h-screen py-16 px-4 md:px-8 bg-white dark:bg-transparent">
      <div className="max-w-6xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold text-black dark:text-white">Research Publications</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Showcasing the research contributions and publications by DIU Robotics
          Club members
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {isLoading && Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
        {!isLoading && papers.map((paper: any, index: number) => (
          <div
            key={index}
            className="bg-gray-50 dark:bg-[#111827] shadow-xl shadow-black/10 dark:shadow-black/30 rounded-2xl p-6 border border-gray-200 dark:border-[#1f2937] hover:shadow-2xl hover:shadow-black/20 dark:hover:shadow-black/50 transition"
          >
            {/* Title */}
            <h2 className="text-xl font-semibold text-black dark:text-white leading-snug">
              {paper.title}
            </h2>

            {/* Authors */}
            <p className="mt-3 text-gray-700 dark:text-gray-300 text-sm">
              <span className="font-semibold text-gray-800 dark:text-gray-200">Authors:</span>{" "}
              {paper.authors?.map((a: string, i: number) => {
                const isHighlighted =
                  a.includes("Hosen") ||
                  a.includes("J. Hosen") ||
                  a.includes("Jabed");

                return (
                  <span
                    key={i}
                    className={
                      isHighlighted
                        ? "font-bold text-blue-600 dark:text-blue-400"
                        : "text-gray-700 dark:text-gray-300"
                    }
                  >
                    {a}
                    {i < (paper.authors?.length || 0) - 1 ? ", " : ""}
                  </span>
                );
              })}
            </p>

            {/* Conference / Journal */}
            {paper.conference && (
              <p className="mt-3 text-gray-700 dark:text-gray-300 text-sm">
                <span className="font-semibold text-gray-800 dark:text-gray-200">
                  Conference:{" "}
                </span>
                {paper.conference}
              </p>
            )}

            {paper.journal && (
              <p className="mt-3 text-gray-700 dark:text-gray-300 text-sm">
                <span className="font-semibold text-gray-800 dark:text-gray-200">Journal: </span>
                {paper.journal}
              </p>
            )}

            {paper.book && (
              <p className="mt-3 text-gray-700 dark:text-gray-300 text-sm">
                <span className="font-semibold text-gray-800 dark:text-gray-200">
                  Book Series:{" "}
                </span>
                {paper.book}
              </p>
            )}

            {/* External Link */}
            {(paper.pdfLink || paper.doi) && (
              <a
                href={paper.pdfLink || paper.doi}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 3h7v7m0 0l-9 9m9-9H10"
                  />
                </svg>
                {paper.publisher || "View Paper"}
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
