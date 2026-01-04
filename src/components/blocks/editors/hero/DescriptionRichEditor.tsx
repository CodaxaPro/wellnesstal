'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Link } from '@tiptap/extension-link'
import { TextStyle } from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import { Highlight } from '@tiptap/extension-highlight'
import { Underline } from '@tiptap/extension-underline'
import { Placeholder } from '@tiptap/extension-placeholder'
import { TextAlign } from '@tiptap/extension-text-align'
import { useEffect, useState, useRef } from 'react'

interface DescriptionRichEditorProps {
  content: string
  onUpdate: (html: string) => void
}

export default function DescriptionRichEditor({ content, onUpdate }: DescriptionRichEditorProps) {
  const [activeTab, setActiveTab] = useState<'format' | 'style' | 'list' | 'link' | 'spacing'>('format')
  const [showLinkDialog, setShowLinkDialog] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const [linkText, setLinkText] = useState('')
  const [bulletListStyle, setBulletListStyle] = useState('disc')
  const [orderedListStyle, setOrderedListStyle] = useState('decimal')
  const [linkColor, setLinkColor] = useState('#637554')
  const [linkStyle, setLinkStyle] = useState('underline')
  const [autoTrimWhitespace, setAutoTrimWhitespace] = useState(true)
  const [removeEmptyParagraphs, setRemoveEmptyParagraphs] = useState(true)
  const [paragraphSpacing, setParagraphSpacing] = useState<'compact' | 'normal' | 'relaxed'>('normal')

  // Create a ref to track the latest settings for onUpdate
  const settingsRef = useRef({ autoTrimWhitespace, removeEmptyParagraphs, paragraphSpacing, bulletListStyle })
  
  // Track if editor is being updated by user (to prevent infinite loops)
  const isUserEditingRef = useRef(false)
  const lastContentRef = useRef(content)

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: false,
        blockquote: false,
        codeBlock: false,
        horizontalRule: false,
        link: false,
      }),
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
      Underline,
      TextAlign.configure({
        types: ['paragraph'],
        defaultAlignment: 'left',
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'cursor-pointer transition-colors',
          target: '_blank',
          rel: 'noopener noreferrer',
        },
      }),
      Placeholder.configure({
        placeholder: 'Profesyonel içerik oluşturun...',
      }),
    ],
    content: content || '',
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none min-h-[250px] p-6 border-0 rounded-xl bg-white',
      },
    },
    onUpdate: ({ editor }) => {
      let html = editor.getHTML()
      
      // Use ref values to ensure we have the latest settings
      const currentSettings = settingsRef.current
      
      // Add marker attributes
      const markerStyles: Record<string, string> = {
        'check': 'check',
        'check-circle': 'check-circle',
        'arrow': 'arrow',
        'arrow-right': 'arrow-right',
        'star': 'star',
        'diamond': 'diamond',
        'dash': 'dash',
        'dot': 'dot',
      }
      if (markerStyles[currentSettings.bulletListStyle]) {
        html = html.replace(/<ul>/g, `<ul data-marker="${markerStyles[currentSettings.bulletListStyle]}">`)
      }
      
      // Fix invalid HTML: Remove <p> tags inside <li> tags
      html = html.replace(/<li><p([^>]*)>(.*?)<\/p><\/li>/gi, '<li$1>$2</li>')
      
      // Remove empty paragraphs FIRST (before other processing)
      if (currentSettings.removeEmptyParagraphs) {
        // Remove empty <p></p> tags
        html = html.replace(/<p[^>]*>\s*<\/p>/gi, '')
        // Remove <p> tags with only whitespace (including &nbsp;)
        html = html.replace(/<p[^>]*>[\s\u00A0]*<\/p>/gi, '')
        // Remove <p> tags with only <br> tags
        html = html.replace(/<p[^>]*><br\s*\/?><\/p>/gi, '')
        // Remove <p> tags with only <br> and whitespace
        html = html.replace(/<p[^>]*>[\s\u00A0]*<br\s*\/?>[\s\u00A0]*<\/p>/gi, '')
      }
      
      // Whitespace management - ONLY normalize multiple spaces, preserve single spaces and word boundaries
      // This allows users to add spaces between words
      if (currentSettings.autoTrimWhitespace && typeof window !== 'undefined') {
        try {
          // Use DOM parser for safe HTML manipulation
          const parser = new DOMParser()
          const doc = parser.parseFromString(html, 'text/html')
          
          // Clean text nodes - only normalize multiple spaces, preserve single spaces and word boundaries
          const cleanTextNodes = (node: Node) => {
            if (node.nodeType === Node.TEXT_NODE) {
              const text = node.textContent || ''
              // Only normalize multiple spaces/tabs/newlines to single space
              // DON'T trim edges - preserve spaces at start/end of text nodes
              // This preserves word boundaries and prevents text from merging
              const cleaned = text.replace(/[ \t\n\r]{2,}/g, ' ')
              if (cleaned !== text) {
                node.textContent = cleaned
              }
            } else if (node.nodeType === Node.ELEMENT_NODE) {
              // Recursively clean child nodes
              Array.from(node.childNodes).forEach(cleanTextNodes)
            }
          }
          
          // Clean all text nodes
          Array.from(doc.body.childNodes).forEach(cleanTextNodes)
          
          // Get cleaned HTML - preserve structure
          html = doc.body.innerHTML
          
          // Only remove whitespace between tags that are not text nodes
          // This preserves spaces within text content
          // Don't remove all whitespace between tags - only normalize excessive whitespace
          html = html.replace(/>[\s\n\r\t]{2,}</g, '><')
          // Don't trim the entire HTML - preserve structure
        } catch (e) {
          // Fallback to simple regex if DOM parsing fails
          // Only normalize multiple spaces, don't remove single spaces
          html = html.replace(/[ \t\n\r]{2,}/g, ' ')
          // Only remove excessive whitespace between tags
          html = html.replace(/>[\s\n\r\t]{2,}</g, '><')
        }
      }
      
      // Add paragraph spacing attribute (only if not already present)
      html = html.replace(/<p([^>]*?)(?:\s+data-spacing="[^"]*")?([^>]*)>/gi, (match) => {
        // Check if data-spacing already exists
        if (match.includes('data-spacing=')) {
          // Replace existing data-spacing
          return match.replace(/data-spacing="[^"]*"/, `data-spacing="${currentSettings.paragraphSpacing}"`)
        }
      // Add new data-spacing before closing >
      return match.replace(/(<p[^>]*)(>)/, `$1 data-spacing="${currentSettings.paragraphSpacing}"$2`)
      })
      
      // Update lastContentRef
      lastContentRef.current = html
      
      // Call onUpdate
      onUpdate(html)
      
      // Reset editing flag after a short delay
      setTimeout(() => {
        isUserEditingRef.current = false
      }, 100)
    },
  })

  useEffect(() => {
    // Only update editor if content changed externally (not from user editing)
    if (editor && content !== lastContentRef.current && !isUserEditingRef.current) {
      const currentHtml = editor.getHTML()
      // Only update if content is significantly different (avoid minor updates)
      if (content !== currentHtml) {
        editor.commands.setContent(content || '', false)
        lastContentRef.current = content
        
        if (content) {
          const markerMatch = content.match(/<ul[^>]*data-marker="([^"]+)"/)
          if (markerMatch) {
            const marker = markerMatch[1]
            const reverseMap: Record<string, string> = {
              'check': 'check',
              'check-circle': 'check-circle',
              'arrow': 'arrow',
              'arrow-right': 'arrow-right',
              'star': 'star',
              'diamond': 'diamond',
              'dash': 'dash',
              'dot': 'dot',
            }
            if (reverseMap[marker]) {
              setBulletListStyle(reverseMap[marker])
            }
          }
        }
      }
    }
    // Update lastContentRef when content changes externally
    if (content !== lastContentRef.current && !isUserEditingRef.current) {
      lastContentRef.current = content
    }
  }, [content, editor])

  // Update ref and apply settings when they change
  useEffect(() => {
    settingsRef.current = { autoTrimWhitespace, removeEmptyParagraphs, paragraphSpacing, bulletListStyle }
    
    // When settings change, trigger editor update to apply changes
    if (editor) {
      // Get current HTML
      let html = editor.getHTML()
      
      // Apply all transformations
      const markerStyles: Record<string, string> = {
        'check': 'check',
        'check-circle': 'check-circle',
        'arrow': 'arrow',
        'arrow-right': 'arrow-right',
        'star': 'star',
        'diamond': 'diamond',
        'dash': 'dash',
        'dot': 'dot',
      }
      if (markerStyles[bulletListStyle]) {
        html = html.replace(/<ul([^>]*)>/g, (match, attrs) => {
          if (match.includes('data-marker=')) {
            return match.replace(/data-marker="[^"]*"/, `data-marker="${markerStyles[bulletListStyle]}"`)
          }
          return `<ul${attrs} data-marker="${markerStyles[bulletListStyle]}">`
        })
      }
      
      // Fix invalid HTML: Remove <p> tags inside <li> tags
      html = html.replace(/<li([^>]*)><p([^>]*)>(.*?)<\/p><\/li>/gi, '<li$1>$3</li>')
      
      // Remove empty paragraphs
      if (removeEmptyParagraphs) {
        html = html.replace(/<p[^>]*>\s*<\/p>/gi, '')
        html = html.replace(/<p[^>]*>[\s\u00A0]*<\/p>/gi, '')
        html = html.replace(/<p[^>]*><br\s*\/?><\/p>/gi, '')
        html = html.replace(/<p[^>]*>[\s\u00A0]*<br\s*\/?>[\s\u00A0]*<\/p>/gi, '')
      }
      
      // Whitespace management - preserve word boundaries
      if (autoTrimWhitespace && typeof window !== 'undefined') {
        try {
          const parser = new DOMParser()
          const doc = parser.parseFromString(html, 'text/html')
          const cleanTextNodes = (node: Node) => {
            if (node.nodeType === Node.TEXT_NODE) {
              const text = node.textContent || ''
              // Only normalize multiple spaces, preserve single spaces and word boundaries
              // DON'T trim - preserve spaces at edges to prevent text merging
              const cleaned = text.replace(/[ \t\n\r]{2,}/g, ' ')
              if (cleaned !== text) {
                node.textContent = cleaned
              }
            } else if (node.nodeType === Node.ELEMENT_NODE) {
              Array.from(node.childNodes).forEach(cleanTextNodes)
            }
          }
          Array.from(doc.body.childNodes).forEach(cleanTextNodes)
          // Only remove excessive whitespace between tags, not all whitespace
          html = doc.body.innerHTML.replace(/>[\s\n\r\t]{2,}</g, '><')
        } catch (e) {
          // Fallback - only normalize multiple spaces
          html = html.replace(/[ \t\n\r]{2,}/g, ' ')
          html = html.replace(/>[\s\n\r\t]{2,}</g, '><')
        }
      }
      
      // Update paragraph spacing
      html = html.replace(/<p([^>]*?)(?:\s+data-spacing="[^"]*")?([^>]*)>/gi, (match) => {
        if (match.includes('data-spacing=')) {
          return match.replace(/data-spacing="[^"]*"/, `data-spacing="${paragraphSpacing}"`)
        }
        return match.replace(/(<p[^>]*)(>)/, `$1 data-spacing="${paragraphSpacing}"$2`)
      })
      
      // Only update if HTML changed
      if (html !== editor.getHTML()) {
        const selection = editor.state.selection
        editor.commands.setContent(html, false)
        // Try to restore selection
        try {
          if (selection && selection.from !== undefined) {
            editor.commands.setTextSelection(selection)
          }
        } catch (e) {
          // Selection restore failed, that's okay
        }
      }
    }
  }, [editor, autoTrimWhitespace, removeEmptyParagraphs, paragraphSpacing, bulletListStyle])

  useEffect(() => {
    if (editor) {
      const style = document.createElement('style')
      style.id = 'description-editor-styles'
      const markerStyles: Record<string, string> = {
        'check': '✓',
        'check-circle': '✓',
        'arrow': '→',
        'arrow-right': '▶',
        'star': '★',
        'diamond': '◆',
        'dash': '—',
        'dot': '•',
      }
      const isCustomMarker = markerStyles[bulletListStyle]
      const markerChar = isCustomMarker || '✓'
      
      style.textContent = `
        .ProseMirror {
          font-size: 16px;
          line-height: 1.75;
          color: #2C2C2C;
        }
        .ProseMirror ul { 
          ${isCustomMarker 
            ? `list-style: none; padding-left: 0;`
            : `list-style-type: ${bulletListStyle}; padding-left: 1.75rem;`
          }
          margin: 0.75rem 0;
        }
        ${isCustomMarker ? `
          .ProseMirror ul li {
            position: relative;
            padding-left: 1.75rem;
            margin: 0.5rem 0;
          }
          .ProseMirror ul li::before {
            content: "${markerChar}";
            position: absolute;
            left: 0;
            ${bulletListStyle === 'check-circle' ? `
              display: inline-flex;
              align-items: center;
              justify-content: center;
              width: 1.3em;
              height: 1.3em;
              border-radius: 50%;
              background-color: #9CAF88;
              color: white;
              font-size: 0.85em;
              font-weight: bold;
            ` : `
              color: #637554;
              font-weight: 600;
              font-size: 1.1em;
            `}
          }
        ` : ''}
        .ProseMirror ol { 
          list-style-type: ${orderedListStyle}; 
          padding-left: 1.75rem; 
          margin: 0.75rem 0;
        }
        .ProseMirror li {
          margin: 0.5rem 0;
        }
        .ProseMirror a { 
          color: ${linkColor}; 
          text-decoration: ${linkStyle === 'underline' ? 'underline' : linkStyle === 'none' ? 'none' : linkStyle === 'hover-underline' ? 'none' : 'underline'};
          ${linkStyle === 'bold' ? 'font-weight: 600;' : ''}
          transition: all 0.2s ease;
        }
        ${linkStyle === 'hover-underline' ? '.ProseMirror a:hover { text-decoration: underline; }' : ''}
        .ProseMirror strong {
          font-weight: 700;
          color: #2C2C2C;
        }
        .ProseMirror em {
          font-style: italic;
        }
        .ProseMirror u {
          text-decoration: underline;
          text-decoration-thickness: 2px;
        }
        .ProseMirror p {
          margin: 0.75rem 0;
        }
        .ProseMirror p[data-spacing="compact"] {
          margin: 0.25rem 0;
        }
        .ProseMirror p[data-spacing="normal"] {
          margin: 0.75rem 0;
        }
        .ProseMirror p[data-spacing="relaxed"] {
          margin: 1.25rem 0;
        }
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #9CA3AF;
          pointer-events: none;
          height: 0;
        }
      `
      const oldStyle = document.getElementById('description-editor-styles')
      if (oldStyle) oldStyle.remove()
      document.head.appendChild(style)
      return () => {
        const styleToRemove = document.getElementById('description-editor-styles')
        if (styleToRemove) styleToRemove.remove()
      }
    }
  }, [editor, bulletListStyle, orderedListStyle, linkColor, linkStyle])

  if (!editor) {
    return (
      <div className="flex items-center justify-center min-h-[250px] bg-gray-50 rounded-xl border border-gray-200">
        <div className="text-gray-400">Editor yükleniyor...</div>
      </div>
    )
  }

  const ToolbarButton = ({ 
    onClick, 
    isActive, 
    title, 
    icon, 
    disabled = false 
  }: { 
    onClick: () => void
    isActive?: boolean
    title: string
    icon: React.ReactNode
    disabled?: boolean
  }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`
        flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200
        ${isActive
          ? 'bg-sage-500 text-white shadow-sm'
          : 'bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-gray-200'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
      title={title}
    >
      {icon}
    </button>
  )

  const TabButton = ({ 
    id, 
    label, 
    icon 
  }: { 
    id: 'format' | 'style' | 'list' | 'link'
    label: string
    icon: React.ReactNode
  }) => (
    <button
      type="button"
      onClick={() => setActiveTab(id)}
      className={`
        flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200
        ${activeTab === id
          ? 'bg-sage-500 text-white shadow-sm'
          : 'bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-gray-200'
        }
      `}
    >
      {icon}
      <span>{label}</span>
    </button>
  )

  return (
    <div className="space-y-0">
      {/* Enterprise Toolbar */}
      <div className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-200 rounded-t-xl">
        {/* Tab Navigation */}
        <div className="px-4 pt-4 pb-2 flex items-center gap-2 border-b border-gray-200">
          <TabButton 
            id="format" 
            label="Format" 
            icon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            }
          />
          <TabButton 
            id="style" 
            label="Stil" 
            icon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
            }
          />
          <TabButton 
            id="list" 
            label="Liste" 
            icon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            }
          />
          <TabButton 
            id="link" 
            label="Link" 
            icon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            }
          />
          <TabButton 
            id="spacing" 
            label="Boşluk" 
            icon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            }
          />
        </div>

        {/* Toolbar Content */}
        <div className="px-4 py-3">
          {activeTab === 'format' && (
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1 bg-white rounded-lg p-1 border border-gray-200">
                <ToolbarButton
                  onClick={() => editor.chain().focus().toggleBold().run()}
                  isActive={editor.isActive('bold')}
                  title="Kalın (Ctrl+B)"
                  icon={
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 4h8a4 4 0 014 4 4 4 0 014 4v0a4 4 0 01-4 4H6z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 12h12" />
                    </svg>
                  }
                />
                <ToolbarButton
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                  isActive={editor.isActive('italic')}
                  title="İtalik (Ctrl+I)"
                  icon={
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  }
                />
                <ToolbarButton
                  onClick={() => editor.chain().focus().toggleUnderline().run()}
                  isActive={editor.isActive('underline')}
                  title="Altı Çizili (Ctrl+U)"
                  icon={
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  }
                />
              </div>

              <div className="w-px h-8 bg-gray-300" />

              <div className="flex items-center gap-1 bg-white rounded-lg p-1 border border-gray-200">
                <ToolbarButton
                  onClick={() => editor.chain().focus().setTextAlign('left').run()}
                  isActive={editor.isActive({ textAlign: 'left' })}
                  title="Sola Hizala"
                  icon={
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 6h18M3 14h18M3 18h18" />
                    </svg>
                  }
                />
                <ToolbarButton
                  onClick={() => editor.chain().focus().setTextAlign('center').run()}
                  isActive={editor.isActive({ textAlign: 'center' })}
                  title="Ortala"
                  icon={
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 6h12M3 14h12M3 18h18" />
                    </svg>
                  }
                />
                <ToolbarButton
                  onClick={() => editor.chain().focus().setTextAlign('right').run()}
                  isActive={editor.isActive({ textAlign: 'right' })}
                  title="Sağa Hizala"
                  icon={
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-18M21 6h-12M21 14h-12M21 18h-18" />
                    </svg>
                  }
                />
              </div>

              <div className="w-px h-8 bg-gray-300" />

              <ToolbarButton
                onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
                title="Formatı Temizle"
                icon={
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                }
              />
            </div>
          )}

          {activeTab === 'style' && (
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <label className="text-xs font-medium text-gray-600 whitespace-nowrap">Metin Rengi:</label>
                <div className="relative">
                  <input
                    type="color"
                    value={editor.getAttributes('textStyle').color || '#2C2C2C'}
                    onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
                    className="w-10 h-10 rounded-lg border-2 border-gray-200 cursor-pointer hover:border-sage-400 transition-colors"
                    title="Metin Rengi"
                  />
                </div>
                <input
                  type="text"
                  value={editor.getAttributes('textStyle').color || '#2C2C2C'}
                  onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
                  className="w-20 px-2 py-1.5 text-xs font-mono border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                  placeholder="#000000"
                />
              </div>

              <div className="w-px h-8 bg-gray-300" />

              <div className="flex items-center gap-2">
                <label className="text-xs font-medium text-gray-600 whitespace-nowrap">Vurgu Rengi:</label>
                <div className="relative">
                  <input
                    type="color"
                    value={editor.getAttributes('highlight').color || '#FEF08A'}
                    onChange={(e) => editor.chain().focus().toggleHighlight({ color: e.target.value }).run()}
                    className="w-10 h-10 rounded-lg border-2 border-gray-200 cursor-pointer hover:border-sage-400 transition-colors"
                    title="Vurgu Rengi"
                  />
                </div>
                <input
                  type="text"
                  value={editor.getAttributes('highlight').color || '#FEF08A'}
                  onChange={(e) => editor.chain().focus().toggleHighlight({ color: e.target.value }).run()}
                  className="w-20 px-2 py-1.5 text-xs font-mono border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                  placeholder="#FEF08A"
                />
              </div>

              <div className="flex items-center gap-2 ml-auto">
                <span className="text-xs text-gray-500">Hızlı Renkler:</span>
                <div className="flex gap-1.5">
                  {[
                    { color: '#2C2C2C', name: 'Charcoal' },
                    { color: '#637554', name: 'Sage' },
                    { color: '#9CAF88', name: 'Sage Light' },
                    { color: '#2563eb', name: 'Mavi' },
                    { color: '#dc2626', name: 'Kırmızı' },
                    { color: '#16a34a', name: 'Yeşil' },
                  ].map((preset) => (
                    <button
                      key={preset.color}
                      type="button"
                      onClick={() => editor.chain().focus().setColor(preset.color).run()}
                      className="w-7 h-7 rounded-lg border-2 border-gray-200 hover:border-sage-500 hover:scale-110 transition-all"
                      style={{ backgroundColor: preset.color }}
                      title={preset.name}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'list' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">Madde İşaretli Liste Stili</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { value: 'disc', label: 'Dolu Daire', icon: '●' },
                    { value: 'circle', label: 'Boş Daire', icon: '○' },
                    { value: 'square', label: 'Kare', icon: '■' },
                    { value: 'check', label: 'Tik', icon: '✓' },
                    { value: 'check-circle', label: 'Daire İçinde', icon: '✓' },
                    { value: 'arrow', label: 'Ok', icon: '→' },
                    { value: 'star', label: 'Yıldız', icon: '★' },
                    { value: 'diamond', label: 'Elmas', icon: '◆' },
                  ].map((style) => (
                    <button
                      key={style.value}
                      type="button"
                      onClick={() => {
                        setBulletListStyle(style.value)
                        if (!editor.isActive('bulletList')) {
                          editor.chain().focus().toggleBulletList().run()
                        }
                      }}
                      className={`
                        flex items-center gap-2 px-3 py-2.5 rounded-lg border transition-all
                        ${bulletListStyle === style.value
                          ? 'bg-sage-500 text-white border-sage-500 shadow-sm'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-sage-400 hover:bg-gray-50'
                        }
                      `}
                    >
                      <span className="text-lg">{style.icon}</span>
                      <span className="text-xs font-medium">{style.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">Numaralı Liste Stili</label>
                <div className="grid grid-cols-5 gap-2">
                  {[
                    { value: 'decimal', label: '1, 2, 3', example: '1. 2. 3.' },
                    { value: 'lower-alpha', label: 'a, b, c', example: 'a. b. c.' },
                    { value: 'upper-alpha', label: 'A, B, C', example: 'A. B. C.' },
                    { value: 'lower-roman', label: 'i, ii, iii', example: 'i. ii. iii.' },
                    { value: 'upper-roman', label: 'I, II, III', example: 'I. II. III.' },
                  ].map((style) => (
                    <button
                      key={style.value}
                      type="button"
                      onClick={() => {
                        setOrderedListStyle(style.value)
                        if (!editor.isActive('orderedList')) {
                          editor.chain().focus().toggleOrderedList().run()
                        }
                      }}
                      className={`
                        flex flex-col items-start px-3 py-2.5 rounded-lg border transition-all
                        ${orderedListStyle === style.value
                          ? 'bg-sage-500 text-white border-sage-500 shadow-sm'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-sage-400 hover:bg-gray-50'
                        }
                      `}
                    >
                      <span className="text-xs font-semibold">{style.label}</span>
                      <span className={`text-xs mt-0.5 ${orderedListStyle === style.value ? 'text-white/80' : 'text-gray-500'}`}>
                        {style.example}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleBulletList().run()}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all
                    ${editor.isActive('bulletList')
                      ? 'bg-sage-500 text-white shadow-sm'
                      : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                    }
                  `}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                  Madde İşaretli Liste
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleOrderedList().run()}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all
                    ${editor.isActive('orderedList')
                      ? 'bg-sage-500 text-white shadow-sm'
                      : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                    }
                  `}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                  </svg>
                  Numaralı Liste
                </button>
              </div>
            </div>
          )}

          {activeTab === 'link' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const { from, to } = editor.state.selection
                    const selectedText = editor.state.doc.textBetween(from, to, ' ')
                    if (selectedText) {
                      const url = window.prompt('Link URL:', 'https://')
                      if (url) {
                        editor.chain().focus().setLink({ href: url }).run()
                      }
                    } else {
                      setShowLinkDialog(true)
                    }
                  }}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all
                    ${editor.isActive('link')
                      ? 'bg-sage-500 text-white shadow-sm'
                      : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                    }
                  `}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  Link Ekle/Düzenle
                </button>
                {editor.isActive('link') && (
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().unsetLink().run()}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Linki Kaldır
                  </button>
                )}
              </div>

              {editor.isActive('link') && (
                <>
                  <div className="flex items-center gap-4 pt-2 border-t border-gray-200">
                    <div className="flex items-center gap-2">
                      <label className="text-xs font-medium text-gray-600 whitespace-nowrap">Link Rengi:</label>
                      <input
                        type="color"
                        value={linkColor}
                        onChange={(e) => setLinkColor(e.target.value)}
                        className="w-10 h-10 rounded-lg border-2 border-gray-200 cursor-pointer hover:border-sage-400 transition-colors"
                      />
                      <input
                        type="text"
                        value={linkColor}
                        onChange={(e) => setLinkColor(e.target.value)}
                        className="w-24 px-2 py-1.5 text-xs font-mono border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <label className="text-xs font-medium text-gray-600 whitespace-nowrap">Link Stili:</label>
                      <select
                        value={linkStyle}
                        onChange={(e) => setLinkStyle(e.target.value)}
                        className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent bg-white"
                      >
                        <option value="underline">Altı Çizili</option>
                        <option value="none">Altı Çizili Yok</option>
                        <option value="hover-underline">Hover'da Altı Çizili</option>
                        <option value="bold">Kalın</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
                    <span className="text-xs text-gray-500">Hızlı Renkler:</span>
                    <div className="flex gap-1.5">
                      {[
                        { color: '#637554', name: 'Sage' },
                        { color: '#9CAF88', name: 'Sage Light' },
                        { color: '#2C2C2C', name: 'Charcoal' },
                        { color: '#2563eb', name: 'Mavi' },
                        { color: '#dc2626', name: 'Kırmızı' },
                        { color: '#16a34a', name: 'Yeşil' },
                      ].map((preset) => (
                        <button
                          key={preset.color}
                          type="button"
                          onClick={() => setLinkColor(preset.color)}
                          className="w-7 h-7 rounded-lg border-2 border-gray-200 hover:border-sage-500 hover:scale-110 transition-all"
                          style={{ backgroundColor: preset.color }}
                          title={preset.name}
                        />
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === 'spacing' && (
            <div className="space-y-4">
              <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-1">Otomatik Boşluk Temizleme</label>
                    <p className="text-xs text-gray-500">Fazla boşlukları otomatik olarak temizler</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={autoTrimWhitespace}
                      onChange={(e) => {
                        const newValue = e.target.checked
                        setAutoTrimWhitespace(newValue)
                        settingsRef.current.autoTrimWhitespace = newValue
                        // Trigger immediate update
                        if (editor) {
                          setTimeout(() => {
                            const html = editor.getHTML()
                            if (newValue && typeof window !== 'undefined') {
                              try {
                                const parser = new DOMParser()
                                const doc = parser.parseFromString(html, 'text/html')
                                const cleanTextNodes = (node: Node) => {
                                  if (node.nodeType === Node.TEXT_NODE) {
                                    const text = node.textContent || ''
                                    // Only normalize multiple spaces, preserve single spaces and word boundaries
                                    // DON'T trim - preserve spaces at edges
                                    const cleaned = text.replace(/[ \t\n\r]{2,}/g, ' ')
                                    if (cleaned !== text) {
                                      node.textContent = cleaned
                                    }
                                  } else if (node.nodeType === Node.ELEMENT_NODE) {
                                    Array.from(node.childNodes).forEach(cleanTextNodes)
                                  }
                                }
                                Array.from(doc.body.childNodes).forEach(cleanTextNodes)
                                // Only remove excessive whitespace between tags
                                const cleanedHtml = doc.body.innerHTML.replace(/>[\s\n\r\t]{2,}</g, '><')
                                if (cleanedHtml !== html) {
                                  editor.commands.setContent(cleanedHtml, false)
                                }
                              } catch (e) {
                                // Fallback - only normalize multiple spaces
                                const cleanedHtml = html.replace(/[ \t\n\r]{2,}/g, ' ').replace(/>[\s\n\r\t]{2,}</g, '><')
                                if (cleanedHtml !== html) {
                                  editor.commands.setContent(cleanedHtml, false)
                                }
                              }
                            }
                          }, 50)
                        }
                      }}
                      className="sr-only peer"
                    />
                    <div className={`w-11 h-6 rounded-full peer transition-colors ${
                      autoTrimWhitespace 
                        ? 'bg-sage-500' 
                        : 'bg-gray-200'
                    } peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sage-300 peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all`}></div>
                  </label>
                </div>

                <div className="h-px bg-gray-200" />

                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-1">Boş Paragrafları Kaldır</label>
                    <p className="text-xs text-gray-500">Boş paragrafları otomatik olarak temizler</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={removeEmptyParagraphs}
                      onChange={(e) => {
                        const newValue = e.target.checked
                        setRemoveEmptyParagraphs(newValue)
                        settingsRef.current.removeEmptyParagraphs = newValue
                        // Trigger immediate update
                        if (editor) {
                          setTimeout(() => {
                            let html = editor.getHTML()
                            if (newValue) {
                              html = html.replace(/<p[^>]*>\s*<\/p>/gi, '')
                              html = html.replace(/<p[^>]*>[\s\u00A0]*<\/p>/gi, '')
                              html = html.replace(/<p[^>]*><br\s*\/?><\/p>/gi, '')
                              html = html.replace(/<p[^>]*>[\s\u00A0]*<br\s*\/?>[\s\u00A0]*<\/p>/gi, '')
                              if (html !== editor.getHTML()) {
                                editor.commands.setContent(html, false)
                              }
                            }
                          }, 50)
                        }
                      }}
                      className="sr-only peer"
                    />
                    <div className={`w-11 h-6 rounded-full peer transition-colors ${
                      removeEmptyParagraphs 
                        ? 'bg-sage-500' 
                        : 'bg-gray-200'
                    } peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sage-300 peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all`}></div>
                  </label>
                </div>

                <div className="h-px bg-gray-200" />

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">Paragraf Aralığı</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: 'compact', label: 'Sıkı', desc: '0.25rem', preview: 'Kısa aralık' },
                      { value: 'normal', label: 'Normal', desc: '0.75rem', preview: 'Standart aralık' },
                      { value: 'relaxed', label: 'Geniş', desc: '1.25rem', preview: 'Geniş aralık' },
                    ].map((spacing) => (
                      <button
                        key={spacing.value}
                        type="button"
                        onClick={() => {
                          const newSpacing = spacing.value as 'compact' | 'normal' | 'relaxed'
                          setParagraphSpacing(newSpacing)
                          settingsRef.current.paragraphSpacing = newSpacing
                          // Trigger immediate update
                          if (editor) {
                            setTimeout(() => {
                              let html = editor.getHTML()
                              html = html.replace(/<p([^>]*?)(?:\s+data-spacing="[^"]*")?([^>]*)>/gi, (match) => {
                                if (match.includes('data-spacing=')) {
                                  return match.replace(/data-spacing="[^"]*"/, `data-spacing="${newSpacing}"`)
                                }
                                return match.replace(/(<p[^>]*)(>)/, `$1 data-spacing="${newSpacing}"$2`)
                              })
                              if (html !== editor.getHTML()) {
                                editor.commands.setContent(html, false)
                              }
                            }, 50)
                          }
                        }}
                        className={`
                          flex flex-col items-start px-4 py-3 rounded-lg border transition-all
                          ${paragraphSpacing === spacing.value
                            ? 'bg-sage-500 text-white border-sage-500 shadow-sm'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-sage-400 hover:bg-gray-50'
                          }
                        `}
                      >
                        <div className="flex items-center justify-between w-full mb-1">
                          <span className="font-semibold text-sm">{spacing.label}</span>
                          <span className={`text-xs ${paragraphSpacing === spacing.value ? 'text-white/80' : 'text-gray-500'}`}>
                            {spacing.desc}
                          </span>
                        </div>
                        <span className={`text-xs ${paragraphSpacing === spacing.value ? 'text-white/70' : 'text-gray-500'}`}>
                          {spacing.preview}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-blue-900 mb-1">Boşluk Yönetimi</h4>
                    <p className="text-xs text-blue-700 leading-relaxed">
                      {autoTrimWhitespace && removeEmptyParagraphs
                        ? 'Boşluklar ve boş paragraflar otomatik olarak temizleniyor. İçerik daha temiz ve optimize edilmiş olacak.'
                        : autoTrimWhitespace
                        ? 'Fazla boşluklar otomatik olarak temizleniyor.'
                        : removeEmptyParagraphs
                        ? 'Boş paragraflar otomatik olarak kaldırılıyor.'
                        : 'Boşluk yönetimi kapalı. Tüm boşluklar korunacak.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Link Dialog */}
      {showLinkDialog && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Link Ekle</h3>
              <button
                type="button"
                onClick={() => {
                  setShowLinkDialog(false)
                  setLinkUrl('')
                  setLinkText('')
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Link Metni</label>
              <input
                type="text"
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
                placeholder="Tıklanabilir metin"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Link URL</label>
              <input
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  if (editor && linkUrl && linkText) {
                    editor.chain().focus().insertContent(`<a href="${linkUrl}">${linkText}</a>`).run()
                    setShowLinkDialog(false)
                    setLinkUrl('')
                    setLinkText('')
                  }
                }}
                disabled={!linkUrl || !linkText}
                className="flex-1 px-4 py-2.5 bg-sage-500 text-white rounded-lg hover:bg-sage-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                Ekle
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowLinkDialog(false)
                  setLinkUrl('')
                  setLinkText('')
                }}
                className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                İptal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Editor Content */}
      <div className="bg-white border-x border-b border-gray-200 rounded-b-xl overflow-hidden">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
