'use client';

import React from 'react';
import { motion } from 'framer-motion';

const testimonials = [
  {
    quote: "The intersection of structural precision and digital innovation that Commerce Agents provides is truly unparalleled in the current market.",
    author: "Julian Thorne",
    role: "CEO, Nexus Global",
    company: "NEXUS",
  },
  {
    quote: "They don't just build websites; they architect digital ecosystems that breathe life into the brand's visionary core.",
    author: "Elena Rossi",
    role: "Creative Director, VANTAGE",
    company: "VANTAGE",
  },
  {
    quote: "Architectural minimalism meets cutting-edge AI. The result is a transformative experience for our global clientele.",
    author: "Marcus Vance",
    role: "Principal, AETHER Lab",
    company: "AETHER",
  },
];

export default function TestimonialSection() {
  return (
    <section 
      id="testimonial" 
      className="relative min-h-screen w-full bg-[#050508] py-24 md:py-32 lg:py-48 px-6 md:px-12 lg:px-24 scroll-mt-24 overflow-hidden"
    >
      
      {/* BACKGROUND ATMOSPHERE */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[60%] bg-white/[0.02] blur-[160px] rounded-full pointer-events-none" />
      
      <div className="max-w-[1400px] mx-auto relative z-10">
        
        {/* SECTION HEADER */}
        <div className="text-center mb-24 md:mb-32">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block text-white/40 text-[12px] font-bold tracking-[0.4em] uppercase mb-6"
          >
            Voice of Authority
          </motion.span>
          
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-white text-5xl md:text-7xl lg:text-8xl font-bold leading-tight"
          >
            Testimonial<span className="text-white/20">s</span>
          </motion.h2>
        </div>

        {/* TESTIMONIAL GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {testimonials.map((item, idx) => (
            <motion.div
              key={item.author}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: idx * 0.2 }}
              className="relative p-12 md:p-16 rounded-[40px] border border-white/5 bg-white/[0.02] backdrop-blur-md flex flex-col justify-between group hover:bg-white/[0.04] transition-all duration-500"
            >
              {/* Quote Mark Decoration */}
              <div className="text-white/10 text-8xl font-serif absolute top-8 left-8 pointer-events-none group-hover:text-white/20 transition-colors">“</div>
              
              <div className="relative z-10">
                <p className="text-white text-xl md:text-2xl leading-relaxed font-light mb-12">
                  {item.quote}
                </p>
              </div>

              <div className="relative z-10">
                <div className="h-[1px] w-12 bg-white/20 mb-8" />
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white text-lg font-bold mb-1">{item.author}</h3>
                    <p className="text-white/40 text-[10px] uppercase tracking-widest">{item.role}</p>
                  </div>
                  <div className="text-white/10 text-xl font-bold tracking-tighter group-hover:text-white/30 transition-colors">
                    {item.company}
                  </div>
                </div>
              </div>

              {/* Subtle Spotlight Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-[40px]" />
            </motion.div>
          ))}
        </div>

        {/* BOTTOM METRIC (REVEAL + UP) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-32 pt-16 border-t border-white/5 flex flex-col md:flex-row items-center justify-center gap-12 text-center"
        >
          <div>
            <p className="text-white text-4xl font-bold mb-2">98%</p>
            <p className="text-white/20 text-[10px] uppercase tracking-[0.3em]">Client Satisfaction</p>
          </div>
          <div className="h-12 w-[1px] bg-white/10 hidden md:block" />
          <div>
            <p className="text-white text-4xl font-bold mb-2">150+</p>
            <p className="text-white/20 text-[10px] uppercase tracking-[0.3em]">Global Deployments</p>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
