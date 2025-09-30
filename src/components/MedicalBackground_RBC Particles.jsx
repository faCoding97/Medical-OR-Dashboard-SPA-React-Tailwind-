import React, { useEffect, useMemo, useRef, useState } from "react";

/**
 * MedicalBackground — ECG + RBC Particles + Medical Symbols Parallax (v11)
 *
 * ✔ Cursor: پیش‌فرض سیستم (هیچ تغییری در شکل موس)
 * ✔ Only Medical Symbols: افکت سه‌بعدی پارالاکس فقط با نمادهای پزشکی (⚕ 🩺 💉 ...)
 * ✔ ECG: حرکت یکنواخت و بی‌وقفه با Glow
 * ✔ RBC Particles: ذرات سبک و روان در پس‌زمینه
 * ✔ Respects DPR & prefers-reduced-motion
 */
export default function MedicalBackground() {
  const rbcRef = useRef(null); // canvas برای ذرات خون
  const symbolsRef = useRef(null); // canvas برای نمادهای پزشکی با پارالاکس
  const reduced = usePrefersReducedMotion();

  // موقعیت موس (برای پارالاکس)
  const mouse = useRef({
    x: typeof window !== "undefined" ? window.innerWidth / 2 : 0,
    y: typeof window !== "undefined" ? window.innerHeight / 2 : 0,
  });
  useEffect(() => {
    const onMove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  /* ================= RBC Particles ================= */
  useEffect(() => {
    const canvas = rbcRef.current;
    const ctx = canvas.getContext("2d");
    let raf;

    const DPR = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    const resize = () => {
      const { innerWidth: w, innerHeight: h } = window;
      canvas.width = w * DPR;
      canvas.height = h * DPR;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const COUNT = reduced ? 16 : 40;
    const cells = Array.from({ length: COUNT }).map(() =>
      spawnCell(canvas, DPR, reduced)
    );

    function tick() {
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);
      for (const c of cells) {
        c.x += c.vx;
        c.y += c.vy;
        c.rot += c.vr;
        wrap(c, width / DPR, height / DPR);
        drawCell(ctx, c);
      }
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);

    const onVis = () => {
      if (document.visibilityState === "visible")
        raf = requestAnimationFrame(tick);
      else cancelAnimationFrame(raf);
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [reduced]);

  /* ================= Medical Symbols Parallax ================= */
  useEffect(() => {
    const canvas = symbolsRef.current;
    const ctx = canvas.getContext("2d");
    let raf;

    const DPR = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    const resize = () => {
      const { innerWidth: w, innerHeight: h } = window;
      canvas.width = w * DPR;
      canvas.height = h * DPR;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    // فقط نمادهای پزشکی (Unicode/Emoji). می‌تونی سفارشی‌سازی کنی.
    const MED_SYMBOLS = [
      "⚕",
      "🩺",
      "💉",
      "💊",
      "🩹",
      "🧬",
      "🧪",
      "🧫",
      "🧰",
      "🫀",
      "🫁",
      "🧠",
      "🩸",
      "🚑",
      "🏥",
      "🧯",
    ];

    // تنظیمات لایه‌ها (از دور به نزدیک)
    const layers = reduced
      ? {
          n: 4,
          items: [60, 30, 18, 12],
          coef: [0.06, 0.14, 0.28, 0.48],
          size: [8, 16, 26, 20],
          color: ["#aab", "#ccd", "#eef", "#fff"],
          font: "Segoe UI Emoji, Apple Color Emoji, Noto Color Emoji, system-ui, sans-serif",
        }
      : {
          n: 5,
          items: [100, 60, 36, 24, 16],
          coef: [0.06, 0.14, 0.32, 0.52, 0.78],
          size: [12, 16, 20, 24, 30],
          color: ["#aab", "#ccd", "#eef", "#fff", "#fff"],
          font: "Segoe UI Emoji, Apple Color Emoji, Noto Color Emoji, system-ui, sans-serif",
        };

    const sprites = [];
    const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

    for (let i = 0; i < layers.n; i++) {
      for (let j = 0; j < layers.items[i]; j++) {
        sprites.push({
          sym: pick(MED_SYMBOLS),
          font: layers.font,
          size: layers.size[i],
          color: layers.color[i],
          coef: layers.coef[i],
          x: (Math.random() * canvas.width) / DPR,
          y: (Math.random() * canvas.height) / DPR,
        });
      }
    }

    function drawSym(s) {
      ctx.font = `${s.size}px ${s.font}`;
      ctx.fillStyle = s.color;
      const cx = canvas.width / (2 * DPR),
        cy = canvas.height / (2 * DPR);
      const dx = (mouse.current.x - cx) * s.coef;
      const dy = (mouse.current.y - cy) * s.coef;
      ctx.fillText(s.sym, s.x + dx, s.y + dy);
    }

    function tick() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Glow خیلی ظریف برای خوانایی بهتر
      const g = ctx.createRadialGradient(
        canvas.width / (2 * DPR),
        canvas.height / (2 * DPR),
        60,
        canvas.width / (2 * DPR),
        canvas.height / (2 * DPR),
        Math.max(canvas.width, canvas.height) / (2 * DPR)
      );
      g.addColorStop(0, "rgba(255,255,255,0.04)");
      g.addColorStop(1, "rgba(255,255,255,0.00)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < sprites.length; i++) drawSym(sprites[i]);
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);

    const onVis = () => {
      if (document.visibilityState === "visible")
        raf = requestAnimationFrame(tick);
      else cancelAnimationFrame(raf);
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [reduced]);

  /* ================= ECG (constant loop) ================= */
  const ECG_DURATION = useMemo(() => (reduced ? 12 : 8), [reduced]);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10">
      {/* Grid base */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(12,26,43,.45) 1px, transparent 1px),
             linear-gradient(to bottom, rgba(12,26,43,.45) 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
          backgroundColor: "#0b1220",
        }}
      />

      {/* ECG ticker */}
      <ECGScroller duration={ECG_DURATION} topPercent={40} opacity={0.95} />

      {/* Particles & Medical Symbols */}
      <canvas ref={rbcRef} className="absolute inset-0" />
      <canvas ref={symbolsRef} className="absolute inset-0" />

      {/* Vignette / Gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(1100px_520px_at_50%_-200px,rgba(73,225,184,.12),transparent),radial-gradient(520px_360px_at_88%_12%,rgba(244,63,94,.10),transparent)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(0,0,0,.35))]" />
    </div>
  );
}

/* ================= ECG helpers ================= */
function ECGScroller({ duration = 8, topPercent = 40, opacity = 0.95 }) {
  return (
    <div
      className="absolute left-0 right-0 overflow-hidden"
      style={{ top: `${topPercent}%`, opacity }}>
      <div
        className="w-[220%] will-change-transform"
        style={{
          animation: `pulseLine ${Math.max(3, duration)}s linear infinite`,
        }}>
        <ECGStrip />
      </div>
    </div>
  );
}

function ECGStrip() {
  const viewWidth = 1200;
  const viewHeight = 80;
  const baseline = viewHeight * 0.5;
  const amplitude = 18;
  const cycles = 6;
  const path = useMemo(
    () =>
      generateECGPath({ viewWidth, viewHeight, cycles, amplitude, baseline }),
    []
  );

  return (
    <svg
      width="200%"
      height="84"
      viewBox={`0 0 ${viewWidth} ${viewHeight}`}
      xmlns="http://www.w3.org/200/svg"
      className="select-none">
      <defs>
        <linearGradient id="ecg" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#49E1B8" stopOpacity="0.98" />
          <stop offset="100%" stopColor="#F43F5E" stopOpacity="0.98" />
        </linearGradient>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow
            dx="0"
            dy="0"
            stdDeviation="1.8"
            floodColor="#49E1B8"
            floodOpacity="0.55"
          />
          <feDropShadow
            dx="0"
            dy="0"
            stdDeviation="1.2"
            floodColor="#F43F5E"
            floodOpacity="0.35"
          />
        </filter>
      </defs>
      <path
        d={path}
        fill="none"
        stroke="url(#ecg)"
        strokeWidth="2.6"
        strokeLinejoin="round"
        strokeLinecap="round"
        filter="url(#glow)"
      />
    </svg>
  );
}

function generateECGPath({
  viewWidth,
  viewHeight,
  cycles,
  amplitude,
  baseline,
}) {
  const pts = [];
  const cycleW = viewWidth / cycles;
  const samplesPerCycle = 120;

  for (let c = 0; c < cycles; c++) {
    for (let i = 0; i <= samplesPerCycle; i++) {
      const phase = i / samplesPerCycle; // 0..1
      const x = c * cycleW + phase * cycleW;
      const y = baseline - ecgShape(phase, amplitude);
      pts.push([x, y]);
    }
  }

  if (!pts.length) return "";
  let d = `M ${pts[0][0].toFixed(2)} ${pts[0][1].toFixed(2)}`;
  for (let i = 1; i < pts.length; i++) {
    const [x, y] = pts[i];
    d += ` L ${x.toFixed(2)} ${y.toFixed(2)}`;
  }
  return d;
}

function ecgShape(t, A) {
  const pAmp = 0.28 * A;
  const qAmp = -0.35 * A;
  const rAmp = 1.0 * A;
  const sAmp = -0.6 * A;
  const tAmp = 0.48 * A;
  if (t < 0.18) return 0;
  if (t < 0.3) {
    const u = (t - 0.18) / 0.12;
    return pAmp * Math.sin(Math.PI * u);
  }
  if (t < 0.4) return 0;
  if (t < 0.46) {
    const u = (t - 0.4) / 0.06;
    return qAmp * triEase(u);
  }
  if (t < 0.52) {
    const u = (t - 0.46) / 0.06;
    return rAmp * sharpPeak(u);
  }
  if (t < 0.58) {
    const u = (t - 0.52) / 0.06;
    return sAmp * triEase(u);
  }
  if (t < 0.7) return 0.06 * A;
  if (t < 0.9) {
    const u = (t - 0.7) / 0.2;
    return tAmp * Math.sin(Math.PI * u);
  }
  return 0;
}
function triEase(u) {
  const x = u < 0.5 ? u / 0.5 : (1 - u) / 0.5;
  return Math.max(0, x);
}
function sharpPeak(u) {
  const k = 35;
  return Math.exp(-k * (u - 0.5) * (u - 0.5));
}

/* ================= Utils & Hooks ================= */
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const q = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(q.matches);
    const onChange = (e) => setReduced(e.matches);
    q.addEventListener?.("change", onChange);
    return () => q.removeEventListener?.("change", onChange);
  }, []);
  return reduced;
}

function spawnCell(cnv, DPR, reduced) {
  const { width, height } = cnv;
  const r = 1.8 + Math.random() * 2.8;
  const speedScale = reduced ? 0.5 : 1;
  return {
    x: Math.random() * (width / DPR),
    y: Math.random() * (height / DPR),
    r,
    vx: (-0.1 + Math.random() * 0.2) * speedScale,
    vy: (-0.06 + Math.random() * 0.12) * speedScale,
    rot: Math.random() * Math.PI * 2,
    vr: (-0.01 + Math.random() * 0.02) * speedScale,
    alpha: 0.22 + Math.random() * 0.28,
  };
}
function wrap(c, w, h) {
  if (c.x < -10) c.x = w + 10;
  if (c.x > w + 10) c.x = -10;
  if (c.y < -10) c.y = h + 10;
  if (c.y > h + 10) c.y = -10;
}
function drawCell(ctx, c) {
  const g = ctx.createRadialGradient(
    c.x - c.r * 0.4,
    c.y - c.r * 0.4,
    c.r * 0.2,
    c.x,
    c.y,
    c.r
  );
  g.addColorStop(0, `rgba(244, 63, 94, ${c.alpha})`);
  g.addColorStop(1, `rgba(73, 225, 184, ${c.alpha * 0.28})`);
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.ellipse(c.x, c.y, c.r * 1.15, c.r * 0.88, c.rot, 0, Math.PI * 2);
  ctx.fill();
}
