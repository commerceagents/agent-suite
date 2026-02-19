"use client";

import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useEffect, useRef, useCallback } from "react";

/* ──────────────────────────────────────────────
   Five Logo Animation Concepts — Pick Page
   ────────────────────────────────────────────── */

const logoPaths = {
  outerC:
    "M112.864 197.024C98.8352 199.009 84.5443 197.958 70.9566 193.945C57.3688 189.932 44.8008 183.049 34.1016 173.761C23.4024 164.473 14.8214 152.997 8.93832 140.108C3.05523 127.219 0.00714889 113.218 1.25584e-05 99.0499C-0.00712377 84.8818 3.02685 70.8773 8.89695 57.9824C14.767 45.0876 23.3365 33.603 34.0263 24.3045C44.7161 15.006 57.2772 8.11026 70.8609 4.08323C84.4446 0.0561998 98.7345 -1.00832 112.765 0.961605L107.953 35.2334C98.8273 33.9522 89.5328 34.6445 80.6977 37.2638C71.8625 39.8831 63.6924 44.3683 56.7395 50.4162C49.7866 56.4642 44.2128 63.9341 40.3948 72.3212C36.5767 80.7083 34.6034 89.8172 34.608 99.0324C34.6126 108.248 36.5952 117.355 40.4217 125.738C44.2482 134.121 49.8295 141.585 56.7885 147.626C63.7475 153.667 71.9221 158.144 80.7599 160.755C89.5977 163.365 98.8928 164.048 108.017 162.758L112.864 197.024Z",
  innerComplex:
    "M99 42.9004C129.983 42.9004 155.1 68.017 155.101 99V134.584H134.584V155.101H99C68.017 155.1 42.9004 129.983 42.9004 99C42.9006 68.0171 68.0171 42.9006 99 42.9004ZM98.9072 52.5176C98.1681 64.5791 93.0438 75.9542 84.499 84.499C75.9542 93.0438 64.5791 98.1681 52.5176 98.9072V99.0938C64.5791 99.8329 75.9542 104.957 84.499 113.502C93.0438 122.047 98.1681 133.422 98.9072 145.483H99.0938C99.8343 133.422 104.959 122.048 113.504 113.504C122.048 104.959 133.422 99.8343 145.483 99.0938V98.9072C133.422 98.1667 122.048 93.0416 113.504 84.4971C104.959 75.9526 99.8343 64.5786 99.0938 52.5176H98.9072Z",
  starPath:
    "M98.9072 52.5176C98.1681 64.5791 93.0438 75.9542 84.499 84.499C75.9542 93.0438 64.5791 98.1681 52.5176 98.9072V99.0938C64.5791 99.8329 75.9542 104.957 84.499 113.502C93.0438 122.047 98.1681 133.422 98.9072 145.483H99.0938C99.8343 133.422 104.959 122.048 113.504 113.504C122.048 104.959 133.422 99.8343 145.483 99.0938V98.9072C133.422 98.1667 122.048 93.0416 113.504 84.4971C104.959 75.9526 99.8343 64.5786 99.0938 52.5176H98.9072Z",
};

/* ═══════════════════════════════════════
   OPTION A: Liquid Chrome Pour
   Chrome fills top→bottom like molten metal
   ═══════════════════════════════════════ */
function OptionA({ play }: { play: boolean }) {
  if (!play) return <EmptyLogo id="a" />;
  return (
    <svg viewBox="0 0 198 198" fill="none" className="w-full h-full">
      <defs>
        <linearGradient id="cgA" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#3A3A42" />
          <stop offset="30%" stopColor="#8A8A96" />
          <stop offset="60%" stopColor="#D0D0DC" />
          <stop offset="100%" stopColor="#FFFFFF" />
        </linearGradient>

        {/* Animated clip that reveals top→bottom */}
        <clipPath id="pourClipA">
          <motion.rect
            x="0" y="0" width="198"
            initial={{ height: 0 }}
            animate={{ height: 198 }}
            transition={{ delay: 0.8, duration: 2.0, ease: [0.22, 1, 0.36, 1] }}
          />
        </clipPath>

        {/* Liquid wave edge — horizontal distortion line */}
        <clipPath id="waveClipA">
          <motion.rect
            x="0" width="198" height="198"
            initial={{ y: -10 }}
            animate={{ y: 198 }}
            transition={{ delay: 0.8, duration: 2.0, ease: [0.22, 1, 0.36, 1] }}
          />
        </clipPath>
      </defs>

      {/* 1. Faint wireframe outline appears first */}
      <motion.path
        d={logoPaths.outerC}
        stroke="rgba(192,192,200,0.15)"
        strokeWidth="1"
        fill="none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      />
      <motion.path
        d={logoPaths.innerComplex}
        stroke="rgba(192,192,200,0.15)"
        strokeWidth="1"
        fill="none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      />
      <motion.rect
        x="143.927" y="142.277" width="12.8228" height="12.8228"
        stroke="rgba(192,192,200,0.15)"
        strokeWidth="1"
        fill="none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      />

      {/* 2. Chrome fills pour down — clipped top→bottom */}
      <g clipPath="url(#pourClipA)">
        <path d={logoPaths.outerC} fill="url(#cgA)" />
        <path d={logoPaths.innerComplex} fill="url(#cgA)" />
        <rect x="143.927" y="142.277" width="12.8228" height="12.8228" fill="url(#cgA)" />
      </g>

      {/* 3. Liquid leading edge highlight — bright line that travels downward */}
      <motion.line
        x1="20" x2="178" strokeWidth="1.5"
        stroke="rgba(255,255,255,0.6)"
        initial={{ y1: 0, y2: 0, opacity: 0 }}
        animate={{ y1: 198, y2: 198, opacity: [0, 0.8, 0.8, 0] }}
        transition={{ delay: 0.8, duration: 2.0, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* 4. Metallic shimmer flash at end */}
      <motion.rect
        x="0" y="0" width="198" height="198"
        fill="white"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.15, 0] }}
        transition={{ delay: 2.8, duration: 0.6, ease: "easeOut" }}
      />
    </svg>
  );
}

/* ═══════════════════════════════════════
   OPTION B: Particle Assembly
   Dots scattered → converge to form logo
   ═══════════════════════════════════════ */
function OptionB({ play }: { play: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  const runAnimation = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const SIZE = 198;
    canvas.width = SIZE * 2;
    canvas.height = SIZE * 2;

    // Sample target points from the logo by drawing paths offscreen
    const offscreen = document.createElement("canvas");
    offscreen.width = SIZE;
    offscreen.height = SIZE;
    const offCtx = offscreen.getContext("2d");
    if (!offCtx) return;

    offCtx.fillStyle = "white";
    const paths = [logoPaths.outerC, logoPaths.innerComplex];
    paths.forEach((d) => {
      const p = new Path2D(d);
      offCtx.fill(p);
    });
    offCtx.fillRect(143.927, 142.277, 12.8228, 12.8228);

    const imageData = offCtx.getImageData(0, 0, SIZE, SIZE);
    const targets: { x: number; y: number }[] = [];
    for (let y = 0; y < SIZE; y += 3) {
      for (let x = 0; x < SIZE; x += 3) {
        if (imageData.data[(y * SIZE + x) * 4 + 3] > 128) {
          targets.push({ x: x * 2, y: y * 2 });
        }
      }
    }

    // Create particles at random positions
    const particles = targets.map((t) => ({
      x: Math.random() * SIZE * 2,
      y: Math.random() * SIZE * 2,
      tx: t.x,
      ty: t.y,
      vx: 0,
      vy: 0,
      arrived: false,
    }));

    let frame = 0;
    const CONVERGE_START = 30;
    const CONVERGE_END = 120;
    const HOLD_END = 180;

    function animate() {
      frame++;
      ctx!.clearRect(0, 0, SIZE * 2, SIZE * 2);

      const progress = Math.min(1, Math.max(0, (frame - CONVERGE_START) / (CONVERGE_END - CONVERGE_START)));
      const ease = 1 - Math.pow(1 - progress, 3);

      particles.forEach((p) => {
        if (frame >= CONVERGE_START) {
          p.x = p.x + (p.tx - p.x) * (0.04 + ease * 0.12);
          p.y = p.y + (p.ty - p.y) * (0.04 + ease * 0.12);
        } else {
          // Drift randomly
          p.x += (Math.random() - 0.5) * 2;
          p.y += (Math.random() - 0.5) * 2;
        }

        const brightness = 100 + Math.floor(progress * 155);
        const alpha = 0.3 + progress * 0.7;
        ctx!.fillStyle = `rgba(${brightness},${brightness},${brightness + 20},${alpha})`;
        ctx!.fillRect(p.x, p.y, 2, 2);
      });

      // Flash on convergence complete
      if (frame === CONVERGE_END + 5) {
        ctx!.fillStyle = "rgba(255,255,255,0.12)";
        ctx!.fillRect(0, 0, SIZE * 2, SIZE * 2);
      }

      if (frame < HOLD_END) {
        animRef.current = requestAnimationFrame(animate);
      }
    }
    animate();
  }, []);

  useEffect(() => {
    if (play) {
      runAnimation();
    }
    return () => cancelAnimationFrame(animRef.current);
  }, [play, runAnimation]);

  if (!play) return <EmptyLogo id="b" />;
  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ imageRendering: "pixelated" }}
    />
  );
}

/* ═══════════════════════════════════════
   OPTION C: Blueprint Drafting
   CAD-style dashed lines → solidify → chrome fill
   ═══════════════════════════════════════ */
function OptionC({ play }: { play: boolean }) {
  if (!play) return <EmptyLogo id="c" />;
  return (
    <svg viewBox="0 0 198 198" fill="none" className="w-full h-full">
      <defs>
        <linearGradient id="cgC" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#3A3A42" />
          <stop offset="30%" stopColor="#8A8A96" />
          <stop offset="60%" stopColor="#D0D0DC" />
          <stop offset="100%" stopColor="#FFFFFF" />
        </linearGradient>
      </defs>

      {/* 1. Dashed outline traces — "CAD drawing" */}
      <motion.path
        d={logoPaths.outerC}
        stroke="rgba(192,192,200,0.3)"
        strokeWidth="1"
        strokeDasharray="4 4"
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 1.5, ease: "linear" }}
      />
      <motion.path
        d={logoPaths.innerComplex}
        stroke="rgba(192,192,200,0.3)"
        strokeWidth="1"
        strokeDasharray="3 3"
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ delay: 0.6, duration: 1.2, ease: "linear" }}
      />
      <motion.rect
        x="143.927" y="142.277" width="12.8228" height="12.8228"
        stroke="rgba(192,192,200,0.3)"
        strokeWidth="1"
        strokeDasharray="3 3"
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ delay: 1.0, duration: 0.6, ease: "linear" }}
      />

      {/* 2. Blueprint measurement annotations */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1] }}
        transition={{ delay: 0.8, duration: 0.3 }}
      >
        {/* Height marker */}
        <line x1="170" y1="0" x2="170" y2="198" stroke="rgba(192,192,200,0.1)" strokeWidth="0.5" strokeDasharray="2 4" />
        <motion.text x="173" y="100" fill="rgba(192,192,200,0.2)" fontSize="5" fontFamily="monospace"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0, duration: 0.4 }}
        >198</motion.text>

        {/* Width marker */}
        <line x1="0" y1="185" x2="160" y2="185" stroke="rgba(192,192,200,0.1)" strokeWidth="0.5" strokeDasharray="2 4" />
        <motion.text x="60" y="192" fill="rgba(192,192,200,0.2)" fontSize="5" fontFamily="monospace"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 0.4 }}
        >112.8</motion.text>

        {/* Radius marker */}
        <motion.circle cx="99" cy="99" r="56" stroke="rgba(192,192,200,0.08)" strokeWidth="0.5" strokeDasharray="2 6" fill="none"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4, duration: 0.4 }}
        />
        <motion.text x="100" y="48" fill="rgba(192,192,200,0.2)" fontSize="5" fontFamily="monospace"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 0.4 }}
        >r:56</motion.text>
      </motion.g>

      {/* 3. "APPROVED" flash — dashes become solid + fill*/}
      <motion.path
        d={logoPaths.outerC}
        stroke="rgba(192,192,200,0.6)"
        strokeWidth="1.5"
        fill="none"
        style={{ opacity: 0 }}
        initial={{ opacity: 0, pathLength: 1 }}
        animate={{ opacity: [0, 1, 1] }}
        transition={{ delay: 2.0, duration: 0.4, ease: "easeOut" }}
      />
      <motion.path
        d={logoPaths.innerComplex}
        stroke="rgba(192,192,200,0.6)"
        strokeWidth="1"
        fill="none"
        style={{ opacity: 0 }}
        initial={{ opacity: 0, pathLength: 1 }}
        animate={{ opacity: [0, 1, 1] }}
        transition={{ delay: 2.1, duration: 0.4, ease: "easeOut" }}
      />

      {/* 4. Chrome fill materializes */}
      <motion.path
        d={logoPaths.outerC}
        fill="url(#cgC)"
        style={{ opacity: 0 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 0.8, ease: "easeOut" }}
      />
      <motion.path
        d={logoPaths.innerComplex}
        fill="url(#cgC)"
        style={{ opacity: 0 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.6, duration: 0.8, ease: "easeOut" }}
      />
      <motion.rect
        x="143.927" y="142.277" width="12.8228" height="12.8228"
        fill="url(#cgC)"
        style={{ opacity: 0 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.7, duration: 0.6, ease: "easeOut" }}
      />

      {/* 5. Annotations fade out */}
      <motion.rect
        x="160" y="0" width="40" height="198"
        fill="#050508"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.0, duration: 0.6 }}
      />
    </svg>
  );
}

/* ═══════════════════════════════════════
   OPTION D: Morphing Geometry
   Circle → C shape → star crystallizes
   ═══════════════════════════════════════ */
function OptionD({ play }: { play: boolean }) {
  if (!play) return <EmptyLogo id="d" />;

  // Circle path centered at 99,99 with radius ~80 (to approximate outer C size)
  const circlePath = "M179 99C179 143.183 143.183 179 99 179C54.8172 179 19 143.183 19 99C19 54.8172 54.8172 19 99 19C143.183 19 179 54.8172 179 99Z";

  return (
    <svg viewBox="0 0 198 198" fill="none" className="w-full h-full">
      <defs>
        <linearGradient id="cgD" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#3A3A42" />
          <stop offset="30%" stopColor="#8A8A96" />
          <stop offset="60%" stopColor="#D0D0DC" />
          <stop offset="100%" stopColor="#FFFFFF" />
        </linearGradient>
      </defs>

      {/* 1. Circle appears — thin stroke */}
      <motion.circle
        cx="99" cy="99" r="80"
        stroke="rgba(192,192,200,0.5)"
        strokeWidth="1.5"
        fill="none"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 1.05, 1], opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformOrigin: "99px 99px" }}
      />

      {/* 2. Circle fades & morphs into C — using crossfade */}
      <motion.circle
        cx="99" cy="99" r="80"
        stroke="rgba(192,192,200,0.5)"
        strokeWidth="1.5"
        fill="none"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        style={{ transformOrigin: "99px 99px" }}
      />
      <motion.path
        d={logoPaths.outerC}
        stroke="rgba(192,192,200,0.5)"
        strokeWidth="1.5"
        fill="none"
        style={{ opacity: 0 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
      />

      {/* 3. C fills with chrome */}
      <motion.path
        d={logoPaths.outerC}
        fill="url(#cgD)"
        style={{ opacity: 0 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.6, ease: "easeOut" }}
      />

      {/* 4. Inner shape scales up from center with spring */}
      <motion.g
        style={{ transformOrigin: "99px 99px", opacity: 0 }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 1.08, 1], opacity: 1 }}
        transition={{ delay: 2.0, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <path d={logoPaths.innerComplex} fill="url(#cgD)" />
      </motion.g>

      {/* 5. Square snaps last with bounce */}
      <motion.rect
        x="143.927" y="142.277" width="12.8228" height="12.8228"
        fill="url(#cgD)"
        style={{ opacity: 0 }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 1.3, 1], opacity: 1 }}
        transition={{ delay: 2.6, duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
      />

      {/* 6. Subtle ring pulse */}
      <motion.circle
        cx="99" cy="99" r="70"
        fill="none"
        stroke="rgba(192,192,200,0.2)"
        strokeWidth="1"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: [1, 1.6], opacity: [0.3, 0] }}
        transition={{ delay: 2.8, duration: 0.8, ease: "easeOut" }}
        style={{ transformOrigin: "99px 99px" }}
      />
    </svg>
  );
}

/* ═══════════════════════════════════════
   OPTION E: Constellation Connect
   Dots appear → lines connect → fill floods
   ═══════════════════════════════════════ */
function OptionE({ play }: { play: boolean }) {
  if (!play) return <EmptyLogo id="e" />;

  // Key vertices of the logo shape
  const nodes = [
    { x: 112.8, y: 197 },   // top of C outer
    { x: 112.8, y: 0.96 },  // bottom of C outer
    { x: 0, y: 99 },        // left curve apex
    { x: 108, y: 35.2 },    // inner C top
    { x: 108, y: 162.8 },   // inner C bottom
    { x: 99, y: 43 },       // inner shape top
    { x: 155, y: 99 },      // inner shape right
    { x: 99, y: 155 },      // inner shape bottom
    { x: 43, y: 99 },       // inner shape left
    { x: 99, y: 52.5 },     // star top
    { x: 145.5, y: 99 },    // star right
    { x: 99, y: 145.5 },    // star bottom
    { x: 52.5, y: 99 },     // star left
    { x: 155, y: 134.6 },   // square corner
    { x: 143.9, y: 142.3 }, // square corner 2
    { x: 134.6, y: 155 },   // square corner 3
  ];

  // Connections between nodes (indices)
  const edges = [
    [0, 3], [1, 4], [2, 8], [3, 5], [4, 7],
    [5, 9], [6, 10], [7, 11], [8, 12],
    [9, 10], [10, 11], [11, 12], [12, 9],
    [6, 13], [13, 14], [14, 15],
    [0, 2], [1, 2], [5, 6], [7, 6],
  ];

  return (
    <svg viewBox="0 0 198 198" fill="none" className="w-full h-full">
      <defs>
        <linearGradient id="cgE" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#3A3A42" />
          <stop offset="30%" stopColor="#8A8A96" />
          <stop offset="60%" stopColor="#D0D0DC" />
          <stop offset="100%" stopColor="#FFFFFF" />
        </linearGradient>
        <filter id="dotGlow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* 1. Dots appear one by one */}
      {nodes.map((node, i) => (
        <motion.circle
          key={`dot-${i}`}
          cx={node.x}
          cy={node.y}
          r="2.5"
          fill="white"
          filter="url(#dotGlow)"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 1.5, 1], opacity: 1 }}
          transition={{
            delay: 0.1 + i * 0.08,
            duration: 0.3,
            ease: [0.34, 1.56, 0.64, 1],
          }}
        />
      ))}

      {/* 2. Lines draw between connected dots */}
      {edges.map(([from, to], i) => (
        <motion.line
          key={`edge-${i}`}
          x1={nodes[from].x}
          y1={nodes[from].y}
          x2={nodes[to].x}
          y2={nodes[to].y}
          stroke="rgba(192,192,200,0.25)"
          strokeWidth="0.8"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{
            delay: 1.0 + i * 0.06,
            duration: 0.4,
            ease: "easeOut",
          }}
        />
      ))}

      {/* 3. Pulse runs through the constellation */}
      {edges.map(([from, to], i) => (
        <motion.line
          key={`pulse-${i}`}
          x1={nodes[from].x}
          y1={nodes[from].y}
          x2={nodes[to].x}
          y2={nodes[to].y}
          stroke="white"
          strokeWidth="1.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.8, 0] }}
          transition={{
            delay: 2.5 + i * 0.03,
            duration: 0.3,
            ease: "easeOut",
          }}
        />
      ))}

      {/* 4. Chrome fills flood in */}
      <motion.path
        d={logoPaths.outerC}
        fill="url(#cgE)"
        style={{ opacity: 0 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.0, duration: 0.8, ease: "easeOut" }}
      />
      <motion.path
        d={logoPaths.innerComplex}
        fill="url(#cgE)"
        style={{ opacity: 0 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.1, duration: 0.8, ease: "easeOut" }}
      />
      <motion.rect
        x="143.927" y="142.277" width="12.8228" height="12.8228"
        fill="url(#cgE)"
        style={{ opacity: 0 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.2, duration: 0.6, ease: "easeOut" }}
      />

      {/* 5. Dots fade out after fill */}
      {nodes.map((node, i) => (
        <motion.circle
          key={`fade-${i}`}
          cx={node.x}
          cy={node.y}
          r="2.5"
          fill="white"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ delay: 3.5 + i * 0.02, duration: 0.5 }}
        />
      ))}
    </svg>
  );
}

/* ═══════════════════════════════════════ */

function EmptyLogo({ id }: { id: string }) {
  return (
    <svg viewBox="0 0 198 198" fill="none" className="w-full h-full">
      <defs>
        <linearGradient id={`cg${id}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#3A3A42" />
          <stop offset="30%" stopColor="#8A8A96" />
          <stop offset="60%" stopColor="#D0D0DC" />
          <stop offset="100%" stopColor="#FFFFFF" />
        </linearGradient>
      </defs>
      <path d={logoPaths.outerC} fill={`url(#cg${id})`} opacity={0.1} />
      <path d={logoPaths.innerComplex} fill={`url(#cg${id})`} opacity={0.1} />
      <rect x="143.927" y="142.277" width="12.8228" height="12.8228" fill={`url(#cg${id})`} opacity={0.1} />
    </svg>
  );
}

/* ═══════════════════════════════════════
   DEMO PAGE
   ═══════════════════════════════════════ */

interface DemoCardProps {
  label: string;
  title: string;
  description: string;
  play: boolean;
  onReplay: () => void;
  children: React.ReactNode;
}

function DemoCard({ label, title, description, play, onReplay, children }: DemoCardProps) {
  return (
    <div className="flex flex-col items-center">
      <div className="text-center mb-4">
        <span className="font-mono text-xs tracking-[0.2em] uppercase" style={{ color: "rgba(192,192,200,0.3)" }}>
          {label}
        </span>
        <h2 className="mt-1" style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontWeight: 700, fontSize: "20px" }}>
          {title}
        </h2>
        <p className="mt-1 text-xs" style={{ color: "rgba(192,192,200,0.35)" }}>{description}</p>
      </div>
      <div
        className="w-44 h-44 md:w-52 md:h-52 relative rounded-2xl flex items-center justify-center p-6"
        style={{
          background: "radial-gradient(ellipse at center, rgba(192,192,200,0.03) 0%, transparent 70%)",
          border: "1px solid rgba(192,192,200,0.08)",
        }}
      >
        {children}
      </div>
      <button
        onClick={onReplay}
        className="mt-4 px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest"
        style={{
          background: "rgba(192,192,200,0.08)",
          border: "1px solid rgba(192,192,200,0.15)",
          color: "#C0C0C8",
          cursor: "pointer",
          fontFamily: "'Cabinet Grotesk', sans-serif",
        }}
      >
        ↻ Replay
      </button>
    </div>
  );
}

export default function DemoPage() {
  const [plays, setPlays] = useState([false, false, false, false, false]);

  useEffect(() => {
    setPlays([true, true, true, true, true]);
  }, []);

  const replay = (index: number) => {
    setPlays((prev) => {
      const next = [...prev];
      next[index] = false;
      return next;
    });
    setTimeout(() => {
      setPlays((prev) => {
        const next = [...prev];
        next[index] = true;
        return next;
      });
    }, 50);
  };

  const demos = [
    { label: "OPTION A", title: "Liquid Chrome Pour", desc: "Wireframe → molten chrome fills top→bottom", Component: OptionA },
    { label: "OPTION B", title: "Particle Assembly", desc: "Scattered dots converge to form the logo", Component: OptionB },
    { label: "OPTION C", title: "Blueprint Drafting", desc: "CAD dashed lines → measurements → chrome fill", Component: OptionC },
    { label: "OPTION D", title: "Morphing Geometry", desc: "Circle → C morph → star crystallizes", Component: OptionD },
    { label: "OPTION E", title: "Constellation Connect", desc: "Dots → connecting lines → pulse → fill", Component: OptionE },
  ];

  return (
    <main
      className="min-h-screen w-full flex flex-col items-center px-8 py-16"
      style={{ backgroundColor: "#050508", color: "#E8E8F0" }}
    >
      <h1
        className="text-center mb-2"
        style={{
          fontFamily: "'Cabinet Grotesk', sans-serif",
          fontSize: "clamp(28px, 5vw, 48px)",
          fontWeight: 800,
          background: "linear-gradient(180deg, #3A3A42 0%, #8A8A96 30%, #D0D0DC 60%, #FFFFFF 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Pick Your Animation
      </h1>
      <p
        className="text-center mb-12"
        style={{ color: "rgba(192,192,200,0.4)", fontSize: "13px", fontFamily: "monospace", letterSpacing: "0.15em" }}
      >
        CLICK &quot;REPLAY&quot; TO SEE EACH AGAIN
      </p>

      {/* Top row — 3 options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 w-full max-w-5xl mb-12">
        {demos.slice(0, 3).map((d, i) => (
          <DemoCard
            key={d.label}
            label={d.label}
            title={d.title}
            description={d.desc}
            play={plays[i]}
            onReplay={() => replay(i)}
          >
            <d.Component play={plays[i]} />
          </DemoCard>
        ))}
      </div>

      {/* Bottom row — 2 options centered */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-3xl">
        {demos.slice(3).map((d, i) => (
          <DemoCard
            key={d.label}
            label={d.label}
            title={d.title}
            description={d.desc}
            play={plays[i + 3]}
            onReplay={() => replay(i + 3)}
          >
            <d.Component play={plays[i + 3]} />
          </DemoCard>
        ))}
      </div>

      {/* Film grain */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          opacity: 0.03,
          mixBlendMode: "overlay",
          backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')",
          zIndex: 9998,
        }}
      />
    </main>
  );
}
