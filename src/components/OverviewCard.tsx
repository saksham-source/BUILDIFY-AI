'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface OverviewCardProps {
  title: string;
  content: string | string[];
  icon: LucideIcon;
  color: string;
  delay?: number;
}

export function OverviewCard({ title, content, icon: Icon, color, delay = 0 }: OverviewCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="glass-card p-6 hover:border-white/20 transition-all duration-300"
    >
      <div className={`inline-flex p-3 rounded-xl ${color} mb-4`}>
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-semibold mb-3">{title}</h3>
      {Array.isArray(content) ? (
        <ul className="space-y-2">
          {content.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-gray-700">
              <span className="text-primary-400 mt-1">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-700">{content}</p>
      )}
    </motion.div>
  );
}
