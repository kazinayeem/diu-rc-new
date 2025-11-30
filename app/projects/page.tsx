"use client";

import React from "react";
import { useGetProjectsQuery } from "@/lib/api/api";

export default function ProjectsPage() {
  const { data, isLoading } = useGetProjectsQuery({});
  const projects = data?.data || [];

  return (
    <div className="min-h-screen px-6 py-16 bg-transparent text-white">
      <div className="text-center mb-14">
        <h1 className="text-4xl font-bold tracking-tight">Our Projects</h1>
        <p className="text-gray-400 mt-2 text-sm md:text-base">
          Innovative robotics & AI projects developed by DIU Robotics Club
          members
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto">
        {projects.map((p: any) => (
          <div
            key={p._id}
            className="group bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl 
                       hover:shadow-blue-500/20 hover:border-blue-500/30 transition-all duration-300"
          >
            {/* Image */}
            {p.image && (
              <div className="overflow-hidden rounded-xl mb-4">
                <img
                  src={p.image}
                  alt={p.title}
                  className="w-full h-52 object-cover rounded-xl transform transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            )}

            {/* Title */}
            <h2 className="text-xl font-semibold text-white">{p.title}</h2>

            {/* Description */}
            <p className="text-gray-300 mt-2 leading-relaxed">
              {p.shortDescription}
            </p>

            {/* Status */}
            <p className="mt-4 text-sm">
              <span className="font-semibold text-gray-200">Status:</span>{" "}
              <span className="text-blue-400">{p.status}</span>
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap gap-3 mt-5">
              {p.github && (
                <a
                  href={p.github}
                  target="_blank"
                  className="px-4 py-2 rounded-lg text-sm bg-blue-700 hover:bg-blue-600 transition shadow-md shadow-blue-700/20"
                >
                  GitHub
                </a>
              )}
              {p.demo && (
                <a
                  href={p.demo}
                  target="_blank"
                  className="px-4 py-2 rounded-lg text-sm bg-green-700 hover:bg-green-600 transition shadow-md shadow-green-700/20"
                >
                  Live Demo
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
