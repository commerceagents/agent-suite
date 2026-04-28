'use client';

import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import MercuryCanvas from './MercuryCanvas';

export default function HeroMercury() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      setMouse({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener('mousemove', handleMouse);
    return () => window.removeEventListener('mousemove', handleMouse);
  }, []);

  const containerVars = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 },
    },
  };

  const itemVars = {
    initial: { y: 20, opacity: 0 },
    animate: {
      y: 0,
      opacity: 1,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as any },
    },
  };

  const hudLabels = [
    { label: "Oversight", x: "-35%", y: "-20%", side: "left" },
    { label: "Defense", x: "35%", y: "-15%", side: "right" },
    { label: "Logistics", x: "-40%", y: "25%", side: "left" },
    { label: "Execution", x: "40%", y: "20%", side: "right" },
  ];

  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-black font-sans">
      {/* Background Engine */}
      <MercuryCanvas />

      {/* Top Navbar - Pill Style */}
      <motion.nav 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="absolute top-10 z-30 px-6 py-2 bg-white/5 border border-white/10 rounded-full backdrop-blur-md flex items-center gap-8 text-[11px] font-medium tracking-tight text-white/60"
      >
        <span className="text-white">Home</span>
        <span>Platform</span>
        <span>Assets</span>
        <span>Features</span>
        <span>Pricing</span>
        <div className="w-[1px] h-3 bg-white/10" />
        <span className="px-3 py-1 bg-white/10 rounded-full text-white">Contact us</span>
      </motion.nav>

      {/* Main Content */}
      <motion.div
        variants={containerVars}
        initial="initial"
        animate="animate"
        className="relative z-20 flex flex-col items-center text-center max-w-4xl px-8"
      >
        <motion.div 
          variants={itemVars}
          className="mb-6 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] text-white/50 tracking-widest uppercase"
        >
          Unlock Your Future Workflow
        </motion.div>

        <motion.h1 
          variants={itemVars}
          className="text-white text-6xl md:text-8xl font-bold tracking-tight mb-8 leading-[1.05]"
        >
          Building Systems <br /> for <span className="text-zinc-600">Pure Scale.</span>
        </motion.h1>

        <motion.p
          variants={itemVars}
          className="max-w-xl text-white/50 text-lg md:text-xl font-light mb-12"
        >
          Commerce Agents transforms your ideas into structured digital systems — 
          faster, smarter, and fully transparent technology layers.
        </motion.p>

        <motion.div variants={itemVars} className="flex gap-4">
          <button className="px-8 py-4 bg-white/5 text-white/80 border border-white/10 rounded-full text-sm font-medium hover:bg-white/10 transition-colors">
            Our Process
          </button>
          <button className="px-8 py-4 bg-white text-black rounded-full text-sm font-bold hover:bg-zinc-200 transition-colors">
            Start Project
          </button>
        </motion.div>
      </motion.div>

      {/* Floating HUD Elements */}
      {hudLabels.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, x: `calc(${item.x} + ${mouse.x * (i + 1) * 0.2}px)`, y: `calc(${item.y} + ${mouse.y * (i + 1) * 0.2}px)` }}
          transition={{ duration: 0.1 }}
          className="absolute z-10 hidden lg:flex items-center gap-4 pointer-events-none"
        >
          {item.side === "right" && <div className="w-12 h-[1px] bg-white/20" />}
          <div className="flex flex-col gap-1">
             <div className="w-2 h-2 rounded-full border border-white/30" />
             <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-white/30">
               {item.label}
             </span>
          </div>
          {item.side === "left" && <div className="w-12 h-[1px] bg-white/20" />}
        </motion.div>
      ))}

      {/* Partner Logo Bar - Bottom */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 0.4, y: 0 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute bottom-12 z-20 flex items-center gap-12 grayscale select-none"
      >
        <span className="text-sm font-bold tracking-tighter text-white">ORCHESTRA</span>
        <span className="text-sm font-bold tracking-tighter text-white">QUARTZ</span>
        <span className="text-sm font-bold tracking-tighter text-white">LOGIC</span>
        <span className="text-sm font-bold tracking-tighter text-white">MATRIX</span>
        <span className="text-sm font-bold tracking-tighter text-white">PRISM</span>
      </motion.div>
    </section>
  );
}
