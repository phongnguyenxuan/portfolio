'use client';

import { useEffect, useRef } from 'react';
import experienceData from '@/data/experience.json';

export default function Experience() {
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
            <section id="experience" className="pt-16 pb-32 relative" ref={sectionRef}>
                  <div className="max-w-[1000px] mx-auto px-8 relative z-10 content-justify">
                        <div className="mb-12 reveal opacity-0 translate-y-8 transition-all duration-600">
                              <h2 className="text-[clamp(2rem,4vw,3rem)] font-bold text-[#c9d1d9] mb-4 text-left">
                                    Experience
                              </h2>
                              <p className="text-[#8b949e] max-w-[820px]">{(experienceData as any).description || ''}</p>
                        </div>

                        <div className="relative">
                              {/* Timeline line */}
                              <div className="hidden md:block absolute left-[7px] top-0 bottom-0 w-[2px] bg-[#30363d]"></div>

                              {experienceData.experiences.map((exp, index) => (
                                    <div
                                          key={exp.id}
                                          className={`relative mb-12 md:mb-16 reveal opacity-0 translate-y-8 transition-all duration-600 ${index === experienceData.experiences.length - 1 ? 'mb-0' : ''
                                                }`}
                                    >
                                          {/* Timeline dot */}
                                          <div className="hidden md:flex absolute left-0 top-2 w-4 h-4 rounded-full bg-[#58a6ff] border-4 border-[#0d1117] z-10"></div>

                                          {/* Content */}
                                          <div className="md:ml-12">
                                                <div className="bg-[#0d1117] border border-[#30363d] rounded-md p-6 md:p-8 transition-colors duration-300 hover:border-[#58a6ff]">
                                                      {/* Header */}
                                                      <div className="mb-4">
                                                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
                                                                  <h3 className="text-xl md:text-2xl font-semibold text-[#c9d1d9]">
                                                                        {exp.position}
                                                                  </h3>
                                                                  <span className="text-sm text-[#8b949e] font-mono whitespace-nowrap">
                                                                        {exp.period}
                                                                  </span>
                                                            </div>
                                                            <div className="flex flex-col md:flex-row md:items-center gap-2 text-[#8b949e]">
                                                                  <span className="font-medium">{exp.company}</span>
                                                                  <span className="hidden md:inline">•</span>
                                                                  <span className="text-sm flex items-center gap-1">
                                                                        <i className="fa-solid fa-location-dot text-xs"></i>
                                                                        {exp.location}
                                                                  </span>
                                                            </div>
                                                      </div>

                                                      {/* Description */}
                                                      <p className="text-[#8b949e] leading-[1.8] mb-4">
                                                            {exp.description}
                                                      </p>

                                                      {/* Achievements */}
                                                      <div className="mb-4">
                                                            <ul className="space-y-2">
                                                                  {exp.achievements.map((achievement, idx) => (
                                                                        <li key={idx} className="text-[#8b949e] flex items-start gap-2">
                                                                              <i className="fa-solid fa-circle-check text-[#58a6ff] text-sm mt-1 flex-shrink-0"></i>
                                                                              <span>{achievement}</span>
                                                                        </li>
                                                                  ))}
                                                            </ul>
                                                      </div>

                                                      {/* Technologies */}
                                                      <div className="flex flex-wrap gap-2">
                                                            {exp.technologies.map((tech) => (
                                                                  <span
                                                                        key={tech}
                                                                        className="px-3 py-1 text-sm font-mono text-[#8b949e] bg-[#161b22] border border-[#30363d] rounded-md transition-colors duration-300 hover:border-[#58a6ff]"
                                                                  >
                                                                        {tech}
                                                                  </span>
                                                            ))}
                                                      </div>
                                                </div>
                                          </div>
                                    </div>
                              ))}
                        </div>
                  </div>
            </section>
      );
}
