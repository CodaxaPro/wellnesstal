'use client'

import { useState, useEffect, useRef } from 'react'

// Common emoji options for navigation
const navEmojiOptions = [
  '', '🏠', '💆', '👥', '📞', '🎁', '💰', '📍', '⭐', '❤️', '✨', '🌿', '💬', '📧', '🔗', '📱', '🛒', '📋', '💎', '🎯'
]

// Font size options
const fontSizeOptions = [
  { value: '12px', label: '12px (Küçük)' },
  { value: '14px', label: '14px (Normal)' },
  { value: '16px', label: '16px (Orta)' },
  { value: '18px', label: '18px (Büyük)' },
  { value: '20px', label: '20px (Ekstra)' },
]

// Font weight options
const fontWeightOptions = [
  { value: '400', label: 'Normal' },
  { value: '500', label: 'Medium' },
  { value: '600', label: 'Semibold' },
  { value: '700', label: 'Bold' },
]

interface NavItem {
  href: string
  label: string
  icon?: string
  iconColor?: string
  color?: string
  hoverColor?: string
  fontSize?: string
  fontWeight?: string
  badge?: string
  badgeColor?: string
}

interface HeaderBlockContent {
  logoText: string
  logoEmoji: string
  navItems: NavItem[]
  ctaButtonText: string
  ctaButtonType: 'phone' | 'whatsapp' | 'url' | 'email'
  ctaButtonLink: string
  ctaButtonVisible: boolean
  ctaButtonIcon?: string
  ctaButtonIconColor?: string
  ctaButtonBgColor?: string
  ctaButtonTextColor?: string
}

interface HeaderBlockEditorProps {
  content: HeaderBlockContent
  onUpdate: (content: HeaderBlockContent) => void
}

const defaultContent: HeaderBlockContent = {
  logoText: 'Wellnesstal',
  logoEmoji: '🌿',
  navItems: [
    { href: '#home', label: 'Start' },
    { href: '#services', label: 'Leistungen' },
    { href: '#about', label: 'Über uns' },
    { href: '#contact', label: 'Kontakt' },
  ],
  ctaButtonText: 'Termin vereinbaren',
  ctaButtonType: 'phone',
  ctaButtonLink: '+4922112345678',
  ctaButtonVisible: true
}

export default function HeaderBlockEditor({ content, onUpdate }: HeaderBlockEditorProps) {
  const [localContent, setLocalContent] = useState<HeaderBlockContent>(() => ({
    ...defaultContent,
    ...content
  }))
  const [expandedNavItem, setExpandedNavItem] = useState<number | null>(null)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  // Sync local content when prop changes (for block switching)
  useEffect(() => {
    setLocalContent({
      ...defaultContent,
      ...content
    })
  }, [content])

  // Debounced update to parent
  const debouncedUpdate = (newContent: HeaderBlockContent) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }
    debounceRef.current = setTimeout(() => {
      onUpdate(newContent)
    }, 300)
  }

  const updateField = (field: string, value: any) => {
    const newContent = { ...localContent, [field]: value }
    setLocalContent(newContent)
    debouncedUpdate(newContent)
  }

  const updateNavItem = (index: number, field: string, value: any) => {
    const navItems = [...(localContent.navItems || [])]
    if (!navItems[index]) navItems[index] = { href: '', label: '' }
    navItems[index] = { ...navItems[index], [field]: value }
    const newContent = { ...localContent, navItems }
    setLocalContent(newContent)
    debouncedUpdate(newContent)
  }

  const addNavItem = () => {
    const navItems = [...(localContent.navItems || []), {
      href: '#',
      label: 'Yeni Link',
      icon: '',
      iconColor: '',
      color: '',
      hoverColor: '',
      fontSize: '14px',
      fontWeight: '500',
      badge: '',
      badgeColor: ''
    }]
    const newContent = { ...localContent, navItems }
    setLocalContent(newContent)
    debouncedUpdate(newContent)
  }

  const removeNavItem = (index: number) => {
    const navItems = localContent.navItems.filter((_: any, i: number) => i !== index)
    const newContent = { ...localContent, navItems }
    setLocalContent(newContent)
    debouncedUpdate(newContent)
    if (expandedNavItem === index) setExpandedNavItem(null)
  }

  const moveNavItem = (index: number, direction: 'up' | 'down') => {
    const navItems = [...localContent.navItems]
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= navItems.length) return
    ;[navItems[index], navItems[newIndex]] = [navItems[newIndex], navItems[index]]
    const newContent = { ...localContent, navItems }
    setLocalContent(newContent)
    debouncedUpdate(newContent)
  }

  const toggleNavItemExpand = (index: number) => {
    setExpandedNavItem(expandedNavItem === index ? null : index)
  }

  return (
    <div className="space-y-6">
      {/* Logo Section */}
      <div className="p-4 bg-sage-50 rounded-xl border border-sage-200">
        <h3 className="text-lg font-semibold text-charcoal mb-4">Logo</h3>

        {/* Logo Text */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-charcoal mb-2">Logo Metni</label>
          <input
            type="text"
            value={localContent.logoText || ''}
            onChange={(e) => updateField('logoText', e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent"
            placeholder="Wellnesstal"
          />
        </div>

        {/* Logo Emoji */}
        <div>
          <label className="block text-sm font-medium text-charcoal mb-2">Logo Emoji</label>
          <input
            type="text"
            value={localContent.logoEmoji || ''}
            onChange={(e) => updateField('logoEmoji', e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent"
            placeholder="🌿"
          />
        </div>
      </div>

      {/* Navigation Items */}
      <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-charcoal">Navigasyon Linkleri</h3>
            <p className="text-xs text-gray-500 mt-1">Icon, renk, boyut ve badge özellikleri</p>
          </div>
          <button
            type="button"
            onClick={addNavItem}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 bg-white hover:bg-blue-50 rounded-lg border border-blue-200 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Link Ekle
          </button>
        </div>

        <div className="space-y-3">
          {(localContent.navItems || []).map((item: NavItem, index: number) => (
            <div key={index} className="bg-white rounded-lg border border-blue-100 overflow-hidden">
              {/* Nav Item Header */}
              <div className="p-3 flex items-center justify-between bg-gray-50 border-b border-blue-100">
                <div className="flex items-center gap-3">
                  <span className="text-lg">{item.icon || '🔗'}</span>
                  <span className="text-sm font-medium text-gray-700">{item.label || 'Link ' + (index + 1)}</span>
                  {item.badge && (
                    <span
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: item.badgeColor || '#9CAF88',
                        color: '#fff'
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => toggleNavItemExpand(index)}
                    className="p-1.5 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded"
                    title="Detayları Göster"
                  >
                    <svg className={`h-4 w-4 transition-transform ${expandedNavItem === index ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => moveNavItem(index, 'up')}
                    disabled={index === 0}
                    className="p-1.5 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => moveNavItem(index, 'down')}
                    disabled={index === (localContent.navItems?.length || 0) - 1}
                    className="p-1.5 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => removeNavItem(index)}
                    className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Basic Fields */}
              <div className="p-3">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  {/* Icon/Emoji */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Icon/Emoji</label>
                    <select
                      value={item.icon || ''}
                      onChange={(e) => updateNavItem(index, 'icon', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                    >
                      {navEmojiOptions.map((emoji) => (
                        <option key={emoji} value={emoji}>{emoji || '(Yok)'}</option>
                      ))}
                    </select>
                  </div>
                  {/* Icon Color */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Icon Rengi</label>
                    <div className="flex gap-1">
                      <input
                        type="color"
                        value={item.iconColor || '#374151'}
                        onChange={(e) => updateNavItem(index, 'iconColor', e.target.value)}
                        className="w-10 h-9 rounded border border-gray-200 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={item.iconColor || ''}
                        onChange={(e) => updateNavItem(index, 'iconColor', e.target.value)}
                        className="flex-1 px-2 py-1.5 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500"
                        placeholder="#374151"
                      />
                    </div>
                  </div>
                  {/* Label */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Link Metni</label>
                    <input
                      type="text"
                      value={item.label || ''}
                      onChange={(e) => updateNavItem(index, 'label', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                      placeholder="Leistungen"
                    />
                  </div>
                  {/* Href */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Link Hedefi</label>
                    <input
                      type="text"
                      value={item.href || ''}
                      onChange={(e) => updateNavItem(index, 'href', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                      placeholder="#services"
                    />
                  </div>
                </div>
              </div>

              {/* Enterprise Fields (expandable) */}
              {expandedNavItem === index && (
                <div className="p-3 pt-0 border-t border-gray-100 bg-gray-50">
                  <p className="text-xs text-gray-500 mb-3 font-medium">Gelişmiş Stil Ayarları</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {/* Text Color */}
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Metin Rengi</label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={item.color || '#374151'}
                          onChange={(e) => updateNavItem(index, 'color', e.target.value)}
                          className="w-10 h-9 rounded border border-gray-200 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={item.color || ''}
                          onChange={(e) => updateNavItem(index, 'color', e.target.value)}
                          className="flex-1 px-2 py-1.5 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500"
                          placeholder="#374151"
                        />
                      </div>
                    </div>
                    {/* Hover Color */}
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Hover Rengi</label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={item.hoverColor || '#9CAF88'}
                          onChange={(e) => updateNavItem(index, 'hoverColor', e.target.value)}
                          className="w-10 h-9 rounded border border-gray-200 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={item.hoverColor || ''}
                          onChange={(e) => updateNavItem(index, 'hoverColor', e.target.value)}
                          className="flex-1 px-2 py-1.5 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500"
                          placeholder="#9CAF88"
                        />
                      </div>
                    </div>
                    {/* Font Size */}
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Yazı Boyutu</label>
                      <select
                        value={item.fontSize || '14px'}
                        onChange={(e) => updateNavItem(index, 'fontSize', e.target.value)}
                        className="w-full px-2 py-2 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500"
                      >
                        {fontSizeOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                    {/* Font Weight */}
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Yazı Kalınlığı</label>
                      <select
                        value={item.fontWeight || '500'}
                        onChange={(e) => updateNavItem(index, 'fontWeight', e.target.value)}
                        className="w-full px-2 py-2 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500"
                      >
                        {fontWeightOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Badge Section */}
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-xs text-gray-500 mb-2 font-medium">Badge (Rozet)</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Badge Metni</label>
                        <input
                          type="text"
                          value={item.badge || ''}
                          onChange={(e) => updateNavItem(index, 'badge', e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500"
                          placeholder="NEU, %20, HOT..."
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Badge Rengi</label>
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={item.badgeColor || '#9CAF88'}
                            onChange={(e) => updateNavItem(index, 'badgeColor', e.target.value)}
                            className="w-10 h-9 rounded border border-gray-200 cursor-pointer"
                          />
                          <input
                            type="text"
                            value={item.badgeColor || ''}
                            onChange={(e) => updateNavItem(index, 'badgeColor', e.target.value)}
                            className="flex-1 px-2 py-1.5 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500"
                            placeholder="#9CAF88"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* CTA Button */}
      <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
        <h3 className="text-lg font-semibold text-charcoal mb-4">CTA Butonu</h3>

        {/* Button Text */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-charcoal mb-2">Buton Metni</label>
          <input
            type="text"
            value={localContent.ctaButtonText || ''}
            onChange={(e) => updateField('ctaButtonText', e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent"
            placeholder="Termin vereinbaren"
          />
        </div>

        {/* Button Icon */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-charcoal mb-2">Buton Iconu</label>
          <select
            value={localContent.ctaButtonIcon || ''}
            onChange={(e) => updateField('ctaButtonIcon', e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent"
          >
            <option value="">Otomatik (Tipe göre)</option>
            <option value="phone">Telefon</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="email">E-posta</option>
            <option value="link">Link</option>
            <option value="calendar">Takvim</option>
            <option value="star">Yıldız</option>
            <option value="heart">Kalp</option>
            <option value="gift">Hediye</option>
          </select>
        </div>

        {/* Button Type */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-charcoal mb-2">Buton Tipi</label>
          <select
            value={localContent.ctaButtonType || 'phone'}
            onChange={(e) => updateField('ctaButtonType', e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent"
          >
            <option value="phone">Telefon</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="url">URL Link</option>
            <option value="email">E-posta</option>
          </select>
        </div>

        {/* Button Link */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-charcoal mb-2">
            {localContent.ctaButtonType === 'phone' && 'Telefon Numarası'}
            {localContent.ctaButtonType === 'whatsapp' && 'WhatsApp Numarası (ülke kodu ile)'}
            {localContent.ctaButtonType === 'url' && 'URL Adresi'}
            {localContent.ctaButtonType === 'email' && 'E-posta Adresi'}
            {!localContent.ctaButtonType && 'Telefon Numarası'}
          </label>
          <input
            type="text"
            value={localContent.ctaButtonLink || ''}
            onChange={(e) => updateField('ctaButtonLink', e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent"
            placeholder={
              localContent.ctaButtonType === 'whatsapp' ? '+49123456789' :
              localContent.ctaButtonType === 'url' ? 'https://example.com' :
              localContent.ctaButtonType === 'email' ? 'info@example.com' :
              '+49 221 12345678'
            }
          />
        </div>

        {/* Button Colors */}
        <div className="mb-4 grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-charcoal mb-2">Icon Rengi</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={localContent.ctaButtonIconColor || '#FFFFFF'}
                onChange={(e) => updateField('ctaButtonIconColor', e.target.value)}
                className="w-12 h-11 rounded-lg border border-gray-200 cursor-pointer"
              />
              <input
                type="text"
                value={localContent.ctaButtonIconColor || ''}
                onChange={(e) => updateField('ctaButtonIconColor', e.target.value)}
                className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500"
                placeholder="#FFFFFF"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal mb-2">Buton Rengi</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={localContent.ctaButtonBgColor || '#9CAF88'}
                onChange={(e) => updateField('ctaButtonBgColor', e.target.value)}
                className="w-12 h-11 rounded-lg border border-gray-200 cursor-pointer"
              />
              <input
                type="text"
                value={localContent.ctaButtonBgColor || ''}
                onChange={(e) => updateField('ctaButtonBgColor', e.target.value)}
                className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500"
                placeholder="#9CAF88"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal mb-2">Metin Rengi</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={localContent.ctaButtonTextColor || '#FFFFFF'}
                onChange={(e) => updateField('ctaButtonTextColor', e.target.value)}
                className="w-12 h-11 rounded-lg border border-gray-200 cursor-pointer"
              />
              <input
                type="text"
                value={localContent.ctaButtonTextColor || ''}
                onChange={(e) => updateField('ctaButtonTextColor', e.target.value)}
                className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500"
                placeholder="#FFFFFF"
              />
            </div>
          </div>
        </div>

        {/* Button Visibility */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-charcoal">CTA Butonu Görünür</span>
          <label className="flex items-center gap-3 cursor-pointer">
            <span className="text-sm text-gray-600">
              {localContent.ctaButtonVisible !== false ? 'Aktif' : 'Pasif'}
            </span>
            <div className="relative">
              <input
                type="checkbox"
                checked={localContent.ctaButtonVisible !== false}
                onChange={(e) => updateField('ctaButtonVisible', e.target.checked)}
                className="sr-only peer"
              />
              <div className={`w-11 h-6 rounded-full transition-colors ${
                localContent.ctaButtonVisible !== false ? 'bg-sage-500' : 'bg-gray-300'
              }`}></div>
              <div className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                localContent.ctaButtonVisible !== false ? 'translate-x-5' : 'translate-x-0'
              }`}></div>
            </div>
          </label>
        </div>
      </div>
    </div>
  )
}
