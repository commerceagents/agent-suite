"use client";
 
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import AnimatedLogo from "./AnimatedLogo";
import RippleGrid from "./RippleGrid";
 
export default function LoadingScreen() {
  const [mounted, setMounted] = useState(false);
  const [show, setShow] = useState(true);
  const [showText, setShowText] = useState(false);
  const [showRipples, setShowRipples] = useState(false);
 
  const TIMELINE = {
    TEXT_REVEAL_DELAY: 3.8,
    TOTAL_HIDE_DELAY: 6.5,
    BARS_OPEN_DELAY: 8.0,
  };
 
  useEffect(() => {
    setMounted(true);
    document.body.style.overflow = "hidden";
 
    const rippleTimeout = setTimeout(() => setShowRipples(true), 2400);
 
    const textTimeout = setTimeout(() => {
      setShowText(true);
    }, TIMELINE.TEXT_REVEAL_DELAY * 1000);
 
    const hideTimeout = setTimeout(() => {
      setShow(false);
      document.body.style.overflow = "unset";
    }, TIMELINE.TOTAL_HIDE_DELAY * 1000);
 
    return () => {
      clearTimeout(rippleTimeout);
      clearTimeout(textTimeout);
      clearTimeout(hideTimeout);
      document.body.style.overflow = "unset";
    };
  }, []);

  if (!mounted) return null;
 
  return (
    <>
      <AnimatePresence mode="wait">
        {show && (
          <motion.div
            key="loading-screen"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.0 }}
            className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden"
            style={{ zIndex: 9999, backgroundColor: "#050508" }}
          >
            {/* ═══ DOT RIPPLE GRID ═══ */}
            <RippleGrid trigger={showRipples} />
 
            {/* Blueprint corner markers */}
            {["top-6 left-6", "top-6 right-6", "bottom-6 left-6", "bottom-6 right-6"].map((pos) => (
              <div
                key={pos}
                className={`absolute ${pos} font-mono text-[11px]`}
                style={{ color: "rgba(192,192,200,0.12)" }}
              >
                +
              </div>
            ))}
 
            {/* Vertical blueprint text — left */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0, duration: 1.5 }}
              className="absolute left-6 top-1/2 -translate-y-1/2"
              style={{
                writingMode: "vertical-lr",
                color: "rgba(192, 192, 200, 0.08)",
                fontFamily: "monospace",
                fontSize: "9px",
                letterSpacing: "0.35em",
                textTransform: "uppercase",
              }}
            >
              COMMERCE AGENTS — AGENT SUITE
            </motion.div>
 
            {/* Vertical blueprint text — right */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 1.5 }}
              className="absolute right-6 top-1/2 -translate-y-1/2"
              style={{
                writingMode: "vertical-lr",
                color: "rgba(192, 192, 200, 0.08)",
                fontFamily: "monospace",
                fontSize: "9px",
                letterSpacing: "0.35em",
                textTransform: "uppercase",
              }}
            >
              SYSTEM LOADING — V2.0
            </motion.div>
 
            {/* Center content */}
            <div className="relative flex items-center justify-center w-full h-full" style={{ zIndex: 10 }}>
              <div className="flex items-center gap-6">
                {/* Logo — removed layout prop to prevent unstable scaling */}
                <motion.div className="relative z-20">
                  <AnimatedLogo size="base" delay={0.2} shimmerDelay={4.0} />
                </motion.div>
 
                {/* Text — smooth clipPath mask reveal */}
                {showText && (
                  <motion.div
                    initial={{ clipPath: "inset(0 100% 0 0)", opacity: 0 }}
                    animate={{ clipPath: "inset(0 0% 0 0)", opacity: 1 }}
                    transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <motion.div
                      className="flex flex-col leading-none whitespace-nowrap"
                      initial={{ x: -20 }}
                      animate={{ x: 0 }}
                      transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div className="flex flex-col items-center">
                        <span style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: "22px", fontWeight: 500, letterSpacing: "0.3em", textTransform: "uppercase", color: "#C0C0C8" }}>
                          COMMERCE
                        </span>
                        <span style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: "36px", fontWeight: 800, letterSpacing: "0.22em", textTransform: "uppercase", marginTop: "4px", color: "#FFFFFF" }}>
                          AGENTS
                        </span>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </div>
            </div>
 
            {/* Bottom text */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.0, duration: 1.5 }}
              className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-[0.2em] uppercase"
              style={{ color: "rgba(192, 192, 200, 0.15)", zIndex: 10 }}
            >
              INITIALIZING SYSTEM
            </motion.div>
 
            {/* Film grain */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                opacity: 0.03,
                mixBlendMode: "overlay",
                backgroundImage: "url('/noise.svg')",
                zIndex: 20,
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
 
      {/* Cinemascope letterbox bars — only visible when 'show' is true or exiting */}
      <AnimatePresence>
        {show && (
          <>
            <motion.div
              initial={{ y: 0 }}
              exit={{ y: "-100%" }}
              transition={{ delay: 1.5, duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-0 left-0 w-full pointer-events-none"
              style={{ height: "50.1%", backgroundColor: "#050508", zIndex: 100 }}
            >
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: "3px",
                  background: "linear-gradient(90deg, transparent 0%, rgba(192,192,200,0.3) 20%, rgba(255,255,255,0.6) 50%, rgba(192,192,200,0.3) 80%, transparent 100%)",
                }}
              />
            </motion.div>
            <motion.div
              initial={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ delay: 1.5, duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
              className="fixed bottom-0 left-0 w-full pointer-events-none"
              style={{ height: "50.1%", backgroundColor: "#050508", zIndex: 100 }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "3px",
                  background: "linear-gradient(90deg, transparent 0%, rgba(192,192,200,0.3) 20%, rgba(255,255,255,0.6) 50%, rgba(192,192,200,0.3) 80%, transparent 100%)",
                }}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
