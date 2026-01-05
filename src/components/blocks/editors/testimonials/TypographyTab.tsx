'use client'

import { TestimonialsContent, TestimonialsBlockStyles } from '../../types'

interface TypographyTabProps {
  content: TestimonialsContent
  updateContent: (updates: Partial<TestimonialsContent>) => void
}

export default function TypographyTab({ content, updateContent }: TypographyTabProps) {
  const updateStyle = (section: keyof TestimonialsBlockStyles, field: string, value: string) => {
    updateContent({
      styles: {
        ...content.styles,
        [section]: {
          ...content.styles?.[section],
          [field]: value
        }
      }
    })
  }

  const fontFamilies = [
    { value: "'Poppins', sans-serif", label: 'Poppins' },
    { value: "'Inter', sans-serif", label: 'Inter' },
    { value: "'Roboto', sans-serif", label: 'Roboto' },
    { value: "'Open Sans', sans-serif", label: 'Open Sans' },
    { value: 'system-ui, sans-serif', label: 'System UI' },
  ]

  const fontSizes = ['12px', '14px', '16px', '18px', '20px', '24px', '32px', '36px', '48px', '72px']
  const fontWeights = ['400', '500', '600', '700', '800', '900']

  const StyleSection = ({ 
    title, 
    section 
  }: { 
    title: string
    section: keyof TestimonialsBlockStyles 
  }) => (
    <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-3">
      <h4 className="text-xs font-semibold text-slate-700">{title}</h4>
      
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-slate-500 mb-1">Font</label>
          <select
            value={content.styles?.[section]?.fontFamily || "'Poppins', sans-serif"}
            onChange={(e) => updateStyle(section, 'fontFamily', e.target.value)}
            className="w-full px-2 py-1.5 border border-slate-200 rounded text-sm"
          >
            {fontFamilies.map(font => (
              <option key={font.value} value={font.value}>{font.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs text-slate-500 mb-1">Boyut</label>
          <select
            value={content.styles?.[section]?.fontSize || '14px'}
            onChange={(e) => updateStyle(section, 'fontSize', e.target.value)}
            className="w-full px-2 py-1.5 border border-slate-200 rounded text-sm"
          >
            {fontSizes.map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs text-slate-500 mb-1">Ağırlık</label>
          <select
            value={content.styles?.[section]?.fontWeight || '400'}
            onChange={(e) => updateStyle(section, 'fontWeight', e.target.value)}
            className="w-full px-2 py-1.5 border border-slate-200 rounded text-sm"
          >
            {fontWeights.map(weight => (
              <option key={weight} value={weight}>{weight}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs text-slate-500 mb-1">Renk</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={content.styles?.[section]?.color || '#000000'}
              onChange={(e) => updateStyle(section, 'color', e.target.value)}
              className="w-10 h-8 rounded border border-slate-200 cursor-pointer"
            />
            <input
              type="text"
              value={content.styles?.[section]?.color || '#000000'}
              onChange={(e) => updateStyle(section, 'color', e.target.value)}
              className="flex-1 px-2 py-1.5 border border-slate-200 rounded text-sm font-mono"
            />
          </div>
        </div>
      </div>

      {section === 'badge' && (
        <div>
          <label className="block text-xs text-slate-500 mb-1">Arkaplan Rengi</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={content.styles?.badge?.backgroundColor || '#eef1ea'}
              onChange={(e) => updateStyle('badge', 'backgroundColor', e.target.value)}
              className="w-10 h-8 rounded border border-slate-200 cursor-pointer"
            />
            <input
              type="text"
              value={content.styles?.badge?.backgroundColor || '#eef1ea'}
              onChange={(e) => updateStyle('badge', 'backgroundColor', e.target.value)}
              className="flex-1 px-2 py-1.5 border border-slate-200 rounded text-sm font-mono"
            />
          </div>
        </div>
      )}
    </div>
  )

  return (
    <div className="space-y-4">
      <StyleSection title="Badge Stili" section="badge" />
      <StyleSection title="Başlık Stili" section="sectionTitle" />
      <StyleSection title="Vurgulu Metin Stili" section="highlightedText" />
      <StyleSection title="Açıklama Stili" section="description" />
      <StyleSection title="İstatistik Değer Stili" section="statsValue" />
      <StyleSection title="İstatistik Label Stili" section="statsLabel" />
    </div>
  )
}

