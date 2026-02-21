"use client";

import { useState, useEffect, useCallback } from "react";
import SpaceInvaders from "./SpaceInvaders";

export default function FloatingGameButton() {
      const [open, setOpen] = useState(false);
      const [pulse, setPulse] = useState(true);

      const handleClose = useCallback(() => setOpen(false), []);

      // ESC to close
      useEffect(() => {
            const onKey = (e: KeyboardEvent) => {
                  if (e.key === "Escape" && open) {
                        setOpen(false);
                  }
            };
            window.addEventListener("keydown", onKey);
            return () => window.removeEventListener("keydown", onKey);
      }, [open]);

      // Stop pulse after first interaction
      useEffect(() => {
            if (open) setPulse(false);
      }, [open]);

      return (
            <>
                  {/* Floating Button */}
                  <button
                        onClick={() => setOpen(true)}
                        className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-[9998] flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full border border-[var(--color-divider)] bg-[var(--color-bg)] text-[var(--color-accent)] shadow-lg transition-all duration-300 hover:scale-110 hover:border-[var(--color-accent)] hover:shadow-[0_0_20px_rgba(201,169,89,0.3)] cursor-pointer group"
                        title="Play Space Invaders!"
                        aria-label="Open Space Invaders game"
                  >
                        {/* Virus / alien icon SVG */}
                        <svg
                              width="28"
                              height="28"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              className="transition-transform duration-300 group-hover:rotate-12"
                        >
                              {/* Main body */}
                              <circle cx="12" cy="12" r="6" fill="currentColor" opacity="0.2" />
                              <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="1.5" />
                              {/* Spikes */}
                              <line x1="12" y1="2" x2="12" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                              <line x1="12" y1="18" x2="12" y2="22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                              <line x1="2" y1="12" x2="6" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                              <line x1="18" y1="12" x2="22" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                              {/* Diagonal spikes */}
                              <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                              <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                              <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                              <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                              {/* Tip circles */}
                              <circle cx="12" cy="2" r="1.2" fill="currentColor" />
                              <circle cx="12" cy="22" r="1.2" fill="currentColor" />
                              <circle cx="2" cy="12" r="1.2" fill="currentColor" />
                              <circle cx="22" cy="12" r="1.2" fill="currentColor" />
                              <circle cx="4.93" cy="4.93" r="1" fill="currentColor" />
                              <circle cx="19.07" cy="19.07" r="1" fill="currentColor" />
                              <circle cx="4.93" cy="19.07" r="1" fill="currentColor" />
                              <circle cx="19.07" cy="4.93" r="1" fill="currentColor" />
                              {/* Eyes */}
                              <circle cx="10" cy="11" r="1.2" fill="currentColor" />
                              <circle cx="14" cy="11" r="1.2" fill="currentColor" />
                              {/* Mouth */}
                              <path d="M10 14 Q12 15.5 14 14" stroke="currentColor" strokeWidth="1" strokeLinecap="round" fill="none" />
                        </svg>

                        {/* Pulse ring */}
                        {pulse && (
                              <span className="absolute inset-0 rounded-full border-2 border-[var(--color-accent)] animate-ping opacity-30 pointer-events-none" />
                        )}
                  </button>

                  {/* Game modal */}
                  {open && <SpaceInvaders onClose={handleClose} />}
            </>
      );
}
