'use client';

import React, { useEffect, useRef } from 'react';

interface Line {
  x: number;
  y: number;
  length: number;
  speed: number;
  opacity: number;
  width: number;
  depth: number; // 0 for background (blurred), 1 for foreground (sharp)
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
      const colWidth = 40; // Controlled spacing
      const columns = Math.floor(canvas.width / colWidth);
      
      for (let i = 0; i < columns; i++) {
        // Only populate certain columns for 'controlled spacing'
        if (Math.random() > 0.4) {
          newLineArray.push(generateLine(i * colWidth, true));
        }
      }
      lines.current = newLineArray;
    };

    const generateLine = (x: number, randomY = false) => {
      const depth = Math.random() > 0.4 ? 1 : 0;
      return {
        x: x + (Math.random() - 0.5) * 10, // Slight variation within column
        y: randomY ? Math.random() * canvas.height : -150,
        length: 40 + Math.random() * 120,
        speed: depth === 1 ? 0.8 + Math.random() * 1.2 : 0.4 + Math.random() * 0.6,
        opacity: depth === 1 ? (Math.random() > 0.5 ? 1 : 0.6) : 0.3,
        width: depth === 1 ? 2 : 1,
        depth
      };
    };

    window.addEventListener('resize', resize);
    resize();

    const drawHorizon = () => {
      const w = canvas.width;
      const h = canvas.height;
      // Ultra-wide smooth curve
      const radius = w * 1.8;
      const centerX = w / 2;
      const centerY = h + radius - 120;

      ctx.save();
      
      // Smooth Matte Style (No grain)
      ctx.translate(centerX, centerY);
      ctx.rotate(rotation.current);
      
      // Subtle top-edge highlight
      const grad = ctx.createRadialGradient(0, 0, radius - 2, 0, 0, radius);
      grad.addColorStop(0, "#080808"); // Matte dark grey
      grad.addColorStop(0.98, "#111111"); 
      grad.addColorStop(1, "#333333"); // Subtle edge highlight
      
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      rotation.current += 0.00008; // extremely subtle rotation
      
      // Background (Blurred) Lines first
      ctx.strokeStyle = "#ffffff";
      lines.current.forEach((line) => {
        if (line.depth === 0) {
          line.y += line.speed;
          if (line.y > canvas.height) line.y = -line.length;

          ctx.globalAlpha = line.opacity;
          ctx.lineWidth = line.width;
          ctx.filter = "blur(1.5px)";
          ctx.beginPath();
          ctx.moveTo(line.x, line.y);
          ctx.lineTo(line.x, line.y + line.length);
          ctx.stroke();
        }
      });

      // Foreground (Sharp) Lines second
      ctx.filter = "none";
      lines.current.forEach((line) => {
        if (line.depth === 1) {
          line.y += line.speed;
          if (line.y > canvas.height) line.y = -line.length;

          ctx.globalAlpha = line.opacity;
          ctx.lineWidth = line.width;
          ctx.beginPath();
          ctx.moveTo(line.x, line.y);
          ctx.lineTo(line.x, line.y + line.length);
          ctx.stroke();
        }
      });

      // Draw Moon Horizon last
      ctx.globalAlpha = 1;
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
