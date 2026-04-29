'use client';
 
import React from 'react';
import { motion } from 'framer-motion';
import Navigation from './Navigation';
 
function PixelBlocks() {
  const cellSize = 25;
  
  // Define classic Tetrimino shapes
  const shapes = React.useMemo(() => [
    { name: 'I', cells: [[0,0], [0,1], [0,2], [0,3]], l: '10%', duration: 12, delay: 0 },
    { name: 'O', cells: [[0,0], [1,0], [0,1], [1,1]], l: '25%', duration: 15, delay: -2 },
    { name: 'T', cells: [[1,0], [0,1], [1,1], [2,1]], l: '40%', duration: 10, delay: -5 },
    { name: 'S', cells: [[1,0], [2,0], [0,1], [1,1]], l: '55%', duration: 18, delay: -8 },
    { name: 'Z', cells: [[0,0], [1,0], [1,1], [2,1]], l: '70%', duration: 14, delay: -3 },
    { name: 'J', cells: [[1,0], [1,1], [1,2], [0,2]], l: '85%', duration: 16, delay: -10 },
    { name: 'L', cells: [[0,0], [0,1], [0,2], [1,2]], l: '15%', duration: 13, delay: -4 },
    { name: 'I', cells: [[0,0], [1,0], [2,0], [3,0]], l: '45%', duration: 17, delay: -7 },
    { name: 'T', cells: [[0,0], [1,0], [2,0], [1,1]], l: '65%', duration: 11, delay: -1 },
    { name: 'O', cells: [[0,0], [1,0], [0,1], [1,1]], l: '80%', duration: 19, delay: -6 },
  ], []);

  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      <style>{`
        @keyframes fall {
          from { transform: translateY(-150px); }
          to { transform: translateY(100vh); }
        }
        .falling-shape {
          animation: fall linear infinite;
        }
        .falling-shape:hover {
          animation-play-state: paused;
        }
        .falling-shape:hover .piece-block {
          background-color: rgba(255, 255, 255, 0.3);
          box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
          border-color: rgba(255, 255, 255, 0.5);
        }
      `}</style>
      {shapes.map((shape, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 10.2 + i * 0.1, duration: 1 }}
          className="falling-shape absolute pointer-events-auto cursor-crosshair group"
          style={{ 
            left: shape.l,
            width: cellSize * 4, 
            height: cellSize * 4,
            animationDuration: `${shape.duration}s`,
            animationDelay: `${shape.delay}s`,
            top: 0
          }}
        >
          {shape.cells.map(([cx, cy], ci) => (
            <div 
              key={ci}
              className="piece-block absolute bg-white/10 border border-white/5 transition-all duration-300"
              style={{
                width: cellSize - 1,
                height: cellSize - 1,
                left: cx * cellSize,
                top: cy * cellSize,
                boxShadow: '0 0 10px rgba(255,255,255,0.05)',
              }}
            />
          ))}
        </motion.div>
      ))}
    </div>
  );
}

function GridBackground() {
  return (
    <div 
      className="absolute inset-0 opacity-[0.12] pointer-events-none z-0" 
      style={{ 
        backgroundImage: `
          linear-gradient(to right, rgba(255, 255, 255, 0.2) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255, 255, 255, 0.2) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
        maskImage: 'radial-gradient(circle at center, black 40%, transparent 90%)',
        WebkitMaskImage: 'radial-gradient(circle at center, black 40%, transparent 90%)'
      }} 
    />
  );
}

function DrawingStroke({ delay }: { delay: number }) {
  return (
    <svg 
      className="absolute inset-0 w-full h-full pointer-events-none z-50 overflow-visible"
      preserveAspectRatio="none"
      viewBox="0 0 100 100"
    >
      {/* Side 1: Top-Center -> Right -> Bottom-Center */}
      <motion.path
        d="M 50 0 L 98 0 C 99 0 100 1 100 2 L 100 98 C 100 99 99 100 98 100 L 50 100"
        fill="none"
        stroke="white"
        strokeWidth="0.2"
        vectorEffect="non-scaling-stroke"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ 
          pathLength: [0, 1, 1], 
          opacity: [0, 1, 1, 0] 
        }}
        transition={{ 
          duration: 9, 
          times: [0, 0.4, 0.9, 1],
          delay: delay, 
          ease: "easeInOut" 
        }}
      />
      {/* Side 2: Top-Center -> Left -> Bottom-Center */}
      <motion.path
        d="M 50 0 L 2 0 C 1 0 0 1 0 2 L 0 98 C 0 99 1 100 2 100 L 50 100"
        fill="none"
        stroke="white"
        strokeWidth="0.2"
        vectorEffect="non-scaling-stroke"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ 
          pathLength: [0, 1, 1], 
          opacity: [0, 1, 1, 0] 
        }}
        transition={{ 
          duration: 9, 
          times: [0, 0.4, 0.9, 1],
          delay: delay, 
          ease: "easeInOut" 
        }}
      />
    </svg>
  );
}

function AtmosphericBloom() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-40 mix-blend-screen">
      {/* Soft volumetric blobs that replicate the 'fog' feel without WebGL */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 10.5, duration: 4 }}
        className="absolute inset-0"
      >
        <div className="absolute -bottom-[20%] -left-[10%] w-[70%] h-[70%] bg-purple-600/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[60%] h-[60%] bg-blue-600/10 blur-[100px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-[20%] left-[30%] w-[40%] h-[40%] bg-purple-900/5 blur-[150px] rounded-full animate-pulse" style={{ animationDelay: '4s' }} />
      </motion.div>
    </div>
  );
}

export default function SpaceHorizonHero() {
  return (
    <section className="relative h-[100dvh] w-full bg-[#050508] overflow-hidden font-sans select-none flex items-center justify-center">
      {/* STEP 1: DEEP NAVY TO BLACK ATMOSPHERE */}
      <div 
        className="absolute inset-0 z-0" 
        style={{ background: 'radial-gradient(circle at center, #0a0a25 0%, #000000 100%)' }}
      />

      {/* NAVIGATION LAYER (Starts 14s - Sync with text expansion) */}
      <div className="absolute top-0 left-0 right-0 z-50 pt-6 px-4">
        <Navigation show={true} delay={11.5} />
      </div>

      {/* UI LAYER - GLASS CARD (Bottom Aligned) */}
      <div className="relative z-20 h-full w-full flex items-end justify-center pb-[4vh]">
        <div className="w-full max-w-[2400px]">
          {/* STEP 2: GLASS CARD REVEAL (Starts 9.5s) */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 3.5, 
              delay: 10.0, 
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              ease: [0.16, 1, 0.3, 1] as any 
            }}
            className="relative w-full min-h-[50vh] h-[75vh] md:h-[80vh] p-6 md:p-12 lg:p-20 rounded-[48px] overflow-hidden backdrop-blur-[30px] shadow-[0_30px_80px_rgba(0,0,0,0.6)] flex flex-col items-center justify-center transform-gpu"
            style={{ 
              isolation: 'isolate',
              willChange: 'transform, opacity',
              maskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 100%)'
            }}
          >
            {/* 1. SAAS GRADIENT WAVE & PLASMA FLAME */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden flex items-end">

              {/* PHASE 1 & 5: DRAWING STROKE REVEAL & EXIT */}
              <DrawingStroke delay={10.2} />

              {/* HIGH-FIDELITY GRADIENT STACK (Rising Horizon + Razor Sharp Side Glows) */}
              <div className="absolute inset-0 z-[-1] pointer-events-none overflow-hidden">
                {/* 1. The Deep Black Atmosphere (Top down) */}
                <div className="absolute inset-0 bg-black/60" />
                
                {/* 2. The Vibrant Purple Bloom (Bottom-Up) - Tall & Immersive */}
                <div className="absolute bottom-0 left-0 right-0 h-[55%] bg-gradient-to-t from-purple-600/50 via-purple-900/10 to-transparent blur-[30px]" />
                
                {/* 3. Left Side Bloom - Razor Thin & Razor Sharp (Full Height) */}
                <div className="absolute inset-y-0 left-0 w-[1%] bg-gradient-to-r from-purple-600/50 to-transparent blur-[3px]" />
                
                {/* 4. Right Side Bloom - Razor Thin & Razor Sharp (Full Height) */}
                <div className="absolute inset-y-0 right-0 w-[1%] bg-gradient-to-l from-purple-600/50 to-transparent blur-[3px]" />

                {/* 5. The Dense White Horizon (Absolute Bottom) */}
                <div className="absolute bottom-0 left-0 right-0 h-[15%] bg-gradient-to-t from-white/30 via-white/5 to-transparent blur-[5px]" />
              </div>

              {/* PHASE 2: STATIC ATMOSPHERIC BLOOM (Stable & Performant Alternative to WebGL) */}
              <AtmosphericBloom />
            </div>

            {/* 2. SUBTLE GRID & PIXEL BLOCKS */}
            <GridBackground />
            <PixelBlocks />

            {/* BRAND TEXT */}
            <style>{`
              @import url('https://fonts.googleapis.com/css2?family=Alexandria:wght@400;600;700;800;900&display=swap');
              
              @keyframes shimmer {
                0% { background-position: -200% center; }
                100% { background-position: 200% center; }
              }
              .shimmer-text {
                background: linear-gradient(90deg, 
                  rgba(255,255,255,0.7) 0%, 
                  rgba(255,255,255,1) 50%, 
                  rgba(255,255,255,0.7) 100%
                );
                background-size: 200% auto;
                -webkit-background-clip: text;
                background-clip: text;
                animation: shimmer 5s linear infinite;
              }
            `}</style>
            <motion.h1
              initial={{ opacity: 0, scale: 5, letterSpacing: "0em", filter: 'blur(20px)' }}
              animate={{ opacity: 1, scale: 1, letterSpacing: "0.2em", filter: 'blur(0px)' }}
              transition={{ 
                opacity: { duration: 2, delay: 11 },
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                scale: { duration: 4, delay: 11, ease: [0.16, 1, 0.3, 1] as any },
                letterSpacing: { duration: 5, delay: 11.5, ease: "easeOut" },
                filter: { duration: 2, delay: 11 }
              }}
              className="shimmer-text relative z-10 text-transparent font-bold leading-tight uppercase select-none text-center max-w-full break-words tracking-widest"
              style={{ 
                fontFamily: "'Alexandria', sans-serif",
                fontSize: "clamp(32px, 6vw, 72px)",
              }}
            >
              COMMERCE AGENTS
            </motion.h1>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
