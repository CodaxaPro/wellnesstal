'use client';

import { motion } from 'framer-motion';

import { TextStats } from '../../types/textConfig.types';

import HeaderStats from './HeaderStats';

interface TextEditorHeaderProps {
  fieldPath: string;
  stats: TextStats;
  onCancel: () => void;
}

export default function TextEditorHeader({ fieldPath, stats, onCancel }: TextEditorHeaderProps) {
  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.1, duration: 0.4 }}
      className="drag-handle bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 text-white px-6 py-4 flex justify-between items-center cursor-grab active:cursor-grabbing select-none flex-shrink-0"
    >
      <div className="flex items-center gap-3">
        <motion.div
          className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur"
          whileHover={{ rotate: 360, scale: 1.1 }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-xl">✍️</span>
        </motion.div>
        <div>
          <div className="font-bold text-base">Text Editor Pro</div>
          <div className="text-xs opacity-90">{fieldPath}</div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <HeaderStats stats={stats} />
        
        <motion.button
          onClick={onCancel}
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center text-xl transition-all"
        >
          ×
        </motion.button>
      </div>
    </motion.div>
  );
}