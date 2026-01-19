'use client';

import { motion } from 'framer-motion';

import { ImageConfig } from '../types/imageConfig.types';

interface PositionTabProps {
  config: ImageConfig;
  updateConfig: <K extends keyof ImageConfig>(key: K, value: ImageConfig[K]) => void;
}

export default function PositionTab({ config, updateConfig }: PositionTabProps) {
  return (
    <motion.div
      key="position"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="space-y-6"
    >
      <div>
        <label className="block font-bold mb-3">📏 Object Fit</label>
        <div className="grid grid-cols-2 gap-2">
          {(['cover', 'contain', 'fill', 'none'] as const).map(fit => (
            <button
              key={fit}
              onClick={() => updateConfig('objectFit', fit)}
              className={`py-3 rounded-xl font-bold capitalize ${
                config.objectFit === fit ? 'bg-purple-600 text-white' : 'bg-gray-100'
              }`}
            >
              {fit}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block font-bold mb-3">📍 Position</label>
        <div className="grid grid-cols-3 gap-2">
          {[
            ['top left', 'top', 'top right'],
            ['left', 'center', 'right'],
            ['bottom left', 'bottom', 'bottom right'],
          ].map((row, i) => (
            <div key={i} className="contents">
              {row.map(pos => (
                <button
                  key={pos}
                  onClick={() => updateConfig('objectPosition', pos)}
                  className={`py-3 rounded-xl font-bold text-sm ${
                    config.objectPosition === pos ? 'bg-purple-600 text-white' : 'bg-gray-100'
                  }`}
                >
                  {pos.split(' ').map(w => w[0].toUpperCase()).join('')}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}