import React from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Github, Linkedin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-[rgba(2,24,37,0.95)] border-t border-[rgba(76,201,240,0.12)] backdrop-blur-xl">
      {/* Decorative top line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#4CC9F0]/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <h3 className="text-base font-bold mb-4 bg-gradient-to-r from-[#4CC9F0] to-[#3FB6D6] bg-clip-text text-transparent">
              DIU Robotics Club
            </h3>
            <p className="text-[#90E0EF]/60 text-sm leading-relaxed">
              Empowering innovation through robotics and automation. Building the future, one robot at a time.
            </p>
            <div className="mt-5 text-xs text-[#90E0EF]/40 space-y-1">
              <p className="font-semibold text-[#90E0EF]/60">Collaboration:</p>
              <p>DIU Robotics Lab × DIU SWE Dept</p>
              <p>Daffodil International University</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold mb-4 text-[#4CC9F0] uppercase tracking-widest">Quick Links</h3>
            <ul className="space-y-2.5 text-sm">
              {[['/', 'Home'], ['/events', 'Events'], ['/seminars', 'Seminars'], ['/teams', 'Team & Members']].map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="text-[#90E0EF]/60 hover:text-[#00E5FF] transition-colors duration-200">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-bold mb-4 text-[#4CC9F0] uppercase tracking-widest">Resources</h3>
            <ul className="space-y-2.5 text-sm">
              {[['/research', 'Research Projects'], ['/workshops', 'Workshops'], ['/publications', 'Publications'], ['/login', 'Admin Portal']].map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="text-[#90E0EF]/60 hover:text-[#00E5FF] transition-colors duration-200">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-bold mb-4 text-[#4CC9F0] uppercase tracking-widest">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-[#90E0EF]/60">
                <Mail size={14} className="text-[#3FB6D6] flex-shrink-0" />
                <span>info@diuroboticclub.com</span>
              </li>
              <li className="flex items-center gap-2 text-[#90E0EF]/60">
                <Phone size={14} className="text-[#3FB6D6] flex-shrink-0" />
                <span>+880 1234 567890</span>
              </li>
              <li className="flex items-start gap-2 text-[#90E0EF]/60">
                <MapPin size={14} className="text-[#3FB6D6] flex-shrink-0 mt-0.5" />
                <span>Daffodil International University, Dhaka, Bangladesh</span>
              </li>
            </ul>
            <div className="flex gap-4 mt-5">
              <a href="#" aria-label="Github"
                className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#90E0EF]/60 hover:text-[#00E5FF] hover:border-[#4CC9F0]/40 hover:bg-[#4CC9F0]/10 transition-all">
                <Github size={15} />
              </a>
              <a href="#" aria-label="LinkedIn"
                className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#90E0EF]/60 hover:text-[#00E5FF] hover:border-[#4CC9F0]/40 hover:bg-[#4CC9F0]/10 transition-all">
                <Linkedin size={15} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-6 border-t border-[rgba(76,201,240,0.08)] flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-[#90E0EF]/30">
            © {currentYear} DIU Robotics Club. All rights reserved.
          </p>
          <p className="text-xs text-[#90E0EF]/20">
            Built with Next.js · MongoDB · Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

