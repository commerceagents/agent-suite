'use client';

import { motion } from 'framer-motion';
import MercuryCanvas from './MercuryCanvas';

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
    initial: { y: 40, opacity: 0 },
    animate: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 1.2,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-black">
      {/* 3D Mercury Layer */}
      <MercuryCanvas />

      {/* HUD Grid Overlay */}
      <div className="absolute inset-0 hud-grid opacity-10 pointer-events-none" />

      {/* Blueprint Corner Markers */}
      <div className="absolute top-12 left-12 flex flex-col gap-1">
        <span className="heading-sub">MEASURE</span>
        <div className="hud-crosshair opacity-30" />
      </div>
      <div className="absolute top-12 right-12 flex flex-col items-end gap-1">
        <span className="heading-sub">ANALYZE</span>
        <div className="hud-crosshair opacity-30" />
      </div>
      <div className="absolute bottom-12 left-12 flex flex-col gap-1">
        <div className="hud-crosshair opacity-30 mb-1" />
        <span className="heading-sub">IMPLEMENT</span>
      </div>
      <div className="absolute bottom-12 right-12 flex flex-col items-end gap-1 text-[10px] font-mono text-zinc-700">
        <span>01 / 01</span>
        <span className="tracking-widest uppercase">SECTION 01</span>
      </div>

      {/* Main Content */}
      <motion.div
        variants={containerVars}
        initial="initial"
        animate="animate"
        className="relative z-10 flex flex-col items-center text-center max-w-5xl px-6"
      >
        <motion.div variants={itemVars} className="mb-6">
          <span className="heading-sub tracking-[0.6em] text-white/40">
            Enquiry — Approval — Execution
          </span>
        </motion.div>

        <motion.h1 
          variants={itemVars}
          className="heading-wide text-5xl md:text-8xl lg:text-9xl mb-8"
        >
          Project <br />
          <span className="text-chrome">Simplified.</span>
        </motion.h1>

        <motion.p
          variants={itemVars}
          className="max-w-xl text-zinc-500 text-lg md:text-xl font-light leading-relaxed mb-12"
        >
          From the first enquiry to the final task execution. 
          Unmatched precision for the modern agency.
        </motion.p>

        <motion.div variants={itemVars} className="flex flex-col sm:flex-row gap-6">
          <button className="btn-mercury">
            Start Project Enquiry
          </button>
          <button className="btn-mercury-outline">
            View Live Dashboard
          </button>
        </motion.div>
      </motion.div>

      {/* Floating Coordinate Labels */}
      <div className="absolute left-8 top-1/2 -translate-y-1/2 hidden lg:block opacity-20 origin-left -rotate-90">
        <span className="text-[10px] font-mono tracking-[0.5em] uppercase text-zinc-500">
          Agent Quote // v0.1.0-mercury
        </span>
      </div>
    </section>
  );
}
