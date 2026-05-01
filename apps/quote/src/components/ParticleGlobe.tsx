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

const ease = (x: number) => x < 0.5 ? 4*x*x*x : 1 - Math.pow(-2*x+2,3)/2;

export default function ParticleGlobe() {
  const ref = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    let w = 0, h = 0, R = 0, animId = 0, rotY = 0;
    const T0 = performance.now();

    type Pt = {
      ox: number; oy: number; oz: number;
      tx: number; ty: number; tz: number;
      delay: number; dur: number;
      bx: number; bz: number;        // arc curve bias
      size: number;
      glowPhase: number;             // random phase for flicker glow
      glowSpeed: number;
    };
    type Conn = { a: number; b: number; dist: number };
    let pts: Pt[] = [], conns: Conn[] = [];

    const build = () => {
      pts = []; conns = [];
      let placed = 0, tries = 0;
      while (placed < N && tries < N * 40) {
        tries++;
        const phi   = Math.acos(1 - Math.random());
        const theta = Math.random() * Math.PI * 2;
        const lat   = 90 - phi * 180 / Math.PI;
        const lon   = theta * 180 / Math.PI - 180;
        if (!isLand(lat, lon) && Math.random() > 0.07) continue;

        const sinP = Math.sin(phi), cosP = Math.cos(phi);
        const tx = sinP * Math.cos(theta);
        const ty = cosP;
        const tz = sinP * Math.sin(theta);

        const spread = 3.2;
        const ox = (Math.random()-0.5)*spread;
        const oy = (Math.random()-0.5)*spread;
        const oz = (Math.random()-0.5)*spread - 0.5;

        const len = Math.sqrt(ox*ox+oy*oy+oz*oz) || 1;
        const bx = -(oz/len)*0.3, bz = (ox/len)*0.3;

        pts.push({ ox, oy, oz, tx, ty, tz,
          delay: Math.random() * 900,
          dur:   1500 + Math.random() * 700,
          bx, bz,
          size: 0.7 + Math.random() * 0.9,
          glowPhase: Math.random() * Math.PI * 2,
          glowSpeed: 0.4 + Math.random() * 1.2,
        });
        placed++;
      }

      // Sparse connections: max 2 per dot
      const cnt = new Uint8Array(pts.length);
      const THRESH2 = 0.24 * 0.24;
      for (let a = 0; a < pts.length; a++) {
        if (cnt[a] >= 2) continue;
        for (let b = a + 1; b < pts.length; b++) {
          if (cnt[b] >= 2) continue;
          const dx=pts[a].tx-pts[b].tx, dy=pts[a].ty-pts[b].ty, dz=pts[a].tz-pts[b].tz;
          const d2=dx*dx+dy*dy+dz*dz;
          if (d2 < THRESH2) { conns.push({a,b,dist:Math.sqrt(d2)}); cnt[a]++; cnt[b]++; }
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

    const render = () => {
      const now = performance.now();
      const elapsed = now - T0;
      const t = elapsed / 1000;
      rotY += ROT;
      const cosR = Math.cos(rotY), sinR = Math.sin(rotY);
      const cx = w / 2, cy = h + R * 0.05;
      const FOV = 1300;

      ctx.clearRect(0, 0, w, h);

      // Project all particles
      type ProjPt = { sx:number; sy:number; depth:number; alpha:number; ep:number; idx:number };
      const proj: ProjPt[] = new Array(pts.length);

      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        const raw = Math.max(0, Math.min(1, (elapsed - p.delay) / p.dur));
        const ep  = ease(raw);
        const arc = Math.sin(raw * Math.PI);

        // Rotate target
        const ttx = p.tx * cosR - p.tz * sinR;
        const ttz = p.tx * sinR + p.tz * cosR;
        const tty = p.ty;

        // Lerp scatter → target with curved arc
        const fx = p.ox + (ttx - p.ox)*ep + p.bx*arc;
        const fy = p.oy + (tty - p.oy)*ep;
        const fz = p.oz + (ttz - p.oz)*ep + p.bz*arc;

        // Camera tilt
        const tx2 = fx;
        const ty2 = fy * cosTilt - fz * sinTilt;
        const tz2 = fy * sinTilt + fz * cosTilt;

        const persp = FOV / Math.max(FOV + tz2 * R, 1);
        const sx = cx + tx2 * R * persp;
        const sy = cy - ty2 * R * persp;
        const depth = (tz2 + 1.5) / 2.5;
        const alpha = (0.08 + depth * 0.80) * (0.15 + ep * 0.85);

        proj[i] = { sx, sy, depth, alpha, ep, idx: i };
      }

      // Connections — fade in after formation (max delay+dur ≈ 2200ms)
      const formEnd = 900 + 1500 + 700;
      const connAlpha = Math.max(0, Math.min(1, (elapsed - formEnd) / 1200));

      if (connAlpha > 0) {
        ctx.lineWidth = 0.4;
        for (const c of conns) {
          const pa = proj[c.a], pb = proj[c.b];
          if (pa.depth < 0.12 || pb.depth < 0.12) continue;
          const avgD  = (pa.depth + pb.depth) / 2;
          const dFade = 1 - c.dist / 0.24;
          const la = avgD * 0.18 * dFade * connAlpha;
          if (la < 0.01) continue;
          ctx.strokeStyle = `rgba(255,255,255,${la.toFixed(3)})`;
          ctx.beginPath();
          ctx.moveTo(pa.sx, pa.sy);
          ctx.lineTo(pb.sx, pb.sy);
          ctx.stroke();
        }
      }

      // Draw particles with additive blending for glow
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      const { x: mx, y: my } = mouse.current;

      for (let i = 0; i < proj.length; i++) {
        const p  = proj[i];
        const pt = pts[i];
        if (p.sy > h * 1.05 || p.alpha < 0.01) continue;

        // Random flicker glow: each particle pulses independently
        const flicker = 0.5 + 0.5 * Math.sin(t * pt.glowSpeed + pt.glowPhase);
        // Only ~20% of dots are "lit up" at any moment via phase offset
        const isGlowing = flicker > 0.78;
        const glowBoost = isGlowing ? (flicker - 0.78) / 0.22 : 0; // 0..1

        // Mouse repel
        const mdx = p.sx - mx, mdy = p.sy - my;
        const md  = Math.sqrt(mdx*mdx + mdy*mdy);
        const rip = md < 90 ? Math.sin((90-md)*0.08 + t*4)*5 : 0;
        const sx  = p.sx + (md < 90 && md > 0.5 ? (mdx/md)*rip*0.25 : 0);
        const sy  = p.sy + (md < 90 && md > 0.5 ? (mdy/md)*rip*0.25 : 0);

        const baseSize = pt.size * (0.5 + p.depth * 0.9);
        const a = p.alpha;

        // Large bloom on glowing particles
        if (glowBoost > 0 && p.ep > 0.5) {
          ctx.beginPath();
          ctx.arc(sx, sy, baseSize * (10 + glowBoost * 8), 0, Math.PI*2);
          ctx.fillStyle = `rgba(255,255,255,${(a * glowBoost * 0.06).toFixed(3)})`;
          ctx.fill();

          ctx.beginPath();
          ctx.arc(sx, sy, baseSize * (4 + glowBoost * 4), 0, Math.PI*2);
          ctx.fillStyle = `rgba(255,255,255,${(a * glowBoost * 0.18).toFixed(3)})`;
          ctx.fill();
        }

        // Subtle constant halo (all dots)
        ctx.beginPath();
        ctx.arc(sx, sy, baseSize * 3, 0, Math.PI*2);
        ctx.fillStyle = `rgba(255,255,255,${(a * 0.08).toFixed(3)})`;
        ctx.fill();

        // Core dot
        ctx.beginPath();
        ctx.arc(sx, sy, Math.max(baseSize * 0.9, 0.4), 0, Math.PI*2);
        ctx.fillStyle = `rgba(255,255,255,${Math.min(a + glowBoost * 0.3, 0.95).toFixed(3)})`;
        ctx.fill();
      }
      ctx.restore();

      // Bottom fog
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
      mouse.current = { x: e.clientX-r.left, y: e.clientY-r.top };
    };
    window.addEventListener('resize', resize);
    canvas.addEventListener('mousemove', onMove);
    canvas.addEventListener('mouseleave', () => { mouse.current={x:-9999,y:-9999}; });

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={ref} className="w-full h-full block" style={{ background: '#05070a' }} />;
}
