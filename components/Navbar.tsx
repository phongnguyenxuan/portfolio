'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import navData from '@/data/navigation.json';

export default function Navbar() {
      const [isScrolled, setIsScrolled] = useState(false);
      const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

      useEffect(() => {
            let ticking = false;
            const handleScroll = () => {
                  if (!ticking) {
                        requestAnimationFrame(() => {
                              setIsScrolled(window.scrollY > 50);
                              ticking = false;
                        });
                        ticking = true;
                  }
            };

            window.addEventListener('scroll', handleScroll, { passive: true });
            return () => window.removeEventListener('scroll', handleScroll);
      }, []);

      return (
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-[background-color,border-color] duration-300 ${isScrolled
                  ? 'bg-[rgba(13,17,23,0.97)] border-b border-[#30363d]'
                  : 'bg-[rgba(13,17,23,0.85)]'
                  }`}>
                  <div className="max-w-[1000px] mx-auto px-8 py-6 flex justify-between items-center">
                        <div className="flex items-center gap-2 font-semibold text-lg text-[#58a6ff]">
                              <i className={`${navData.logo.icon} text-[1.3rem]`}></i>
                              {navData.logo.text}
                        </div>

                        <button
                              className="md:hidden text-white text-2xl hover:text-[#58a6ff] transition-colors"
                              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                              <i className="fas fa-bars"></i>
                        </button>

                        <ul className={`${isMobileMenuOpen
                              ? 'flex'
                              : 'hidden'
                              } md:flex flex-col md:flex-row gap-6 md:gap-10 absolute md:relative top-full left-0 right-0 md:top-auto bg-[rgba(13,17,23,0.98)] md:bg-transparent p-8 md:p-0 border-b md:border-0 border-[#30363d]`}>
                              {navData.links.map((link) => (
                                    <li key={link.href}>
                                          <a
                                                href={link.href}
                                                className="text-[#8b949e] hover:text-[#58a6ff] transition-colors text-[0.95rem]"
                                                onClick={() => setIsMobileMenuOpen(false)}
                                          >
                                                {link.text}
                                          </a>
                                    </li>
                              ))}
                        </ul>
                  </div>
            </nav>
      );
}
