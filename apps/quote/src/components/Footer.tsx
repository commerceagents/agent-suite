'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { title: 'Navigation', links: [
      { name: 'About us', href: '#about' },
      { name: 'Projects', href: '#projects' },
      { name: 'People', href: '#people' },
      { name: 'Testimonials', href: '#testimonial' },
      { name: 'Contact', href: '#contact' }
    ]},
    { title: 'Services', links: [
      { name: 'AI Integration', href: '#' },
      { name: 'Commerce Strategy', href: '#' },
      { name: 'Brand Identity', href: '#' },
      { name: 'Technical Audit', href: '#' }
    ]},
    { title: 'Connect', links: [
      { name: 'LinkedIn', href: '#' },
      { name: 'X (Twitter)', href: '#' },
      { name: 'Instagram', href: '#' },
      { name: 'GitHub', href: '#' }
    ]}
  ];

  return (
    <footer className="relative bg-[#050508] pt-24 pb-12 px-6 md:px-12 lg:px-24 overflow-hidden border-t border-white/5">
      
      {/* ATMOSPHERIC GLOW */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-[100%] bg-white/[0.01] blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-[1400px] mx-auto relative z-10">
        
        {/* TOP SECTION: LOGO & LINKS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-20 mb-24">
          
          {/* BRAND COLUMN */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-4 mb-8">
              <img 
                src="/image/CA_logo-PNG.png" 
                alt="Commerce Agents Logo" 
                className="w-10 h-auto grayscale brightness-125"
              />
              <span className="text-white text-lg font-bold tracking-widest uppercase" style={{ fontFamily: 'var(--font-montserrat), sans-serif' }}>
                Commerce Agents
              </span>
            </div>
            <p className="text-white/40 text-sm font-light leading-relaxed max-w-sm mb-8">
              Pioneering the intersection of artificial intelligence and premium commerce. We build the technical horizons of tomorrow's digital economies.
            </p>
            <div className="flex gap-4">
              <div className="px-4 py-2 rounded-full border border-white/10 text-[10px] text-white/40 uppercase tracking-widest font-bold">
                v.2.0.4 - Release Alpha
              </div>
            </div>
          </div>

          {/* LINK COLUMNS */}
          {footerLinks.map((column) => (
            <div key={column.title}>
              <h4 className="text-white text-xs font-bold uppercase tracking-[0.4em] mb-8" style={{ fontFamily: 'var(--font-montserrat), sans-serif' }}>
                {column.title}
              </h4>
              <ul className="space-y-4">
                {column.links.map((link) => (
                  <li key={link.name}>
                    <a 
                      href={link.href} 
                      className="text-white/40 hover:text-white text-sm font-light transition-colors duration-300 flex items-center group"
                    >
                      <span className="w-0 group-hover:w-4 h-[1px] bg-white/40 mr-0 group-hover:mr-2 transition-all duration-300" />
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* BOTTOM SECTION: LEGAL & COPYRIGHT */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          
          <div className="flex items-center gap-8 text-[10px] text-white/30 uppercase tracking-[0.2em] font-medium">
            <span>© {currentYear} Commerce Agents Ltd.</span>
            <a href="#" className="hover:text-white transition-colors">Privacy Protocol</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Engagement</a>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[10px] text-white/20 uppercase tracking-[0.3em]">Built by</span>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-white/40 animate-pulse" />
              <span className="text-white/60 text-[10px] font-bold tracking-widest uppercase">AGI-LABS</span>
            </div>
          </div>

        </div>

      </div>

      {/* CHROME DECORATIVE LINE */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </footer>
  );
}
