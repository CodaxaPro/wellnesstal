'use client'

import { PricingContent, PricingSectionHeader, PricingBillingToggle, PricingTrustElement } from '../../types'

interface ContentTabProps {
  content: PricingContent
  updateContent: (updates: Partial<PricingContent>) => void
}

const defaultHeader: PricingSectionHeader = {
  title: 'Fiyatlandırma',
  subtitle: 'Size uygun paketi seçin',
  alignment: 'center',
  badge: { text: '', backgroundColor: '#f0fdf4', textColor: '#166534' }
}

const defaultBillingToggle: PricingBillingToggle = {
  enabled: false,
  monthlyLabel: 'Aylık',
  yearlyLabel: 'Yıllık',
  style: 'toggle'
}

const defaultTrustElement: PricingTrustElement = {
  enabled: false,
  type: 'money-back',
  text: '30 Gün Para İade Garantisi',
  position: 'below-packages'
}

export default function ContentTab({ content, updateContent }: ContentTabProps) {
  const header = content.header || defaultHeader
  const billingToggle = content.billingToggle || defaultBillingToggle
  const trustElement = content.trustElement || defaultTrustElement

  const updateHeader = (updates: Partial<PricingSectionHeader>) => {
    updateContent({
      header: { ...header, ...updates }
    })
  }

  const updateHeaderBadge = (updates: Partial<NonNullable<PricingSectionHeader['badge']>>) => {
    updateContent({
      header: {
        ...header,
        badge: { ...header.badge, text: header.badge?.text ?? '', ...updates }
      }
    })
  }

  const updateBillingToggle = (updates: Partial<PricingBillingToggle>) => {
    updateContent({
      billingToggle: { ...billingToggle, ...updates }
    })
  }

  const updateTrustElement = (updates: Partial<PricingTrustElement>) => {
    updateContent({
      trustElement: { ...trustElement, ...updates }
    })
  }

  const updateFooterCta = (updates: Partial<NonNullable<PricingContent['footerCta']>>) => {
    updateContent({
      footerCta: {
        enabled: content.footerCta?.enabled ?? false,
        text: content.footerCta?.text ?? '',
        buttonText: content.footerCta?.buttonText ?? '',
        buttonLink: content.footerCta?.buttonLink ?? '',
        buttonStyle: content.footerCta?.buttonStyle ?? 'primary',
        ...content.footerCta,
        ...updates
      }
    })
  }

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="bg-white rounded-xl p-4 border border-slate-200">
        <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
          <span className="w-6 h-6 bg-sage-100 rounded-lg flex items-center justify-center text-sage-600">📝</span>
          Başlık Bölümü
        </h3>

        {/* Badge */}
        <div className="mb-4 p-3 bg-slate-50 rounded-lg">
          <label className="flex items-center gap-2 mb-3">
            <input
              type="checkbox"
              checked={header.badge?.enabled ?? false}
              onChange={(e) => updateHeaderBadge({ enabled: e.target.checked })}
              className="rounded border-slate-300 text-sage-500 focus:ring-sage-500"
            />
            <span className="text-sm font-medium text-slate-700">Başlık Üstü Rozet</span>
          </label>
          {header.badge?.enabled && (
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                value={header.badge?.text ?? ''}
                onChange={(e) => updateHeaderBadge({ text: e.target.value })}
                placeholder="Rozet metni"
                className="px-3 py-2 border border-slate-200 rounded-lg text-sm"
              />
              <div className="flex gap-2">
                <input
                  type="color"
                  value={header.badge?.backgroundColor ?? '#059669'}
                  onChange={(e) => updateHeaderBadge({ backgroundColor: e.target.value })}
                  className="w-10 h-9 rounded border border-slate-200"
                />
                <input
                  type="color"
                  value={header.badge?.textColor ?? '#ffffff'}
                  onChange={(e) => updateHeaderBadge({ textColor: e.target.value })}
                  className="w-10 h-9 rounded border border-slate-200"
                />
              </div>
            </div>
          )}
        </div>

        {/* Title */}
        <div className="mb-4">
          <label className="block text-xs font-medium text-slate-600 mb-1.5">Başlık</label>
          <input
            type="text"
            value={header.title ?? ''}
            onChange={(e) => updateHeader({ title: e.target.value })}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-sage-500 focus:border-transparent"
          />
        </div>

        {/* Subtitle */}
        <div className="mb-4">
          <label className="block text-xs font-medium text-slate-600 mb-1.5">Alt Başlık</label>
          <input
            type="text"
            value={header.subtitle ?? ''}
            onChange={(e) => updateHeader({ subtitle: e.target.value })}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-sage-500 focus:border-transparent"
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block text-xs font-medium text-slate-600 mb-1.5">Açıklama</label>
          <textarea
            value={header.description ?? ''}
            onChange={(e) => updateHeader({ description: e.target.value })}
            rows={2}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-sage-500 focus:border-transparent"
          />
        </div>

        {/* Alignment */}
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1.5">Hizalama</label>
          <div className="flex gap-2">
            {[
              { id: 'left', label: 'Sol', icon: '⬅️' },
              { id: 'center', label: 'Orta', icon: '↔️' },
              { id: 'right', label: 'Sağ', icon: '➡️' }
            ].map(align => (
              <button
                key={align.id}
                onClick={() => updateHeader({ alignment: align.id as 'left' | 'center' | 'right' })}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                  header.alignment === align.id
                    ? 'bg-sage-500 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {align.icon} {align.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Typography */}
      <div className="bg-white rounded-xl p-4 border border-slate-200">
        <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
          <span className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">🔤</span>
          Tipografi
        </h3>

        <div className="grid grid-cols-2 gap-4">
          {/* Title Typography */}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Başlık Boyutu</label>
            <input
              type="text"
              value={header.titleFontSize ?? '2.5rem'}
              onChange={(e) => updateHeader({ titleFontSize: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Başlık Rengi</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={header.titleColor ?? '#1e293b'}
                onChange={(e) => updateHeader({ titleColor: e.target.value })}
                className="w-10 h-9 rounded border border-slate-200"
              />
              <input
                type="text"
                value={header.titleColor ?? '#1e293b'}
                onChange={(e) => updateHeader({ titleColor: e.target.value })}
                className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm"
              />
            </div>
          </div>

          {/* Subtitle Typography */}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Alt Başlık Boyutu</label>
            <input
              type="text"
              value={header.subtitleFontSize ?? '1.125rem'}
              onChange={(e) => updateHeader({ subtitleFontSize: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Alt Başlık Rengi</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={header.subtitleColor ?? '#64748b'}
                onChange={(e) => updateHeader({ subtitleColor: e.target.value })}
                className="w-10 h-9 rounded border border-slate-200"
              />
              <input
                type="text"
                value={header.subtitleColor ?? '#64748b'}
                onChange={(e) => updateHeader({ subtitleColor: e.target.value })}
                className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Billing Toggle */}
      <div className="bg-white rounded-xl p-4 border border-slate-200">
        <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
          <span className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">🔄</span>
          Fatura Dönemi Seçici
        </h3>

        <label className="flex items-center gap-2 mb-4">
          <input
            type="checkbox"
            checked={content.billingToggle?.enabled ?? false}
            onChange={(e) => updateBillingToggle({ enabled: e.target.checked })}
            className="rounded border-slate-300 text-sage-500 focus:ring-sage-500"
          />
          <span className="text-sm font-medium text-slate-700">Aylık/Yıllık Geçişi Göster</span>
        </label>

        {content.billingToggle?.enabled && (
          <div className="space-y-4 p-3 bg-slate-50 rounded-lg">
            {/* Labels */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Aylık Etiket</label>
                <input
                  type="text"
                  value={content.billingToggle?.monthlyLabel ?? 'Aylık'}
                  onChange={(e) => updateBillingToggle({ monthlyLabel: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Yıllık Etiket</label>
                <input
                  type="text"
                  value={content.billingToggle?.yearlyLabel ?? 'Yıllık'}
                  onChange={(e) => updateBillingToggle({ yearlyLabel: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Tasarruf Rozeti</label>
                <input
                  type="text"
                  value={content.billingToggle?.yearlySavings ?? ''}
                  onChange={(e) => updateBillingToggle({ yearlySavings: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  placeholder="%20 Tasarruf"
                />
              </div>
            </div>

            {/* Style */}
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Stil</label>
              <div className="flex gap-2">
                {['pills', 'toggle', 'tabs', 'buttons'].map(style => (
                  <button
                    key={style}
                    onClick={() => updateBillingToggle({ style: style as 'pills' | 'toggle' | 'tabs' | 'buttons' })}
                    className={`flex-1 py-2 rounded-lg text-xs font-medium capitalize ${
                      content.billingToggle?.style === style
                        ? 'bg-sage-500 text-white'
                        : 'bg-white text-slate-600 border border-slate-200'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div className="grid grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Arkaplan</label>
                <input
                  type="color"
                  value={content.billingToggle?.backgroundColor ?? '#f1f5f9'}
                  onChange={(e) => updateBillingToggle({ backgroundColor: e.target.value })}
                  className="w-full h-9 rounded border border-slate-200"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Aktif Arkaplan</label>
                <input
                  type="color"
                  value={content.billingToggle?.activeBackgroundColor ?? '#059669'}
                  onChange={(e) => updateBillingToggle({ activeBackgroundColor: e.target.value })}
                  className="w-full h-9 rounded border border-slate-200"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Metin Rengi</label>
                <input
                  type="color"
                  value={content.billingToggle?.textColor ?? '#64748b'}
                  onChange={(e) => updateBillingToggle({ textColor: e.target.value })}
                  className="w-full h-9 rounded border border-slate-200"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Aktif Metin</label>
                <input
                  type="color"
                  value={content.billingToggle?.activeTextColor ?? '#059669'}
                  onChange={(e) => updateBillingToggle({ activeTextColor: e.target.value })}
                  className="w-full h-9 rounded border border-slate-200"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Trust Element */}
      <div className="bg-white rounded-xl p-4 border border-slate-200">
        <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
          <span className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center text-green-600">🛡️</span>
          Güven Elementi
        </h3>

        <label className="flex items-center gap-2 mb-4">
          <input
            type="checkbox"
            checked={content.trustElement?.enabled ?? false}
            onChange={(e) => updateTrustElement({ enabled: e.target.checked })}
            className="rounded border-slate-300 text-sage-500 focus:ring-sage-500"
          />
          <span className="text-sm font-medium text-slate-700">Güven Elementi Göster</span>
        </label>

        {content.trustElement?.enabled && (
          <div className="space-y-3 p-3 bg-slate-50 rounded-lg">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Tip</label>
              <select
                value={content.trustElement?.type ?? 'money-back'}
                onChange={(e) => updateTrustElement({ type: e.target.value as 'money-back' | 'free-trial' | 'custom' })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              >
                <option value="money-back">Para İade Garantisi</option>
                <option value="free-trial">Ücretsiz Deneme</option>
                <option value="custom">Özel</option>
              </select>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Metin</label>
                <input
                  type="text"
                  value={content.trustElement?.text ?? ''}
                  onChange={(e) => updateTrustElement({ text: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">İkon</label>
                <input
                  type="text"
                  value={content.trustElement?.icon ?? '🛡️'}
                  onChange={(e) => updateTrustElement({ icon: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-center"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Konum</label>
              <select
                value={content.trustElement?.position ?? 'below-packages'}
                onChange={(e) => updateTrustElement({ position: e.target.value as 'above-packages' | 'below-packages' | 'in-footer' })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              >
                <option value="above-packages">Paketlerin Üstünde</option>
                <option value="below-packages">Paketlerin Altında</option>
                <option value="in-footer">Footer'da</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Footer CTA */}
      <div className="bg-white rounded-xl p-4 border border-slate-200">
        <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
          <span className="w-6 h-6 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600">📢</span>
          Alt CTA Bölümü
        </h3>

        <label className="flex items-center gap-2 mb-4">
          <input
            type="checkbox"
            checked={content.footerCta?.enabled ?? false}
            onChange={(e) => updateFooterCta({ enabled: e.target.checked })}
            className="rounded border-slate-300 text-sage-500 focus:ring-sage-500"
          />
          <span className="text-sm font-medium text-slate-700">Alt CTA Göster</span>
        </label>

        {content.footerCta?.enabled && (
          <div className="space-y-3 p-3 bg-slate-50 rounded-lg">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Metin</label>
              <input
                type="text"
                value={content.footerCta?.text ?? ''}
                onChange={(e) => updateFooterCta({ text: e.target.value })}
                placeholder="Sorularınız mı var?"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Alt Metin</label>
              <input
                type="text"
                value={content.footerCta?.subtext ?? ''}
                onChange={(e) => updateFooterCta({ subtext: e.target.value })}
                placeholder="Bizimle iletişime geçin"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Buton Metni</label>
                <input
                  type="text"
                  value={content.footerCta?.buttonText ?? ''}
                  onChange={(e) => updateFooterCta({ buttonText: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Buton Linki</label>
                <input
                  type="text"
                  value={content.footerCta?.buttonLink ?? ''}
                  onChange={(e) => updateFooterCta({ buttonLink: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
