// src/app/editor/[siteId]/components/editors/text-editor/components/Content/TextEditorContent.tsx

'use client';

import { EditorContent, Editor } from '@tiptap/react';
import { motion } from 'framer-motion';

import { TextConfig } from '../../types/textConfig.types';
import { getTextStyle } from '../../utils/styleHelpers';

interface TextEditorContentProps {
  editor: Editor | null;
  config: TextConfig;
}

export default function TextEditorContent({ editor, config }: TextEditorContentProps) {
  const textStyle = getTextStyle(config);

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.3 }}
      className="flex-1 overflow-y-auto custom-scrollbar bg-white"
    >
      <div 
        className="p-6"
        style={textStyle}
      >
        <EditorContent 
          editor={editor} 
          className="prose prose-sm sm:prose lg:prose-lg max-w-none focus:outline-none"
        />
      </div>

      {/* Editor Styles */}
      <style jsx global>{`
        .ProseMirror {
          outline: none !important;
          min-height: 300px;
        }
        
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #9CA3AF;
          pointer-events: none;
          height: 0;
        }

        .ProseMirror h1 {
          font-size: 2em;
          font-weight: 700;
          margin-top: 0.5em;
          margin-bottom: 0.5em;
        }

        .ProseMirror h2 {
          font-size: 1.5em;
          font-weight: 600;
          margin-top: 0.5em;
          margin-bottom: 0.5em;
        }

        .ProseMirror h3 {
          font-size: 1.25em;
          font-weight: 600;
          margin-top: 0.5em;
          margin-bottom: 0.5em;
        }

        .ProseMirror ul,
        .ProseMirror ol {
          padding-left: 1.5em;
          margin: 1em 0;
        }

        .ProseMirror li {
          margin: 0.25em 0;
        }

        .ProseMirror a {
          color: #9333EA;
          text-decoration: underline;
          cursor: pointer;
        }

        .ProseMirror a:hover {
          color: #7C3AED;
        }

        .ProseMirror code {
          background-color: #F3F4F6;
          border-radius: 0.25em;
          padding: 0.15em 0.3em;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.9em;
        }

        .ProseMirror pre {
          background-color: #1F2937;
          color: #F9FAFB;
          border-radius: 0.5em;
          padding: 1em;
          overflow-x: auto;
        }

        .ProseMirror pre code {
          background-color: transparent;
          color: inherit;
          padding: 0;
        }

        .ProseMirror blockquote {
          border-left: 4px solid #9333EA;
          padding-left: 1em;
          margin-left: 0;
          font-style: italic;
          color: #6B7280;
        }

        .ProseMirror hr {
          border: none;
          border-top: 2px solid #E5E7EB;
          margin: 2em 0;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #F3F4F6;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #9333EA, #EC4899);
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #7C3AED, #DB2777);
        }
      `}</style>
    </motion.div>
  );
}