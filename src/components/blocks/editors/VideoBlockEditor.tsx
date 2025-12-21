'use client'

import { useState, useEffect } from 'react'
import { VideoContent } from '../types'

interface VideoBlockEditorProps {
  content: VideoContent
  onUpdate: (content: Partial<VideoContent>) => void
}

export default function VideoBlockEditor({ content, onUpdate }: VideoBlockEditorProps) {
  const [localContent, setLocalContent] = useState<VideoContent>(content)

  useEffect(() => {
    const timer = setTimeout(() => {
      onUpdate(localContent)
    }, 300)
    return () => clearTimeout(timer)
  }, [localContent, onUpdate])

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Block Başlığı (Opsiyonel)
        </label>
        <input
          type="text"
          value={localContent.title || ''}
          onChange={(e) => setLocalContent({ ...localContent, title: e.target.value })}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sage-500"
          placeholder="Video Başlığı"
        />
      </div>

      {/* Video URL */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Video URL *
        </label>
        <input
          type="text"
          value={localContent.videoUrl}
          onChange={(e) => setLocalContent({ ...localContent, videoUrl: e.target.value })}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sage-500"
          placeholder="https://www.youtube.com/watch?v=..."
        />
        <p className="mt-1 text-sm text-slate-500">
          YouTube, Vimeo veya direkt video URL'i girin
        </p>
      </div>

      {/* Provider Selection */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Video Platformu
        </label>
        <div className="grid grid-cols-3 gap-3">
          {['youtube', 'vimeo', 'custom'].map((provider) => (
            <button
              key={provider}
              type="button"
              onClick={() => setLocalContent({ ...localContent, provider: provider as any })}
              className={`py-2 px-4 rounded-lg border-2 transition-colors capitalize ${
                localContent.provider === provider
                  ? 'border-sage-500 bg-sage-50 text-sage-700'
                  : 'border-slate-300 hover:border-sage-300'
              }`}
            >
              {provider}
            </button>
          ))}
        </div>
      </div>

      {/* Options */}
      <div className="space-y-3 p-4 bg-slate-50 rounded-lg">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="autoplay"
            checked={localContent.autoplay || false}
            onChange={(e) => setLocalContent({ ...localContent, autoplay: e.target.checked })}
            className="w-5 h-5 text-sage-600 rounded focus:ring-sage-500"
          />
          <label htmlFor="autoplay" className="text-sm font-medium text-slate-700">
            Otomatik başlat
          </label>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="showControls"
            checked={localContent.showControls !== false}
            onChange={(e) => setLocalContent({ ...localContent, showControls: e.target.checked })}
            className="w-5 h-5 text-sage-600 rounded focus:ring-sage-500"
          />
          <label htmlFor="showControls" className="text-sm font-medium text-slate-700">
            Kontrolleri göster
          </label>
        </div>
      </div>

      {/* Preview */}
      {localContent.videoUrl && (
        <div className="p-4 bg-slate-100 rounded-lg">
          <p className="text-sm font-medium text-slate-700 mb-2">Önizleme:</p>
          <div className="aspect-video bg-slate-800 rounded-lg flex items-center justify-center">
            <span className="text-white">🎥 Video: {localContent.provider || 'youtube'}</span>
          </div>
        </div>
      )}
    </div>
  )
}
