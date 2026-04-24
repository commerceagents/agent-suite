'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView, animate } from 'framer-motion';

function Counter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.5 });

  useEffect(() => {
    if (isInView) {
      const controls = animate(0, value, {
        duration: 2,
        ease: [0.16, 1, 0.3, 1],
        onUpdate: (latest) => setDisplayValue(Math.floor(latest))
      });
      return () => controls.stop();
    }
  }, [isInView, value]);

  return (
    <span ref={ref}>
      {displayValue}{suffix}
    </span>
  );
}

const stats = [
  { label: "Successful Projects", value: 120, suffix: "+" },
  { label: "Global Markets", value: 15, suffix: "+" },
  { label: "AI Accuracy", value: 99, suffix: ".9%" },
  { label: "Team Visionaries", value: 45, suffix: "+" }
];

export default function StatsSection() {
  return (
    <section className="relative w-full bg-[#050508] py-32 md:py-48 px-6 md:px-12 lg:px-24 overflow-hidden border-y border-white/5">
      
      {/* ATMOSPHERIC GLOW */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[40%] bg-white/[0.01] blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-[1400px] mx-auto relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-24">
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 1, delay: idx * 0.15 }}
              className="text-center md:text-left group"
            >
              <div className="flex flex-col gap-2">
                <p className="text-white/20 text-[10px] md:text-[12px] font-bold tracking-[0.5em] uppercase mb-4 group-hover:text-white/40 transition-colors">
                  {stat.label}
                </p>
                <h3 className="text-white text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
                  <Counter value={stat.value} suffix={stat.suffix} />
                </h3>
              </div>
              
              {/* Subtle Progress Bar Under Stat */}
              <div className="mt-8 h-[1px] w-full bg-white/5 relative overflow-hidden">
                <motion.div
                  initial={{ x: "-100%" }}
                  whileInView={{ x: "0%" }}
                  viewport={{ once: false }}
                  transition={{ duration: 1.5, delay: idx * 0.2 + 0.5, ease: "easeOut" }}
                  className="absolute inset-0 bg-white/10"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
