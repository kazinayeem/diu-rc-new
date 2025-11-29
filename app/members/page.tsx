"use client";

import React, { useState, useEffect } from "react";
import Footer from "@/components/public/Footer";
import MemberCard from "@/components/public/MemberCard";
import { motion, AnimatePresence } from "framer-motion";

async function fetchMembers() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/members?isActive=true&limit=200`, {
    cache: "no-store",
  });

  const data = await res.json();
  return data.data || [];
}

export default function MembersPage() {
  const [members, setMembers] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);

  useEffect(() => {
    fetchMembers().then(setMembers);
  }, []);

  const membersByRole = {
    main: members.filter((m) => m.role === "main"),
    executive: members.filter((m) => m.role === "executive"),
    deputy: members.filter((m) => m.role === "deputy"),
    general: members.filter((m) => m.role === "general"),
  };

  const Section = ({ title, list }: any) =>
    list.length > 0 && (
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <h2 className="text-3xl font-bold text-white mb-6">{title}</h2>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {list.map((member: any) => (
            <div key={member._id} onClick={() => setSelected(member)}>
              <MemberCard member={member} />
            </div>
          ))}
        </div>
      </motion.section>
    );

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-white">
      {/* HERO */}
      <section className="relative overflow-hidden py-20 text-center">
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-5xl font-extrabold relative"
        >
          Our Members
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-gray-300 mt-4 relative"
        >
          Meet the innovators behind DIU Robotics Club
        </motion.p>
      </section>

      {/* MEMBER LIST */}
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <Section title="Main Members" list={membersByRole.main} />
          <Section title="Executive Members" list={membersByRole.executive} />
          <Section title="Deputy Members" list={membersByRole.deputy} />
          <Section title="General Members" list={membersByRole.general} />

          {members.length === 0 && (
            <div className="text-center py-20 text-gray-400 text-lg">
              No active members available yet.
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* MEMBER MODAL */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* BACKDROP */}
            <motion.div
              className="absolute inset-0 bg-black/80 backdrop-blur-xl"
              onClick={() => setSelected(null)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* MODAL CARD */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 60 }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
                transition: { type: "spring", stiffness: 180, damping: 16 },
              }}
              exit={{ opacity: 0, scale: 0.8, y: 40 }}
              className="
          relative z-10 
          w-full max-w-xl 
          bg-white/10 
          backdrop-blur-2xl 
          border border-white/20 
          rounded-3xl 
          shadow-[0_0_40px_rgba(0,0,0,0.4)]
          overflow-hidden
        "
            >
              {/* TOP GRADIENT BANNER */}
              <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600 relative">
                <motion.button
                  onClick={() => setSelected(null)}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute top-4 right-4 text-white/80 hover:text-white text-3xl font-light"
                >
                  ✕
                </motion.button>
              </div>

              {/* AVATAR */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, type: "spring" }}
                className="flex justify-center -mt-16"
              >
                <div
                  className="
            w-36 h-36 rounded-full 
            bg-gradient-to-r from-purple-500 to-indigo-500 p-1
            shadow-2xl
          "
                >
                  <div className="w-full h-full rounded-full overflow-hidden bg-black">
                    {selected.image ? (
                      <img
                        src={selected.image}
                        className="w-full h-full object-cover"
                        alt={selected.name}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-5xl text-white">
                        {selected.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* MEMBER DETAILS */}
              <div className="p-8 text-center text-white space-y-4">
                <h2 className="text-3xl font-extrabold">{selected.name}</h2>

                {/* ROLE BADGE */}
                <span
                  className="
            px-4 py-1 
            text-sm font-semibold 
            rounded-full 
            bg-gradient-to-r from-purple-500/30 to-indigo-500/30 
            border border-white/20 
            backdrop-blur-md
            capitalize
          "
                >
                  {selected.role} Member
                </span>

                <p className="text-white/60">
                  {selected.department} • Batch {selected.batch}
                </p>

                <p className="text-white/60">{selected.email}</p>
                <p className="text-white/60">{selected.phone}</p>

                {/* SKILLS */}
                {selected.skills?.length > 0 && (
                  <div className="pt-2">
                    <p className="text-white/50 mb-2">Skills:</p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {selected.skills.map((skill: string) => (
                        <span
                          key={skill}
                          className="
                      px-3 py-1 text-sm 
                      bg-white/10 border border-white/20 
                      rounded-full 
                      backdrop-blur-md
                    "
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* JOIN DATE */}
                <div className="border-t border-white/10 pt-4">
                  <p className="text-white/40 text-sm">
                    Joined on{" "}
                    {new Date(selected.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
