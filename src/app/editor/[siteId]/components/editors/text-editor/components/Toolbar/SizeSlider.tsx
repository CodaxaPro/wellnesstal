'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface SizeSliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  label?: string;
  icon?: string;
  unit?: string;
}

export default function SizeSlider({ 
  value, 
  onChange, 
  min = 8, 
  max = 72, 
  label = 'Size',
  icon = '🔤',
  unit = 'px',
}: SizeSliderProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [localValue, setLocalValue] = useState(value);

  const handleChange = (newValue: number) => {
    setLocalValue(newValue);
    onChange(newValue);
  };

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 px-3 py-2 bg-white border-2 border-gray-200 rounded-lg hover:border-purple-300 transition-all"
        title={label}
      >
        <span>{icon}</span>
        <motion.span 
          key={localValue}
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-sm font-bold text-purple-600 min-w-[40px] text-center"
        >
          {localValue}{unit}
        </motion.span>
        <motion.span
          animate={{ rotate: isExpanded ? 180 : 0 }}
          className="text-gray-400 text-xs"
        >
          ▼
        </motion.span>
      </motion.button>

      <AnimatePresence>
        {isExpanded && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsExpanded(false)}
              className="fixed inset-0 z-40"
            />

            {/* Slider Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="absolute top-full left-0 mt-2 w-64 bg-white border-2 border-gray-200 rounded-xl shadow-2xl z-50 p-4"
            >
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-bold text-gray-700">{label}</span>
                <span className="text-lg font-bold text-purple-600">
                  {localValue}{unit}
                </span>
              </div>

              {/* Slider */}
              <div className="relative">
                <input
                  type="range"
                  min={min}
                  max={max}
                  value={localValue}
                  onChange={(e) => handleChange(Number(e.target.value))}
                  className="w-full h-2 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full appearance-none cursor-pointer slider-thumb"
                  style={{
                    background: `linear-gradient(to right, 
                      #9333EA 0%, 
                      #EC4899 ${((localValue - min) / (max - min)) * 100}%, 
                      #E5E7EB ${((localValue - min) / (max - min)) * 100}%, 
                      #E5E7EB 100%)`
                  }}
                />
              </div>

              {/* Quick Presets */}
              <div className="grid grid-cols-4 gap-2 mt-4">
                {[
                  { label: 'XS', value: 12 },
                  { label: 'S', value: 16 },
                  { label: 'M', value: 24 },
                  { label: 'L', value: 32 },
                  { label: 'XL', value: 48 },
                  { label: '2XL', value: 60 },
                ].map((preset) => (
                  <motion.button
                    key={preset.label}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleChange(preset.value)}
                    className={`
                      px-2 py-1.5 rounded-lg text-xs font-bold transition-all
                      ${localValue === preset.value 
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }
                    `}
                  >
                    {preset.label}
                  </motion.button>
                ))}
              </div>

              {/* Manual Input */}
              <div className="mt-4 flex gap-2">
                <input
                  type="number"
                  value={localValue}
                  onChange={(e) => handleChange(Number(e.target.value))}
                  min={min}
                  max={max}
                  className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-lg text-sm font-mono focus:border-purple-400 focus:outline-none"
                />
                <span className="flex items-center text-sm text-gray-500">{unit}</span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style jsx>{`
        .slider-thumb::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #9333EA, #EC4899);
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(147, 51, 234, 0.4);
          transition: all 0.2s;
        }
        .slider-thumb::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 4px 12px rgba(147, 51, 234, 0.6);
        }
        .slider-thumb::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #9333EA, #EC4899);
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 8px rgba(147, 51, 234, 0.4);
        }
      `}</style>
    </div>
  );
}