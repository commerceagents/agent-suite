'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ParticleCanvas from './ParticleCanvas';

export default function PremiumHero() {
  const [isMorphed, setIsMorphed] = useState(false);

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
        duration: 1,
        ease: [0.16, 1, 0.3, 1] as any,
      },
    },
  };

  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-white">
      {/* Background Layer */}
      <ParticleCanvas isMorphed={isMorphed} />

      {/* Main Content */}
      <motion.div
        variants={containerVars}
        initial="initial"
        animate="animate"
        className="relative z-10 flex flex-col items-center text-center px-6"
      >
        <motion.div variants={itemVars} className="mb-8">
          <span className="text-[10px] font-mono tracking-[0.5em] uppercase text-zinc-400">
            Strategic Commerce — Autonomous Scale
          </span>
        </motion.div>

        <motion.h1 
          variants={itemVars}
          className="text-black text-6xl md:text-8xl lg:text-9xl font-bold tracking-tight mb-8"
          style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}
        >
          COMMERCE <br />
          <span className="text-zinc-200">AGENTS.</span>
        </motion.h1>

        <motion.p
          variants={itemVars}
          className="max-w-xl text-zinc-500 text-lg md:text-xl font-light leading-relaxed mb-12"
        >
          We orchestrate systemic commerce for the next generation.
          The nexus of strategy and high-performance execution.
        </motion.p>

        <motion.div variants={itemVars}>
          <button 
            onClick={() => setIsMorphed(!isMorphed)}
            className="px-10 py-3 bg-black text-white font-medium text-sm tracking-widest uppercase rounded-full transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-black/10"
          >
            {isMorphed ? 'Get in touch' : 'Contact us'}
          </button>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          variants={itemVars}
          className="absolute bottom-12 flex flex-col items-center gap-4"
        >
          <div className="w-[1px] h-12 bg-zinc-100" />
          <span className="text-[9px] font-mono tracking-widest text-zinc-400 uppercase">
            Scroll to Explore
          </span>
        </motion.div>
      </motion.div>

      {/* Side Decorative Metadata */}
      <div className="absolute left-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-8 opacity-10 origin-left -rotate-90">
        <span className="text-[9px] font-mono tracking-[0.6em] uppercase text-black">
          Agent Registry // AC-942-B6
        </span>
      </div>
      <div className="absolute right-12 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-8 opacity-10 origin-right rotate-90">
        <span className="text-[9px] font-mono tracking-[0.6em] uppercase text-black">
          Ref. 40.7128° N, 74.0060° W
        </span>
      </div>
    </section>
  );
}
