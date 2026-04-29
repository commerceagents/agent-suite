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
      className="relative w-full bg-[#050508] pt-0 pb-[12vh] px-[5vw] overflow-hidden"
    >
      <div className="w-full max-w-[1700px] mx-auto relative z-10">
        
        {/* SECTION HEADER */}
        <div className="mb-[12vh]">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            className="inline-block text-white/40 font-bold tracking-[0.6em] uppercase mb-[1vw]"
            style={{ fontSize: 'clamp(8px, 0.7vw, 12px)' }}
          >
            Trust Nexus
          </motion.span>
          <h2 
            className="font-bold leading-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-400 to-slate-700"
            style={{ 
              fontFamily: "var(--font-montserrat), sans-serif",
              fontSize: "clamp(24px, 5.5vw, 100px)"
            }}
          >
            Testimonial.
          </h2>
        </div>

        {/* GLOWING TESTIMONIAL GRID - Always 3 columns */}
        <div className="grid grid-cols-3 gap-[3vw] items-stretch">
          {testimonials.map((item, idx) => (
            <motion.div
              key={item.author}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.8, delay: idx * 0.15 }}
              whileHover={{ y: "-1vw" }}
              className="relative group p-[3vw] rounded-[4vw] border border-white/10 bg-white/[0.03] backdrop-blur-3xl transition-all duration-500 flex flex-col justify-between h-full overflow-hidden"
              style={{ minHeight: "30vw" }}
            >
              {/* STABLE INTERNAL GLOWS */}
              <div className={`absolute -bottom-[10vw] -right-[10vw] w-[20vw] h-[20vw] blur-[8vw] rounded-full ${
                idx === 0 ? 'bg-purple-600/10' : idx === 1 ? 'bg-indigo-600/10' : 'bg-blue-600/10'
              }`} />
              
              <div className="relative z-10">
                <svg width="2vw" height="2vw" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="opacity-10 mb-[2.5vw] group-hover:opacity-30 transition-opacity">
                  <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.75-2-2-2H4c-1.25 0-2 .75-2 2v3c0 1.25.75 2 2 2h3c0 4-2 5-2 5M13 21c3 0 7-1 7-8V5c0-1.25-.75-2-2-2h-4c-1.25 0-2 .75-2 2v3c0 1.25.75 2 2 2h3c0 4-2 5-2 5" />
                </svg>
                <p className="text-white font-light leading-relaxed mb-[3vw]" style={{ fontSize: "clamp(10px, 1.4vw, 24px)" }}>
                  &quot;{item.content}&quot;
                </p>
              </div>

              <div className="relative z-10 flex items-center gap-[1.5vw] mt-auto">
                <div className="h-[1px] w-[2vw] bg-white/20 group-hover:w-[4vw] transition-all duration-700" />
                <div>
                  <h4 className="text-white font-bold" style={{ fontSize: "clamp(9px, 1.1vw, 18px)", fontFamily: "var(--font-montserrat), sans-serif" }}>
                    {item.author}
                  </h4>
                  <p className="text-white/30 uppercase tracking-[0.4em] mt-[0.5vw]" style={{ fontSize: "clamp(6px, 0.6vw, 10px)" }}>
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
