'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Navigation from './Navigation';

export default function ScalableHero() {
  return (
    <section className="relative h-screen w-full bg-black overflow-hidden select-none flex items-center justify-center">
      
      {/* 1. BACKGROUND ENGINE: MOON & BEAMS */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Moon Horizon - Proportional Scaling */}
        <motion.div 
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
          className="absolute bottom-[-40vw] left-1/2 -translate-x-1/2 w-[120vw] aspect-square rounded-full bg-white/[0.02] border border-white/10 blur-[20px]"
          style={{
            background: "radial-gradient(circle at center, rgba(255,255,255,0.05) 0%, transparent 70%)"
          }}
        />

        {/* Center Vertical Light Beams */}
        <div className="absolute inset-0 flex justify-center gap-[4vw]">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ opacity: 1, scaleY: 1 }}
              transition={{ 
                duration: 2.5, 
                delay: 1 + (i * 0.2), 
                ease: [0.16, 1, 0.3, 1] 
              }}
              className="w-[1px] h-full bg-gradient-to-b from-transparent via-white/[0.08] to-transparent origin-top"
              style={{
                boxShadow: "0 0 40px rgba(255,255,255,0.05)"
              }}
            />
          ))}
        </div>
      </div>

      {/* 2. SCALABLE CONTENT LAYER - NO LAYOUT SHIFTS */}
      <div className="relative z-20 w-[90vw] h-full flex flex-col justify-between py-[4vw]">
        
        {/* Navigation - Always at top */}
        <div className="w-full">
          <Navigation show={true} delay={1} />
        </div>

        {/* Main Split Layout - Proportional flex row for all devices */}
        <div className="w-full flex flex-row items-end justify-between mb-[6vw]">
          
          {/* LEFT: HEADING + TEXT */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.5, delay: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-[1.5vw] w-[50%]"
          >
            <h1 
              className="text-white font-bold leading-[0.9] uppercase tracking-tighter"
              style={{ 
                fontSize: "clamp(28px, 7vw, 120px)",
                fontFamily: "var(--font-syncopate), sans-serif",
                textShadow: "0 0 40px rgba(255,255,255,0.2)"
              }}
            >
              COMMERCE <br /> AGENTS
            </h1>
            <p 
              className="text-white/40 font-light leading-relaxed max-w-[80%]"
              style={{ 
                fontSize: "clamp(10px, 1.1vw, 18px)",
                fontFamily: "var(--font-montserrat), sans-serif"
              }}
            >
              Architecting high-performance digital ecosystems through <br className="hidden md:block" /> 
              neural orchestration and structural precision.
            </p>
          </motion.div>

          {/* RIGHT: SUPPORTING CONTENT + CTA */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.5, delay: 1.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-end gap-[2vw] w-[40%]"
          >
            <div className="text-right flex flex-col gap-[0.5vw]">
              <span 
                className="text-white/20 uppercase tracking-[0.6em]"
                style={{ fontSize: "clamp(8px, 0.7vw, 12px)" }}
              >
                Project Status
              </span>
              <span 
                className="text-white/60 font-mono"
                style={{ fontSize: "clamp(9px, 0.8vw, 14px)" }}
              >
                [ ALL_SYSTEMS_OPERATIONAL ]
              </span>
            </div>

            <button 
              className="group relative overflow-hidden bg-white text-black font-bold uppercase transition-all hover:pr-[3vw] active:scale-95"
              style={{ 
                padding: "clamp(10px, 1vw, 20px) clamp(20px, 2.5vw, 60px)",
                fontSize: "clamp(9px, 0.9vw, 14px)",
                fontFamily: "var(--font-syncopate), sans-serif"
              }}
            >
              <span className="relative z-10">Start Orchestration</span>
              <div className="absolute right-[-2vw] top-0 bottom-0 w-[5vw] bg-black opacity-0 group-hover:opacity-10 transition-all" />
            </button>
          </motion.div>

        </div>

      </div>

      {/* 3. OPTIONAL FILM GRAIN FOR TEXTURE */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay"
           style={{ backgroundImage: 'url("/noise.svg")' }} />

    </section>
  );
}
