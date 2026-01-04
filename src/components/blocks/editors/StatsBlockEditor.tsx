'use client'

import { useState, useEffect, useRef } from 'react'
import { StatsContent, StatItem } from '../types'

interface StatsBlockEditorProps {
  content: StatsContent
  onUpdate: (content: Partial<StatsContent>) => void
}

export default function StatsBlockEditor({ content, onUpdate }: StatsBlockEditorProps) {
  const [localContent, setLocalContent] = useState<StatsContent>(content)

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

  const updateStat = (index: number, updates: Partial<StatItem>) => {
    const newStats = [...localContent.stats]
    newStats[index] = { ...newStats[index], ...updates }
    setLocalContent({ ...localContent, stats: newStats })
  }

  const addStat = () => {
    const newStat: StatItem = {
      value: '100+',
      label: 'Mutlu Müşteri',
      icon: '😊'
    }
    setLocalContent({
      ...localContent,
      stats: [...localContent.stats, newStat]
    })
  }

  const removeStat = (index: number) => {
    const newStats = localContent.stats.filter((_, i) => i !== index)
    setLocalContent({ ...localContent, stats: newStats })
  }

  return (
    <div className="space-y-6">
      {/* Block Title */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Block Başlığı (Opsiyonel)
        </label>
        <input
          type="text"
          value={localContent.title || ''}
          onChange={(e) => setLocalContent({ ...localContent, title: e.target.value })}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sage-500"
          placeholder="Unsere Erfolge"
        />
      </div>

      {/* Background Color */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Arkaplan Rengi
        </label>
        <div className="flex gap-3">
          <input
            type="color"
            value={localContent.backgroundColor || '#f5f5f5'}
            onChange={(e) => setLocalContent({ ...localContent, backgroundColor: e.target.value })}
            className="w-20 h-10 rounded border border-slate-300"
          />
          <input
            type="text"
            value={localContent.backgroundColor || '#f5f5f5'}
            onChange={(e) => setLocalContent({ ...localContent, backgroundColor: e.target.value })}
            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sage-500"
            placeholder="#f5f5f5"
          />
        </div>
      </div>

      {/* Stats List */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-slate-800">
            İstatistikler ({localContent.stats.length})
          </h3>
          <button
            type="button"
            onClick={addStat}
            className="px-4 py-2 bg-sage-500 text-white rounded-lg hover:bg-sage-600 transition-colors"
          >
            + İstatistik Ekle
          </button>
        </div>

        {localContent.stats.map((stat, index) => (
          <div key={index} className="p-4 border-2 border-slate-200 rounded-xl bg-white">
            <div className="flex gap-3 items-start">
              <input
                type="text"
                value={stat.icon || ''}
                onChange={(e) => updateStat(index, { icon: e.target.value })}
                className="w-16 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sage-500 text-center"
                placeholder="🎯"
              />
              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  value={stat.value}
                  onChange={(e) => updateStat(index, { value: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sage-500"
                  placeholder="500+"
                />
                <input
                  type="text"
                  value={stat.label}
                  onChange={(e) => updateStat(index, { label: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sage-500"
                  placeholder="Mutlu Müşteri"
                />
              </div>
              <button
                type="button"
                onClick={() => removeStat(index)}
                className="p-2 text-red-600 hover:text-red-800"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
