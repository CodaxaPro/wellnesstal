'use client'

import { useState, useMemo } from 'react'
import { PRESET_ICONS, ICON_CATEGORIES } from '../defaults'

interface IconSelectorProps {
  value: string
  onChange: (iconName: string) => void
  iconColor?: string
  backgroundColor?: string
}

export default function IconSelector({
  value,
  onChange,
  iconColor = '#ffffff',
  backgroundColor = '#10b981'
}: IconSelectorProps) {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const filteredIcons = useMemo(() => {
    if (search.trim()) {
      return Object.keys(PRESET_ICONS).filter(name =>
        name.toLowerCase().includes(search.toLowerCase())
      )
    }
    if (activeCategory) {
      const category = ICON_CATEGORIES.find(c => c.name === activeCategory)
      return category?.icons || []
    }
    return Object.keys(PRESET_ICONS)
  }, [search, activeCategory])

  const renderIcon = (iconName: string, size: number = 20) => {
    const path = PRESET_ICONS[iconName]
    if (!path) return null

    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d={path} />
      </svg>
    )
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            if (e.target.value) setActiveCategory(null)
          }}
          placeholder="İkon ara..."
          className="w-full px-4 py-2 pl-10 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sage-500 text-sm"
        />
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => {
            setActiveCategory(null)
            setSearch('')
          }}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            !activeCategory && !search
              ? 'bg-sage-500 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Tümü
        </button>
        {ICON_CATEGORIES.map(category => (
          <button
            key={category.name}
            onClick={() => {
              setActiveCategory(category.name)
              setSearch('')
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              activeCategory === category.name
                ? 'bg-sage-500 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Icon Grid */}
      <div className="max-h-64 overflow-y-auto border border-slate-200 rounded-lg p-3">
        <div className="grid grid-cols-8 gap-2">
          {filteredIcons.map(iconName => (
            <button
              key={iconName}
              onClick={() => onChange(iconName)}
              title={iconName}
              className={`p-2 rounded-lg flex items-center justify-center transition-all ${
                value === iconName
                  ? 'ring-2 ring-sage-500 ring-offset-2'
                  : 'hover:bg-slate-100'
              }`}
              style={{
                backgroundColor: value === iconName ? backgroundColor : undefined,
                color: value === iconName ? iconColor : '#64748b'
              }}
            >
              {renderIcon(iconName)}
            </button>
          ))}
        </div>

        {filteredIcons.length === 0 && (
          <div className="py-8 text-center text-slate-500 text-sm">
            İkon bulunamadı
          </div>
        )}
      </div>

      {/* Selected Icon Preview */}
      {value && (
        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor, color: iconColor }}
          >
            {renderIcon(value, 24)}
          </div>
          <div>
            <div className="text-sm font-medium text-slate-700">{value}</div>
            <div className="text-xs text-slate-500">Seçili ikon</div>
          </div>
        </div>
      )}
    </div>
  )
}

// Standalone icon renderer for use in other components
export function FeatureIcon({
  name,
  size = 24,
  color = 'currentColor',
  className = ''
}: {
  name: string
  size?: number
  color?: string
  className?: string
}) {
  const path = PRESET_ICONS[name]
  if (!path) return null

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d={path} />
    </svg>
  )
}
