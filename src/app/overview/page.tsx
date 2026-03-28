'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Brain, ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { OverviewCard } from '@/components/OverviewCard';
import { FeasibilityScore } from '@/components/FeasibilityScore';
import { StartupOverview } from '@/types';
import { Target, Users, TrendingUp, DollarSign, Rocket, Sparkles } from 'lucide-react';

export default function OverviewPage() {
  const router = useRouter();
  const [overview, setOverview] = useState<StartupOverview | null>(null);
  const [startupName, setStartupName] = useState('');

  useEffect(() => {
    const overviewData = sessionStorage.getItem('startupOverview');
    const inputData = sessionStorage.getItem('startupInput');
    
    if (!overviewData || !inputData) {
      router.push('/');
      return;
    }

    setOverview(JSON.parse(overviewData));
    setStartupName(JSON.parse(inputData).name);
  }, [router]);

  const handleGoDeeper = () => {
    router.push('/cto-chat');
  };

  if (!overview) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-600">Loading...</div>
      </main>
    );
  }

  const cards = [
    { title: 'Problem Statement', content: overview.problemStatement, icon: Target, color: 'bg-red-500/20 text-red-400', delay: 0 },
    { title: 'Target Audience', content: overview.targetAudience, icon: Users, color: 'bg-blue-500/20 text-blue-400', delay: 0.1 },
    { title: 'Market Opportunity', content: overview.marketOpportunity, icon: TrendingUp, color: 'bg-green-500/20 text-green-400', delay: 0.2 },
    { title: 'Monetization Strategy', content: overview.monetizationStrategy, icon: DollarSign, color: 'bg-yellow-500/20 text-yellow-400', delay: 0.3 },
    { title: 'MVP Features', content: overview.mvpFeatures, icon: Rocket, color: 'bg-purple-500/20 text-purple-400', delay: 0.4 },
  ];

  return (
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.push('/')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          Start Over
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">{startupName}</span>
          </h1>
          <p className="text-xl text-gray-600">{overview.oneLinePitch}</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {cards.map((card) => (
            <OverviewCard key={card.title} {...card} />
          ))}
          <div className="lg:col-span-3">
            <FeasibilityScore score={overview.feasibilityScore} />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <motion.button
            onClick={handleGoDeeper}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-primary-500 to-purple-500 
                       font-semibold text-gray-900 glow-button inline-flex items-center gap-3"
          >
            <Brain className="w-5 h-5" />
            Go Deeper - Chat with CTO Advisor
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </div>
    </main>
  );
}
