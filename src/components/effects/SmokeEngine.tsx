"use client";

import { useEffect, useRef } from "react";

interface SmokeEngineProps {
  className?: string;
}

interface Plume {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  life: number;
  maxLife: number;
  opacity: number;
  side: "left" | "right";
  phase: number;
}

const PINK = [255, 46, 166] as const;
const BLUE = [39, 184, 255] as const;
const VIDEO = "/videos/smoke-bg.mp4";

function spawnPlume(w: number, h: number, side: "left" | "right"): Plume {
  const isLeft = side === "left";
  return {
    x: isLeft ? w * (0.02 + Math.random() * 0.22) : w * (0.76 + Math.random() * 0.22),
    y: h + Math.random() * 40,
    vx: (Math.random() - 0.5) * 0.3 + (isLeft ? 0.1 : -0.1),
    vy: -(0.2 + Math.random() * 0.35),
    r: 50 + Math.random() * 80,
    life: 0,
    maxLife: 180 + Math.random() * 120,
    opacity: 0,
    side,
    phase: Math.random() * Math.PI * 2,
  };
}

export function SmokeEngine({ className = "" }: SmokeEngineProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const plumesRef = useRef<Plume[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, active: false });
  const scrollRef = useRef(0);
  const rafRef = useRef(0);
  const visibleRef = useRef(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    wrap.querySelector("video")?.play().catch(() => {});

    const ctx = canvas.getContext("2d", { alpha: true, desynchronized: true });
    if (!ctx) return;

    const mobile = window.matchMedia("(max-width: 768px)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const maxPlumes = reduced ? 0 : mobile ? 6 : 12;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let w = 0;
    let h = 0;

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const onMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY, active: true };
    };
    const onScroll = () => {
      scrollRef.current = window.scrollY;
    };
    const onVis = () => {
      visibleRef.current = document.visibilityState === "visible";
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVis);

    const drawPlume = (p: Plume) => {
      const rgb = p.side === "left" ? PINK : BLUE;
      const life = p.life / p.maxLife;
      const alpha =
        life < 0.15 ? (life / 0.15) * p.opacity : life > 0.75 ? ((1 - life) / 0.25) * p.opacity : p.opacity;

      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y - p.r * 0.2, p.r);
      g.addColorStop(0, `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${alpha * 0.2})`);
      g.addColorStop(0.5, `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${alpha * 0.06})`);
      g.addColorStop(1, `rgba(${rgb[0]},${rgb[1]},${rgb[2]},0)`);

      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.ellipse(p.x, p.y, p.r * 0.65, p.r, 0, 0, Math.PI * 2);
      ctx.fill();
    };

    const tick = () => {
      if (!visibleRef.current) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "screen";

      if (maxPlumes > 0) {
        while (plumesRef.current.length < maxPlumes) {
          plumesRef.current.push(
            spawnPlume(w, h, plumesRef.current.length % 2 === 0 ? "left" : "right")
          );
        }

        const scroll = Math.min(scrollRef.current * 0.0001, 0.2);
        const mouse = mouseRef.current;

        plumesRef.current = plumesRef.current.filter((p) => {
          p.life++;
          p.phase += 0.01;
          p.opacity = 0.6 + Math.sin(p.phase) * 0.15;
          p.vx += Math.sin(p.phase) * 0.006;
          p.vy -= 0.0004 + scroll;

          if (mouse.active) {
            const dx = mouse.x - p.x;
            const dy = mouse.y - p.y;
            const dist = Math.hypot(dx, dy);
            if (dist < 200 && dist > 0) {
              const f = ((200 - dist) / 200) * 0.04;
              p.vx += (dx / dist) * f;
              p.vy += (dy / dist) * f * 0.4;
            }
          }

          p.x += p.vx;
          p.y += p.vy;
          p.vx *= 0.995;
          drawPlume(p);
          return p.life < p.maxLife && p.y > -p.r;
        });
      }

      ctx.globalCompositeOperation = "source-over";
      rafRef.current = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      className={`pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#05070B] ${className}`}
      aria-hidden="true"
    >
      {/* עשן שמאל */}
      <div
        className="absolute inset-y-0 left-0 w-[45%]"
        style={{
          maskImage: "linear-gradient(to right, black 20%, transparent 95%)",
          WebkitMaskImage: "linear-gradient(to right, black 20%, transparent 95%)",
        }}
      >
        <video
          className="absolute inset-0 h-full w-full object-cover opacity-80"
          style={{ filter: "saturate(1.8) hue-rotate(-8deg) contrast(1.05)" }}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          src={VIDEO}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 90% 70% at 10% 85%, rgba(255,46,166,0.45) 0%, transparent 65%)",
          }}
        />
      </div>

      {/* עשן ימין */}
      <div
        className="absolute inset-y-0 right-0 w-[45%]"
        style={{
          maskImage: "linear-gradient(to left, black 20%, transparent 95%)",
          WebkitMaskImage: "linear-gradient(to left, black 20%, transparent 95%)",
        }}
      >
        <video
          className="absolute inset-0 h-full w-full object-cover opacity-80"
          style={{
            filter: "saturate(1.8) hue-rotate(12deg) contrast(1.05)",
            transform: "scaleX(-1)",
          }}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          src={VIDEO}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 90% 70% at 90% 85%, rgba(39,184,255,0.45) 0%, transparent 65%)",
          }}
        />
      </div>

      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

      {/* מרכז נקי — התוכן קריא */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 55% 45% at 50% 42%, rgba(5,7,11,0.92) 0%, rgba(5,7,11,0.4) 55%, transparent 80%)",
        }}
      />

      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(5,7,11,0.6) 0%, transparent 20%, transparent 80%, rgba(5,7,11,0.75) 100%)",
        }}
      />
    </div>
  );
}
