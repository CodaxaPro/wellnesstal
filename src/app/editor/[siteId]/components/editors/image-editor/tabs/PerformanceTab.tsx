'use client';

import { motion } from 'framer-motion';
import { ImageConfig } from '../types/imageConfig.types';

interface PerformanceTabProps {
  config: ImageConfig;
  updateConfig: <K extends keyof ImageConfig>(key: K, value: ImageConfig[K]) => void;
}

export default function PerformanceTab({ config, updateConfig }: PerformanceTabProps) {
  return (
    <motion.div
      key="performance"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="space-y-6"
    >
      <div>
        <label className="flex items-center justify-between py-4 px-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100">
          <span className="font-bold">⚡ Lazy Loading</span>
          <input
            type="checkbox"
            checked={config.lazyLoad}
            onChange={(e) => updateConfig('lazyLoad', e.target.checked)}
            className="w-6 h-6 accent-purple-600"
          />
        </label>
      </div>

      <div>
        <div className="flex justify-between mb-2">
          <label className="font-bold">🎯 Image Quality</label>
          <span className="text-purple-600 font-mono">{config.quality}%</span>
        </div>
        <input
          type="range"
          min={60}
          max={100}
          value={config.quality}
          onChange={(e) => updateConfig('quality', Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Low</span>
          <span>High</span>
        </div>
      </div>
    </motion.div>
  );
}