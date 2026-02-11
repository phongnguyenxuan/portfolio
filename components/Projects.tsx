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

      const renderStoreIcon = (type: string) => {
            if (type === 'chplay') {
                  return (
                        <svg className="w-5 h-5" viewBox="0 0 640 640" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                              <path d="M389.6 298.3L168.9 77L449.7 238.2L389.6 298.3zM111.3 64C98.3 70.8 89.6 83.2 89.6 99.3L89.6 540.6C89.6 556.7 98.3 569.1 111.3 575.9L367.9 319.9L111.3 64zM536.5 289.6L477.6 255.5L411.9 320L477.6 384.5L537.7 350.4C555.7 336.1 555.7 303.9 536.5 289.6zM168.9 563L449.7 401.8L389.6 341.7L168.9 563z" />
                        </svg>
                  );
            }

            if (type === 'appstore') {
                  return (
                        <svg className="w-5 h-5" viewBox="0 0 640 640" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                              <path d="M496 96L144 96C117.5 96 96 117.5 96 144L96 496C96 522.5 117.5 544 144 544L496 544C522.5 544 544 522.5 544 496L544 144C544 117.5 522.5 96 496 96zM223 448.5C217.5 458.1 205.2 461.3 195.7 455.8C186.1 450.3 182.9 438 188.4 428.5L202.7 403.8C218.8 398.9 232 402.7 242.3 415.2L223 448.5zM361.9 394.6L180 394.6C169 394.6 160 385.6 160 374.6C160 363.6 169 354.6 180 354.6L231 354.6L296.4 241.4L275.9 206C270.4 196.4 273.7 184.2 283.2 178.7C292.8 173.2 305 176.5 310.5 186L319.4 201.4L328.3 186C333.8 176.4 346.1 173.2 355.6 178.7C365.2 184.2 368.4 196.5 362.9 206L277.1 354.6L339.2 354.6C359.4 354.6 370.7 378.3 361.9 394.6zM460 394.6L431 394.6L450.6 428.5C456.1 438.1 452.8 450.3 443.3 455.8C433.7 461.3 421.5 458 416 448.5C383.1 391.6 358.5 348.8 342 320.4C325.3 291.4 337.2 262.4 349.1 252.6C362.2 275.3 381.8 309.3 408 354.6L460 354.6C471 354.6 480 363.6 480 374.6C480 385.7 471 394.6 460 394.6z" />
                        </svg>
                  );
            }

            // fallback arrow
            return <i className="fa-solid fa-arrow-right" />;
      };

      return (
            <section id="projects" className="py-32 relative" ref={sectionRef}>
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
                                                {project.logo ? (
                                                      <img
                                                            src={project.logo}
                                                            alt={`${project.title} logo`}
                                                            className="w-9 h-9 object-contain rounded-[8px]"
                                                            loading="lazy"
                                                            width={36}
                                                            height={36}
                                                      />
                                                ) : (
                                                      <i className={`${project.icon} text-[#58a6ff] text-xl`}></i>
                                                )}
                                                {project.title}
                                          </h3>
                                          <span className="text-[#8b949e] text-sm font-mono">
                                                {project.year}
                                          </span>
                                    </div>

                                    <p className="text-[#8b949e] mb-6 leading-[1.8]">
                                          {project.description}
                                    </p>

                                    {project.features && project.features.length > 0 && (
                                          <div className="mb-4">
                                                <h4 className="text-sm font-semibold text-[#c9d1d9] mb-2">Key features</h4>
                                                <ul className="list-disc list-inside text-[#8b949e] ml-4 space-y-1">
                                                      {project.features.map((feature, idx) => (
                                                            <li key={idx} className="text-sm">
                                                                  {feature}
                                                            </li>
                                                      ))}
                                                </ul>
                                          </div>
                                    )}

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


                                    <div className="flex gap-3 items-center">
                                          {(() => {
                                                const links = Array.isArray((project as any).links)
                                                      ? (project as any).links
                                                      : (project as any).link
                                                            ? (Array.isArray((project as any).link) ? (project as any).link : [(project as any).link])
                                                            : [];

                                                if (links.length === 0) return null;

                                                return links.map((l: any, i: number) => (
                                                      <a
                                                            key={i}
                                                            href={l.url}
                                                            className="inline-flex items-center gap-2 text-[#58a6ff] text-[0.95rem] hover:underline"
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            aria-label={l.text}
                                                      >
                                                            <span className="flex items-center">{renderStoreIcon(l.type || '')}</span>
                                                            <span>{l.text}</span>
                                                      </a>
                                                ));
                                          })()}
                                    </div>
                              </div>
                        ))}
                  </div>
            </section>
      );
}
