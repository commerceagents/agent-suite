'use client';
 
import React from 'react';
import { motion } from 'framer-motion';
import Navigation from './Navigation';
 
export default function SpaceHorizonHero() {
  const [isEnded, setIsEnded] = React.useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(err => {
        console.warn("Video playback failed:", err);
      });
    }
  }, []);

  return (
    <section className="relative h-[100dvh] w-full bg-black overflow-hidden font-sans select-none">
      
      {/* MAIN CONTENT AREA - VIDEO 7 RESTORED */}
      <div className="relative h-full w-full">
        <div className="absolute inset-0 z-0 bg-black">
          <motion.video 
            ref={videoRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: isEnded ? 0 : 0.8 }}
            onEnded={() => setIsEnded(true)}
            transition={{ 
              duration: isEnded ? 2.0 : 1.5, 
              delay: isEnded ? 0 : 0, 
              ease: "easeOut" 
            }}
            src="/video-7.mp4"
            autoPlay
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80 z-5" />
        </div>
      </div>

    </section>
  );
}
