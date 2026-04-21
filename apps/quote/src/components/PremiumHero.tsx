'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import LineMatrixCanvas from './LineMatrixCanvas';

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
      {/* Dynamic Background Layer - Split Line Matrix */}
      <LineMatrixCanvas isMorphed={isMorphed} />

      {/* Main Content */}
      <motion.div
        variants={containerVars}
        initial="initial"
        animate="animate"
        className="relative z-10 flex flex-col items-center text-center px-6"
      >
        <motion.div variants={itemVars} className="mb-6">
          <span className="text-[10px] font-mono tracking-[0.8em] uppercase text-zinc-300">
            Systemic Logistics
          </span>
        </motion.div>

        <motion.h1 
          variants={itemVars}
          className="text-black text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter mb-10"
          style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}
        >
          COMMERCE <br />
          <span className="text-zinc-100">AGENTS.</span>
        </motion.h1>

        <motion.p
          variants={itemVars}
          className="max-w-xl text-zinc-400 text-lg font-light leading-relaxed mb-12"
        >
          Orchestrating global commerce with architectural precision.
          The premium nexus for high-performance scale.
        </motion.p>

        <motion.div variants={itemVars}>
          <button 
            onClick={() => setIsMorphed(!isMorphed)}
            className="px-14 py-4 bg-black text-white font-medium text-[10px] tracking-[0.3em] uppercase rounded-full transition-all duration-500 hover:bg-zinc-900 active:scale-95 shadow-2xl shadow-black/10"
          >
            {isMorphed ? 'Connection Active' : 'Contact us'}
          </button>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          variants={itemVars}
          className="absolute bottom-12 flex flex-col items-center"
        >
          <div className="w-[1px] h-12 bg-zinc-100" />
        </motion.div>
      </motion.div>
    </section>
  );
}
