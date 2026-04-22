'use client';
 
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navigation from './Navigation';
 
export default function SpaceHorizonHero() {
  const [phase, setPhase] = useState<'intro' | 'blank' | 'main'>('intro');

  useEffect(() => {
    // Stage 1: Logo Intro (1.5s)
    const t1 = setTimeout(() => setPhase('blank'), 1500);
    
    // Stage 2: Blank State (0.8s)
    const t2 = setTimeout(() => setPhase('main'), 2300);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <section className="relative h-[100dvh] w-full bg-black overflow-hidden font-sans select-none">
      
      {/* INITIAL LOGO INTRO LAYER */}
      <AnimatePresence mode="wait">
        {phase !== 'main' && (
          <motion.div
            key="intro-logo"
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === 'intro' ? 1 : 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 z-[100] flex items-center justify-center bg-black"
          >
            <motion.img 
              initial={{ scale: 0.9 }}
              animate={{ scale: phase === 'intro' ? 1 : 1.1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              src="/ca-logo.png" 
              alt="Logo" 
              className="w-24 md:w-32 lg:w-40 h-auto object-contain mix-blend-screen brightness-125"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN CONTENT LAYER (Revealed in Phase 'main') */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === 'main' ? 1 : 0 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        className="relative h-full w-full"
      >
        {/* Atmospheric Background System (Full Screen) */}
        <div className="absolute inset-0 z-0 bg-black">
          {/* Cinematic Video Background */}
          <video 
            src="/video-7.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-40 pointer-events-none"
          />
          
          {/* Studio Shadow Overlay to ensure readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80 z-5" />
        </div>

        {/* Main UI Layer */}
        <div className="relative z-20 h-full w-full flex flex-col">
          {/* Navigation - Staggered reveal via parent delay */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: phase === 'main' ? 1 : 0, y: phase === 'main' ? 0 : -20 }}
            transition={{ duration: 1, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-full px-[4vw] pt-[2vh] mb-[1vh]"
          >
            <Navigation />
          </motion.div>

          {/* Card Area - Emerging from bottom */}
          <div className="flex-1 flex items-center justify-center p-[2vw] pb-[4vh]">
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: phase === 'main' ? 1 : 0, y: phase === 'main' ? 0 : 60 }}
              transition={{ duration: 1.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-[92vw] max-w-[1700px] min-h-[40vh] h-[75vh] md:h-[80vh] p-6 md:p-12 lg:p-20 rounded-[30px] md:rounded-[60px] overflow-hidden border border-white/10 bg-[#0A0A0F]/20 backdrop-blur-[6px] shadow-[0_40px_100px_rgba(0,0,0,0.5)] ring-1 ring-white/10 flex items-center justify-center transform-gpu"
              style={{ 
                isolation: 'isolate',
                willChange: 'transform, backdrop-filter',
                WebkitBackfaceVisibility: 'hidden',
                WebkitPerspective: 1000,
                WebkitTransform: 'translate3d(0,0,0)',
              }}
            >
              {/* Grain Texture Overlay */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay" 
                   style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3%3Cfilter id='noiseFilter'%3%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3%3C/filter%3%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3%3C/svg%3")` }} />

              {/* Neon Bottom Glow System */}
              <div className="absolute -bottom-[20%] -left-[10%] w-[60%] h-[50%] bg-purple-600/20 blur-[100px] rounded-full pointer-events-none" />
              <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[50%] bg-indigo-600/20 blur-[100px] rounded-full pointer-events-none" />
              <div className="absolute bottom-0 left-0 right-0 h-[30%] bg-gradient-to-t from-violet-600/10 to-transparent pointer-events-none" />
              
              {/* Top-Edge Glass Reflection */}
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
              
              {/* Inner Vignette for Depth */}
              <div className="absolute inset-0 shadow-[inset_0_0_80px_rgba(0,0,0,0.4)] pointer-events-none" />

              <motion.h1
                initial={{ opacity: 0, scale: 1.2 }}
                animate={{ opacity: phase === 'main' ? 1 : 0, scale: phase === 'main' ? 1 : 1.2 }}
                transition={{ duration: 2, delay: 1, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10 text-white font-bold tracking-[0.4em] md:tracking-[0.5em] leading-tight uppercase select-none text-center max-w-full break-words"
                style={{ 
                  fontFamily: "'Inter', 'SF Pro Display', sans-serif",
                  fontSize: "clamp(20px, 4.5vw, 52px)",
                  textShadow: "0 0 20px rgba(255,255,255,0.1)"
                }}
              >
                COMMERCE AGENTS
              </motion.h1>
            </motion.div>
          </div>
        </div>
      </motion.div>

    </section>
  );
}
