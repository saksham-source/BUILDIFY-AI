'use client';

import { motion } from 'framer-motion';
import { ArrowRight, ChevronLeft, FileText, Layers, Server, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { StartupOverview, ProductSpec } from '@/types';

export default function ProductSpecPage() {
  const router = useRouter();
  const [productSpec, setProductSpec] = useState<ProductSpec | null>(null);
  const [startupName, setStartupName] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const generateProductSpec = async () => {
      const overviewData = sessionStorage.getItem('startupOverview');
      const inputData = sessionStorage.getItem('startupInput');
      const savedSpec = sessionStorage.getItem('productSpec');
      
      if (!overviewData || !inputData) {
        router.push('/');
        return;
      }

      if (savedSpec) {
        setProductSpec(JSON.parse(savedSpec));
        setStartupName(JSON.parse(inputData).name);
        setIsLoading(false);
        return;
      }

      const overview: StartupOverview = JSON.parse(overviewData);
      const { name } = JSON.parse(inputData);

      try {
        const response = await fetch('/api/generate-product-spec', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ overview, startupName: name }),
        });

        if (!response.ok) throw new Error('Failed to generate product spec');

        const spec: ProductSpec = await response.json();
        sessionStorage.setItem('productSpec', JSON.stringify(spec));
        setProductSpec(spec);
        setStartupName(name);
      } catch (error) {
        console.error('Error generating product spec:', error);
      } finally {
        setIsLoading(false);
      }
    };

    generateProductSpec();
  }, [router]);

  const handleViewReport = () => {
    router.push('/report');
  };

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="inline-block mb-4"
          >
            <Layers className="w-12 h-12 text-primary-400" />
          </motion.div>
          <p className="text-gray-600">Building your product specification...</p>
        </div>
      </main>
    );
  }

  if (!productSpec) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-red-400">Failed to generate product spec</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.push('/overview')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          Back to Overview
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">{startupName}</span>
          </h1>
          <p className="text-xl text-gray-600">Product Specification</p>
        </motion.div>

        <div className="space-y-6">
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary-500/20">
                <Layers className="w-5 h-5 text-primary-400" />
              </div>
              <h2 className="text-xl font-semibold">Core Features</h2>
            </div>
            <ul className="grid md:grid-cols-2 gap-3">
              {productSpec.coreFeatures.map((feature, i) => (
                <li key={i} className="flex items-start gap-2 text-gray-700">
                  <span className="text-primary-400 mt-1">•</span>
                  {feature}
                </li>
              ))}
            </ul>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-purple-500/20">
                <FileText className="w-5 h-5 text-purple-400" />
              </div>
              <h2 className="text-xl font-semibold">Pages Required</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {productSpec.pages.map((page, i) => (
                <div key={i} className="p-4 bg-white/60 rounded-lg">
                  <h3 className="font-medium text-primary-400 mb-1">{page.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{page.purpose}</p>
                  <div className="flex flex-wrap gap-1">
                    {page.keyElements.slice(0, 3).map((element, j) => (
                      <span key={j} className="text-xs px-2 py-1 bg-white/80 rounded">
                        {element}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <Users className="w-5 h-5 text-blue-400" />
              </div>
              <h2 className="text-xl font-semibold">User Flow</h2>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-gray-700">
              {productSpec.userFlow.map((step, i) => (
                <span key={i} className="flex items-center gap-2">
                  {step}
                  {i < productSpec.userFlow.length - 1 && (
                    <ArrowRight className="w-4 h-4 text-gray-500" />
                  )}
                </span>
              ))}
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-green-500/20">
                <Server className="w-5 h-5 text-green-400" />
              </div>
              <h2 className="text-xl font-semibold">Tech Stack</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(productSpec.techStack).map(([key, value]) => (
                <div key={key} className="text-center p-4 bg-white/60 rounded-lg">
                  <div className="text-sm text-gray-500 uppercase mb-1">{key}</div>
                  <div className="font-medium text-primary-400">{value}</div>
                </div>
              ))}
            </div>
          </motion.section>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center"
        >
          <motion.button
            onClick={handleViewReport}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-primary-500 to-purple-500 
                       font-semibold text-gray-900 glow-button inline-flex items-center gap-3"
          >
            View Final Report
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </div>
    </main>
  );
}
