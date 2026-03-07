import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, MapPin, Github, Linkedin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-[rgba(8,20,42,0.98)] border-t border-[rgba(61,181,216,0.12)] backdrop-blur-xl">
      {/* Decorative top line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#2F6BFF]/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2.5 group w-fit mb-5">
              <div className="h-10 w-36 rounded-xl bg-[rgba(63,182,214,0.08)] border border-[rgba(61,181,216,0.2)] flex items-center justify-center px-2.5 shadow-[0_0_16px_rgba(61,181,216,0.15)] group-hover:shadow-[0_0_24px_rgba(47,107,255,0.35)] transition-all duration-300">
                <Image
                  src="/diurc_logo_rec.png"
                  alt="Daffodil International University Robotics Club"
                  width={120}
                  height={36}
                  className="object-contain w-full h-full"
                />
              </div>
            </Link>
            <p className="text-[#8ED6E6]/60 text-sm leading-relaxed">
              Daffodil International University Robotics Club is a platform for students interested in robotics and automation to learn, innovate and collaborate.
            </p>
            <div className="mt-5 text-xs text-[#8ED6E6]/40 space-y-1">
              <p className="font-semibold text-[#8ED6E6]/60">Collaboration:</p>
              <p>Daffodil International University Robotics Lab</p>
              <p>Daffodil International University Software Engineering Department</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold mb-4 text-[#3DB5D8] uppercase tracking-widest">Quick Links</h3>
            <ul className="space-y-2.5 text-sm">
              {[['/', 'Home'], ['/events', 'Events'], ['/seminars', 'Seminars'], ['/teams', 'Team & Members']].map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="text-[#8ED6E6]/60 hover:text-[#3DB5D8] transition-colors duration-200">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-bold mb-4 text-[#3DB5D8] uppercase tracking-widest">Resources</h3>
            <ul className="space-y-2.5 text-sm">
              {[['/research', 'Research Projects'], ['/workshops', 'Workshops'], ['/publications', 'Publications'], ['/login', 'Admin Portal']].map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="text-[#8ED6E6]/60 hover:text-[#3DB5D8] transition-colors duration-200">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-bold mb-4 text-[#3DB5D8] uppercase tracking-widest">Legal</h3>
            <ul className="space-y-2.5 text-sm">
              {[['/terms', 'Terms & Conditions'], ['/privacy', 'Privacy Policy'], ['/refund-policy', 'Refund Policy'], ['/faq', 'FAQ']].map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="text-[#8ED6E6]/60 hover:text-[#3DB5D8] transition-colors duration-200">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-bold mb-4 text-[#3DB5D8] uppercase tracking-widest">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-[#8ED6E6]/60">
                <Mail size={14} className="text-[#3DB5D8] flex-shrink-0" />
                <span>info@diuroboticclub.com</span>
              </li>
              <li className="flex items-center gap-2 text-[#8ED6E6]/60">
                <Phone size={14} className="text-[#3DB5D8] flex-shrink-0" />
                <span>+880 1234 567890</span>
              </li>
              <li className="flex items-start gap-2 text-[#8ED6E6]/60">
                <MapPin size={14} className="text-[#3DB5D8] flex-shrink-0 mt-0.5" />
                <span>Daffodil International University, Dhaka, Bangladesh</span>
              </li>
            </ul>
            <div className="flex gap-4 mt-5">
              <a href="#" aria-label="Github"
                className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#8ED6E6]/60 hover:text-[#3DB5D8] hover:border-[#3DB5D8]/40 hover:bg-[#3DB5D8]/10 transition-all">
                <Github size={15} />
              </a>
              <a href="#" aria-label="LinkedIn"
                className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#8ED6E6]/60 hover:text-[#3DB5D8] hover:border-[#3DB5D8]/40 hover:bg-[#3DB5D8]/10 transition-all">
                <Linkedin size={15} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-6 border-t border-[rgba(61,181,216,0.08)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-5">
            <p className="text-sm text-[#8ED6E6]/40">
              © {currentYear} Daffodil International University Robotics Club. All rights reserved.
            </p>
            <div className="flex gap-4 text-xs text-[#8ED6E6]/35">
              <Link href="/terms" className="hover:text-[#3DB5D8] transition-colors">Terms</Link>
              <Link href="/privacy" className="hover:text-[#3DB5D8] transition-colors">Privacy</Link>
              <Link href="/refund-policy" className="hover:text-[#3DB5D8] transition-colors">Refunds</Link>
              <Link href="/faq" className="hover:text-[#3DB5D8] transition-colors">FAQ</Link>
            </div>
          </div>
          <a
            href="https://bornosoftnr.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-200"
            style={{
              background: "rgba(61,181,216,0.04)",
              border: "1px solid rgba(61,181,216,0.10)",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = "rgba(61,181,216,0.09)";
              (e.currentTarget as HTMLElement).style.border = "1px solid rgba(61,181,216,0.22)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = "rgba(61,181,216,0.04)";
              (e.currentTarget as HTMLElement).style.border = "1px solid rgba(61,181,216,0.10)";
            }}
          >
            <span className="text-xs font-medium text-[#8ED6E6]/45 group-hover:text-[#8ED6E6]/70 transition-colors">
              Developed &amp; Maintained by
            </span>
            <img
              src="https://bornosoftnr.com/logo.png"
              alt="Bornosoft"
              className="h-7 w-auto object-contain opacity-70 group-hover:opacity-100 transition-opacity duration-200"
              style={{ filter: "brightness(1.1) saturate(0.9)" }}
            />
            <span className="text-sm font-bold text-[#3DB5D8]/70 group-hover:text-[#3DB5D8] transition-colors tracking-wide">
              Bornosoft
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

