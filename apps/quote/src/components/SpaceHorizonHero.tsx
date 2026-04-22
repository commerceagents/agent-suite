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
          {/* Deep Base Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(30,30,30,1)_0%,rgba(0,0,0,1)_100%)]" />
          
          {/* Cinematic Light Rays (Conic) */}
          <motion.div 
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-[100%] opacity-20 pointer-events-none"
            style={{
              background: "conic-gradient(from 0deg at 50% 50%, transparent 0%, rgba(255,255,255,0.05) 15%, transparent 30%, transparent 70%, rgba(255,255,255,0.05) 85%, transparent 100%)",
              filter: "blur(60px)"
            }}
          />

          {/* Shifting Fog Layers */}
          <motion.div 
            animate={{ 
              x: [-100, 100],
              y: [-50, 50],
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 bg-[radial-gradient(circle_at_40%_40%,rgba(255,255,255,0.05)_0%,transparent_50%)] blur-[100px]"
          />

          {/* Studio Shadow Polish */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/90 z-5" />
        </div>

        {/* Main Content Area - Centered Agency Title */}
        <div className="relative z-20 w-full h-full flex flex-col items-center justify-center px-6">
          <motion.div
            initial={{ opacity: 0, scale: 1.6, filter: "blur(20px)" }}
            animate={{ 
              opacity: 1, 
              scale: [1, 1.01, 1],
              filter: "blur(0px)" 
            }}
            transition={{ 
              opacity: { duration: 3, delay: 0.1 },
              scale: { 
                duration: 5, 
                delay: 0.1,
                ease: [0.16, 1, 0.3, 1],
                times: [0, 0.9, 1],
                repeat: Infinity,
                repeatType: "mirror"
              },
              filter: { duration: 4, delay: 0.1 }
            }}
            className="relative"
          >
            {/* Elegant Diagonal Light Streak */}
            <motion.div 
              animate={{ 
                x: ['-200%', '300%'],
                opacity: [0, 0.6, 0]
              }}
              transition={{ 
                duration: 5, 
                repeat: Infinity, 
                repeatDelay: 3, 
                ease: "easeInOut",
                times: [0, 0.5, 1]
              }}
              className="absolute inset-0 z-30 bg-gradient-to-r from-transparent via-white/15 to-transparent -rotate-[35deg] scale-[3] blur-md pointer-events-none"
            />

            <h1 
              className="text-white font-bold tracking-[0.7em] leading-none uppercase select-none text-center whitespace-nowrap drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]"
              style={{ 
                fontFamily: "'Inter', 'SF Pro Display', sans-serif",
                fontSize: "clamp(24px, 8vw, 84px)",
                textShadow: "0 0 50px rgba(255,255,255,0.1)"
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
