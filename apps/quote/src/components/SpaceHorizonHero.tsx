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
        staggerChildren: 0.15,
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
        duration: 1.4,
        ease: [0.19, 1, 0.22, 1] as any,
      },
    },
  };

  return (
    <section className="relative min-h-screen w-full flex flex-col bg-black overflow-hidden font-sans select-none">
      {/* Background Engine - Strict Vis Rules */}
      <SpaceHorizonCanvas />

      {/* Top Navigation Bar - Ultra Minimal */}
      <nav className="relative z-30 w-full flex items-center justify-between px-12 py-12">
        <div className="flex-1">
          <span className="text-sm font-bold tracking-[0.5em] text-white uppercase">
            Commerce Agents
          </span>
        </div>
        
        <div className="hidden md:block">
          <span className="text-[10px] tracking-[0.8em] text-white/30 uppercase hover:text-white transition-colors cursor-pointer">
            Our Cases
          </span>
        </div>

        <div className="flex-1 flex justify-end items-center gap-12">
          <span className="text-[10px] font-bold tracking-[0.4em] text-white/50 uppercase cursor-pointer hover:text-white transition-colors">
            Menu +
          </span>
        </div>
      </nav>

      {/* Main Content Area - Removed */}

      {/* No cards, no borders, no extra UI clutter as requested */}
    </section>
  );
}
