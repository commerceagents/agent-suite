'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section 
      id="testimonial" 
      className="relative w-full bg-[#050508] py-24 md:py-32 lg:py-48 px-6 md:px-12 lg:px-24 overflow-hidden border-t border-white/5"
    >
      
      {/* ATMOSPHERIC DECORATION */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[40%] h-[60%] bg-white/[0.01] blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-[1400px] mx-auto relative z-10">
        
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-32 items-start">
          
          {/* LEFT: SECTION IDENTITY */}
          <div className="w-full lg:w-1/3 lg:sticky lg:top-48">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false }}
              className="mb-8"
            >
              <span className="inline-block text-white/40 text-[10px] font-bold tracking-[0.6em] uppercase mb-4">Voice of the Network</span>
              <h2 
                className="text-5xl md:text-7xl font-bold leading-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-400 to-slate-700"
                style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
              >
                Testimonials.
              </h2>
            </motion.div>

            {/* SLIDER INDICATORS */}
            <div className="flex gap-4 mt-12">
              {testimonials.map((_, idx) => (
                <button 
                  key={idx}
                  onClick={() => setIndex(idx)}
                  className={`h-[2px] transition-all duration-700 ${idx === index ? 'w-12 bg-white' : 'w-6 bg-white/10'}`}
                />
              ))}
            </div>
          </div>

          {/* RIGHT: THE CONTENT STAGE */}
          <div className="w-full lg:w-2/3 min-h-[400px] flex items-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="w-full"
              >
                <div className="mb-12">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="opacity-20 mb-8">
                    <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.75-2-2-2H4c-1.25 0-2 .75-2 2v3c0 1.25.75 2 2 2h3c0 4-2 5-2 5M13 21c3 0 7-1 7-8V5c0-1.25-.75-2-2-2h-4c-1.25 0-2 .75-2 2v3c0 1.25.75 2 2 2h3c0 4-2 5-2 5" />
                  </svg>
                  <p className="text-white text-2xl md:text-4xl lg:text-5xl font-light leading-tight tracking-tight">
                    {testimonials[index].content}
                  </p>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="h-[1px] w-12 bg-white/20" />
                  <div>
                    <h4 className="text-white text-xl font-bold" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
                      {testimonials[index].author}
                    </h4>
                    <p className="text-white/40 text-[10px] uppercase tracking-[0.4em] mt-2">
                      {testimonials[index].role} — {testimonials[index].company}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  );
}
