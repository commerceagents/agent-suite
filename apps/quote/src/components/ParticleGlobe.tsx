'use client';
import React, { useRef, useEffect } from 'react';

// Geographic land detection
function isLand(lat: number, lon: number): boolean {
  if (lat > 15 && lat < 75 && lon > -168 && lon < -52) return true;
  if (lat > 5 && lat < 20 && lon > -90 && lon < -60) return true;
  if (lat > -57 && lat < 12 && lon > -82 && lon < -34) return true;
  if (lat > 36 && lat < 71 && lon > -10 && lon < 40) return true;
  if (lat > 55 && lat < 72 && lon > -25 && lon < 32) return true;
  if (lat > -35 && lat < 37 && lon > -18 && lon < 52) return true;
  if (lat > 14 && lat < 42 && lon > 35 && lon < 65) return true;
  if (lat > 6 && lat < 37 && lon > 68 && lon < 92) return true;
  if (lat > 20 && lat < 80 && lon > 60 && lon < 140) return true;
  if (lat > -5 && lat < 25 && lon > 95 && lon < 125) return true;
  if (lat > 30 && lat < 46 && lon > 128 && lon < 146) return true;
  if (lat > -45 && lat < -10 && lon > 113 && lon < 154) return true;
  if (lat > 60 && lat < 84 && lon > -55 && lon < -17) return true;
  return false;
}

// Layered sine noise — organic, non-repeating feel
function noise3(x: number, y: number, z: number, t: number): number {
  return (
    0.30 * Math.sin(2.1*x + 0.9*t + z) +
    0.22 * Math.sin(1.7*y + 0.6*t + 1.3) +
    0.18 * Math.sin(3.2*z - 1.1*x + 0.85*t) +
    0.12 * Math.sin(0.8*x + 2.3*y + 1.4*t) +
    0.10 * Math.sin(2.8*y - 2.0*z + 0.5*t + 2.1) +
    0.08 * Math.sin(1.3*x + 3.5*z + 0.7*t)
  );
}

const easeIO = (t: number) => t < 0.5 ? 4*t*t*t : 1-Math.pow(-2*t+2,3)/2;

export default function ParticleGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = 0, h = 0, animId: number, R = 400, rotY = 0, connAlpha = 0;
    const T0 = performance.now();
    const FORM_DELAY = 200;
    const FORM_DUR = 2600;
    const N = 2800;
    const TILT = 0.40;

    type P = {
      sx:number; sy:number; sz:number;
      tx:number; ty:number; tz:number;
      delay:number; baseSize:number;
      driftX:number; driftY:number; driftZ:number;
      // noise offsets for breaking symmetry on target
      noiseOx:number; noiseOy:number; noiseOz:number;
    };
    type C = { a:number; b:number };
    let pts: P[] = [];
    let conns: C[] = [];

    const build = () => {
      pts = []; conns = [];

      // Pure random rejection sampling (no Fibonacci — no symmetry)
      const tries = N * 30;
      for (let i = 0; i < tries && pts.length < N; i++) {
        // Random point on sphere surface (not grid-based)
        const u = Math.random() * 2 - 1;          // uniform for y
        const theta = Math.random() * Math.PI * 2;
        const r2d = Math.sqrt(Math.max(0, 1 - u*u));
        const tx0 = r2d * Math.cos(theta);
        const ty0 = u;
        const tz0 = r2d * Math.sin(theta);

        // Convert to lat/lon
        const lat = Math.asin(Math.max(-1, Math.min(1, ty0))) * 180 / Math.PI;
        const lon = Math.atan2(tz0, tx0) * 180 / Math.PI;
        if (!isLand(lat, lon)) continue;

        // Density variation: continent interiors denser (higher acceptance for clustered areas)
        // implemented naturally by rejection — no extra weighting needed

        // Noise-based offset to break perfect sphere surface alignment
        // Small random jitter so particles aren't all exactly on the sphere surface
        const noiseScale = 0.04 + Math.random() * 0.06;
        const noiseOx = (Math.random() - 0.5) * noiseScale;
        const noiseOy = (Math.random() - 0.5) * noiseScale;
        const noiseOz = (Math.random() - 0.5) * noiseScale;

        // Scatter start position
        const sr = 0.5 + Math.random() * 2.8;
        const sa = Math.random() * Math.PI * 2;
        const sb = Math.acos(2 * Math.random() - 1); // uniform sphere scatter
        pts.push({
          sx: Math.sin(sb)*Math.cos(sa)*sr,
          sy: Math.cos(sb)*sr,
          sz: Math.sin(sb)*Math.sin(sa)*sr,
          tx: tx0, ty: ty0, tz: tz0,
          delay: Math.random() * 0.50,
          baseSize: 0.55 + Math.random() * 1.2,
          driftX: (Math.random()-0.5)*0.30,
          driftY: (Math.random()-0.5)*0.30,
          driftZ: (Math.random()-0.5)*0.30,
          noiseOx, noiseOy, noiseOz,
        });
      }

      // Pre-compute connections on target positions
      const CDIST = 0.26, MAX_C = 4;
      const cnt = new Uint8Array(pts.length);
      for (let a = 0; a < pts.length; a++) {
        if (cnt[a] >= MAX_C) continue;
        for (let b = a+1; b < pts.length; b++) {
          if (cnt[b] >= MAX_C) continue;
          const dx = pts[a].tx-pts[b].tx, dy = pts[a].ty-pts[b].ty, dz = pts[a].tz-pts[b].tz;
          if (dx*dx+dy*dy+dz*dz < CDIST*CDIST) { conns.push({a,b}); cnt[a]++; cnt[b]++; }
          if (cnt[a] >= MAX_C) break;
        }
      }
    };

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      w = canvas.offsetWidth; h = canvas.offsetHeight;
      canvas.width = w*dpr; canvas.height = h*dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      R = Math.min(w*0.56, h*0.92);
      build();
    };

    const render = () => {
      const now = performance.now();
      const t = (now - T0) / 1000;
      const fp = Math.min((now - T0 - FORM_DELAY) / FORM_DUR, 1);
      const formed = fp >= 1;

      rotY += formed ? 0.0010 : 0.0002;
      const cR = Math.cos(rotY), sR = Math.sin(rotY);
      const cT = Math.cos(TILT), sT = Math.sin(TILT);
      if (formed) connAlpha = Math.min(connAlpha + 0.005, 1);

      // Subtle camera drift
      const driftCX = formed ? Math.sin(t * 0.18) * w * 0.012 : 0;
      const driftCY = formed ? Math.cos(t * 0.13) * h * 0.008 : 0;
      const cx = w/2 + driftCX;
      const cy = h + R*0.05 + driftCY;

      // Motion blur: instead of hard clear, partially fade previous frame during formation
      if (!formed && fp > 0) {
        ctx.fillStyle = `rgba(5,7,10,${0.55 + fp * 0.35})`;
        ctx.fillRect(0, 0, w, h);
      } else {
        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = 'rgba(5,7,10,1)';
        ctx.fillRect(0, 0, w, h);
      }

      const WAMP = R * 0.040;
      const FOV = 1400;

      type PD = { sx:number; sy:number; depth:number; alpha:number; size:number };
      const pd: PD[] = new Array(pts.length);

      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        const lp = Math.max(0, Math.min((fp - p.delay) / (1 - p.delay + 0.001), 1));
        const ep = easeIO(lp);
        const arc = Math.sin(lp * Math.PI) * 0.20;

        // Wave noise on settled surface — uses noise3 for organic feel
        const wv = formed
          ? noise3(p.tx, p.ty, p.tz, t) * WAMP
          : 0;

        // Target with noise offset (breaks perfect sphere surface)
        const tfx = p.tx + p.noiseOx;
        const tfy = p.ty + p.noiseOy;
        const tfz = p.tz + p.noiseOz;

        let wx = p.sx + (tfx - p.sx)*ep + p.driftX*arc;
        let wy = p.sy + (tfy - p.sy)*ep + p.driftY*arc;
        let wz = p.sz + (tfz - p.sz)*ep + p.driftZ*arc;

        // Y-axis rotation
        const rx = wx*cR - wz*sR, rz = wx*sR + wz*cR;
        wx = rx; wz = rz;

        // X-axis camera tilt
        const tx2 = wx;
        const ty2 = wy*cT - wz*sT;
        const tz2 = wy*sT + wz*cT;

        const wvY = formed ? wv/R : 0;
        const persp = FOV / Math.max(FOV + tz2*R, 1);
        const sx = cx + tx2*R*persp;
        const sy = cy - (ty2 + wvY)*R*persp;
        const depth = (tz2+1)/2;

        const alpha = (0.10 + depth*0.82) * (0.20 + ep*0.80);
        const size = (0.65 + depth*1.5) * p.baseSize * Math.min(persp*1.5, 2.5);
        pd[i] = { sx, sy, depth, alpha, size };
      }

      // Bloom pass: additive glow layer
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < pd.length; i++) {
        const p = pd[i];
        if (p.sy > h*1.06 || p.depth < 0.25 || p.size < 0.6) continue;
        const gR = p.size * 7;
        const g = ctx.createRadialGradient(p.sx, p.sy, 0, p.sx, p.sy, gR);
        g.addColorStop(0, `rgba(140,200,255,${(p.alpha*0.18).toFixed(3)})`);
        g.addColorStop(0.4, `rgba(80,140,255,${(p.alpha*0.06).toFixed(3)})`);
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(p.sx, p.sy, gR, 0, Math.PI*2); ctx.fill();
      }
      ctx.restore();

      // Connections
      if (connAlpha > 0.005) {
        ctx.save();
        ctx.lineWidth = 0.38;
        ctx.globalCompositeOperation = 'lighter';
        for (const c of conns) {
          const pa = pd[c.a], pb = pd[c.b];
          if (pa.depth < 0.10 || pb.depth < 0.10) continue;
          const a = ((pa.alpha+pb.alpha)/2) * 0.22 * connAlpha;
          ctx.strokeStyle = `rgba(120,180,255,${a.toFixed(3)})`;
          ctx.beginPath(); ctx.moveTo(pa.sx, pa.sy); ctx.lineTo(pb.sx, pb.sy); ctx.stroke();
        }
        ctx.restore();
      }

      // Core particles (normal blend)
      for (let i = 0; i < pd.length; i++) {
        const p = pd[i];
        if (p.sy > h*1.06 || p.size < 0.1) continue;
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, Math.max(p.size*0.52, 0.38), 0, Math.PI*2);
        ctx.fillStyle = `rgba(215,235,255,${p.alpha.toFixed(3)})`;
        ctx.fill();
      }

      // Light rays from top-right (volumetric light simulation)
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      const rayOriginX = w * 0.78, rayOriginY = -h * 0.08;
      const rayCount = 8;
      for (let r = 0; r < rayCount; r++) {
        const angle = (Math.PI * 0.55) + (r / rayCount) * (Math.PI * 0.35);
        const rayLen = Math.max(w, h) * 1.8;
        const ex = rayOriginX + Math.cos(angle) * rayLen;
        const ey = rayOriginY + Math.sin(angle) * rayLen;
        const rayAlpha = (0.012 + Math.sin(t*0.3 + r*0.7) * 0.004) * (1 - r/rayCount * 0.5);
        const rg = ctx.createLinearGradient(rayOriginX, rayOriginY, ex, ey);
        rg.addColorStop(0, `rgba(80,160,255,${rayAlpha.toFixed(4)})`);
        rg.addColorStop(0.3, `rgba(60,120,220,${(rayAlpha*0.4).toFixed(4)})`);
        rg.addColorStop(1, 'rgba(0,0,0,0)');
        const rayW = 40 + r * 18;
        ctx.strokeStyle = rg;
        ctx.lineWidth = rayW;
        ctx.beginPath(); ctx.moveTo(rayOriginX, rayOriginY); ctx.lineTo(ex, ey); ctx.stroke();
      }
      ctx.restore();

      // Blue edge glow (top-right)
      const eg = ctx.createRadialGradient(w*0.74, h*0.12, 0, w*0.74, h*0.12, R*0.70);
      eg.addColorStop(0, 'rgba(50,130,255,0.14)');
      eg.addColorStop(0.5, 'rgba(25,80,200,0.05)');
      eg.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = eg; ctx.fillRect(0, 0, w, h);

      // Bottom atmospheric fog
      const fog = ctx.createLinearGradient(0, h*0.65, 0, h);
      fog.addColorStop(0, 'rgba(5,7,10,0)');
      fog.addColorStop(1, 'rgba(5,7,10,0.97)');
      ctx.fillStyle = fog; ctx.fillRect(0, h*0.65, w, h*0.35);

      animId = requestAnimationFrame(render);
    };

    resize(); render();
    window.addEventListener('resize', resize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ background: '#05070a' }}
    />
  );
}
