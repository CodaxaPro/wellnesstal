'use client';

import { motion } from 'framer-motion';

import { ImageConfig } from '../types/imageConfig.types';

interface AnimateTabProps {
  config: ImageConfig;
  updateConfig: <K extends keyof ImageConfig>(key: K, value: ImageConfig[K]) => void;
}

export default function AnimateTab({ config, updateConfig }: AnimateTabProps) {
  return (
    <motion.div
      key="animate"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="space-y-6"
    >
      <div>
        <label className="block font-bold mb-3">🎬 Entrance Animation</label>
        <div className="grid grid-cols-2 gap-2">
          {(['none', 'fade', 'slide-up', 'slide-down', 'zoom', 'bounce'] as const).map(anim => (
            <button
              key={anim}
              onClick={() => updateConfig('entrance', anim)}
              className={`py-3 rounded-xl font-bold ${
                config.entrance === anim ? 'bg-purple-600 text-white' : 'bg-gray-100'
              }`}
            >
              {anim.split('-').map(w => w?.[0] ? w[0].toUpperCase() + w.slice(1) : w).join(' ')}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block font-bold mb-3">🖱️ Hover Effect</label>
        <div className="grid grid-cols-3 gap-2">
          {(['none', 'zoom', 'tilt', 'lift', 'glow', 'brightness'] as const).map(hover => (
            <button
              key={hover}
              onClick={() => updateConfig('hover', hover)}
              className={`py-3 rounded-xl font-bold capitalize ${
                config.hover === hover ? 'bg-purple-600 text-white' : 'bg-gray-100'
              }`}
            >
              {hover}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex justify-between mb-2">
          <label className="font-bold">⏱️ Duration</label>
          <span className="text-purple-600 font-mono">{config.duration}s</span>
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
      </div>

      <div>
        <label className="block font-bold mb-3">📈 Easing</label>
        <div className="grid grid-cols-2 gap-2">
          {(['ease', 'linear', 'ease-in-out', 'spring'] as const).map(easing => (
            <button
              key={easing}
              onClick={() => updateConfig('easing', easing)}
              className={`py-3 rounded-xl font-bold capitalize ${
                config.easing === easing ? 'bg-purple-600 text-white' : 'bg-gray-100'
              }`}
            >
              {easing}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
