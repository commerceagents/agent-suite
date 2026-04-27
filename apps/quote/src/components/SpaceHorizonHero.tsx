'use client';
 
import React from 'react';
import { motion } from 'framer-motion';
import Navigation from './Navigation';
 
export default function SpaceHorizonHero() {
  return (
    <section className="relative h-[100dvh] w-full bg-black overflow-hidden font-sans select-none p-4 md:p-6">
      
      {/* STEP 1: DEEP BLACK BACKGROUND (Video Removed) */}
      <div className="absolute inset-0 z-0 bg-black" />

      {/* NAVIGATION LAYER (Starts 10.5s - Sync with text) */}
      <div className="absolute top-0 left-0 right-0 z-50 pt-6 px-4">
        <Navigation show={true} delay={10.5} />
      </div>

      {/* UI LAYER - GLASS CARD (Bottom Aligned) */}
      <div className="relative z-20 h-full w-full flex items-end justify-center pb-[1vh]">
        <div className="w-full max-w-[2400px]">
          {/* STEP 2: GLASS CARD REVEAL (Starts 9.5s) */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 3.5, 
              delay: 9.5, 
              ease: [0.16, 1, 0.3, 1] as any 
            }}
            className="relative w-full min-h-[50vh] h-[75vh] md:h-[80vh] p-6 md:p-12 lg:p-20 rounded-[40px] overflow-hidden border border-white/10 bg-[#050508]/60 backdrop-blur-[20px] shadow-[0_40px_100px_rgba(0,0,0,0.8)] flex items-center justify-center transform-gpu"
            style={{ 
              isolation: 'isolate',
              willChange: 'transform, opacity',
            }}
          >
            {/* 1. TECHNICAL GRID BACKGROUND */}
            <div 
              className="absolute inset-0 opacity-[0.1] pointer-events-none z-0" 
              style={{ 
                backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)`,
                backgroundSize: '40px 40px' 
              }} 
            />

            {/* 2. NEON VAPOR ENGINE (High-Visibility Smoke) */}
            <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
              {/* Smoke Wisp 1: Bright White */}
              <motion.div
                animate={{ 
                  y: [200, -600],
                  x: [0, 80, -40, 30],
                  opacity: [0, 0.8, 0],
                  scale: [1, 2, 3]
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute bottom-0 left-[5%] w-[400px] h-[400px] bg-white/30 blur-[100px] rounded-full"
              />

              {/* Smoke Wisp 2: Indigo Vapor */}
              <motion.div
                animate={{ 
                  y: [200, -550],
                  x: [0, -90, 50, -30],
                  opacity: [0, 0.6, 0],
                  scale: [1, 2.5, 3.5]
                }}
                transition={{ duration: 14, repeat: Infinity, ease: "linear", delay: 2 }}
                className="absolute bottom-0 right-[10%] w-[500px] h-[500px] bg-indigo-400/20 blur-[120px] rounded-full"
              />

              {/* Smoke Wisp 3: Dense Central White */}
              <motion.div
                animate={{ 
                  y: [200, -650],
                  x: [0, 40, -60, 20],
                  opacity: [0, 0.7, 0],
                  scale: [0.8, 2, 3]
                }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear", delay: 4 }}
                className="absolute bottom-0 left-[35%] w-[350px] h-[350px] bg-white/20 blur-[110px] rounded-full"
              />

              {/* Smoke Wisp 4: Fast Drift */}
              <motion.div
                animate={{ 
                  y: [200, -700],
                  x: [0, -50, 30],
                  opacity: [0, 0.5, 0],
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear", delay: 1 }}
                className="absolute bottom-0 right-[30%] w-[200px] h-[200px] bg-white/30 blur-[80px] rounded-full"
              />

              {/* Intense Bottom Edge Glow Line */}
              <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-white/50 to-transparent shadow-[0_0_60px_rgba(255,255,255,0.5)] z-30" />
            </div>

            {/* Grain Texture Overlay */}
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none mix-blend-overlay z-40" 
                 style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3%3Cfilter id='noiseFilter'%3%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3%3C/filter%3%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3%3C/svg%3")` }} />

            {/* BRAND TEXT - 'OUTSIDE TO INSIDE' REVEAL */}
            <motion.h1
              initial={{ opacity: 0, scale: 2, filter: 'blur(20px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              transition={{ 
                duration: 2.5, 
                delay: 10.5, 
                ease: [0.16, 1, 0.3, 1] as any 
              }}
              className="relative z-10 text-white font-bold leading-tight uppercase select-none text-center max-w-full break-words"
              style={{ 
                fontFamily: "var(--font-montserrat), sans-serif",
                fontSize: "clamp(20px, 4.5vw, 52px)",
                textShadow: "0 0 30px rgba(255,255,255,0.2)",
                letterSpacing: "0.5em"
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
