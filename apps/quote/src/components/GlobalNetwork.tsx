'use client';

import React, { useEffect, useRef, useMemo } from 'react';

interface Hub {
  name: string;
  x: number; // 0 - 1000
  y: number; // 0 - 500
}

export default function GlobalNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const time = useRef(0);
  const animationFrameId = useRef<number>(0);

  const hubs: Hub[] = useMemo(() => [
    { name: "SF", x: 120, y: 150 },
    { name: "NYC", x: 240, y: 160 },
    { name: "LON", x: 480, y: 120 },
    { name: "MUM", x: 720, y: 220 },
    { name: "TKY", x: 880, y: 150 },
    { name: "SYD", x: 880, y: 400 },
    { name: "SAO", x: 300, y: 380 },
    { name: "CPT", x: 520, y: 400 },
    { name: "DXB", x: 620, y: 180 },
    { name: "HKG", x: 800, y: 200 }
  ], []);

  const continentPaths = useMemo(() => [
    // Detailed but simplified paths
    "M100,100 L150,80 L200,90 L250,150 L220,250 L100,280 L50,180 Z", // NA
    "M220,260 L300,280 L280,450 L240,480 L200,380 Z",               // SA
    "M450,250 L600,250 L650,350 L600,450 L480,480 L420,350 Z",       // Africa
    "M450,100 L850,100 L950,250 L900,400 L700,450 L550,420 L450,250 Z", // Eurasia
    "M800,400 L950,400 L950,480 L850,480 L800,450 Z"                 // Australia
  ], []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resize);
    resize();

    const drawArc = (source: Hub, target: Hub, scale: number, ox: number, oy: number) => {
      const sx = ox + source.x * scale;
      const sy = oy + source.y * scale;
      const tx = ox + target.x * scale;
      const ty = oy + target.y * scale;

      const midX = (sx + tx) / 2;
      const midY = (sy + ty) / 2 - 50 * scale; // Curve height

      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.quadraticCurveTo(midX, midY, tx, ty);
      ctx.strokeStyle = `rgba(0, 0, 0, ${0.05 + 0.05 * Math.sin(time.current * 2)})`;
      ctx.setLineDash([5, 5]);
      ctx.lineDashOffset = -time.current * 20;
      ctx.stroke();
      ctx.setLineDash([]);
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time.current += 0.01;

      const w = canvas.width;
      const h = canvas.height;
      const mapW = 1000;
      const mapH = 500;
      const scale = Math.min(w / mapW, h / mapH) * 0.8;
      const ox = (w - mapW * scale) / 2;
      const oy = (h - mapH * scale) / 2;

      // 1. Draw World Map Silhouettes
      ctx.fillStyle = "rgba(0, 0, 0, 0.02)";
      continentPaths.forEach(d => {
        const path = new Path2D();
        const matrix = new DOMMatrix().translate(ox, oy).scale(scale, scale);
        path.addPath(new Path2D(d), matrix);
        ctx.fill(path);
        ctx.strokeStyle = "rgba(0, 0, 0, 0.05)";
        ctx.stroke(path);
      });

      // 2. Draw Network Arcs
      ctx.lineWidth = 1;
      for (let i = 0; i < hubs.length; i++) {
        for (let j = i + 1; j < hubs.length; j++) {
            // Only connect some hubs to keep it clean
            if ((i + j) % 3 === 0) {
              drawArc(hubs[i], hubs[j], scale, ox, oy);
            }
        }
      }

      // 3. Draw Hubs (Nodes)
      hubs.forEach(hub => {
        const x = ox + hub.x * scale;
        const y = oy + hub.y * scale;
        
        // Pulsing ring
        const pulse = (Math.sin(time.current * 4) + 1) / 2;
        ctx.beginPath();
        ctx.arc(x, y, 4 + pulse * 6, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0,0,0, ${0.2 * (1 - pulse)})`;
        ctx.stroke();

        // Core dot
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fillStyle = "black";
        ctx.fill();

        // Label
        ctx.font = "8px 'JetBrains Mono', monospace";
        ctx.fillStyle = "rgba(0,0,0,0.3)";
        ctx.fillText(hub.name, x + 8, y + 3);
      });

      // 4. Subtle Radar ScanLine
      const scanY = (time.current * 100) % h;
      ctx.beginPath();
      ctx.moveTo(0, scanY);
      ctx.lineTo(w, scanY);
      ctx.strokeStyle = "rgba(0, 0, 0, 0.03)";
      ctx.stroke();

      animationFrameId.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId.current);
    };
  }, [continentPaths, hubs]);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 z-0 pointer-events-none opacity-40"
    />
  );
}
