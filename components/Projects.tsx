'use client';

import { useEffect, useRef } from 'react';
import projectsData from '@/data/projects.json';

export default function Projects() {
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
            <section id="projects" className="py-32 relative" ref={sectionRef}>
                  <div className="absolute inset-0 opacity-20 animate-stars"></div>
                  <div className="max-w-[1000px] mx-auto px-8 relative z-10 content-justify">
                        <div className="mb-12 reveal opacity-0 translate-y-8 transition-all duration-600">
                              <h2 className="text-[clamp(2rem,4vw,3rem)] font-bold text-[#c9d1d9] mb-4 text-left">
                                    Featured Projects
                              </h2>
                              <p className="text-[#8b949e] max-w-[820px]">{projectsData.description || ''}</p>
                        </div>

                        {projectsData.projects.map((project, index) => (
                              <div
                                    key={project.id}
                                    className={`py-12 reveal opacity-0 translate-y-8 ${index !== projectsData.projects.length - 1 ? 'border-b border-[#21262d]' : ''
                                          }`}
                              >
                                    <div className="flex justify-between items-baseline mb-4 flex-wrap gap-4">
                                          <h3 className="text-2xl font-semibold text-[#c9d1d9] flex items-center gap-2 hover:text-[#58a6ff] transition-colors">
                                                <i className={`${project.icon} text-[#58a6ff] text-xl`}></i>
                                                {project.title}
                                          </h3>
                                          <span className="text-[#8b949e] text-sm font-mono">
                                                {project.year}
                                          </span>
                                    </div>

                                    <p className="text-[#8b949e] mb-6 leading-[1.8]">
                                          {project.description}
                                    </p>

                                    <div className="flex gap-4 flex-wrap mb-4">
                                          {project.technologies.map((tech) => (
                                                <span
                                                      key={tech}
                                                      className="font-mono text-sm text-[#8b949e] bg-[#161b22] px-3 py-1 rounded-md border border-[#30363d] transition-colors duration-300 hover:border-[#58a6ff]"
                                                >
                                                      {tech}
                                                </span>
                                          ))}
                                    </div>

                                    <a
                                          href={project.link.url}
                                          className="text-[#58a6ff] text-[0.95rem] inline-flex items-center gap-2 hover:underline"
                                    >
                                          {project.link.text}
                                          <i className="fa-solid fa-arrow-right"></i>
                                    </a>
                              </div>
                        ))}
                  </div>
            </section>
      );
}
