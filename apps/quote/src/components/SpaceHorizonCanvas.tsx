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
  flickerOffset: number; 
}

interface SpaceHorizonCanvasProps {
  linesOnly?: boolean;
}

export default function SpaceHorizonCanvas({ linesOnly = false }: SpaceHorizonCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lines = useRef<Line[]>([]);
  const rotation = useRef(0);
  const animationFrameId = useRef<number>(0);
  const time = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      } else {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
      initLines();
    };

    const initLines = () => {
      const newLineArray: Line[] = [];
      const beamWidth = 220; // Slightly more focused for energy beams
      const lineCount = linesOnly ? 16 : 28; 
      
      const spacing = beamWidth / lineCount;

      for (let i = 0; i < lineCount; i++) {
        const depth = Math.random() > 0.5 ? 1 : 0;
        newLineArray.push({
          x: (canvas.width / 2 - beamWidth / 2) + (i * spacing) + (Math.random() * 4 - 2),
          y: Math.random() * canvas.height,
          length: 60 + Math.random() * 120,
          speed: depth === 1 ? 0.4 + Math.random() * 0.5 : 0.2 + Math.random() * 0.3,
          opacity: 0.6 + Math.random() * 0.4,
          width: depth === 1 ? 1.2 : 0.8,
          depth,
          flickerOffset: Math.random() * Math.PI * 2
        });
      }
      lines.current = newLineArray;
    };

    window.addEventListener('resize', resize);
    resize();

    const drawHorizon = () => {
      if (linesOnly) return;
      // Horizon logic stays original for full background mode
      const w = canvas.width;
      const h = canvas.height;
      const radius = w * 2; 
      const centerX = w / 2;
      const centerY = h * 0.78 + radius;

      ctx.save();
      const glowGrad = ctx.createRadialGradient(centerX, centerY - radius, 0, centerX, centerY - radius, 400);
      glowGrad.addColorStop(0, "rgba(255, 255, 255, 0.04)");
      glowGrad.addColorStop(1, "transparent");
      ctx.fillStyle = glowGrad;
      ctx.fillRect(0, 0, w, h);

      ctx.translate(centerX, centerY);
      ctx.rotate(rotation.current);
      ctx.fillStyle = "#050505";
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.fill();

      const edgeGrad = ctx.createRadialGradient(0, 0, radius - 3, 0, 0, radius);
      edgeGrad.addColorStop(0, "transparent");
      edgeGrad.addColorStop(0.98, "rgba(255, 255, 255, 0.1)");
      edgeGrad.addColorStop(1, "rgba(255, 255, 255, 0.5)"); 
      ctx.fillStyle = edgeGrad;
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    const animate = () => {
      time.current += 0.02;

      // Transparent clear for overlay mode
      if (linesOnly) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      } else {
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      
      rotation.current += 0.00003; 
      
      lines.current.forEach((line) => {
        // ENERGY FLOW: Move UPWARD
        line.y -= line.speed;
        
        // Wrap logic for rising energy
        if (line.y + line.length < 0) {
          line.y = canvas.height + Math.random() * 50;
        }

        // PLASMA FLICKER: Modulate opacity with sine
        const flicker = 0.7 + Math.sin(time.current * 4 + line.flickerOffset) * 0.3;
        ctx.globalAlpha = line.opacity * flicker;
        
        // GLOWING ENERGY BEAM: Layered Rendering
        ctx.strokeStyle = "#ffffff";
        
        // Pass 1: Outer Plasma Glow (Soft)
        ctx.save();
        ctx.shadowBlur = 15;
        ctx.shadowColor = "rgba(255, 255, 255, 0.8)";
        ctx.lineWidth = line.width * 2;
        ctx.beginPath();
        ctx.moveTo(line.x, line.y);
        ctx.lineTo(line.x, line.y + line.length);
        ctx.stroke();
        ctx.restore();

        // Pass 2: Inner Sharp Core (Digital Precision)
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(line.x, line.y);
        ctx.lineTo(line.x, line.y + line.length);
        ctx.stroke();
      });

      drawHorizon();

      animationFrameId.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId.current);
    };
  }, [linesOnly]);

  return (
    <canvas 
      ref={canvasRef} 
      className={`absolute inset-0 z-0 pointer-events-none ${linesOnly ? '' : 'bg-black'}`}
    />
  );
}
