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
        staggerChildren: 0.1,
        delayChildren: 0.4,
      },
    },
  };

  const itemVars = {
    initial: { y: 20, opacity: 0 },
    animate: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 1.2,
        ease: [0.16, 1, 0.3, 1] as any,
      },
    },
  };

  return (
    <section className="relative min-h-screen w-full flex flex-col bg-black overflow-hidden font-sans select-none">
      {/* Background Engine */}
      <SpaceHorizonCanvas />

      {/* Top Navigation Bar */}
      <nav className="relative z-20 w-full flex items-center justify-between px-10 py-10">
        <div className="flex-1">
          <span className="text-sm font-bold tracking-widest text-white uppercase">
            Commerce Agents
          </span>
        </div>
        
        <div className="hidden md:block">
          <span className="text-xs tracking-[0.4em] text-white/40 uppercase hover:text-white transition-colors cursor-pointer">
            Our Cases
          </span>
        </div>

        <div className="flex-1 flex justify-end items-center gap-8">
          <div className="flex items-center gap-2 cursor-pointer group">
             <span className="text-xs tracking-widest text-white/50 group-hover:text-white transition-colors">EN</span>
             <div className="w-[1px] h-3 bg-white/20" />
             <span className="text-xs tracking-widest text-white/50 group-hover:text-white transition-colors">UA</span>
          </div>
          <span className="text-xs font-bold tracking-widest text-white uppercase cursor-pointer hover:opacity-70 transition-opacity">
            Menu +
          </span>
        </div>
      </nav>

      {/* Main Content Area */}
      <motion.div
        variants={containerVars}
        initial="initial"
        animate="animate"
        className="flex-1 relative z-10 w-full flex flex-col justify-end px-10 pb-32"
      >
        <div className="w-full flex flex-col lg:flex-row items-end justify-between gap-12">
          
          {/* Bottom-Left Headline */}
          <div className="max-w-3xl">
            <motion.h1 
              variants={itemVars}
              className="text-white text-7xl md:text-9xl font-bold leading-[0.85] tracking-tight mb-8"
            >
              Build. <br />
              Automate. <br />
              Scale.
            </motion.h1>
            <motion.p
              variants={itemVars}
              className="max-w-lg text-white/50 text-base md:text-lg font-medium leading-relaxed"
            >
              Commerce Agents transforms your ideas into structured digital systems — 
              faster, smarter, and fully transparent technology layers.
            </motion.p>
          </div>

          {/* Right Sidebar CTA Content */}
          <div className="max-w-[280px] text-right">
            <motion.div variants={itemVars} className="space-y-6">
               <p className="text-xs text-white/30 uppercase tracking-[0.2em] leading-loose">
                 Futuristic, mysterious, and AI-driven agency focus on global digital transformation.
               </p>
               <button className="group flex items-center justify-end gap-3 w-full">
                  <span className="text-xs font-bold tracking-[0.3em] text-white group-hover:opacity-60 transition-opacity uppercase">
                    Discuss the project
                  </span>
                  <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center group-hover:border-white transition-colors">
                     <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-white">
                        <path d="M1 11L11 1M11 1H3M11 1V9" stroke="currentColor" strokeWidth="1.2" />
                     </svg>
                  </div>
               </button>
            </motion.div>
          </div>

        </div>
      </motion.div>

      {/* Edge highlighting overlay for cinematic feel */}
      <div className="absolute inset-0 z-20 pointer-events-none border-[1px] border-white/5 m-4" />
    </section>
  );
}
