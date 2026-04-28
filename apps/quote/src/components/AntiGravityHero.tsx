'use client';

import React from 'react';
import { motion } from 'framer-motion';
import ParticleMatrixCanvas from './ParticleMatrixCanvas';

export default function AntiGravityHero() {
  const containerVars = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVars = {
    initial: { y: 30, opacity: 0 },
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
    <section className="relative min-h-screen w-full flex items-center justify-start overflow-hidden px-8 md:px-24">
      {/* Background Layer - Anti-Gravity Particles */}
      <ParticleMatrixCanvas />

      {/* Main Content - Left Aligned */}
      <motion.div
        variants={containerVars}
        initial="initial"
        animate="animate"
        className="relative z-10 max-w-4xl"
      >
        <motion.h1 
          variants={itemVars}
          className="text-white text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight mb-8 leading-[0.95]"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Build. <br />
          Automate. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-500">
            Scale.
          </span>
        </motion.h1>

        <motion.p
          variants={itemVars}
          className="max-w-xl text-white opacity-70 text-xl md:text-2xl font-light leading-relaxed mb-12"
        >
          Commerce Agents transforms your ideas into structured digital systems — 
          faster, smarter, and fully transparent.
        </motion.p>

        <motion.div 
          variants={itemVars}
          className="flex flex-wrap gap-6"
        >
          {/* Primary CTA - Electric Blue */}
          <button className="px-10 py-5 bg-blue-600 text-white font-semibold rounded-xl transition-all duration-300 hover:bg-blue-500 hover:scale-105 active:scale-95 shadow-2xl shadow-blue-500/20">
            Start Project
          </button>

          {/* Secondary CTA - Glassmorphism */}
          <button className="px-10 py-5 bg-white/5 border border-white/10 text-white font-medium rounded-xl transition-all duration-300 hover:bg-white/10 hover:border-white/20 backdrop-blur-md">
            View Process
          </button>
        </motion.div>
      </motion.div>

      {/* Subtle bottom gradient glow */}
      <div className="absolute bottom-[-10%] left-1/2 -translate-x-1/2 w-[80%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />
    </section>
  );
}
