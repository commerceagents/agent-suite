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
      <div className="relative z-20 h-full flex flex-col px-4 pt-4 pb-2 md:px-8 md:pt-6 md:pb-4 lg:px-10 lg:pt-8 lg:pb-6">
        {/* Floating Capsule Navigation */}
        <Navigation />

        {/* Main Content Area - Clean Centered Text */}
        <div className="flex-1 flex items-center justify-center">
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
      </div>

    </section>
  );
}
