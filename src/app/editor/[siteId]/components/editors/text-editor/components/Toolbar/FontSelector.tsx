'use client';

import { useState } from 'react';

import { motion, AnimatePresence } from 'framer-motion';

import { FONT_FAMILIES } from '../../types/textConfig.types';
import { getSlideInAnimation } from '../../utils/animationHelpers';

interface FontSelectorProps {
  value: string;
  onChange: (font: string) => void;
}

export default function FontSelector({ value, onChange }: FontSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const currentFont = FONT_FAMILIES.find(f => f.value === value) || FONT_FAMILIES[0];

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 bg-white border-2 border-gray-200 rounded-lg hover:border-purple-300 transition-all flex items-center gap-2 min-w-[160px]"
      >
        <span className="text-sm font-medium" style={{ fontFamily: currentFont.value }}>
          {currentFont.label}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="ml-auto text-gray-400"
        >
          ▼
        </motion.span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40"
            />

            {/* Dropdown */}
            <motion.div
              {...getSlideInAnimation('up')}
              className="absolute top-full left-0 mt-2 w-64 bg-white border-2 border-gray-200 rounded-xl shadow-2xl z-50 max-h-80 overflow-y-auto"
            >
              {/* Group by category */}
              {['Sans Serif', 'Serif', 'Monospace', 'Handwriting', 'Display'].map(category => {
                const fontsInCategory = FONT_FAMILIES.filter(f => f.category === category);
                if (fontsInCategory.length === 0) {
return null;
}

                return (
                  <div key={category} className="py-2">
                    <div className="px-3 py-1 text-xs font-bold text-gray-400 uppercase">
                      {category}
                    </div>
                    {fontsInCategory.map((font, index) => (
                      <motion.button
                        key={font.value}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.03 }}
                        onClick={() => {
                          onChange(font.value);
                          setIsOpen(false);
                        }}
                        className={`
                          w-full px-4 py-2.5 text-left hover:bg-purple-50 transition-all
                          ${value === font.value ? 'bg-purple-100 text-purple-700 font-medium' : 'text-gray-700'}
                        `}
                        style={{ fontFamily: font.value }}
                      >
                        {font.label}
                      </motion.button>
                    ))}
                  </div>
                );
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}