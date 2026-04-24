'use client';
 
import React from 'react';
import { motion } from 'framer-motion';
import Navigation from './Navigation';
 
export default function SpaceHorizonHero() {
  return (
    <section className="relative h-[100dvh] w-full bg-black overflow-hidden font-sans select-none">
      
      {/* STEP 1: INITIAL BLANK SCREEN (0s - 0.5s) */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: "linear" }}
        className="absolute inset-0 z-[100] bg-black pointer-events-none"
      />

      {/* MAIN CONTENT AREA - BACKGROUND ONLY */}
      <div className="relative h-full w-full">
        
        {/* STEP 2: BACKGROUND VIDEO (Sync with LoadingScreen BARS_OPEN_DELAY) */}
        <div className="absolute inset-0 z-0 bg-black">
          <motion.video 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ 
              duration: 2.5, 
              delay: 8.0, 
              ease: "easeOut" 
            }}
            src="/video-7.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80 z-5" />
        </div>
      </div>

    </section>
  );
}
