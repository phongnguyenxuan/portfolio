'use client';

import { useEffect, useRef } from 'react';
import aboutData from '@/data/about.json';

export default function About() {
      const sectionRef = useRef<HTMLDivElement>(null);

      useEffect(() => {
            const observer = new IntersectionObserver(
                  (entries) => {
                        entries.forEach((entry) => {
                              if (entry.isIntersecting) {
                                    entry.target.querySelectorAll('.reveal').forEach((el, index) => {
                                          setTimeout(() => {
                                                el.classList.add('active');
                                          }, index * 100);
                                    });
                              }
                        });
                  },
                  { threshold: 0.1 }
            );

            if (sectionRef.current) {
                  observer.observe(sectionRef.current);
            }

            return () => observer.disconnect();
      }, []);

      return (
            <section id="about" className="py-32 relative" ref={sectionRef}>
                  <div className="max-w-[1000px] mx-auto px-8 relative z-10 content-justify">
                        <div className="mb-12 reveal opacity-0 translate-y-8 transition-all duration-600">
                              <h2 className="text-[clamp(2rem,4vw,3rem)] font-bold text-[#c9d1d9] mb-4 text-left">
                                    About
                              </h2>
                              <p className="text-[#8b949e] max-w-[820px]">{aboutData.description || ''}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                              {aboutData.items.map((item, index) => (
                                    <div
                                          key={index}
                                          className="reveal opacity-0 translate-y-8 transition-all duration-600"
                                    >
                                          <h3 className="text-lg font-semibold mb-4 text-[#c9d1d9] flex items-center gap-2">
                                                <i className={`${item.icon} text-[#58a6ff]`}></i>
                                                {item.title}
                                          </h3>
                                          <p className="text-[#8b949e] leading-[1.8]">
                                                {item.description}
                                          </p>
                                    </div>
                              ))}
                        </div>
                  </div>
            </section>
      );
}
