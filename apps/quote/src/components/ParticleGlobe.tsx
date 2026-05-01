'use client';

import React, { useRef, useEffect } from 'react';

export default function ParticleGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = 0, h = 0, animId: number;
    let R = 400, rotY = 0;
    const startTime = performance.now();
    const TILT = 0.42; // ~24 degrees
    const cosTilt = Math.cos(TILT), sinTilt = Math.sin(TILT);

    // Layered sine wave noise (cheap, smooth, organic)
    const wave = (x: number, z: number, t: number) =>
      0.40 * Math.sin(2.2 * x + 0.80 * t) +
      0.28 * Math.sin(1.6 * z + 0.55 * t + 1.2) +
      0.20 * Math.sin(3.0 * x - 1.3 * z + 0.90 * t) +
      0.12 * Math.sin(0.9 * x + 2.5 * z + 1.40 * t);

    type Dot = { ux: number; uy: number; uz: number };
    type Conn = { a: number; b: number };

    let dots: Dot[] = [];
    let conns: Conn[] = [];

    const build = () => {
      dots = [];
      conns = [];

      // Fibonacci hemisphere (upper half only, y >= 0)
      const N = 1400;
      const total = N * 2 + 300;
      const gold = Math.PI * (3 - Math.sqrt(5));
      for (let i = 0; i < total && dots.length < N; i++) {
        const y = 1 - (i / (total - 1)) * 2;
        if (y < -0.01) continue;
        const r = Math.sqrt(Math.max(0, 1 - y * y));
        const t = gold * i;
        dots.push({ ux: Math.cos(t) * r, uy: y, uz: Math.sin(t) * r });
      }

      // Pre-compute proximity connections
      const cnt = new Uint8Array(dots.length);
      const THRESH = 0.30;
      for (let a = 0; a < dots.length; a++) {
        if (cnt[a] >= 5) continue;
        for (let b = a + 1; b < dots.length; b++) {
          if (cnt[b] >= 5) continue;
          const dx = dots[a].ux - dots[b].ux;
          const dy = dots[a].uy - dots[b].uy;
          const dz = dots[a].uz - dots[b].uz;
          if (dx * dx + dy * dy + dz * dz < THRESH * THRESH) {
            conns.push({ a, b });
            cnt[a]++; cnt[b]++;
          }
          if (cnt[a] >= 5) break;
        }
      }
    };

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      R = Math.min(w * 0.56, h * 0.92);
      build();
    };

    const render = () => {
      const t = (performance.now() - startTime) / 1000;
      rotY += 0.0014;
      const cosR = Math.cos(rotY), sinR = Math.sin(rotY);

      // Dome: sphere center sits just below visible bottom
      const cx = w / 2;
      const cy = h + R * 0.06;
      const FOV = 1300;
      const WAMP = R * 0.038;

      ctx.clearRect(0, 0, w, h);

      // Project all dots
      type P = { sx: number; sy: number; depth: number; alpha: number };
      const proj: P[] = new Array(dots.length);

      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];
        const wv = wave(d.ux, d.uz, t) * WAMP;

        // Y-axis rotation
        const rx = d.ux * cosR - d.uz * sinR;
        const rz = d.ux * sinR + d.uz * cosR;
        const ry = d.uy;

        // X-axis tilt (camera angle)
        const tx = rx;
        const ty = ry * cosTilt - rz * sinTilt;
        const tz = ry * sinTilt + rz * cosTilt;

        const persp = FOV / Math.max(FOV + tz * R, 1);
        const sx = cx + tx * R * persp;
        const sy = cy - (ty * R + wv) * persp;

        // depth 0=back 1=front
        const depth = (tz + 1) / 2;
        const alpha = 0.12 + depth * 0.78;

        proj[i] = { sx, sy, depth, alpha };
      }

      // Draw connections
      ctx.lineWidth = 0.45;
      for (const c of conns) {
        const pa = proj[c.a], pb = proj[c.b];
        if (pa.depth < 0.08 || pb.depth < 0.08) continue;
        const a = ((pa.alpha + pb.alpha) / 2) * 0.22;
        ctx.strokeStyle = `rgba(255,255,255,${a.toFixed(3)})`;
        ctx.beginPath();
        ctx.moveTo(pa.sx, pa.sy);
        ctx.lineTo(pb.sx, pb.sy);
        ctx.stroke();
      }

      // Mouse ripple
      const { x: mx, y: my } = mouse.current;

      // Draw dots
      for (let i = 0; i < proj.length; i++) {
        const p = proj[i];
        if (p.sy > h * 1.04) continue; // skip below screen

        // Mouse proximity ripple
        const mdx = p.sx - mx, mdy = p.sy - my;
        const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
        const ripple = mDist < 110
          ? Math.sin((110 - mDist) * 0.06 + t * 4) * 6
          : 0;
        const sx = p.sx + (mDist < 110 ? (mdx / (mDist || 1)) * ripple * 0.25 : 0);
        const sy = p.sy + (mDist < 110 ? (mdy / (mDist || 1)) * ripple * 0.25 : 0);

        const size = 0.9 + p.depth * 1.2;

        // Glow halo (only brighter dots)
        if (p.depth > 0.35) {
          const gR = size * 5;
          const g = ctx.createRadialGradient(sx, sy, 0, sx, sy, gR);
          g.addColorStop(0, `rgba(255,255,255,${(p.alpha * 0.35).toFixed(3)})`);
          g.addColorStop(1, 'rgba(255,255,255,0)');
          ctx.beginPath();
          ctx.arc(sx, sy, gR, 0, Math.PI * 2);
          ctx.fillStyle = g;
          ctx.fill();
        }

        // Core dot
        ctx.beginPath();
        ctx.arc(sx, sy, Math.max(size, 0.5), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${p.alpha.toFixed(3)})`;
        ctx.fill();
      }

      // Bottom fog gradient
      const fog = ctx.createLinearGradient(0, h * 0.72, 0, h);
      fog.addColorStop(0, 'rgba(0,0,0,0)');
      fog.addColorStop(1, 'rgba(0,0,0,0.9)');
      ctx.fillStyle = fog;
      ctx.fillRect(0, h * 0.72, w, h * 0.28);

      animId = requestAnimationFrame(render);
    };

    resize();
    render();

    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.current = { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const onLeave = () => { mouse.current = { x: -9999, y: -9999 }; };

    window.addEventListener('resize', resize);
    canvas.addEventListener('mousemove', onMove);
    canvas.addEventListener('mouseleave', onLeave);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', onMove);
      canvas.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-auto"
    />
  );
}
