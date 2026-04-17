"use client";

import { useState } from "react";
import Link from "next/link";
import CinematicReveal from "../../components/CinematicReveal";

/**
 * Demo Page - showcase for the final "Cinematic Volumetric" reveal.
 */
export default function DemoPage() {
  const [key, setKey] = useState(0);

  const replay = () => {
    setKey((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: "#050508" }}>
      {/* Background Dot Grid */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }}
      />
      
      {/* Radial Gradient overlay to fade dots at edges */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 50%, transparent 0%, #050508 80%)'
        }}
      />

      <div className="max-w-5xl mx-auto px-6 py-16 relative z-10">
        <header className="mb-20">
          <Link 
            href="/" 
            className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/30 hover:text-white/60 transition-colors mb-8 inline-block"
          >
            ← Back to Home
          </Link>
          <h1
            className="text-4xl font-mono uppercase tracking-widest mb-4"
            style={{ color: "rgba(192,192,200,0.8)" }}
          >
            Cinematic Volumetric
          </h1>
          <p className="text-sm max-w-xl leading-relaxed" style={{ color: "rgba(192,192,200,0.4)" }}>
            A minimalist, luxury-focused reveal. It uses optical blur transitions 
            and automatic letter-spacing (tracking) to create a sophisticated focal point.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-12">
          {/* Final Concept: Cinematic Volumetric */}
          <div 
            className="group relative border border-white/5 rounded-2xl overflow-hidden bg-white/[0.02] p-24 flex flex-col items-center justify-center min-h-[500px]"
          >
            <div className="absolute top-8 left-8 flex items-center gap-3">
              <span className="text-[10px] font-mono text-white/60 uppercase tracking-widest">Final Concept</span>
              <span className="text-[10px] bg-white text-black px-1.5 py-0.5 rounded font-bold uppercase tracking-tighter">
                VOLUMETRIC OPTIC
              </span>
            </div>

            <button
              onClick={replay}
              className="absolute top-8 right-8 text-[10px] font-mono uppercase tracking-widest text-white/20 hover:text-white transition-colors flex items-center gap-2"
            >
              <span>⟲</span> Replay
            </button>

            <div className="flex flex-col items-center gap-2 w-full max-w-xl mx-auto">
              {/* AGENT - Masked Slide-Up + Subtle Expand */}
              <CinematicReveal 
                key={`agent-${key}`} 
                text="AGENT" 
                fontSize="12px" 
                fontWeight={500}
                letterSpacingStart="0.5em" 
                letterSpacingEnd="1.2em"   
                initialScale={1}
                initialOpacity={0}
                initialY={25}               // Beneath the mask
                useMask={true}              // Container clips content
                duration={2.5} 
                delay={3.8}                 // Start as QUOTE settles
                className="mb-[-8px]"
              />
              {/* QUOTE - Restored to the "Perfect" Focal Zoom parameters */}
              <CinematicReveal 
                key={`quote-${key}`} 
                text="QUOTE" 
                fontSize="92px" 
                fontWeight={900}
                letterSpacingStart="1.5em"  // Restored from successful Step 994
                letterSpacingEnd="0.06em"  
                initialScale={6}            // Restored from successful Step 994
                duration={4}                // Restored from successful Step 994
                delay={0.5} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
