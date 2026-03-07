"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/Card";

interface MemberCardProps {
  member: {
    _id: string;
    name: string;
    role?: string;
    position?: string;
    department: string;
    batch: string;
    image?: string;
    bio?: string;
    studentId?: string;
    email?: string;
  };
}

const roleBadge: Record<string, string> = {
  president: 'bg-gradient-to-r from-[#2F6BFF]/20 to-[#5B4BFF]/20 text-[#8ED6E6] border-[#2F6BFF]/30',
  deputy:    'bg-[rgba(63,182,214,0.15)] text-[#3DB5D8] border-[#3DB5D8]/30',
  executive: 'bg-[rgba(67,97,238,0.15)] text-[#8ED6E6] border-[#2F6BFF]/30',
  general:   'bg-[rgba(144,224,239,0.08)] text-[#8ED6E6]/70 border-[#8ED6E6]/15',
};

const roleLabel: Record<string, string> = {
  president: 'President',
  deputy:    'Deputy President',
  executive: 'Executive',
  general:   'General Member',
};

const MemberCard: React.FC<MemberCardProps> = ({ member }) => {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="cursor-pointer"
    >
      <Card
        variant="elevated"
        className="group hover:border-[rgba(0,229,255,0.25)] hover:shadow-[0_8px_40px_rgba(0,229,255,0.12)] transition-all duration-300 text-center h-full flex flex-col"
      >
        <CardContent className="p-6 flex-1 flex flex-col justify-between">
          <div className="flex-1 flex flex-col">
            {/* Avatar */}
            <div className="relative w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden border-2 border-[rgba(61,181,216,0.3)] shadow-[0_0_20px_rgba(61,181,216,0.15)] group-hover:border-[#3DB5D8]/50 group-hover:shadow-[0_0_28px_rgba(0,229,255,0.25)] transition-all duration-300">
              {member.image ? (
                <Image src={member.image} alt={member.name} fill className="object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#2F6BFF] to-[#5B4BFF] flex items-center justify-center text-white text-2xl font-black">
                  {member.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* Name */}
            <h3 className="text-sm font-bold text-white mb-2 leading-snug line-clamp-2 min-h-[2.5rem]">{member.name}</h3>

            {/* Role Badge */}
            <span className={`inline-block px-3 py-0.5 rounded-full text-xs font-semibold border mb-2 ${
              roleBadge[member.role] ?? roleBadge.general
            }`}>
              {roleLabel[member.role] ?? member.role}
            </span>

            {/* Position */}
            <div className="min-h-[1.25rem] mb-1">
              {member.position && (
                <p className="text-xs text-[#3DB5D8]/80 font-medium">{member.position}</p>
              )}
            </div>

            {/* Department */}
            <p className="text-xs text-[#8ED6E6]/50 mb-1">{member.department}</p>

            {/* Student ID */}
            {member.studentId && (
              <p className="text-xs text-[#3DB5D8]/70 font-mono mb-0.5">{member.studentId}</p>
            )}

            {/* Email */}
            {member.email && (
              <p className="text-xs text-[#8ED6E6]/40 truncate mb-2">{member.email}</p>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MemberCard;
