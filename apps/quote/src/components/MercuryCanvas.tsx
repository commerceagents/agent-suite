'use client';

import React, { useEffect, useRef } from 'react';

export default function MercuryCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number>(0);
  const time = useRef(0);

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

    const blobs = [
      { x: 0.2, y: 0.3, r: 0.4, color: 'rgba(255, 255, 255, 0.08)', speed: 0.005 },
      { x: 0.8, y: 0.7, r: 0.5, color: 'rgba(200, 220, 255, 0.05)', speed: 0.003 },
      { x: 0.5, y: 0.5, r: 0.6, color: 'rgba(180, 200, 255, 0.06)', speed: 0.004 },
      { x: 0.3, y: 0.8, r: 0.3, color: 'rgba(255, 255, 255, 0.07)', speed: 0.006 },
    ];

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time.current += 0.01;

      // Draw Soft Blobs
      blobs.forEach((b, i) => {
        const dx = Math.sin(time.current * b.speed + i) * 100;
        const dy = Math.cos(time.current * b.speed * 0.8 + i) * 100;
        const x = b.x * canvas.width + dx;
        const y = b.y * canvas.height + dy;
        const r = b.r * Math.min(canvas.width, canvas.height);

        const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
        grad.addColorStop(0, b.color);
        grad.addColorStop(1, 'transparent');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      });

      // Simple Grain Overlay logic (or we can use SVG filter)
      // For performance, we'll use a CSS filter for the grain, 
      // but we ensure the blobs look soft here.

      animationFrameId.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId.current);
    };
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-black">
      <canvas 
        ref={canvasRef} 
        className="w-full h-full opacity-60 blur-3xl"
      />
      {/* Grainy Texture Overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      
      {/* Depth vignette */}
      <div className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-b from-black/20 via-transparent to-black/60" />
    </div>
  );
}
