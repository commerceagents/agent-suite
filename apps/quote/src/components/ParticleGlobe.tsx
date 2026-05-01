'use client';
import React, { useRef, useEffect } from 'react';

const N = 2200, TILT = 0.38, ROT = 0.00012;

function isLand(lat: number, lon: number): boolean {
  if (lon > 180) lon -= 360;
  if (lon < -180) lon += 360;
  if (lat > 60 && lat < 84 && lon > -55 && lon < -17) return true;
  if (lat > 63 && lat < 67 && lon > -24 && lon < -12) return true;
  if (lat > 55 && lat < 72 && lon > -168 && lon < -130) return true;
  if (lat > 25 && lat < 72 && lon > -128 && lon < -54) return true;
  if (lat > 8  && lat < 30 && lon > -118 && lon < -77) return true;
  if (lat > 0  && lat < 12 && lon > -80  && lon < -34) return true;
  if (lat > 50 && lat < 61 && lon > -8   && lon < 2)   return true;
  if (lat > 36 && lat < 72 && lon > -5   && lon < 28)  return true;
  if (lat > 44 && lat < 70 && lon > 22   && lon < 40)  return true;
  if (lat > 48 && lat < 78 && lon > 30   && lon < 180) return true;
  if (lat > 0  && lat < 38 && lon > -18  && lon < 52)  return true;
  if (lat > 12 && lat < 38 && lon > 33   && lon < 63)  return true;
  if (lat > 8  && lat < 35 && lon > 63   && lon < 92)  return true;
  if (lat > 20 && lat < 55 && lon > 90   && lon < 145) return true;
  if (lat > 30 && lat < 46 && lon > 129  && lon < 147) return true;
  if (lat > 0  && lat < 22 && lon > 95   && lon < 141) return Math.random() > 0.45;
  return false;
}

const easeInOutCubic = (x: number) =>
  x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;

export default function ParticleGlobe() {
  const ref = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    let w = 0, h = 0, R = 0, animId = 0, rotY = 0;
    const T0 = performance.now();

    type Pt = {
      ox: number; oy: number; oz: number; // scatter origin
      tx: number; ty: number; tz: number; // target on sphere
      delay: number; dur: number;
      bx: number; by: number; bz: number; // curve bias
      jx: number; jy: number; jz: number; // organic jitter on final pos
      size: number;
    };
    type Conn = { a: number; b: number; dist: number };
    let pts: Pt[] = [], conns: Conn[] = [];

    const build = () => {
      pts = []; conns = [];
      let placed = 0, tries = 0;
      while (placed < N && tries < N * 40) {
        tries++;
        const u = Math.random(), v = Math.random();
        const phi   = Math.acos(1 - u);        // 0..PI/2 upper hemi bias
        const theta = v * Math.PI * 2;
        const lat = 90 - phi * 180 / Math.PI;
        const lon = theta * 180 / Math.PI - 180;
        if (!isLand(lat, lon) && Math.random() > 0.07) continue;

        const sinP = Math.sin(phi), cosP = Math.cos(phi);
        const tx = sinP * Math.cos(theta);
        const ty = cosP;
        const tz = sinP * Math.sin(theta);

        const spread = 3.2;
        const ox = (Math.random() - 0.5) * spread;
        const oy = (Math.random() - 0.5) * spread;
        const oz = (Math.random() - 0.5) * spread - 0.5;

        // Perpendicular curve bias for arc paths
        const len = Math.sqrt(ox*ox+oy*oy+oz*oz) || 1;
        const bx = -(oz/len)*0.35, by = (Math.random()-0.5)*0.2, bz = (ox/len)*0.35;

        // Subtle organic jitter on landing position
        const jitter = 0.012;
        const jx = (Math.random()-0.5)*jitter;
        const jy = (Math.random()-0.5)*jitter;
        const jz = (Math.random()-0.5)*jitter;

        pts.push({ ox, oy, oz, tx, ty, tz, delay: Math.random() * 800,
          dur: 1400 + Math.random() * 700, bx, by, bz, jx, jy, jz,
          size: 0.6 + Math.random() * 0.8 });
        placed++;
      }

      // Sparse connections: max 2 per particle, short threshold
      const cnt = new Uint8Array(pts.length);
      const CDIST2 = 0.22 * 0.22; // shorter threshold = fewer connections
      for (let a = 0; a < pts.length; a++) {
        if (cnt[a] >= 2) continue;
        for (let b = a + 1; b < pts.length; b++) {
          if (cnt[b] >= 2) continue;
          const dx=pts[a].tx-pts[b].tx, dy=pts[a].ty-pts[b].ty, dz=pts[a].tz-pts[b].tz;
          const d2 = dx*dx+dy*dy+dz*dz;
          if (d2 < CDIST2) {
            conns.push({ a, b, dist: Math.sqrt(d2) });
            cnt[a]++; cnt[b]++;
          }
          if (cnt[a] >= 2) break;
        }
      }
    };

    const resize = () => {
      const dpr = devicePixelRatio || 1;
      w = canvas.offsetWidth; h = canvas.offsetHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      R = Math.min(w * 0.42, h * 0.72);
      build();
    };

    const cosTilt = Math.cos(TILT), sinTilt = Math.sin(TILT);

    // Directional light vector (top-right): normalized
    const LX = 0.6, LY = 0.7, LZ = 0.4;

    const render = () => {
      const now = performance.now();
      const elapsed = now - T0;
      rotY += ROT;
      const cosR = Math.cos(rotY), sinR = Math.sin(rotY);
      const cx = w / 2, cy = h + R * 0.05;
      const FOV = 1300;

      ctx.clearRect(0, 0, w, h);

      // ── Background top-right directional glow (rim light source) ──────
      const rimGrad = ctx.createRadialGradient(w*0.80, h*0.05, 0, w*0.80, h*0.05, w*0.55);
      rimGrad.addColorStop(0,   'rgba(40,100,255,0.20)');
      rimGrad.addColorStop(0.4, 'rgba(20,60,180,0.08)');
      rimGrad.addColorStop(1,   'rgba(0,0,0,0)');
      ctx.fillStyle = rimGrad; ctx.fillRect(0, 0, w, h);

      // ── Project ────────────────────────────────────────────────────────
      type ProjPt = { sx:number; sy:number; depth:number; alpha:number;
                      ep:number; lit:number; nx:number; ny:number; nz:number };
      const proj: ProjPt[] = new Array(pts.length);
      let allDone = true, maxElapsed = 0;

      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        const raw = Math.max(0, Math.min(1, (elapsed - p.delay) / p.dur));
        if (raw < 1) allDone = false;
        const ep = easeInOutCubic(raw);
        const arc = Math.sin(raw * Math.PI);

        // Rotate target position
        const ttx = p.tx * cosR - p.tz * sinR;
        const ttz = p.tx * sinR + p.tz * cosR;
        const tty = p.ty;

        // Interpolate scatter → rotated target with curve bias + jitter
        const fx = p.ox + (ttx + p.jx - p.ox)*ep + p.bx*arc;
        const fy = p.oy + (tty + p.jy - p.oy)*ep + p.by*arc;
        const fz = p.oz + (ttz + p.jz - p.oz)*ep + p.bz*arc;

        // Camera tilt
        const tx2 = fx;
        const ty2 = fy * cosTilt - fz * sinTilt;
        const tz2 = fy * sinTilt + fz * cosTilt;

        const persp = FOV / Math.max(FOV + tz2 * R, 1);
        const sx = cx + tx2 * R * persp;
        const sy = cy - ty2 * R * persp;

        // Depth 0=back 1=front
        const depth = (tz2 + 1.5) / 2.5;

        // Lighting: dot product of surface normal with light direction
        // Normal = normalized world position of settled particle
        const nx = ttx, ny = tty, nz = ttz;
        const lit = Math.max(0, nx*LX + ny*LY + nz*LZ);

        const alpha = (0.08 + depth * 0.75) * (0.2 + ep * 0.8);

        maxElapsed = Math.max(maxElapsed, elapsed - p.delay);
        proj[i] = { sx, sy, depth, alpha, ep, lit, nx, ny, nz };
      }

      // ── Connections ────────────────────────────────────────────────────
      // Fade in 1s after all formed
      const formEnd = 800 + 1400 + 700; // max delay + max dur
      const connProg = Math.max(0, Math.min(1, (elapsed - formEnd) / 1000));

      if (connProg > 0) {
        // Pulse wave: travels across globe every 4s
        const pulseT = (elapsed / 1000) % 4;
        const pulseFront = pulseT / 4; // 0..1 across depth

        ctx.lineWidth = 0.5;
        for (const c of conns) {
          const pa = proj[c.a], pb = proj[c.b];
          if (pa.depth < 0.12 || pb.depth < 0.12) continue;

          const avgDepth = (pa.depth + pb.depth) / 2;
          const avgLit   = (pa.lit   + pb.lit  ) / 2;

          // Distance-based fade
          const distFade = 1 - (c.dist / 0.22);

          // Pulse highlight
          const pulseProx = Math.exp(-Math.pow((avgDepth - pulseFront) * 8, 2));
          const pulseBoost = pulseProx * 0.35;

          const la = (0.04 + avgLit * 0.12 + pulseBoost) * distFade * connProg;
          if (la < 0.01) continue;

          // Lit side: cyan tint. Dark side: muted blue
          const r = Math.floor(80  + avgLit * 120);
          const g = Math.floor(140 + avgLit * 100);
          const b2 = 255;
          ctx.strokeStyle = `rgba(${r},${g},${b2},${la.toFixed(3)})`;
          ctx.beginPath();
          ctx.moveTo(pa.sx, pa.sy);
          ctx.lineTo(pb.sx, pb.sy);
          ctx.stroke();
        }
      }

      // ── Particles ──────────────────────────────────────────────────────
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      const { x: mx, y: my } = mouse.current;

      for (let i = 0; i < proj.length; i++) {
        const p = proj[i];
        if (p.sy > h * 1.05 || p.alpha < 0.01) continue;

        // Mouse ripple
        const mdx = p.sx - mx, mdy = p.sy - my;
        const md = Math.sqrt(mdx*mdx + mdy*mdy);
        const rip = md < 90 ? Math.sin((90-md)*0.08 + elapsed*0.004)*6 : 0;
        const sx = p.sx + (md < 90 && md > 0.5 ? (mdx/md)*rip*0.25 : 0);
        const sy = p.sy + (md < 90 && md > 0.5 ? (mdy/md)*rip*0.25 : 0);

        // Lighting affects color and size
        const lit = p.lit;
        const baseSize = p.depth > 0 ? (pts[i]?.size ?? 1) * (0.5 + p.depth * 0.9) : 0.5;

        // Color: lit side = bright cyan-white, dark side = deep blue
        const cr = Math.floor(60  + lit * 195); // 60..255
        const cg = Math.floor(120 + lit * 135); // 120..255
        const cb = 255;

        const a = p.alpha;

        // Outer bloom (only on lit side)
        if (lit > 0.2 && p.depth > 0.25) {
          ctx.beginPath();
          ctx.arc(sx, sy, baseSize * 8, 0, Math.PI*2);
          ctx.fillStyle = `rgba(${cr},${cg},${cb},${(a*0.025).toFixed(3)})`;
          ctx.fill();
        }
        // Mid glow
        ctx.beginPath();
        ctx.arc(sx, sy, baseSize * 2.8, 0, Math.PI*2);
        ctx.fillStyle = `rgba(${cr},${cg},${cb},${(a*0.14).toFixed(3)})`;
        ctx.fill();
        // Core
        ctx.beginPath();
        ctx.arc(sx, sy, Math.max(baseSize * 0.85, 0.4), 0, Math.PI*2);
        ctx.fillStyle = `rgba(${cr},${cg},${cb},${Math.min(a, 0.9).toFixed(3)})`;
        ctx.fill();
      }
      ctx.restore();

      // ── Rim light edge glow around globe ──────────────────────────────
      // Draw a soft arc highlight on top-right of globe
      const glowX = cx + R * 0.38, glowY = cy - R * 0.72;
      const rimR = ctx.createRadialGradient(glowX, glowY, 0, glowX, glowY, R * 0.5);
      rimR.addColorStop(0,   'rgba(100,180,255,0.18)');
      rimR.addColorStop(0.5, 'rgba(60,120,255,0.06)');
      rimR.addColorStop(1,   'rgba(0,0,0,0)');
      ctx.fillStyle = rimR; ctx.fillRect(0, 0, w, h);

      // ── Bottom fog ────────────────────────────────────────────────────
      const fog = ctx.createLinearGradient(0, h*0.65, 0, h);
      fog.addColorStop(0, 'rgba(5,7,10,0)');
      fog.addColorStop(1, 'rgba(5,7,10,0.97)');
      ctx.fillStyle = fog; ctx.fillRect(0, h*0.65, w, h*0.35);

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
    canvas.addEventListener('mouseleave', () => { mouse.current = {x:-9999,y:-9999}; });

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={ref} className="w-full h-full block" style={{ background: '#05070a' }} />;
}
