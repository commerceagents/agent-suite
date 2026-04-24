'use client';

import React from 'react';
import { motion } from 'framer-motion';

const testimonials = [
  {
    content: "Commerce Agents transformed our global distribution network with an AI orchestration that feels more like an architectural masterpiece than a piece of software.",
    author: "Alexander Wright",
    role: "CEO, Nexa Logistics",
    company: "London, UK"
  },
  {
    content: "The level of technical precision and aesthetic form they bring to digital brand identity is unmatched. They don't just build websites; they build digital legacies.",
    author: "Sophia Moretti",
    role: "Design Director, Veloce Luxury",
    company: "Milan, Italy"
  },
  {
    content: "Navigating the complexities of modern commerce required a visionary partner. The neural strategy provided by the team became our most valuable asset.",
    author: "David Chen",
    role: "COO, Prime Solutions",
    company: "Singapore"
  }
];

export default function TestimonialSection() {
  return (
    <section 
      id="testimonial" 
      className="relative w-full bg-[#050508] py-8 md:py-12 lg:py-16 px-6 md:px-12 lg:px-24 overflow-hidden border-t border-white/5"
    >
      
      {/* ATMOSPHERIC DECORATION */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-white/[0.01] blur-[140px] rounded-full pointer-events-none" />

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
            Voices.
          </h2>
        </div>

        {/* LINEAR GALLERY TRACK */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((item, idx) => (
            <motion.div
              key={item.author}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.8, delay: idx * 0.15 }}
              whileHover={{ y: -10 }}
              className="group p-10 md:p-12 rounded-[40px] border border-white/5 bg-white/[0.02] backdrop-blur-2xl hover:bg-white/[0.04] hover:border-white/10 transition-all duration-500 flex flex-col justify-between"
            >
              <div>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="opacity-10 mb-10 group-hover:opacity-30 transition-opacity">
                  <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.75-2-2-2H4c-1.25 0-2 .75-2 2v3c0 1.25.75 2 2 2h3c0 4-2 5-2 5M13 21c3 0 7-1 7-8V5c0-1.25-.75-2-2-2h-4c-1.25 0-2 .75-2 2v3c0 1.25.75 2 2 2h3c0 4-2 5-2 5" />
                </svg>
                <p className="text-white text-lg md:text-xl font-light leading-relaxed mb-12">
                  "{item.content}"
                </p>
              </div>

              <div className="flex items-center gap-6">
                <div className="h-[1px] w-8 bg-white/20 group-hover:w-16 transition-all duration-700" />
                <div>
                  <h4 className="text-white text-base font-bold" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
                    {item.author}
                  </h4>
                  <p className="text-white/30 text-[9px] uppercase tracking-[0.4em] mt-2">
                    {item.role}
                  </p>
                </div>
              </div>

              {/* Internal Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
