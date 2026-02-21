"use client";

import { useEffect, useRef, useCallback, useState } from "react";

interface Bullet {
      x: number;
      y: number;
}

interface Enemy {
      x: number;
      y: number;
      alive: boolean;
      type: number;
}

interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      color: string;
}

interface EnemyBullet {
      x: number;
      y: number;
}

// Internal game resolution (stays fixed)
const CANVAS_W = 480;
const CANVAS_H = 640;
const PLAYER_W = 36;
const PLAYER_H = 24;
const BULLET_W = 3;
const BULLET_H = 12;
const ENEMY_SIZE = 28;
const ENEMY_COLS = 8;
const ENEMY_ROWS = 5;
const ENEMY_GAP_X = 44;
const ENEMY_GAP_Y = 38;
const ENEMY_SPEED_INIT = 1.2;
const PLAYER_SPEED = 5;
const BULLET_SPEED = 7;
const ENEMY_BULLET_SPEED = 3.5;

const COLORS = {
      bg: "#0B0C0F",
      player: "#C9A959",
      bullet: "#C9A959",
      enemyBullet: "#ff4444",
      enemy1: "#58D68D",
      enemy2: "#5DADE2",
      enemy3: "#AF7AC5",
      text: "#E6EDF3",
      dim: "#8B949E",
      accent: "#C9A959",
};

export default function SpaceInvaders({ onClose }: { onClose: () => void }) {
      const canvasRef = useRef<HTMLCanvasElement>(null);
      const wrapperRef = useRef<HTMLDivElement>(null);
      const rafRef = useRef<number>(0);
      const keysRef = useRef<Set<string>>(new Set());
      const touchRef = useRef<{ left: boolean; right: boolean; shoot: boolean }>({
            left: false,
            right: false,
            shoot: false,
      });
      const [canvasScale, setCanvasScale] = useState(1);
      const gameStateRef = useRef<{
            player: { x: number; y: number };
            bullets: Bullet[];
            enemyBullets: EnemyBullet[];
            enemies: Enemy[];
            particles: Particle[];
            enemyDir: number;
            enemySpeed: number;
            score: number;
            lives: number;
            gameOver: boolean;
            won: boolean;
            lastShot: number;
            lastEnemyShot: number;
            wave: number;
            frameCount: number;
            stars: { x: number; y: number; speed: number; brightness: number }[];
      } | null>(null);
      const [score, setScore] = useState(0);
      const [lives, setLives] = useState(3);
      const [gameOver, setGameOver] = useState(false);
      const [won, setWon] = useState(false);
      const [isMobile, setIsMobile] = useState(false);

      // Detect mobile & compute scale
      useEffect(() => {
            const update = () => {
                  const mobile = window.innerWidth < 640 || ("ontouchstart" in window);
                  setIsMobile(mobile);

                  // Available space: full viewport minus some padding for controls
                  const padX = mobile ? 16 : 80;
                  const padY = mobile ? 180 : 120; // reserve space for touch controls on mobile
                  const availW = window.innerWidth - padX;
                  const availH = window.innerHeight - padY;
                  const scaleX = availW / CANVAS_W;
                  const scaleY = availH / CANVAS_H;
                  setCanvasScale(Math.min(scaleX, scaleY, 1)); // never scale up above 1
            };
            update();
            window.addEventListener("resize", update);
            return () => window.removeEventListener("resize", update);
      }, []);

      // Prevent page scroll on touch inside the game area
      useEffect(() => {
            const prevent = (e: TouchEvent) => {
                  // Allow touch events on buttons (close, restart, controls)
                  const target = e.target as HTMLElement;
                  if (target.closest("button")) return;
                  e.preventDefault();
            };
            const wrapper = wrapperRef.current;
            if (wrapper) {
                  wrapper.addEventListener("touchmove", prevent, { passive: false });
                  wrapper.addEventListener("touchstart", prevent, { passive: false });
            }
            return () => {
                  if (wrapper) {
                        wrapper.removeEventListener("touchmove", prevent);
                        wrapper.removeEventListener("touchstart", prevent);
                  }
            };
      }, []);

      const initEnemies = useCallback((wave: number): Enemy[] => {
            const enemies: Enemy[] = [];
            const offsetX = (CANVAS_W - (ENEMY_COLS * ENEMY_GAP_X - (ENEMY_GAP_X - ENEMY_SIZE))) / 2;
            for (let row = 0; row < ENEMY_ROWS; row++) {
                  for (let col = 0; col < ENEMY_COLS; col++) {
                        enemies.push({
                              x: offsetX + col * ENEMY_GAP_X,
                              y: 50 + row * ENEMY_GAP_Y,
                              alive: true,
                              type: row < 1 ? 2 : row < 3 ? 1 : 0,
                        });
                  }
            }
            return enemies;
      }, []);

      const initStars = useCallback(() => {
            return Array.from({ length: 60 }, () => ({
                  x: Math.random() * CANVAS_W,
                  y: Math.random() * CANVAS_H,
                  speed: 0.2 + Math.random() * 0.5,
                  brightness: 0.3 + Math.random() * 0.7,
            }));
      }, []);

      const initGame = useCallback(() => {
            gameStateRef.current = {
                  player: { x: CANVAS_W / 2 - PLAYER_W / 2, y: CANVAS_H - 60 },
                  bullets: [],
                  enemyBullets: [],
                  enemies: initEnemies(1),
                  particles: [],
                  enemyDir: 1,
                  enemySpeed: ENEMY_SPEED_INIT,
                  score: 0,
                  lives: 3,
                  gameOver: false,
                  won: false,
                  lastShot: 0,
                  lastEnemyShot: 0,
                  wave: 1,
                  frameCount: 0,
                  stars: initStars(),
            };
            setScore(0);
            setLives(3);
            setGameOver(false);
            setWon(false);
      }, [initEnemies, initStars]);

      const spawnParticles = (x: number, y: number, color: string, count: number) => {
            const gs = gameStateRef.current;
            if (!gs) return;
            for (let i = 0; i < count; i++) {
                  gs.particles.push({
                        x,
                        y,
                        vx: (Math.random() - 0.5) * 4,
                        vy: (Math.random() - 0.5) * 4,
                        life: 20 + Math.random() * 20,
                        color,
                  });
            }
      };

      const drawPlayer = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
            ctx.fillStyle = COLORS.player;
            ctx.fillRect(x + 4, y + 8, PLAYER_W - 8, PLAYER_H - 8);
            ctx.fillRect(x + 14, y + 2, 8, 10);
            ctx.fillRect(x, y + 14, 6, 10);
            ctx.fillRect(x + PLAYER_W - 6, y + 14, 6, 10);
            ctx.shadowColor = COLORS.player;
            ctx.shadowBlur = 10;
            ctx.fillRect(x + 14, y + 2, 8, 4);
            ctx.shadowBlur = 0;
      };

      const drawEnemy = (ctx: CanvasRenderingContext2D, e: Enemy, frame: number) => {
            const colors = [COLORS.enemy1, COLORS.enemy2, COLORS.enemy3];
            const color = colors[e.type];
            const bob = Math.sin(frame * 0.05 + e.x * 0.01) * 2;
            const y = e.y + bob;

            ctx.fillStyle = color;
            ctx.shadowColor = color;
            ctx.shadowBlur = 6;

            if (e.type === 0) {
                  ctx.fillRect(e.x + 4, y + 4, 20, 20);
                  ctx.fillRect(e.x, y + 8, 4, 12);
                  ctx.fillRect(e.x + 24, y + 8, 4, 12);
                  ctx.fillStyle = COLORS.bg;
                  ctx.fillRect(e.x + 8, y + 10, 4, 4);
                  ctx.fillRect(e.x + 16, y + 10, 4, 4);
            } else if (e.type === 1) {
                  ctx.fillRect(e.x + 6, y + 2, 16, 24);
                  ctx.fillRect(e.x + 2, y + 6, 24, 16);
                  ctx.fillStyle = COLORS.bg;
                  ctx.fillRect(e.x + 9, y + 9, 4, 4);
                  ctx.fillRect(e.x + 17, y + 9, 4, 4);
                  ctx.fillStyle = color;
                  ctx.fillRect(e.x, y, 4, 4);
                  ctx.fillRect(e.x + 24, y, 4, 4);
                  ctx.fillRect(e.x, y + 24, 4, 4);
                  ctx.fillRect(e.x + 24, y + 24, 4, 4);
            } else {
                  ctx.fillRect(e.x + 4, y + 8, 20, 16);
                  ctx.fillRect(e.x + 2, y + 4, 6, 8);
                  ctx.fillRect(e.x + 20, y + 4, 6, 8);
                  ctx.fillRect(e.x + 10, y, 8, 8);
                  ctx.fillStyle = COLORS.bg;
                  ctx.fillRect(e.x + 8, y + 12, 5, 4);
                  ctx.fillRect(e.x + 16, y + 12, 5, 4);
            }

            ctx.shadowBlur = 0;
      };

      useEffect(() => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            initGame();

            const handleKeyDown = (e: KeyboardEvent) => {
                  keysRef.current.add(e.key);
                  if (["ArrowLeft", "ArrowRight", " ", "ArrowUp", "ArrowDown"].includes(e.key)) {
                        e.preventDefault();
                  }
            };
            const handleKeyUp = (e: KeyboardEvent) => {
                  keysRef.current.delete(e.key);
            };

            window.addEventListener("keydown", handleKeyDown);
            window.addEventListener("keyup", handleKeyUp);

            const gameLoop = () => {
                  const gs = gameStateRef.current;
                  if (!gs) return;

                  gs.frameCount++;
                  const keys = keysRef.current;
                  const touch = touchRef.current;
                  const now = gs.frameCount;

                  // --- Update stars ---
                  gs.stars.forEach((s) => {
                        s.y += s.speed;
                        if (s.y > CANVAS_H) {
                              s.y = 0;
                              s.x = Math.random() * CANVAS_W;
                        }
                  });

                  if (!gs.gameOver && !gs.won) {
                        // --- Player movement (keyboard + touch) ---
                        if (keys.has("ArrowLeft") || keys.has("a") || touch.left) {
                              gs.player.x = Math.max(0, gs.player.x - PLAYER_SPEED);
                        }
                        if (keys.has("ArrowRight") || keys.has("d") || touch.right) {
                              gs.player.x = Math.min(CANVAS_W - PLAYER_W, gs.player.x + PLAYER_SPEED);
                        }

                        // --- Shooting (keyboard + touch) ---
                        if ((keys.has(" ") || touch.shoot) && now - gs.lastShot > 12) {
                              gs.bullets.push({
                                    x: gs.player.x + PLAYER_W / 2 - BULLET_W / 2,
                                    y: gs.player.y - BULLET_H,
                              });
                              gs.lastShot = now;
                        }

                        // --- Update bullets ---
                        gs.bullets = gs.bullets.filter((b) => {
                              b.y -= BULLET_SPEED;
                              return b.y > -BULLET_H;
                        });

                        // --- Enemy movement ---
                        let shiftDown = false;
                        const aliveEnemies = gs.enemies.filter((e) => e.alive);

                        aliveEnemies.forEach((e) => {
                              e.x += gs.enemySpeed * gs.enemyDir;
                        });

                        for (const e of aliveEnemies) {
                              if (e.x + ENEMY_SIZE > CANVAS_W - 10 || e.x < 10) {
                                    shiftDown = true;
                                    break;
                              }
                        }

                        if (shiftDown) {
                              gs.enemyDir *= -1;
                              aliveEnemies.forEach((e) => {
                                    e.y += 18;
                              });
                        }

                        // --- Enemy shooting ---
                        if (now - gs.lastEnemyShot > 50 && aliveEnemies.length > 0) {
                              const shooter = aliveEnemies[Math.floor(Math.random() * aliveEnemies.length)];
                              gs.enemyBullets.push({
                                    x: shooter.x + ENEMY_SIZE / 2 - BULLET_W / 2,
                                    y: shooter.y + ENEMY_SIZE,
                              });
                              gs.lastEnemyShot = now;
                        }

                        // --- Update enemy bullets ---
                        gs.enemyBullets = gs.enemyBullets.filter((b) => {
                              b.y += ENEMY_BULLET_SPEED;
                              return b.y < CANVAS_H + 10;
                        });

                        // --- Collision: bullet vs enemy ---
                        gs.bullets.forEach((b, bi) => {
                              gs.enemies.forEach((e) => {
                                    if (
                                          e.alive &&
                                          b.x < e.x + ENEMY_SIZE &&
                                          b.x + BULLET_W > e.x &&
                                          b.y < e.y + ENEMY_SIZE &&
                                          b.y + BULLET_H > e.y
                                    ) {
                                          e.alive = false;
                                          gs.bullets.splice(bi, 1);
                                          const pts = (e.type + 1) * 100;
                                          gs.score += pts;
                                          setScore(gs.score);
                                          const colors = [COLORS.enemy1, COLORS.enemy2, COLORS.enemy3];
                                          spawnParticles(e.x + ENEMY_SIZE / 2, e.y + ENEMY_SIZE / 2, colors[e.type], 8);
                                    }
                              });
                        });

                        // --- Collision: enemy bullet vs player ---
                        gs.enemyBullets = gs.enemyBullets.filter((b) => {
                              if (
                                    b.x < gs.player.x + PLAYER_W &&
                                    b.x + BULLET_W > gs.player.x &&
                                    b.y < gs.player.y + PLAYER_H &&
                                    b.y + BULLET_H > gs.player.y
                              ) {
                                    gs.lives--;
                                    setLives(gs.lives);
                                    spawnParticles(gs.player.x + PLAYER_W / 2, gs.player.y + PLAYER_H / 2, COLORS.player, 12);
                                    if (gs.lives <= 0) {
                                          gs.gameOver = true;
                                          setGameOver(true);
                                    }
                                    return false;
                              }
                              return true;
                        });

                        // --- Enemy reached player ---
                        for (const e of aliveEnemies) {
                              if (e.y + ENEMY_SIZE > gs.player.y) {
                                    gs.gameOver = true;
                                    setGameOver(true);
                                    break;
                              }
                        }

                        // --- Win condition ---
                        if (aliveEnemies.length === 0 && !gs.gameOver) {
                              gs.wave++;
                              gs.enemies = initEnemies(gs.wave);
                              gs.enemySpeed = ENEMY_SPEED_INIT + gs.wave * 0.3;
                              gs.enemyBullets = [];
                        }
                  }

                  // --- Restart ---
                  if ((gs.gameOver || gs.won) && keys.has("Enter")) {
                        initGame();
                  }

                  // --- Update particles ---
                  gs.particles = gs.particles.filter((p) => {
                        p.x += p.vx;
                        p.y += p.vy;
                        p.life--;
                        return p.life > 0;
                  });

                  // === DRAW ===
                  ctx.fillStyle = COLORS.bg;
                  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

                  gs.stars.forEach((s) => {
                        ctx.fillStyle = `rgba(230, 237, 243, ${s.brightness * 0.4})`;
                        ctx.fillRect(s.x, s.y, 1.5, 1.5);
                  });

                  ctx.fillStyle = "rgba(255,255,255,0.015)";
                  for (let i = 0; i < CANVAS_H; i += 3) {
                        ctx.fillRect(0, i, CANVAS_W, 1);
                  }

                  if (!gs.gameOver) {
                        drawPlayer(ctx, gs.player.x, gs.player.y);
                  }

                  gs.bullets.forEach((b) => {
                        ctx.fillStyle = COLORS.bullet;
                        ctx.shadowColor = COLORS.bullet;
                        ctx.shadowBlur = 8;
                        ctx.fillRect(b.x, b.y, BULLET_W, BULLET_H);
                        ctx.shadowBlur = 0;
                  });

                  gs.enemyBullets.forEach((b) => {
                        ctx.fillStyle = COLORS.enemyBullet;
                        ctx.shadowColor = COLORS.enemyBullet;
                        ctx.shadowBlur = 6;
                        ctx.fillRect(b.x, b.y, BULLET_W, BULLET_H);
                        ctx.shadowBlur = 0;
                  });

                  gs.enemies.forEach((e) => {
                        if (e.alive) drawEnemy(ctx, e, gs.frameCount);
                  });

                  gs.particles.forEach((p) => {
                        const alpha = p.life / 40;
                        ctx.fillStyle = p.color + Math.floor(alpha * 255).toString(16).padStart(2, "0");
                        ctx.fillRect(p.x - 2, p.y - 2, 4, 4);
                  });

                  // HUD
                  ctx.fillStyle = COLORS.dim;
                  ctx.font = "14px 'JetBrains Mono', monospace";
                  ctx.textAlign = "left";
                  ctx.fillText(`SCORE: ${gs.score}`, 16, 28);
                  ctx.textAlign = "right";
                  ctx.fillText(`LIVES: ${"♥".repeat(gs.lives)}`, CANVAS_W - 16, 28);
                  ctx.textAlign = "center";
                  ctx.fillText(`WAVE ${gs.wave}`, CANVAS_W / 2, 28);

                  // Game Over overlay on canvas
                  if (gs.gameOver) {
                        ctx.fillStyle = "rgba(11, 12, 15, 0.75)";
                        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
                        ctx.fillStyle = COLORS.enemyBullet;
                        ctx.font = "bold 32px 'JetBrains Mono', monospace";
                        ctx.textAlign = "center";
                        ctx.fillText("GAME OVER", CANVAS_W / 2, CANVAS_H / 2 - 20);
                        ctx.fillStyle = COLORS.dim;
                        ctx.font = "16px 'JetBrains Mono', monospace";
                        ctx.fillText(`Final Score: ${gs.score}`, CANVAS_W / 2, CANVAS_H / 2 + 20);
                        ctx.fillStyle = COLORS.accent;
                        ctx.fillText("Tap or press ENTER", CANVAS_W / 2, CANVAS_H / 2 + 56);
                  }

                  rafRef.current = requestAnimationFrame(gameLoop);
            };

            rafRef.current = requestAnimationFrame(gameLoop);

            return () => {
                  cancelAnimationFrame(rafRef.current);
                  window.removeEventListener("keydown", handleKeyDown);
                  window.removeEventListener("keyup", handleKeyUp);
            };
      }, [initGame, initEnemies, initStars]);

      // Touch handler helpers
      const handleTouchBtn = useCallback(
            (btn: "left" | "right" | "shoot", active: boolean) => {
                  touchRef.current[btn] = active;
            },
            [],
      );

      // Tap/touch canvas to restart on game over
      const handleRestart = useCallback(() => {
            const gs = gameStateRef.current;
            if (gs && gs.gameOver) {
                  initGame();
            }
      }, [initGame]);

      const handleCanvasTouchEnd = useCallback(
            (e: React.TouchEvent) => {
                  e.stopPropagation();
                  handleRestart();
            },
            [handleRestart],
      );

      const scaledW = Math.round(CANVAS_W * canvasScale);
      const scaledH = Math.round(CANVAS_H * canvasScale);

      return (
            <div
                  ref={wrapperRef}
                  className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
                  style={{ background: "rgba(11, 12, 15, 0.95)", backdropFilter: "blur(8px)" }}
            >
                  {/* Close button - always top right */}
                  <button
                        onClick={onClose}
                        onTouchEnd={(e) => { e.preventDefault(); e.stopPropagation(); onClose(); }}
                        className="absolute top-3 right-3 sm:top-4 sm:right-4 z-[10001] flex h-12 w-12 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-[var(--color-divider)] bg-[var(--color-bg)] text-[var(--color-secondary)] transition-colors hover:text-[var(--color-accent)] hover:border-[var(--color-accent)] cursor-pointer text-xl sm:text-lg"
                        title="Close (ESC)"
                  >
                        ✕
                  </button>

                  {/* HUD bar above canvas */}
                  <div className="mb-2 flex items-center gap-2 sm:gap-3 px-4" style={{ maxWidth: scaledW }}>
                        <span className="font-mono text-[10px] sm:text-sm text-[var(--color-secondary)] whitespace-nowrap">
                              // SPACE INVADERS
                        </span>
                        <span className="font-mono text-[10px] sm:text-xs text-[var(--color-accent)] whitespace-nowrap">
                              SCORE: {score} | {"♥".repeat(lives)}
                        </span>
                  </div>

                  {/* Scaled canvas */}
                  <div
                        className="rounded-lg border border-[var(--color-divider)] overflow-hidden"
                        style={{
                              width: scaledW,
                              height: scaledH,
                              boxShadow: "0 0 40px rgba(201,169,89,0.08)",
                        }}
                        onClick={handleRestart}
                        onTouchEnd={handleCanvasTouchEnd}
                  >
                        <canvas
                              ref={canvasRef}
                              width={CANVAS_W}
                              height={CANVAS_H}
                              className="block"
                              style={{
                                    width: scaledW,
                                    height: scaledH,
                              }}
                              tabIndex={0}
                              autoFocus
                        />
                  </div>

                  {/* Controls: desktop keyboard hints, mobile touch buttons */}
                  {isMobile ? (
                        /* ── Mobile touch controls ── */
                        <div
                              className="mt-3 flex w-full flex-col items-center gap-3 px-4"
                              style={{ maxWidth: Math.max(scaledW, 320) }}
                        >
                              {/* Restart button - visible only on game over */}
                              {gameOver && (
                                    <button
                                          className="w-full rounded-lg border border-[var(--color-accent)] bg-[rgba(201,169,89,0.1)] py-3 font-mono text-sm font-bold text-[var(--color-accent)] active:bg-[rgba(201,169,89,0.25)] active:scale-[0.98] transition-all select-none"
                                          onTouchEnd={(e) => { e.preventDefault(); e.stopPropagation(); handleRestart(); }}
                                          onClick={handleRestart}
                                    >
                                          ▶ PLAY AGAIN
                                    </button>
                              )}

                              <div className="flex w-full items-center justify-between">
                                    {/* Left / Right buttons */}
                                    <div className="flex gap-3">
                                          <button
                                                className="flex h-14 w-14 items-center justify-center rounded-xl border border-[var(--color-divider)] bg-[var(--color-bg)] text-[var(--color-accent)] text-2xl select-none active:bg-[rgba(201,169,89,0.15)] active:scale-95 transition-transform"
                                                onTouchStart={(e) => { e.preventDefault(); handleTouchBtn("left", true); }}
                                                onTouchEnd={(e) => { e.preventDefault(); handleTouchBtn("left", false); }}
                                                onTouchCancel={() => handleTouchBtn("left", false)}
                                                onMouseDown={() => handleTouchBtn("left", true)}
                                                onMouseUp={() => handleTouchBtn("left", false)}
                                                onMouseLeave={() => handleTouchBtn("left", false)}
                                                aria-label="Move left"
                                          >
                                                ◀
                                          </button>
                                          <button
                                                className="flex h-14 w-14 items-center justify-center rounded-xl border border-[var(--color-divider)] bg-[var(--color-bg)] text-[var(--color-accent)] text-2xl select-none active:bg-[rgba(201,169,89,0.15)] active:scale-95 transition-transform"
                                                onTouchStart={(e) => { e.preventDefault(); handleTouchBtn("right", true); }}
                                                onTouchEnd={(e) => { e.preventDefault(); handleTouchBtn("right", false); }}
                                                onTouchCancel={() => handleTouchBtn("right", false)}
                                                onMouseDown={() => handleTouchBtn("right", true)}
                                                onMouseUp={() => handleTouchBtn("right", false)}
                                                onMouseLeave={() => handleTouchBtn("right", false)}
                                                aria-label="Move right"
                                          >
                                                ▶
                                          </button>
                                    </div>

                                    {/* Shoot button */}
                                    <button
                                          className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-[var(--color-accent)] bg-[rgba(201,169,89,0.1)] text-[var(--color-accent)] text-sm font-bold select-none active:bg-[rgba(201,169,89,0.3)] active:scale-95 transition-transform font-mono"
                                          onTouchStart={(e) => { e.preventDefault(); handleTouchBtn("shoot", true); }}
                                          onTouchEnd={(e) => { e.preventDefault(); handleTouchBtn("shoot", false); }}
                                          onTouchCancel={() => handleTouchBtn("shoot", false)}
                                          onMouseDown={() => handleTouchBtn("shoot", true)}
                                          onMouseUp={() => handleTouchBtn("shoot", false)}
                                          onMouseLeave={() => handleTouchBtn("shoot", false)}
                                          aria-label="Shoot"
                                    >
                                          FIRE
                                    </button>
                              </div>
                        </div>
                  ) : (
                        /* ── Desktop keyboard hints ── */
                        <div className="mt-3 flex gap-6 font-mono text-xs text-[var(--color-secondary)]">
                              <span>
                                    <kbd className="rounded border border-[var(--color-divider)] bg-[var(--color-bg)] px-1.5 py-0.5 text-[var(--color-accent)]">
                                          ← →
                                    </kbd>{" "}
                                    Move
                              </span>
                              <span>
                                    <kbd className="rounded border border-[var(--color-divider)] bg-[var(--color-bg)] px-1.5 py-0.5 text-[var(--color-accent)]">
                                          SPACE
                                    </kbd>{" "}
                                    Shoot
                              </span>
                              <span>
                                    <kbd className="rounded border border-[var(--color-divider)] bg-[var(--color-bg)] px-1.5 py-0.5 text-[var(--color-accent)]">
                                          ESC
                                    </kbd>{" "}
                                    Close
                              </span>
                        </div>
                  )}
            </div>
      );
}
