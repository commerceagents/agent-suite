"use client";

import { motion } from "framer-motion";

export default function Home() {
  const containerVars = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 7.5,
      },
    },
  };

  const itemVars = {
    initial: { y: 30, opacity: 0 },
    animate: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 1.2,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <main className="relative min-h-screen w-full flex flex-col items-center justify-center px-6 overflow-hidden">
      {/* Blueprint grid lines — decorative */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(192,192,200,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(192,192,200,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />

      {/* Blueprint crosshairs */}
      <div className="absolute top-8 left-8 font-mono text-[11px]" style={{ color: "rgba(192,192,200,0.12)" }}>+</div>
      <div className="absolute top-8 right-8 font-mono text-[11px]" style={{ color: "rgba(192,192,200,0.12)" }}>+</div>
      <div className="absolute bottom-8 left-8 font-mono text-[11px]" style={{ color: "rgba(192,192,200,0.12)" }}>+</div>
      <div className="absolute bottom-8 right-8 font-mono text-[11px]" style={{ color: "rgba(192,192,200,0.12)" }}>+</div>

      {/* Vertical blueprint labels */}
      <div
        className="absolute left-8 top-1/2 -translate-y-1/2"
        style={{
          writingMode: "vertical-lr",
          color: "rgba(192,192,200,0.08)",
          fontFamily: "monospace",
          fontSize: "9px",
          letterSpacing: "0.35em",
          textTransform: "uppercase",
        }}
      >
        AGENT QUOTE — SECTION.01
      </div>

      {/* Section counter — right side */}
      <div
        className="absolute right-8 top-1/2 -translate-y-1/2"
        style={{
          writingMode: "vertical-lr",
          color: "rgba(192,192,200,0.08)",
          fontFamily: "monospace",
          fontSize: "9px",
          letterSpacing: "0.35em",
          textTransform: "uppercase",
        }}
      >
        01 / 01
      </div>

      {/* Main Content — appears after loading + cinemascope */}
      <motion.div
        variants={containerVars}
        initial="initial"
        animate="animate"
        className="relative z-10 flex flex-col items-center text-center max-w-3xl"
      >
        {/* Eyebrow */}
        <motion.div variants={itemVars}>
          <span
            className="font-mono tracking-[0.35em] uppercase"
            style={{
              fontSize: "11px",
              color: "rgba(192,192,200,0.4)",
            }}
          >
            Commerce Agents — Agent Quote
          </span>
        </motion.div>

        {/* Hero title — chrome gradient */}
        <motion.h1
          variants={itemVars}
          className="mt-6"
          style={{
            fontFamily: "'Cabinet Grotesk', sans-serif",
            fontWeight: 800,
            fontSize: "clamp(40px, 8vw, 80px)",
            lineHeight: 1.05,
            background: "linear-gradient(180deg, #3A3A42 0%, #8A8A96 30%, #D0D0DC 60%, #FFFFFF 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Precision Quotations
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={itemVars}
          className="mt-6 max-w-lg"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "18px",
            lineHeight: 1.6,
            color: "rgba(192,192,200,0.5)",
            fontWeight: 300,
          }}
        >
          AI-powered drafts. Human approval. Cinematic client experience.
          Every quote crafted with precision.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div variants={itemVars} className="mt-10 flex gap-4">
          <a
            href="/admin/dashboard"
            className="btn-primary"
            style={{
              fontFamily: "'Cabinet Grotesk', sans-serif",
            }}
          >
            Open Dashboard
            <span className="ml-2 inline-block">→</span>
          </a>
          <button
            className="btn-glass"
            style={{
              fontFamily: "'Cabinet Grotesk', sans-serif",
            }}
          >
            View Demo
          </button>
        </motion.div>
      </motion.div>

      {/* Bottom — scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 9, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
      >
        <div className="w-[1px] h-12 relative overflow-hidden" style={{ background: "linear-gradient(to bottom, rgba(192,192,200,0.2), transparent)" }}>
          <motion.div
            animate={{ y: ["-100%", "100%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 w-full h-full"
            style={{ background: "linear-gradient(to bottom, transparent, rgba(192,192,200,0.4), transparent)" }}
          />
        </div>
      </motion.div>
    </main>
  );
}
