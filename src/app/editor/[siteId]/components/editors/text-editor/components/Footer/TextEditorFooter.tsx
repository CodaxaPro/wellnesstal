'use client';

import { motion } from 'framer-motion';
import StatsBar from './StatsBar';
import { TextStats, TextConfig } from '../../types/textConfig.types';

interface TextEditorFooterProps {
  stats: TextStats;
  config: TextConfig;
  onReset: () => void;
  onCancel: () => void;
  onSave: () => void;
}

export default function TextEditorFooter({ 
  stats, 
  config, 
  onReset, 
  onCancel, 
  onSave 
}: TextEditorFooterProps) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.4, duration: 0.3 }}
      className="flex items-center justify-between gap-4 px-6 py-4 bg-gray-50 border-t flex-shrink-0"
    >
      {/* Left: Stats */}
      <StatsBar 
        stats={stats} 
        showWordCount={config.showWordCount}
        showReadingTime={config.showReadingTime}
      />

      {/* Right: Actions */}
      <div className="flex gap-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onReset}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-all"
        >
          🔄 Reset
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onCancel}
          className="px-5 py-2 bg-white border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all"
        >
          Cancel
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05, boxShadow: '0 8px 20px rgba(147, 51, 234, 0.4)' }}
          whileTap={{ scale: 0.98 }}
          onClick={onSave}
          disabled={!config.content.trim()}
          className="px-8 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-bold hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          ✅ Apply Changes
        </motion.button>
      </div>
    </motion.div>
  );
}