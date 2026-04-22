'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Navigation from './Navigation';

export default function SpaceHorizonHero() {
  const containerVars = {
    initial: { opacity: 0, scale: 0.98 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 1.2,
        ease: [0.16, 1, 0.3, 1] as any,
        staggerChildren: 0.2,
        delayChildren: 0.6,
      },
    },
  };


  return (
    <section className="relative h-screen w-full bg-black overflow-hidden font-sans select-none">
      
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
      <div className="relative z-20 h-full w-full">
        {/* Navigation - Fixed at top with generous breathing room */}
        <div className="absolute top-0 left-0 right-0 z-50 px-4 pt-6 md:px-8 md:pt-8 lg:px-10 lg:pt-12">
          <Navigation />
        </div>

        {/* Card Centering Layer - Extended upwards to header */}
        <div className="absolute inset-0 flex items-center justify-center p-4 pt-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="relative w-[90vw] max-w-[1600px] min-h-[60vh] md:min-h-[90vh] p-6 md:p-12 lg:p-20 rounded-[20px] md:rounded-[40px] overflow-hidden border border-white/10 bg-white/[0.05] backdrop-blur-[4px] shadow-[0_20px_50px_rgba(0,0,0,0.3),inset_0_0_30px_rgba(255,255,255,0.05)] ring-1 ring-white/10 flex items-center justify-center transform-gpu"
            style={{ 
              isolation: 'isolate',
              willChange: 'transform, backdrop-filter',
              WebkitBackfaceVisibility: 'hidden',
              WebkitPerspective: 1000,
              WebkitTransform: 'translate3d(0,0,0)',
              WebkitMaskImage: '-webkit-radial-gradient(white, black)'
            }}
          >
            {/* Soft Ambient Green Tint & Highlight Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-emerald-500/5 pointer-events-none" />
            
            {/* Top-Edge Glass Reflection */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
            
            {/* Inner Vignette for Depth */}
            <div className="absolute inset-0 shadow-[inset_0_0_60px_rgba(0,0,0,0.1)] pointer-events-none rounded-[20px] md:rounded-[30px]" />

            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 2, delay: 0.5 }}
              className="relative z-10 text-white font-bold tracking-[0.4em] md:tracking-[0.5em] leading-tight uppercase select-none text-center max-w-full break-words"
              style={{ 
                fontFamily: "'Inter', 'SF Pro Display', sans-serif",
                fontSize: "clamp(20px, 4.5vw, 52px)"
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
