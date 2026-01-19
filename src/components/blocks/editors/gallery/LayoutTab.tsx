'use client'

import { GalleryContent } from '../../types'

import {
  LAYOUT_TYPE_OPTIONS,
  COLUMN_OPTIONS,
  MOBILE_COLUMN_OPTIONS,
  ASPECT_RATIO_OPTIONS,
  GAP_OPTIONS
} from './defaults'

interface LayoutTabProps {
  content: GalleryContent
  updateContent: (updates: Partial<GalleryContent>) => void
}

export default function LayoutTab({ content, updateContent }: LayoutTabProps) {
  const updateLayout = (field: keyof GalleryContent['layout'], value: any) => {
    updateContent({
      layout: { ...content.layout, [field]: value }
    })
  }

  return (
    <div className="space-y-6">
      {/* Layout Type */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-3">
          Duzenleme Tipi
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {LAYOUT_TYPE_OPTIONS.map((option) => (
            <button
              key={option.id}
              onClick={() => updateLayout('type', option.id)}
              className={`p-4 border-2 rounded-xl text-center transition-all ${
                content.layout.type === option.id
                  ? 'border-sage-500 bg-sage-50 text-sage-700'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="text-2xl mb-2">{option.icon}</div>
              <span className="text-sm font-medium">{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Columns */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-3">
          Kolon Sayisi (Masaustu)
        </label>
        <div className="grid grid-cols-5 gap-2">
          {COLUMN_OPTIONS.map((option) => (
            <button
              key={option.id}
              onClick={() => updateLayout('columns', option.id)}
              className={`p-3 border-2 rounded-xl text-center transition-all ${
                content.layout.columns === option.id
                  ? 'border-sage-500 bg-sage-50 text-sage-700'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <span className="text-sm font-medium">{option.id}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Columns */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-3">
          Kolon Sayisi (Mobil)
        </label>
        <div className="grid grid-cols-2 gap-3">
          {MOBILE_COLUMN_OPTIONS.map((option) => (
            <button
              key={option.id}
              onClick={() => updateLayout('mobileColumns', option.id)}
              className={`p-3 border-2 rounded-xl text-center transition-all ${
                content.layout.mobileColumns === option.id
                  ? 'border-sage-500 bg-sage-50 text-sage-700'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <span className="text-sm font-medium">{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Aspect Ratio */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-3">
          En-Boy Orani
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {ASPECT_RATIO_OPTIONS.map((option) => (
            <button
              key={option.id}
              onClick={() => updateLayout('aspectRatio', option.id)}
              className={`p-3 border-2 rounded-xl text-center transition-all ${
                content.layout.aspectRatio === option.id
                  ? 'border-sage-500 bg-sage-50 text-sage-700'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <span className="text-xs font-medium">{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Gap */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-3">
          Gorsel Araligi
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {GAP_OPTIONS.map((option) => (
            <button
              key={option.id}
              onClick={() => updateLayout('gap', option.id)}
              className={`p-3 border-2 rounded-xl text-center transition-all ${
                content.layout.gap === option.id
                  ? 'border-sage-500 bg-sage-50 text-sage-700'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <span className="text-xs font-medium">{option.id}px</span>
            </button>
          ))}
        </div>
      </div>

      {/* Preview */}
      <div className="p-4 bg-slate-50 rounded-xl">
        <h4 className="text-sm font-medium text-slate-700 mb-3">Onizleme</h4>
        <div
          className="grid bg-white rounded-lg p-4 border border-slate-200"
          style={{
            gridTemplateColumns: `repeat(${Math.min(content.layout.columns, 4)}, 1fr)`,
            gap: `${content.layout.gap}px`
          }}
        >
          {[1, 2, 3, 4, 5, 6].slice(0, content.layout.columns).map((i) => (
            <div
              key={i}
              className="bg-slate-200 rounded-lg flex items-center justify-center text-slate-400 text-sm font-medium"
              style={{
                aspectRatio: content.layout.aspectRatio === 'square' ? '1/1' :
                  content.layout.aspectRatio === '4:3' ? '4/3' :
                  content.layout.aspectRatio === '16:9' ? '16/9' :
                  content.layout.aspectRatio === '3:2' ? '3/2' : '1/1'
              }}
            >
              {i}
            </div>
          ))}
        </div>
      </div>

      {/* Background Color */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Arkaplan Rengi
        </label>
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={content.backgroundColor || '#ffffff'}
            onChange={(e) => updateContent({ backgroundColor: e.target.value })}
            className="w-12 h-12 rounded-lg border border-slate-200 cursor-pointer"
          />
          <input
            type="text"
            value={content.backgroundColor || '#ffffff'}
            onChange={(e) => updateContent({ backgroundColor: e.target.value })}
            className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent font-mono text-sm"
          />
        </div>
      </div>
    </div>
  )
}
