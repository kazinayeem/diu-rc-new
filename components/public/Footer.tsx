import React from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Github, Linkedin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 dark:bg-dark-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-bold mb-4">DIU Robotics Club</h3>
            <p className="text-gray-300 dark:text-dark-300 text-sm">
              Empowering innovation through robotics and automation. Building the future, one robot at a time.
            </p>
            <div className="mt-4 text-xs text-gray-400 dark:text-dark-400">
              <p className="font-semibold mb-1">Collaboration:</p>
              <p>DIU Robotics Lab × DIU SWE Dept</p>
              <p>Daffodil International University</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-gray-300 dark:text-dark-300 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-gray-300 dark:text-dark-300 hover:text-white transition-colors">
                  Events
                </Link>
              </li>
              <li>
                <Link href="/seminars" className="text-gray-300 dark:text-dark-300 hover:text-white transition-colors">
                  Seminars
                </Link>
              </li>
              <li>
                <Link href="/members" className="text-gray-300 dark:text-dark-300 hover:text-white transition-colors">
                  Members
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-bold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/research" className="text-gray-300 dark:text-dark-300 hover:text-white transition-colors">
                  Research Projects
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-gray-300 dark:text-dark-300 hover:text-white transition-colors">
                  Gallery
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-gray-300 dark:text-dark-300 hover:text-white transition-colors">
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center space-x-2 text-gray-300 dark:text-dark-300">
                <Mail size={16} />
                <span>info@diuroboticclub.com</span>
              </li>
              <li className="flex items-center space-x-2 text-gray-300 dark:text-dark-300">
                <Phone size={16} />
                <span>+880 1234 567890</span>
              </li>
              <li className="flex items-start space-x-2 text-gray-300 dark:text-dark-300">
                <MapPin size={16} className="mt-1" />
                <span>Daffodil International University, Dhaka, Bangladesh</span>
              </li>
            </ul>
            <div className="flex space-x-4 mt-4">
              <a
                href="#"
                className="text-gray-300 dark:text-dark-300 hover:text-white transition-colors"
                aria-label="Github"
              >
                <Github size={20} />
              </a>
              <a
                href="#"
                className="text-gray-300 dark:text-dark-300 hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 dark:border-dark-800 mt-8 pt-8 text-center text-sm">
          <p className="text-gray-300 dark:text-dark-300 mb-2">
            &copy; {currentYear} DIU Robotics Club. All rights reserved.
          </p>
          <p className="text-gray-400 dark:text-dark-400 text-xs">
            Built by{' '}
            <a 
              href="https://kazinayeem.site" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
            >
              Mohammad Ali Nayeem
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

