'use client';

import React from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-black pt-24 overflow-hidden font-sans">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24 relative z-10">
        
        {/* TOP SECTION */}
        <div className="flex flex-col lg:flex-row justify-between gap-16 lg:gap-8 mb-20">
          
          {/* LEFT CTA */}
          <div className="max-w-xl">
            <h2 className="text-white text-5xl md:text-6xl lg:text-[5rem] font-bold tracking-tight leading-[1.05] mb-8" style={{ fontFamily: 'var(--font-montserrat), sans-serif' }}>
              Have a Cool Idea?<br />Let&apos;s Collaborate<span className="text-white">.</span>
            </h2>
          </div>

          {/* RIGHT LINKS GRID */}
          <div className="grid grid-cols-2 gap-y-12 gap-x-8 w-full lg:w-auto min-w-[50%] pt-4">
            
            {/* Location (Top Left) */}
            <div className="flex flex-col gap-4">
              <h4 className="text-white text-sm font-semibold">Location</h4>
              <p className="text-white/50 text-xs leading-relaxed max-w-[180px]">
                1330 Huffman Rd, Anchorage,<br/>Alaska, United States
              </p>
            </div>

            {/* Contact (Top Right) */}
            <div className="flex flex-col gap-4 text-right items-end">
              <h4 className="text-white text-sm font-semibold">Contact</h4>
              <div className="flex flex-col gap-1 text-white/50 text-xs">
                <a href="#" className="hover:text-white transition-colors">+1 206 555 0100</a>
                <a href="#" className="hover:text-white transition-colors">hello@commerceagents.com</a>
              </div>
            </div>

            {/* Social (Bottom Left) */}
            <div className="flex flex-col gap-4">
              <h4 className="text-white text-sm font-semibold">Social</h4>
              <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                {['LinkedIn', 'Twitter/X', 'Instagram', 'GitHub'].map(link => (
                  <a key={link} href="#" className="text-white/50 hover:text-white text-[11px] font-medium transition-colors flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-sm bg-white" />
                    {link}
                  </a>
                ))}
              </div>
            </div>

            {/* Helpful Links (Bottom Right) */}
            <div className="flex flex-col gap-4 text-right items-end">
              <h4 className="text-white text-sm font-semibold">Helpful Links</h4>
              <div className="flex flex-wrap justify-end gap-x-3 gap-y-2 max-w-[200px]">
                {['Privacy Policy', 'About us', 'Projects', 'People', 'Services', 'Contact'].map((link, i, arr) => (
                  <div key={link} className="flex items-center gap-3">
                    <a href="#" className="text-white/50 hover:text-white text-[11px] font-medium transition-colors">
                      {link}
                    </a>
                    {i !== arr.length - 1 && <span className="w-1 h-1 rounded-full bg-white/20" />}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* MIDDLE DIVIDER */}
        <div className="w-full h-[1px] bg-white/10 mb-6" />

        {/* BOTTOM COPYRIGHT ROW */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pb-6 text-xs font-medium">
          <div className="text-white/50">
            ©CommerceAgents {currentYear}
          </div>
          
          <div className="flex items-center gap-2 text-white/50">
            <span className="w-1.5 h-1.5 rounded-sm bg-white animate-pulse" />
            Made with Love by AGI-LABS
          </div>

          <div className="flex items-center gap-2 text-white/50">
            Created by 
            <img src="/image/CA_logo-PNG.png" alt="Avatar" className="w-5 h-5 rounded-full grayscale brightness-200 bg-white/5 p-1" />
            <span className="font-bold text-white italic" style={{ fontFamily: 'var(--font-montserrat), sans-serif' }}>CommerceAgents</span>
          </div>
        </div>

      </div>

      {/* GIANT THEME TEXT AT BOTTOM */}
      <div className="relative w-full h-[35vh] lg:h-[50vh] bg-[#0a0a0a] overflow-hidden flex items-center justify-center mt-12">
        
        {/* Giant Text */}
        <h1 
          className="text-[25vw] font-black tracking-tighter text-white opacity-[0.07] select-none"
          style={{ fontFamily: 'var(--font-montserrat), sans-serif', lineHeight: 0.8 }}
        >
          AGENTS
        </h1>

        {/* Overlay texture simulation */}
        <div className="absolute inset-0 bg-gradient-to-tr from-black via-transparent to-white/5 pointer-events-none mix-blend-overlay" />
      </div>
    </footer>
  );
}

