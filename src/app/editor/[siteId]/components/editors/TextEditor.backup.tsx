'use client';

import { useEffect, useState, useRef } from 'react';

import CharacterCount from '@tiptap/extension-character-count';
import { Color } from '@tiptap/extension-color';
import { Highlight } from '@tiptap/extension-highlight';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import Typography from '@tiptap/extension-typography';
import Underline from '@tiptap/extension-underline';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { motion, AnimatePresence } from 'framer-motion';

interface TextEditorProps {
  value: string;
  fieldPath: string;
  onSave: (value: string) => void;
  onCancel: () => void;
  position: { top: number; left: number };
}

export default function TextEditor({
  value,
  fieldPath,
  onSave,
  onCancel,
  position,
}: TextEditorProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [localPosition, setLocalPosition] = useState(position);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [showFontSizePicker, setShowFontSizePicker] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  // Field type detection
  const getFieldType = (path: string): 'title' | 'button' | 'contact' | 'normal' => {
    if (path.includes('cta') || path.includes('button')) {
return 'button';
}
    if (path.includes('phone') || path.includes('email')) {
return 'contact';
}
    if (path.includes('title')) {
return 'title';
}
    return 'normal';
  };

  const fieldType = getFieldType(fieldPath);
  const showHeadings = fieldType !== 'button' && fieldType !== 'contact';
  const maxLength = fieldType === 'button' ? 50 : fieldType === 'title' ? 100 : 1000;

  // Get field label
  const getFieldLabel = (path: string): string => {
    const labels: Record<string, string> = {
      'hero.title': 'Hero Title',
      'hero.subtitle': 'Hero Subtitle',
      'hero.ctaText': 'Hero Button Text',
      'features.title': 'Features Title',
      'features.subtitle': 'Features Subtitle',
      'services.title': 'Services Title',
      'services.subtitle': 'Services Subtitle',
      'cta.title': 'CTA Title',
      'cta.subtitle': 'CTA Subtitle',
      'cta.ctaText': 'CTA Button Text',
      'footer.phone': 'Phone Number',
      'footer.email': 'Email Address',
      'footer.address': 'Address',
      'businessName': 'Business Name',
      'header.ctaText': 'Header Button',
    };
    return labels[path] || path;
  };

  const fieldLabel = getFieldLabel(fieldPath);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: showHeadings ? { levels: [1, 2, 3, 4, 5, 6] } : false,
      }),
      Underline,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right', 'justify'],
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-purple-600 underline hover:text-purple-700 cursor-pointer',
          target: '_blank',
          rel: 'noopener noreferrer',
        },
      }),
      Typography,
      Placeholder.configure({
        placeholder: `Enter ${fieldLabel.toLowerCase()}...`,
      }),
      CharacterCount.configure({
        limit: maxLength,
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg max-w-none focus:outline-none min-h-[200px] max-h-[400px] overflow-y-auto px-4 py-3',
      },
    },
  });

  useEffect(() => {
    setLocalPosition(position);
  }, [position]);

  useEffect(() => {
    if (editor) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  // Dragging handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.drag-handle')) {
      setIsDragging(true);
      setDragOffset({
        x: e.clientX - localPosition.left,
        y: e.clientY - localPosition.top,
      });
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setLocalPosition({
          top: Math.max(0, Math.min(e.clientY - dragOffset.y, window.innerHeight - 100)),
          left: Math.max(0, Math.min(e.clientX - dragOffset.x, window.innerWidth - 750)),
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  // Save handler
  const handleSave = () => {
    if (editor) {
      const htmlContent = editor.getHTML();
      onSave(htmlContent);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        handleSave();
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        onCancel();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [editor]);

  // Link handlers
  const handleSetLink = () => {
    if (!editor) {
return;
}

    if (linkUrl) {
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: linkUrl })
        .run();
    }

    setShowLinkDialog(false);
    setLinkUrl('');
  };

  const handleUnsetLink = () => {
    if (!editor) {
return;
}
    editor.chain().focus().unsetLink().run();
    setShowLinkDialog(false);
  };

  // Color palettes
  const textColors = [
    { name: 'Black', value: '#000000' },
    { name: 'Dark Gray', value: '#374151' },
    { name: 'Gray', value: '#6B7280' },
    { name: 'Light Gray', value: '#9CA3AF' },
    { name: 'Red', value: '#EF4444' },
    { name: 'Orange', value: '#F97316' },
    { name: 'Amber', value: '#F59E0B' },
    { name: 'Yellow', value: '#EAB308' },
    { name: 'Lime', value: '#84CC16' },
    { name: 'Green', value: '#22C55E' },
    { name: 'Emerald', value: '#10B981' },
    { name: 'Teal', value: '#14B8A6' },
    { name: 'Cyan', value: '#06B6D4' },
    { name: 'Sky', value: '#0EA5E9' },
    { name: 'Blue', value: '#3B82F6' },
    { name: 'Indigo', value: '#6366F1' },
    { name: 'Violet', value: '#8B5CF6' },
    { name: 'Purple', value: '#A855F7' },
    { name: 'Fuchsia', value: '#D946EF' },
    { name: 'Pink', value: '#EC4899' },
    { name: 'Rose', value: '#F43F5E' },
    { name: 'White', value: '#FFFFFF' },
  ];

  const highlightColors = [
    { name: 'Yellow', value: '#FEF3C7' },
    { name: 'Orange', value: '#FED7AA' },
    { name: 'Red', value: '#FECACA' },
    { name: 'Pink', value: '#FBE2E3' },
    { name: 'Purple', value: '#F3E8FF' },
    { name: 'Indigo', value: '#E0E7FF' },
    { name: 'Blue', value: '#DBEAFE' },
    { name: 'Cyan', value: '#CFFAFE' },
    { name: 'Teal', value: '#CCFBF1' },
    { name: 'Green', value: '#D1FAE5' },
    { name: 'Lime', value: '#D9F99D' },
    { name: 'Amber', value: '#FEF9C3' },
  ];

  const fontSizes = [
    { label: 'Extra Small', value: '0.75rem', class: 'text-xs' },
    { label: 'Small', value: '0.875rem', class: 'text-sm' },
    { label: 'Normal', value: '1rem', class: 'text-base' },
    { label: 'Large', value: '1.125rem', class: 'text-lg' },
    { label: 'Extra Large', value: '1.25rem', class: 'text-xl' },
    { label: '2X Large', value: '1.5rem', class: 'text-2xl' },
    { label: '3X Large', value: '1.875rem', class: 'text-3xl' },
  ];

  if (!editor) {
return null;
}

  const wordCount = editor.storage.characterCount.words();
  const charCount = editor.storage.characterCount.characters();
  const charLimit = maxLength;
  const charPercentage = (charCount / charLimit) * 100;

  return (
    <>
      {/* Premium Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 bg-gradient-to-br from-purple-900/30 via-black/40 to-indigo-900/30 backdrop-blur-sm z-[998]"
        onClick={onCancel}
      />

      {/* Enterprise Editor Popup */}
      <motion.div
        ref={popupRef}
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="fixed bg-white rounded-2xl shadow-2xl z-[999] border border-purple-200/50"
        style={{
          top: `${localPosition.top}px`,
          left: `${localPosition.left}px`,
          width: '750px',
          cursor: isDragging ? 'grabbing' : 'default',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(147, 51, 234, 0.1)',
        }}
        onMouseDown={handleMouseDown}
      >
        {/* Premium Header */}
        <div className="drag-handle bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 text-white px-6 py-4 rounded-t-2xl flex justify-between items-center cursor-grab active:cursor-grabbing select-none">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <span className="text-xl">✨</span>
            </div>
            <div>
              <div className="font-semibold text-sm tracking-wide">Enterprise Text Editor</div>
              <div className="text-xs opacity-90 font-mono">{fieldLabel}</div>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="text-white/70 hover:text-white hover:bg-white/20 w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 text-xl"
          >
            ×
          </button>
        </div>

        {/* Field Type Badge */}
        {(fieldType === 'button' || fieldType === 'contact') && (
          <div className="px-5 py-2 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100">
            <p className="text-xs text-amber-800 flex items-center gap-2 font-medium">
              <span className="text-sm">⚠️</span>
              <span>This field type has limited formatting options (no headings)</span>
            </p>
          </div>
        )}

        {/* Advanced Toolbar */}
        <div className="px-5 py-3 bg-gradient-to-b from-gray-50 to-white border-b border-gray-100">
          <div className="flex flex-wrap items-center gap-2">
            {/* Text Formatting Group */}
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

            {showHeadings && (
              <>
                <div className="w-px h-6 bg-gray-300" />

                {/* Headings Group */}
                <div className="flex items-center gap-1 bg-white rounded-lg p-1 shadow-sm border border-gray-200">
                  {[1, 2, 3].map((level) => (
                    <button
                      key={level}
                      onClick={() => editor.chain().focus().toggleHeading({ level: level as 1 | 2 | 3 }).run()}
                      className={`px-2.5 py-1.5 rounded-md text-sm font-semibold transition-all duration-200 ${
                        editor.isActive('heading', { level })
                          ? 'bg-purple-100 text-purple-700 shadow-sm'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                      title={`Heading ${level}`}
                    >
                      H{level}
                    </button>
                  ))}
                </div>
              </>
            )}

            <div className="w-px h-6 bg-gray-300" />

            {/* Color & Highlight Group */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowColorPicker(!showColorPicker);
                  setShowHighlightPicker(false);
                  setShowFontSizePicker(false);
                }}
                className="px-3 py-1.5 bg-white rounded-lg shadow-sm border border-gray-200 hover:bg-gray-50 transition-all duration-200 text-sm flex items-center gap-2"
                title="Text Color"
              >
                <span className="text-lg">🎨</span>
                <span className="text-xs text-gray-600">Color</span>
              </button>

              <AnimatePresence>
                {showColorPicker && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-12 left-0 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 z-[1000]"
                  >
                    <div className="text-xs font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <span>🎨</span>
                      <span>Text Color Palette</span>
                    </div>
                    <div className="grid grid-cols-7 gap-2 w-[240px]">
                      {textColors.map((color) => (
                        <button
                          key={color.value}
                          onClick={() => {
                            editor.chain().focus().setColor(color.value).run();
                            setShowColorPicker(false);
                          }}
                          className="group relative w-8 h-8 rounded-lg border-2 border-gray-200 hover:border-purple-400 hover:scale-110 transition-all duration-200 shadow-sm"
                          style={{ backgroundColor: color.value }}
                          title={color.name}
                        >
                          <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs bg-gray-900 text-white px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                            {color.name}
                          </span>
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => {
                        editor.chain().focus().unsetColor().run();
                        setShowColorPicker(false);
                      }}
                      className="mt-3 w-full px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      Reset Color
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="relative">
              <button
                onClick={() => {
                  setShowHighlightPicker(!showHighlightPicker);
                  setShowColorPicker(false);
                  setShowFontSizePicker(false);
                }}
                className="px-3 py-1.5 bg-white rounded-lg shadow-sm border border-gray-200 hover:bg-gray-50 transition-all duration-200 text-sm flex items-center gap-2"
                title="Highlight"
              >
                <span className="text-lg">🖍️</span>
                <span className="text-xs text-gray-600">Highlight</span>
              </button>

              <AnimatePresence>
                {showHighlightPicker && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-12 left-0 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 z-[1000]"
                  >
                    <div className="text-xs font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <span>🖍️</span>
                      <span>Highlight Colors</span>
                    </div>
                    <div className="grid grid-cols-6 gap-2 w-[200px]">
                      {highlightColors.map((color) => (
                        <button
                          key={color.value}
                          onClick={() => {
                            editor.chain().focus().toggleHighlight({ color: color.value }).run();
                            setShowHighlightPicker(false);
                          }}
                          className="group relative w-8 h-8 rounded-lg border-2 border-gray-200 hover:border-purple-400 hover:scale-110 transition-all duration-200 shadow-sm"
                          style={{ backgroundColor: color.value }}
                          title={color.name}
                        >
                          <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs bg-gray-900 text-white px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                            {color.name}
                          </span>
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => {
                        editor.chain().focus().unsetHighlight().run();
                        setShowHighlightPicker(false);
                      }}
                      className="mt-3 w-full px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      Remove Highlight
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="w-px h-6 bg-gray-300" />

            {/* Alignment Group */}
            <div className="flex items-center gap-1 bg-white rounded-lg p-1 shadow-sm border border-gray-200">
              {['left', 'center', 'right', 'justify'].map((align) => (
                <button
                  key={align}
                  onClick={() => editor.chain().focus().setTextAlign(align).run()}
                  className={`px-2.5 py-1.5 rounded-md text-sm transition-all duration-200 ${
                    editor.isActive({ textAlign: align })
                      ? 'bg-purple-100 text-purple-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  title={`Align ${align}`}
                >
                  {align === 'left' && '⬅️'}
                  {align === 'center' && '⬆️'}
                  {align === 'right' && '➡️'}
                  {align === 'justify' && '⬌'}
                </button>
              ))}
            </div>

            <div className="w-px h-6 bg-gray-300" />

            {/* Lists Group */}
            <div className="flex items-center gap-1 bg-white rounded-lg p-1 shadow-sm border border-gray-200">
              <button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`px-2.5 py-1.5 rounded-md text-sm transition-all duration-200 ${
                  editor.isActive('bulletList')
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                title="Bullet List"
              >
                ⚫
              </button>
              <button
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={`px-2.5 py-1.5 rounded-md text-sm transition-all duration-200 ${
                  editor.isActive('orderedList')
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                title="Numbered List"
              >
                🔢
              </button>
            </div>

            <div className="w-px h-6 bg-gray-300" />

            {/* Link Button */}
            <button
              onClick={() => {
                const previousUrl = editor.getAttributes('link').href;
                setLinkUrl(previousUrl || '');
                setShowLinkDialog(true);
                setShowColorPicker(false);
                setShowHighlightPicker(false);
                setShowFontSizePicker(false);
              }}
              className={`px-3 py-1.5 rounded-lg shadow-sm border border-gray-200 transition-all duration-200 text-sm flex items-center gap-2 ${
                editor.isActive('link')
                  ? 'bg-purple-100 text-purple-700 border-purple-300'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
              title="Add Link (⌘+K)"
            >
              <span className="text-lg">🔗</span>
              <span className="text-xs">Link</span>
            </button>

            <div className="flex-1" />

            {/* Undo/Redo */}
            <div className="flex items-center gap-1 bg-white rounded-lg p-1 shadow-sm border border-gray-200">
              <button
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().undo()}
                className="px-2.5 py-1.5 rounded-md text-sm text-gray-600 hover:bg-gray-100 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                title="Undo (⌘+Z)"
              >
                ↶
              </button>
              <button
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().redo()}
                className="px-2.5 py-1.5 rounded-md text-sm text-gray-600 hover:bg-gray-100 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                title="Redo (⌘+⇧+Z)"
              >
                ↷
              </button>
            </div>

            {/* Clear Formatting */}
            <button
              onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
              className="px-3 py-1.5 bg-white rounded-lg shadow-sm border border-gray-200 hover:bg-red-50 hover:border-red-300 transition-all duration-200 text-sm flex items-center gap-2"
              title="Clear Formatting"
            >
              <span className="text-lg">🧹</span>
              <span className="text-xs text-gray-600">Clear</span>
            </button>
          </div>
        </div>

        {/* Link Dialog */}
        <AnimatePresence>
          {showLinkDialog && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="px-5 py-3 bg-blue-50 border-b border-blue-100"
            >
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-blue-900 mb-1">
                    🔗 Link URL
                  </label>
                  <input
                    type="url"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
handleSetLink();
}
                      if (e.key === 'Escape') {
setShowLinkDialog(false);
}
                    }}
                  />
                </div>
                <div className="flex gap-2 pt-5">
                  <button
                    onClick={handleSetLink}
                    disabled={!linkUrl}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Apply
                  </button>
                  {editor.isActive('link') && (
                    <button
                      onClick={handleUnsetLink}
                      className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                    >
                      Remove
                    </button>
                  )}
                  <button
                    onClick={() => setShowLinkDialog(false)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Editor Content Area */}
        <div className="p-5 bg-gradient-to-b from-white to-gray-50">
          <div className="bg-white border-2 border-gray-200 rounded-xl focus-within:border-purple-400 focus-within:ring-4 focus-within:ring-purple-100 transition-all duration-200 shadow-inner">
            <EditorContent editor={editor} />
          </div>

          {/* Stats & Indicators */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${charPercentage > 90 ? 'bg-red-500 animate-pulse' : 'bg-purple-500'}`} />
                  <span className="font-semibold text-gray-700">{charCount}</span>
                  <span className="text-gray-500">/ {charLimit}</span>
                </div>
                <span className="text-gray-400">characters</span>
              </div>
              
              <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-sm">
                <span className="font-semibold text-gray-700">{wordCount}</span>
                <span className="text-gray-500">words</span>
              </div>

              {charPercentage > 90 && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-1.5 text-red-600 bg-red-50 px-3 py-2 rounded-lg border border-red-200"
                >
                  <span>⚠️</span>
                  <span className="font-medium">Approaching limit</span>
                </motion.div>
              )}
            </div>

            <div className="text-xs text-gray-400 flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-gray-200">
              <span>💡</span>
              <span>⌘+Enter to save • Esc to cancel</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 px-5 pb-5 bg-gradient-to-b from-gray-50 to-white">
          <button
            onClick={onCancel}
            className="flex-1 px-5 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 font-semibold transition-all duration-200 hover:shadow-md"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-5 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 font-semibold transition-all duration-200 shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 hover:scale-[1.02]"
          >
            <span className="flex items-center justify-center gap-2">
              <span>✓</span>
              <span>Save Changes</span>
            </span>
          </button>
        </div>
      </motion.div>
    </>
  );
}