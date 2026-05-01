'use client';
import React, { useRef, useEffect } from 'react';

// Simplified land detection
function isLand(lat: number, lon: number): boolean {
  if (lat > 15 && lat < 75 && lon > -168 && lon < -52) return true; // North America
  if (lat > 5 && lat < 20 && lon > -90 && lon < -60) return true; // Central America
  if (lat > -57 && lat < 12 && lon > -82 && lon < -34) return true; // South America
  if (lat > 36 && lat < 71 && lon > -10 && lon < 40) return true; // Europe
  if (lat > 55 && lat < 72 && lon > -25 && lon < 32) return true; // Scandinavia
  if (lat > -35 && lat < 37 && lon > -18 && lon < 52) return true; // Africa
  if (lat > 14 && lat < 42 && lon > 35 && lon < 65) return true; // Middle East
  if (lat > 6 && lat < 37 && lon > 68 && lon < 92) return true; // India
  if (lat > 20 && lat < 80 && lon > 60 && lon < 140) return true; // Asia
  if (lat > -5 && lat < 25 && lon > 95 && lon < 125) return true; // SE Asia
  if (lat > 30 && lat < 46 && lon > 128 && lon < 146) return true; // Japan
  if (lat > -45 && lat < -10 && lon > 113 && lon < 154) return true; // Australia
  if (lat > 60 && lat < 84 && lon > -55 && lon < -17) return true; // Greenland
  return false;
}

function latLonToXYZ(lat: number, lon: number): [number, number, number] {
  const phi = (90 - lat) * Math.PI / 180;
  const theta = (lon + 180) * Math.PI / 180;
  return [Math.sin(phi) * Math.cos(theta), Math.cos(phi), Math.sin(phi) * Math.sin(theta)];
}

const ease = (t: number) => t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2,3)/2;

export default function ParticleGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = 0, h = 0, animId: number, R = 400, rotY = 0, connAlpha = 0;
    const T0 = performance.now();
    const FORM_DELAY = 300;
    const FORM_DUR = 2800;
    const N = 2600;
    const TILT = 0.38, cT = Math.cos(TILT), sT = Math.sin(TILT);

    const waveNoise = (x: number, z: number, t: number) =>
      0.38 * Math.sin(2.2*x + 0.8*t) +
      0.26 * Math.sin(1.7*z + 0.6*t + 1.2) +
      0.18 * Math.sin(3.0*x - 1.3*z + 0.9*t) +
      0.10 * Math.sin(0.9*x + 2.4*z + 1.4*t);

    type P = { sx:number;sy:number;sz:number; tx:number;ty:number;tz:number; d:number; sz2:number; driftX:number;driftY:number;driftZ:number; };
    type C = { a:number; b:number };
    let pts: P[] = [];
    let conns: C[] = [];

    const build = () => {
      pts = []; conns = [];
      const targets: [number,number,number][] = [];
      let tries = 0;
      while (targets.length < N && tries < N * 25) {
        tries++;
        const lat = Math.random() * 180 - 90;
        const lon = Math.random() * 360 - 180;
        if (!isLand(lat, lon)) continue;
        targets.push(latLonToXYZ(lat, lon));
      }

      for (const [tx, ty, tz] of targets) {
        const sr = 0.6 + Math.random() * 2.2;
        const sa = Math.random() * Math.PI * 2;
        const sb = Math.random() * Math.PI;
        pts.push({
          sx: Math.sin(sb)*Math.cos(sa)*sr, sy: Math.cos(sb)*sr, sz: Math.sin(sb)*Math.sin(sa)*sr,
          tx, ty, tz,
          d: Math.random() * 0.45,
          sz2: 0.7 + Math.random() * 1.1,
          driftX: (Math.random()-0.5)*0.25,
          driftY: (Math.random()-0.5)*0.25,
          driftZ: (Math.random()-0.5)*0.25,
        });
      }

      // Pre-compute connections
      const CDIST = 0.28, MAX_C = 4;
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

    const project = (wx: number, wy: number, wz: number, cx: number, cy: number) => {
      // Y rotation then X tilt
      const tx = wx, ty = wy*cT - wz*sT, tz = wy*sT + wz*cT;
      const p = 1400 / Math.max(1400 + tz*R, 1);
      return { sx: cx + tx*R*p, sy: cy - ty*R*p, depth: (tz+1)/2, p };
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
      const now = performance.now(), t = (now - T0) / 1000;
      const fp = Math.min((now - T0 - FORM_DELAY) / FORM_DUR, 1);
      const formed = fp >= 1;

      rotY += formed ? 0.0012 : 0.0003;
      const cR = Math.cos(rotY), sR = Math.sin(rotY);
      if (formed) connAlpha = Math.min(connAlpha + 0.006, 1);

      const cx = w/2, cy = h + R*0.05;
      const WAMP = R * 0.038;

      ctx.clearRect(0, 0, w, h);

      type PD = { sx:number; sy:number; depth:number; alpha:number; size:number };
      const pd: PD[] = new Array(pts.length);

      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        const lp = Math.max(0, Math.min((fp - p.d) / (1 - p.d + 0.001), 1));
        const ep = ease(lp);
        const arc = Math.sin(lp * Math.PI) * 0.18;
        const wv = formed ? waveNoise(p.tx, p.tz, t) * WAMP : 0;

        // Current world-space pos
        let wx = p.sx + (p.tx - p.sx)*ep + p.driftX*arc;
        let wy = p.sy + (p.ty - p.sy)*ep + p.driftY*arc;
        let wz = p.sz + (p.tz - p.sz)*ep + p.driftZ*arc;

        // Y-axis rotation
        const rx = wx*cR - wz*sR, rz = wx*sR + wz*cR;
        wx = rx; wz = rz;

        const pr = project(wx, wy + (formed ? wv/R : 0), wz, cx, cy);
        const alpha = (0.12 + pr.depth*0.78) * (0.25 + ep*0.75);
        const size = (0.7 + pr.depth*1.4) * p.sz2 * Math.min(pr.p*1.5, 2.2);
        pd[i] = { sx: pr.sx, sy: pr.sy, depth: pr.depth, alpha, size };
      }

      // Connections
      if (connAlpha > 0.005) {
        ctx.lineWidth = 0.4;
        for (const c of conns) {
          const pa = pd[c.a], pb = pd[c.b];
          if (pa.depth < 0.08 || pb.depth < 0.08) continue;
          const a = ((pa.alpha+pb.alpha)/2) * 0.28 * connAlpha;
          ctx.strokeStyle = `rgba(180,210,255,${a.toFixed(3)})`;
          ctx.beginPath(); ctx.moveTo(pa.sx, pa.sy); ctx.lineTo(pb.sx, pb.sy); ctx.stroke();
        }
      }

      // Particles
      for (let i = 0; i < pd.length; i++) {
        const p = pd[i];
        if (p.sy > h * 1.06 || p.size < 0.1) continue;

        if (p.depth > 0.3) {
          const gR = p.size * 5;
          const g = ctx.createRadialGradient(p.sx, p.sy, 0, p.sx, p.sy, gR);
          g.addColorStop(0, `rgba(200,230,255,${(p.alpha*0.45).toFixed(3)})`);
          g.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = g;
          ctx.beginPath(); ctx.arc(p.sx, p.sy, gR, 0, Math.PI*2); ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(p.sx, p.sy, Math.max(p.size*0.55, 0.4), 0, Math.PI*2);
        ctx.fillStyle = `rgba(210,235,255,${p.alpha.toFixed(3)})`;
        ctx.fill();
      }

      // Blue edge glow (top-right)
      const eg = ctx.createRadialGradient(w*0.73, h*0.14, 0, w*0.73, h*0.14, R*0.65);
      eg.addColorStop(0, 'rgba(60,140,255,0.13)');
      eg.addColorStop(0.5, 'rgba(30,80,200,0.05)');
      eg.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = eg; ctx.fillRect(0, 0, w, h);

      // Bottom fog
      const fog = ctx.createLinearGradient(0, h*0.68, 0, h);
      fog.addColorStop(0, 'rgba(5,7,10,0)');
      fog.addColorStop(1, 'rgba(5,7,10,0.96)');
      ctx.fillStyle = fog; ctx.fillRect(0, h*0.68, w, h*0.32);

      animId = requestAnimationFrame(render);
    };

    resize(); render();
    window.addEventListener('resize', resize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}
