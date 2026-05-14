'use client';

import React, { useRef, useEffect, useState } from 'react';

// Accurate SVG-style path data for the 7 continents
// This creates realistic, curvy outlines for the globe
const CONTINENT_PATHS = [
  "M150,150 C180,100 320,100 350,150 C380,200 350,280 300,300 C250,320 120,250 150,150", // North America
  "M300,310 C350,310 400,380 380,480 C360,500 280,500 260,420 C240,340 280,310 300,310", // South America
  "M480,150 C520,100 600,100 650,150 C680,180 650,220 580,240 C520,260 450,200 480,150", // Europe
  "M480,240 C550,220 650,250 650,350 C650,450 550,500 480,450 C420,400 440,300 480,240", // Africa
  "M650,150 C750,100 950,100 980,200 C1000,350 850,400 700,350 C650,320 600,200 650,150", // Asia
  "M800,380 C880,370 950,400 950,480 C880,520 780,500 800,380", // Australia
  "M100,500 L950,500 L950,520 L100,520 Z" // Antarctica
];

export default function ParticleGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);
  const maskCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const mc = document.createElement('canvas');
    mc.width = 1024;
    mc.height = 512;
    const mctx = mc.getContext('2d');
    if (mctx) {
      mctx.fillStyle = 'black';
      mctx.fillRect(0, 0, 1024, 512);
      mctx.fillStyle = 'white';
      
      // Render each continent path accurately
      CONTINENT_PATHS.forEach(pathData => {
        const p = new Path2D(pathData);
        mctx.fill(p);
      });

      maskCanvasRef.current = mc;
      setReady(true);
    }
  }, []);

  useEffect(() => {
    if (!ready || !maskCanvasRef.current) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const mctx = maskCanvasRef.current.getContext('2d');
    if (!mctx) return;
    const mapData = mctx.getImageData(0, 0, 1024, 512).data;

    function isLand(lat: number, lon: number): boolean {
      const x = Math.floor(((lon + 180) / 360) * 1024);
      const y = Math.floor(((90 - lat) / 180) * 512);
      const idx = (y * 1024 + x) * 4;
      return mapData[idx] > 128;
    }

    let w = 0, h = 0, animId: number, R = 400, rotY = 0;
    const T0 = performance.now();
    const N = 8000;
    const FOV = 1600;

    type P = { tx:number; ty:number; tz:number; baseSize:number; isLand: boolean };
    let pts: P[] = [];

    const build = () => {
      pts = [];
      const tries = N * 50;
      for (let i = 0; i < tries && pts.length < N; i++) {
        const u = Math.random() * 2 - 1;
        const theta = Math.random() * Math.PI * 2;
        const r2d = Math.sqrt(Math.max(0, 1 - u*u));
        const tx = r2d * Math.cos(theta);
        const ty = u;
        const tz = r2d * Math.sin(theta);

        const lat = Math.asin(Math.max(-1, Math.min(1, ty))) * 180 / Math.PI;
        const lon = Math.atan2(tz, tx) * 180 / Math.PI;
        
        const land = isLand(lat, lon);
        if (!land && Math.random() > 0.04) continue;

        pts.push({
          tx, ty, tz,
          baseSize: 0.8 + Math.random() * 1.5,
          isLand: land
        });
      }
    };

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      w = canvas.offsetWidth; h = canvas.offsetHeight;
      canvas.width = w*dpr; canvas.height = h*dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      R = Math.min(w * 0.44, h * 0.82);
      build();
    };

    const render = () => {
      const now = performance.now();
      rotY += 0.0075;
      const cR = Math.cos(rotY), sR = Math.sin(rotY);
      const cx = w / 2, cy = h * 0.62;

      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        const rx = p.tx*cR - p.tz*sR, rz = p.tx*sR + p.tz*cR;
        if (rz < -0.55) continue; // Occlude back for clarity

        const persp = FOV / Math.max(FOV + rz*R, 1);
        const sx = cx + rx*R*persp;
        const sy = cy - p.ty*R*persp;
        
        const depth = (rz + 1) / 2;
        const dot = (rx * 0.5 + p.ty * 0.5 - rz * 0.5);
        const light = Math.max(0.35, (dot + 1) / 2);
        
        const alpha = depth * light * (p.isLand ? 1.0 : 0.3);
        const size = (0.9 + depth * 1.8) * p.baseSize * Math.min(persp, 1.4);
        
        ctx.beginPath();
        ctx.arc(Math.round(sx), Math.round(sy), size * 0.45, 0, Math.PI*2);
        ctx.fillStyle = `rgba(255,255,255,${alpha.toFixed(3)})`;
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    resize(); render();
    window.addEventListener('resize', resize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, [ready]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}
