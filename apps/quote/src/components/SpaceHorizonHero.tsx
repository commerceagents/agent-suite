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
        console.warn("Video autoplay failed, waiting for user interaction:", err);
      });
    }
  }, []);

  return (
    <section className="relative h-[100dvh] w-full bg-black overflow-hidden font-sans select-none">
      
      {/* STEP 1: INITIAL BLANK SCREEN (0s - 0.5s) */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: "linear" }}
        className="absolute inset-0 z-[100] bg-black pointer-events-none"
      />

      {/* MAIN CONTENT AREA - BACKGROUND ONLY */}
      <div className="relative h-full w-full">
        
        {/* STEP 2: BACKGROUND VIDEO (Sync with LoadingScreen at 4.0s) */}
        <div className="absolute inset-0 z-0 bg-black">
          <motion.video 
            ref={videoRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: isEnded ? 0 : 0.8 }}
            onEnded={() => setIsEnded(true)}
            transition={{ 
              duration: isEnded ? 1.5 : 1.5, 
              delay: isEnded ? 0 : 4.0, 
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
