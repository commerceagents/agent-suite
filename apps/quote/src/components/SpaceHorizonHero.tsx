'use client';

import React from 'react';
import { motion } from 'framer-motion';
import SpaceHorizonCanvas from './SpaceHorizonCanvas';

export default function SpaceHorizonHero() {
  const containerVars = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.6,
      },
    },
  };

  const itemVars = {
    initial: { y: 30, opacity: 0 },
    animate: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 1.5,
        ease: [0.16, 1, 0.3, 1] as any,
      },
    },
  };

  return (
    <section className="relative h-screen w-full flex flex-col bg-black overflow-hidden font-sans select-none">
      {/* Background Cinematic Engine - Pure Visual Mode */}
      <SpaceHorizonCanvas />

      {/* Main Content Area - Centered Agency Title */}
      <motion.div
        variants={containerVars}
        initial="initial"
        animate="animate"
        className="flex-1 relative z-20 w-full flex flex-col items-center justify-center px-10"
      >
        <motion.h1 
          variants={itemVars}
          className="text-white font-bold tracking-[0.25em] leading-none uppercase select-none text-center whitespace-nowrap"
          style={{ 
            fontFamily: "'Inter', 'SF Pro Display', sans-serif",
            fontSize: "clamp(32px, 9vw, 60px)"
          }}
        >
          COMMERCE AGENTS
        </motion.h1>
      </motion.div>

      {/* Deployment Verification Marker */}
      <div className="absolute bottom-4 right-4 z-50 text-[10px] font-mono text-white/20 select-none pointer-events-none">
        BUILD // ID: CA-SP-120
      </div>
    </section>
  );
}
