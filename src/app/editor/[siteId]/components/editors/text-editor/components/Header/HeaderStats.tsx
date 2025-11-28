'use client';

import { motion } from 'framer-motion';
import { TextStats } from '../../types/textConfig.types';
import { formatReadingTime } from '../../utils/textHelpers';

interface HeaderStatsProps {
  stats: TextStats;
}

export default function HeaderStats({ stats }: HeaderStatsProps) {
  const statItems = [
    { label: 'Words', value: stats.words, icon: '📝' },
    { label: 'Characters', value: stats.characters, icon: '🔤' },
    { label: 'Reading', value: formatReadingTime(stats.readingTime), icon: '⏱️' },
  ];

  return (
    <div className="flex items-center gap-3">
      {statItems.map((item, index) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 + index * 0.1 }}
          className="flex items-center gap-1.5 bg-white/10 backdrop-blur px-3 py-1.5 rounded-lg"
        >
          <span className="text-sm">{item.icon}</span>
          <div className="flex flex-col">
            <span className="text-xs opacity-80">{item.label}</span>
            <span className="text-sm font-bold">{item.value}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}