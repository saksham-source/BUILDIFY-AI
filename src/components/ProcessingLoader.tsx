'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, Loader2, Sparkles, Target, TrendingUp, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ProcessingStep } from '@/types';

const steps: ProcessingStep[] = [
  { id: 'understanding', label: 'Understanding your idea', status: 'pending' },
  { id: 'market', label: 'Finding market opportunities', status: 'pending' },
  { id: 'mvp', label: 'Designing MVP features', status: 'pending' },
  { id: 'spec', label: 'Building product spec', status: 'pending' },
];

const stepIcons = [Sparkles, Target, TrendingUp, Zap];

export function ProcessingLoader() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center mb-12"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          className="inline-block mb-6"
        >
          <Sparkles className="w-16 h-16 text-primary-400" />
        </motion.div>
        <h2 className="text-3xl font-bold gradient-text mb-2">Generating Your Startup Plan</h2>
        <p className="text-gray-600">This will only take a moment...</p>
      </motion.div>

      <div className="space-y-4 w-full max-w-md">
        {steps.map((step, index) => {
          const Icon = stepIcons[index];
          const isCompleted = index < activeStep;
          const isActive = index === activeStep;

          return (
            <motion.div
              key={step.id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center gap-4 p-4 rounded-xl glass-card transition-all duration-300 ${
                isActive ? 'border-primary-500/50 bg-primary-500/10' : ''
              }`}
            >
              <div className={`p-2 rounded-lg ${
                isCompleted ? 'bg-green-500/20' : isActive ? 'bg-primary-500/20' : 'bg-gray-500/20'
              }`}>
                {isCompleted ? (
                  <CheckCircle2 className="w-6 h-6 text-green-400" />
                ) : isActive ? (
                  <Loader2 className="w-6 h-6 text-primary-400 animate-spin" />
                ) : (
                  <Icon className="w-6 h-6 text-gray-500" />
                )}
              </div>
              <span className={`font-medium ${
                isCompleted ? 'text-green-400' : isActive ? 'text-gray-900' : 'text-gray-500'
              }`}>
                {step.label}
              </span>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-12 flex gap-2"
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 bg-primary-400 rounded-full"
            animate={{ y: [0, -10, 0] }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.1,
            }}
          />
        ))}
      </motion.div>
    </div>
  );
}
