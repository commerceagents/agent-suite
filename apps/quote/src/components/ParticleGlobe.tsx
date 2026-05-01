'use client';
import React, { useRef, useEffect } from 'react';

const N = 2000, TILT = 0.38, ROT_SPEED = 0.00010;

function isLand(lat: number, lon: number): boolean {
  if (lon > 180) lon -= 360;
  if (lon < -180) lon += 360;
  if (lat > 60 && lat < 84 && lon > -55 && lon < -17) return true;
  if (lat > 55 && lat < 72 && lon > -168 && lon < -130) return true;
  if (lat > 25 && lat < 72 && lon > -128 && lon < -54) return true;
  if (lat > 8  && lat < 30 && lon > -118 && lon < -77) return true;
  if (lat > 0  && lat < 12 && lon > -80  && lon < -34) return true;
  if (lat > 50 && lat < 61 && lon > -8   && lon < 2)   return true;
  if (lat > 36 && lat < 72 && lon > -5   && lon < 28)  return true;
  if (lat > 44 && lat < 70 && lon > 22   && lon < 40)  return true;
  if (lat > 48 && lat < 78 && lon > 30   && lon < 180) return true;
  if (lat > 0  && lat < 38 && lon > -18  && lon < 52)  return true;
  if (lat > 8  && lat < 35 && lon > 63   && lon < 92)  return true;
  if (lat > 20 && lat < 55 && lon > 90   && lon < 145) return true;
  if (lat > 0  && lat < 22 && lon > 95   && lon < 141) return Math.random() > 0.5;
  return false;
}

// easeInOutCubic
const ease = (x: number) => x < 0.5 ? 4*x*x*x : 1 - Math.pow(-2*x+2, 3)/2;

export default function ParticleGlobe() {
  const ref = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;

    let w = 0, h = 0, R = 0, animId = 0, rotY = 0;
    const T0 = performance.now();
    const FORM_DELAY   = 300;  // ms before formation starts
    const FORM_DURATION = 2500; // ms to complete formation

    type Pt = {
      // Start: scattered across screen in normalized coords (-1..1)
      sx: number; sy: number; sz: number;
      // Target: on hemisphere surface (unit sphere)
      tx: number; ty: number; tz: number;
      // Per-particle stagger offset (0..600ms)
      stagger: number;
      size: number;
    };
    type Conn = { a: number; b: number };

    let pts: Pt[] = [];
    let conns: Conn[] = [];

    const build = () => {
      pts = []; conns = [];

      let placed = 0, tries = 0;
      while (placed < N && tries < N * 40) {
        tries++;
        // Fibonacci-like distribution on upper hemisphere
        const phi   = Math.acos(1 - Math.random()); // 0..~PI/2
        const theta = Math.random() * Math.PI * 2;
        const lat   = 90 - phi * 180 / Math.PI;
        const lon   = theta * 180 / Math.PI - 180;
        if (!isLand(lat, lon) && Math.random() > 0.07) continue;

        const sinP = Math.sin(phi), cosP = Math.cos(phi);
        const tx = sinP * Math.cos(theta);
        const ty = cosP;
        const tz = sinP * Math.sin(theta);

        // Scatter start: random position spread across full viewport
        // Use large spread so formation is clearly visible
        const sx = (Math.random() - 0.5) * 4.0;
        const sy = (Math.random() - 0.5) * 4.0;
        const sz = (Math.random() - 0.5) * 2.0;

        pts.push({
          sx, sy, sz, tx, ty, tz,
          stagger: Math.random() * 600,
          size: 0.8 + Math.random() * 0.7,
        });
        placed++;
      }

      // Pre-compute sparse connections (max 2 per dot, short threshold)
      const cnt = new Uint8Array(pts.length);
      const THRESH2 = 0.23 * 0.23;
      for (let a = 0; a < pts.length; a++) {
        if (cnt[a] >= 2) continue;
        for (let b = a + 1; b < pts.length; b++) {
          if (cnt[b] >= 2) continue;
          const dx = pts[a].tx - pts[b].tx;
          const dy = pts[a].ty - pts[b].ty;
          const dz = pts[a].tz - pts[b].tz;
          if (dx*dx + dy*dy + dz*dz < THRESH2) {
            conns.push({ a, b });
            cnt[a]++; cnt[b]++;
          }
          if (cnt[a] >= 2) break;
        }
      }
    };

    const resize = () => {
      const dpr = devicePixelRatio || 1;
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width  = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      R = Math.min(w * 0.42, h * 0.72);
      build();
    };

    const cosTilt = Math.cos(TILT);
    const sinTilt = Math.sin(TILT);

    const render = () => {
      const now     = performance.now();
      const elapsed = now - T0;
      rotY += ROT_SPEED;

      const cosR = Math.cos(rotY);
      const sinR = Math.sin(rotY);

      // Dome: center just below bottom edge
      const cx = w / 2;
      const cy = h + R * 0.05;
      const FOV = 1300;

      ctx.clearRect(0, 0, w, h);

      // ---------- Project all particles ----------
      type P = { sx: number; sy: number; depth: number; alpha: number; prog: number };
      const proj: P[] = new Array(pts.length);
      let formationDone = true;

      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];

        // Progress for this particle (accounts for stagger)
        const elapsed2 = elapsed - FORM_DELAY - p.stagger;
        const rawProg  = Math.max(0, Math.min(1, elapsed2 / FORM_DURATION));
        const prog     = ease(rawProg);
        if (rawProg < 1) formationDone = false;

        // Rotate target by current rotY
        const rtx =  p.tx * cosR - p.tz * sinR;
        const rtz =  p.tx * sinR + p.tz * cosR;
        const rty =  p.ty;

        // Current world position: lerp from scatter to target
        const wx = p.sx + (rtx - p.sx) * prog;
        const wy = p.sy + (rty - p.sy) * prog;
        const wz = p.sz + (rtz - p.sz) * prog;

        // Camera tilt (X-axis rotation)
        const tx2 =  wx;
        const ty2 =  wy * cosTilt - wz * sinTilt;
        const tz2 =  wy * sinTilt + wz * cosTilt;

        // Perspective projection
        const persp = FOV / Math.max(FOV + tz2 * R, 1);
        const screenX = cx + tx2 * R * persp;
        const screenY = cy - ty2 * R * persp;

        // Depth: 0=back, 1=front
        const depth = (tz2 + 1.5) / 2.5;
        const alpha = (0.10 + depth * 0.75) * (0.1 + prog * 0.9);

        proj[i] = { sx: screenX, sy: screenY, depth, alpha, prog };
      }

      // ---------- Draw connection lines ----------
      // Fade in connections once formation is ~80% complete
      const connAlpha = Math.max(0, Math.min(1,
        (elapsed - FORM_DELAY - FORM_DURATION * 0.8) / 1000
      ));

      if (connAlpha > 0) {
        ctx.lineWidth = 0.45;
        for (const c of conns) {
          const pa = proj[c.a], pb = proj[c.b];
          if (pa.depth < 0.10 || pb.depth < 0.10) continue;
          const avgAlpha = (pa.alpha + pb.alpha) / 2 * 0.22 * connAlpha;
          if (avgAlpha < 0.008) continue;
          ctx.strokeStyle = `rgba(255,255,255,${avgAlpha.toFixed(3)})`;
          ctx.beginPath();
          ctx.moveTo(pa.sx, pa.sy);
          ctx.lineTo(pb.sx, pb.sy);
          ctx.stroke();
        }
      }

      // ---------- Draw dots ----------
      const { x: mx, y: my } = mouse.current;

      for (let i = 0; i < proj.length; i++) {
        const p  = proj[i];
        const pt = pts[i];
        if (p.sy > h * 1.05 || p.alpha < 0.008) continue;

        // Mouse ripple
        const mdx = p.sx - mx, mdy = p.sy - my;
        const md  = Math.sqrt(mdx * mdx + mdy * mdy);
        const rip = md < 80 ? Math.sin((80 - md) * 0.09) * 4 : 0;
        const sx  = p.sx + (md > 0.5 && md < 80 ? (mdx / md) * rip * 0.3 : 0);
        const sy  = p.sy + (md > 0.5 && md < 80 ? (mdy / md) * rip * 0.3 : 0);

        const dotSize = Math.max(pt.size * (0.5 + p.depth * 0.9), 0.5);

        // Simple white dot — no glow, no bloom
        ctx.beginPath();
        ctx.arc(sx, sy, dotSize, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${Math.min(p.alpha, 0.9).toFixed(3)})`;
        ctx.fill();
      }

      // ---------- Bottom fog ----------
      const fog = ctx.createLinearGradient(0, h * 0.62, 0, h);
      fog.addColorStop(0, 'rgba(5,7,10,0)');
      fog.addColorStop(1, 'rgba(5,7,10,0.97)');
      ctx.fillStyle = fog;
      ctx.fillRect(0, h * 0.62, w, h * 0.38);

      animId = requestAnimationFrame(render);
    };

    resize();
    render();

    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.current = { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    window.addEventListener('resize', resize);
    canvas.addEventListener('mousemove', onMove);
    canvas.addEventListener('mouseleave', () => { mouse.current = { x: -9999, y: -9999 }; });

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className="w-full h-full block"
      style={{ background: '#05070a' }}
    />
  );
}
