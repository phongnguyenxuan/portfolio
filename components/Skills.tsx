'use client';

import { useEffect, useRef } from 'react';
import skillsData from '@/data/skills.json';

export default function Skills() {
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
            <section id="skills" className="pt-16 pb-32 bg-[var(--background)] relative overflow-hidden" ref={sectionRef}>

                  <div className="max-w-[1000px] mx-auto px-8 relative z-10 content-justify">
                        <div className="mb-12 reveal opacity-0 translate-y-8 transition-all duration-600">
                              <h2 className="text-[clamp(2rem,4vw,3rem)] font-bold text-[#c9d1d9] mb-4 text-left">
                                    {skillsData.header.title}
                              </h2>
                              <p className="text-[#8b949e] text-lg max-w-[820px]">{skillsData.header.description}</p>
                        </div>

                        <div className="group/skills flex flex-col gap-8 md:gap-12">
                              {skillsData.categories.map((category, categoryIndex) => {
                                    return (
                                          <div
                                                key={categoryIndex}
                                                className="group/category relative reveal opacity-0 translate-y-8 transition-all duration-300 md:group-has-[.group\/category:hover]/skills:opacity-10 md:group-has-[.group\/category:hover]/skills:blur-sm md:hover:!opacity-100 md:hover:!blur-none"
                                          >
                                                {/* Category Label - appears on hover (desktop only) */}
                                                <div className="hidden md:block text-center mb-6 opacity-0 group-hover/category:opacity-100 transition-opacity duration-300">
                                                      <span className="inline-block px-4 py-1.5 rounded-md text-[0.85rem] font-medium border border-[#30363d] bg-[#21262d] text-[#c9d1d9] capitalize">
                                                            {category.name}
                                                      </span>
                                                </div>

                                                {/* Skills Grid */}
                                                <div className="flex flex-wrap justify-center gap-3 md:gap-4">
                                                      {category.skills.map((skill, skillIndex) => (
                                                            <div
                                                                  key={skillIndex}
                                                                  className="group/skill inline-flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 rounded-md text-[0.85rem] md:text-[0.9rem] font-medium border border-[#30363d] bg-[#161b22] text-[#c9d1d9] transition-all duration-300 cursor-default md:hover:border-[#58a6ff] md:hover:bg-[#21262d]"
                                                            >
                                                                  <i
                                                                        className={`${skill.icon} text-base md:text-lg transition-colors duration-300`}
                                                                        style={{ color: skill.iconColor }}
                                                                  ></i>
                                                                  {skill.name}
                                                            </div>
                                                      ))}
                                                </div>
                                          </div>
                                    );
                              })}
                        </div>
                  </div>
            </section>
      );
}
