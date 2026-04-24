'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function ContactSection() {
  return (
    <section id="contact" className="relative w-full bg-[#050508] py-24 md:py-32 lg:py-48 px-6 md:px-12 lg:px-24 overflow-hidden border-t border-white/5">
      
      {/* ATMOSPHERIC GLOWS */}
      <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-white/[0.01] blur-[140px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false }}
        transition={{ duration: 1 }}
        className="max-w-[1400px] mx-auto relative z-10"
      >
        <div className="flex flex-col lg:flex-row gap-24 lg:gap-32">
          
          {/* LEFT: CONTENT */}
          <div className="w-full lg:w-1/2">
            <div className="mb-16 md:mb-20">
              <span className="inline-block text-white/40 text-[10px] font-bold tracking-[0.6em] uppercase mb-4">Connect</span>
              <h2 
                className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-400 to-slate-700"
                style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
              >
                Contact.
              </h2>
            </div>
            <p className="text-white/40 text-xl font-light leading-relaxed max-w-xl mb-16">
              Initiate a strategic partnership. Our team of visionary architects is ready to command your next technical horizon.
            </p>

            <div className="space-y-8">
              <div className="flex items-center gap-6 group cursor-pointer">
                <div className="w-12 h-12 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-white/40 group-hover:text-white group-hover:bg-white/[0.1] transition-all duration-500">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                </div>
                <div>
                  <p className="text-white/20 text-[10px] uppercase tracking-widest mb-1">Direct Line</p>
                  <p className="text-white text-lg">+1 (555) 000-AGENT</p>
                </div>
              </div>
              <div className="flex items-center gap-6 group cursor-pointer">
                <div className="w-12 h-12 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-white/40 group-hover:text-white group-hover:bg-white/[0.1] transition-all duration-500">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
                </div>
                <div>
                  <p className="text-white/20 text-[10px] uppercase tracking-widest mb-1">Satellite Transmission</p>
                  <p className="text-white text-lg">hello@commerceagents.ai</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: FORM */}
          <div className="w-full lg:w-1/2">
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-white/20 text-[10px] uppercase tracking-[0.3em] ml-2">Identity</label>
                  <input 
                    type="text" 
                    placeholder="Full Name"
                    className="w-full bg-white/[0.02] border border-white/5 rounded-2xl h-16 px-6 text-white text-sm focus:outline-none focus:border-white/20 focus:bg-white/[0.05] transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-white/20 text-[10px] uppercase tracking-[0.3em] ml-2">Protocol</label>
                  <input 
                    type="email" 
                    placeholder="Email Address"
                    className="w-full bg-white/[0.02] border border-white/5 rounded-2xl h-16 px-6 text-white text-sm focus:outline-none focus:border-white/20 focus:bg-white/[0.05] transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-white/20 text-[10px] uppercase tracking-[0.3em] ml-2">Objective</label>
                <select className="w-full bg-white/[0.02] border border-white/5 rounded-2xl h-16 px-6 text-white/40 text-sm focus:outline-none focus:border-white/20 focus:bg-white/[0.05] transition-all appearance-none">
                  <option>Architecture Project</option>
                  <option>AI Orchestration</option>
                  <option>Strategic Consulting</option>
                  <option>Other Transmission</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-white/20 text-[10px] uppercase tracking-[0.3em] ml-2">Narrative</label>
                <textarea 
                  placeholder="How can we command your horizon?"
                  className="w-full bg-white/[0.02] border border-white/5 rounded-[32px] h-48 p-6 text-white text-sm focus:outline-none focus:border-white/20 focus:bg-white/[0.05] transition-all resize-none"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: '#FFFFFF', color: '#000000', boxShadow: "0 0 30px rgba(255,255,255,0.3)" }}
                whileTap={{ scale: 0.98 }}
                suppressHydrationWarning
                className="w-full h-16 rounded-2xl border border-white/20 flex items-center justify-center text-white text-sm font-bold uppercase tracking-[0.4em] transition-all duration-500 overflow-hidden relative group mt-8"
              >
                <span className="relative z-10">Initiate Transmission</span>
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              </motion.button>
            </form>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
