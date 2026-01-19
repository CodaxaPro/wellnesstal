'use client';

import { Editor } from '@tiptap/react';
import { motion } from 'framer-motion';

import { TextConfig } from '../../types/textConfig.types';

import ColorPicker from './ColorPicker';
import FontSelector from './FontSelector';
import FormatButtons from './FormatButtons';
import SizeSlider from './SizeSlider';


interface TextEditorToolbarProps {
  editor: Editor | null;
  config: TextConfig;
  updateConfig: <K extends keyof TextConfig>(key: K, value: TextConfig[K]) => void;
}

export default function TextEditorToolbar({ editor, config, updateConfig }: TextEditorToolbarProps) {
  if (!editor) {
return null;
}

  const alignmentButtons = [
    { icon: '⬅️', value: 'left' as const, label: 'Align Left' },
    { icon: '⬛', value: 'center' as const, label: 'Align Center' },
    { icon: '➡️', value: 'right' as const, label: 'Align Right' },
    { icon: '↔️', value: 'justify' as const, label: 'Justify' },
  ];

  const listButtons = [
    { 
      icon: '•', 
      command: () => editor.chain().focus().toggleBulletList().run(),
      isActive: editor.isActive('bulletList'),
      label: 'Bullet List',
    },
    { 
      icon: '1.', 
      command: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: editor.isActive('orderedList'),
      label: 'Numbered List',
    },
  ];

  return (
    <motion.div
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.3 }}
      className="flex flex-wrap items-center gap-2 px-6 py-4 bg-gray-50 border-b flex-shrink-0"
    >
      {/* Format Buttons */}
      <FormatButtons editor={editor} />

      <div className="w-px h-8 bg-gray-300" />

      {/* Font Selector */}
      <FontSelector
        value={config.fontFamily}
        onChange={(font) => updateConfig('fontFamily', font)}
      />

      {/* Font Size */}
      <SizeSlider
        value={config.fontSize}
        onChange={(size) => updateConfig('fontSize', size)}
        min={8}
        max={72}
        label="Font Size"
        icon="🔤"
      />

      <div className="w-px h-8 bg-gray-300" />

      {/* Text Color */}
      <ColorPicker
        value={config.textColor}
        onChange={(color) => updateConfig('textColor', color)}
        label="Text Color"
        icon="🎨"
      />

      {/* Background Color */}
      <ColorPicker
        value={config.backgroundColor}
        onChange={(color) => updateConfig('backgroundColor', color)}
        label="Background"
        icon="🖌️"
      />

      <div className="w-px h-8 bg-gray-300" />

      {/* Alignment */}
      <div className="flex gap-1">
        {alignmentButtons.map((btn, index) => (
          <motion.button
            key={btn.value}
            custom={index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + index * 0.05 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              editor.chain().focus().setTextAlign(btn.value).run();
              updateConfig('textAlign', btn.value);
            }}
            className={`
              w-9 h-9 rounded-lg flex items-center justify-center text-sm
              transition-all duration-200
              ${editor.isActive({ textAlign: btn.value })
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }
            `}
            title={btn.label}
          >
            {btn.icon}
          </motion.button>
        ))}
      </div>

      <div className="w-px h-8 bg-gray-300" />

      {/* Lists */}
      <div className="flex gap-1">
        {listButtons.map((btn, index) => (
          <motion.button
            key={btn.label}
            custom={index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 + index * 0.05 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={btn.command}
            className={`
              w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold
              transition-all duration-200
              ${btn.isActive
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }
            `}
            title={btn.label}
          >
            {btn.icon}
          </motion.button>
        ))}
      </div>

      <div className="w-px h-8 bg-gray-300" />

      {/* Link */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          const url = window.prompt('Enter URL:');
          if (url) {
            editor.chain().focus().setLink({ href: url }).run();
          }
        }}
        className={`
          w-9 h-9 rounded-lg flex items-center justify-center text-sm
          transition-all duration-200
          ${editor.isActive('link')
            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
          }
        `}
        title="Insert Link"
      >
        🔗
      </motion.button>

      {/* Undo/Redo */}
      <div className="ml-auto flex gap-1">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="w-9 h-9 rounded-lg flex items-center justify-center text-sm bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
          title="Undo (⌘Z)"
        >
          ↶
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="w-9 h-9 rounded-lg flex items-center justify-center text-sm bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
          title="Redo (⌘⇧Z)"
        >
          ↷
        </motion.button>
      </div>
    </motion.div>
  );
}