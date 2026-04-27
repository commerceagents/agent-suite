'use client';
 
import React, { useRef, useEffect, useState } from 'react';
import { motion, useInView, animate } from 'framer-motion';

// --- COUNTER COMPONENT ---
function Counter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.5 });

  useEffect(() => {
    if (isInView) {
      const controls = animate(0, value, {
        duration: 2.5,
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
    <section className="relative w-full bg-[#050508] py-16 md:py-24 border-y border-white/5">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-16">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.8, delay: idx * 0.1 }}
              className="flex flex-col group relative"
            >
              <div className="flex flex-col gap-4 relative z-10">
                {/* LABEL: CLEAN & MINIMAL */}
                <p 
                  style={{ color: 'rgba(255, 255, 255, 0.2)' }}
                  className="text-[10px] font-bold tracking-[0.4em] uppercase leading-relaxed max-w-[100px] group-hover:text-white/40 transition-colors"
                >
                  {stat.label}
                </p>
                
                {/* NUMBER: SOPHISTICATED SCALE WITH MASK REVEAL */}
                <div className="overflow-hidden">
                  <motion.h3 
                    initial={{ y: "100%" }}
                    whileInView={{ y: "0%" }}
                    viewport={{ once: false }}
                    transition={{ duration: 1.2, delay: idx * 0.1 + 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="text-white text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-none"
                    style={{ 
                      fontFamily: "var(--font-montserrat), sans-serif", 
                      fontVariantNumeric: "tabular-nums",
                      textShadow: "0 0 30px rgba(255,255,255,0.1)"
                    }}
                  >
                    <Counter value={stat.value} suffix={stat.suffix} />
                  </motion.h3>
                </div>
              </div>
              
              {/* ACCENT LINE WITH HOVER SHINE */}
              <div className="mt-8 h-[1px] w-full bg-white/10 relative overflow-hidden">
                <motion.div 
                  initial={{ x: "-100%" }}
                  whileInView={{ x: "0%" }}
                  viewport={{ once: false }}
                  transition={{ duration: 1.5, delay: idx * 0.1 + 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0 bg-white/30 group-hover:bg-white/60 transition-colors duration-500"
                />
              </div>

              {/* SUBTLE CARD GLOW */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 blur-3xl pointer-events-none" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
