'use client';

import React from 'react';
import { motion } from 'framer-motion';

const team = [
  {
    name: 'Elena Vance',
    role: 'Chief Architect',
    bio: 'Pioneering the intersection of structural form and digital identity.',
    image: '/leadership_portrait_minimalist_1_1777020952682.png',
  },
  {
    name: 'Marcus Thorne',
    role: 'Technical Director',
    bio: 'Orchestrating the future of commerce through advanced AI systems.',
    image: '/leadership_portrait_minimalist_2_1777020977347.png',
  },
  {
    name: 'Sarah Chen',
    role: 'Design Principal',
    bio: 'Crafting premium brand experiences with high-end minimalism.',
    image: '/leadership_portrait_minimalist_1_1777020952682.png', // Reusing for consistency in this demo
  },
];

export default function PeopleSection() {
  return (
    <section 
      id="people" 
      className="relative min-h-screen w-full bg-[#050508] py-24 md:py-32 lg:py-48 px-6 md:px-12 lg:px-24 scroll-mt-24 overflow-hidden"
    >
      
      {/* BACKGROUND ACCENTS */}
      <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-white/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-[1400px] mx-auto relative z-10">
        
        {/* SECTION HEADER */}
        <div className="mb-24 md:mb-32">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block text-white/40 text-[12px] font-bold tracking-[0.4em] uppercase mb-6"
          >
            Our Visionaries
          </motion.span>
          
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-white text-5xl md:text-7xl lg:text-8xl font-bold leading-tight"
          >
            People<span className="text-white/20">.</span>
          </motion.h2>
        </div>

        {/* TEAM GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {team.map((member, idx) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: idx * 0.15 }}
              className={`relative group ${idx % 2 === 1 ? 'md:translate-y-12' : ''}`}
            >
              {/* Portrait Image Container */}
              <div className="relative aspect-[4/5] rounded-[40px] overflow-hidden border border-white/5 bg-white/[0.02]">
                <img 
                  src={member.image} 
                  alt={member.name}
                  className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-1000 scale-105 group-hover:scale-100"
                />
                
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                
                {/* Floating Bio Card (on hover) */}
                <div className="absolute bottom-6 left-6 right-6 p-6 rounded-[24px] bg-white/[0.05] backdrop-blur-xl border border-white/10 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                  <h3 className="text-white text-xl font-bold mb-1">{member.name}</h3>
                  <p className="text-white/40 text-[10px] uppercase tracking-widest mb-3">{member.role}</p>
                  <p className="text-white/60 text-xs font-light leading-relaxed italic">
                    "{member.bio}"
                  </p>
                </div>
              </div>

              {/* External Metadata (Visible by default) */}
              <div className="mt-8 px-4">
                <div className="flex items-center gap-4 mb-2">
                  <div className="h-[1px] w-8 bg-white/20" />
                  <span className="text-white/40 text-[10px] uppercase tracking-widest">{member.role}</span>
                </div>
                <h4 className="text-white text-2xl font-bold">{member.name}</h4>
              </div>
            </motion.div>
          ))}
        </div>

        {/* BOTTOM PHILOSOPHY (REVEAL + UP) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-48 pt-16 border-t border-white/5 text-center"
        >
          <p className="text-white/20 text-xs tracking-[0.6em] uppercase mb-8">Guided by Human Intelligence</p>
          <p className="text-white/60 text-2xl md:text-3xl font-light italic max-w-3xl mx-auto leading-relaxed">
            "Innovation is not built by machines, but by the visionary architects who command them."
          </p>
        </motion.div>

      </div>
    </section>
  );
}
