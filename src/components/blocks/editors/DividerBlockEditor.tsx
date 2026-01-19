'use client'

import { useState, useEffect, useRef } from 'react'

import { DividerContent } from '../types'

interface DividerBlockEditorProps {
  content: DividerContent
  onUpdate: (content: Partial<DividerContent>) => void
}

export default function DividerBlockEditor({ content, onUpdate }: DividerBlockEditorProps) {
  const [localContent, setLocalContent] = useState<DividerContent>(content)

  const isInitialMount = useRef(true)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }
    const timer = setTimeout(() => {
      onUpdate(localContent)
    }, 300)
    return () => clearTimeout(timer)
  }, [localContent, onUpdate])

  return (
    <div className="space-y-6">
      {/* Height Slider */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Yükseklik: {localContent.height || 40}px
        </label>
        <input
          type="range"
          min="20"
          max="200"
          step="10"
          value={localContent.height || 40}
          onChange={(e) => setLocalContent({ ...localContent, height: parseInt(e.target.value) })}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-slate-500 mt-1">
          <span>20px</span>
          <span>200px</span>
        </div>
      </div>

      {/* Show Line Toggle */}
      <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
        <input
          type="checkbox"
          id="showLine"
          checked={localContent.showLine !== false}
          onChange={(e) => setLocalContent({ ...localContent, showLine: e.target.checked })}
          className="w-5 h-5 text-sage-600 rounded focus:ring-sage-500"
        />
        <label htmlFor="showLine" className="text-sm font-medium text-slate-700">
          Çizgi göster
        </label>
      </div>

      {/* Line Color */}
      {localContent.showLine !== false && (
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Çizgi Rengi
          </label>
          <div className="flex gap-3">
            <input
              type="color"
              value={localContent.lineColor || '#e5e7eb'}
              onChange={(e) => setLocalContent({ ...localContent, lineColor: e.target.value })}
              className="w-20 h-10 rounded border border-slate-300"
            />
            <input
              type="text"
              value={localContent.lineColor || '#e5e7eb'}
              onChange={(e) => setLocalContent({ ...localContent, lineColor: e.target.value })}
              className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sage-500"
              placeholder="#e5e7eb"
            />
          </div>
        </div>
      )}

      {/* Preview */}
      <div className="p-6 bg-slate-100 rounded-lg">
        <p className="text-sm font-medium text-slate-700 mb-3">Önizleme:</p>
        <div style={{ height: localContent.height || 40 }} className="flex items-center">
          {localContent.showLine !== false && (
            <div
              className="w-full"
              style={{
                height: '1px',
                backgroundColor: localContent.lineColor || '#e5e7eb'
              }}
            />
          )}
        </div>
      </div>
    </div>
  )
}
