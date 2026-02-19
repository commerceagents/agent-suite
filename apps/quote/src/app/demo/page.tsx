"use client";

import { useState } from "react";
import AnimatedLogo from "../../components/AnimatedLogo";

export default function DemoPage() {
  const [key, setKey] = useState(0);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center gap-8"
      style={{ backgroundColor: "#050508" }}
    >
      <h1
        className="text-2xl font-mono uppercase tracking-widest"
        style={{ color: "rgba(192,192,200,0.5)" }}
      >
        Logo Animation
      </h1>

      <div
        className="relative p-12 rounded-xl border"
        style={{
          backgroundColor: "rgba(192,192,200,0.03)",
          borderColor: "rgba(192,192,200,0.08)",
        }}
      >
        <AnimatedLogo key={key} size="large" delay={0.2} shimmerDelay={3.0} />
      </div>

      <button
        onClick={() => setKey((k) => k + 1)}
        className="px-6 py-2 rounded-full font-mono text-sm uppercase tracking-wider transition-colors"
        style={{
          color: "rgba(192,192,200,0.6)",
          border: "1px solid rgba(192,192,200,0.15)",
          backgroundColor: "transparent",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "rgba(192,192,200,0.08)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "transparent";
        }}
      >
        ↻ Replay
      </button>
    </div>
  );
}
