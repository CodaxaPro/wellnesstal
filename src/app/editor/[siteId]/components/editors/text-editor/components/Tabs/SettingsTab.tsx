'use client';

import { motion } from 'framer-motion';
import { TextConfig } from '../../types/textConfig.types';
import { getTabSwitchAnimation } from '../../utils/animationHelpers';

interface SettingsTabProps {
  config: TextConfig;
  updateConfig: <K extends keyof TextConfig>(key: K, value: TextConfig[K]) => void;
  applyPreset: (preset: 'hero' | 'subheading' | 'body' | 'caption') => void;
}

export default function SettingsTab({ config, updateConfig, applyPreset }: SettingsTabProps) {
  const entranceAnimations = [
    { value: 'none', label: 'None', icon: '⭕' },
    { value: 'fade', label: 'Fade', icon: '🌫️' },
    { value: 'slide-up', label: 'Slide Up', icon: '⬆️' },
    { value: 'slide-down', label: 'Slide Down', icon: '⬇️' },
    { value: 'typewriter', label: 'Typewriter', icon: '⌨️' },
    { value: 'bounce', label: 'Bounce', icon: '🎾' },
  ];

  const hoverEffects = [
    { value: 'none', label: 'None', icon: '⭕' },
    { value: 'glow', label: 'Glow', icon: '✨' },
    { value: 'lift', label: 'Lift', icon: '⬆️' },
    { value: 'color-shift', label: 'Color Shift', icon: '🎨' },
    { value: 'scale', label: 'Scale', icon: '🔍' },
  ];

  const settingItems = [
    { 
      key: 'autoSave', 
      label: 'Auto Save', 
      description: 'Automatically save changes',
      icon: '💾',
    },
    { 
      key: 'spellCheck', 
      label: 'Spell Check', 
      description: 'Enable spell checking',
      icon: '✅',
    },
    { 
      key: 'showWordCount', 
      label: 'Word Count', 
      description: 'Show word count in footer',
      icon: '📝',
    },
    { 
      key: 'showReadingTime', 
      label: 'Reading Time', 
      description: 'Show estimated reading time',
      icon: '⏱️',
    },
  ];

  return (
    <motion.div
      {...getTabSwitchAnimation()}
      className="space-y-6"
    >
      {/* Entrance Animation */}
      <div>
        <label className="block font-bold mb-3 text-gray-700">🎬 Entrance Animation</label>
        <div className="grid grid-cols-2 gap-2">
          {entranceAnimations.map((anim, index) => (
            <motion.button
              key={anim.value}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => updateConfig('entrance', anim.value as any)}
              className={`
                py-3 rounded-xl font-medium transition-all text-sm
                ${config.entrance === anim.value
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }
              `}
            >
              <span className="mr-2">{anim.icon}</span>
              {anim.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Hover Effect */}
      <div>
        <label className="block font-bold mb-3 text-gray-700">🖱️ Hover Effect</label>
        <div className="grid grid-cols-2 gap-2">
          {hoverEffects.map((effect, index) => (
            <motion.button
              key={effect.value}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + index * 0.05 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => updateConfig('hover', effect.value as any)}
              className={`
                py-3 rounded-xl font-medium transition-all text-sm
                ${config.hover === effect.value
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }
              `}
            >
              <span className="mr-2">{effect.icon}</span>
              {effect.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Animation Duration */}
      <div>
        <div className="flex justify-between mb-2">
          <label className="font-bold text-gray-700">⏱️ Animation Duration</label>
          <span className="text-purple-600 font-mono text-sm">{config.duration}s</span>
        </div>
        <input
          type="range"
          min={0.1}
          max={2}
          step={0.1}
          value={config.duration}
          onChange={(e) => updateConfig('duration', Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>Fast (0.1s)</span>
          <span>Slow (2s)</span>
        </div>
      </div>

      {/* Settings Toggles */}
      <div>
        <label className="block font-bold mb-3 text-gray-700">⚙️ Editor Settings</label>
        <div className="space-y-2">
          {settingItems.map((item, index) => (
            <motion.label
              key={item.key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.05 }}
              className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-all"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <div className="font-bold text-gray-700">{item.label}</div>
                  <div className="text-xs text-gray-500">{item.description}</div>
                </div>
              </div>
              <motion.input
                whileTap={{ scale: 0.9 }}
                type="checkbox"
                checked={config[item.key as keyof TextConfig] as boolean}
                onChange={(e) => updateConfig(item.key as keyof TextConfig, e.target.checked as any)}
                className="w-6 h-6 accent-purple-600 cursor-pointer"
              />
            </motion.label>
          ))}
        </div>
      </div>

      {/* Quick Style Presets */}
      <div>
        <label className="block font-bold mb-3 text-gray-700">⚡ Quick Style Presets</label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { preset: 'hero' as const, label: 'Hero', icon: '🎯', desc: '48px Bold' },
            { preset: 'subheading' as const, label: 'Subheading', icon: '📰', desc: '24px Semi' },
            { preset: 'body' as const, label: 'Body', icon: '📝', desc: '16px Regular' },
            { preset: 'caption' as const, label: 'Caption', icon: '💬', desc: '14px Light' },
          ].map((preset, index) => (
            <motion.button
              key={preset.preset}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + index * 0.05 }}
              whileHover={{ scale: 1.05, boxShadow: '0 4px 12px rgba(147, 51, 234, 0.3)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => applyPreset(preset.preset)}
              className="p-4 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 hover:from-purple-200 hover:to-pink-200 text-left transition-all"
            >
              <div className="text-2xl mb-1">{preset.icon}</div>
              <div className="font-bold text-purple-700">{preset.label}</div>
              <div className="text-xs text-purple-600">{preset.desc}</div>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}