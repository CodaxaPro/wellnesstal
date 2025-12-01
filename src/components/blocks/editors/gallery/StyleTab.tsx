'use client'

import { GalleryContent } from '../../types'
import {
  SHADOW_OPTIONS,
  HOVER_EFFECT_OPTIONS,
  CAPTION_POSITION_OPTIONS,
  BORDER_RADIUS_OPTIONS
} from './defaults'

interface StyleTabProps {
  content: GalleryContent
  updateContent: (updates: Partial<GalleryContent>) => void
}

export default function StyleTab({ content, updateContent }: StyleTabProps) {
  const updateStyle = (field: keyof GalleryContent['style'], value: any) => {
    updateContent({
      style: { ...content.style, [field]: value }
    })
  }

  return (
    <div className="space-y-6">
      {/* Border Radius */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-3">
          Kose Yuvarlatligi
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {BORDER_RADIUS_OPTIONS.map((option) => (
            <button
              key={option.id}
              onClick={() => updateStyle('borderRadius', option.id)}
              className={`p-3 border-2 rounded-xl text-center transition-all ${
                content.style.borderRadius === option.id
                  ? 'border-sage-500 bg-sage-50 text-sage-700'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <span className="text-xs font-medium">{option.id}px</span>
            </button>
          ))}
        </div>
      </div>

      {/* Shadow */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-3">
          Golge
        </label>
        <div className="grid grid-cols-5 gap-2">
          {SHADOW_OPTIONS.map((option) => (
            <button
              key={option.id}
              onClick={() => updateStyle('shadow', option.id)}
              className={`p-3 border-2 rounded-xl text-center transition-all ${
                content.style.shadow === option.id
                  ? 'border-sage-500 bg-sage-50 text-sage-700'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <span className="text-xs font-medium">{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Hover Effect */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-3">
          Hover Efekti
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {HOVER_EFFECT_OPTIONS.map((option) => (
            <button
              key={option.id}
              onClick={() => updateStyle('hoverEffect', option.id)}
              className={`p-3 border-2 rounded-xl text-center transition-all ${
                content.style.hoverEffect === option.id
                  ? 'border-sage-500 bg-sage-50 text-sage-700'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <span className="text-xs font-medium">{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Caption Settings */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-slate-700">Aciklama Ayarlari</h4>

        {/* Show Caption */}
        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
          <div>
            <span className="font-medium text-slate-700">Aciklama Goster</span>
            <p className="text-xs text-slate-500">Gorsel altinda veya uzerinde aciklama goster</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={content.style.showCaption}
              onChange={(e) => updateStyle('showCaption', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sage-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sage-500"></div>
          </label>
        </div>

        {/* Caption Position */}
        {content.style.showCaption && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Aciklama Konumu
            </label>
            <div className="grid grid-cols-2 gap-3">
              {CAPTION_POSITION_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  onClick={() => updateStyle('captionPosition', option.id)}
                  className={`p-3 border-2 rounded-xl text-center transition-all ${
                    content.style.captionPosition === option.id
                      ? 'border-sage-500 bg-sage-50 text-sage-700'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span className="text-sm font-medium">{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Overlay Settings */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-slate-700">Overlay Ayarlari</h4>

        {/* Overlay Color */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Overlay Rengi
          </label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={content.style.overlayColor}
              onChange={(e) => updateStyle('overlayColor', e.target.value)}
              className="w-12 h-12 rounded-lg border border-slate-200 cursor-pointer"
            />
            <input
              type="text"
              value={content.style.overlayColor}
              onChange={(e) => updateStyle('overlayColor', e.target.value)}
              className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent font-mono text-sm"
            />
          </div>
        </div>

        {/* Overlay Opacity */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Overlay Seffafligi: {content.style.overlayOpacity}%
          </label>
          <input
            type="range"
            min={0}
            max={100}
            value={content.style.overlayOpacity}
            onChange={(e) => updateStyle('overlayOpacity', parseInt(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sage-500"
          />
          <div className="flex justify-between text-xs text-slate-400 mt-1">
            <span>0%</span>
            <span>100%</span>
          </div>
        </div>
      </div>

      {/* Style Preview */}
      <div className="p-4 bg-slate-50 rounded-xl">
        <h4 className="text-sm font-medium text-slate-700 mb-3">Stil Onizlemesi</h4>
        <div className="flex justify-center">
          <div
            className="relative w-48 h-48 bg-gradient-to-br from-sage-200 to-forest-200 group cursor-pointer overflow-hidden"
            style={{
              borderRadius: `${content.style.borderRadius}px`,
              boxShadow: content.style.shadow === 'none' ? 'none' :
                content.style.shadow === 'sm' ? '0 1px 2px rgba(0,0,0,0.05)' :
                content.style.shadow === 'md' ? '0 4px 6px rgba(0,0,0,0.1)' :
                content.style.shadow === 'lg' ? '0 10px 15px rgba(0,0,0,0.1)' :
                '0 20px 25px rgba(0,0,0,0.15)'
            }}
          >
            {/* Hover overlay simulation */}
            <div
              className="absolute inset-0 transition-opacity duration-300 group-hover:opacity-100 opacity-0"
              style={{
                backgroundColor: content.style.overlayColor,
                opacity: content.style.overlayOpacity / 100
              }}
            />

            {/* Caption preview */}
            {content.style.showCaption && content.style.captionPosition === 'overlay' && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-white text-sm">Gorsel Aciklamasi</p>
              </div>
            )}

            <div className="absolute inset-0 flex items-center justify-center text-slate-500 text-sm">
              Hover yapin
            </div>
          </div>
        </div>
        {content.style.showCaption && content.style.captionPosition === 'below' && (
          <div className="mt-2 text-center">
            <p className="text-sm text-slate-600">Gorsel Aciklamasi</p>
          </div>
        )}
      </div>
    </div>
  )
}
