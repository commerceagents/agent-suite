'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function ContactSection() {
  return (
    <section 
      id="contact" 
      className="relative min-h-screen w-full bg-[#050508] py-24 md:py-32 lg:py-48 px-6 md:px-12 lg:px-24 scroll-mt-24 overflow-hidden"
    >
      
      {/* ATMOSPHERIC GLOWS */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[40%] h-[60%] bg-white/[0.02] blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[30%] h-[40%] bg-white/[0.03] blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-[1400px] mx-auto relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* ── LEFT: ARCHITECTURAL DATA NODES ── */}
          <div className="max-w-xl">
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-block text-white/50 text-[12px] font-bold tracking-[0.5em] uppercase mb-8"
            >
              Terminal Coordination
            </motion.span>
            
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.2 }}
              className="text-6xl md:text-8xl font-bold leading-[1] mb-12 tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-400 to-slate-700"
            >
              Get in <br />
              Touch
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-white/60 text-xl font-light leading-relaxed mb-16"
            >
              Ready to transform your commerce operations? Let's discuss how our agents can work for you.
            </motion.p>

            {/* CONTACT NODES */}
            <div className="space-y-10">
              {[
                { label: 'Phone', value: '+91 99412 92729', icon: 'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z' },
                { label: 'Email', value: 'hello.commerceagents@gmail.com', icon: 'm22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7' },
                { label: 'Location', value: 'Anna Nagar, Chennai, India', icon: 'M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z' },
              ].map((node, idx) => (
                <motion.div
                  key={node.label}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.6 + (idx * 0.1) }}
                  className="group flex items-center gap-6"
                >
                  <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/[0.05] border border-white/10 group-hover:bg-white/[0.08] transition-all">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-60 group-hover:opacity-100 transition-opacity">
                      {node.label === 'Email' ? <><rect width="20" height="16" x="2" y="4" rx="2"/><path d={node.icon}/></> : <path d={node.icon}/>}
                      {node.label === 'Location' && <circle cx="12" cy="10" r="3"/>}
                    </svg>
                  </div>
                  <div>
                    <p className="text-white/40 text-[10px] uppercase tracking-[0.3em] mb-1">{node.label}</p>
                    <p className="text-white text-lg font-medium">{node.value}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* ── RIGHT: THE ACTIVE CONSOLE ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="p-10 md:p-16 rounded-[48px] bg-white/[0.03] border border-white/10 backdrop-blur-3xl shadow-2xl relative"
          >
            {/* Console Markers */}
            <div className="absolute top-8 left-8 flex gap-2">
              <div className="w-2 h-2 rounded-full bg-white/30" />
              <div className="w-2 h-2 rounded-full bg-white/10" />
            </div>
            
            <form className="space-y-12">
              {[
                { id: 'name', label: 'Identity', placeholder: 'John Doe' },
                { id: 'email', label: 'Node Address', placeholder: 'john@company.com' },
              ].map((field) => (
                <div key={field.id} className="relative group">
                  <label htmlFor={field.id} className="block text-white/50 text-[10px] uppercase tracking-[0.3em] mb-4 group-focus-within:text-white transition-colors">
                    {field.label}
                  </label>
                  <div className="relative">
                    <input
                      type={field.id === 'email' ? 'email' : 'text'}
                      id={field.id}
                      placeholder={field.placeholder}
                      className="w-full bg-white/[0.02] border-none rounded-xl text-white text-xl font-light placeholder:text-white/40 focus:outline-none px-4 py-4 transition-all focus:bg-white/[0.05]"
                    />
                    <div className="absolute bottom-0 left-4 right-4 h-[1px] bg-white/10 group-focus-within:bg-white group-focus-within:h-[2px] transition-all duration-500" />
                  </div>
                </div>
              ))}

              <div className="relative group">
                <label htmlFor="message" className="block text-white/50 text-[10px] uppercase tracking-[0.3em] mb-4 group-focus-within:text-white transition-colors">
                  Communication
                </label>
                <div className="relative">
                  <textarea
                    id="message"
                    rows={4}
                    placeholder="How can we help you?"
                    className="w-full bg-white/[0.02] border-none rounded-xl text-white text-xl font-light placeholder:text-white/40 focus:outline-none px-4 py-4 resize-none transition-all focus:bg-white/[0.05]"
                  />
                  <div className="absolute bottom-0 left-4 right-4 h-[1px] bg-white/10 group-focus-within:bg-white group-focus-within:h-[2px] transition-all duration-500" />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02, backgroundColor: '#FFFFFF', color: '#000000' }}
                whileTap={{ scale: 0.98 }}
                className="w-full h-16 rounded-2xl border border-white/20 flex items-center justify-center text-white text-sm font-bold uppercase tracking-[0.4em] transition-all duration-500 overflow-hidden relative group mt-8"
              >
                <span className="relative z-10">Initiate Transmission</span>
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              </motion.button>
            </form>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
