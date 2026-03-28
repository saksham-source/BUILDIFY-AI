'use client';

import { motion } from 'framer-motion';

interface FeasibilityScoreProps {
  score: number;
}

export function FeasibilityScore({ score }: FeasibilityScoreProps) {
  const getScoreColor = (s: number) => {
    if (s >= 8) return 'text-green-400';
    if (s >= 6) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreLabel = (s: number) => {
    if (s >= 8) return 'Highly Feasible';
    if (s >= 6) return 'Moderately Feasible';
    return 'Challenging';
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card p-8 text-center"
    >
      <div className="mb-4">
        <span className="text-sm uppercase tracking-wider text-gray-600">Feasibility Score</span>
      </div>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
        className="relative inline-block"
      >
        <div className="text-8xl font-bold gradient-text">{score}</div>
        <span className="text-4xl text-gray-500">/10</span>
        <motion.div
          className="absolute inset-0 bg-primary-500/20 rounded-full blur-3xl -z-10"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>
      <div className={`mt-4 text-xl font-medium ${getScoreColor(score)}`}>
        {getScoreLabel(score)}
      </div>
    </motion.div>
  );
}
