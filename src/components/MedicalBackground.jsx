import React, { useEffect, useRef, useState } from "react";

/**
 * MedicalBackground — OR Mode (Vitals HUD)
 * ✦ Sterile motes (dust under OR lamp)
 * ✦ Vitals HUD (HR / SpO2 / NIBP / RR) with parallax + subtle flicker
 * ✦ OR lamp glow + gentle diagonal sweep
 * ✦ DPR aware + respects prefers-reduced-motion
 *
 * Tweakables:
 * - HUD_LAYER (density / parallax)
 * - MOTE_COUNT, spawnMote() for particle feel
 * - VITAL ranges, update cadence, flicker amplitude
 */
export default function MedicalBackground() {
  const motesRef = useRef(null);
  const hudRef = useRef(null);
  const reduced = usePrefersReducedMotion();

  // Center-relative mouse for parallax
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

  /* ================= Sterile motes ================= */
  useEffect(() => {
    const canvas = motesRef.current;
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

    const MOTE_COUNT = reduced ? 22 : 52;
    const motes = Array.from({ length: MOTE_COUNT }).map(() =>
      spawnMote(canvas, DPR, reduced)
    );

    function tick() {
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      // Overhead glow
      const g = ctx.createRadialGradient(
        width / (2 * DPR),
        height * 0.06,
        40,
        width / (2 * DPR),
        height * 0.06,
        Math.max(width, height) / (1.25 * DPR)
      );
      g.addColorStop(0, "rgba(209,250,229,0.05)");
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, width, height);

      for (const m of motes) {
        m.x += m.vx;
        m.y += m.vy;
        m.rot += m.vr;
        wrap(m, width / DPR, height / DPR);
        drawMote(ctx, m);
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

  /* ================= Vitals HUD (parallax) ================= */
  useEffect(() => {
    const canvas = hudRef.current;
    const ctx = canvas.getContext("2d");
    let raf,
      lastUpdate = 0;

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

    // HUD instances (far → near)
    const HUD_LAYER = reduced
      ? {
          n: 2,
          count: [5, 4],
          coef: [0.06, 0.18],
          alpha: [0.35, 0.5],
          fontScale: [0.9, 1.05],
        }
      : {
          n: 3,
          count: [7, 6, 5],
          coef: [0.05, 0.12, 0.28],
          alpha: [0.3, 0.48, 0.64],
          fontScale: [0.85, 1.0, 1.15],
        };

    const items = [];
    function rnd(min, max) {
      return Math.random() * (max - min) + min;
    }
    function pick(arr) {
      return arr[Math.floor(Math.random() * arr.length)];
    }

    // Vitals templates
    const templates = [
      {
        label: "HR",
        unit: "bpm",
        color: "rgba(16,185,129,1)",
        min: 58,
        max: 88,
      },
      {
        label: "SpO₂",
        unit: "%",
        color: "rgba(56,189,248,1)",
        min: 95,
        max: 100,
      },
      {
        label: "NIBP",
        unit: "mmHg",
        color: "rgba(241,245,249,1)",
        min: 104,
        max: 128,
        systolic: true,
      },
      {
        label: "RR",
        unit: "rpm",
        color: "rgba(244,63,94,1)",
        min: 10,
        max: 22,
      },
    ];

    // Build HUD nodes at random positions
    for (let i = 0; i < HUD_LAYER.n; i++) {
      for (let j = 0; j < HUD_LAYER.count[i]; j++) {
        const t = pick(templates);
        items.push({
          t,
          x: rnd(0.06, 0.94), // normalized positions (0..1)
          y: rnd(0.12, 0.86),
          coef: HUD_LAYER.coef[i],
          alpha: HUD_LAYER.alpha[i],
          fontScale: HUD_LAYER.fontScale[i],
          value: randomVital(t),
          sub: t.systolic ? randomBP() : null, // for NIBP, show 120/78
          flicker: 0,
        });
      }
    }

    function randomVital(t) {
      // Slightly rounded realistic readout
      const v = Math.round(rnd(t.min, t.max));
      return v;
    }
    function randomBP() {
      const sys = Math.round(rnd(110, 130));
      const dia = Math.round(rnd(70, 88));
      return `${sys}/${dia}`;
    }

    function drawItem(it) {
      // Parallax offset
      const cx = canvas.width / (2 * DPR);
      const cy = canvas.height / (2 * DPR);
      const dx = (mouse.current.x - cx) * it.coef;
      const dy = (mouse.current.y - cy) * it.coef;

      const px = it.x * (canvas.width / DPR) + dx;
      const py = it.y * (canvas.height / DPR) + dy;

      // Flicker amplitude (small)
      const f = it.flicker;

      // Label
      ctx.font = `${
        12 * it.fontScale
      }px ui-monospace, SFMono-Regular, Menlo, monospace`;
      ctx.fillStyle = `rgba(226,232,240,${0.55 * it.alpha})`; // slate-200
      ctx.fillText(it.t.label, px, py);

      // Value (bigger, colored)
      ctx.font = `${
        22 * it.fontScale
      }px ui-monospace, SFMono-Regular, Menlo, monospace`;
      ctx.fillStyle = it.t.color.replace(",1)", `,${0.9 * it.alpha})`);
      ctx.fillText(
        it.t.systolic ? it.sub : it.value.toString(),
        px,
        py + 20 + f
      );

      // Unit (small)
      ctx.font = `${
        11 * it.fontScale
      }px ui-monospace, SFMono-Regular, Menlo, monospace`;
      ctx.fillStyle = `rgba(226,232,240,${0.5 * it.alpha})`;
      ctx.fillText(it.t.unit, px + 2, py + 34 + f);

      // Tiny divider line
      ctx.strokeStyle = `rgba(148,163,184,${0.25 * it.alpha})`; // slate-400
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(px, py + 8);
      ctx.lineTo(px + 38 * it.fontScale, py + 8);
      ctx.stroke();
    }

    function tick(now) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // cool overhead wash
      const g = ctx.createLinearGradient(0, 0, 0, canvas.height);
      g.addColorStop(0, "rgba(125, 211, 252, 0.05)");
      g.addColorStop(0.25, "rgba(16, 185, 129, 0.04)");
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update vitals roughly every ~800–1200ms
      if (now - lastUpdate > (reduced ? 1400 : 900)) {
        for (const it of items) {
          if (it.t.systolic) it.sub = randomBP();
          else it.value = randomVital(it.t);
          it.flicker = (Math.random() - 0.5) * 1.2; // subtle vertical jitter
        }
        lastUpdate = now;
      }

      for (const it of items) drawItem(it);

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

  return (
    <div className="pointer-events-none fixed inset-0 -z-10">
      {/* OR grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(20,42,54,.45) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(20,42,54,.45) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
          backgroundColor: "#0b1420",
        }}
      />

      {/* Overhead lamp glow */}
      <div className="absolute inset-0 bg-[radial-gradient(900px_420px_at_50%_-120px,rgba(125,211,252,.12),transparent),radial-gradient(700px_340px_at_50%_-60px,rgba(16,185,129,.10),transparent)]" />

      {/* Diagonal lamp sweep */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-1 bg-[linear-gradient(115deg,transparent_45%,rgba(255,255,255,.08)_50%,transparent_55%)] animate-[orLampSweep_8s_ease-in-out_infinite]" />
      </div>

      {/* Layers */}
      <canvas ref={motesRef} className="absolute inset-0" />
      <canvas ref={hudRef} className="absolute inset-0" />

      {/* Bottom vignette */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(0,0,0,.35))]" />
    </div>
  );
}

/* ============== utils & particles ============== */
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

function spawnMote(cnv, DPR, reduced) {
  const { width, height } = cnv;
  const r = 0.8 + Math.random() * 1.6;
  const speed = reduced ? 0.22 : 0.42;
  return {
    x: Math.random() * (width / DPR),
    y: Math.random() * (height / DPR),
    r,
    vx: (-0.03 + Math.random() * 0.06) * speed,
    vy: (-0.02 + Math.random() * 0.04) * speed,
    rot: Math.random() * Math.PI * 2,
    vr: (-0.006 + Math.random() * 0.012) * speed,
    alpha: 0.1 + Math.random() * 0.18,
  };
}
function wrap(p, w, h) {
  if (p.x < -10) p.x = w + 10;
  if (p.x > w + 10) p.x = -10;
  if (p.y < -10) p.y = h + 10;
  if (p.y > h + 10) p.y = -10;
}
function drawMote(ctx, m) {
  const inner = ctx.createRadialGradient(
    m.x - m.r * 0.4,
    m.y - m.r * 0.4,
    m.r * 0.1,
    m.x,
    m.y,
    m.r
  );
  inner.addColorStop(0, `rgba(255,255,255, ${m.alpha * 0.9})`);
  inner.addColorStop(1, `rgba(125,211,252, ${m.alpha * 0.35})`);
  ctx.fillStyle = inner;
  ctx.beginPath();
  ctx.ellipse(m.x, m.y, m.r * 1.1, m.r * 0.9, m.rot, 0, Math.PI * 2);
  ctx.fill();
}
