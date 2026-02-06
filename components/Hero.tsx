'use client';

import { useEffect, useRef } from 'react';
import heroData from '@/data/hero.json';

export default function Hero() {
      const contentRef = useRef<HTMLDivElement>(null);
      const typingRef = useRef<HTMLSpanElement>(null);

      useEffect(() => {
            if (contentRef.current) {
                  contentRef.current.style.opacity = '1';
                  contentRef.current.style.transform = 'translateY(0)';
            }

            // Simple one-time typing effect for the main title
            let timer: number | undefined;
            const el = typingRef.current;
            const text = heroData.title || '';
            let i = 0;

            if (el) {
                  el.textContent = '';
                  timer = window.setInterval(() => {
                        if (i < text.length) {
                              el.textContent += text.charAt(i++);
                        } else {
                              if (timer) clearInterval(timer);
                              const caret = el.nextElementSibling as HTMLElement | null;
                              if (caret) caret.style.opacity = '0';
                        }
                  }, 70);
            }

            return () => {
                  if (timer) clearInterval(timer);
            };
      }, []);

      return (
            <section className="min-h-screen flex items-center justify-center pt-20 relative overflow-hidden">
                  <div className="absolute inset-0 opacity-10 animate-stars"></div>

                  <div className="max-w-[1000px] mx-auto px-8 relative z-10 content-justify">
                        <div
                              ref={contentRef}
                              className="text-left max-w-[700px] opacity-0 transition-all duration-800"
                              style={{ transform: 'translateY(20px)' }}
                        >
                              <h1 className="text-[clamp(2.5rem,5vw,4rem)] font-semibold mb-6 text-[#c9d1d9] tracking-tight leading-[1.2]">
                                    <span ref={typingRef} className="typing-text"></span>
                                    <span className="typing-caret" aria-hidden="true"></span>
                              </h1>

                              <p className="text-xl text-[#58a6ff] font-medium mb-8 flex items-center gap-4">
                                    <i className={`${heroData.subtitle.icon} text-2xl`}></i>
                                    {heroData.subtitle.text}
                              </p>

                              <p className="text-[1.05rem] text-[#8b949e] mb-12 leading-[1.8]">
                                    {heroData.description}
                              </p>

                              <div className="flex gap-8 items-center flex-wrap">
                                    {heroData.links.map((link) => (
                                          <a
                                                key={link.url}
                                                href={link.url}
                                                target={link.url.startsWith('http') ? '_blank' : undefined}
                                                rel={link.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                                                className="text-[#8b949e] hover:text-[#58a6ff] transition-colors duration-300 text-[0.95rem] flex items-center gap-2"
                                          >
                                                <i className={`${link.icon} text-lg`}></i>
                                                {link.text}
                                          </a>
                                    ))}
                              </div>
                        </div>
                  </div>
            </section>
      );
}
