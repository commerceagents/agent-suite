'use client';

import React from 'react';
import { motion } from 'framer-motion';
import GlobalNetwork from './GlobalNetwork';

export default function PremiumHero() {
  const containerVars = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVars = {
    initial: { y: 20, opacity: 0 },
    animate: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1] as any,
      },
    },
  };

  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-white">
      {/* Dynamic Background Layer - Pure Code HUD */}
      <GlobalNetwork />

      {/* Main Content */}
      <motion.div
        variants={containerVars}
        initial="initial"
        animate="animate"
        className="relative z-10 flex flex-col items-center text-center px-6"
      >
        <motion.div variants={itemVars} className="mb-4">
          <span className="text-[10px] font-mono tracking-[0.6em] uppercase text-zinc-400">
            Systemic Logistics — Precise Execution
          </span>
        </motion.div>

        <motion.h1 
          variants={itemVars}
          className="text-black text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter mb-8"
          style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}
        >
          COMMERCE <br />
          <span className="text-zinc-200">AGENTS.</span>
        </motion.h1>

        <motion.p
          variants={itemVars}
          className="max-w-xl text-zinc-500 text-lg font-light leading-relaxed mb-10"
        >
          Orchestrating global commerce with autonomous architecture.
          The premium nexus for high-performance scale.
        </motion.p>

        <motion.div variants={itemVars}>
          <button 
            className="px-12 py-3.5 bg-black text-white font-medium text-xs tracking-[0.2em] uppercase rounded-full transition-all duration-300 hover:scale-105 active:scale-95 shadow-xl shadow-black/10"
          >
            Contact us
          </button>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          variants={itemVars}
          className="absolute bottom-12 flex flex-col items-center gap-4"
        >
          <div className="w-[1px] h-12 bg-zinc-100" />
          <span className="text-[9px] font-mono tracking-widest text-zinc-300 uppercase">
            EST. 2024
          </span>
        </motion.div>
      </motion.div>

      {/* HUD Side Metadata */}
      <div className="absolute left-8 bottom-12 hidden lg:flex flex-col gap-2 opacity-30 select-none">
        <span className="text-[9px] font-mono tracking-[0.3em] uppercase text-black">
          REGISTRY: AC-942
        </span>
        <span className="text-[9px] font-mono tracking-[0.3em] uppercase text-black">
          LOC: 40.71° N, 74.00° W
        </span>
      </div>
      
      <div className="absolute right-8 bottom-12 hidden lg:flex flex-col gap-2 text-right opacity-30 select-none">
        <span className="text-[9px] font-mono tracking-[0.3em] uppercase text-black">
          CORE: ACTIVE
        </span>
        <span className="text-[9px] font-mono tracking-[0.3em] uppercase text-black">
          NET: STABLE
        </span>
      </div>
    </section>
  );
}
