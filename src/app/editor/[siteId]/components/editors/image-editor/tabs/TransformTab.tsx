'use client';

import { motion } from 'framer-motion';

import { ImageConfig } from '../types/imageConfig.types';

interface TransformTabProps {
  config: ImageConfig;
  updateConfig: <K extends keyof ImageConfig>(key: K, value: ImageConfig[K]) => void;
}

export default function TransformTab({ config, updateConfig }: TransformTabProps) {
  return (
    <motion.div
      key="crop"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="space-y-6"
    >
      <div>
        <label className="block font-bold mb-3">🔄 Rotate</label>
        <div className="flex gap-2">
          {[0, 90, 180, 270].map(deg => (
            <button
              key={deg}
              onClick={() => updateConfig('rotate', deg)}
              className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                config.rotate === deg ? 'bg-purple-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {deg}°
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block font-bold mb-3">🔀 Flip</label>
        <div className="flex gap-3">
          <button
            onClick={() => updateConfig('flipH', !config.flipH)}
            className={`flex-1 py-3 rounded-xl font-bold ${
              config.flipH ? 'bg-purple-600 text-white' : 'bg-gray-100'
            }`}
          >
            Horizontal
          </button>
          <button
            onClick={() => updateConfig('flipV', !config.flipV)}
            className={`flex-1 py-3 rounded-xl font-bold ${
              config.flipV ? 'bg-purple-600 text-white' : 'bg-gray-100'
            }`}
          >
            Vertical
          </button>
        </div>
      </div>
    </motion.div>
  );
}