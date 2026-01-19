'use client';

import { motion } from 'framer-motion';

import { TabType } from './types/imageConfig.types';
import { TAB_DEFINITIONS } from './utils/animationHelpers';

interface ImageEditorTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export default function ImageEditorTabs({ activeTab, onTabChange }: ImageEditorTabsProps) {
  return (
    <div className="flex gap-1 px-6 py-4 bg-gray-50 border-b overflow-x-auto flex-shrink-0">
      {TAB_DEFINITIONS.map((tab) => (
        <motion.button
          key={tab.id}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onTabChange(tab.id)}
          className={`px-4 py-2 rounded-xl font-medium text-sm whitespace-nowrap transition-all ${
            activeTab === tab.id
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          <span className="mr-2">{tab.icon}</span>
          {tab.label}
        </motion.button>
      ))}
    </div>
  );
}