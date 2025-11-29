import { HeroContent } from '../../types'

interface LayoutTabProps {
  content: HeroContent
  updateContent: (u: Partial<HeroContent>) => void
}

export default function LayoutTab({ content, updateContent }: LayoutTabProps) {
  const layouts = [
    { id: 'full-width', label: 'Tam Genişlik', icon: '⬜', desc: 'Görsel arkaplanda, içerik üstte' },
    { id: 'split-left', label: 'Bölünmüş Sol', icon: '◧', desc: 'Görsel solda, içerik sağda' },
    { id: 'split-right', label: 'Bölünmüş Sağ', icon: '◨', desc: 'İçerik solda, görsel sağda' },
    { id: 'centered', label: 'Ortalanmış', icon: '◫', desc: 'İçerik ve görsel ortada' },
    { id: 'overlay', label: 'Üst Üste', icon: '▣', desc: 'Görsel arkaplanda, içerik önde' },
    { id: 'minimal', label: 'Minimal', icon: '▢', desc: 'Sadece içerik, görsel yok' },
  ]

  return (
    <div className="space-y-6">
      {/* Layout Selection */}
      <div className="p-4 bg-white rounded-xl border border-slate-200">
        <h3 className="font-semibold text-slate-800 mb-4">Hero Düzeni</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {layouts.map(layout => (
            <button
              key={layout.id}
              onClick={() => updateContent({ layout: layout.id as any })}
              className={`p-4 rounded-xl border-2 transition-all text-left ${
                content.layout === layout.id
                  ? 'border-sage-500 bg-sage-50'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="text-3xl mb-2">{layout.icon}</div>
              <div className="font-medium text-sm text-slate-800">{layout.label}</div>
              <div className="text-xs text-slate-500 mt-1">{layout.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Alignment */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-white rounded-xl border border-slate-200">
          <label className="block text-sm font-semibold text-slate-700 mb-3">İçerik Hizalama</label>
          <div className="flex gap-2">
            {[
              { value: 'left', label: 'Sol', icon: '◀' },
              { value: 'center', label: 'Orta', icon: '◆' },
              { value: 'right', label: 'Sağ', icon: '▶' },
            ].map(opt => (
              <button
                key={opt.value}
                onClick={() => updateContent({ contentAlignment: opt.value as any })}
                className={`flex-1 py-3 rounded-lg border transition-all ${
                  content.contentAlignment === opt.value
                    ? 'border-sage-500 bg-sage-50 text-sage-700'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="text-xl mb-1">{opt.icon}</div>
                <div className="text-xs font-medium">{opt.label}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200">
          <label className="block text-sm font-semibold text-slate-700 mb-3">Dikey Hizalama</label>
          <div className="flex gap-2">
            {[
              { value: 'top', label: 'Üst', icon: '▲' },
              { value: 'center', label: 'Orta', icon: '◆' },
              { value: 'bottom', label: 'Alt', icon: '▼' },
            ].map(opt => (
              <button
                key={opt.value}
                onClick={() => updateContent({ verticalAlignment: opt.value as any })}
                className={`flex-1 py-3 rounded-lg border transition-all ${
                  content.verticalAlignment === opt.value
                    ? 'border-sage-500 bg-sage-50 text-sage-700'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="text-xl mb-1">{opt.icon}</div>
                <div className="text-xs font-medium">{opt.label}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Size Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-white rounded-xl border border-slate-200">
          <label className="block text-sm font-semibold text-slate-700 mb-3">Minimum Yükseklik</label>
          <select
            value={content.minHeight || '600px'}
            onChange={(e) => updateContent({ minHeight: e.target.value })}
            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent"
          >
            <option value="400px">Küçük (400px)</option>
            <option value="500px">Orta (500px)</option>
            <option value="600px">Büyük (600px)</option>
            <option value="700px">Çok Büyük (700px)</option>
            <option value="100vh">Tam Ekran</option>
            <option value="80vh">Ekranın %80'i</option>
          </select>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200">
          <label className="block text-sm font-semibold text-slate-700 mb-3">Maksimum Genişlik</label>
          <select
            value={content.maxWidth || '1400px'}
            onChange={(e) => updateContent({ maxWidth: e.target.value })}
            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent"
          >
            <option value="1200px">Dar (1200px)</option>
            <option value="1400px">Normal (1400px)</option>
            <option value="1600px">Geniş (1600px)</option>
            <option value="100%">Tam Genişlik</option>
          </select>
        </div>
      </div>

      {/* Padding */}
      <div className="p-4 bg-white rounded-xl border border-slate-200">
        <label className="block text-sm font-semibold text-slate-700 mb-3">İç Boşluklar</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {(['top', 'bottom', 'left', 'right'] as const).map(side => (
            <div key={side}>
              <label className="block text-xs text-slate-500 mb-1 capitalize">
                {side === 'top' ? 'Üst' : side === 'bottom' ? 'Alt' : side === 'left' ? 'Sol' : 'Sağ'}
              </label>
              <select
                value={content.padding?.[side] || '24px'}
                onChange={(e) => updateContent({ padding: { ...content.padding, [side]: e.target.value } })}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-sage-500"
              >
                <option value="0px">0</option>
                <option value="16px">16px</option>
                <option value="24px">24px</option>
                <option value="32px">32px</option>
                <option value="48px">48px</option>
                <option value="64px">64px</option>
                <option value="80px">80px</option>
                <option value="100px">100px</option>
              </select>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
