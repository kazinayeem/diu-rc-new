"use client";

import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MemberCard from "@/components/public/MemberCard";
import { useGetMembersQuery, useGetMemberRegistrationsQuery } from "@/lib/api/api";
import { Search } from "lucide-react";

export default function TeamPage() {
  // ── Team members (roles: president/vice/executive/general) ──
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [teamLoading, setTeamLoading] = useState(true);

  // ── Registered members ──
  const [allMembers, setAllMembers] = useState<any[]>([]);
  const [regLoading, setRegLoading] = useState(true);

  const [selected, setSelected] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 20;

  const { data: teamData, isFetching: teamFetching } = useGetMembersQuery({ query: "limit=10000" });
  const { data: regData, isFetching: regFetching } = useGetMemberRegistrationsQuery({ query: "limit=10000&status=approved" });

  useEffect(() => {
    setTeamLoading(teamFetching);
    if (teamData?.success) setTeamMembers(teamData.data || []);
  }, [teamData, teamFetching]);

  useEffect(() => {
    setRegLoading(regFetching);
    if (regData?.success) setAllMembers(regData.data || []);
  }, [regData, regFetching]);

  // Position hierarchy for sorting
  const positionOrder: Record<string, number> = {
    "advisor": 1,
    "convener": 2,
    "president": 3,
    "vice-president": 4,
    "vice president": 4,
    "general secretary": 5,
    "treasurer": 6,
    "joint secretary": 7,
    "assistant general secretary": 8,
    "organizing secretary": 9,
    "assistant organizing secretary": 10,
    "training secretary": 11,
    "training secretory": 11,
    "assistant training secretary": 12,
    "media and press secretary": 13,
    "senior assistant media and press secretary": 14,
    "assistant media and press secretary": 15,
    "public relation and communication secretary": 16,
    "assistant public relation and communication secretary": 17,
    "executive": 18,
    "deputy": 19,
    "general": 20,
    "member": 21,
  };

  // Sort function by position hierarchy
  const sortByPosition = (a: any, b: any) => {
    const aOrder = positionOrder[a.role] || 999;
    const bOrder = positionOrder[b.role] || 999;
    return aOrder - bOrder;
  };

  // ── Team sections (sorted by position hierarchy) ──
  const team = {
    president: teamMembers.filter((m) => m.role === "president").sort(sortByPosition),
    deputy:    teamMembers.filter((m) => m.role === "deputy").sort(sortByPosition),
    executive: teamMembers.filter((m) => m.role === "executive").sort(sortByPosition),
    general:   teamMembers.filter((m) => m.role === "general").sort(sortByPosition),
  };

  // ── Registered members: search + pagination ──
  const filteredReg = useMemo(
    () => allMembers.filter((m) => (m?.name || "").toLowerCase().includes(search.toLowerCase())),
    [allMembers, search]
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredReg.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedMembers = filteredReg.slice(startIndex, endIndex);

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const Skeleton = () => <div className="animate-pulse bg-white/10 rounded-xl h-56 w-full" />;

  const TeamSection = ({ title, list }: { title: string; list: any[] }) => {
    if (!(teamLoading || list.length > 0)) return null;
    return (
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-14"
      >
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <span className="w-1 h-6 bg-cyan-400 rounded-full inline-block" />
          {title}
        </h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {teamLoading
            ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} />)
            : list.map((member) => (
                <div key={member._id} onClick={() => setSelected(member)} className="cursor-pointer h-full">
                  <MemberCard member={member} />
                </div>
              ))}
        </div>
      </motion.section>
    );
  };

  return (
    <div className="min-h-screen bg-white dark:bg-transparent text-black dark:text-white">
      {/* ── HERO ── */}
      <section className="py-20 text-center bg-gray-50 dark:bg-transparent">
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-5xl font-extrabold text-black dark:text-white"
        >
          Team &amp; Members
        </motion.h1>
        <p className="text-gray-600 dark:text-gray-300 mt-3">
          Meet the people behind DIU Robotics Club
        </p>
      </section>

      <main className="max-w-7xl mx-auto px-6 pb-24">
        {/* ── TEAM SECTIONS (Sorted by Position) ── */}
        {teamMembers.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-14"
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-cyan-400 rounded-full inline-block" />
              Leadership Team
            </h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {teamLoading
                ? Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} />)
                : [...teamMembers].sort(sortByPosition).map((member) => (
                    <div key={member._id} onClick={() => setSelected(member)} className="cursor-pointer h-full">
                      <MemberCard member={member} />
                    </div>
                  ))}
            </div>
          </motion.section>
        )}

        {!teamLoading && teamMembers.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400 py-10">No team members found.</p>
        )}

        {/* ── DIVIDER ── */}
        <div className="relative my-16">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-[#071024] px-6 text-gray-400 text-sm font-semibold uppercase tracking-widest">
              All Members
            </span>
          </div>
        </div>

        {/* ── ALL REGISTERED MEMBERS ── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <span className="w-1 h-6 bg-purple-400 rounded-full inline-block" />
                Registered Members
              </h2>
              {!regLoading && (
                <p className="text-white/60 text-sm mt-1">
                  Showing {filteredReg.length > 0 ? startIndex + 1 : 0}-{Math.min(endIndex, filteredReg.length)} of {filteredReg.length}
                  <span className="ml-2 text-cyan-400">
                    (Total: {allMembers.length})
                  </span>
                  {search && filteredReg.length !== allMembers.length && (
                    <span className="ml-2 text-yellow-400">
                      - Filtered: {filteredReg.length}
                    </span>
                  )}
                </p>
              )}
            </div>
          </div>

          {/* Search Section */}
          <div className="mb-8 flex flex-col sm:flex-row gap-3">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search members by name…"
              className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
            />
            <button
              onClick={() => setSearch(search)}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <Search size={18} />
              Search
            </button>
          </div>

          {/* Members Grid */}
          <motion.div 
            layout
            className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
          >
            {regLoading
              ? Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} />)
              : paginatedMembers.map((m, idx) => (
                  <motion.div
                    key={m._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.02 }}
                    onClick={() => setSelected(m)}
                    className="cursor-pointer h-full"
                  >
                    <MemberCard member={m} />
                  </motion.div>
                ))}
          </motion.div>

          {!regLoading && filteredReg.length === 0 && (
            <p className="text-center py-16 text-gray-500 dark:text-gray-400">No members found matching "{search}".</p>
          )}

          {/* Pagination Controls */}
          {!regLoading && filteredReg.length > 0 && totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center gap-6 mt-12"
            >
              {/* Pagination buttons */}
              <div className="flex justify-center items-center gap-3 flex-wrap">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(1)}
                  className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-colors font-medium"
                >
                  First
                </button>

                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
                >
                  ← Previous
                </button>

                <div className="flex gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 2)
                    .reduce<(number | "…")[]>((acc, p, idx, arr) => {
                      if (idx > 0 && (p as number) - (arr[idx - 1] as number) > 1) acc.push("…");
                      acc.push(p);
                      return acc;
                    }, [])
                    .map((p, idx) =>
                      p === "…" ? (
                        <span key={`dots-${idx}`} className="px-2 py-2 text-gray-500">…</span>
                      ) : (
                        <button
                          key={p}
                          onClick={() => setCurrentPage(p as number)}
                          className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
                            currentPage === p
                              ? "bg-purple-500 text-white shadow-lg shadow-purple-500/50"
                              : "bg-white/5 border border-white/10 text-white hover:bg-white/10"
                          }`}
                        >
                          {p}
                        </button>
                      )
                    )}
                </div>

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
                >
                  Next →
                </button>

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(totalPages)}
                  className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-colors font-medium"
                >
                  Last
                </button>
              </div>

              {/* Page info */}
              <p className="text-gray-400 text-sm">
                Page {currentPage} of {totalPages}
              </p>
            </motion.div>
          )}
        </motion.section>
      </main>

      {/* ── SHARED MODAL ── */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-black/70 backdrop-blur-md"
              onClick={() => setSelected(null)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 220, damping: 18 } }}
              exit={{ opacity: 0, scale: 0.85, y: 40 }}
              className="relative z-10 w-full max-w-md bg-[#111c35] border border-white/15 rounded-3xl shadow-2xl overflow-hidden"
            >
              {/* Gradient header */}
              <div className="h-28 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 relative">
                <button
                  onClick={() => setSelected(null)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/30 flex items-center justify-center text-white hover:bg-black/50 transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Avatar */}
              <div className="flex justify-center">
                <div className="w-28 h-28 rounded-full border-4 border-[#111c35] overflow-hidden bg-gradient-to-br from-cyan-500 to-purple-600 -mt-14 z-10 shadow-xl relative">
                  {selected?.image ? (
                    <img src={selected.image} alt={selected.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-white">
                      {(selected?.name || "?").charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
              </div>

              {/* Info */}
              <div className="px-8 pb-8 pt-4 text-center space-y-2">
                <h2 className="text-2xl font-bold text-white">{selected?.name || "Member"}</h2>

                {selected?.role && (
                  <span className="inline-block px-4 py-1 bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 rounded-full text-sm capitalize">
                    {selected.role}
                  </span>
                )}

                {selected?.position && (
                  <p className="text-gray-300 text-sm">{selected.position}</p>
                )}

                <div className="pt-3 space-y-1 text-sm text-gray-300">
                  {selected?.department && (
                    <p><span className="text-gray-500">Department:</span> {selected.department}</p>
                  )}
                  {selected?.batch && (
                    <p><span className="text-gray-500">Batch:</span> {selected.batch}</p>
                  )}
                  {selected?.currentYear && (
                    <p><span className="text-gray-500">Year:</span> {selected.currentYear}</p>
                  )}
                  {selected?.studentId && (
                    <p><span className="text-gray-500">Student ID:</span> {selected.studentId}</p>
                  )}
                  {selected?.email && (
                    <p><span className="text-gray-500">Email:</span> {selected.email}</p>
                  )}
                  {selected?.phone && (
                    <p><span className="text-gray-500">Phone:</span> {selected.phone}</p>
                  )}
                  {selected?.skills && selected.skills.length > 0 && (
                    <div className="pt-2 flex flex-wrap justify-center gap-2">
                      {selected.skills.slice(0, 6).map((s: string) => (
                        <span key={s} className="px-2 py-0.5 bg-white/10 rounded-full text-xs text-white/70">{s}</span>
                      ))}
                    </div>
                  )}
                </div>

                <p className="text-gray-600 text-xs pt-3 border-t border-white/10">
                  Joined {selected?.createdAt ? new Date(selected.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "-"}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
