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
        <div className="absolute inset-0 z-0 bg-[#020202]">
          {/* Deep Radial Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(20,20,20,1)_0%,rgba(0,0,0,1)_100%)]" />
          
          {/* Animated Fog Layer 1 */}
          <motion.div 
            animate={{ 
              x: [-100, 100],
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/4 -left-1/4 w-[150%] h-[150%] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0%,transparent_60%)] blur-[100px] pointer-events-none"
          />

          {/* Animated Fog Layer 2 */}
          <motion.div 
            animate={{ 
              x: [100, -100],
              opacity: [0.05, 0.15, 0.05]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-1/4 -right-1/4 w-[150%] h-[150%] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_60%)] blur-[120px] pointer-events-none"
          />

          {/* Subtle Light Streaks */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-1/3 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent blur-sm" />
            <div className="absolute top-2/3 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent blur-md" />
          </div>

          {/* Studio Shadow Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 z-5" />
        </div>

        {/* Main Content Area - Centered Agency Title */}
        <div className="relative z-20 w-full h-full flex flex-col items-center justify-center px-6">
          <motion.div
            initial={{ opacity: 0, scale: 2.5, filter: "blur(20px)" }}
            animate={{ 
              opacity: 1, 
              scale: [1, 1.02, 1],
              filter: "blur(0px)" 
            }}
            transition={{ 
              opacity: { duration: 2, delay: 0.5 },
              scale: { 
                duration: 5, 
                delay: 0.5,
                ease: [0.16, 1, 0.3, 1],
                times: [0, 0.8, 1],
                repeat: Infinity,
                repeatType: "mirror",
                repeatDelay: 0
              },
              filter: { duration: 3, delay: 0.5 }
            }}
            className="relative"
          >
            {/* Animated Light Streak over Text */}
            <motion.div 
              animate={{ x: ['-100%', '200%'], opacity: [0, 1, 0] }}
              transition={{ 
                duration: 4, 
                repeat: Infinity, 
                repeatDelay: 3, 
                ease: "easeInOut",
                times: [0, 0.5, 1]
              }}
              className="absolute inset-0 z-30 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-20 pointer-events-none"
            />

            <h1 
              className="text-white font-bold tracking-[0.5em] leading-none uppercase select-none text-center whitespace-nowrap drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]"
              style={{ 
                fontFamily: "'Inter', 'SF Pro Display', sans-serif",
                fontSize: "clamp(24px, 8vw, 72px)",
                textShadow: "0 0 30px rgba(255,255,255,0.1)"
              }}
            >
              COMMERCE AGENTS
            </h1>
          </motion.div>
        </div>

      </motion.div>

    </section>
  );
}
