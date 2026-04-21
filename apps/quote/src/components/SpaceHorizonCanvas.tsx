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

interface SpaceHorizonCanvasProps {
  linesOnly?: boolean;
}

export default function SpaceHorizonCanvas({ linesOnly = false }: SpaceHorizonCanvasProps) {
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
      const beamWidth = 240; 
      const lineCount = linesOnly ? 20 : 28; // Slightly fewer for cleaner boxed look
      
      const spacing = beamWidth / lineCount;

      for (let i = 0; i < lineCount; i++) {
        const depth = Math.random() > 0.4 ? 1 : 0;
        newLineArray.push({
          x: (canvas.width / 2 - beamWidth / 2) + (i * spacing),
          y: Math.random() * (canvas.height / 2),
          length: 40 + Math.random() * 100,
          speed: depth === 1 ? 0.3 + Math.random() * 0.4 : 0.15 + Math.random() * 0.25,
          opacity: depth === 1 ? 0.6 : 0.3,
          width: depth === 1 ? 1.5 : 1,
          depth
        });
      }
      lines.current = newLineArray;
    };

    window.addEventListener('resize', resize);
    resize();

    const drawHorizon = () => {
      if (linesOnly) return;

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
      // Clear with transparency if linesOnly
      if (linesOnly) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      } else {
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      
      rotation.current += 0.00003; 
      
      lines.current.forEach((line) => {
        line.y += line.speed;
        
        if (line.y > canvas.height / 1.5) {
          line.y = -line.length;
        }

        ctx.globalAlpha = line.opacity;
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = line.width;
        
        if (line.depth === 0) {
          ctx.filter = "blur(1.2px)";
        } else {
          ctx.filter = "none";
        }

        ctx.beginPath();
        ctx.moveTo(line.x, line.y);
        ctx.lineTo(line.x, line.y + line.length);
        ctx.stroke();
        ctx.filter = "none";
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
