'use client';
 
import React from 'react';
import { motion } from 'framer-motion';
import Navigation from './Navigation';
 
export default function SpaceHorizonHero() {
  return (
    <section className="relative h-[100dvh] w-full bg-black overflow-hidden font-sans select-none">
      
      {/* MAIN CONTENT AREA - MINIMALIST VOID */}
      <div className="relative h-full w-full">
        <div className="absolute inset-0 z-0 bg-black" />
      </div>

    </section>
  );
}
