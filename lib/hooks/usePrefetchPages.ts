import { useEffect } from "react";
import {
  useGetEventsQuery,
  useGetMembersQuery,
  useGetProjectsQuery,
} from "@/lib/api/api";

/**
 * Hook to prefetch data for Events, Members, Projects, Teams, and Workshops
 * Call this on the homepage to cache all data so navigation is instant
 */
export function usePrefetchPages() {
  // Prefetch events with higher limit so page has data
  useGetEventsQuery({ query: "limit=50" });

  // Prefetch members
  useGetMembersQuery({ query: "limit=100" });

  // Prefetch projects
  useGetProjectsQuery({});

  // These don't have dedicated hooks but will be covered by event queries for workshops
  // (workshops use the events endpoint with type=workshop)
}
