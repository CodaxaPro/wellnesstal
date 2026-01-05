'use client'

import { useState, useEffect } from 'react'
import { PricingContent, PricingPackage } from '../../types'
import { getDefaultPackage } from './defaults'

interface PackagesTabProps {
  content: PricingContent
  updateContent: (updates: Partial<PricingContent>) => void
}

export default function PackagesTab({ content, updateContent }: PackagesTabProps) {
  let packages = content.packages || []
  
  // Sort packages by order property if ALL packages have order, otherwise maintain original order
  const allHaveOrder = packages.length > 0 && packages.every(pkg => pkg.order !== undefined)
  if (allHaveOrder) {
    packages = [...packages].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  }
  
  // Auto-set order property based on current array order if missing (only once on mount)
  useEffect(() => {
    if (packages.length === 0) return
    
    // Check if any package is missing order property
    const hasMissingOrder = packages.some(pkg => pkg.order === undefined)
    if (hasMissingOrder) {
      const updatedPackages = packages.map((pkg, idx) => ({
        ...pkg,
        order: pkg.order ?? idx
      }))
      updateContent({ packages: updatedPackages })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Only run once on mount
  
  const [activePackageId, setActivePackageId] = useState<string | null>(
    packages[0]?.id || null
  )
  const [expandedSection, setExpandedSection] = useState<string>('basic')

  const activePackage = packages.find(p => p.id === activePackageId)

  const addPackage = () => {
    const newPackage = {
      ...getDefaultPackage(),
      order: packages.length
    }
    updateContent({
      packages: [...packages, newPackage]
    })
    setActivePackageId(newPackage.id)
  }

  const removePackage = (id: string) => {
    if (packages.length <= 1) return
    const newPackages = packages.filter(p => p.id !== id)
    updateContent({ packages: newPackages })
    if (activePackageId === id) {
      setActivePackageId(newPackages[0]?.id || null)
    }
  }

  const updatePackage = (id: string, updates: Partial<PricingPackage>) => {
    updateContent({
      packages: packages.map(p => p.id === id ? { ...p, ...updates } : p)
    })
  }

  const updatePackageBadge = (id: string, updates: Partial<NonNullable<PricingPackage['badge']>>) => {
    const pkg = packages.find(p => p.id === id)
    if (!pkg) return
    updatePackage(id, {
      badge: {
        enabled: pkg.badge?.enabled ?? false,
        text: pkg.badge?.text ?? '',
        ...pkg.badge,
        ...updates
      }
    })
  }

  const updatePackageStyle = (id: string, updates: Partial<NonNullable<PricingPackage['style']>>) => {
    const pkg = packages.find(p => p.id === id)
    if (!pkg) return
    updatePackage(id, {
      style: { ...pkg.style, ...updates }
    })
  }

  const movePackage = (id: string, direction: 'up' | 'down') => {
    const index = packages.findIndex(p => p.id === id)
    if (index === -1) return
    if (direction === 'up' && index === 0) return
    if (direction === 'down' && index === packages.length - 1) return

    const newPackages = [...packages]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    ;[newPackages[index], newPackages[targetIndex]] = [newPackages[targetIndex], newPackages[index]]
    
    // Update order property for all packages to reflect new order
    const updatedPackages = newPackages.map((pkg, idx) => ({
      ...pkg,
      order: idx
    }))
    
    updateContent({ packages: updatedPackages })
  }

  const addFeature = (packageId: string) => {
    const pkg = packages.find(p => p.id === packageId)
    if (!pkg) return
    const features = [...(Array.isArray(pkg.features) ? pkg.features : [])]
    features.push({
      id: `feat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      text: 'Yeni Özellik',
      included: true
    })
    updatePackage(packageId, { features })
  }

  const updateFeature = (packageId: string, index: number, value: string | { text: string; included: boolean }) => {
    const pkg = packages.find(p => p.id === packageId)
    if (!pkg) return
    const features = [...(Array.isArray(pkg.features) ? pkg.features : [])]
    if (typeof value === 'string') {
      // If current feature is object, update text, otherwise replace with string
      const currentFeature = features[index]
      if (typeof currentFeature === 'string') {
        features[index] = value
      } else {
        features[index] = { ...currentFeature, text: value }
      }
    } else {
      features[index] = value
    }
    updatePackage(packageId, { features })
  }

  const toggleFeatureIncluded = (packageId: string, index: number) => {
    const pkg = packages.find(p => p.id === packageId)
    if (!pkg) return
    const features = [...(Array.isArray(pkg.features) ? pkg.features : [])]
    const feature = features[index]
    if (typeof feature === 'string') {
      features[index] = { id: `feat-${Date.now()}`, text: feature, included: false }
    } else {
      features[index] = { ...feature, included: !(feature.included !== false) }
    }
    updatePackage(packageId, { features })
  }

  const removeFeature = (packageId: string, index: number) => {
    const pkg = packages.find(p => p.id === packageId)
    if (!pkg) return
    const features = [...(Array.isArray(pkg.features) ? pkg.features : [])]
    features.splice(index, 1)
    updatePackage(packageId, { features })
  }

  const duplicatePackage = (id: string) => {
    const pkg = packages.find(p => p.id === id)
    if (!pkg) return
    const newPackage = {
      ...pkg,
      id: `pkg-${Date.now()}`,
      name: `${pkg.name} (Kopya)`
    }
    updateContent({ packages: [...packages, newPackage] })
    setActivePackageId(newPackage.id)
  }


  return (
    <div className="flex gap-4 h-full">
      {/* Package List */}
      <div className="w-56 flex-shrink-0 space-y-2">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-slate-700">Paketler</h3>
          <button
            onClick={addPackage}
            className="p-1.5 bg-sage-500 text-white rounded-lg hover:bg-sage-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>

        {packages.map((pkg, index) => (
          <div
            key={pkg.id}
            onClick={() => setActivePackageId(pkg.id)}
            className={`p-3 rounded-xl border cursor-pointer transition-all ${
              activePackageId === pkg.id
                ? 'border-sage-500 bg-sage-50 shadow-sm'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <div className="flex items-center gap-2">
              <div className="flex flex-col gap-0.5">
                <button
                  onClick={(e) => { e.stopPropagation(); movePackage(pkg.id, 'up') }}
                  disabled={index === 0}
                  className="p-0.5 text-slate-400 hover:text-slate-600 disabled:opacity-30"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); movePackage(pkg.id, 'down') }}
                  disabled={index === packages.length - 1}
                  className="p-0.5 text-slate-400 hover:text-slate-600 disabled:opacity-30"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-700 truncate">{pkg.name}</p>
                <p className="text-xs text-slate-500">{pkg.price}</p>
              </div>
              {pkg.highlighted && (
                <span className="px-1.5 py-0.5 bg-sage-100 text-sage-700 text-[10px] font-medium rounded">
                  ⭐
                </span>
              )}
            </div>
          </div>
        ))}

        <button
          onClick={addPackage}
          className="w-full py-2 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 hover:border-sage-500 hover:text-sage-600 text-sm transition-colors"
        >
          + Paket Ekle
        </button>
      </div>

      {/* Package Editor */}
      <div className="flex-1 overflow-y-auto">
        {activePackage ? (
          <div className="space-y-4">
            {/* Package Actions */}
            <div className="flex items-center justify-between bg-white rounded-xl p-3 border border-slate-200">
              <h3 className="text-sm font-semibold text-slate-700">{activePackage.name}</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => duplicatePackage(activePackage.id)}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"
                  title="Kopyala"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
                <button
                  onClick={() => removePackage(activePackage.id)}
                  disabled={packages.length <= 1}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-30"
                  title="Sil"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Basic Info Section */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <button
                onClick={() => setExpandedSection(expandedSection === 'basic' ? '' : 'basic')}
                className="w-full p-4 flex items-center justify-between text-left"
              >
                <span className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <span className="w-6 h-6 bg-sage-100 rounded-lg flex items-center justify-center text-sage-600">📦</span>
                  Temel Bilgiler
                </span>
                <svg className={`w-5 h-5 text-slate-400 transition-transform ${expandedSection === 'basic' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {expandedSection === 'basic' && (
                <div className="p-4 pt-0 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1.5">Paket Adı</label>
                      <input
                        type="text"
                        value={activePackage.name ?? ''}
                        onChange={(e) => updatePackage(activePackage.id, { name: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1.5">Alt Başlık</label>
                      <input
                        type="text"
                        value={activePackage.subtitle ?? ''}
                        onChange={(e) => updatePackage(activePackage.id, { subtitle: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1.5">Aylık Fiyat</label>
                      <input
                        type="text"
                        value={activePackage.price ?? ''}
                        onChange={(e) => updatePackage(activePackage.id, { price: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                        placeholder="€99"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1.5">Yıllık Fiyat</label>
                      <input
                        type="text"
                        value={activePackage.yearlyPrice ?? ''}
                        onChange={(e) => updatePackage(activePackage.id, { yearlyPrice: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                        placeholder="€79"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1.5">Eski Fiyat</label>
                      <input
                        type="text"
                        value={activePackage.originalPrice ?? ''}
                        onChange={(e) => updatePackage(activePackage.id, { originalPrice: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                        placeholder="€129"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1.5">Dönem</label>
                      <input
                        type="text"
                        value={activePackage.period ?? ''}
                        onChange={(e) => updatePackage(activePackage.id, { period: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                        placeholder="ay"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1.5">Açıklama</label>
                    <textarea
                      value={activePackage.description ?? ''}
                      onChange={(e) => updatePackage(activePackage.id, { description: e.target.value })}
                      rows={2}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                    />
                  </div>

                  {/* Highlighting Options */}
                  <div className="flex gap-4 p-3 bg-slate-50 rounded-lg">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={activePackage.highlighted ?? false}
                        onChange={(e) => updatePackage(activePackage.id, { highlighted: e.target.checked })}
                        className="rounded border-slate-300 text-sage-500"
                      />
                      <span className="text-xs text-slate-600">Öne Çıkan</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={activePackage.popular ?? false}
                        onChange={(e) => updatePackage(activePackage.id, { popular: e.target.checked })}
                        className="rounded border-slate-300 text-sage-500"
                      />
                      <span className="text-xs text-slate-600">Popüler</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={activePackage.recommended ?? false}
                        onChange={(e) => updatePackage(activePackage.id, { recommended: e.target.checked })}
                        className="rounded border-slate-300 text-sage-500"
                      />
                      <span className="text-xs text-slate-600">Önerilen</span>
                    </label>
                  </div>

                  {/* Partner/Double Package */}
                  <div className="p-3 bg-sage-50 rounded-lg space-y-3">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={activePackage.isPartner ?? false}
                        onChange={(e) => updatePackage(activePackage.id, { 
                          isPartner: e.target.checked,
                          partnerLabel: e.target.checked ? (activePackage.partnerLabel || '2x') : undefined
                        })}
                        className="rounded border-slate-300 text-sage-500"
                      />
                      <span className="text-xs font-medium text-slate-700">Partner/Çift Paket</span>
                    </label>
                    {activePackage.isPartner && (
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1.5">Etiket (örn: 2x, Partnertermin)</label>
                        <input
                          type="text"
                          value={activePackage.partnerLabel || '2x'}
                          onChange={(e) => updatePackage(activePackage.id, { partnerLabel: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                          placeholder="2x"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Features Section */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <button
                onClick={() => setExpandedSection(expandedSection === 'features' ? '' : 'features')}
                className="w-full p-4 flex items-center justify-between text-left"
              >
                <span className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <span className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">✓</span>
                  Özellikler ({Array.isArray(activePackage.features) ? activePackage.features.filter(f => {
                    if (typeof f === 'string') return true
                    return f.included === true
                  }).length : 0})
                </span>
                <svg className={`w-5 h-5 text-slate-400 transition-transform ${expandedSection === 'features' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {expandedSection === 'features' && (
                <div className="p-4 pt-0 space-y-2">
                  {Array.isArray(activePackage.features) && activePackage.features.map((feature, index) => {
                    const isString = typeof feature === 'string'
                    const text = isString ? feature : feature.text
                    const included = isString ? true : feature.included === true
                    return (
                      <div key={index} className="flex items-center gap-2">
                        <button
                          onClick={() => toggleFeatureIncluded(activePackage.id, index)}
                          className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                            included
                              ? 'bg-green-100 text-green-600 hover:bg-green-200'
                              : 'bg-red-100 text-red-500 hover:bg-red-200'
                          }`}
                          title={included ? 'Var' : 'Yok'}
                        >
                          {included ? (
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          )}
                        </button>
                        <input
                          type="text"
                          value={text}
                          onChange={(e) => {
                            if (isString) {
                              updateFeature(activePackage.id, index, e.target.value)
                            } else {
                              updateFeature(activePackage.id, index, { ...feature, text: e.target.value })
                            }
                          }}
                          className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm"
                          placeholder="Özellik adı"
                        />
                        <button
                          onClick={() => removeFeature(activePackage.id, index)}
                          className="p-2 text-slate-400 hover:text-red-600 rounded-lg flex-shrink-0"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    )
                  })}
                  <button
                    onClick={() => addFeature(activePackage.id)}
                    className="w-full py-2 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 hover:border-sage-500 hover:text-sage-600 text-sm"
                  >
                    + Özellik Ekle
                  </button>
                </div>
              )}
            </div>

            {/* CTA Section */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <button
                onClick={() => setExpandedSection(expandedSection === 'cta' ? '' : 'cta')}
                className="w-full p-4 flex items-center justify-between text-left"
              >
                <span className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <span className="w-6 h-6 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600">🔗</span>
                  Buton
                </span>
                <svg className={`w-5 h-5 text-slate-400 transition-transform ${expandedSection === 'cta' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {expandedSection === 'cta' && (
                <div className="p-4 pt-0 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1.5">Buton Metni</label>
                      <input
                        type="text"
                        value={activePackage.ctaText ?? ''}
                        onChange={(e) => updatePackage(activePackage.id, { ctaText: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1.5">Buton Linki</label>
                      <input
                        type="text"
                        value={activePackage.ctaLink ?? ''}
                        onChange={(e) => updatePackage(activePackage.id, { ctaLink: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Badge Section */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <button
                onClick={() => setExpandedSection(expandedSection === 'badge' ? '' : 'badge')}
                className="w-full p-4 flex items-center justify-between text-left"
              >
                <span className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <span className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">🏷️</span>
                  Rozet
                </span>
                <svg className={`w-5 h-5 text-slate-400 transition-transform ${expandedSection === 'badge' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {expandedSection === 'badge' && (
                <div className="p-4 pt-0 space-y-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={activePackage.badge?.enabled ?? false}
                      onChange={(e) => updatePackageBadge(activePackage.id, { enabled: e.target.checked })}
                      className="rounded border-slate-300 text-sage-500"
                    />
                    <span className="text-sm text-slate-700">Rozet Göster</span>
                  </label>

                  {activePackage.badge?.enabled && (
                    <div className="space-y-3 p-3 bg-slate-50 rounded-lg">
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1.5">Rozet Metni</label>
                        <input
                          type="text"
                          value={activePackage.badge?.text ?? ''}
                          onChange={(e) => updatePackageBadge(activePackage.id, { text: e.target.value })}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                          placeholder="Beliebteste"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-slate-600 mb-1.5">Arkaplan</label>
                          <input
                            type="color"
                            value={activePackage.badge?.backgroundColor ?? '#059669'}
                            onChange={(e) => updatePackageBadge(activePackage.id, { backgroundColor: e.target.value })}
                            className="w-full h-9 rounded border border-slate-200"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-600 mb-1.5">Metin Rengi</label>
                          <input
                            type="color"
                            value={activePackage.badge?.textColor ?? '#ffffff'}
                            onChange={(e) => updatePackageBadge(activePackage.id, { textColor: e.target.value })}
                            className="w-full h-9 rounded border border-slate-200"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1.5">Konum</label>
                        <select
                          value={activePackage.badge?.position ?? 'top-center'}
                          onChange={(e) => updatePackageBadge(activePackage.id, { position: e.target.value as 'top-left' | 'top-right' | 'top-center' })}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                        >
                          <option value="top-left">Sol Üst</option>
                          <option value="top-center">Orta Üst</option>
                          <option value="top-right">Sağ Üst</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Styling Section */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <button
                onClick={() => setExpandedSection(expandedSection === 'style' ? '' : 'style')}
                className="w-full p-4 flex items-center justify-between text-left"
              >
                <span className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <span className="w-6 h-6 bg-pink-100 rounded-lg flex items-center justify-center text-pink-600">🎨</span>
                  Stil (Özel)
                </span>
                <svg className={`w-5 h-5 text-slate-400 transition-transform ${expandedSection === 'style' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {expandedSection === 'style' && (
                <div className="p-4 pt-0 space-y-4">
                  <p className="text-xs text-slate-500">Bu paketin özel stilini tanımlayın. Boş bırakılırsa varsayılan stil kullanılır.</p>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1.5">Arkaplan</label>
                      <input
                        type="color"
                        value={activePackage.style?.backgroundColor ?? '#ffffff'}
                        onChange={(e) => updatePackageStyle(activePackage.id, { backgroundColor: e.target.value })}
                        className="w-full h-9 rounded border border-slate-200"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1.5">Kenarlık Rengi</label>
                      <input
                        type="color"
                        value={activePackage.style?.borderColor ?? '#e2e8f0'}
                        onChange={(e) => updatePackageStyle(activePackage.id, { borderColor: e.target.value })}
                        className="w-full h-9 rounded border border-slate-200"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1.5">Fiyat Rengi</label>
                      <input
                        type="color"
                        value={activePackage.style?.priceColor ?? '#059669'}
                        onChange={(e) => updatePackageStyle(activePackage.id, { priceColor: e.target.value })}
                        className="w-full h-9 rounded border border-slate-200"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1.5">Özellik Rengi</label>
                      <input
                        type="color"
                        value={activePackage.style?.featureTextColor ?? '#475569'}
                        onChange={(e) => updatePackageStyle(activePackage.id, { featureTextColor: e.target.value })}
                        className="w-full h-9 rounded border border-slate-200"
                      />
                    </div>
                  </div>

                  {/* Partner Badge Color - Sadece partner paketi ise göster */}
                  {activePackage.isPartner && (
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1.5">
                        Partner Badge Rengi
                        <span className="text-slate-400 ml-1">(varsayılan: ana renk)</span>
                      </label>
                      <input
                        type="color"
                        value={activePackage.style?.partnerBadgeColor ?? '#9CAF88'}
                        onChange={(e) => updatePackageStyle(activePackage.id, { partnerBadgeColor: e.target.value })}
                        className="w-full h-9 rounded border border-slate-200"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1.5">Gölge</label>
                    <select
                      value={activePackage.style?.shadowSize ?? 'md'}
                      onChange={(e) => updatePackageStyle(activePackage.id, { shadowSize: e.target.value as 'none' | 'sm' | 'md' | 'lg' | 'xl' })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                    >
                      <option value="none">Yok</option>
                      <option value="sm">Küçük</option>
                      <option value="md">Orta</option>
                      <option value="lg">Büyük</option>
                      <option value="xl">Ekstra Büyük</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-slate-400">
            <p>Düzenlemek için bir paket seçin</p>
          </div>
        )}
      </div>
    </div>
  )
}
