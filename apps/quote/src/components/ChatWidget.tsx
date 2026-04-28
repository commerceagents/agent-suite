'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ChatWidget() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Hello. I am the Agent Suite Orchestrator. How can I assist your structural goals today?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  if (!mounted) return null;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newMessages = [...messages, { role: 'user', text: inputValue }];
    setMessages(newMessages);
    setInputValue('');

    // Simulate AI Response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'ai', 
        text: "Acknowledged. I am processing your request through our neural architecture. Please wait for the final proposal." 
      }]);
    }, 1500);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 1.2, 
        delay: 14.0, 
        ease: [0.16, 1, 0.3, 1] 
      }}
      className="fixed bottom-24 right-8 z-[100] font-sans"
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 20, scale: 0.9, filter: 'blur(10px)' }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="absolute bottom-20 right-0 w-[380px] h-[520px] bg-black/80 backdrop-blur-3xl border border-white/10 rounded-[32px] overflow-hidden shadow-2xl flex flex-col"
          >
            {/* HEADER */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                <span className="text-white/60 text-[10px] font-bold tracking-[0.4em] uppercase">Orchestrator AI</span>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white/20 hover:text-white transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>

            {/* MESSAGE LIST */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide"
            >
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: msg.role === 'ai' ? -10 : 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex ${msg.role === 'ai' ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'ai' 
                      ? 'bg-white/[0.05] text-white/70 rounded-tl-none border border-white/5' 
                      : 'bg-white text-black font-medium rounded-tr-none'
                  }`}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* INPUT AREA */}
            <form 
              onSubmit={handleSendMessage}
              suppressHydrationWarning
              className="p-6 border-t border-white/5 bg-white/[0.02]"
            >
              <div className="relative">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type your query..."
                  suppressHydrationWarning
                  className="w-full bg-white/[0.05] border border-white/10 rounded-2xl h-12 px-5 text-white text-sm focus:outline-none focus:border-white/20 transition-all placeholder:text-white/20"
                />
                <button 
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-white/40 hover:text-white transition-colors"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CHAT BUBBLE TRIGGER (Matched to Up Button Size) */}
      <motion.button
        whileHover={{ 
          scale: 1.1, 
          backgroundColor: '#FFFFFF', 
          color: '#000000', 
          boxShadow: "0 0 30px rgba(255,255,255,0.3)" 
        }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
        className="w-12 h-12 rounded-full backdrop-blur-xl border border-white/10 text-white/60 flex items-center justify-center shadow-2xl relative overflow-hidden group transition-all duration-500"
      >
        <svg 
          width="18" height="18" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2.5" 
          className="relative z-10"
        >
          {isOpen ? (
            <path d="M18 6L6 18M6 6l12 12" />
          ) : (
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          )}
        </svg>
      </motion.button>
    </motion.div>
  );
}
