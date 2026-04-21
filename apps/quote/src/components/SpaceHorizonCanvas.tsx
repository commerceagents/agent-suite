'use client';

import React, { useEffect, useRef } from 'react';

interface Line {
  x: number;
  y: number;
  length: number;
  speed: number;
  opacity: number;
  width: number;
  depth: number; 
}

export default function SpaceHorizonCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lines = useRef<Line[]>([]);
  const rotation = useRef(0);
  const animationFrameId = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initLines();
    };

    const initLines = () => {
      const newLineArray: Line[] = [];
      const beamWidth = 240; // Tight center grouping
      const lineCount = 28; // Reduced count as requested
      
      const spacing = beamWidth / lineCount;

      for (let i = 0; i < lineCount; i++) {
        const depth = Math.random() > 0.4 ? 1 : 0;
        newLineArray.push({
          x: (canvas.width / 2 - beamWidth / 2) + (i * spacing), // Even spacing
          y: Math.random() * (canvas.height / 2),
          length: 50 + Math.random() * 120,
          speed: depth === 1 ? 0.25 + Math.random() * 0.35 : 0.1 + Math.random() * 0.2, // Very slow
          opacity: depth === 1 ? 0.8 : 0.25,
          width: depth === 1 ? 1.5 : 1,
          depth
        });
      }
      lines.current = newLineArray;
    };

    window.addEventListener('resize', resize);
    resize();

    const drawHorizon = () => {
      const w = canvas.width;
      const h = canvas.height;
      
      // Arc radius and centering to place horizon at ~25% from bottom
      const radius = w * 2; 
      const centerX = w / 2;
      const centerY = h * 0.78 + radius; // Peak is at h * 0.78 (22% from bottom)

      ctx.save();
      
      // 1. Soft Glow above the curve
      const glowGrad = ctx.createRadialGradient(centerX, centerY - radius, 0, centerX, centerY - radius, 400);
      glowGrad.addColorStop(0, "rgba(255, 255, 255, 0.04)");
      glowGrad.addColorStop(1, "transparent");
      ctx.fillStyle = glowGrad;
      ctx.fillRect(0, 0, w, h);

      // 2. Realistic Matte Surface
      ctx.translate(centerX, centerY);
      ctx.rotate(rotation.current);
      
      // Base Matte Dark Grey
      ctx.fillStyle = "#050505";
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.fill();

      // Subtle Realistic Texture (Soft almost invisible grain)
      // We simulate this with a low-alpha noise-like gradient or simple dots
      ctx.globalAlpha = 0.03;
      ctx.fillStyle = "#ffffff";
      for (let i = 0; i < 400; i++) {
         const angle = Math.random() * Math.PI * 2;
         const r = radius - Math.random() * 80;
         ctx.fillRect(Math.cos(angle) * r, Math.sin(angle) * r, 1, 1);
      }
      ctx.globalAlpha = 1;

      // 3. Lighting: Sharp Top Edge Highlight
      const edgeGrad = ctx.createRadialGradient(0, 0, radius - 3, 0, 0, radius);
      edgeGrad.addColorStop(0, "transparent");
      edgeGrad.addColorStop(0.98, "rgba(255, 255, 255, 0.1)");
      edgeGrad.addColorStop(1, "rgba(255, 255, 255, 0.5)"); // Crisp 3D edge
      
      ctx.fillStyle = edgeGrad;
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.fill();

      // 4. Gradual shadow fade towards bottom
      // (Achieved by the base dark color and lack of light on the bottom arc)

      ctx.restore();
    };

    const animate = () => {
      // Pure Black Background
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Loop rotation: ~60s period
      rotation.current += 0.00003; 
      
      // 1. Central Focused Beams
      lines.current.forEach((line) => {
        line.y += line.speed;
        
        // Loop from top to middle only
        if (line.y > canvas.height / 1.6) {
          line.y = -line.length;
        }

        ctx.globalAlpha = line.opacity;
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = line.width;
        
        if (line.depth === 0) {
          ctx.filter = "blur(1.5px)";
        } else {
          ctx.filter = "none";
        }

        ctx.beginPath();
        ctx.moveTo(line.x, line.y);
        ctx.lineTo(line.x, line.y + line.length);
        ctx.stroke();
        ctx.filter = "none";
      });

      // 2. Realistic Moon Horizon
      drawHorizon();

      animationFrameId.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId.current);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 z-0 pointer-events-none bg-black"
    />
  );
}
