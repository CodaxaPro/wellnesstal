'use client'

import { TestimonialsContent, Testimonial, StatItem } from '../../types'

import { getDefaultTestimonial } from './defaults'

interface ContentTabProps {
  content: TestimonialsContent
  updateContent: (updates: Partial<TestimonialsContent>) => void
}

export default function ContentTab({ content, updateContent }: ContentTabProps) {
  const updateTestimonial = (index: number, updates: Partial<Testimonial>) => {
    const newTestimonials = [...(content.testimonials || [])]
    newTestimonials[index] = { ...newTestimonials[index], ...updates }
    updateContent({ testimonials: newTestimonials })
  }

  const addTestimonial = () => {
    const newTestimonial = getDefaultTestimonial()
    updateContent({ testimonials: [...(content.testimonials || []), newTestimonial] })
  }

  const removeTestimonial = (index: number) => {
    const newTestimonials = (content.testimonials || []).filter((_, i) => i !== index)
    updateContent({ testimonials: newTestimonials })
  }

  const moveTestimonial = (index: number, direction: 'up' | 'down') => {
    const newTestimonials = [...(content.testimonials || [])]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= newTestimonials.length) {
return
}

    [newTestimonials[index], newTestimonials[targetIndex]] = [newTestimonials[targetIndex], newTestimonials[index]]
    updateContent({ testimonials: newTestimonials })
  }

  const updateStat = (index: number, updates: Partial<StatItem>) => {
    const newStats = [...(content.stats || [])]
    newStats[index] = { ...newStats[index], ...updates }
    updateContent({ stats: newStats })
  }

  const addStat = () => {
    const newStat: StatItem = { value: '100+', label: 'Stat Label' }
    updateContent({ stats: [...(content.stats || []), newStat] })
  }

  const removeStat = (index: number) => {
    const newStats = (content.stats || []).filter((_, i) => i !== index)
    updateContent({ stats: newStats })
  }

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-4">
        <h3 className="text-sm font-semibold text-slate-700">Bölüm Başlığı</h3>

        <div>
          <label className="block text-xs text-slate-500 mb-1">Badge</label>
          <input
            type="text"
            value={content.badge || ''}
            onChange={(e) => updateContent({ badge: e.target.value })}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
            placeholder="💬 Kundenstimmen"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-slate-500 mb-1">Başlık</label>
            <input
              type="text"
              value={content.sectionTitle || content.title || ''}
              onChange={(e) => updateContent({ sectionTitle: e.target.value, title: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              placeholder="Was unsere Kunden"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">Vurgulu Metin</label>
            <input
              type="text"
              value={content.highlightedText || ''}
              onChange={(e) => updateContent({ highlightedText: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              placeholder="sagen"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs text-slate-500 mb-1">Açıklama</label>
          <textarea
            value={content.description || content.subtitle || ''}
            onChange={(e) => updateContent({ description: e.target.value, subtitle: e.target.value })}
            rows={2}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
            placeholder="Echte Bewertungen von zufriedenen Kunden..."
          />
        </div>
      </div>

      {/* Testimonials */}
      <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-semibold text-slate-700">
            Testimonials ({(content.testimonials || []).length})
          </h3>
          <button
            type="button"
            onClick={addTestimonial}
            className="px-3 py-1.5 bg-sage-500 text-white text-sm rounded-lg hover:bg-sage-600 transition-colors"
          >
            + Ekle
          </button>
        </div>

        <div className="space-y-3 max-h-[500px] overflow-y-auto">
          {(content.testimonials || []).map((testimonial, index) => (
            <div key={testimonial.id} className="p-3 border border-slate-200 rounded-lg space-y-2 bg-slate-50">
              <div className="flex justify-between items-start gap-2">
                <div className="flex-1 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={testimonial.name}
                      onChange={(e) => updateTestimonial(index, { name: e.target.value })}
                      className="px-2 py-1.5 border border-slate-200 rounded text-sm"
                      placeholder="İsim"
                    />
                    <input
                      type="text"
                      value={testimonial.role || ''}
                      onChange={(e) => updateTestimonial(index, { role: e.target.value })}
                      className="px-2 py-1.5 border border-slate-200 rounded text-sm"
                      placeholder="Rolle"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={testimonial.company || ''}
                      onChange={(e) => updateTestimonial(index, { company: e.target.value })}
                      className="px-2 py-1.5 border border-slate-200 rounded text-sm"
                      placeholder="Firma"
                    />
                    <input
                      type="text"
                      value={testimonial.avatar || ''}
                      onChange={(e) => updateTestimonial(index, { avatar: e.target.value })}
                      className="px-2 py-1.5 border border-slate-200 rounded text-sm"
                      placeholder="Avatar URL"
                    />
                  </div>
                  <textarea
                    value={testimonial.content}
                    onChange={(e) => updateTestimonial(index, { content: e.target.value })}
                    rows={2}
                    className="w-full px-2 py-1.5 border border-slate-200 rounded text-sm"
                    placeholder="Testimonial Text"
                  />
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 text-xs text-slate-600">
                      <span>Puan:</span>
                      <input
                        type="number"
                        min="0"
                        max="5"
                        value={testimonial.rating || 0}
                        onChange={(e) => updateTestimonial(index, { rating: parseInt(e.target.value) || 0 })}
                        className="w-12 px-1 py-1 border border-slate-200 rounded text-sm"
                      />
                    </label>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <label className="flex items-center gap-2 text-xs text-slate-600">
                        <input
                          type="checkbox"
                          checked={testimonial.readMoreLink?.enabled || false}
                          onChange={(e) => updateTestimonial(index, {
                            readMoreLink: {
                              ...testimonial.readMoreLink,
                              enabled: e.target.checked,
                              text: testimonial.readMoreLink?.text || 'Weiter lesen',
                              url: testimonial.readMoreLink?.url || ''
                            }
                          })}
                          className="w-4 h-4 border border-slate-200 rounded"
                        />
                        <span>"Weiter lesen" linki göster</span>
                      </label>
                    </div>
                    {testimonial.readMoreLink?.enabled && (
                      <div className="space-y-1">
                        <input
                          type="text"
                          value={testimonial.readMoreLink?.text || 'Weiter lesen'}
                          onChange={(e) => updateTestimonial(index, {
                            readMoreLink: {
                              ...testimonial.readMoreLink,
                              text: e.target.value
                            }
                          })}
                          className="w-full px-2 py-1.5 border border-slate-200 rounded text-sm"
                          placeholder="Weiter lesen"
                        />
                        <input
                          type="url"
                          value={testimonial.readMoreLink?.url || ''}
                          onChange={(e) => {
                            let url = e.target.value.trim()
                            // Eğer https:// veya http:// ile başlamıyorsa ekle
                            if (url && !url.match(/^https?:\/\//i)) {
                              // Google Maps için www. ekle
                              if (url.startsWith('google.com/') || url.startsWith('www.google.com/')) {
                                url = `https://www.${url.replace(/^(www\.)?/, '')}`
                              } else {
                                url = `https://${url}`
                              }
                            }
                            updateTestimonial(index, {
                              readMoreLink: {
                                ...testimonial.readMoreLink,
                                url: url
                              }
                            })
                          }}
                          className="w-full px-2 py-1.5 border border-slate-200 rounded text-sm"
                          placeholder="https://www.google.com/maps/reviews/..."
                        />
                        <p className="text-xs text-slate-500">
                          Google Maps yorum linkini buraya yapıştırın. "https://" ile başlamalı.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <button
                    type="button"
                    onClick={() => moveTestimonial(index, 'up')}
                    disabled={index === 0}
                    className="p-1 text-slate-600 hover:text-slate-900 disabled:opacity-30 text-xs"
                    title="Yukarı"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => moveTestimonial(index, 'down')}
                    disabled={index === (content.testimonials || []).length - 1}
                    className="p-1 text-slate-600 hover:text-slate-900 disabled:opacity-30 text-xs"
                    title="Aşağı"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => removeTestimonial(index)}
                    className="p-1 text-red-600 hover:text-red-800 text-xs"
                    title="Sil"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-xs text-slate-600">
              <input
                type="checkbox"
                checked={content.showStats === true}
                onChange={(e) => updateContent({ showStats: e.target.checked })}
                className="w-4 h-4 border border-slate-200 rounded"
              />
              <span>İstatistikler bölümünü göster</span>
            </label>
          </div>
          {content.showStats === true && (
            <button
              type="button"
              onClick={addStat}
              className="px-3 py-1.5 bg-sage-500 text-white text-sm rounded-lg hover:bg-sage-600 transition-colors"
            >
              + Ekle
            </button>
          )}
        </div>

        {content.showStats === true && (
          <div className="space-y-2">
            {(content.stats || []).map((stat, index) => (
              <div key={index} className="flex gap-2 items-center p-2 border border-slate-200 rounded-lg">
                <input
                  type="text"
                  value={stat.value}
                  onChange={(e) => updateStat(index, { value: e.target.value })}
                  className="flex-1 px-2 py-1.5 border border-slate-200 rounded text-sm"
                  placeholder="500+"
                />
                <input
                  type="text"
                  value={stat.label}
                  onChange={(e) => updateStat(index, { label: e.target.value })}
                  className="flex-1 px-2 py-1.5 border border-slate-200 rounded text-sm"
                  placeholder="Zufriedene Kunden"
                />
                <button
                  type="button"
                  onClick={() => removeStat(index)}
                  className="p-1.5 text-red-600 hover:text-red-800"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

