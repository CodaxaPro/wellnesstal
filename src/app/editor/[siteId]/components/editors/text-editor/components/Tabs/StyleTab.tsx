'use client';

import { motion } from 'framer-motion';

import { TextConfig , HIGHLIGHT_COLORS } from '../../types/textConfig.types';
import { getTabSwitchAnimation } from '../../utils/animationHelpers';
import ColorPicker from '../Toolbar/ColorPicker';
import SizeSlider from '../Toolbar/SizeSlider';

interface StyleTabProps {
  config: TextConfig;
  updateConfig: <K extends keyof TextConfig>(key: K, value: TextConfig[K]) => void;
}

export default function StyleTab({ config, updateConfig }: StyleTabProps) {
  const fontWeights = [
    { value: 300, label: 'Light' },
    { value: 400, label: 'Regular' },
    { value: 500, label: 'Medium' },
    { value: 600, label: 'Semi Bold' },
    { value: 700, label: 'Bold' },
    { value: 800, label: 'Extra Bold' },
  ];

  return (
    <motion.div
      {...getTabSwitchAnimation()}
      className="space-y-6"
    >
      {/* Font Size */}
      <div>
        <label className="block font-bold mb-3 text-gray-700">🔤 Font Size</label>
        <SizeSlider
          value={config.fontSize}
          onChange={(size) => updateConfig('fontSize', size)}
          min={8}
          max={72}
          label="Font Size"
          icon="🔤"
        />
      </div>

      {/* Font Weight */}
      <div>
        <label className="block font-bold mb-3 text-gray-700">💪 Font Weight</label>
        <div className="grid grid-cols-3 gap-2">
          {fontWeights.map((weight, index) => (
            <motion.button
              key={weight.value}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => updateConfig('fontWeight', weight.value)}
              className={`
                py-2.5 rounded-xl font-bold transition-all text-sm
                ${config.fontWeight === weight.value
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }
              `}
              style={{ fontWeight: weight.value }}
            >
              {weight.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Line Height */}
      <div>
        <div className="flex justify-between mb-2">
          <label className="font-bold text-gray-700">📏 Line Height</label>
          <span className="text-purple-600 font-mono text-sm">{config.lineHeight}</span>
        </div>
        <input
          type="range"
          min={1}
          max={3}
          step={0.1}
          value={config.lineHeight}
          onChange={(e) => updateConfig('lineHeight', Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
        />
      </div>

      {/* Letter Spacing */}
      <div>
        <div className="flex justify-between mb-2">
          <label className="font-bold text-gray-700">↔️ Letter Spacing</label>
          <span className="text-purple-600 font-mono text-sm">{config.letterSpacing}px</span>
        </div>
        <input
          type="range"
          min={-2}
          max={10}
          step={0.5}
          value={config.letterSpacing}
          onChange={(e) => updateConfig('letterSpacing', Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
        />
      </div>

      {/* Text Color */}
      <div>
        <label className="block font-bold mb-3 text-gray-700">🎨 Text Color</label>
        <ColorPicker
          value={config.textColor}
          onChange={(color) => updateConfig('textColor', color)}
          label="Text Color"
          icon="🎨"
        />
      </div>

      {/* Background/Highlight Color */}
      <div>
        <label className="block font-bold mb-3 text-gray-700">🖌️ Highlight Color</label>
        <div className="grid grid-cols-7 gap-2">
          {HIGHLIGHT_COLORS.map((color, index) => (
            <motion.button
              key={color}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.03 }}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => updateConfig('backgroundColor', color)}
              className="w-10 h-10 rounded-lg border-2 transition-all"
              style={{
                backgroundColor: color,
                borderColor: config.backgroundColor === color ? '#9333EA' : '#E5E7EB',
                boxShadow: config.backgroundColor === color ? '0 0 0 2px rgba(147, 51, 234, 0.3)' : 'none',
              }}
              title={color}
            >
              {config.backgroundColor === color && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-xs"
                >
                  ✓
                </motion.span>
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Text Transform */}
      <div>
        <label className="block font-bold mb-3 text-gray-700">🔠 Text Transform</label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { value: 'none', label: 'None', example: 'Normal Text' },
            { value: 'uppercase', label: 'Uppercase', example: 'UPPERCASE' },
            { value: 'lowercase', label: 'Lowercase', example: 'lowercase' },
            { value: 'capitalize', label: 'Capitalize', example: 'Capitalize Each' },
          ].map((transform, index) => (
            <motion.button
              key={transform.value}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => updateConfig('textTransform', transform.value as any)}
              className={`
                py-3 rounded-xl font-medium transition-all text-sm
                ${config.textTransform === transform.value
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }
              `}
              style={{ textTransform: transform.value as any }}
            >
              {transform.example}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Quick Style Presets */}
      <div>
        <label className="block font-bold mb-3 text-gray-700">⚡ Quick Presets</label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: 'Hero', preset: 'hero' as const, icon: '🎯' },
            { label: 'Subheading', preset: 'subheading' as const, icon: '📰' },
            { label: 'Body', preset: 'body' as const, icon: '📝' },
            { label: 'Caption', preset: 'caption' as const, icon: '💬' },
          ].map((preset, index) => (
            <motion.button
              key={preset.preset}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.05 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                const presets = {
                  hero: { fontSize: 48, fontWeight: 700, lineHeight: 1.2, letterSpacing: -1 },
                  subheading: { fontSize: 24, fontWeight: 600, lineHeight: 1.4, letterSpacing: -0.5 },
                  body: { fontSize: 16, fontWeight: 400, lineHeight: 1.6, letterSpacing: 0 },
                  caption: { fontSize: 14, fontWeight: 400, lineHeight: 1.5, letterSpacing: 0 },
                };
                const presetValues = presets[preset.preset];
                Object.entries(presetValues).forEach(([key, value]) => {
                  updateConfig(key as any, value);
                });
              }}
              className="py-3 rounded-xl font-medium bg-gradient-to-r from-purple-100 to-pink-100 hover:from-purple-200 hover:to-pink-200 text-purple-700 transition-all"
            >
              <span className="mr-2">{preset.icon}</span>
              {preset.label}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}