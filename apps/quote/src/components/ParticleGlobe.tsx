'use client';
import React, { useRef, useEffect } from 'react';

const N = 2500, TILT = 0.38, ROT = 0.00014;

function isLand(lat: number, lon: number): boolean {
  if (lon > 180) lon -= 360;
  if (lon < -180) lon += 360;
  if (lat > 60 && lat < 84 && lon > -55 && lon < -17) return true; // Greenland
  if (lat > 63 && lat < 67 && lon > -24 && lon < -12) return true; // Iceland
  if (lat > 55 && lat < 72 && lon > -168 && lon < -130) return true; // Alaska
  if (lat > 25 && lat < 72 && lon > -128 && lon < -54) return true; // N.America
  if (lat > 8  && lat < 30 && lon > -118 && lon < -77) return true; // Mexico
  if (lat > 0  && lat < 12 && lon > -80  && lon < -34) return true; // N.S.America
  if (lat > 50 && lat < 61 && lon > -8   && lon < 2)   return true; // UK
  if (lat > 36 && lat < 72 && lon > -5   && lon < 28)  return true; // W.Europe
  if (lat > 44 && lat < 70 && lon > 22   && lon < 40)  return true; // E.Europe
  if (lat > 48 && lat < 78 && lon > 30   && lon < 180) return true; // Russia
  if (lat > 0  && lat < 38 && lon > -18  && lon < 52)  return true; // Africa
  if (lat > 12 && lat < 38 && lon > 33   && lon < 63)  return true; // M.East
  if (lat > 8  && lat < 35 && lon > 63   && lon < 92)  return true; // India
  if (lat > 20 && lat < 55 && lon > 90   && lon < 145) return true; // E.Asia
  if (lat > 30 && lat < 46 && lon > 129  && lon < 147) return true; // Japan
  if (lat > 0  && lat < 22 && lon > 95   && lon < 141) return Math.random() > 0.45; // SE Asia
  return false;
}

export default function ParticleGlobe() {
  const ref = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    let w = 0, h = 0, R = 0, animId = 0, rotY = 0;
    const T0 = performance.now();

    // ── Particles ──────────────────────────────────────────────────────────
    type Pt = {
      // scatter origin
      ox: number; oy: number; oz: number;
      // target on sphere
      tx: number; ty: number; tz: number;
      delay: number; dur: number;
      // curve bias axis (perpendicular kick)
      bx: number; by: number; bz: number;
    };
    type Conn = { a: number; b: number };
    let pts: Pt[] = [], conns: Conn[] = [];

    const ease = (x: number) => x < 0.5 ? 4*x*x*x : 1 - Math.pow(-2*x+2,3)/2;

    const build = () => {
      pts = []; conns = [];
      let placed = 0, tries = 0;
      while (placed < N && tries < N * 30) {
        tries++;
        // Fibonacci hemisphere (upper half y>=0)
        const phi = Math.acos(1 - Math.random()); // 0..PI/2 range biased
        const theta = Math.random() * Math.PI * 2;
        const lat = 90 - phi * 180 / Math.PI;
        const lon = theta * 180 / Math.PI - 180;
        if (!isLand(lat, lon) && Math.random() > 0.08) continue; // keep some ocean dots

        const sinP = Math.sin(phi), cosP = Math.cos(phi);
        const tx = sinP * Math.cos(theta);
        const ty = cosP;
        const tz = sinP * Math.sin(theta);

        // Random scatter position
        const spread = 3.5;
        const ox = (Math.random() - 0.5) * spread;
        const oy = (Math.random() - 0.5) * spread;
        const oz = (Math.random() - 0.5) * spread - 0.5;

        // Curve bias: perpendicular vector
        const len = Math.sqrt(ox*ox+oy*oy+oz*oz)||1;
        const bx = -(oz/len)*0.4, by = 0, bz = (ox/len)*0.4;

        pts.push({ ox, oy, oz, tx, ty, tz,
          delay: Math.random() * 900,
          dur:   1400 + Math.random() * 800,
          bx, by, bz
        });
        placed++;
      }

      // Pre-compute connections
      const cnt = new Uint8Array(pts.length);
      const CDIST2 = 0.30 * 0.30;
      for (let a = 0; a < pts.length; a++) {
        if (cnt[a] >= 5) continue;
        for (let b = a + 1; b < pts.length; b++) {
          if (cnt[b] >= 5) continue;
          const dx=pts[a].tx-pts[b].tx, dy=pts[a].ty-pts[b].ty, dz=pts[a].tz-pts[b].tz;
          if (dx*dx+dy*dy+dz*dz < CDIST2) {
            conns.push({a,b}); cnt[a]++; cnt[b]++;
          }
          if (cnt[a] >= 5) break;
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
      rotY += ROT;
      const cosR = Math.cos(rotY), sinR = Math.sin(rotY);

      // Sphere center: below canvas = dome effect
      const cx = w / 2, cy = h + R * 0.05;
      const FOV = 1300;

      ctx.clearRect(0, 0, w, h);

      // Top-right ambient blue glow (light rays)
      const lr = ctx.createRadialGradient(w*0.78, 0, 0, w*0.78, 0, w*0.65);
      lr.addColorStop(0, 'rgba(30,80,200,0.18)');
      lr.addColorStop(0.4,'rgba(10,40,120,0.07)');
      lr.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = lr; ctx.fillRect(0, 0, w, h);

      // ── Project particles ──────────────────────────────────────────────
      type ProjPt = { sx:number; sy:number; depth:number; alpha:number; prog:number };
      const proj: ProjPt[] = new Array(pts.length);
      let allDone = true;

      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        const raw = Math.max(0, Math.min(1, (elapsed - p.delay) / p.dur));
        if (raw < 1) allDone = false;
        const ep = ease(raw);

        // Curve: parabolic lift during mid-flight
        const arc = Math.sin(raw * Math.PI);
        const wx = p.ox + (p.tx - p.ox) * ep + p.bx * arc;
        const wy = p.oy + (p.ty - p.oy) * ep + p.by * arc;
        const wz = p.oz + (p.tz - p.oz) * ep + p.bz * arc;

        // Y-axis rotation (only applied to settled portion)
        const mix = ep; // rotate target proportion by rotY
        const rx = wx * cosR - wz * sinR * mix + wx * (1-mix);
        const rz = wz * cosR * mix + wx * sinR * mix + wz * (1-mix);
        // Simpler: just rotate target position and lerp
        const ttx = p.tx * cosR - p.tz * sinR;
        const ttz = p.tx * sinR + p.tz * cosR;
        const tty = p.ty;

        const fx = p.ox + (ttx - p.ox)*ep + p.bx*arc;
        const fy = p.oy + (tty - p.oy)*ep + p.by*arc;
        const fz = p.oz + (ttz - p.oz)*ep + p.bz*arc;

        // Camera tilt
        const tx2 = fx;
        const ty2 = fy * cosTilt - fz * sinTilt;
        const tz2 = fy * sinTilt + fz * cosTilt;

        const persp = FOV / Math.max(FOV + tz2 * R, 1);
        const sx = cx + tx2 * R * persp;
        const sy = cy - ty2 * R * persp;

        const depth = (tz2 + 1.5) / 2.5;
        const alpha = (0.1 + depth * 0.85) * (0.3 + ep * 0.7);
        proj[i] = { sx, sy, depth, alpha, prog: ep };
      }

      // ── Connections (fade in after formation) ──────────────────────────
      const connAlpha = allDone ? Math.min((elapsed - (pts[0]?.dur + pts[0]?.delay + 400)) / 1200, 1) : 0;
      if (connAlpha > 0) {
        // Pulse wave
        const pulse = ((elapsed / 1000) % 3) / 3;

        ctx.lineWidth = 0.4;
        for (let ci = 0; ci < conns.length; ci++) {
          const pa = proj[conns[ci].a], pb = proj[conns[ci].b];
          if (pa.depth < 0.1 || pb.depth < 0.1) continue;
          const avgA = (pa.alpha + pb.alpha) / 2;

          // Pulse effect
          const midDepth = (pa.depth + pb.depth) / 2;
          const pulseGlow = Math.abs(Math.sin((midDepth - pulse) * Math.PI * 4)) * 0.15;
          const la = (avgA * 0.18 + pulseGlow) * connAlpha;

          ctx.strokeStyle = `rgba(180,220,255,${la.toFixed(3)})`;
          ctx.beginPath();
          ctx.moveTo(pa.sx, pa.sy);
          ctx.lineTo(pb.sx, pb.sy);
          ctx.stroke();
        }
      }

      // ── Draw particles (additive blend for bloom) ──────────────────────
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      const { x: mx, y: my } = mouse.current;

      for (let i = 0; i < proj.length; i++) {
        const p = proj[i];
        if (p.sy > h * 1.05) continue;

        // Mouse ripple
        const mdx = p.sx - mx, mdy = p.sy - my;
        const md = Math.sqrt(mdx*mdx + mdy*mdy);
        const rip = md < 100 ? Math.sin((100-md)*0.07 + elapsed*0.004)*8 : 0;
        const sx = p.sx + (md < 100 && md > 0 ? (mdx/md)*rip*0.3 : 0);
        const sy = p.sy + (md < 100 && md > 0 ? (mdy/md)*rip*0.3 : 0);

        const baseSize = 0.7 + p.depth * 1.3;
        const a = p.alpha;

        // Outer glow
        if (p.depth > 0.3) {
          ctx.beginPath();
          ctx.arc(sx, sy, baseSize * 7, 0, Math.PI*2);
          ctx.fillStyle = `rgba(100,160,255,${(a*0.04).toFixed(3)})`;
          ctx.fill();
        }
        // Mid glow
        ctx.beginPath();
        ctx.arc(sx, sy, baseSize * 2.5, 0, Math.PI*2);
        ctx.fillStyle = `rgba(200,225,255,${(a*0.18).toFixed(3)})`;
        ctx.fill();
        // Core
        ctx.beginPath();
        ctx.arc(sx, sy, Math.max(baseSize * 0.9, 0.4), 0, Math.PI*2);
        ctx.fillStyle = `rgba(255,255,255,${Math.min(a, 0.95).toFixed(3)})`;
        ctx.fill();
      }
      ctx.restore();

      // Bottom fog
      const fog = ctx.createLinearGradient(0, h*0.68, 0, h);
      fog.addColorStop(0, 'rgba(5,7,10,0)');
      fog.addColorStop(1, 'rgba(5,7,10,0.95)');
      ctx.fillStyle = fog; ctx.fillRect(0, h*0.68, w, h*0.32);

      animId = requestAnimationFrame(render);
    };

    resize();
    render();

    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.current = { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    window.addEventListener('resize', () => { resize(); });
    canvas.addEventListener('mousemove', onMove);
    canvas.addEventListener('mouseleave', () => { mouse.current = {x:-9999,y:-9999}; });

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={ref} className="w-full h-full block" style={{background:'#05070a'}} />;
}
