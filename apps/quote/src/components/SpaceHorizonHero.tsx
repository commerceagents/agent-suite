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
    <section className="relative h-screen w-full flex flex-col bg-[#050505] overflow-hidden font-sans select-none px-4 pt-4 pb-2 md:px-8 md:pt-6 md:pb-4 lg:px-10 lg:pt-8 lg:pb-6">
      
      {/* Floating Capsule Navigation (Logo is now inside this component) */}
      <Navigation />

      {/* Box Container - inspired by reference image */}
      <motion.div 
        variants={containerVars}
        initial="initial"
        animate="animate"
        className="relative flex-1 w-full h-full bg-black rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl ring-1 ring-white/10"
      >
        
        {/* Atmospheric Background System */}
        <div className="absolute inset-0 z-0 bg-black" />

        {/* Main Content Area - Clean Centered Text */}
        <div className="relative z-20 w-full h-full flex items-center justify-center">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.5 }}
            className="text-white font-bold tracking-[0.5em] leading-none uppercase select-none text-center whitespace-nowrap"
            style={{ 
              fontFamily: "'Inter', 'SF Pro Display', sans-serif",
              fontSize: "clamp(16px, 4vw, 60px)"
            }}
          >
            COMMERCE AGENTS
          </motion.h1>
        </div>

      </motion.div>

    </section>
  );
}
