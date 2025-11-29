'use client'

import { useState } from 'react'
import { HeroContent } from '../../types'

interface MediaTabProps {
  content: HeroContent
  updateContent: (u: Partial<HeroContent>) => void
  updateNestedContent: (key: keyof HeroContent, nestedKey: string, value: any) => void
  handleImageUpload: (file: File) => void
  handleDeleteImage: () => void
  uploading: boolean
}

export default function MediaTab({
  content,
  updateContent,
  updateNestedContent,
  handleImageUpload,
  handleDeleteImage,
  uploading
}: MediaTabProps) {
  const [activeMediaType, setActiveMediaType] = useState<'image' | 'video'>(content.mediaType === 'video' ? 'video' : 'image')

  return (
    <div className="space-y-6">
      {/* Media Type Selection */}
      <div className="p-4 bg-white rounded-xl border border-slate-200">
        <label className="block text-sm font-semibold text-slate-700 mb-3">Medya Tipi</label>
        <div className="grid grid-cols-4 gap-2">
          {[
            { id: 'image', label: 'Görsel', icon: '🖼️' },
            { id: 'video', label: 'Video', icon: '🎬' },
            { id: 'gradient', label: 'Gradient', icon: '🌈' },
            { id: 'none', label: 'Yok', icon: '⬜' },
          ].map(type => (
            <button
              key={type.id}
              onClick={() => {
                updateContent({ mediaType: type.id as any })
                if (type.id === 'image' || type.id === 'video') {
                  setActiveMediaType(type.id)
                }
              }}
              className={`p-3 rounded-xl border-2 transition-all ${
                content.mediaType === type.id
                  ? 'border-sage-500 bg-sage-50'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="text-2xl mb-1">{type.icon}</div>
              <div className="text-xs font-medium">{type.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Image Upload */}
      {content.mediaType === 'image' && (
        <div className="p-4 bg-white rounded-xl border border-slate-200">
          <label className="block text-sm font-semibold text-slate-700 mb-3">Görsel</label>

          {/* Preview or Upload Zone */}
          <div className="mb-4">
            {content.image?.url ? (
              <div className="relative group">
                <img
                  src={content.image.url}
                  alt={content.image.alt || 'Hero görsel'}
                  className="w-full h-64 object-cover rounded-xl border border-slate-200"
                  style={{
                    borderRadius: content.imageStyles?.borderRadius || '16px',
                    filter: `brightness(${content.imageStyles?.brightness || 100}%) contrast(${content.imageStyles?.contrast || 100}%) saturate(${content.imageStyles?.saturation || 100}%) blur(${content.imageStyles?.blur || 0}px)`,
                    opacity: (content.imageStyles?.opacity || 100) / 100,
                  }}
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-3">
                  <label className="cursor-pointer bg-white hover:bg-slate-100 text-slate-700 px-4 py-2 rounded-lg flex items-center gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                      disabled={uploading}
                    />
                    {uploading ? (
                      <div className="animate-spin h-5 w-5 border-2 border-sage-500 border-t-transparent rounded-full" />
                    ) : (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    )}
                    <span className="text-sm font-medium">Değiştir</span>
                  </label>
                  <button
                    onClick={handleDeleteImage}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <span className="text-sm font-medium">Sil</span>
                  </button>
                </div>
              </div>
            ) : (
              <label className="w-full h-64 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-sage-500 hover:bg-sage-50 transition-all">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                  disabled={uploading}
                />
                {uploading ? (
                  <div className="flex flex-col items-center">
                    <div className="animate-spin h-12 w-12 border-3 border-sage-500 border-t-transparent rounded-full mb-3" />
                    <span className="text-sm text-sage-600">Yükleniyor...</span>
                  </div>
                ) : (
                  <>
                    <svg className="w-16 h-16 text-slate-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span className="text-sm text-slate-500 font-medium">Görsel yüklemek için tıklayın</span>
                    <span className="text-xs text-slate-400 mt-1">veya sürükleyip bırakın</span>
                    <span className="text-xs text-slate-400 mt-2">Max 10MB • JPG, PNG, WebP, GIF</span>
                  </>
                )}
              </label>
            )}
          </div>

          {/* URL & Alt Text */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs text-slate-500 mb-1">Görsel URL</label>
              <input
                type="text"
                value={content.image?.url || ''}
                onChange={(e) => updateContent({ image: { ...content.image, url: e.target.value, alt: content.image?.alt || '' } })}
                placeholder="https://..."
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-sage-500"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Alt Metin (SEO)</label>
              <input
                type="text"
                value={content.image?.alt || ''}
                onChange={(e) => updateContent({ image: { ...content.image, url: content.image?.url || '', alt: e.target.value } })}
                placeholder="Görsel açıklaması..."
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-sage-500"
              />
            </div>
          </div>

          {/* Image Effects */}
          <div className="p-4 bg-gradient-to-r from-purple-50 to-sage-50 rounded-xl border border-purple-100">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg">✨</span>
              <h4 className="text-sm font-semibold text-slate-700">Görsel Efektleri</h4>
            </div>

            {/* Enterprise Image Size & Dimension Controls */}
            <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-200 mb-4">
              <h5 className="text-sm font-bold text-indigo-800 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 bg-indigo-500 rounded-lg flex items-center justify-center text-white text-xs">📐</span>
                Görsel Ebat & Boyut Ayarları
              </h5>

              {/* Size Mode Selection */}
              <div className="mb-4">
                <label className="block text-xs font-semibold text-indigo-700 mb-2">Boyutlandırma Modu</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { value: 'auto', label: 'Otomatik', icon: '🔄', desc: 'Görsel oranına göre' },
                    { value: 'fixed', label: 'Sabit', icon: '📏', desc: 'Piksel değerleri' },
                    { value: 'responsive', label: 'Duyarlı', icon: '📱', desc: 'Ekrana göre uyum' },
                    { value: 'aspect-ratio', label: 'Oran', icon: '🖼️', desc: 'En-boy oranı' }
                  ].map((mode) => (
                    <button
                      key={mode.value}
                      type="button"
                      onClick={() => updateNestedContent('imageStyles', 'sizeMode', mode.value)}
                      className={`p-3 rounded-lg border-2 transition-all text-center ${
                        (content.imageStyles?.sizeMode || 'auto') === mode.value
                          ? 'border-indigo-500 bg-indigo-100 shadow-md'
                          : 'border-slate-200 bg-white hover:border-indigo-300'
                      }`}
                    >
                      <span className="text-xl block mb-1">{mode.icon}</span>
                      <span className="text-xs font-semibold text-slate-700 block">{mode.label}</span>
                      <span className="text-[10px] text-slate-500">{mode.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Aspect Ratio Settings - shown when aspect-ratio mode */}
              {(content.imageStyles?.sizeMode === 'aspect-ratio') && (
                <div className="mb-4 p-3 bg-white/70 rounded-lg border border-indigo-200">
                  <label className="block text-xs font-semibold text-indigo-700 mb-2">En-Boy Oranı</label>
                  <div className="grid grid-cols-5 gap-2 mb-3">
                    {[
                      { value: '16:9', label: '16:9', desc: 'Video' },
                      { value: '4:3', label: '4:3', desc: 'Klasik' },
                      { value: '3:2', label: '3:2', desc: 'Fotoğraf' },
                      { value: '1:1', label: '1:1', desc: 'Kare' },
                      { value: '2:3', label: '2:3', desc: 'Portre' }
                    ].map((ratio) => (
                      <button
                        key={ratio.value}
                        type="button"
                        onClick={() => updateNestedContent('imageStyles', 'aspectRatio', ratio.value)}
                        className={`p-2 rounded-lg border-2 transition-all text-center ${
                          (content.imageStyles?.aspectRatio || 'auto') === ratio.value
                            ? 'border-indigo-500 bg-indigo-100'
                            : 'border-slate-200 bg-white hover:border-indigo-300'
                        }`}
                      >
                        <span className="text-xs font-bold text-slate-700 block">{ratio.label}</span>
                        <span className="text-[10px] text-slate-500">{ratio.desc}</span>
                      </button>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => updateNestedContent('imageStyles', 'aspectRatio', 'auto')}
                      className={`p-2 rounded-lg border-2 text-sm ${
                        (content.imageStyles?.aspectRatio || 'auto') === 'auto'
                          ? 'border-indigo-500 bg-indigo-100'
                          : 'border-slate-200 bg-white hover:border-indigo-300'
                      }`}
                    >
                      🔄 Otomatik
                    </button>
                    <button
                      type="button"
                      onClick={() => updateNestedContent('imageStyles', 'aspectRatio', 'custom')}
                      className={`p-2 rounded-lg border-2 text-sm ${
                        content.imageStyles?.aspectRatio === 'custom'
                          ? 'border-indigo-500 bg-indigo-100'
                          : 'border-slate-200 bg-white hover:border-indigo-300'
                      }`}
                    >
                      ✏️ Özel Oran
                    </button>
                  </div>
                  {content.imageStyles?.aspectRatio === 'custom' && (
                    <div className="mt-3">
                      <input
                        type="text"
                        value={content.imageStyles?.customAspectRatio || '16/9'}
                        onChange={(e) => updateNestedContent('imageStyles', 'customAspectRatio', e.target.value)}
                        placeholder="Örn: 16/9, 4/3, 1.5"
                        className="w-full px-3 py-2 text-sm border border-indigo-200 rounded-lg"
                      />
                      <p className="text-[10px] text-indigo-500 mt-1">Format: genişlik/yükseklik (örn: 16/9) veya ondalık (örn: 1.5)</p>
                    </div>
                  )}
                </div>
              )}

              {/* Fixed Dimensions - shown when fixed mode */}
              {(content.imageStyles?.sizeMode === 'fixed') && (
                <div className="mb-4 p-3 bg-white/70 rounded-lg border border-indigo-200">
                  <label className="block text-xs font-semibold text-indigo-700 mb-2">Sabit Boyutlar (piksel)</label>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-1">Genişlik</label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          value={parseInt(content.imageStyles?.width || '') || ''}
                          onChange={(e) => updateNestedContent('imageStyles', 'width', e.target.value ? `${e.target.value}px` : 'auto')}
                          placeholder="Auto"
                          className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg"
                        />
                        <span className="px-2 py-2 bg-slate-100 rounded-lg text-xs text-slate-600">px</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-1">Yükseklik</label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          value={parseInt(content.imageStyles?.height || '') || ''}
                          onChange={(e) => updateNestedContent('imageStyles', 'height', e.target.value ? `${e.target.value}px` : 'auto')}
                          placeholder="Auto"
                          className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg"
                        />
                        <span className="px-2 py-2 bg-slate-100 rounded-lg text-xs text-slate-600">px</span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-1">Maks. Genişlik</label>
                      <input
                        type="text"
                        value={content.imageStyles?.maxWidth || '100%'}
                        onChange={(e) => updateNestedContent('imageStyles', 'maxWidth', e.target.value)}
                        placeholder="100% veya 800px"
                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-1">Maks. Yükseklik</label>
                      <input
                        type="text"
                        value={content.imageStyles?.maxHeight || 'none'}
                        onChange={(e) => updateNestedContent('imageStyles', 'maxHeight', e.target.value)}
                        placeholder="none veya 600px"
                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Responsive Settings - shown when responsive mode */}
              {(content.imageStyles?.sizeMode === 'responsive') && (
                <div className="mb-4 p-3 bg-white/70 rounded-lg border border-indigo-200">
                  <label className="block text-xs font-semibold text-indigo-700 mb-2">Duyarlı Boyutlar</label>
                  <div className="space-y-3">
                    <div className="p-2 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm">📱</span>
                        <span className="text-xs font-medium text-slate-600">Mobil (&lt;768px)</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={content.imageStyles?.mobileWidth || '100%'}
                          onChange={(e) => updateNestedContent('imageStyles', 'mobileWidth', e.target.value)}
                          placeholder="Genişlik"
                          className="px-2 py-1 text-sm border border-slate-200 rounded"
                        />
                        <input
                          type="text"
                          value={content.imageStyles?.mobileHeight || 'auto'}
                          onChange={(e) => updateNestedContent('imageStyles', 'mobileHeight', e.target.value)}
                          placeholder="Yükseklik"
                          className="px-2 py-1 text-sm border border-slate-200 rounded"
                        />
                      </div>
                    </div>
                    <div className="p-2 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm">💻</span>
                        <span className="text-xs font-medium text-slate-600">Tablet (768-1024px)</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={content.imageStyles?.tabletWidth || '100%'}
                          onChange={(e) => updateNestedContent('imageStyles', 'tabletWidth', e.target.value)}
                          placeholder="Genişlik"
                          className="px-2 py-1 text-sm border border-slate-200 rounded"
                        />
                        <input
                          type="text"
                          value={content.imageStyles?.tabletHeight || 'auto'}
                          onChange={(e) => updateNestedContent('imageStyles', 'tabletHeight', e.target.value)}
                          placeholder="Yükseklik"
                          className="px-2 py-1 text-sm border border-slate-200 rounded"
                        />
                      </div>
                    </div>
                    <div className="p-2 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm">🖥️</span>
                        <span className="text-xs font-medium text-slate-600">Masaüstü (&gt;1024px)</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={content.imageStyles?.width || '100%'}
                          onChange={(e) => updateNestedContent('imageStyles', 'width', e.target.value)}
                          placeholder="Genişlik"
                          className="px-2 py-1 text-sm border border-slate-200 rounded"
                        />
                        <input
                          type="text"
                          value={content.imageStyles?.height || 'auto'}
                          onChange={(e) => updateNestedContent('imageStyles', 'height', e.target.value)}
                          placeholder="Yükseklik"
                          className="px-2 py-1 text-sm border border-slate-200 rounded"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Object Fit & Position - Always shown */}
              <div className="p-3 bg-white/70 rounded-lg border border-indigo-200 mb-3">
                <label className="block text-xs font-semibold text-indigo-700 mb-3">Görsel Sığdırma & Konum</label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-1">Sığdırma Modu</label>
                    <select
                      value={content.imageStyles?.objectFit || 'cover'}
                      onChange={(e) => updateNestedContent('imageStyles', 'objectFit', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white"
                    >
                      <option value="cover">📦 Kapla (Cover)</option>
                      <option value="contain">🔲 Sığdır (Contain)</option>
                      <option value="fill">⬛ Doldur (Fill)</option>
                      <option value="none">📌 Orijinal (None)</option>
                      <option value="scale-down">🔍 Küçült (Scale-down)</option>
                    </select>
                    <p className="text-[10px] text-slate-400 mt-1">
                      {(content.imageStyles?.objectFit === 'cover' || !content.imageStyles?.objectFit) && 'Alanı doldurur, taşan kısımları keser'}
                      {content.imageStyles?.objectFit === 'contain' && 'Tüm görseli gösterir, boşluk kalabilir'}
                      {content.imageStyles?.objectFit === 'fill' && 'Görseli esnetir, oran bozulabilir'}
                      {content.imageStyles?.objectFit === 'none' && 'Orijinal boyutunu korur'}
                      {content.imageStyles?.objectFit === 'scale-down' && 'contain veya none\'dan küçük olanı'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-1">Odak Noktası</label>
                    <div className="grid grid-cols-3 gap-1 bg-slate-100 p-2 rounded-lg">
                      {[
                        { pos: 'top left', icon: '↖️' },
                        { pos: 'top', icon: '⬆️' },
                        { pos: 'top right', icon: '↗️' },
                        { pos: 'left', icon: '⬅️' },
                        { pos: 'center', icon: '⭕' },
                        { pos: 'right', icon: '➡️' },
                        { pos: 'bottom left', icon: '↙️' },
                        { pos: 'bottom', icon: '⬇️' },
                        { pos: 'bottom right', icon: '↘️' }
                      ].map((p) => (
                        <button
                          key={p.pos}
                          type="button"
                          onClick={() => updateNestedContent('imageStyles', 'objectPosition', p.pos)}
                          className={`p-1.5 rounded text-sm transition-all ${
                            (content.imageStyles?.objectPosition || 'center') === p.pos
                              ? 'bg-indigo-500 text-white shadow-md'
                              : 'bg-white hover:bg-indigo-100'
                          }`}
                          title={p.pos}
                        >
                          {p.icon}
                        </button>
                      ))}
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1 text-center">
                      Seçili: {content.imageStyles?.objectPosition || 'center'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Container Width */}
              <div className="p-3 bg-white/70 rounded-lg border border-indigo-200">
                <label className="block text-xs font-semibold text-indigo-700 mb-2">Görsel Konteyner Genişliği</label>
                <select
                  value={content.imageStyles?.containerWidth || 'full'}
                  onChange={(e) => updateNestedContent('imageStyles', 'containerWidth', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white mb-2"
                >
                  <option value="full">Tam Genişlik (100%)</option>
                  <option value="max-w-lg">Küçük (512px)</option>
                  <option value="max-w-xl">Orta-Küçük (576px)</option>
                  <option value="max-w-2xl">Orta (672px)</option>
                  <option value="max-w-3xl">Orta-Büyük (768px)</option>
                  <option value="max-w-4xl">Büyük (896px)</option>
                  <option value="max-w-5xl">Çok Büyük (1024px)</option>
                  <option value="max-w-6xl">Ekstra Büyük (1152px)</option>
                  <option value="max-w-7xl">Maksimum (1280px)</option>
                  <option value="custom">Özel Değer</option>
                </select>
                {content.imageStyles?.containerWidth === 'custom' && (
                  <input
                    type="text"
                    value={content.imageStyles?.customContainerWidth || '800px'}
                    onChange={(e) => updateNestedContent('imageStyles', 'customContainerWidth', e.target.value)}
                    placeholder="Örn: 800px, 50vw, 80%"
                    className="w-full px-3 py-2 text-sm border border-indigo-200 rounded-lg"
                  />
                )}
              </div>
            </div>

            {/* Border Radius & Shadow */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Köşe Yuvarlaklığı</label>
                <select
                  value={content.imageStyles?.borderRadius || '16px'}
                  onChange={(e) => updateNestedContent('imageStyles', 'borderRadius', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
                >
                  <option value="0px">Keskin (0px)</option>
                  <option value="8px">Hafif (8px)</option>
                  <option value="16px">Orta (16px)</option>
                  <option value="24px">Yuvarlak (24px)</option>
                  <option value="32px">Çok Yuvarlak (32px)</option>
                  <option value="9999px">Tam Yuvarlak</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Gölge</label>
                <select
                  value={content.imageStyles?.boxShadow || 'none'}
                  onChange={(e) => updateNestedContent('imageStyles', 'boxShadow', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
                >
                  <option value="none">Yok</option>
                  <option value="0 4px 6px -1px rgba(0, 0, 0, 0.1)">Hafif</option>
                  <option value="0 10px 15px -3px rgba(0, 0, 0, 0.1)">Orta</option>
                  <option value="0 25px 50px -12px rgba(0, 0, 0, 0.25)">Büyük</option>
                  <option value="0 35px 60px -15px rgba(0, 0, 0, 0.3)">Ekstra Büyük</option>
                </select>
              </div>
            </div>

            {/* Sliders */}
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-xs font-medium text-slate-600">Opaklık</label>
                  <span className="text-xs text-slate-500">{content.imageStyles?.opacity || 100}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={content.imageStyles?.opacity || 100}
                  onChange={(e) => updateNestedContent('imageStyles', 'opacity', parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sage-500"
                />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-xs font-medium text-slate-600">Hover Zoom</label>
                  <span className="text-xs text-slate-500">{content.imageStyles?.hoverScale || 105}%</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="120"
                  value={content.imageStyles?.hoverScale || 105}
                  onChange={(e) => updateNestedContent('imageStyles', 'hoverScale', parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sage-500"
                />
              </div>
            </div>

            {/* Color Filters */}
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-xs font-medium text-slate-600">Parlaklık</label>
                  <span className="text-xs text-slate-500">{content.imageStyles?.brightness || 100}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="150"
                  value={content.imageStyles?.brightness || 100}
                  onChange={(e) => updateNestedContent('imageStyles', 'brightness', parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-xs font-medium text-slate-600">Kontrast</label>
                  <span className="text-xs text-slate-500">{content.imageStyles?.contrast || 100}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="150"
                  value={content.imageStyles?.contrast || 100}
                  onChange={(e) => updateNestedContent('imageStyles', 'contrast', parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-xs font-medium text-slate-600">Doygunluk</label>
                  <span className="text-xs text-slate-500">{content.imageStyles?.saturation || 100}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={content.imageStyles?.saturation || 100}
                  onChange={(e) => updateNestedContent('imageStyles', 'saturation', parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-pink-500"
                />
              </div>
            </div>

            {/* Blur */}
            <div className="mt-4">
              <div className="flex justify-between mb-1">
                <label className="text-xs font-medium text-slate-600">Bulanıklık</label>
                <span className="text-xs text-slate-500">{content.imageStyles?.blur || 0}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="20"
                value={content.imageStyles?.blur || 0}
                onChange={(e) => updateNestedContent('imageStyles', 'blur', parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-gray-500"
              />
            </div>

            {/* Overlay */}
            <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-purple-200">
              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-xs font-medium text-slate-600">Overlay Opaklık</label>
                  <span className="text-xs text-slate-500">{content.imageStyles?.overlayOpacity || 0}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="80"
                  value={content.imageStyles?.overlayOpacity || 0}
                  onChange={(e) => updateNestedContent('imageStyles', 'overlayOpacity', parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-gray-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Overlay Rengi</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={content.imageStyles?.overlayColor || '#000000'}
                    onChange={(e) => updateNestedContent('imageStyles', 'overlayColor', e.target.value)}
                    className="w-10 h-10 rounded-lg border border-slate-200 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={content.imageStyles?.overlayColor || '#000000'}
                    onChange={(e) => updateNestedContent('imageStyles', 'overlayColor', e.target.value)}
                    className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg font-mono"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Video Settings */}
      {content.mediaType === 'video' && (
        <div className="p-4 bg-white rounded-xl border border-slate-200">
          <label className="block text-sm font-semibold text-slate-700 mb-3">Video Ayarları</label>

          <div className="space-y-4">
            <div>
              <label className="block text-xs text-slate-500 mb-1">Video URL</label>
              <input
                type="text"
                value={content.video?.url || ''}
                onChange={(e) => updateContent({ video: { ...content.video, url: e.target.value, provider: 'youtube', autoplay: true, muted: true, loop: true, controls: false } as any })}
                placeholder="YouTube, Vimeo veya direkt video URL'i"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sage-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-500 mb-1">Platform</label>
                <select
                  value={content.video?.provider || 'youtube'}
                  onChange={(e) => updateContent({ video: { ...content.video, provider: e.target.value as any } as any })}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
                >
                  <option value="youtube">YouTube</option>
                  <option value="vimeo">Vimeo</option>
                  <option value="custom">Direkt URL</option>
                  <option value="upload">Yüklenen</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Poster Görsel</label>
                <input
                  type="text"
                  value={content.video?.poster || ''}
                  onChange={(e) => updateContent({ video: { ...content.video, poster: e.target.value } as any })}
                  placeholder="Video yüklenene kadar gösterilecek görsel"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              {[
                { key: 'autoplay', label: 'Otomatik Başlat' },
                { key: 'muted', label: 'Sessiz' },
                { key: 'loop', label: 'Döngü' },
                { key: 'controls', label: 'Kontroller' },
              ].map(opt => (
                <label key={opt.key} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={(content.video as any)?.[opt.key] || false}
                    onChange={(e) => updateContent({ video: { ...content.video, [opt.key]: e.target.checked } as any })}
                    className="rounded border-slate-300 text-sage-500 focus:ring-sage-500"
                  />
                  <span className="text-sm text-slate-600">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
