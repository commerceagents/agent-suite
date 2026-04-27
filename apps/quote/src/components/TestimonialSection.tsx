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
            className="text-4xl md:text-6xl font-bold leading-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-400 to-slate-700"
            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
          >
            Testimonial.
          </h2>
        </div>

        {/* GLOWING TESTIMONIAL GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 items-stretch">
          {testimonials.map((item, idx) => (
            <motion.div
              key={item.author}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.8, delay: idx * 0.15 }}
              whileHover={{ y: -10 }}
              className="relative group p-10 md:p-12 rounded-[40px] border border-white/10 bg-white/[0.03] backdrop-blur-3xl transition-all duration-500 flex flex-col justify-between min-h-[420px] h-full overflow-hidden"
            >
              {/* STABLE INTERNAL GLOWS */}
              <div className={`absolute -bottom-20 -right-20 w-64 h-64 blur-[90px] rounded-full ${
                idx === 0 ? 'bg-purple-600/10' : idx === 1 ? 'bg-indigo-600/10' : 'bg-blue-600/10'
              }`} />
              <div className={`absolute -top-10 -left-10 w-32 h-32 blur-[60px] rounded-full opacity-40 ${
                idx === 0 ? 'bg-indigo-500/5' : idx === 1 ? 'bg-blue-500/5' : 'bg-cyan-500/5'
              }`} />

              <div className="relative z-10">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="opacity-10 mb-10 group-hover:opacity-30 transition-opacity">
                  <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.75-2-2-2H4c-1.25 0-2 .75-2 2v3c0 1.25.75 2 2 2h3c0 4-2 5-2 5M13 21c3 0 7-1 7-8V5c0-1.25-.75-2-2-2h-4c-1.25 0-2 .75-2 2v3c0 1.25.75 2 2 2h3c0 4-2 5-2 5" />
                </svg>
                <p className="text-white text-lg md:text-xl font-light leading-relaxed mb-12">
                  "{item.content}"
                </p>
              </div>

              <div className="relative z-10 flex items-center gap-6 mt-auto">
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
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
