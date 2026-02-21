"use client";

import { useState, useRef, useEffect, useCallback, type KeyboardEvent } from "react";
import ThemeToggle from "./ThemeToggle";

import heroData from "@/data/hero.json";
import aboutData from "@/data/about.json";
import skillsData from "@/data/skills.json";
import projectsData from "@/data/projects.json";
import experienceData from "@/data/experience.json";
import contactData from "@/data/contact.json";

/* ── Types ──────────────────────────────────────────── */

interface OutputLine {
      text: string;
      color?: "primary" | "secondary" | "accent" | "success" | "error";
}

interface HistoryEntry {
      command: string;
      output: OutputLine[];
}

/* ── Command Handlers ───────────────────────────────── */

function cmdHelp(): OutputLine[] {
      return [
            { text: "Available commands:", color: "primary" },
            { text: "" },
            { text: "  help          Show this help message", color: "secondary" },
            { text: "  about         Who I am", color: "secondary" },
            { text: "  skills        Tech stack & tools", color: "secondary" },
            { text: "  projects      Selected work", color: "secondary" },
            { text: "  experience    Work history", color: "secondary" },
            { text: "  contact       Get in touch", color: "secondary" },
            { text: "  status        Current availability", color: "secondary" },
            { text: "  clear         Clear terminal", color: "secondary" },
      ];
}

function cmdAbout(): OutputLine[] {
      return [
            { text: "Phong Nguyen", color: "primary" },
            { text: "Flutter Developer", color: "accent" },
            { text: "" },
            { text: heroData.description, color: "secondary" },
            { text: "" },
            ...aboutData.items.map((item) => ({
                  text: item.description,
                  color: "secondary" as const,
            })),
      ];
}

function cmdSkills(): OutputLine[] {
      const allSkills = skillsData.categories.flatMap((cat) => cat.skills);
      const grouped: Record<string, string[]> = {};
      for (const cat of skillsData.categories) {
            grouped[cat.name] = cat.skills.map((s) => s.name);
      }

      const lines: OutputLine[] = [
            { text: "Tech Stack", color: "primary" },
            { text: "" },
      ];

      for (const [category, skills] of Object.entries(grouped)) {
            lines.push({ text: `  ${category}`, color: "accent" });
            lines.push({ text: `  ${skills.join(" · ")}`, color: "secondary" });
            lines.push({ text: "" });
      }

      lines.push({ text: `  ${allSkills.length} technologies total`, color: "secondary" });
      return lines;
}

function cmdProjects(): OutputLine[] {
      const lines: OutputLine[] = [
            { text: "Selected Projects", color: "primary" },
            { text: "" },
      ];

      for (const project of projectsData.projects) {
            lines.push({ text: `  [${project.title}]  ${project.year}`, color: "accent" });
            lines.push({ text: `  ${project.technologies.join(" · ")}`, color: "secondary" });
            lines.push({ text: "" });
            lines.push({ text: `  ${project.description}`, color: "secondary" });
            if ("features" in project && project.features) {
                  lines.push({ text: "" });
                  for (const f of project.features) {
                        lines.push({ text: `    • ${f}`, color: "secondary" });
                  }
            }
            if ("links" in project && project.links) {
                  lines.push({ text: "" });
                  for (const link of project.links) {
                        lines.push({ text: `    → ${link.text}: ${link.url}`, color: "accent" });
                  }
            }
            lines.push({ text: "" });
            lines.push({ text: "  ─────────────────────────────────────────", color: "secondary" });
            lines.push({ text: "" });
      }

      return lines;
}

function cmdExperience(): OutputLine[] {
      const lines: OutputLine[] = [
            { text: "Work Experience", color: "primary" },
            { text: "" },
      ];

      for (const exp of experienceData.experiences) {
            lines.push({ text: `  ${exp.position} — ${exp.company}`, color: "primary" });
            lines.push({ text: `  ${exp.period}  ·  ${exp.location}`, color: "secondary" });
            lines.push({ text: "" });
            lines.push({ text: `  ${exp.description}`, color: "secondary" });
            lines.push({ text: "" });
            for (const a of exp.achievements) {
                  lines.push({ text: `    • ${a}`, color: "secondary" });
            }
            lines.push({ text: "" });
      }

      return lines;
}

function cmdContact(): OutputLine[] {
      return [
            { text: "Contact", color: "primary" },
            { text: "" },
            { text: `  Email     ${contactData.email.address}`, color: "accent" },
            { text: `  Phone     ${contactData.phone.number}`, color: "secondary" },
            ...contactData.socialLinks.map((link) => ({
                  text: `  ${link.text.padEnd(10)}${link.url}`,
                  color: "accent" as const,
            })),
            { text: "" },
            { text: `  Resume    ${heroData.resume.url}`, color: "accent" },
      ];
}

function cmdStatus(): OutputLine[] {
      return [
            { text: "" },
            { text: "  ✓ 2+ years production experience", color: "success" },
            { text: "  ✓ Built 4 released applications", color: "success" },
            { text: "  ✓ Performance optimization mindset", color: "success" },
            { text: "  ✓ Clean architecture approach", color: "success" },
            { text: "" },
            { text: "  ✓ Open for Mid-level Flutter opportunities", color: "success" },
            { text: "" },
      ];
}

function executeCommand(input: string): { output: OutputLine[]; clear: boolean } {
      const cmd = input.trim().toLowerCase();

      if (cmd === "clear") return { output: [], clear: true };

      const commands: Record<string, () => OutputLine[]> = {
            help: cmdHelp,
            about: cmdAbout,
            skills: cmdSkills,
            projects: cmdProjects,
            experience: cmdExperience,
            contact: cmdContact,
            status: cmdStatus,
      };

      if (cmd === "") return { output: [], clear: false };

      const handler = commands[cmd];
      if (handler) return { output: handler(), clear: false };

      return {
            output: [
                  { text: `Command not found: ${cmd}`, color: "error" },
                  { text: 'Type "help" to see available commands.', color: "secondary" },
            ],
            clear: false,
      };
}

/* ── Welcome message ────────────────────────────────── */

function getWelcome(): OutputLine[] {
      return [
            { text: "Phong Nguyen — Flutter Developer", color: "primary" },
            { text: "Portfolio Terminal v1.0.0", color: "secondary" },
            { text: "" },
            { text: 'Type "help" to see available commands.', color: "secondary" },
      ];
}

/* ── Color resolver ─────────────────────────────────── */

function colorVar(c?: string): string {
      switch (c) {
            case "accent": return "var(--color-accent)";
            case "success": return "var(--color-success)";
            case "error": return "#F85149";
            case "secondary": return "var(--color-secondary)";
            default: return "var(--color-primary)";
      }
}

/* ── Terminal Component ─────────────────────────────── */

export default function Terminal() {
      const [history, setHistory] = useState<HistoryEntry[]>([]);
      const [welcomeLines] = useState<OutputLine[]>(getWelcome);
      const [input, setInput] = useState("");
      const [cmdHistory, setCmdHistory] = useState<string[]>([]);
      const [historyIdx, setHistoryIdx] = useState(-1);
      const scrollRef = useRef<HTMLDivElement>(null);
      const inputRef = useRef<HTMLInputElement>(null);

      /* auto-scroll */
      useEffect(() => {
            if (scrollRef.current) {
                  scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
            }
      }, [history]);

      /* focus input on click anywhere in terminal body */
      const focusInput = useCallback(() => {
            inputRef.current?.focus();
      }, []);

      const handleSubmit = () => {
            const trimmed = input.trim();
            const { output, clear } = executeCommand(trimmed);

            if (clear) {
                  setHistory([]);
                  setInput("");
                  if (trimmed) {
                        setCmdHistory((prev) => [trimmed, ...prev]);
                  }
                  setHistoryIdx(-1);
                  return;
            }

            if (trimmed) {
                  setCmdHistory((prev) => [trimmed, ...prev]);
            }

            setHistory((prev) => [...prev, { command: trimmed, output }]);
            setInput("");
            setHistoryIdx(-1);
      };

      const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter") {
                  e.preventDefault();
                  handleSubmit();
            } else if (e.key === "ArrowUp") {
                  e.preventDefault();
                  if (cmdHistory.length === 0) return;
                  const next = Math.min(historyIdx + 1, cmdHistory.length - 1);
                  setHistoryIdx(next);
                  setInput(cmdHistory[next]);
            } else if (e.key === "ArrowDown") {
                  e.preventDefault();
                  if (historyIdx <= 0) {
                        setHistoryIdx(-1);
                        setInput("");
                        return;
                  }
                  const next = historyIdx - 1;
                  setHistoryIdx(next);
                  setInput(cmdHistory[next]);
            }
      };

      return (
            <div
                  style={{
                        maxWidth: 900,
                        width: "100%",
                        margin: "0 auto",
                        border: "1px solid var(--color-border)",
                        borderRadius: 8,
                        overflow: "hidden",
                        display: "flex",
                        flexDirection: "column",
                        height: "min(85vh, 780px)",
                        background: "var(--color-bg)",
                  }}
            >
                  {/* ── Title bar ───────────────────────────────── */}
                  <div
                        style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              padding: "10px 16px",
                              borderBottom: "1px solid var(--color-border)",
                              flexShrink: 0,
                        }}
                  >
                        {/* macOS dots */}
                        <div style={{ display: "flex", gap: 8 }}>
                              <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#FF5F57" }} />
                              <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#FEBC2E" }} />
                              <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#28C840" }} />
                        </div>

                        <span style={{ color: "var(--color-secondary)", fontSize: 13 }}>
                              portfolio — zsh
                        </span>

                        <ThemeToggle />
                  </div>

                  {/* ── Terminal body ───────────────────────────── */}
                  <div
                        ref={scrollRef}
                        onClick={focusInput}
                        style={{
                              flex: 1,
                              overflowY: "auto",
                              padding: "20px 24px",
                              cursor: "text",
                        }}
                  >
                        {/* Welcome */}
                        {welcomeLines.map((line, i) => (
                              <div key={`w-${i}`} style={{ color: colorVar(line.color), minHeight: line.text ? undefined : "1em" }}>
                                    {line.text || "\u00A0"}
                              </div>
                        ))}

                        {welcomeLines.length > 0 && <div style={{ height: 16 }} />}

                        {/* Command history */}
                        {history.map((entry, i) => (
                              <div key={i} style={{ marginBottom: 16 }}>
                                    {/* The typed command */}
                                    <div>
                                          <span style={{ color: "var(--color-success)" }}>❯ </span>
                                          <span style={{ color: "var(--color-accent)" }}>{entry.command || "\u00A0"}</span>
                                    </div>

                                    {/* Output */}
                                    {entry.output.length > 0 && (
                                          <div style={{ marginTop: 8 }}>
                                                {entry.output.map((line, j) => (
                                                      <div
                                                            key={j}
                                                            style={{
                                                                  color: colorVar(line.color),
                                                                  minHeight: line.text ? undefined : "0.6em",
                                                                  whiteSpace: "pre-wrap",
                                                                  wordBreak: "break-word",
                                                            }}
                                                      >
                                                            {line.text || "\u00A0"}
                                                      </div>
                                                ))}
                                          </div>
                                    )}
                              </div>
                        ))}

                        {/* ── Input line ──────────────────────────── */}
                        <div style={{ display: "flex", alignItems: "center" }}>
                              <span style={{ color: "var(--color-success)", marginRight: 8, flexShrink: 0 }}>❯</span>
                              <input
                                    ref={inputRef}
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    autoFocus
                                    spellCheck={false}
                                    autoComplete="off"
                                    autoCapitalize="off"
                                    style={{
                                          flex: 1,
                                          background: "transparent",
                                          border: "none",
                                          outline: "none",
                                          color: "var(--color-accent)",
                                          fontFamily: "inherit",
                                          fontSize: "inherit",
                                          lineHeight: "inherit",
                                          padding: 0,
                                          caretColor: "var(--color-primary)",
                                    }}
                              />
                        </div>
                  </div>
            </div>
      );
}
