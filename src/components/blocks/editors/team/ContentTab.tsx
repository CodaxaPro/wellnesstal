'use client'

import { TeamContent } from '../../types'
import { TEAM_LAYOUT_OPTIONS, MAX_WIDTH_OPTIONS, TEAM_STYLE_PRESETS } from './defaults'

interface ContentTabProps {
  content: TeamContent
  updateContent: (updates: Partial<TeamContent>) => void
}

export default function ContentTab({ content, updateContent }: ContentTabProps) {
  const header = content.header || {}

  const updateHeader = (updates: Partial<typeof header>) => {
    updateContent({
      header: { ...header, ...updates }
    })
  }

  const updateTypography = (updates: Record<string, string | undefined>) => {
    updateContent({
      header: {
        ...header,
        typography: {
          ...header.typography,
          ...updates
        }
      }
    })
  }

  const applyPreset = (preset: typeof TEAM_STYLE_PRESETS[0]) => {
    updateContent(preset.value)
  }

  return (
    <div className="space-y-6">
      {/* Style Presets */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
        <h3 className="text-sm font-semibold text-slate-700 mb-3">Stil Sablonlari</h3>
        <div className="grid grid-cols-3 gap-2">
          {TEAM_STYLE_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => applyPreset(preset)}
              className="p-3 rounded-lg border border-slate-200 hover:border-sage-400 hover:bg-sage-50 transition-all text-left group"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="w-7 h-7 rounded bg-slate-100 group-hover:bg-sage-100 flex items-center justify-center text-xs font-bold text-slate-600 group-hover:text-sage-700">
                  {preset.icon}
                </span>
                <span className="text-sm font-medium text-slate-700">{preset.name}</span>
              </div>
              <span className="text-xs text-slate-500">{preset.description}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Layout Selection */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
        <h3 className="text-sm font-semibold text-slate-700 mb-3">Layout</h3>
        <div className="grid grid-cols-4 gap-2">
          {TEAM_LAYOUT_OPTIONS.map((option) => (
            <button
              key={option.id}
              onClick={() => updateContent({ layout: option.id as TeamContent['layout'] })}
              className={`p-3 rounded-lg border transition-all text-center ${
                content.layout === option.id
                  ? 'border-sage-500 bg-sage-50 text-sage-700'
                  : 'border-slate-200 hover:border-slate-300 text-slate-600'
              }`}
            >
              <div className="text-lg font-bold mb-1">{option.icon}</div>
              <div className="text-xs">{option.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Section Header */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
        <h3 className="text-sm font-semibold text-slate-700 mb-3">Bolum Basligi</h3>
        <div className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Baslik</label>
            <input
              type="text"
              value={header.title || ''}
              onChange={(e) => updateHeader({ title: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
              placeholder="Ekibimiz"
            />
          </div>

          {/* Subtitle */}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Alt Baslik</label>
            <input
              type="text"
              value={header.subtitle || ''}
              onChange={(e) => updateHeader({ subtitle: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
              placeholder="Profesyonel ekibimizle tanisin"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Aciklama</label>
            <textarea
              value={header.description || ''}
              onChange={(e) => updateHeader({ description: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
              placeholder="Opsiyonel aciklama metni..."
            />
          </div>

          {/* Alignment */}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Hizalama</label>
            <div className="flex gap-2">
              {(['left', 'center', 'right'] as const).map((align) => (
                <button
                  key={align}
                  onClick={() => updateHeader({ alignment: align })}
                  className={`flex-1 py-2 px-3 text-sm rounded-lg border transition-colors ${
                    header.alignment === align
                      ? 'bg-sage-500 text-white border-sage-500'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {align === 'left' ? 'Sol' : align === 'center' ? 'Orta' : 'Sag'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Header Typography */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
        <h3 className="text-sm font-semibold text-slate-700 mb-3">Baslik Tipografisi</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Baslik Boyutu</label>
            <input
              type="text"
              value={header.typography?.titleSize || '2.5rem'}
              onChange={(e) => updateTypography({ titleSize: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              placeholder="2.5rem"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Baslik Rengi</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={header.typography?.titleColor || '#1e293b'}
                onChange={(e) => updateTypography({ titleColor: e.target.value })}
                className="w-10 h-10 rounded border border-slate-200 cursor-pointer"
              />
              <input
                type="text"
                value={header.typography?.titleColor || '#1e293b'}
                onChange={(e) => updateTypography({ titleColor: e.target.value })}
                className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Alt Baslik Boyutu</label>
            <input
              type="text"
              value={header.typography?.subtitleSize || '1.125rem'}
              onChange={(e) => updateTypography({ subtitleSize: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              placeholder="1.125rem"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Alt Baslik Rengi</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={header.typography?.subtitleColor || '#64748b'}
                onChange={(e) => updateTypography({ subtitleColor: e.target.value })}
                className="w-10 h-10 rounded border border-slate-200 cursor-pointer"
              />
              <input
                type="text"
                value={header.typography?.subtitleColor || '#64748b'}
                onChange={(e) => updateTypography({ subtitleColor: e.target.value })}
                className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Container Settings */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
        <h3 className="text-sm font-semibold text-slate-700 mb-3">Container Ayarlari</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Maksimum Genislik</label>
            <select
              value={content.maxWidth || 'xl'}
              onChange={(e) => updateContent({ maxWidth: e.target.value as TeamContent['maxWidth'] })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
            >
              {MAX_WIDTH_OPTIONS.map((option) => (
                <option key={option.id} value={option.id}>{option.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Uye Araligi</label>
            <input
              type="text"
              value={content.memberGap || '2rem'}
              onChange={(e) => updateContent({ memberGap: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              placeholder="2rem"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Ust Padding</label>
            <input
              type="text"
              value={content.padding?.top || '4rem'}
              onChange={(e) => updateContent({ padding: { ...content.padding, top: e.target.value, bottom: content.padding?.bottom || '4rem' } })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              placeholder="4rem"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Alt Padding</label>
            <input
              type="text"
              value={content.padding?.bottom || '4rem'}
              onChange={(e) => updateContent({ padding: { ...content.padding, top: content.padding?.top || '4rem', bottom: e.target.value } })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              placeholder="4rem"
            />
          </div>
        </div>
      </div>

      {/* Visibility Controls */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
        <h3 className="text-sm font-semibold text-slate-700 mb-3">Gorunurluk Ayarlari</h3>
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={content.showBio !== false}
              onChange={(e) => updateContent({ showBio: e.target.checked })}
              className="w-4 h-4 text-sage-600 border-slate-300 rounded focus:ring-sage-500"
            />
            <span className="text-sm text-slate-700">Biyografi Goster</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={content.showSocial !== false}
              onChange={(e) => updateContent({ showSocial: e.target.checked })}
              className="w-4 h-4 text-sage-600 border-slate-300 rounded focus:ring-sage-500"
            />
            <span className="text-sm text-slate-700">Sosyal Medya Ikonlari Goster</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={content.showDepartment === true}
              onChange={(e) => updateContent({ showDepartment: e.target.checked })}
              className="w-4 h-4 text-sage-600 border-slate-300 rounded focus:ring-sage-500"
            />
            <span className="text-sm text-slate-700">Departman Goster</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={content.showSkills === true}
              onChange={(e) => updateContent({ showSkills: e.target.checked })}
              className="w-4 h-4 text-sage-600 border-slate-300 rounded focus:ring-sage-500"
            />
            <span className="text-sm text-slate-700">Yetenekler Goster</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={content.showQuote === true}
              onChange={(e) => updateContent({ showQuote: e.target.checked })}
              className="w-4 h-4 text-sage-600 border-slate-300 rounded focus:ring-sage-500"
            />
            <span className="text-sm text-slate-700">Alinti Goster</span>
          </label>
        </div>
      </div>
    </div>
  )
}
