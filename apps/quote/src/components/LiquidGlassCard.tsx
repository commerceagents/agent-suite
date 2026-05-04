'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface LiquidGlassCardProps {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
}

export default function LiquidGlassCard({ children, className = "", containerClassName = "" }: LiquidGlassCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={`relative overflow-hidden backdrop-blur-xl bg-white/5 border border-white/20 ${className}`}>
        {children}
      </div>
    );
  }

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative group overflow-hidden transition-all duration-500 ${containerClassName}`}
    >
      {/* Glass Base Layer */}
      <div 
        className={`absolute inset-0 bg-white/[0.03] backdrop-blur-3xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] transition-all duration-500 ${className}`}
      />

      {/* Main Gradient Overlay */}
      <div 
        className={`absolute inset-0 transition-opacity duration-700 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
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
      <div className="absolute inset-0 border border-white/20 group-hover:border-white/40 transition-colors duration-500 pointer-events-none" />

      {/* Content Wrapper */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>

      {/* Subtle Refraction Lines */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </div>
  );
}
