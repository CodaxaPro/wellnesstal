'use client';

import { motion } from 'framer-motion';

import { ImageConfig } from './types/imageConfig.types';
import { getEntranceAnimation, getHoverAnimation, getEasingCurve } from './utils/animationHelpers';
import { getFilterStyle } from './utils/filterHelpers';

interface ImageEditorPreviewProps {
  config: ImageConfig;
}

export default function ImageEditorPreview({ config }: ImageEditorPreviewProps) {
  return (
    <div className="flex-1 p-8 bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col overflow-y-auto">
      <div className="text-center mb-4">
        <h3 className="text-xl font-bold">👁️ Live Preview</h3>
        <p className="text-sm text-gray-600">All effects applied in real-time</p>
      </div>

      <div className="flex-1 flex items-center justify-center">
        {config.url ? (
          <motion.div 
            key={config.url}
            className="relative max-w-full max-h-full"
            initial={getEntranceAnimation(config.entrance)}
            animate={{ opacity: 1, scale: 1, x: 0, y: 0, rotate: 0 }}
            transition={{ 
              duration: config.duration,
              ease: getEasingCurve(config.easing)
            }}
            whileHover={getHoverAnimation(config.hover)}
          >
            <img
              src={config.url}
              alt="Preview"
              className="max-w-full max-h-[500px] rounded-2xl shadow-2xl"
              style={getFilterStyle(config)}
            />
            
            {/* Overlay */}
            {config.overlayOpacity > 0 && (
              <div
                className="absolute inset-0 rounded-2xl pointer-events-none"
                style={{
                  backgroundColor: config.overlayColor,
                  opacity: config.overlayOpacity / 100,
                }}
              />
            )}

            {/* Vignette */}
            {config.vignette > 0 && (
              <div
                className="absolute inset-0 rounded-2xl pointer-events-none"
                style={{
                  background: `radial-gradient(circle, transparent 0%, rgba(0,0,0,${config.vignette / 100}) 100%)`,
                }}
              />
            )}
          </motion.div>
        ) : (
          <div className="text-center text-gray-400">
            <div className="text-6xl mb-4">🖼️</div>
            <p>Select an image to preview</p>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="mt-4 grid grid-cols-3 gap-4 text-center text-sm">
        <div className="bg-white rounded-xl p-3">
          <div className="font-bold text-purple-600">{config.filter}</div>
          <div className="text-gray-500">Filter</div>
        </div>
        <div className="bg-white rounded-xl p-3">
          <div className="font-bold text-purple-600">{config.entrance}</div>
          <div className="text-gray-500">Animation</div>
        </div>
        <div className="bg-white rounded-xl p-3">
          <div className="font-bold text-purple-600">{config.quality}%</div>
          <div className="text-gray-500">Quality</div>
        </div>
      </div>
    </div>
  );
}