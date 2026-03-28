'use client';

import { motion } from 'framer-motion';
import {
  Target, Users, TrendingUp, DollarSign, Rocket, Brain,
  Smartphone, Scale, ChevronLeft, Copy, RefreshCw, Download
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ReportSection } from '@/components/ReportSection';
import { FeasibilityScore } from '@/components/FeasibilityScore';
import { StartupOverview, ProductSpec } from '@/types';

export default function ReportPage() {
  const router = useRouter();
  const [overview, setOverview] = useState<StartupOverview | null>(null);
  const [productSpec, setProductSpec] = useState<ProductSpec | null>(null);
  const [startupName, setStartupName] = useState('');

  useEffect(() => {
    const overviewData = sessionStorage.getItem('startupOverview');
    const productSpecData = sessionStorage.getItem('productSpec');
    const inputData = sessionStorage.getItem('startupInput');

    if (!overviewData || !inputData) {
      router.push('/');
      return;
    }

    setOverview(JSON.parse(overviewData));
    if (productSpecData) {
      setProductSpec(JSON.parse(productSpecData));
    }
    setStartupName(JSON.parse(inputData).name);
  }, [router]);

  const handleCopy = () => {
    const reportText = generateReportText();
    navigator.clipboard.writeText(reportText);
    alert('Report copied to clipboard!');
  };

  const handleStartOver = () => {
    sessionStorage.clear();
    router.push('/');
  };

  const generateReportText = () => {
    if (!overview) return '';

    let report = `# ${startupName} - Startup Brief\n\n`;
    report += `## One-Line Pitch\n${overview.oneLinePitch}\n\n`;
    report += `## Problem & Solution\n${overview.problemStatement}\n\n`;
    report += `## Target Audience\n${overview.targetAudience}\n\n`;
    report += `## Market Opportunity\n${overview.marketOpportunity}\n\n`;
    report += `## Revenue Model\n${overview.monetizationStrategy}\n\n`;
    report += `## MVP Features\n${overview.mvpFeatures.map(f => `- ${f}`).join('\n')}\n\n`;
    report += `## Feasibility Score: ${overview.feasibilityScore}/10\n`;

    return report;
  };

  if (!overview) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-600">Loading...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap items-center justify-between gap-4 mb-8"
        >
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => router.push('/product-spec')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </motion.button>

          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCopy}
              className="px-4 py-2 rounded-lg bg-white/80 border border-gray-200 
                         hover:border-white/20 transition-all flex items-center gap-2"
            >
              <Copy className="w-4 h-4" />
              Copy
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleStartOver}
              className="px-4 py-2 rounded-lg bg-white/80 border border-gray-200 
                         hover:border-white/20 transition-all flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              New Idea
            </motion.button>
          </div>
        </motion.div>

        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/20 text-primary-400 text-sm mb-6">
            <Rocket className="w-4 h-4" />
            Investor-Ready Startup Brief
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="gradient-text">{startupName}</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {overview.oneLinePitch}
          </p>
        </motion.header>

        <div className="space-y-6">
          <ReportSection title="Problem & Solution" icon={Target} delay={0.15}>
            <p>{overview.problemStatement}</p>
          </ReportSection>

          <ReportSection title="Target Audience" icon={Users} delay={0.2}>
            <p>{overview.targetAudience}</p>
          </ReportSection>

          <ReportSection title="Market Analysis" icon={TrendingUp} delay={0.25}>
            <p>{overview.marketOpportunity}</p>
          </ReportSection>

          <ReportSection title="Revenue Model" icon={DollarSign} delay={0.3}>
            <p>{overview.monetizationStrategy}</p>
          </ReportSection>

          <ReportSection title="MVP Plan" icon={Rocket} delay={0.35}>
            <ul className="space-y-2">
              {overview.mvpFeatures.map((feature, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-primary-400 mt-1">•</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </ReportSection>

          {productSpec && (
            <>
              <ReportSection title="Product Architecture" icon={Brain} delay={0.4}>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-primary-400 mb-2">Core Features</h4>
                    <ul className="space-y-1 text-sm">
                      {productSpec.coreFeatures.slice(0, 4).map((f, i) => (
                        <li key={i}>• {f}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-primary-400 mb-2">Tech Stack</h4>
                    <ul className="space-y-1 text-sm">
                      {Object.entries(productSpec.techStack).map(([key, value]) => (
                        <li key={key}><span className="text-gray-500">{key}:</span> {value}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </ReportSection>

              <ReportSection title="App Pages & Features" icon={Smartphone} delay={0.45}>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {productSpec.pages.map((page, i) => (
                    <div key={i} className="p-3 bg-white/60 rounded-lg">
                      <h4 className="font-medium text-sm">{page.name}</h4>
                      <p className="text-xs text-gray-500 mt-1">{page.purpose}</p>
                    </div>
                  ))}
                </div>
              </ReportSection>
            </>
          )}

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="pt-6"
          >
            <FeasibilityScore score={overview.feasibilityScore} />
          </motion.div>
        </div>

        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 text-center text-gray-500 text-sm"
        >
          <p>Generated by Buildify AI</p>
          <p className="mt-1">Powered by MiniMax API</p>
        </motion.footer>
      </div>
    </main>
  );
}
