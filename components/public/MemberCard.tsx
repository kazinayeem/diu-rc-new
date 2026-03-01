"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Linkedin, Github, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";

interface MemberCardProps {
  member: {
    _id: string;
    name: string;
    role: string;
    position?: string;
    department: string;
    batch: string;
    image?: string;
    bio?: string;
    socialLinks?: {
      linkedin?: string;
      github?: string;
      portfolio?: string;
    };
  };
}

const roleBadge: Record<string, string> = {
  president: 'bg-gradient-to-r from-[#4361EE]/20 to-[#3A0CA3]/20 text-[#90E0EF] border-[#4361EE]/30',
  deputy:    'bg-[rgba(63,182,214,0.15)] text-[#4CC9F0] border-[#3FB6D6]/30',
  executive: 'bg-[rgba(67,97,238,0.15)] text-[#90E0EF] border-[#4361EE]/30',
  general:   'bg-[rgba(144,224,239,0.08)] text-[#90E0EF]/70 border-[#90E0EF]/15',
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
        className="group hover:border-[rgba(0,229,255,0.25)] hover:shadow-[0_8px_40px_rgba(0,229,255,0.12)] transition-all duration-300 text-center"
      >
        <CardContent className="p-6">
          {/* Avatar */}
          <div className="relative w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden border-2 border-[rgba(76,201,240,0.3)] shadow-[0_0_20px_rgba(76,201,240,0.15)] group-hover:border-[#00E5FF]/50 group-hover:shadow-[0_0_28px_rgba(0,229,255,0.25)] transition-all duration-300">
            {member.image ? (
              <Image src={member.image} alt={member.name} fill className="object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#4361EE] to-[#3A0CA3] flex items-center justify-center text-white text-2xl font-black">
                {member.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* Name */}
          <h3 className="text-sm font-bold text-white mb-2 leading-snug">{member.name}</h3>

          {/* Role Badge */}
          <span className={`inline-block px-3 py-0.5 rounded-full text-xs font-semibold border mb-2 ${
            roleBadge[member.role] ?? roleBadge.general
          }`}>
            {roleLabel[member.role] ?? member.role}
          </span>

          {/* Position */}
          {member.position && (
            <p className="text-xs text-[#4CC9F0]/80 font-medium mb-1">{member.position}</p>
          )}

          {/* Department */}
          <p className="text-xs text-[#90E0EF]/50 mb-3">{member.department}</p>

          {/* Social Links */}
          {member.socialLinks &&
            (member.socialLinks.linkedin || member.socialLinks.github || member.socialLinks.portfolio) && (
              <div className="flex justify-center gap-3 pt-2 border-t border-[rgba(76,201,240,0.08)]">
                {member.socialLinks.linkedin && (
                  <a href={member.socialLinks.linkedin} target="_blank" rel="noopener noreferrer"
                    className="text-[#90E0EF]/50 hover:text-[#4CC9F0] transition-colors">
                    <Linkedin size={15} />
                  </a>
                )}
                {member.socialLinks.github && (
                  <a href={member.socialLinks.github} target="_blank" rel="noopener noreferrer"
                    className="text-[#90E0EF]/50 hover:text-[#4CC9F0] transition-colors">
                    <Github size={15} />
                  </a>
                )}
                {member.socialLinks.portfolio && (
                  <a href={member.socialLinks.portfolio} target="_blank" rel="noopener noreferrer"
                    className="text-[#90E0EF]/50 hover:text-[#4CC9F0] transition-colors">
                    <ExternalLink size={15} />
                  </a>
                )}
              </div>
            )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MemberCard;
