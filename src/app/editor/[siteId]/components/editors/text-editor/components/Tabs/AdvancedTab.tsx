// src/app/editor/[siteId]/components/editors/text-editor/components/Tabs/AdvancedTab.tsx

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { TextConfig } from '../../types/textConfig.types';
import { getTabSwitchAnimation } from '../../utils/animationHelpers';
import ColorPicker from '../Toolbar/ColorPicker';

interface AdvancedTabProps {
  config: TextConfig;
  updateConfig: <K extends keyof TextConfig>(key: K, value: TextConfig[K]) => void;
}

export default function AdvancedTab({ config, updateConfig }: AdvancedTabProps) {
  return (
    <motion.div
      {...getTabSwitchAnimation()}
      className="space-y-6"
    >
      {/* Text Shadow */}
      <div>
        <label className="block font-bold mb-3 text-gray-700">🌑 Text Shadow</label>
        <div className="space-y-3">
          {[
            { key: 'textShadowX', label: 'X Offset', min: -20, max: 20 },
            { key: 'textShadowY', label: 'Y Offset', min: -20, max: 20 },
            { key: 'textShadowBlur', label: 'Blur', min: 0, max: 40 },
          ].map(({ key, label, min, max }) => (
            <div key={key}>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">{label}</span>
                <span className="text-sm font-mono text-purple-600">
                  {config[key as keyof TextConfig]}px
                </span>
              </div>
              <input
                type="range"
                min={min}
                max={max}
                value={config[key as keyof TextConfig] as number}
                onChange={(e) => updateConfig(key as keyof TextConfig, Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
              />
            </div>
          ))}
          <div className="pt-2">
            <ColorPicker
              value={config.textShadowColor}
              onChange={(color) => updateConfig('textShadowColor', color)}
              label="Shadow Color"
              icon="🎨"
            />
          </div>
        </div>
      </div>

      {/* Gradient Text */}
      <div>
        <label className="flex items-center justify-between mb-3">
          <span className="font-bold text-gray-700">🌈 Gradient Text</span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => updateConfig('hasGradient', !config.hasGradient)}
            className={`
              px-4 py-1.5 rounded-lg font-medium text-sm transition-all
              ${config.hasGradient
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                : 'bg-gray-200 text-gray-600'
              }
            `}
          >
            {config.hasGradient ? 'ON' : 'OFF'}
          </motion.button>
        </label>

        <AnimatePresence>
          {config.hasGradient && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3 overflow-hidden"
            >
              <div className="flex gap-3">
                <ColorPicker
                  value={config.gradientColor1}
                  onChange={(color) => updateConfig('gradientColor1', color)}
                  label="Color 1"
                  icon="🎨"
                />
                <ColorPicker
                  value={config.gradientColor2}
                  onChange={(color) => updateConfig('gradientColor2', color)}
                  label="Color 2"
                  icon="🎨"
                />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">Gradient Angle</span>
                  <span className="text-sm font-mono text-purple-600">{config.gradientAngle}°</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={360}
                  value={config.gradientAngle}
                  onChange={(e) => updateConfig('gradientAngle', Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>0°</span>
                  <span>90°</span>
                  <span>180°</span>
                  <span>270°</span>
                  <span>360°</span>
                </div>
              </div>

              {/* Preview */}
              <div
                className="p-4 rounded-xl text-center font-bold text-2xl"
                style={{
                  backgroundImage: `linear-gradient(${config.gradientAngle}deg, ${config.gradientColor1}, ${config.gradientColor2})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Gradient Preview
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Text Outline */}
      <div>
        <label className="flex items-center justify-between mb-3">
          <span className="font-bold text-gray-700">✏️ Text Outline</span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => updateConfig('hasOutline', !config.hasOutline)}
            className={`
              px-4 py-1.5 rounded-lg font-medium text-sm transition-all
              ${config.hasOutline
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                : 'bg-gray-200 text-gray-600'
              }
            `}
          >
            {config.hasOutline ? 'ON' : 'OFF'}
          </motion.button>
        </label>

        <AnimatePresence>
          {config.hasOutline && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3 overflow-hidden"
            >
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">Outline Width</span>
                  <span className="text-sm font-mono text-purple-600">{config.outlineWidth}px</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={5}
                  value={config.outlineWidth}
                  onChange={(e) => updateConfig('outlineWidth', Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                />
              </div>

              <ColorPicker
                value={config.outlineColor}
                onChange={(color) => updateConfig('outlineColor', color)}
                label="Outline Color"
                icon="🎨"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Drop Cap */}
      <div>
        <label className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-all">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔠</span>
            <div>
              <div className="font-bold text-gray-700">Drop Cap</div>
              <div className="text-xs text-gray-500">Large first letter</div>
            </div>
          </div>
          <motion.input
            whileTap={{ scale: 0.9 }}
            type="checkbox"
            checked={config.hasDropCap}
            onChange={(e) => updateConfig('hasDropCap', e.target.checked)}
            className="w-6 h-6 accent-purple-600 cursor-pointer"
          />
        </label>
      </div>

      {/* Word Spacing */}
      <div>
        <div className="flex justify-between mb-2">
          <label className="font-bold text-gray-700">📏 Word Spacing</label>
          <span className="text-purple-600 font-mono text-sm">{config.wordSpacing}px</span>
        </div>
        <input
          type="range"
          min={-5}
          max={20}
          value={config.wordSpacing}
          onChange={(e) => updateConfig('wordSpacing', Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
        />
      </div>

      {/* Text Indent */}
      <div>
        <div className="flex justify-between mb-2">
          <label className="font-bold text-gray-700">↪️ Text Indent</label>
          <span className="text-purple-600 font-mono text-sm">{config.textIndent}px</span>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          value={config.textIndent}
          onChange={(e) => updateConfig('textIndent', Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
        />
      </div>
    </motion.div>
  );
}