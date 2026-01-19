'use client';

import { motion } from 'framer-motion';

import { ImageConfig } from '../types/imageConfig.types';

interface AdjustTabProps {
  config: ImageConfig;
  updateConfig: <K extends keyof ImageConfig>(key: K, value: ImageConfig[K]) => void;
}

export default function AdjustTab({ config, updateConfig }: AdjustTabProps) {
  const adjustments = [
    { key: 'brightness' as const, label: '☀️ Brightness', min: -100, max: 100 },
    { key: 'contrast' as const, label: '◐ Contrast', min: -100, max: 100 },
    { key: 'saturation' as const, label: '🎨 Saturation', min: -100, max: 100 },
    { key: 'blur' as const, label: '🌫️ Blur', min: 0, max: 20 },
    { key: 'hue' as const, label: '🌈 Hue Rotate', min: 0, max: 360 },
    { key: 'opacity' as const, label: '👻 Opacity', min: 0, max: 100 },
  ];

  return (
    <motion.div
      key="adjust"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="space-y-6"
    >
      {adjustments.map(({ key, label, min, max }) => (
        <div key={key}>
          <div className="flex justify-between mb-2">
            <label className="font-bold">{label}</label>
            <span className="text-purple-600 font-mono">{config[key]}</span>
          </div>
          <input
            type="range"
            min={min}
            max={max}
            value={config[key] as number}
            onChange={(e) => updateConfig(key, Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
          />
        </div>
      ))}

      <div className="flex gap-3">
        <button
          onClick={() => updateConfig('grayscale', !config.grayscale)}
          className={`flex-1 py-3 rounded-xl font-bold ${config.grayscale ? 'bg-purple-600 text-white' : 'bg-gray-100'}`}
        >
          Grayscale
        </button>
        <button
          onClick={() => updateConfig('sepia', !config.sepia)}
          className={`flex-1 py-3 rounded-xl font-bold ${config.sepia ? 'bg-purple-600 text-white' : 'bg-gray-100'}`}
        >
          Sepia
        </button>
        <button
          onClick={() => updateConfig('invert', !config.invert)}
          className={`flex-1 py-3 rounded-xl font-bold ${config.invert ? 'bg-purple-600 text-white' : 'bg-gray-100'}`}
        >
          Invert
        </button>
      </div>
    </motion.div>
  );
}