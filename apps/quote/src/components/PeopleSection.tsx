'use client';

import React from 'react';
import { motion } from 'framer-motion';

const team = [
  {
    name: 'Elena Vance',
    role: 'Chief Architect',
    bio: 'Pioneering the intersection of structural form and digital identity.',
    image: '/people-1.png',
  },
  {
    name: 'Marcus Thorne',
    role: 'Technical Director',
    bio: 'Orchestrating the future of commerce through advanced AI systems.',
    image: '/people-2.png',
  },
  {
    name: 'Sarah Chen',
    role: 'Design Principal',
    bio: 'Crafting premium brand experiences with high-end minimalism.',
    image: '/people-3.png',
  },
  {
    name: 'Julian Voss',
    role: 'Creative Lead',
    bio: 'Translating complex structural goals into iconic brand identities.',
    image: '/people-4.png',
  },
];

export default function PeopleSection() {
  return (
    <section 
      id="people" 
      className="relative w-full bg-[#050508] py-8 md:py-12 lg:py-16 px-6 md:px-12 lg:px-24 scroll-mt-24 overflow-hidden"
    >
      
      <div className="max-w-[1400px] mx-auto relative z-10">
        
        {/* SECTION HEADER */}
        <div className="mb-16 md:mb-20">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            className="inline-block text-white/40 text-[12px] font-bold tracking-[0.4em] uppercase mb-4"
          >
            Our Visionaries
          </motion.span>
          
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-400 to-slate-700"
          >
            People.
          </motion.h2>
        </div>

        {/* TEAM GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {team.map((member, idx) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.8, delay: idx * 0.1 }}
              whileHover={{ y: -10 }}
              className="relative group cursor-pointer"
            >
              {/* Portrait Image Container with Soft Zoom */}
              <div className="relative aspect-[4/5] rounded-[40px] overflow-hidden border border-white/5 bg-white/[0.02] backdrop-blur-md mb-8">
                <motion.img 
                  initial={{ scale: 0.95 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: false }}
                  transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                  src={member.image} 
                  alt={member.name}
                  className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000"
                />
                
                {/* Social Connect (Fade In on Hover) */}
                <div className="absolute top-6 right-6 flex flex-col gap-3 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-500">
                  <motion.div 
                    whileHover={{ 
                      scale: 1.1, 
                      backgroundColor: '#FFFFFF', 
                      color: '#000000', 
                      boxShadow: "0 0 15px rgba(255,255,255,0.4)" 
                    }}
                    whileTap={{ scale: 0.9 }}
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                    className="w-10 h-10 rounded-full backdrop-blur-xl flex items-center justify-center text-white/40 border border-white/10 transition-all duration-500"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                  </motion.div>
                </div>

                {/* Internal Designation Overlay */}
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-black/40 backdrop-blur-md border border-white/5 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                  <p className="text-white/60 text-[10px] font-light leading-relaxed">"{member.bio}"</p>
                </div>
              </div>

              {/* External Identity Layer */}
              <div className="px-4">
                <h4 className="text-white text-2xl font-bold mb-1" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
                  {member.name}
                </h4>
                <p className="text-white/30 text-[10px] uppercase tracking-[0.4em]">
                  {member.role}
                </p>
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
          className="mt-24 pt-16 border-t border-white/5 text-center"
        >
          <p className="text-white/20 text-xs tracking-[0.6em] uppercase mb-8">Guided by Human Intelligence</p>
          <p className="text-white/60 text-2xl md:text-3xl font-light max-w-3xl mx-auto leading-relaxed">
            "Innovation is not built by machines, but by the visionary architects who command them."
          </p>
        </motion.div>

      </div>
    </section>
  );
}
