'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface ReportSectionProps {
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
  delay?: number;
}

export function ReportSection({ title, icon: Icon, children, delay = 0 }: ReportSectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="glass-card p-8"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-primary-500/20">
          <Icon className="w-5 h-5 text-primary-400" />
        </div>
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>
      <div className="text-gray-700 space-y-3">
        {children}
      </div>
    </motion.section>
  );
}
