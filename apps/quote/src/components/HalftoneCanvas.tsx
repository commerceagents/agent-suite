'use client';

import React, { useRef, useEffect, useCallback, useState } from 'react';

interface Dot {
  homeX: number;
  homeY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  brightness: number;
  color: string;
  size: number;
  layer: 'hand' | 'star';
  phase: number;
  sparkle: boolean;
  baseAlpha: number;
  localX?: number;
  localY?: number;
  localZ?: number;
  pivotX?: number;
  pivotY?: number;
}

interface EvaporatingDot {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
}

function dotColor(b: number): string {
  if (b > 220) return 'rgb(255,255,255)';
  if (b > 160) return 'rgb(210,210,210)';
  if (b > 80)  return 'rgb(150,150,150)';
  return 'rgb(90,90,90)';
}

function dotSize(b: number): number {
  return 0.8 + (b / 255) * 3.0; // slightly thicker for sharpness
}

interface HalftoneCanvasProps {
  onTitleReady?: () => void;
  headerHeight?: number;
}

export default function HalftoneCanvas({ onTitleReady, headerHeight = 72 }: HalftoneCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotsRef = useRef<Dot[]>([]);
  const evaporatingDotsRef = useRef<EvaporatingDot[]>([]);
  const starImgRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: -9999, y: -9999, active: false });
  const clickRef = useRef({ x: 0, y: 0, time: 0 });
  const [loading, setLoading] = useState(true);

  const sampleCanvas = useCallback((
    srcCanvas: HTMLCanvasElement,
    offsetX: number,
    offsetY: number,
    gridStep: number,
    layer: Dot['layer'],
    baseAlpha: number,
    brightnessThreshold: number = 12,
    flipH: boolean = false
  ): Dot[] => {
    const ctx = srcCanvas.getContext('2d');
    if (!ctx || srcCanvas.width <= 0 || srcCanvas.height <= 0) return [];
    const imgData = ctx.getImageData(0, 0, srcCanvas.width, srcCanvas.height);
    const data = imgData.data;
    const dots: Dot[] = [];

    for (let y = 0; y < srcCanvas.height; y += gridStep) {
      for (let x = 0; x < srcCanvas.width; x += gridStep) {
        const idx = (y * srcCanvas.width + x) * 4;
        const r = data[idx], g = data[idx + 1], b = data[idx + 2];
        const brightness = (r + g + b) / 3;
        if (brightness < brightnessThreshold) continue;

        const srcX = flipH ? (srcCanvas.width - x) : x;
        const homeX = srcX + offsetX;
        const homeY = y + offsetY;

        dots.push({
          homeX, homeY, x: homeX, y: homeY,
          vx: 0, vy: 0,
          brightness,
          color: dotColor(brightness),
          size: dotSize(brightness),
          layer,
          phase: Math.random() * Math.PI * 2,
          sparkle: brightness > 220,
          baseAlpha
        });
      }
    }
    return dots;
  }, []);

  // ── Dense radial scatter — particles "ejected" from the star ──
  const generateStarScatter = useCallback((
    centerX: number,
    centerY: number,
    starW: number,
    starH: number,
    pivotX: number,
    pivotY: number
  ): Dot[] => {
    const dots: Dot[] = [];
    const coreRadius = Math.max(starW, starH) * 0.5;  // dense inner zone
    const outerRadius = Math.max(starW, starH) * 1.6;  // far reach

    // Layer 1 — dense near-star spray (2000 pts)
    for (let i = 0; i < 2000; i++) {
      const angle = Math.random() * Math.PI * 2;
      // Square-root distribution: denser near center
      const t = Math.random();
      const dist = coreRadius * 0.1 + coreRadius * Math.sqrt(t) * 1.4;

      const homeX = centerX + Math.cos(angle) * dist;
      const homeY = centerY + Math.sin(angle) * dist;

      const nd = dist / (coreRadius * 1.5);
      const brightness = Math.max(30, 210 - nd * 180) * (0.4 + Math.random() * 0.6);
      const alpha = Math.max(0.02, (1 - nd) * (0.12 + Math.random() * 0.55));
      const sz = Math.max(0.4, (1 - nd * 0.7) * (0.5 + Math.random() * 2.2));

      const dx = homeX - pivotX;
      const dy = homeY - pivotY;

      dots.push({
        homeX, homeY, x: homeX, y: homeY,
        vx: 0, vy: 0,
        brightness,
        color: dotColor(brightness),
        size: sz,
        layer: 'star',
        phase: Math.random() * Math.PI * 2,
        sparkle: Math.random() > 0.92,
        baseAlpha: alpha,
        localX: dx,
        localY: dy,
        localZ: (Math.random() - 0.5) * starW * 0.6,
        pivotX, pivotY
      });
    }

    // Layer 2 — sparse far-flung particles (1200 pts)
    for (let i = 0; i < 1200; i++) {
      const angle = Math.random() * Math.PI * 2;
      const t = Math.random();
      // power > 1 = more dots pushed far out
      const dist = coreRadius * 1.0 + (outerRadius - coreRadius) * Math.pow(t, 0.45);

      const homeX = centerX + Math.cos(angle) * dist;
      const homeY = centerY + Math.sin(angle) * dist;

      const nd = dist / outerRadius;
      const brightness = Math.max(20, 150 - nd * 130) * (0.3 + Math.random() * 0.5);
      const alpha = Math.max(0.01, (1 - nd) * 0.08 + Math.random() * 0.12);
      const sz = Math.max(0.3, (1 - nd) * (0.4 + Math.random() * 1.2));

      const dx = homeX - pivotX;
      const dy = homeY - pivotY;

      dots.push({
        homeX, homeY, x: homeX, y: homeY,
        vx: 0, vy: 0,
        brightness,
        color: dotColor(brightness),
        size: sz,
        layer: 'star',
        phase: Math.random() * Math.PI * 2,
        sparkle: Math.random() > 0.97,
        baseAlpha: alpha,
        localX: dx,
        localY: dy,
        localZ: (Math.random() - 0.5) * outerRadius * 0.5,
        pivotX, pivotY
      });
    }

    return dots;
  }, []);

  const loadImageToCanvas = useCallback((src: string): Promise<HTMLCanvasElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const c = document.createElement('canvas');
        c.width = img.naturalWidth; c.height = img.naturalHeight;
        const ctx = c.getContext('2d');
        if (!ctx) return reject(new Error('No context'));
        ctx.drawImage(img, 0, 0);
        resolve(c);
      };
      img.onerror = reject;
      img.src = src;
    });
  }, []);

  const spawnEvaporatingDot = useCallback((centerX: number, centerY: number): EvaporatingDot => {
    const angle = Math.random() * Math.PI * 2;
    const speed = 0.4 + Math.random() * 1.8; // increased speed for wider spread
    const maxLife = 250 + Math.random() * 500; // longer life to travel further
    return {
      x: centerX + (Math.random() - 0.5) * 200, // wider initial spawn area
      y: centerY + (Math.random() - 0.5) * 200,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: maxLife,
      maxLife: maxLife,
      size: 0.6 + Math.random() * 1.8,
      color: Math.random() > 0.8 ? 'rgba(255,255,255,0.7)' : 'rgba(200,200,200,0.4)'
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let w = 0, h = 0, dpr = 1;

    const resize = () => {
      dpr = window.devicePixelRatio || 1;
      w = Math.max(1, canvas.offsetWidth);
      h = Math.max(1, canvas.offsetHeight);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const init = async () => {
      resize();

      const [aiHandCanvas, humanHandCanvas, starCanvas] = await Promise.all([
        loadImageToCanvas('/image/ai-hand.png'),
        loadImageToCanvas('/image/human-hand.png'),
        loadImageToCanvas('/image/star-chrome.jpeg')
      ]);

      starImgRef.current = starCanvas;

      const availH = h - headerHeight;
      const handScale = Math.min(w * 0.55 / aiHandCanvas.width, availH * 0.62 / aiHandCanvas.height);

      const aiScaled = document.createElement('canvas');
      const aiW = Math.floor(aiHandCanvas.width * handScale);
      const aiH = Math.floor(aiHandCanvas.height * handScale);
      aiScaled.width = aiW; aiScaled.height = aiH;
      const aiCtx = aiScaled.getContext('2d')!;
      
      // Mask artifacts in corners
      aiCtx.save();
      aiCtx.beginPath();
      aiCtx.arc(aiW * 0.45, aiH * 0.45, Math.max(aiW, aiH) * 0.55, 0, Math.PI * 2);
      aiCtx.clip();
      
      aiCtx.filter = 'contrast(1.4) brightness(1.1)';
      aiCtx.drawImage(aiHandCanvas, 0, 0, aiW, aiH);
      aiCtx.restore();

      const humanScaled = document.createElement('canvas');
      const humanW = Math.floor(humanHandCanvas.width * handScale);
      const humanH = Math.floor(humanHandCanvas.height * handScale);
      humanScaled.width = humanW; humanScaled.height = humanH;
      const humanCtx = humanScaled.getContext('2d')!;
      
      // Mask artifacts in corners
      humanCtx.save();
      humanCtx.beginPath();
      humanCtx.arc(humanW * 0.55, humanH * 0.55, Math.max(humanW, humanH) * 0.55, 0, Math.PI * 2);
      humanCtx.clip();
      
      humanCtx.filter = 'contrast(1.4) brightness(1.1)';
      humanCtx.drawImage(humanHandCanvas, 0, 0, humanW, humanH);
      humanCtx.restore();

      const aiOffsetX = -aiW * 0.15;
      const aiOffsetY = headerHeight - aiH * 0.08;
      const humanOffsetX = w - humanW + humanW * 0.15;
      const humanOffsetY = h - humanH + humanH * 0.08;

      const aiDots = sampleCanvas(aiScaled, aiOffsetX, aiOffsetY, 4, 'hand', 1.0, 12, false);
      const humanDots = sampleCanvas(humanScaled, humanOffsetX, humanOffsetY, 4, 'hand', 1.0, 12, false);

      // ── Star: Halftone centered below header ──
      const starTargetH = availH * 0.65;
      const starTargetW = w * 0.38;
      const starScaleVal = Math.min(starTargetW / starCanvas.width, starTargetH / starCanvas.height);
      const starScaled = document.createElement('canvas');
      const starW = Math.floor(starCanvas.width * starScaleVal);
      const starH = Math.floor(starCanvas.height * starScaleVal);
      starScaled.width = starW; starScaled.height = starH;
      const starCtx = starScaled.getContext('2d')!;
      
      // Masking corners to remove artifacts during sampling
      starCtx.save();
      starCtx.beginPath();
      starCtx.arc(starW/2, starH/2, (starW/2) * 0.9, 0, Math.PI * 2);
      starCtx.clip();
      starCtx.filter = 'contrast(1.6) brightness(1.3)';
      starCtx.drawImage(starCanvas, 0, 0, starW, starH);
      starCtx.restore();

      const starOffsetX = (w - starW) / 2;
      const starOffsetY = headerHeight + (availH - starH) / 2;
      const starCenterX = starOffsetX + starW / 2;
      const starCenterY = starOffsetY + starH / 2;

      const rawStarDots = sampleCanvas(starScaled, starOffsetX, starOffsetY, 4, 'star', 1.0, 15, false);
      rawStarDots.forEach(d => {
        d.localX = d.homeX - starCenterX;
        d.localY = d.homeY - starCenterY;
        d.localZ = 0; // Flatten into a single sharp plane
        d.pivotX = starCenterX;
        d.pivotY = starCenterY;
      });

      dotsRef.current = [...aiDots, ...humanDots, ...rawStarDots];
      setLoading(false);
      onTitleReady?.();
    };

    const render = () => {
      const now = performance.now();
      const rotationAngle = now * 0.0006; // increased speed for energy
      const dots = dotsRef.current;
      const evaporatingDots = evaporatingDotsRef.current;
      const mouse = mouseRef.current;
      const click = clickRef.current;
      const clickAge = (now - click.time) / 1000;

      ctx.clearRect(0, 0, w, h);

      const starW = 400; // estimated size or based on canvas
      const starH = 400;
      const starCenterX = w / 2;
      const starCenterY = headerHeight + (h - headerHeight) / 2;

      // ── Render Evaporating Dots ──
      if (!loading) {
        // Spawn more dots for a denser 'evaporating' effect
        for (let i = 0; i < 12; i++) {
          evaporatingDots.push(spawnEvaporatingDot(starCenterX, starCenterY));
        }
        
        for (let i = evaporatingDots.length - 1; i >= 0; i--) {
          const ed = evaporatingDots[i];
          ed.x += ed.vx;
          ed.y += ed.vy;
          ed.vx *= 0.99;
          ed.vy *= 0.99;
          ed.life--;

          if (ed.life <= 0) {
            evaporatingDots.splice(i, 1);
            continue;
          }

          const alpha = ed.life / ed.maxLife;
          ctx.globalAlpha = alpha;
          ctx.fillStyle = ed.color;
          ctx.fillRect(ed.x, ed.y, ed.size, ed.size);
        }
        ctx.globalAlpha = 1;
      }

      // ── Render Halftone Star 3D Revolution ──
      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];

        if (d.layer === 'star' && d.localX !== undefined && d.localZ !== undefined) {
          const cosR = Math.cos(rotationAngle);
          const sinR = Math.sin(rotationAngle);
          
          // Revolve around Y axis
          const rx = d.localX * cosR - d.localZ * sinR;
          const rz = d.localX * sinR + d.localZ * cosR;

          d.homeX = d.pivotX! + rx;
          d.homeY = d.pivotY! + d.localY!;
          
          // Perspective scale based on Z depth
          const perspective = (rz + 250) / 250;
          d.size = dotSize(d.brightness) * Math.max(0.4, perspective);
        }

        const dx = d.homeX - d.x;
        const dy = d.homeY - d.y;
        const springK = 0.03;
        const damping = 0.88;

        d.vx += dx * springK;
        d.vy += dy * springK;

        if (mouse.active) {
          const mdx = d.x - mouse.x;
          const mdy = d.y - mouse.y;
          const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (mDist < 120 && mDist > 0) {
            const force = (120 - mDist) / 120;
            d.vx += (mdx / mDist) * force * 6;
            d.vy += (mdy / mDist) * force * 6;
          }
        }

        if (clickAge < 0.5) {
          const cdx = d.x - click.x;
          const cdy = d.y - click.y;
          const cDist = Math.sqrt(cdx * cdx + cdy * cdy);
          if (cDist < 200 && cDist > 0) {
            const burstForce = (200 - cDist) / 200 * (1 - clickAge * 2) * 25;
            d.vx += (cdx / cDist) * burstForce;
            d.vy += (cdy / cDist) * burstForce;
          }
        }

        d.vx *= damping; d.vy *= damping;
        d.x += d.vx; d.y += d.vy;

        const alpha = Math.min(1, d.baseAlpha);
        if (alpha <= 0.005) continue;

        // Sparkle glow for bright hand dots
        if (d.sparkle && d.layer === 'hand') {
          const si = 0.15 + 0.1 * Math.sin(now * 0.005 + d.phase * 3);
          const gs = d.size * 4;
          const g = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, gs);
          g.addColorStop(0, `rgba(255,255,255,${(si * alpha).toFixed(3)})`);
          g.addColorStop(1, 'rgba(255,255,255,0)');
          ctx.fillStyle = g;
          ctx.fillRect(d.x - gs, d.y - gs, gs * 2, gs * 2);
        }

        // Subtle twinkle for scatter star dots
        if (d.sparkle && d.layer === 'star') {
          const si = 0.07 + 0.05 * Math.sin(now * 0.003 + d.phase * 2);
          const gs = d.size * 3;
          const g = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, gs);
          g.addColorStop(0, `rgba(255,255,255,${si.toFixed(3)})`);
          g.addColorStop(1, 'rgba(255,255,255,0)');
          ctx.fillStyle = g;
          ctx.fillRect(d.x - gs, d.y - gs, gs * 2, gs * 2);
        }

        ctx.globalAlpha = alpha;
        ctx.fillStyle = d.color;
        ctx.fillRect(d.x - d.size / 2, d.y - d.size / 2, d.size, d.size);
      }

      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(render);
    };

    init().then(() => render());

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top, active: true };
    };
    const onMouseLeave = () => { mouseRef.current.active = false; };
    const onClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      clickRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top, time: performance.now() };
    };

    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseleave', onMouseLeave);
    canvas.addEventListener('click', onClick);
    window.addEventListener('resize', () => {
      cancelAnimationFrame(animId);
      dotsRef.current = [];
      init().then(() => render());
    });

    return () => {
      cancelAnimationFrame(animId);
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('mouseleave', onMouseLeave);
      canvas.removeEventListener('click', onClick);
    };
  }, [loadImageToCanvas, sampleCanvas, spawnEvaporatingDot, onTitleReady, headerHeight]);

  return (
    <>
      <div className={`absolute inset-0 z-30 bg-[#060608] flex items-center justify-center transition-opacity duration-700 pointer-events-none ${loading ? 'opacity-100' : 'opacity-0'}`}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-5 h-5 border border-white/20 border-t-white/50 rounded-full animate-spin" />
          <p className="text-white/25 text-[9px] tracking-[0.4em] uppercase font-mono">Initializing</p>
        </div>
      </div>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0 cursor-default" />
    </>
  );
}
