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
        ease: [0.16, 1, 0.3, 1] as any,
      },
    },
  };

  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-black hero">
      <div className="absolute inset-0 z-0 flex items-center justify-center opacity-85 scale-[1.3]">
        <LineMatrixCanvas isMorphed={isMorphed} />
      </div>

      <motion.div
        variants={containerVars}
        initial="initial"
        animate="animate"
        className="relative z-10 flex flex-col items-center text-center px-6 hero-content"
      >
        <motion.h1 
          variants={itemVars}
          className="text-white font-bold mb-0 select-none uppercase"
          style={{ 
            fontFamily: "Arial, Helvetica, sans-serif",
            fontSize: "120px",
            lineHeight: "0.9",
            letterSpacing: "3px"
          }}
        >
          COMMERCE<br />AGENT.
        </motion.h1>

        <motion.p
          variants={itemVars}
          className="max-w-2xl text-white opacity-80 mb-10"
          style={{
            fontSize: "18px",
            marginTop: "20px"
          }}
        >
          Orchestrating global commerce with architectural precision.
        </motion.p>

        <motion.div variants={itemVars}>
          <button 
            onClick={() => setIsMorphed(!isMorphed)}
            className="bg-white text-black font-bold transition-all duration-700 hover:bg-cyan-400 hover:text-black active:scale-95"
            style={{
              marginTop: "35px",
              padding: "18px 60px",
              borderRadius: "40px",
              fontSize: "14px",
              letterSpacing: "2px"
            }}
          >
            {isMorphed ? 'CONNECTION ACTIVE' : 'CONTACT US'}
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
}
