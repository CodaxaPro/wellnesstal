'use client'

import { useState, useRef } from 'react'

import { TextContent, TextListItem, TextImage } from '../../types'

import { CONTENT_TYPE_OPTIONS } from './defaults'

interface ContentTabProps {
  content: TextContent
  updateContent: (updates: Partial<TextContent>) => void
}

export default function ContentTab({ content, updateContent }: ContentTabProps) {
  const [newListItem, setNewListItem] = useState('')
  const [newImageUrl, setNewImageUrl] = useState('')
  const [newImageAlt, setNewImageAlt] = useState('')
  const [uploadingImage, setUploadingImage] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Handle image upload
  const handleImageUpload = async (file: File, index?: number) => {
    if (!file) {
return
}
    
    setUploadingImage(index ?? -1)
    try {
      const token = localStorage.getItem('adminToken')
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', 'text-block')
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      })
      
      const data = await response.json()
      if (data.success && data.data?.url) {
        if (index !== undefined) {
          // Update existing image
          const images = [...(content.images || [])]
          images[index] = { ...images[index], url: data.data.url }
          updateContent({ images })
        } else {
          // Add new image
          const newImage: TextImage = {
            id: `img-${Date.now()}`,
            url: data.data.url,
            alt: newImageAlt || file.name.split('.')[0],
            position: 'top',
            width: 'full'
          }
          updateContent({ 
            images: [...(content.images || []), newImage],
            imagePosition: content.imagePosition || 'top' // Auto-set position if not set
          })
          setNewImageUrl('')
          setNewImageAlt('')
        }
      }
    } catch (error) {
      console.error('Failed to upload image:', error)
      alert('Görsel yüklenirken hata oluştu')
    } finally {
      setUploadingImage(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  // Add image via URL
  const addImageByUrl = () => {
    if (!newImageUrl.trim()) {
return
}
    
    const newImage: TextImage = {
      id: `img-${Date.now()}`,
      url: newImageUrl.trim(),
      alt: newImageAlt || 'Image',
      position: 'top',
      width: 'full'
    }
    updateContent({ 
      images: [...(content.images || []), newImage],
      imagePosition: content.imagePosition || 'top'
    })
    setNewImageUrl('')
    setNewImageAlt('')
  }

  // Update image
  const updateImage = (index: number, field: keyof TextImage, value: any) => {
    const images = [...(content.images || [])]
    images[index] = { ...images[index], [field]: value }
    updateContent({ images })
  }

  // Delete image
  const deleteImage = (index: number) => {
    const images = (content.images || []).filter((_, i) => i !== index)
    updateContent({ images })
  }

  const addListItem = () => {
    if (!newListItem.trim()) {
return
}
    const newItem: TextListItem = {
      id: `list-${Date.now()}`,
      content: newListItem.trim(),
      checked: false
    }
    updateContent({
      listItems: [...(content.listItems || []), newItem]
    })
    setNewListItem('')
  }

  const updateListItem = (index: number, updates: Partial<TextListItem>) => {
    const items = [...(content.listItems || [])]
    items[index] = { ...items[index], ...updates }
    updateContent({ listItems: items })
  }

  const deleteListItem = (index: number) => {
    const items = (content.listItems || []).filter((_, i) => i !== index)
    updateContent({ listItems: items })
  }

  const moveListItem = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= (content.listItems || []).length) {
return
}
    const items = [...(content.listItems || [])]
    const [moved] = items.splice(fromIndex, 1)
    items.splice(toIndex, 0, moved)
    updateContent({ listItems: items })
  }

  return (
    <div className="space-y-6">
      {/* Content Type Selection */}
      <div className="p-4 bg-white rounded-xl border border-slate-200">
        <label className="block text-sm font-semibold text-slate-700 mb-4">İçerik Tipi</label>
        <div className="grid grid-cols-5 gap-3">
          {CONTENT_TYPE_OPTIONS.map(type => (
            <button
              key={type.id}
              onClick={() => updateContent({ contentType: type.id as any })}
              className={`p-3 rounded-xl border-2 transition-all text-center ${
                content.contentType === type.id
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

      {/* Title & Subtitle */}
      {content.showTitle && (
        <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Başlık</label>
            <input
              type="text"
              value={content.title || ''}
              onChange={(e) => {
                const newTitle = e.target.value
                updateContent({ 
                  title: newTitle,
                  // Otomatik olarak son kelimeyi highlighted text olarak ayarla
                  highlightedText: content.useAutoHighlight !== false && newTitle ? newTitle.split(' ').slice(-1)[0] : content.highlightedText
                })
              }}
              placeholder="Başlık yazın... (Son kelime otomatik vurgulanır)"
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sage-500 text-lg font-semibold"
            />
            
            {/* Vurgulu Metin Ayarları - Kullanıcı Dostu */}
            {content.title && (
              <div className="mt-3 p-3 bg-sage-50 rounded-lg border border-sage-200">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-medium text-slate-700">Vurgulu Metin</label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={content.useAutoHighlight !== false}
                      onChange={(e) => {
                        const useAuto = e.target.checked
                        updateContent({
                          useAutoHighlight: useAuto,
                          highlightedText: useAuto ? content.title.split(' ').slice(-1)[0] : content.highlightedText
                        })
                      }}
                      className="rounded border-slate-300 text-sage-500 focus:ring-sage-500"
                    />
                    <span className="text-xs text-slate-600">Otomatik (Son kelime)</span>
                  </label>
                </div>

                {content.useAutoHighlight !== false ? (
                  // Otomatik mod - Kelime seçimi
                  <div>
                    <p className="text-xs text-slate-500 mb-2">Vurgulanacak kelimeyi seçin:</p>
                    <div className="flex flex-wrap gap-2">
                      {content.title.split(' ').map((word, index) => {
                        const isLastWord = index === content.title.split(' ').length - 1
                        const isSelected = isLastWord || content.highlightedText === word
                        return (
                          <button
                            key={index}
                            type="button"
                            onClick={() => {
                              updateContent({ 
                                highlightedText: word,
                                useAutoHighlight: false // Manuel seçim yapıldığında otomatik modu kapat
                              })
                            }}
                            className={`px-2 py-1 rounded-md text-xs font-medium transition-all ${
                              isSelected
                                ? 'bg-sage-500 text-white shadow-sm'
                                : 'bg-white text-slate-700 border border-slate-300 hover:border-sage-400'
                            }`}
                          >
                            {word}
                          </button>
                        )
                      })}
                    </div>
                    <p className="text-xs text-sage-600 mt-2">
                      ✓ Seçili: <strong>"{content.highlightedText || content.title.split(' ').slice(-1)[0]}"</strong>
                    </p>
                  </div>
                ) : (
                  // Manuel mod
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Manuel Vurgulu Metin</label>
                    <input
                      type="text"
                      value={content.highlightedText || ''}
                      onChange={(e) => updateContent({ highlightedText: e.target.value })}
                      placeholder="Vurgulanacak kelime veya metin"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {content.showSubtitle && (
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Alt Başlık</label>
              <input
                type="text"
                value={content.subtitle || ''}
                onChange={(e) => updateContent({ subtitle: e.target.value })}
                placeholder="Alt başlık yazın..."
                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sage-500"
              />
            </div>
          )}
        </div>
      )}

      {/* Main Content - Paragraph */}
      {content.contentType === 'paragraph' && (
        <div className="p-4 bg-white rounded-xl border border-slate-200">
          <label className="block text-sm font-semibold text-slate-700 mb-2">İçerik</label>
          <textarea
            value={content.content || ''}
            onChange={(e) => updateContent({ content: e.target.value })}
            rows={10}
            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sage-500 resize-none leading-relaxed"
            placeholder="Metninizi buraya yazın...

Birden fazla paragraf için boş satır bırakabilirsiniz."
          />
          <p className="text-xs text-slate-500 mt-2">
            Paragrafları ayırmak için boş satır kullanın.
          </p>
        </div>
      )}

      {/* Quote Content */}
      {content.contentType === 'quote' && (
        <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Alıntı Metni</label>
            <textarea
              value={content.content || ''}
              onChange={(e) => updateContent({ content: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sage-500 resize-none text-lg italic"
              placeholder="Alıntı metnini yazın..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-500 mb-1">Alıntı Sahibi</label>
              <input
                type="text"
                value={content.quoteAuthor || ''}
                onChange={(e) => updateContent({ quoteAuthor: e.target.value })}
                placeholder="İsim Soyisim"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Ünvan / Rol</label>
              <input
                type="text"
                value={content.quoteRole || ''}
                onChange={(e) => updateContent({ quoteRole: e.target.value })}
                placeholder="CEO, Yazar, vb."
                className="w-full px-3 py-2 border border-slate-200 rounded-lg"
              />
            </div>
          </div>

          {/* Quote Style */}
          <div>
            <label className="block text-xs text-slate-500 mb-2">Alıntı Stili</label>
            <div className="grid grid-cols-5 gap-2">
              {[
                { id: 'simple', label: 'Basit' },
                { id: 'bordered', label: 'Kenarlıklı' },
                { id: 'background', label: 'Arkaplan' },
                { id: 'large', label: 'Büyük' },
                { id: 'icon', label: 'İkonlu' },
              ].map(style => (
                <button
                  key={style.id}
                  onClick={() => updateContent({
                    quoteStyles: { ...content.quoteStyles!, style: style.id as any }
                  })}
                  className={`p-2 rounded-lg border text-xs transition-all ${
                    content.quoteStyles?.style === style.id
                      ? 'border-sage-500 bg-sage-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {style.label}
                </button>
              ))}
            </div>
          </div>

          {/* Quote Colors */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-500 mb-1">Kenarlık Rengi</label>
              <input
                type="color"
                value={content.quoteStyles?.borderColor || '#10b981'}
                onChange={(e) => updateContent({
                  quoteStyles: { ...content.quoteStyles!, borderColor: e.target.value }
                })}
                className="w-full h-10 rounded-lg border border-slate-200 cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Arkaplan Rengi</label>
              <input
                type="color"
                value={content.quoteStyles?.backgroundColor || '#f0fdf4'}
                onChange={(e) => updateContent({
                  quoteStyles: { ...content.quoteStyles!, backgroundColor: e.target.value }
                })}
                className="w-full h-10 rounded-lg border border-slate-200 cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* Callout Content */}
      {content.contentType === 'callout' && (
        <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Bilgi Kutusu İçeriği</label>
            <textarea
              value={content.content || ''}
              onChange={(e) => updateContent({ content: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sage-500 resize-none"
              placeholder="Dikkat çekmek istediğiniz bilgiyi yazın..."
            />
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-2">Callout Tipi</label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'info', label: 'Bilgi', icon: 'ℹ️', color: '#3b82f6' },
                { id: 'success', label: 'Başarı', icon: '✅', color: '#10b981' },
                { id: 'warning', label: 'Uyarı', icon: '⚠️', color: '#f59e0b' },
                { id: 'error', label: 'Hata', icon: '❌', color: '#ef4444' },
              ].map(type => (
                <button
                  key={type.id}
                  onClick={() => updateContent({
                    quoteStyles: { ...content.quoteStyles!, borderColor: type.color, iconColor: type.color }
                  })}
                  className="p-3 rounded-lg border border-slate-200 hover:border-slate-300 transition-all"
                >
                  <div className="text-2xl text-center mb-1">{type.icon}</div>
                  <div className="text-xs text-center">{type.label}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* List Content */}
      {content.contentType === 'list' && (
        <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-4">
          {/* List Type */}
          <div>
            <label className="block text-xs text-slate-500 mb-2">Liste Tipi</label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'bullet', label: 'Madde', icon: '•' },
                { id: 'numbered', label: 'Numaralı', icon: '1.' },
                { id: 'check', label: 'Onay', icon: '✓' },
                { id: 'icon', label: 'İkonlu', icon: '★' },
              ].map(type => (
                <button
                  key={type.id}
                  onClick={() => updateContent({ listType: type.id as any })}
                  className={`p-2 rounded-lg border text-center transition-all ${
                    content.listType === type.id
                      ? 'border-sage-500 bg-sage-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="text-lg">{type.icon}</div>
                  <div className="text-xs mt-1">{type.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Add List Item */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newListItem}
              onChange={(e) => setNewListItem(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addListItem()}
              placeholder="Yeni madde ekle..."
              className="flex-1 px-3 py-2 border border-slate-200 rounded-lg"
            />
            <button
              onClick={addListItem}
              className="px-4 py-2 bg-sage-500 text-white rounded-lg hover:bg-sage-600 transition-colors"
            >
              Ekle
            </button>
          </div>

          {/* List Items */}
          <div className="space-y-2">
            {(content.listItems || []).map((item, index) => (
              <div key={item.id} className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
                {content.listType === 'check' && (
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={(e) => updateListItem(index, { checked: e.target.checked })}
                    className="rounded border-slate-300 text-sage-500"
                  />
                )}
                <span className="text-slate-400 text-sm">
                  {content.listType === 'numbered' ? `${index + 1}.` :
                   content.listType === 'bullet' ? '•' :
                   content.listType === 'icon' ? '★' : ''}
                </span>
                <input
                  type="text"
                  value={item.content}
                  onChange={(e) => updateListItem(index, { content: e.target.value })}
                  className="flex-1 bg-transparent border-none focus:ring-0"
                />
                <div className="flex gap-1">
                  <button
                    onClick={() => moveListItem(index, index - 1)}
                    disabled={index === 0}
                    className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-30"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => moveListItem(index, index + 1)}
                    disabled={index === (content.listItems || []).length - 1}
                    className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-30"
                  >
                    ↓
                  </button>
                  <button
                    onClick={() => deleteListItem(index)}
                    className="p-1 text-red-400 hover:text-red-600"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Icon Color for icon list */}
          {content.listType === 'icon' && (
            <div>
              <label className="block text-xs text-slate-500 mb-1">İkon Rengi</label>
              <input
                type="color"
                value={content.listIconColor || '#10b981'}
                onChange={(e) => updateContent({ listIconColor: e.target.value })}
                className="w-full h-10 rounded-lg border border-slate-200 cursor-pointer"
              />
            </div>
          )}
        </div>
      )}

      {/* Code Content */}
      {content.contentType === 'code' && (
        <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Kod</label>
            <textarea
              value={content.content || ''}
              onChange={(e) => updateContent({ content: e.target.value })}
              rows={10}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sage-500 resize-none font-mono text-sm bg-slate-900 text-green-400"
              placeholder="// Kodunuzu buraya yazın..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-500 mb-1">Dil</label>
              <select
                value={content.codeLanguage || 'javascript'}
                onChange={(e) => updateContent({ codeLanguage: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              >
                <option value="javascript">JavaScript</option>
                <option value="typescript">TypeScript</option>
                <option value="html">HTML</option>
                <option value="css">CSS</option>
                <option value="python">Python</option>
                <option value="json">JSON</option>
                <option value="bash">Bash</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Tema</label>
              <select
                value={content.codeTheme || 'dark'}
                onChange={(e) => updateContent({ codeTheme: e.target.value as 'light' | 'dark' })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              >
                <option value="dark">Koyu</option>
                <option value="light">Açık</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Images Management - Görsel Yönetimi */}
      <div className="p-4 bg-white rounded-xl border border-slate-200">
        <label className="block text-sm font-semibold text-slate-700 mb-4">🖼️ Görseller</label>
        
        {/* Upload Area */}
        <div className="mb-4 p-4 border-2 border-dashed border-slate-300 rounded-xl hover:border-sage-500 transition-colors">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) {
handleImageUpload(file)
}
            }}
            className="hidden"
            id="text-block-image-upload"
          />
          <label htmlFor="text-block-image-upload" className="cursor-pointer">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                {uploadingImage === -1 ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-sage-500" />
                ) : (
                  <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700">
                  {uploadingImage === -1 ? 'Yükleniyor...' : 'Dosya Yükle'}
                </p>
                <p className="text-xs text-slate-500">veya URL ile ekle</p>
              </div>
            </div>
          </label>
          
          {/* URL Input */}
          <div className="grid grid-cols-[1fr_auto] gap-2">
            <div>
              <input
                type="text"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addImageByUrl()}
                placeholder="Görsel URL'si (https://...)"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              />
            </div>
            <button
              onClick={addImageByUrl}
              disabled={!newImageUrl.trim()}
              className="px-4 py-2 bg-sage-500 text-white rounded-lg hover:bg-sage-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Ekle
            </button>
          </div>
          <input
            type="text"
            value={newImageAlt}
            onChange={(e) => setNewImageAlt(e.target.value)}
            placeholder="Alt text (opsiyonel)"
            className="w-full mt-2 px-3 py-2 border border-slate-200 rounded-lg text-sm"
          />
        </div>

        {/* Images List */}
        {(content.images || []).length > 0 && (
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {(content.images || []).map((image, index) => (
              <div key={image.id || index} className="p-3 border border-slate-200 rounded-lg bg-slate-50">
                <div className="flex gap-3">
                  {/* Preview */}
                  {image.url && (
                    <div className="w-24 h-24 rounded-lg overflow-hidden border border-slate-200 flex-shrink-0">
                      <img
                        src={image.url}
                        alt={image.alt || 'Preview'}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none'
                        }}
                      />
                    </div>
                  )}
                  
                  {/* Image Details */}
                  <div className="flex-1 space-y-2">
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">URL</label>
                      <input
                        type="text"
                        value={image.url || ''}
                        onChange={(e) => updateImage(index, 'url', e.target.value)}
                        className="w-full px-2 py-1.5 border border-slate-200 rounded text-sm"
                        placeholder="https://..."
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">Alt Text</label>
                      <input
                        type="text"
                        value={image.alt || ''}
                        onChange={(e) => updateImage(index, 'alt', e.target.value)}
                        className="w-full px-2 py-1.5 border border-slate-200 rounded text-sm"
                        placeholder="Görsel açıklaması"
                      />
                    </div>
                    {image.url && (
                      <div>
                        <label className="block text-xs text-slate-500 mb-1">Görseli Değiştir</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
handleImageUpload(file, index)
}
                          }}
                          className="w-full text-xs"
                        />
                      </div>
                    )}
                  </div>
                  
                  {/* Actions */}
                  <div className="flex flex-col gap-1">
                    <button
                      type="button"
                      onClick={() => deleteImage(index)}
                      className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                      title="Sil"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {(content.images || []).length === 0 && (
          <p className="text-xs text-slate-500 text-center py-4">
            Henüz görsel eklenmedi. Yukarıdan görsel ekleyebilirsiniz.
          </p>
        )}

        {(content.images || []).length > 0 && (
          <p className="text-xs text-slate-500 mt-3">
            💡 Görsel konumunu ayarlamak için <strong>Layout</strong> sekmesine gidin.
          </p>
        )}
      </div>

      {/* CTA Button */}
      <div className="p-4 bg-white rounded-xl border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <label className="text-sm font-semibold text-slate-700">CTA Butonu</label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={content.ctaButton?.enabled ?? false}
              onChange={(e) => updateContent({
                ctaButton: { ...content.ctaButton!, enabled: e.target.checked }
              })}
              className="rounded border-slate-300 text-sage-500 focus:ring-sage-500"
            />
            <span className="text-xs text-slate-500">Aktif</span>
          </label>
        </div>

        {content.ctaButton?.enabled && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-500 mb-1">Buton Metni</label>
                <input
                  type="text"
                  value={content.ctaButton.text || ''}
                  onChange={(e) => updateContent({
                    ctaButton: { ...content.ctaButton!, text: e.target.value }
                  })}
                  placeholder="Daha Fazla"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Link</label>
                <input
                  type="text"
                  value={content.ctaButton.link || ''}
                  onChange={(e) => updateContent({
                    ctaButton: { ...content.ctaButton!, link: e.target.value }
                  })}
                  placeholder="/sayfa veya https://..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-slate-500 mb-1">Stil</label>
                <select
                  value={content.ctaButton.style || 'primary'}
                  onChange={(e) => updateContent({
                    ctaButton: { ...content.ctaButton!, style: e.target.value as any }
                  })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                >
                  <option value="primary">Primary</option>
                  <option value="secondary">Secondary</option>
                  <option value="outline">Outline</option>
                  <option value="ghost">Ghost</option>
                  <option value="link">Link</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Boyut</label>
                <select
                  value={content.ctaButton.size || 'md'}
                  onChange={(e) => updateContent({
                    ctaButton: { ...content.ctaButton!, size: e.target.value as any }
                  })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                >
                  <option value="sm">Küçük</option>
                  <option value="md">Orta</option>
                  <option value="lg">Büyük</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Hizalama</label>
                <select
                  value={content.ctaButton.alignment || 'left'}
                  onChange={(e) => updateContent({
                    ctaButton: { ...content.ctaButton!, alignment: e.target.value as any }
                  })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                >
                  <option value="left">Sol</option>
                  <option value="center">Orta</option>
                  <option value="right">Sağ</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
