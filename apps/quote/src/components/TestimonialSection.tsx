'use client';

import React from 'react';
import { motion } from 'framer-motion';

const testimonials = [
  {
    id: "01",
    content: "Commerce Agents transformed our global distribution network with an AI orchestration that feels more like an architectural masterpiece than a piece of software.",
    author: "Alexander Wright",
    role: "CEO, Nexa Logistics",
    company: "London, UK",
    align: "left",
    glow: "bg-violet-600/10"
  },
  {
    id: "02",
    content: "The level of technical precision and aesthetic form they bring to digital brand identity is unmatched. They don't just build websites; they build digital legacies.",
    author: "Sophia Moretti",
    role: "Design Director, Veloce Luxury",
    company: "Milan, Italy",
    align: "right",
    glow: "bg-indigo-600/10"
  },
  {
    id: "03",
    content: "Navigating the complexities of modern commerce required a visionary partner. The neural strategy provided by the team became our most valuable asset.",
    author: "David Chen",
    role: "COO, Prime Solutions",
    company: "Singapore",
    align: "left",
    glow: "bg-purple-600/10"
  }
];

export default function TestimonialSection() {
  return (
    <section 
      id="testimonial" 
      className="relative w-full bg-[#050508] py-24 md:py-32 lg:py-48 overflow-hidden border-t border-white/5"
    >
      
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24 relative z-10">
        
        {/* SECTION HEADER */}
        <div className="mb-32 md:mb-48">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            className="inline-block text-white/40 text-[10px] font-bold tracking-[0.6em] uppercase mb-4"
          >
            Voice of the Network
          </motion.span>
          <h2 
            className="text-5xl md:text-7xl font-bold leading-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-400 to-slate-700"
            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
          >
            Testimonials.
          </h2>
        </div>

        {/* ALTERNATING EDITORIAL TRACK */}
        <div className="space-y-48 md:space-y-64">
          {testimonials.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className={`relative flex flex-col ${item.align === 'right' ? 'md:items-end' : 'md:items-start'}`}
            >
              {/* Massive Background Identifier */}
              <div className="absolute -top-24 -left-12 md:-top-32 md:-left-24 text-[15rem] md:text-[25rem] font-bold text-white/[0.02] select-none pointer-events-none z-0">
                {item.id}
              </div>

              {/* Atmospheric Glow behind card */}
              <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[120%] ${item.glow} blur-[120px] rounded-full pointer-events-none opacity-50`} />

              <div className={`relative z-10 w-full md:w-[80%] lg:w-[65%] p-10 md:p-16 rounded-[40px] border border-white/5 bg-white/[0.02] backdrop-blur-2xl group hover:bg-white/[0.04] hover:border-white/10 transition-all duration-700`}>
                
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="opacity-10 mb-8 md:mb-12 group-hover:opacity-30 transition-opacity">
                  <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.75-2-2-2H4c-1.25 0-2 .75-2 2v3c0 1.25.75 2 2 2h3c0 4-2 5-2 5M13 21c3 0 7-1 7-8V5c0-1.25-.75-2-2-2h-4c-1.25 0-2 .75-2 2v3c0 1.25.75 2 2 2h3c0 4-2 5-2 5" />
                </svg>

                <p className="text-white text-2xl md:text-4xl font-light leading-tight tracking-tight mb-12">
                  "{item.content}"
                </p>

                <div className="flex items-center gap-6">
                  <div className="h-[1px] w-12 bg-white/20 group-hover:w-24 transition-all duration-700" />
                  <div>
                    <h4 className="text-white text-xl font-bold" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
                      {item.author}
                    </h4>
                    <p className="text-white/40 text-[10px] uppercase tracking-[0.5em] mt-2">
                      {item.role} — {item.company}
                    </p>
                  </div>
                </div>

                {/* Subtle Scanline Effect on Hover */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.01] to-transparent h-[2px] -translate-y-full group-hover:animate-scanline pointer-events-none" />
              </div>
            </motion.div>
          ))}
        </div>

      </div>

      {/* Global CSS for the custom scanline animation */}
      <style jsx global>{`
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(1000%); }
        }
        .animate-scanline {
          animation: scanline 3s linear infinite;
        }
      `}</style>
    </section>
  );
}
