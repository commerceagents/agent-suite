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
      {/* Background Cinematic Engine */}
      <SpaceHorizonCanvas />

      {/* Top Navigation Bar - Ultra Minimal */}
      <nav className="relative z-30 w-full flex items-center justify-between px-10 py-10">
        <div className="flex-1">
          <span className="text-sm font-bold tracking-[0.5em] text-white uppercase">
            Commerce Agents
          </span>
        </div>
        
        <div className="hidden md:block">
          <span className="text-[10px] tracking-[0.6em] text-white/30 uppercase hover:text-white transition-colors cursor-pointer">
            Our Cases
          </span>
        </div>

        <div className="flex-1 flex justify-end items-center gap-10">
          <span className="text-[10px] font-bold tracking-[0.4em] text-white/50 uppercase cursor-pointer hover:text-white transition-colors">
            Menu +
          </span>
        </div>
      </nav>

      {/* Main Content Area - Bottom Anchored */}
      <motion.div
        variants={containerVars}
        initial="initial"
        animate="animate"
        className="flex-1 relative z-20 w-full flex flex-col justify-end px-12 pb-24"
      >
        <div className="w-full flex flex-col lg:flex-row items-end justify-between gap-24">
          
          {/* Bottom-Left Headline Group */}
          <div className="max-w-4xl">
            <motion.h1 
              variants={itemVars}
              className="text-white text-[5vw] lg:text-[6vw] font-bold leading-[1] tracking-tighter mb-10"
              style={{ fontFamily: "'Inter', 'SF Pro Display', sans-serif" }}
            >
              Crafting marketing <br />
              that your b2b business
            </motion.h1>
            <motion.p
              variants={itemVars}
              className="max-w-lg text-white/40 text-lg font-light leading-relaxed tracking-wide"
            >
              Commerce Agents transforms your ideas into structured digital systems — 
              faster, smarter, and fully transparent technology layers.
            </motion.p>
          </div>

          {/* Right Sidebar CTA Content */}
          <div className="max-w-[320px] text-right">
            <motion.div variants={itemVars} className="space-y-12">
               <p className="text-[11px] text-white/20 uppercase tracking-[0.3em] leading-loose">
                 Silent. Cinematic. Agency focus on <br /> premium digital transformation.
               </p>
               <button className="group flex items-center justify-end gap-6 w-full pb-2">
                  <span className="text-[10px] font-bold tracking-[0.5em] text-white group-hover:text-white transition-colors uppercase">
                    Discuss the project
                  </span>
                  <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:border-white transition-colors">
                     <svg width="14" height="14" viewBox="0 0 12 12" fill="none" className="text-white">
                        <path d="M1 11L11 1M11 1H3M11 1V9" stroke="currentColor" strokeWidth="1.2" />
                     </svg>
                  </div>
               </button>
            </motion.div>
          </div>

        </div>
      </motion.div>

      {/* Edge highlight removed, cards removed for 100% Studio Cleanliness */}
    </section>
  );
}
