"use client";

import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";


import MemberCard from "@/components/public/MemberCard";

import { useGetMembersQuery } from "@/lib/api/api";

export default function TeamPage() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [selected, setSelected] = useState<any>(null);
  const [search, setSearch] = useState("");

  const ITEMS = 12;
  const [page, setPage] = useState(1);

  const { data, isFetching } = useGetMembersQuery({ query: "limit=100" });

  useEffect(() => {
    setLoading(isFetching);
    if (data?.success) setMembers(data.data || []);
  }, [data, isFetching]);

  
  const filtered = useMemo(
    () =>
      members.filter((m) =>
        (m?.name || "").toLowerCase().includes(search.toLowerCase())
      ),
    [search, members]
  );

  const totalPages = Math.ceil(filtered.length / ITEMS);
  const paginated = filtered.slice((page - 1) * ITEMS, page * ITEMS);

  
  const team = {
    president: paginated.filter((m) => m.role === "president"),
    vice: paginated.filter((m) => m.role === "vice"),
    executive: paginated.filter((m) => m.role === "executive"),
    general: paginated.filter((m) => m.role === "general"),
  };

  
  const Skeleton = () => (
    <div className="animate-pulse bg-white/10 rounded-xl h-56 w-full" />
  );

  
  const Section = ({ title, list }: any) =>
    (loading || list.length > 0) && (
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <h2 className="text-3xl font-bold text-black dark:text-white mb-6">{title}</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {loading &&
            Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} />)}

          {!loading &&
            list.map((member: any) => (
              <div key={member._id} onClick={() => setSelected(member)}>
                <MemberCard member={member} />
              </div>
            ))}
        </div>
      </motion.section>
    );

  return (
    <div className="min-h-screen bg-white dark:bg-transparent text-black dark:text-white">
      {/* HERO */}
      <section className="py-20 text-center bg-gray-50 dark:bg-transparent">
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-5xl font-extrabold text-black dark:text-white"
        >
          Our Team
        </motion.h1>

        <p className="text-gray-600 dark:text-gray-300 mt-3">Meet the people behind everything</p>

        {/* SEARCH */}
        <div className="max-w-md mx-auto mt-6">
          <input
            className="w-full px-4 py-3 bg-gray-100 dark:bg-white/10 border border-gray-300 dark:border-white/20 rounded-xl outline-none
                       focus:ring-2 focus:ring-cyan-400 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-300"
            placeholder="Search team members..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </section>

      {/* CONTENT */}
      <main className="max-w-7xl mx-auto px-6 pb-20">
        {/* PRESIDENT */}
        <Section title="President" list={team.president} />

        {/* DEPUTY or VICE PRESIDENT */}
        <Section title="Vice President" list={team.vice} />

        {/* EXECUTIVE TEAM */}
        <Section title="Executive Members" list={team.executive} />

        {/* GENERAL TEAM */}
        <Section title="General Members" list={team.general} />

        {/* EMPTY */}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-20 text-gray-500 dark:text-gray-400">
            No members found.
          </div>
        )}

        {/* PAGINATION */}
        {!loading && filtered.length > 0 && (
          <div className="flex justify-center mt-10 gap-4">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-4 py-2 bg-gray-100 dark:bg-white/10 border border-gray-300 dark:border-white/20 rounded-lg text-black dark:text-white disabled:opacity-40"
            >
              Previous
            </button>

            <span className="text-gray-600 dark:text-white/70 text-lg py-2 px-4">
              Page {page} / {totalPages}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-4 py-2 bg-gray-100 dark:bg-white/10 border border-gray-300 dark:border-white/20 rounded-lg text-black dark:text-white disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </main>

      {/* MODAL */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/30 backdrop-blur-sm"
              onClick={() => setSelected(null)}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 40 }}
              className="relative z-10 max-w-xl w-full bg-[#262f42] 
                   border border-white/20 rounded-3xl shadow-2xl overflow-visible"
            >
              {/* HEADER */}
              <div className="h-32 bg-gradient-to-r from-cyan-500 to-blue-600 relative">
                <button
                  onClick={() => setSelected(null)}
                  className="absolute top-4 right-4 text-white text-3xl"
                >
                  ✕
                </button>
              </div>

              {/* AVATAR FIXED */}
              <div className="w-full flex justify-center">
                <div
                  className="w-36 h-36 rounded-full border-4 border-white/30 
                          overflow-hidden bg-black relative -mt-20 z-20 shadow-xl"
                >
                  {selected?.image ? (
                    <img
                      src={selected.image}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl text-white">
                      {selected?.name?.charAt ? selected.name.charAt(0) : "?"}
                    </div>
                  )}
                </div>
              </div>

              {/* DETAILS */}
              <div className="p-8 text-center space-y-3 relative z-10">
                <h2 className="text-3xl font-bold">{selected?.name || "Member"}</h2>

                <span className="px-4 py-1 bg-white/10 border border-white/20 rounded-full capitalize">
                  {selected?.role || "-"}
                </span>

                <p className="text-white/60">
                  {selected?.department || "-"} • Batch {selected?.batch || "-"}
                </p>

                <p className="text-white/50">{selected?.email || "-"}</p>
                <p className="text-white/50">{selected?.phone || "-"}</p>

                <p className="text-white/30 text-sm border-t border-white/10 pt-3">
                  Joined on {selected?.createdAt ? new Date(selected.createdAt).toLocaleDateString() : "-"}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
