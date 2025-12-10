"use client";

import { usePrefetchPages } from "@/lib/hooks/usePrefetchPages";

/**
 * Client component that prefetches homepage data when rendered
 * This runs on the homepage to cache events, members, projects for instant navigation
 */
export default function DataPrefetcher() {
  usePrefetchPages();
  return null; // This component renders nothing; it only prefetches data
}
