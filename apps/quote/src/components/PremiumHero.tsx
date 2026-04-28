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
        delayChildren: 0.3,
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ease: [0.16, 1, 0.3, 1] as any,
      },
    },
  };

  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-black">
      {/* Background - Stable Geographic Matrix */}
      <LineMatrixCanvas isMorphed={isMorphed} />

      <motion.div
        variants={containerVars}
        initial="initial"
        animate="animate"
        className="relative z-10 flex flex-col items-center text-center px-6"
      >
        {/* Top Header - Spread out as seen in screenshot */}
        <motion.div variants={itemVars} className="mb-12">
          <span className="text-[10px] font-mono tracking-[1em] uppercase text-cyan-400 opacity-80">
            SYSTEMIC LOGISTICS
          </span>
        </motion.div>

        {/* Main Title - Large and Bold */}
        <motion.h1 
          variants={itemVars}
          className="text-white font-bold leading-none select-none tracking-tight mb-8"
          style={{ 
            fontFamily: "var(--font-dm-sans), sans-serif",
            fontSize: "clamp(60px, 12vw, 120px)" 
          }}
        >
          COMMERCE<br />AGENT.
        </motion.h1>

        {/* Subtext - Aligned with screenshot */}
        <motion.div variants={itemVars} className="max-w-xl space-y-2 mb-16 px-4">
          <p className="text-white opacity-80 text-lg font-light leading-relaxed">
            Orchestrating global commerce with architectural precision.
          </p>
          <p className="text-white opacity-60 text-sm font-light tracking-wide">
             The premium nexus for high-performance scale.
          </p>
        </motion.div>

        {/* Primary CTA - White Rounded Button */}
        <motion.div variants={itemVars}>
          <button 
            onClick={() => setIsMorphed(!isMorphed)}
            className="px-20 py-5 bg-white text-black font-bold text-[10px] tracking-[0.3em] uppercase rounded-full transition-all duration-700 hover:scale-105 active:scale-95 shadow-xl shadow-cyan-500/10"
          >
            {isMorphed ? 'CONTINUE EXPLORING' : 'CONTACT US'}
          </button>
        </motion.div>
      </motion.div>

      {/* Decorative vertical line at bottom center */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1px] h-20 bg-gradient-to-t from-cyan-400/40 to-transparent" />
    </section>
  );
}
