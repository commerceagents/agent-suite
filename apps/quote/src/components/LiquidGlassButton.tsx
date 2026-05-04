'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface LiquidGlassButtonProps {
  label: string;
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
}

export default function LiquidGlassButton({ label, onClick, className = "" }: LiquidGlassButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button 
        className={`relative px-5 py-2 rounded-xl bg-white/5 border border-white/20 text-white font-medium tracking-wide text-[13px] lg:text-[14px] ${className}`}
        style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
        suppressHydrationWarning
      >
        {label}
      </button>
    );
  }

  return (
    <motion.button
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      suppressHydrationWarning
      whileTap={{ scale: 0.98 }}
      className={`relative group px-5 py-2 rounded-xl overflow-hidden transition-all duration-300 ${className}`}
    >
      {/* Glass Base Layer */}
      <div 
        className="absolute inset-0 bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
      />

      {/* Main Gradient Overlay */}
      <div 
        className={`absolute inset-0 transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
        style={{ background: 'linear-gradient(135deg, #ffffff 0%, #a1a1aa 45%, #27272a 100%)' }}
      />

      {/* Secondary Depth Gradient (Top Left Highlight) */}
      <div 
        className={`absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.8),transparent_70%)] transition-opacity duration-700 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
      />

      {/* Tertiary Depth Gradient (Bottom Right Shadow) */}
      <div 
        className={`absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(0,0,0,0.2),transparent_60%)] transition-opacity duration-700 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
      />

      {/* Edge Glow */}
      <div className="absolute inset-0 rounded-xl border border-white/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Text Label */}
      <span 
        className={`relative z-10 font-medium tracking-wide text-[13px] lg:text-[14px] transition-colors duration-300 ${isHovered ? 'text-zinc-950' : 'text-white'}`}
        style={{ 
          textShadow: "0 2px 4px rgba(0,0,0,0.3)",
          fontFamily: "var(--font-montserrat), sans-serif"
        }}
      >
        {label}
      </span>

      {/* Subtle Refraction Lines */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-400/20 to-transparent" />
    </motion.button>
  );
}
