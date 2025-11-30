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

const roleColors = {
  main: "bg-purple-100 text-purple-800",
  executive: "bg-blue-100 text-blue-800",
  deputy: "bg-green-100 text-green-800",
  general: "bg-gray-100 text-gray-800",
};

const roleLabels = {
  president: "President",
  executive: "Executive",
  deputy: "Deputy",
  general: "General",
};

const MemberCard: React.FC<MemberCardProps> = ({ member }) => {
  return (
    <motion.div
      whileHover={{
        rotateX: 8,
        rotateY: -8,
        scale: 1.04,
      }}
      transition={{ type: "spring", stiffness: 250, damping: 15 }}
      className="cursor-pointer"
    >
      <Card
        variant="elevated"
        className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl 
          hover:shadow-[0_0_25px_rgba(109,40,217,0.4)] transition-all duration-300 text-center"
      >
        <CardContent className="p-6">
          {/* Avatar */}
          <div
            className="relative w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden 
            border-4 border-purple-300 shadow-xl group-hover:border-purple-500 transition-all duration-300"
          >
            {member.image ? (
              <Image
                src={member.image}
                alt={member.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold">
                {member.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* Name */}
          <h3 className="text-lg font-bold text-white mb-1">{member.name}</h3>

          {/* Role */}
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-2 ${
              roleColors[member.role as keyof typeof roleColors]
            }`}
          >
            {roleLabels[member.role as keyof typeof roleLabels]}
          </span>

          {/* Position */}
          {member.position && (
            <p className="text-sm text-purple-300 font-medium mb-2">
              {member.position}
            </p>
          )}

          {/* Department */}
          <p className="text-sm text-gray-300 mb-1">{member.department}</p>

          {/* Batch */}
        

{/*         
          {member.bio && (
            <p className="text-sm text-gray-400 mb-4 line-clamp-2">
              {member.bio}
            </p>
          )} */}

          {/* Social Links */}
          {member.socialLinks &&
            (member.socialLinks.linkedin ||
              member.socialLinks.github ||
              member.socialLinks.portfolio) && (
              <div className="flex justify-center space-x-3">
                {member.socialLinks.linkedin && (
                  <a
                    href={member.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-purple-400 transition-colors"
                  >
                    <Linkedin size={18} />
                  </a>
                )}

                {member.socialLinks.github && (
                  <a
                    href={member.socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-purple-400 transition-colors"
                  >
                    <Github size={18} />
                  </a>
                )}

                {member.socialLinks.portfolio && (
                  <a
                    href={member.socialLinks.portfolio}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-purple-400 transition-colors"
                  >
                    <ExternalLink size={18} />
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
