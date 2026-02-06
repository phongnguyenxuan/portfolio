'use client';

import { useEffect, useRef } from 'react';
import contactData from '@/data/contact.json';

export default function Contact() {
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
            <section id="contact" className="py-32 relative" ref={sectionRef}>
                  <div className="absolute inset-0 opacity-20 animate-stars"></div>
                  <div className="max-w-[1000px] mx-auto px-8 relative z-10 content-justify">
                        <div className="mb-12 reveal opacity-0 translate-y-8 transition-all duration-600">
                              <h2 className="text-[clamp(2rem,4vw,3rem)] font-bold text-[#c9d1d9] mb-4 text-left">
                                    Contact
                              </h2>
                              <p className="text-[#8b949e] max-w-[820px]">{contactData.description || ''}</p>
                        </div>

                        <div className="max-w-[600px] reveal opacity-0 translate-y-8 transition-all duration-600">
                              <p className="text-[1.05rem] text-[#8b949e] mb-8 leading-[1.8]">
                                    {contactData.description}
                              </p>

                              <div className="flex flex-col gap-3 mb-6">
                                    <a
                                          href={`tel:${contactData.phone.number}`}
                                          className="text-[1.05rem] text-[#58a6ff] font-medium inline-flex items-center gap-3 hover:underline"
                                    >
                                          <i className={`${contactData.phone.icon} text-2xl`}></i>
                                          {contactData.phone.number}
                                    </a>

                                    <a
                                          href={`mailto:${contactData.email.address}`}
                                          className="text-[1.05rem] text-[#58a6ff] font-medium inline-flex items-center gap-3 hover:underline"
                                    >
                                          <i className={`${contactData.email.icon} text-2xl`}></i>
                                          {contactData.email.address}
                                    </a>
                              </div>

                              <div className="mt-10 flex flex-col md:flex-row gap-8 flex-wrap">
                                    {contactData.socialLinks.map((link) => (
                                          <a
                                                key={link.url}
                                                href={link.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-[#8b949e] hover:text-[#58a6ff] transition-colors text-[0.95rem] flex items-center gap-2"
                                          >
                                                <i className={`${link.icon} text-xl`}></i>
                                                {link.text}
                                          </a>
                                    ))}
                              </div>
                        </div>
                  </div>
            </section>
      );
}
