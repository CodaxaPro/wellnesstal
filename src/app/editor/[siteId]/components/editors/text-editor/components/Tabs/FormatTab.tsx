// src/app/editor/[siteId]/components/editors/text-editor/components/Tabs/FormatTab.tsx

'use client';

import { motion } from 'framer-motion';
import { Editor } from '@tiptap/react';
import { getTabSwitchAnimation } from '../../utils/animationHelpers';

interface FormatTabProps {
  editor: Editor | null;
}

export default function FormatTab({ editor }: FormatTabProps) {
  if (!editor) return null;

  const headingButtons = [
    { level: 1, label: 'H1', size: 'text-3xl' },
    { level: 2, label: 'H2', size: 'text-2xl' },
    { level: 3, label: 'H3', size: 'text-xl' },
    { level: 4, label: 'H4', size: 'text-lg' },
    { level: 5, label: 'H5', size: 'text-base' },
    { level: 6, label: 'H6', size: 'text-sm' },
  ];

  const formatButtons = [
    { 
      icon: 'B', 
      label: 'Bold', 
      command: 'bold',
      onClick: () => editor.chain().focus().toggleBold().run(),
      isActive: () => editor.isActive('bold'),
      style: 'font-bold' 
    },
    { 
      icon: 'I', 
      label: 'Italic', 
      command: 'italic',
      onClick: () => editor.chain().focus().toggleItalic().run(),
      isActive: () => editor.isActive('italic'),
      style: 'italic' 
    },
    { 
      icon: 'U', 
      label: 'Underline', 
      command: 'underline',
      onClick: () => editor.chain().focus().toggleUnderline().run(),
      isActive: () => editor.isActive('underline'),
      style: 'underline' 
    },
    { 
      icon: 'S', 
      label: 'Strike', 
      command: 'strike',
      onClick: () => editor.chain().focus().toggleStrike().run(),
      isActive: () => editor.isActive('strike'),
      style: 'line-through' 
    },
    { 
      icon: 'Code', 
      label: 'Code', 
      command: 'code',
      onClick: () => editor.chain().focus().toggleCode().run(),
      isActive: () => editor.isActive('code'),
      style: 'font-mono' 
    },
    { 
      icon: '❝', 
      label: 'Quote', 
      command: 'blockquote',
      onClick: () => editor.chain().focus().toggleBlockquote().run(),
      isActive: () => editor.isActive('blockquote'),
      style: '' 
    },
  ];

  return (
    <motion.div
      {...getTabSwitchAnimation()}
      className="space-y-6"
    >
      {/* Headings */}
      <div>
        <label className="block font-bold mb-3 text-gray-700">📑 Headings</label>
        <div className="grid grid-cols-3 gap-2">
          {headingButtons.map((heading, index) => (
            <motion.button
              key={heading.level}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => editor.chain().focus().toggleHeading({ level: heading.level as any }).run()}
              className={`
                py-3 rounded-xl font-bold transition-all
                ${editor.isActive('heading', { level: heading.level })
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }
                ${heading.size}
              `}
            >
              {heading.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Paragraph */}
      <div>
        <label className="block font-bold mb-3 text-gray-700">📝 Paragraph</label>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={`
            w-full py-3 rounded-xl font-medium transition-all
            ${editor.isActive('paragraph')
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }
          `}
        >
          Normal Text
        </motion.button>
      </div>

      {/* Text Formatting */}
      <div>
        <label className="block font-bold mb-3 text-gray-700">✨ Text Formatting</label>
        <div className="grid grid-cols-2 gap-2">
          {formatButtons.map((format, index) => (
            <motion.button
              key={format.command}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.05 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={format.onClick}
              className={`
                py-3 rounded-xl font-bold transition-all
                ${format.isActive()
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }
              `}
            >
              <span className={format.style}>{format.icon}</span> {format.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Clear Formatting */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
        className="w-full py-3 rounded-xl font-bold bg-red-100 hover:bg-red-200 text-red-700 transition-all"
      >
        🗑️ Clear All Formatting
      </motion.button>
    </motion.div>
  );
}