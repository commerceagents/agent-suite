'use client';

import React from 'react';
import { motion } from 'framer-motion';

const testimonials = [
  {
    content: "Commerce Agents transformed our global distribution network with an AI orchestration that feels more like an architectural masterpiece than a piece of software.",
    author: "Alexander Wright",
    role: "CEO, Nexa Logistics",
    company: "London, UK",
    gridClass: "col-span-12 lg:col-span-8 h-[400px] lg:h-[500px]",
    gradient: "from-white/10 via-transparent to-transparent"
  },
  {
    content: "The level of technical precision and aesthetic form is unmatched. They build digital legacies.",
    author: "Sophia Moretti",
    role: "Design Director, Veloce Luxury",
    company: "Milan, Italy",
    gridClass: "col-span-12 lg:col-span-4 h-[400px] lg:h-[500px]",
    gradient: "from-indigo-500/10 via-transparent to-transparent"
  },
  {
    content: "Navigating the complexities of modern commerce required a visionary partner. The neural strategy provided by the team became our most valuable asset.",
    author: "David Chen",
    role: "COO, Prime Solutions",
    company: "Singapore",
    gridClass: "col-span-12 h-[350px] lg:h-[400px]",
    gradient: "from-purple-500/10 via-transparent to-transparent"
  }
];

export default function TestimonialSection() {
  return (
    <section 
      id="testimonial" 
      className="relative w-full bg-[#050508] py-24 md:py-32 lg:py-48 px-6 md:px-12 lg:px-24 overflow-hidden border-t border-white/5"
    >
      
      {/* ATMOSPHERIC DECORATION */}
      <div className="absolute top-1/4 left-0 w-[40%] h-[40%] bg-white/[0.01] blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-[40%] h-[40%] bg-white/[0.01] blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-[1400px] mx-auto relative z-10">
        
        {/* SECTION HEADER */}
        <div className="mb-16 md:mb-20">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            className="inline-block text-white/40 text-[10px] font-bold tracking-[0.6em] uppercase mb-4"
          >
            Trust Nexus
          </motion.span>
          <h2 
            className="text-5xl md:text-7xl font-bold leading-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-400 to-slate-700"
            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
          >
            Voice.
          </h2>
        </div>

        {/* ARCHITECTURAL MOSAIC GRID */}
        <div className="grid grid-cols-12 gap-6 md:gap-8">
          {testimonials.map((item, idx) => (
            <motion.div
              key={item.author}
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 1, delay: idx * 0.15, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -10, transition: { duration: 0.4 } }}
              className={`group relative overflow-hidden rounded-[40px] border border-white/5 bg-white/[0.02] backdrop-blur-3xl p-10 md:p-16 flex flex-col justify-between ${item.gridClass}`}
            >
              {/* Geometric Background Accents */}
              <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-20 group-hover:opacity-40 transition-opacity duration-700`} />
              <div className="absolute top-0 right-0 w-64 h-64 border-t border-r border-white/[0.03] rounded-tr-[40px] -mr-16 -mt-16 pointer-events-none" />
              
              <div className="relative z-10">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="opacity-10 mb-8 md:mb-12">
                  <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.75-2-2-2H4c-1.25 0-2 .75-2 2v3c0 1.25.75 2 2 2h3c0 4-2 5-2 5M13 21c3 0 7-1 7-8V5c0-1.25-.75-2-2-2h-4c-1.25 0-2 .75-2 2v3c0 1.25.75 2 2 2h3c0 4-2 5-2 5" />
                </svg>
                <p className="text-white text-xl md:text-2xl lg:text-3xl font-light leading-tight tracking-tight max-w-2xl">
                  {item.content}
                </p>
              </div>

              <div className="relative z-10 flex items-center gap-6 mt-12">
                <div className="h-[1px] w-12 bg-white/20 group-hover:w-20 transition-all duration-700" />
                <div>
                  <h4 className="text-white text-lg font-bold" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
                    {item.author}
                  </h4>
                  <p className="text-white/30 text-[10px] uppercase tracking-[0.4em] mt-2">
                    {item.role} — {item.company}
                  </p>
                </div>
              </div>

              {/* Unique Card Shimmer Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1500 ease-in-out pointer-events-none" />
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
