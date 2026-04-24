'use client';

import React from 'react';
import { motion } from 'framer-motion';

const aboutData = [
  {
    title: "Brand Story",
    description: "Commerce Agents was born from a vision to blend high-end architectural precision with the dynamic pulse of modern commerce. We don't just build; we orchestrate digital and physical experiences that redefine global standards.",
    icon: "✦"
  },
  {
    title: "Our Mission",
    description: "To empower visionary brands through cutting-edge design and strategic orchestration. We navigate the complexities of the modern marketplace to deliver outcomes that are as functional as they are beautiful.",
    icon: "✧"
  }
];

export default function AboutSection() {
  return (
    <section id="about" className="relative min-h-screen w-full bg-[#050508] overflow-hidden py-24 md:py-32 lg:py-40 px-6 md:px-12 lg:px-24 scroll-mt-24">
      
      {/* BACKGROUND DECORATION */}
      <div className="absolute top-0 left-1/4 w-[50%] h-[50%] bg-violet-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[40%] h-[40%] bg-indigo-600/10 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="max-w-[1400px] mx-auto relative z-10">
        
        {/* SECTION HEADER */}
        <div className="mb-20 md:mb-32">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="inline-block text-white/40 text-[12px] font-bold tracking-[0.4em] uppercase mb-6"
          >
            Our Identity
          </motion.span>
          
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-white text-4xl md:text-6xl lg:text-7xl font-bold leading-tight max-w-4xl"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-white/40">us</span>
          </motion.h2>
        </div>

        {/* CONTENT GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
          {aboutData.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 + (index * 0.2) }}
              className="group relative p-10 md:p-14 rounded-[40px] border border-white/5 bg-white/[0.02] backdrop-blur-md overflow-hidden hover:bg-white/[0.04] transition-all duration-500"
            >
              {/* Card Decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/10 to-transparent blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10">
                <div className="text-3xl mb-8 text-white/80">{item.icon}</div>
                <h3 className="text-white text-2xl md:text-3xl font-bold mb-6 tracking-tight">
                  {item.title}
                </h3>
                <p className="text-white/50 text-lg leading-relaxed font-light max-w-md">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* BOTTOM CALL-TO-ACTION (SUBTLE) */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, delay: 1 }}
          className="mt-32 pt-16 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8"
        >
          <p className="text-white/30 text-sm tracking-widest uppercase">
            Driven by Vision. Defined by Precision.
          </p>
          <div className="flex gap-12">
            <div className="flex flex-col">
              <span className="text-white text-2xl font-bold">120+</span>
              <span className="text-white/30 text-[10px] uppercase tracking-widest mt-1 text-center">Projects</span>
            </div>
            <div className="flex flex-col">
              <span className="text-white text-2xl font-bold">15+</span>
              <span className="text-white/30 text-[10px] uppercase tracking-widest mt-1 text-center">Countries</span>
            </div>
            <div className="flex flex-col">
              <span className="text-white text-2xl font-bold">24/7</span>
              <span className="text-white/30 text-[10px] uppercase tracking-widest mt-1 text-center">Support</span>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
