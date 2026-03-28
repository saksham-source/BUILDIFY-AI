'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface OverviewCardProps {
  title: string;
  content: string | string[] | Record<string, any>;
  icon: LucideIcon;
  color: string;
  delay?: number;
}

export function OverviewCard({ title, content, icon: Icon, color, delay = 0 }: OverviewCardProps) {
  const renderContent = () => {
    if (Array.isArray(content)) {
      return (
        <ul className="space-y-2">
          {content.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-gray-700">
              <span className="text-primary-400 mt-1">•</span>
              <span>{typeof item === 'object' ? JSON.stringify(item) : item}</span>
            </li>
          ))}
        </ul>
      );
    }

    if (typeof content === 'object' && content !== null) {
      return (
        <div className="text-gray-700 space-y-2">
          {Object.entries(content).map(([k, v]) => (
            <div key={k}>
              <strong className="capitalize">{k}:</strong> {typeof v === 'object' ? JSON.stringify(v) : String(v)}
            </div>
          ))}
        </div>
      );
    }

    return <p className="text-gray-700">{String(content)}</p>;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="glass-card p-6 border border-white/10 hover:border-white/20 transition-all duration-300"
    >
      <div className={`inline-flex p-3 rounded-xl ${color} mb-4`}>
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-semibold mb-3">{title}</h3>
      {renderContent()}
    </motion.div>
  );
}
