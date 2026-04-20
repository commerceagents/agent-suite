'use client';

import { motion } from 'framer-motion';
import MercuryCanvas from './MercuryCanvas';
import Header from './Header';

export default function HeroMercury() {
  const containerVars = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.5,
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
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#050505]">
      {/* 3D Mercury Canvas Layer */}
      <MercuryCanvas />

      {/* Discovery Layer: Hidden/Blurry message for the lens to decode */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none z-0">
        <div className="discovery-scramble text-white font-mono text-[8vw] md:text-[6vw] tracking-tighter mix-blend-screen leading-none">
          STRATEGIC COMMERCE ORCHESTRATION
        </div>
      </div>

      {/* Background HUD Grid */}
      <div className="absolute inset-0 hud-grid opacity-10 pointer-events-none" />

      {/* Technical Corner Metadata (Fills the "Empty Space") */}
      <div className="absolute top-10 left-10 flex flex-col gap-1 items-start">
        <span className="blueprint-marker opacity-40">SYSTEM: ACTIVE</span>
        <div className="w-12 h-[1px] bg-white/20" />
      </div>
      <div className="absolute top-10 right-10 flex flex-col gap-1 items-end">
        <span className="blueprint-marker opacity-40">AGENT_ID: CX_001</span>
        <div className="w-12 h-[1px] bg-white/20" />
      </div>
      <div className="absolute bottom-10 left-10 flex flex-col gap-1 items-start">
        <div className="w-12 h-[1px] bg-white/20" />
        <span className="blueprint-marker opacity-40 text-[8px]">COORDS: 40.7128° N, 74.0060° W</span>
      </div>
      <div className="absolute bottom-10 right-10 flex flex-col gap-1 items-end">
        <div className="w-12 h-[1px] bg-white/20" />
        <span className="blueprint-marker opacity-40">VERSION: 0.1.0-MERCURY</span>
      </div>

      {/* Main Brand Content */}
      <motion.div
        variants={containerVars}
        initial="initial"
        animate="animate"
        className="relative z-10 flex flex-col items-center text-center max-w-5xl px-6"
      >
        <motion.div variants={itemVars} className="mb-4">
          <span className="blueprint-marker tracking-[0.8em] text-white/30">
            Strategic — Precise — Autonomous
          </span>
        </motion.div>

        <motion.h1 
          variants={itemVars}
          className="chrome-text text-5xl md:text-8xl lg:text-9xl mb-2 font-display uppercase tracking-tight"
        >
          Commerce <br />
          <span className="opacity-80">Agents.</span>
        </motion.h1>
      </motion.div>

      {/* Capsule Header Navigation */}
      <Header />
    </section>
  );
}
