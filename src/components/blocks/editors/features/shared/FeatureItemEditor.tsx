'use client'

import { useState } from 'react'
import { FeatureItem } from '../../../types'
import IconSelector, { FeatureIcon } from './IconSelector'
import { PRESET_ICONS } from '../defaults'

interface FeatureItemEditorProps {
  feature: FeatureItem
  index: number
  onUpdate: (index: number, updates: Partial<FeatureItem>) => void
  onDelete: (index: number) => void
  onMoveUp?: () => void
  onMoveDown?: () => void
  showAdvanced?: boolean
}

export default function FeatureItemEditor({
  feature,
  index,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
  showAdvanced = false
}: FeatureItemEditorProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showIconPicker, setShowIconPicker] = useState(false)

  const currentIcon = feature.iconConfig?.value || feature.icon || 'star'
  const iconBg = feature.iconConfig?.backgroundColor || '#10b981'
  const iconColor = feature.iconConfig?.iconColor || '#ffffff'

  return (
    <div className={`border border-slate-200 rounded-xl overflow-hidden transition-all ${
      feature.visible === false ? 'opacity-50' : ''
    }`}>
      {/* Header - Always Visible */}
      <div className="flex items-center gap-3 p-4 bg-slate-50">
        {/* Drag Handle */}
        <div className="cursor-move text-slate-400 hover:text-slate-600">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
          </svg>
        </div>

        {/* Icon Preview */}
        <button
          onClick={() => setShowIconPicker(!showIconPicker)}
          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform hover:scale-110"
          style={{ backgroundColor: iconBg, color: iconColor }}
        >
          <FeatureIcon name={currentIcon} size={20} color={iconColor} />
        </button>

        {/* Title & Description Preview */}
        <div className="flex-1 min-w-0">
          <input
            type="text"
            value={feature.title}
            onChange={(e) => onUpdate(index, { title: e.target.value })}
            className="w-full bg-transparent border-none p-0 font-medium text-slate-700 focus:ring-0 focus:outline-none"
            placeholder="Özellik başlığı"
          />
          <p className="text-sm text-slate-500 truncate">{feature.description || 'Açıklama ekleyin...'}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          {/* Visibility Toggle */}
          <button
            onClick={() => onUpdate(index, { visible: !feature.visible })}
            className={`p-2 rounded-lg transition-colors ${
              feature.visible !== false ? 'text-sage-500 bg-sage-50' : 'text-slate-400 hover:bg-slate-100'
            }`}
            title={feature.visible !== false ? 'Gizle' : 'Göster'}
          >
            {feature.visible !== false ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            )}
          </button>

          {/* Move Up */}
          {onMoveUp && (
            <button
              onClick={onMoveUp}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              title="Yukarı Taşı"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </button>
          )}

          {/* Move Down */}
          {onMoveDown && (
            <button
              onClick={onMoveDown}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              title="Aşağı Taşı"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          )}

          {/* Expand/Collapse */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            title={isExpanded ? 'Daralt' : 'Genişlet'}
          >
            <svg className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Delete */}
          <button
            onClick={() => onDelete(index)}
            className="p-2 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            title="Sil"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Icon Picker - Collapsible */}
      {showIconPicker && (
        <div className="p-4 border-t border-slate-200 bg-white">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-sm text-slate-700">İkon Seç</h4>
            <button
              onClick={() => setShowIconPicker(false)}
              className="text-slate-400 hover:text-slate-600"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Icon Colors */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs text-slate-500 mb-1">Arkaplan</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={iconBg}
                  onChange={(e) => onUpdate(index, {
                    iconConfig: {
                      ...feature.iconConfig,
                      type: 'preset',
                      value: currentIcon,
                      backgroundColor: e.target.value,
                      iconColor
                    }
                  })}
                  className="w-10 h-10 rounded-lg border border-slate-200 cursor-pointer"
                />
                <div className="flex gap-1">
                  {['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#1e293b'].map(color => (
                    <button
                      key={color}
                      onClick={() => onUpdate(index, {
                        iconConfig: { ...feature.iconConfig, type: 'preset', value: currentIcon, backgroundColor: color, iconColor }
                      })}
                      className="w-6 h-6 rounded-md border border-slate-200"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">İkon Rengi</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={iconColor}
                  onChange={(e) => onUpdate(index, {
                    iconConfig: {
                      ...feature.iconConfig,
                      type: 'preset',
                      value: currentIcon,
                      backgroundColor: iconBg,
                      iconColor: e.target.value
                    }
                  })}
                  className="w-10 h-10 rounded-lg border border-slate-200 cursor-pointer"
                />
                <div className="flex gap-1">
                  {['#ffffff', '#000000', '#10b981', '#3b82f6', '#f59e0b'].map(color => (
                    <button
                      key={color}
                      onClick={() => onUpdate(index, {
                        iconConfig: { ...feature.iconConfig, type: 'preset', value: currentIcon, backgroundColor: iconBg, iconColor: color }
                      })}
                      className="w-6 h-6 rounded-md border border-slate-200"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <IconSelector
            value={currentIcon}
            onChange={(iconName) => {
              onUpdate(index, {
                icon: iconName,
                iconConfig: {
                  ...feature.iconConfig,
                  type: 'preset',
                  value: iconName,
                  backgroundColor: iconBg,
                  iconColor
                }
              })
            }}
            iconColor={iconColor}
            backgroundColor={iconBg}
          />
        </div>
      )}

      {/* Expanded Content */}
      {isExpanded && (
        <div className="p-4 border-t border-slate-200 space-y-4 bg-white">
          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Açıklama</label>
            <textarea
              value={feature.description}
              onChange={(e) => onUpdate(index, { description: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sage-500 resize-none"
              placeholder="Özellik açıklamasını yazın..."
            />
          </div>

          {/* Link */}
          {showAdvanced && (
            <>
              <div className="p-4 bg-slate-50 rounded-xl space-y-3">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={feature.link?.enabled || false}
                    onChange={(e) => onUpdate(index, {
                      link: {
                        enabled: e.target.checked,
                        url: feature.link?.url || '#',
                        text: feature.link?.text || 'Daha Fazla',
                        style: feature.link?.style || 'link'
                      }
                    })}
                    className="rounded border-slate-300 text-sage-500 focus:ring-sage-500"
                  />
                  <span className="text-sm font-medium text-slate-700">Link Ekle</span>
                </label>

                {feature.link?.enabled && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">Link Metni</label>
                      <input
                        type="text"
                        value={feature.link.text || ''}
                        onChange={(e) => onUpdate(index, {
                          link: { ...feature.link!, text: e.target.value }
                        })}
                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
                        placeholder="Daha Fazla"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">URL</label>
                      <input
                        type="text"
                        value={feature.link.url || ''}
                        onChange={(e) => onUpdate(index, {
                          link: { ...feature.link!, url: e.target.value }
                        })}
                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
                        placeholder="/sayfa veya https://..."
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">Stil</label>
                      <select
                        value={feature.link.style || 'link'}
                        onChange={(e) => onUpdate(index, {
                          link: { ...feature.link!, style: e.target.value as any }
                        })}
                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
                      >
                        <option value="link">Link</option>
                        <option value="button">Buton</option>
                        <option value="arrow">Ok ile</option>
                      </select>
                    </div>
                    <div className="flex items-end">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={feature.link.openInNewTab || false}
                          onChange={(e) => onUpdate(index, {
                            link: { ...feature.link!, openInNewTab: e.target.checked }
                          })}
                          className="rounded border-slate-300 text-sage-500 focus:ring-sage-500"
                        />
                        <span className="text-sm text-slate-600">Yeni sekmede aç</span>
                      </label>
                    </div>
                  </div>
                )}
              </div>

              {/* Badge */}
              <div className="p-4 bg-slate-50 rounded-xl space-y-3">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={!!feature.badge}
                    onChange={(e) => onUpdate(index, {
                      badge: e.target.checked ? {
                        text: 'Yeni',
                        backgroundColor: '#10b981',
                        textColor: '#ffffff',
                        position: 'top-right'
                      } : undefined
                    })}
                    className="rounded border-slate-300 text-sage-500 focus:ring-sage-500"
                  />
                  <span className="text-sm font-medium text-slate-700">Badge Ekle</span>
                </label>

                {feature.badge && (
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">Metin</label>
                      <input
                        type="text"
                        value={feature.badge.text || ''}
                        onChange={(e) => onUpdate(index, {
                          badge: { ...feature.badge!, text: e.target.value }
                        })}
                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
                        placeholder="Yeni"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">Arkaplan</label>
                      <input
                        type="color"
                        value={feature.badge.backgroundColor || '#10b981'}
                        onChange={(e) => onUpdate(index, {
                          badge: { ...feature.badge!, backgroundColor: e.target.value }
                        })}
                        className="w-full h-9 rounded-lg border border-slate-200 cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">Konum</label>
                      <select
                        value={feature.badge.position || 'top-right'}
                        onChange={(e) => onUpdate(index, {
                          badge: { ...feature.badge!, position: e.target.value as any }
                        })}
                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
                      >
                        <option value="top-left">Sol Üst</option>
                        <option value="top-right">Sağ Üst</option>
                        <option value="inline">Satır İçi</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
