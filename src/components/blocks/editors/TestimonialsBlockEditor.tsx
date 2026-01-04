'use client'

import { useState, useEffect, useRef } from 'react'
import { TestimonialsContent, Testimonial } from '../types'

interface TestimonialsBlockEditorProps {
  content: TestimonialsContent
  onUpdate: (content: Partial<TestimonialsContent>) => void
}

export default function TestimonialsBlockEditor({ content, onUpdate }: TestimonialsBlockEditorProps) {
  const [localContent, setLocalContent] = useState<TestimonialsContent>(content)

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

  const updateTestimonial = (index: number, updates: Partial<Testimonial>) => {
    const newTestimonials = [...localContent.testimonials]
    newTestimonials[index] = { ...newTestimonials[index], ...updates }
    setLocalContent({ ...localContent, testimonials: newTestimonials })
  }

  const addTestimonial = () => {
    const newTestimonial: Testimonial = {
      id: `testimonial-${Date.now()}`,
      name: 'Müşteri Adı',
      role: 'Pozisyon',
      company: 'Şirket',
      content: 'Harika bir deneyimdi!',
      rating: 5
    }
    setLocalContent({
      ...localContent,
      testimonials: [...localContent.testimonials, newTestimonial]
    })
  }

  const removeTestimonial = (index: number) => {
    const newTestimonials = localContent.testimonials.filter((_, i) => i !== index)
    setLocalContent({ ...localContent, testimonials: newTestimonials })
  }

  const moveTestimonial = (index: number, direction: 'up' | 'down') => {
    const newTestimonials = [...localContent.testimonials]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= newTestimonials.length) return

    [newTestimonials[index], newTestimonials[targetIndex]] = [newTestimonials[targetIndex], newTestimonials[index]]
    setLocalContent({ ...localContent, testimonials: newTestimonials })
  }

  return (
    <div className="space-y-6">
      {/* Block Title */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Block Başlığı
        </label>
        <input
          type="text"
          value={localContent.title || ''}
          onChange={(e) => setLocalContent({ ...localContent, title: e.target.value })}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
          placeholder="Was unsere Kunden sagen"
        />
      </div>

      {/* Layout Selection */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Layout
        </label>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setLocalContent({ ...localContent, layout: 'grid' })}
            className={`flex-1 py-2 px-4 rounded-lg border-2 transition-colors ${
              localContent.layout === 'grid'
                ? 'border-sage-500 bg-sage-50 text-sage-700'
                : 'border-slate-300 hover:border-sage-300'
            }`}
          >
            📊 Grid Layout
          </button>
          <button
            type="button"
            onClick={() => setLocalContent({ ...localContent, layout: 'carousel' })}
            className={`flex-1 py-2 px-4 rounded-lg border-2 transition-colors ${
              localContent.layout === 'carousel'
                ? 'border-sage-500 bg-sage-50 text-sage-700'
                : 'border-slate-300 hover:border-sage-300'
            }`}
          >
            🎠 Carousel
          </button>
        </div>
      </div>

      {/* Testimonials List */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-slate-800">
            Yorumlar ({localContent.testimonials.length})
          </h3>
          <button
            type="button"
            onClick={addTestimonial}
            className="px-4 py-2 bg-sage-500 text-white rounded-lg hover:bg-sage-600 transition-colors"
          >
            + Yorum Ekle
          </button>
        </div>

        {localContent.testimonials.map((testimonial, index) => (
          <div key={testimonial.id} className="p-4 border-2 border-slate-200 rounded-xl space-y-3 bg-white">
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={testimonial.name}
                    onChange={(e) => updateTestimonial(index, { name: e.target.value })}
                    className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sage-500"
                    placeholder="İsim"
                  />
                  <input
                    type="text"
                    value={testimonial.role || ''}
                    onChange={(e) => updateTestimonial(index, { role: e.target.value })}
                    className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sage-500"
                    placeholder="Pozisyon"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={testimonial.company || ''}
                    onChange={(e) => updateTestimonial(index, { company: e.target.value })}
                    className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sage-500"
                    placeholder="Şirket"
                  />
                  <input
                    type="text"
                    value={testimonial.avatar || ''}
                    onChange={(e) => updateTestimonial(index, { avatar: e.target.value })}
                    className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sage-500"
                    placeholder="Avatar URL"
                  />
                </div>
                <textarea
                  value={testimonial.content}
                  onChange={(e) => updateTestimonial(index, { content: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sage-500"
                  placeholder="Yorum içeriği"
                />
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Puan: {testimonial.rating || 0}/5
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="5"
                    step="1"
                    value={testimonial.rating || 0}
                    onChange={(e) => updateTestimonial(index, { rating: parseInt(e.target.value) })}
                    className="w-full"
                  />
                </div>
                <div className="p-3 bg-slate-50 rounded-lg space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={testimonial.readMoreLink?.enabled || false}
                      onChange={(e) => updateTestimonial(index, {
                        readMoreLink: {
                          enabled: e.target.checked,
                          text: testimonial.readMoreLink?.text || 'Weiter lesen',
                          url: testimonial.readMoreLink?.url || '#'
                        }
                      })}
                      className="rounded border-slate-300 text-sage-500 focus:ring-sage-500"
                    />
                    <span className="text-sm font-medium text-slate-700">"Weiter lesen" Linki</span>
                  </label>
                  {testimonial.readMoreLink?.enabled && (
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={testimonial.readMoreLink?.text || 'Weiter lesen'}
                        onChange={(e) => updateTestimonial(index, {
                          readMoreLink: {
                            ...testimonial.readMoreLink,
                            text: e.target.value
                          }
                        })}
                        className="px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-sage-500"
                        placeholder="Weiter lesen"
                      />
                      <input
                        type="text"
                        value={testimonial.readMoreLink?.url || '#'}
                        onChange={(e) => updateTestimonial(index, {
                          readMoreLink: {
                            ...testimonial.readMoreLink,
                            url: e.target.value
                          }
                        })}
                        className="px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-sage-500"
                        placeholder="URL"
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => moveTestimonial(index, 'up')}
                  disabled={index === 0}
                  className="p-2 text-slate-600 hover:text-slate-900 disabled:opacity-30"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => moveTestimonial(index, 'down')}
                  disabled={index === localContent.testimonials.length - 1}
                  className="p-2 text-slate-600 hover:text-slate-900 disabled:opacity-30"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => removeTestimonial(index)}
                  className="p-2 text-red-600 hover:text-red-800"
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
