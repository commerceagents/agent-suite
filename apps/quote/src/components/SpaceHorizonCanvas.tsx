'use client';

import React, { useEffect, useRef } from 'react';

interface Line {
  x: number;
  y: number;
  length: number;
  speed: number;
  opacity: number;
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
      const count = Math.floor(canvas.width / 15);
      for (let i = 0; i < count; i++) {
        newLineArray.push(generateLine(true));
      }
      lines.current = newLineArray;
    };

    const generateLine = (randomY = false) => {
      return {
        x: Math.random() * canvas.width,
        y: randomY ? Math.random() * canvas.height : -100,
        length: 20 + Math.random() * 100,
        speed: 0.5 + Math.random() * 1.5,
        opacity: 0.1 + Math.random() * 0.5,
        depth: Math.round(Math.random()) // 0 background, 1 foreground
      };
    };

    window.addEventListener('resize', resize);
    resize();

    const drawHorizon = () => {
      const w = canvas.width;
      const h = canvas.height;
      const radius = w * 1.5;
      const centerX = w / 2;
      const centerY = h + radius - 150; // Curve visible at bottom

      ctx.save();
      
      // Grainy Surface Texture (Low-performance approach, so we use a pattern or simple noise)
      // For performance, we'll draw the arc once and rotate it
      ctx.translate(centerX, centerY);
      ctx.rotate(rotation.current);
      
      const grad = ctx.createRadialGradient(0, 0, radius - 50, 0, 0, radius);
      grad.addColorStop(0, "#0a0a0a"); // Dark grey inside
      grad.addColorStop(0.9, "#1a1a1a"); // Highlight near edge
      grad.addColorStop(1, "#222222"); // Sharp edge highlight
      
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.fill();

      // Add "Grain" (Random dots on the horizon edge)
      ctx.globalAlpha = 0.05;
      ctx.fillStyle = "#ffffff";
      for (let i = 0; i < 500; i++) {
         const angle = Math.random() * Math.PI * 2;
         const r = radius - Math.random() * 100;
         ctx.fillRect(Math.cos(angle) * r, Math.sin(angle) * r, 2, 2);
      }
      
      ctx.restore();
    };

    const drawAmbientGlow = () => {
      const w = canvas.width;
      const grad = ctx.createLinearGradient(w / 2, 0, w / 2, 400);
      grad.addColorStop(0, "rgba(255, 255, 255, 0.08)");
      grad.addColorStop(1, "transparent");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, 400);
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      rotation.current += 0.0001; // "unnoticeable" rotation
      
      // 1. Ambient Glow
      drawAmbientGlow();

      // 2. Vertical Lines
      lines.current.forEach((line, index) => {
        line.y += line.speed;
        if (line.y > canvas.height) {
          lines.current[index] = generateLine();
        }

        ctx.globalAlpha = line.opacity;
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = line.depth === 1 ? 1 : 0.5;
        
        if (line.depth === 0) {
          ctx.filter = "blur(1px)";
        } else {
          ctx.filter = "none";
        }

        ctx.beginPath();
        ctx.moveTo(line.x, line.y);
        ctx.lineTo(line.x, line.y + line.length);
        ctx.stroke();
        ctx.filter = "none";
      });

      // 3. Moon Horizon (Bottom)
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
      className="absolute inset-0 z-0 pointer-events-none"
    />
  );
}
