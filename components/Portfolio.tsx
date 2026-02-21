"use client";

import { useState, useEffect, useRef, useMemo, type ReactNode } from "react";

import heroData from "@/data/hero.json";
import aboutData from "@/data/about.json";
import skillsData from "@/data/skills.json";
import projectsData from "@/data/projects.json";
import experienceData from "@/data/experience.json";
import contactData from "@/data/contact.json";
import ThemeToggle from "@/components/ThemeToggle";

/* ── Style helpers ────────────────────────────────── */

const S = {
      secondary: {
            color: "var(--color-secondary)",
            whiteSpace: "pre-line",
      } as React.CSSProperties,
      mono: {
            fontSize: 13,
            color: "var(--color-secondary)",
      } as React.CSSProperties,
      divider: {
            borderTop: "1px solid var(--color-divider)",
            margin: "32px 0",
      } as React.CSSProperties,
};

/* ── Streaming engine ─────────────────────────────── */

interface StreamLine {
      key: string;
      node: ReactNode;
}

function useStream(totalLines: number, tabKey: string) {
      const [visible, setVisible] = useState(0);
      const [done, setDone] = useState(false);
      const rafRef = useRef<number | null>(null);
      const startRef = useRef(0);

      useEffect(() => {
            setVisible(0);
            setDone(false);

            if (!totalLines) {
                  setDone(true);
                  return;
            }

            // Total duration ~1.6s, each line appears at even intervals
            const duration = Math.min(1600, totalLines * 80);
            const perLine = duration / totalLines;
            startRef.current = performance.now();

            function frame(now: number) {
                  const elapsed = now - startRef.current;
                  const count = Math.min(totalLines, Math.floor(elapsed / perLine) + 1);
                  setVisible(count);
                  if (count < totalLines) {
                        rafRef.current = requestAnimationFrame(frame);
                  } else {
                        setDone(true);
                  }
            }

            rafRef.current = requestAnimationFrame(frame);

            return () => {
                  if (rafRef.current) cancelAnimationFrame(rafRef.current);
            };
      }, [tabKey, totalLines]);

      return { visible, done };
}

/* ── Section heading ──────────────────────────────── */

function SectionHeading({ text }: { text: string }) {
      return (
            <div
                  style={{
                        fontSize: 16,
                        fontWeight: 600,
                        color: "var(--color-primary)",
                        marginBottom: 16,
                        letterSpacing: "0.01em",
                  }}
            >
                  <span style={{ color: "var(--color-secondary)", marginRight: 8 }}>&gt;</span>
                  {text}
            </div>
      );
}

/* ── Build content lines per panel ────────────────── */

function buildAboutLines(): StreamLine[] {
      const lines: StreamLine[] = [];

      lines.push({
            key: "h-overview",
            node: <SectionHeading text={aboutData.header.title} />,
      });
      lines.push({
            key: "hero-desc",
            node: <p style={{ ...S.secondary, marginTop: 8 }}>{heroData.description}</p>,
      });

      aboutData.items.forEach((item, i) => {
            lines.push({
                  key: `about-title-${i}`,
                  node: (
                        <p
                              style={{
                                    color: "var(--color-primary)",
                                    fontWeight: 500,
                                    marginTop: 16,
                                    marginBottom: 4,
                              }}
                        >
                              {item.title}
                        </p>
                  ),
            });
            lines.push({
                  key: `about-body-${i}`,
                  node: <p style={S.secondary}>{item.description}</p>,
            });
      });

      lines.push({ key: "div-skills", node: <div style={S.divider} /> });
      lines.push({
            key: "h-skills",
            node: <SectionHeading text={skillsData.header.title} />,
      });
      lines.push({
            key: "skills-desc",
            node: (
                  <p style={{ ...S.secondary, marginBottom: 12, fontSize: 14 }}>
                        {skillsData.header.description}
                  </p>
            ),
      });

      skillsData.categories.forEach((cat) => {
            lines.push({
                  key: `cat-${cat.name}`,
                  node: (
                        <div style={{ marginBottom: 12 }}>
                              <p
                                    style={{
                                          color: "var(--color-primary)",
                                          fontSize: 13,
                                          fontWeight: 500,
                                          marginBottom: 2,
                                          textTransform: "uppercase",
                                          letterSpacing: "0.05em",
                                    }}
                              >
                                    {cat.name}
                              </p>
                              <p style={{ ...S.mono, lineHeight: 2.0 }}>
                                    {cat.skills.map((s) => s.name).join(" · ")}
                              </p>
                        </div>
                  ),
            });
      });

      lines.push({ key: "div-avail", node: <div style={S.divider} /> });
      lines.push({
            key: "h-avail",
            node: <SectionHeading text={aboutData.availability.title} />,
      });
      lines.push({
            key: "avail-body",
            node: <p style={S.secondary}>{aboutData.availability.description}</p>,
      });

      return lines;
}

function buildProjectsLines(): StreamLine[] {
      const lines: StreamLine[] = [];

      lines.push({
            key: "h-proj",
            node: <SectionHeading text={projectsData.header.title} />,
      });
      lines.push({
            key: "proj-desc",
            node: <p style={S.secondary}>{projectsData.description}</p>,
      });

      projectsData.projects.forEach((project) => {
            lines.push({
                  key: `proj-title-${project.id}`,
                  node: (
                        <p
                              style={{ color: "var(--color-primary)", fontWeight: 500, marginTop: 28 }}
                        >
                              {project.title}
                              <span style={{ ...S.mono, marginLeft: 10 }}>{project.year}</span>
                        </p>
                  ),
            });
            lines.push({
                  key: `proj-tech-${project.id}`,
                  node: (
                        <p style={{ ...S.mono, marginTop: 4 }}>
                              {project.technologies.join(" · ")}
                        </p>
                  ),
            });
            lines.push({
                  key: `proj-body-${project.id}`,
                  node: <p style={{ ...S.secondary, marginTop: 6 }}>{project.description}</p>,
            });

            if ("features" in project && project.features) {
                  lines.push({
                        key: `proj-feat-${project.id}`,
                        node: (
                              <ul
                                    style={{
                                          paddingLeft: 20,
                                          listStyle: "disc",
                                          ...S.secondary,
                                          display: "flex",
                                          flexDirection: "column",
                                          gap: 3,
                                          marginTop: 6,
                                    }}
                              >
                                    {(project.features as string[]).map((f, j) => (
                                          <li key={j}>{f}</li>
                                    ))}
                              </ul>
                        ),
                  });
            }

            if ("links" in project && project.links) {
                  lines.push({
                        key: `proj-links-${project.id}`,
                        node: (
                              <div style={{ display: "flex", gap: 20, marginTop: 8, fontSize: 14 }}>
                                    {(project.links as { text: string; url: string }[]).map((link, j) => (
                                          <a key={j} href={link.url} target="_blank" rel="noopener noreferrer">
                                                {link.text}
                                          </a>
                                    ))}
                              </div>
                        ),
                  });
            }

            if ("link" in project && project.link) {
                  const lnk = project.link as { text: string; url: string };
                  lines.push({
                        key: `proj-link-${project.id}`,
                        node: (
                              <div style={{ marginTop: 8, fontSize: 14 }}>
                                    <a href={lnk.url} target="_blank" rel="noopener noreferrer">
                                          {lnk.text}
                                    </a>
                              </div>
                        ),
                  });
            }
      });

      return lines;
}

function buildExperienceLines(): StreamLine[] {
      const lines: StreamLine[] = [];

      lines.push({
            key: "h-exp",
            node: <SectionHeading text={experienceData.header.title} />,
      });

      experienceData.experiences.forEach((exp) => {
            lines.push({
                  key: `exp-title-${exp.id}`,
                  node: (
                        <p
                              style={{ color: "var(--color-primary)", fontWeight: 500, marginTop: 24 }}
                        >
                              {exp.position} — {exp.company}
                        </p>
                  ),
            });
            lines.push({
                  key: `exp-period-${exp.id}`,
                  node: (
                        <p style={{ ...S.mono, marginTop: 4 }}>
                              {exp.period} · {exp.location}
                        </p>
                  ),
            });
            lines.push({
                  key: `exp-desc-${exp.id}`,
                  node: <p style={{ ...S.secondary, marginTop: 6 }}>{exp.description}</p>,
            });
            lines.push({
                  key: `exp-ach-${exp.id}`,
                  node: (
                        <ul
                              style={{
                                    paddingLeft: 20,
                                    listStyle: "disc",
                                    ...S.secondary,
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 4,
                                    marginTop: 8,
                              }}
                        >
                              {exp.achievements.map((a, j) => (
                                    <li key={j}>{a}</li>
                              ))}
                        </ul>
                  ),
            });
            lines.push({
                  key: `exp-tech-${exp.id}`,
                  node: (
                        <p style={{ ...S.mono, marginTop: 10, lineHeight: 2.0 }}>
                              {exp.technologies.join(" · ")}
                        </p>
                  ),
            });
      });

      return lines;
}

function buildContactLines(): StreamLine[] {
      const lines: StreamLine[] = [];

      lines.push({
            key: "h-contact",
            node: <SectionHeading text={contactData.header.title} />,
      });
      lines.push({
            key: "contact-desc",
            node: <p style={S.secondary}>{contactData.description}</p>,
      });
      lines.push({
            key: "contact-email",
            node: (
                  <p style={{ ...S.secondary, marginTop: 12 }}>
                        {contactData.email.label}{" "}
                        <a className="contact-link" href={`mailto:${contactData.email.address}`}>
                              {contactData.email.address}
                        </a>
                  </p>
            ),
      });
      lines.push({
            key: "contact-phone",
            node: (
                  <p style={S.secondary}>
                        {contactData.phone.label} {contactData.phone.number}
                  </p>
            ),
      });

      contactData.socialLinks.forEach((link, i) => {
            lines.push({
                  key: `contact-social-${i}`,
                  node: (
                        <p style={S.secondary}>
                              {link.text}{" "}
                              <a
                                    className="contact-link"
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                              >
                                    {link.url}
                              </a>
                        </p>
                  ),
            });
      });

      lines.push({
            key: "contact-resume",
            node: (
                  <p style={S.secondary}>
                        {contactData.resume.label}{" "}
                        <a
                              className="contact-link"
                              href={contactData.resume.url}
                              target="_blank"
                              rel="noopener noreferrer"
                        >
                              {contactData.resume.url}
                        </a>
                  </p>
            ),
      });

      return lines;
}

/* ── Tab definitions ──────────────────────────────── */

const TABS = ["About", "Projects", "Experience", "Contact"] as const;
type Tab = (typeof TABS)[number];

const LINE_BUILDERS: Record<Tab, () => StreamLine[]> = {
      About: buildAboutLines,
      Projects: buildProjectsLines,
      Experience: buildExperienceLines,
      Contact: buildContactLines,
};

/* ── Streaming Panel ──────────────────────────────── */

function StreamPanel({ tab }: { tab: Tab }) {
      const lines = useMemo(() => LINE_BUILDERS[tab](), [tab]);
      const { visible, done } = useStream(lines.length, tab);

      return (
            <div>
                  {lines.map((line, i) => {
                        const isLastVisible = i === visible - 1;
                        const isVisible = i < visible;
                        return (
                              <div
                                    key={line.key}
                                    style={{
                                          opacity: isVisible ? 1 : 0,
                                          transform: isVisible ? "translateY(0)" : "translateY(4px)",
                                          transition: "opacity 0.1s ease, transform 0.1s ease",
                                          display: isLastVisible ? "flex" : undefined,
                                          alignItems: isLastVisible ? "baseline" : undefined,
                                          flexWrap: isLastVisible ? "wrap" : undefined,
                                    }}
                              >
                                    {line.node}
                                    {isLastVisible && (
                                          <span className="blink-cursor" style={{ fontSize: 14, marginLeft: 2 }}>
                                                █
                                          </span>
                                    )}
                              </div>
                        );
                  })}
            </div>
      );
}

/* ── Main component ───────────────────────────────── */

export default function Portfolio() {
      const [active, setActive] = useState<Tab>("About");
      const [exiting, setExiting] = useState(false);
      const [displayed, setDisplayed] = useState<Tab>("About");

      function switchTab(tab: Tab) {
            if (tab === active) return;
            setExiting(true);
            setTimeout(() => {
                  setActive(tab);
                  setDisplayed(tab);
                  setExiting(false);
            }, 150);
      }

      return (
            <main className="portfolio-main">
                  <ThemeToggle />

                  {/* ── Header ──────────────────────────────── */}
                  <header style={{ marginBottom: 40 }}>
                        <h1 className="portfolio-title">
                              <span style={{ color: "var(--color-accent)" }}>$</span> {heroData.title}
                        </h1>
                        <p style={{ ...S.secondary, fontSize: 14, marginTop: 6 }}>
                              {heroData.subtitle.text}
                        </p>
                        <div className="hero-links">
                              {heroData.links.map((link, i) => (
                                    <a key={i} href={link.url} target="_blank" rel="noopener noreferrer">
                                          {link.text}
                                    </a>
                              ))}
                              <a href={heroData.resume.url} target="_blank" rel="noopener noreferrer">
                                    {heroData.resume.text}
                              </a>
                        </div>
                  </header>

                  {/* ── Tab bar ─────────────────────────────── */}
                  <nav className="tab-nav">
                        {TABS.map((tab) => {
                              const isActive = tab === active;
                              return (
                                    <button
                                          key={tab}
                                          ref={(el) => {
                                                if (isActive && el) {
                                                      el.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
                                                }
                                          }}
                                          onClick={() => switchTab(tab)}
                                          className="tab-btn"
                                          style={{
                                                borderBottom: isActive
                                                      ? "1px solid var(--color-accent)"
                                                      : "1px solid transparent",
                                                color: isActive ? "var(--color-accent)" : "var(--color-secondary)",
                                          }}
                                    >
                                          [ {tab} ]
                                    </button>
                              );
                        })}
                  </nav>

                  {/* ── Active panel ────────────────────────── */}
                  <div className={exiting ? "panel-exit" : ""}>
                        <StreamPanel key={displayed} tab={displayed} />
                  </div>

                  {/* ── Footer ──────────────────────────────── */}
                  <div style={S.divider} />
                  <footer style={{ ...S.secondary, fontSize: 13 }}>{aboutData.footer}</footer>
            </main>
      );
}
