'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
        ease: [0.16, 1, 0.3, 1] as any,
      },
    },
  };

  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-black">
      {/* Background Layer - Precision Line Matrix */}
      <LineMatrixCanvas isMorphed={isMorphed} />

      {/* Main Content */}
      <motion.div
        variants={containerVars}
        initial="initial"
        animate="animate"
        className="relative z-10 flex flex-col items-center text-center px-6"
      >
        <motion.div variants={itemVars} className="mb-8">
          <span className="text-[10px] font-mono tracking-[0.8em] uppercase text-zinc-600">
            Systemic Logistics
          </span>
        </motion.div>

        <motion.h1 
          variants={itemVars}
          className="text-white text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter mb-12"
          style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}
        >
          COMMERCE <br />
          <span className="text-zinc-800">AGENTS.</span>
        </motion.h1>

        <motion.p
          variants={itemVars}
          className="max-w-xl text-zinc-500 text-lg font-light leading-relaxed mb-14"
        >
          Orchestrating global commerce with architectural precision.
          The premium nexus for high-performance scale.
        </motion.p>

        <motion.div variants={itemVars}>
          <button 
            onClick={() => setIsMorphed(!isMorphed)}
            className="px-16 py-5 bg-white text-black font-medium text-[10px] tracking-[0.4em] uppercase rounded-full transition-all duration-700 hover:bg-zinc-200 active:scale-95 shadow-2xl shadow-white/5"
          >
            {isMorphed ? 'Network Connected' : 'Contact us'}
          </button>
        </motion.div>

        {/* Minimal Scroll Indicator */}
        <motion.div 
          variants={itemVars}
          className="absolute bottom-12 flex flex-col items-center"
        >
          <div className="w-[1px] h-16 bg-zinc-100" />
        </motion.div>
      </motion.div>
    </section>
  );
}
