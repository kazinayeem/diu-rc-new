"use client";

import React, { useState, useEffect, useMemo } from "react";
import MemberCard from "@/components/public/MemberCard";
import { motion, AnimatePresence } from "framer-motion";

async function fetchMembers() {
 
  const res = await fetch(`/api/member-registrations?limit=50`);

  const data = await res.json();
  return data.data || [];
}

export default function MembersPage() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [selected, setSelected] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const ITEMS_PER_PAGE = 12;

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await fetchMembers();
      setMembers(data);
      setLoading(false);
    }
    load();
  }, []);

  // Filter search
  const filteredMembers = useMemo(() => {
    return members.filter((m) =>
      m.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, members]);

  const totalPages = Math.ceil(filteredMembers.length / ITEMS_PER_PAGE);
  const paginated = filteredMembers.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const Skeleton = () => (
    <div className="animate-pulse bg-white/10 rounded-xl h-56 w-full"></div>
  );

  return (
    <div className="min-h-screen flex flex-col text-white">
      {/* HERO */}
      <section className="py-16 text-center">
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-5xl font-extrabold"
        >
          Our Members
        </motion.h1>

        <p className="text-gray-300 mt-4">
          Meet the innovators behind DIU Robotics Club
        </p>

        {/* Search */}
        <div className="max-w-md mx-auto mt-8">
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search members by name..."
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white outline-none"
          />
        </div>
      </section>

      {/* MEMBERS GRID */}
      <main className="flex-grow m-auto">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <h2 className="text-3xl font-bold mb-6">All Members</h2>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {loading &&
              Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} />)}

            {!loading &&
              paginated.map((m) => (
                <div key={m._id} onClick={() => setSelected(m)}>
                  <MemberCard member={m} />
                </div>
              ))}
          </div>

          {!loading && filteredMembers.length === 0 && (
            <div className="text-center py-20 text-gray-400 text-lg">
              No members found
            </div>
          )}

          {/* Pagination */}
          {!loading && filteredMembers.length > 0 && (
            <div className="flex items-center justify-center mt-12 gap-4">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg"
              >
                Previous
              </button>

              <span className="text-gray-200">
                Page {page} / {totalPages}
              </span>

              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </main>

      {/* MODAL */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Background */}
            <motion.div
              className="absolute inset-0 bg-black/80 backdrop-blur-xl"
              onClick={() => setSelected(null)}
            />

            {/* POPUP */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 30 }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
                transition: { type: "spring", stiffness: 200, damping: 14 },
              }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="relative bg-white/10 border border-white/20 rounded-2xl max-w-xl w-full shadow-2xl p-8 text-center"
            >
              <button
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 text-2xl"
              >
                ✕
              </button>

              {/* Avatar */}
              <div className="w-28 h-28 mx-auto rounded-full overflow-hidden bg-white/20 mb-4">
                {selected.image ? (
                  <img
                    src={selected.image}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-4xl">
                    {selected.name.charAt(0)}
                  </div>
                )}
              </div>

              <h2 className="text-3xl font-bold">{selected.name}</h2>
              <p className="text-gray-300 mt-2">{selected.department}</p>
              <p className="text-gray-300">{selected.email}</p>
              <p className="text-gray-300">{selected.phone}</p>

              <div className="mt-6 text-sm text-gray-400">
                Joined: {new Date(selected.createdAt).toLocaleDateString()}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
