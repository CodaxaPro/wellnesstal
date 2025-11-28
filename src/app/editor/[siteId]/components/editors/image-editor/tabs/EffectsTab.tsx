'use client';

import { motion } from 'framer-motion';
import { ImageConfig } from '../types/imageConfig.types';
import { FILTER_PRESETS } from '../utils/filterHelpers';

interface EffectsTabProps {
  config: ImageConfig;
  updateConfig: <K extends keyof ImageConfig>(key: K, value: ImageConfig[K]) => void;
}

export default function EffectsTab({ config, updateConfig }: EffectsTabProps) {
  return (
    <motion.div
      key="effects"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="space-y-6"
    >
      <div>
        <label className="block font-bold mb-3">🎭 Preset Filters</label>
        <div className="grid grid-cols-3 gap-2">
          {FILTER_PRESETS.map(f => (
            <button
              key={f.id}
              onClick={() => updateConfig('filter', f.id as ImageConfig['filter'])}
              className={`p-3 rounded-xl text-sm font-bold ${
                config.filter === f.id ? 'bg-purple-600 text-white' : 'bg-gray-100'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block font-bold mb-3">🌑 Shadow</label>
        {[
          { key: 'shadowX' as const, label: 'X Offset', min: -20, max: 20 },
          { key: 'shadowY' as const, label: 'Y Offset', min: -20, max: 20 },
          { key: 'shadowBlur' as const, label: 'Blur', min: 0, max: 40 },
        ].map(({ key, label, min, max }) => (
          <div key={key} className="mb-3">
            <div className="flex justify-between mb-1">
              <span className="text-sm">{label}</span>
              <span className="text-sm font-mono text-purple-600">{config[key]}</span>
            </div>
            <input
              type="range"
              min={min}
              max={max}
              value={config[key]}
              onChange={(e) => updateConfig(key, Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
            />
          </div>
        ))}
      </div>

      <div>
        <label className="block font-bold mb-3">🎨 Overlay</label>
        <div className="flex gap-3 mb-3">
          <input
            type="color"
            value={config.overlayColor}
            onChange={(e) => updateConfig('overlayColor', e.target.value)}
            className="w-20 h-12 rounded-xl cursor-pointer"
          />
          <div className="flex-1">
            <div className="flex justify-between mb-1">
              <span className="text-sm">Opacity</span>
              <span className="text-sm font-mono text-purple-600">{config.overlayOpacity}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={config.overlayOpacity}
              onChange={(e) => updateConfig('overlayOpacity', Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
            />
          </div>
        </div>
      </div>

      <div>
        <div className="flex justify-between mb-2">
          <label className="font-bold">🔦 Vignette</label>
          <span className="text-purple-600 font-mono">{config.vignette}</span>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          value={config.vignette}
          onChange={(e) => updateConfig('vignette', Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
        />
      </div>
    </motion.div>
  );
}