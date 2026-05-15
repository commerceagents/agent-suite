'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface LiquidGlassCardProps {
  title?: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
  glowColor?: string;
  onClick?: () => void;
}

export default function LiquidGlassCard({
  title,
  description,
  children,
  className = "",
  glowColor = "rgba(255, 255, 255, 0.15)",
  onClick
}: LiquidGlassCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  // Mouse position for dynamic radial gradient
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Springs for 3D tilt
  const rotateX = useSpring(0, { stiffness: 300, damping: 30, mass: 0.5 });
  const rotateY = useSpring(0, { stiffness: 300, damping: 30, mass: 0.5 });

  const [isHovered, setIsHovered] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    
    // Calculate mouse position relative to card
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    mouseX.set(x);
    mouseY.set(y);
    
    // Calculate tilt (max 10 degrees)
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Reverse values for natural tilt feeling
    const rotateXValue = ((y - centerY) / centerY) * -8;
    const rotateYValue = ((x - centerX) / centerX) * 8;
    
    rotateX.set(rotateXValue);
    rotateY.set(rotateYValue);
  }

  function handleMouseLeave() {
    setIsHovered(false);
    rotateX.set(0);
    rotateY.set(0);
  }

  if (!mounted) {
    return (
      <div className={`relative rounded-3xl p-8 bg-white/5 border border-white/10 ${className}`}>
        {title && (
          <h3 className="text-2xl font-bold text-white mb-3 tracking-wide" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
            {title}
          </h3>
        )}
        {description && (
          <p className="text-white/60 leading-relaxed font-light mb-6 text-sm">
            {description}
          </p>
        )}
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        transformStyle: "preserve-3d",
        rotateX,
        rotateY,
      }}
      className={`relative group rounded-3xl p-8 bg-white/5 border border-white/10 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] overflow-hidden transition-colors duration-500 hover:border-white/20 hover:bg-white/[0.07] ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {/* 
        Dynamic Glow following mouse 
        We use framer-motion's useMotionTemplate to dynamically update the radial-gradient position
      */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 mix-blend-screen"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              400px circle at ${mouseX}px ${mouseY}px,
              ${glowColor},
              transparent 80%
            )
          `,
        }}
      />

      {/* Internal Liquid/Glow layer */}
      <div 
        className={`absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
      />

      {/* Edge Glow */}
      <div className="absolute inset-0 rounded-3xl border border-white/40 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      {/* Subtle Refraction Lines (Top & Bottom) */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-40 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-400/30 to-transparent opacity-40 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Content wrapper with 3D translation */}
      <div 
        className="relative z-10 flex flex-col h-full"
        style={{ transform: "translateZ(30px)" }} // Pops the content out slightly in 3D space
      >
        {title && (
          <motion.h3 
            className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70 mb-3 tracking-wide drop-shadow-md" 
            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
          >
            {title}
          </motion.h3>
        )}
        
        {description && (
          <motion.p className="text-white/60 leading-relaxed font-light mb-6 text-sm">
            {description}
          </motion.p>
        )}
        
        <div className="mt-auto">
          {children}
        </div>
      </div>

      {/* 
        Subtle corner accents 
        These add to the "premium" architectural feel
      */}
      <div className="absolute top-4 left-4 w-2 h-2 border-t border-l border-white/20 group-hover:border-white/60 transition-colors duration-500" />
      <div className="absolute top-4 right-4 w-2 h-2 border-t border-r border-white/20 group-hover:border-white/60 transition-colors duration-500" />
      <div className="absolute bottom-4 left-4 w-2 h-2 border-b border-l border-white/20 group-hover:border-white/60 transition-colors duration-500" />
      <div className="absolute bottom-4 right-4 w-2 h-2 border-b border-r border-white/20 group-hover:border-white/60 transition-colors duration-500" />
    </motion.div>
  );
}
