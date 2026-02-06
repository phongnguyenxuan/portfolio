'use client';

import { useState, useEffect } from 'react';

export default function ScrollToTop() {
      const [isVisible, setIsVisible] = useState(false);

      useEffect(() => {
            const handleScroll = () => {
                  setIsVisible(window.scrollY > 300);
            };

            window.addEventListener('scroll', handleScroll);
            return () => window.removeEventListener('scroll', handleScroll);
      }, []);

      const scrollToTop = () => {
            window.scrollTo({
                  top: 0,
                  behavior: 'smooth'
            });
      };

      return (
            <button
                  onClick={scrollToTop}
                  className={`fixed bottom-8 right-8 w-[50px] h-[50px] bg-[#1A1F3A] border border-[#2A2F4A] rounded-full flex items-center justify-center text-[#54C5F8] cursor-pointer transition-all duration-300 z-[999] ${isVisible ? 'opacity-100 visible' : 'opacity-0 invisible'
                        } hover:bg-[#54C5F8] hover:text-[#0A0E27] hover:-translate-y-1`}
            >
                  <i className="fa-solid fa-arrow-up"></i>
            </button>
      );
}
