// src/app/editor/[siteId]/components/editors/text-editor/hooks/useTiptapEditor.ts

import { useEffect } from 'react';

import { CharacterCount } from '@tiptap/extension-character-count';
import { Color } from '@tiptap/extension-color';
import { Highlight } from '@tiptap/extension-highlight';
import { Placeholder } from '@tiptap/extension-placeholder';
import { TextAlign } from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';


interface UseTiptapEditorProps {
  content: string;
  onUpdate: (html: string, text: string) => void;
  placeholder?: string;
}

export function useTiptapEditor({ content, onUpdate, placeholder }: UseTiptapEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      CharacterCount,
      Placeholder.configure({
        placeholder: placeholder || 'Start typing...',
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none min-h-[200px] max-w-none p-4',
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const text = editor.getText();
      onUpdate(html, text);
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  return editor;
}