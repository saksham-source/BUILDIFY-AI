'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsGenerating(true);

    sessionStorage.setItem('startupInput', JSON.stringify({ name, description }));
    router.push('/processing');
  };

  return (
    <main className="min-h-[90vh] flex flex-col items-center justify-center font-sans w-full">

      <div className="relative z-10 flex flex-col items-center justify-center w-full px-4 pb-20 pt-10">

        {/* Flourish Ornament */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-8 opacity-70"
        >
          <svg width="240" height="30" viewBox="0 0 240 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M120 15C90 15 70 5 40 5C20 5 5 15 5 15" stroke="#1A1A1A" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.4" />
            <path d="M120 15C150 15 170 5 200 5C220 5 235 15 235 15" stroke="#1A1A1A" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.4" />
            <circle cx="120" cy="15" r="3" fill="#1A1A1A" fillOpacity="0.6" />
            <path d="M110 15C110 9.47715 114.477 5 120 5" stroke="#1A1A1A" strokeWidth="1.5" strokeOpacity="0.5" />
            <path d="M130 15C130 9.47715 125.523 5 120 5" stroke="#1A1A1A" strokeWidth="1.5" strokeOpacity="0.5" />
            <circle cx="5" cy="15" r="1.5" fill="#1A1A1A" fillOpacity="0.4" />
            <circle cx="235" cy="15" r="1.5" fill="#1A1A1A" fillOpacity="0.4" />
          </svg>
        </motion.div>

        {/* Pill */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="px-6 py-2.5 rounded-full border border-[#d6e5ff] bg-white/70 backdrop-blur-md mb-10 text-[#2563eb] text-sm font-semibold tracking-wide shadow-sm flex items-center gap-2"
        >
          <span>India's Sovereign AI Platform</span>
        </motion.div>

        {/* Hero Typography */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center max-w-4xl mx-auto w-full"
        >
          <h1 className="text-6xl md:text-7xl lg:text-[5.5rem] font-normal tracking-[-0.03em] text-[#111111] mb-6 leading-[1.1] font-serif" style={{ fontFamily: 'Georgia, Cambria, "Times New Roman", Times, serif' }}>
            AI for all from India
          </h1>
          <p className="text-xl md:text-[22px] text-[#444444] font-normal w-full max-w-2xl mx-auto leading-[1.6] mb-12">
            Built on sovereign compute. Powered by frontier-class models.
            <br className="hidden md:block" />
            Delivering population-scale impact.
          </p>
        </motion.div>

        {/* Form replacing simple CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="w-full max-w-xl mx-auto"
        >
          <form onSubmit={handleSubmit} className="bg-white/90 backdrop-blur-xl p-8 rounded-[2rem] shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1)] border border-white/80 space-y-5">
            <div>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name your startup (e.g. HealthHub)"
                className="w-full px-5 py-4 rounded-xl bg-gray-50/80 border border-gray-200/80 
                           focus:border-blue-400 focus:ring-4 focus:ring-blue-100/50 
                           outline-none transition-all placeholder:text-gray-400 text-black text-[17px] shadow-inner"
                required
              />
            </div>

            <div>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What problem does it solve? (Optional)"
                rows={2}
                className="w-full px-5 py-4 rounded-xl bg-gray-50/80 border border-gray-200/80 
                           focus:border-blue-400 focus:ring-4 focus:ring-blue-100/50 
                           outline-none transition-all resize-none placeholder:text-gray-400 text-black text-[17px] shadow-inner"
              />
            </div>

            <button
              type="submit"
              disabled={!name.trim() || isGenerating}
              className="w-full py-4 px-6 rounded-full bg-[#1a1a1c] hover:bg-black
                         font-medium text-white transition-all duration-300 shadow-[0_8px_20px_-6px_rgba(0,0,0,0.5)] hover:shadow-[0_12px_25px_-6px_rgba(0,0,0,0.6)] hover:-translate-y-0.5
                         disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none
                         flex items-center justify-center gap-3 text-[17px]"
            >
              {isGenerating ? (
                <>
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                    <Sparkles className="w-5 h-5" />
                  </motion.div>
                  Generating Plan...
                </>
              ) : (
                <>
                  Generate Startup Plan
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>

    </main>
  );
}
