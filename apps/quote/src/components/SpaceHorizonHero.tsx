'use client';

import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import SpaceHorizonCanvas from './SpaceHorizonCanvas';
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

  const itemVars = {
    initial: { y: 20, opacity: 0 },
    animate: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 1,
        ease: [0.16, 1, 0.3, 1] as any,
      },
    },
  };

  return (
    <section className="relative h-screen w-full flex flex-col bg-[#050505] overflow-hidden font-sans select-none px-4 pt-4 pb-2 md:px-8 md:pt-6 md:pb-4 lg:px-10 lg:pt-8 lg:pb-6">
      
      {/* Floating Capsule Navigation (Logo is now inside this component) */}
      <Navigation />

      {/* Box Container - inspired by reference image */}
      <motion.div 
        variants={containerVars}
        initial="initial"
        animate="animate"
        className="relative flex-1 w-full h-full bg-black rounded-[2.5rem] overflow-hidden shadow-2xl"
      >
        
        {/* Cinematic Solid Background */}
        <div className="absolute inset-0 z-0 bg-black">
          {/* Studio Shadow Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 z-5" />
        </div>





        {/* Main Content Area - Centered Agency Title */}
        <div className="relative z-20 w-full h-full flex flex-col items-center justify-center px-6">
          <motion.h1 
            variants={itemVars}
            className="text-white font-bold tracking-[0.3em] leading-none uppercase select-none text-center whitespace-nowrap"
            style={{ 
              fontFamily: "'Inter', 'SF Pro Display', sans-serif",
              fontSize: "clamp(24px, 8vw, 56px)"
            }}
          >
            COMMERCE AGENTS
          </motion.h1>
          
        </div>

      </motion.div>

    </section>
  );
}
