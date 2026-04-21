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
      const beamWidth = 300; // Center grouping
      const lineCount = 40;
      
      for (let i = 0; i < lineCount; i++) {
        newLineArray.push(generateLine(true));
      }
      lines.current = newLineArray;
    };

    const generateLine = (randomY = false) => {
      const beamWidth = 300;
      const depth = Math.random() > 0.4 ? 1 : 0;
      return {
        x: (canvas.width / 2 - beamWidth / 2) + Math.random() * beamWidth,
        y: randomY ? Math.random() * (canvas.height / 2) : -150, // Only from top to middle
        length: 60 + Math.random() * 150,
        speed: depth === 1 ? 0.3 + Math.random() * 0.5 : 0.1 + Math.random() * 0.3, // "Very slow"
        opacity: depth === 1 ? (Math.random() > 0.5 ? 0.8 : 0.4) : 0.2, // Controlled opacities
        width: depth === 1 ? 1.5 : 1,
        depth
      };
    };

    window.addEventListener('resize', resize);
    resize();

    const drawOriginGlow = () => {
      const w = canvas.width;
      const grad = ctx.createRadialGradient(w / 2, 0, 0, w / 2, 0, 400);
      grad.addColorStop(0, "rgba(255, 255, 255, 0.05)");
      grad.addColorStop(1, "transparent");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, 400);
    };

    const drawHorizon = () => {
      const w = canvas.width;
      const h = canvas.height;
      const radius = w * 1.8;
      const centerX = w / 2;
      const centerY = h + radius - 150;

      ctx.save();
      
      // Realistic Matte Moon (No grain)
      ctx.translate(centerX, centerY);
      ctx.rotate(rotation.current);
      
      // Base Solid Moon Surface
      ctx.fillStyle = "#080808";
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.fill();

      // Top Edge Sharp Glow Highlight
      const edgeGrad = ctx.createRadialGradient(0, 0, radius - 4, 0, 0, radius);
      edgeGrad.addColorStop(0, "transparent");
      edgeGrad.addColorStop(0.95, "rgba(255, 255, 255, 0.15)");
      edgeGrad.addColorStop(1, "rgba(255, 255, 255, 0.4)");
      
      ctx.fillStyle = edgeGrad;
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.fill();

      // Subtle Reflection Layer (From beams)
      ctx.restore();
      const beamGrad = ctx.createLinearGradient(w / 2, h - 200, w / 2, h);
      beamGrad.addColorStop(0, "transparent");
      beamGrad.addColorStop(1, "rgba(255, 255, 255, 0.03)");
      ctx.fillStyle = beamGrad;
      ctx.fillRect(w / 2 - 200, h - 200, 400, 200);
    };

    const animate = () => {
      // Background must be PURE black
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      rotation.current += 0.00005; // "Extremely subtle" rotation
      
      // 1. Origin Glow at Top Center
      drawOriginGlow();

      // 2. Focused Vertical Beams
      lines.current.forEach((line, index) => {
        line.y += line.speed;
        
        // Loop from top to middle area only
        if (line.y > canvas.height / 1.5) {
          lines.current[index] = generateLine();
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

      // 3. Matte Moon Horizon (Bottom)
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
