// src/app/editor/[siteId]/components/editors/text-editor/components/Toolbar/FormatButtons.tsx

'use client';

import { Editor } from '@tiptap/react';

interface FormatButtonsProps {
  editor: Editor | null;
}

export default function FormatButtons({ editor }: FormatButtonsProps) {
  if (!editor) {
return null;
}

  return (
    <div className="flex items-center gap-1 bg-white rounded-lg p-1 shadow-sm border border-gray-200">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`px-2.5 py-1.5 rounded-md font-bold text-sm transition-all duration-200 ${
          editor.isActive('bold')
            ? 'bg-purple-100 text-purple-700 shadow-sm'
            : 'text-gray-600 hover:bg-gray-100'
        }`}
        title="Bold (⌘+B)"
      >
        B
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`px-2.5 py-1.5 rounded-md italic text-sm transition-all duration-200 ${
          editor.isActive('italic')
            ? 'bg-purple-100 text-purple-700 shadow-sm'
            : 'text-gray-600 hover:bg-gray-100'
        }`}
        title="Italic (⌘+I)"
      >
        I
      </button>
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`px-2.5 py-1.5 rounded-md underline text-sm transition-all duration-200 ${
          editor.isActive('underline')
            ? 'bg-purple-100 text-purple-700 shadow-sm'
            : 'text-gray-600 hover:bg-gray-100'
        }`}
        title="Underline (⌘+U)"
      >
        U
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={`px-2.5 py-1.5 rounded-md line-through text-sm transition-all duration-200 ${
          editor.isActive('strike')
            ? 'bg-purple-100 text-purple-700 shadow-sm'
            : 'text-gray-600 hover:bg-gray-100'
        }`}
        title="Strikethrough"
      >
        S
      </button>
    </div>
  );
}