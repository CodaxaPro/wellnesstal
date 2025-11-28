'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TEXT_COLORS } from '../../types/textConfig.types';
import { getColorGridAnimation } from '../../utils/animationHelpers';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label?: string;
  icon?: string;
}

export default function ColorPicker({ value, onChange, label = 'Color', icon = '🎨' }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [customColor, setCustomColor] = useState(value);

  const handleColorSelect = (color: string) => {
    onChange(color);
    setCustomColor(color);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-white border-2 border-gray-200 rounded-lg hover:border-purple-300 transition-all"
        title={label}
      >
        <span>{icon}</span>
        <div
          className="w-6 h-6 rounded border-2 border-gray-300"
          style={{ backgroundColor: value }}
        />
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

            {/* Color Grid */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="absolute top-full left-0 mt-2 w-72 bg-white border-2 border-gray-200 rounded-xl shadow-2xl z-50 p-4"
            >
              <div className="text-sm font-bold mb-3 text-gray-700">{label}</div>

              {/* Preset Colors */}
              <div className="grid grid-cols-11 gap-2 mb-4">
                {TEXT_COLORS.map((color, index) => (
                  <motion.button
                    key={color}
                    custom={index}
                    initial="initial"
                    animate="animate"
                    variants={{
                      initial: { opacity: 0, scale: 0 },
                      animate: (i: number) => ({
                        opacity: 1,
                        scale: 1,
                        transition: {
                          delay: i * 0.02,
                          type: 'spring',
                          damping: 15,
                          stiffness: 300,
                        },
                      }),
                    }}
                    whileHover={{ scale: 1.2, zIndex: 10 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleColorSelect(color)}
                    className="w-6 h-6 rounded-lg border-2 transition-all relative group"
                    style={{ 
                      backgroundColor: color,
                      borderColor: value === color ? '#9333EA' : '#E5E7EB',
                      boxShadow: value === color ? '0 0 0 2px rgba(147, 51, 234, 0.3)' : 'none',
                    }}
                    title={color}
                  >
                    {value === color && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute inset-0 flex items-center justify-center text-white text-xs"
                      >
                        ✓
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>

              {/* Custom Color Picker */}
              <div className="border-t pt-4">
                <div className="text-xs font-medium mb-2 text-gray-600">Custom Color</div>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={customColor}
                    onChange={(e) => setCustomColor(e.target.value)}
                    className="w-12 h-12 rounded-lg cursor-pointer border-2 border-gray-200"
                  />
                  <input
                    type="text"
                    value={customColor}
                    onChange={(e) => setCustomColor(e.target.value)}
                    className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-lg text-sm font-mono focus:border-purple-400 focus:outline-none"
                    placeholder="#000000"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleColorSelect(customColor)}
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium text-sm"
                  >
                    Apply
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}