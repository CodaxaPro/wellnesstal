'use client';

import { motion } from 'framer-motion';
import { ImageConfig } from '../types/imageConfig.types';

interface SEOTabProps {
  config: ImageConfig;
  updateConfig: <K extends keyof ImageConfig>(key: K, value: ImageConfig[K]) => void;
}

export default function SEOTab({ config, updateConfig }: SEOTabProps) {
  return (
    <motion.div
      key="seo"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="space-y-6"
    >
      <div>
        <label className="block font-bold mb-2">🏷️ Alt Text</label>
        <textarea
          value={config.alt}
          onChange={(e) => updateConfig('alt', e.target.value)}
          placeholder="Describe this image for accessibility and SEO..."
          className="w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 resize-none"
          rows={3}
        />
      </div>

      <div>
        <label className="block font-bold mb-2">📝 Title Attribute</label>
        <input
          type="text"
          value={config.title}
          onChange={(e) => updateConfig('title', e.target.value)}
          placeholder="Image title (appears on hover)"
          className="w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-purple-500"
        />
      </div>
    </motion.div>
  );
}