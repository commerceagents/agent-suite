'use client';
 
import React from 'react';
import { motion } from 'framer-motion';
import Navigation from './Navigation';
 
function PixelBlocks() {
  const blocks = [
    // Top Left Cluster
    { t: '15%', l: '20%', w: 40, h: 40 },
    { t: '15%', l: '24%', w: 40, h: 40 },
    { t: '19%', l: '20%', w: 40, h: 40 },
    
    // Right Vertical Column
    { t: '10%', r: '15%', w: 20, h: 80 },
    { t: '22%', r: '15%', w: 20, h: 40 },
    
    // Bottom Structured Group (L-Shape)
    { b: '20%', l: '30%', w: 60, h: 20 },
    { b: '24%', l: '30%', w: 20, h: 40 },
    
    // Center Floating
    { t: '45%', r: '25%', w: 30, h: 30 },
    { t: '60%', l: '40%', w: 80, h: 20 },
  ];
  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      {blocks.map((b, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.15, 0.05] }}
          transition={{ duration: 4, delay: 9 + i * 0.5, repeat: Infinity, repeatType: "reverse" }}
          className="absolute bg-white/5"
          style={{ 
            top: b.t, left: b.l, right: b.r, bottom: b.b,
            width: b.w, height: b.h,
            boxShadow: '0 0 10px rgba(255,255,255,0.05)'
          }}
        />
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
        transition={{ delay: 9, duration: 4 }}
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
        <Navigation show={true} delay={14} />
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
              delay: 7.5, 
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
              <DrawingStroke delay={8.5} />

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
                opacity: { duration: 2, delay: 13 },
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                scale: { duration: 4, delay: 13, ease: [0.16, 1, 0.3, 1] as any },
                letterSpacing: { duration: 5, delay: 13.5, ease: "easeOut" },
                filter: { duration: 2, delay: 13 }
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
