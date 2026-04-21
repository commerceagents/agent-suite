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
        staggerChildren: 0.2,
        delayChildren: 0.6,
      },
    },
  };

  const itemVars = {
    initial: { y: 30, opacity: 0 },
    animate: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 1.5,
        ease: [0.16, 1, 0.3, 1] as any,
      },
    },
  };

  return (
    <section className="relative h-screen w-full flex flex-col bg-black overflow-hidden font-sans select-none">
      {/* Background Cinematic Engine - Pure Visual Mode */}
      <SpaceHorizonCanvas />

      {/* Textual elements removed as per request */}
    </section>
  );
}
