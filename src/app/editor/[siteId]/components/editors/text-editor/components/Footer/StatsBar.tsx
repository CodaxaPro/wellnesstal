'use client';

import { motion } from 'framer-motion';
import { TextStats } from '../../types/textConfig.types';
import { formatReadingTime } from '../../utils/textHelpers';

interface StatsBarProps {
  stats: TextStats;
  showWordCount?: boolean;
  showReadingTime?: boolean;
}

export default function StatsBar({ 
  stats, 
  showWordCount = true, 
  showReadingTime = true 
}: StatsBarProps) {
  const statItems = [
    { 
      label: 'Characters', 
      value: stats.characters.toLocaleString(),
      icon: '🔤',
      show: true,
    },
    { 
      label: 'Words', 
      value: stats.words.toLocaleString(),
      icon: '📝',
      show: showWordCount,
    },
    { 
      label: 'Sentences', 
      value: stats.sentences.toLocaleString(),
      icon: '📄',
      show: true,
    },
    { 
      label: 'Paragraphs', 
      value: stats.paragraphs.toLocaleString(),
      icon: '¶',
      show: true,
    },
    { 
      label: 'Reading Time', 
      value: formatReadingTime(stats.readingTime),
      icon: '⏱️',
      show: showReadingTime,
    },
  ].filter(item => item.show);

  return (
    <div className="flex items-center gap-4 text-sm">
      {statItems.map((item, index) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="flex items-center gap-1.5 group"
        >
          <motion.span 
            whileHover={{ scale: 1.2, rotate: 10 }}
            className="text-base"
          >
            {item.icon}
          </motion.span>
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 group-hover:text-purple-600 transition-colors">
              {item.label}
            </span>
            <motion.span 
              key={item.value}
              initial={{ y: -5, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="font-bold text-gray-700"
            >
              {item.value}
            </motion.span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}