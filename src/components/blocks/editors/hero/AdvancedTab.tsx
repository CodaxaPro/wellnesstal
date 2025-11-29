import { HeroContent } from '../../types'
import { getDefaultContent } from './defaults'

interface AdvancedTabProps {
  content: HeroContent
  updateContent: (u: Partial<HeroContent>) => void
  updateNestedContent: (key: keyof HeroContent, nestedKey: string, value: any) => void
}

export default function AdvancedTab({
  content,
  updateContent,
  updateNestedContent
}: AdvancedTabProps) {
  return (
    <div className="space-y-6">
      {/* Animations */}
      <div className="p-4 bg-white rounded-xl border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <label className="text-sm font-semibold text-slate-700">Animasyonlar</label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={content.animations?.enabled ?? true}
              onChange={(e) => updateContent({ animations: { ...content.animations, enabled: e.target.checked } })}
              className="rounded border-slate-300 text-sage-500 focus:ring-sage-500"
            />
            <span className="text-xs text-slate-500">Aktif</span>
          </label>
        </div>

        {content.animations?.enabled && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs text-slate-500 mb-1">Başlık</label>
                <select
                  value={content.animations?.titleAnimation || 'slide-up'}
                  onChange={(e) => updateNestedContent('animations', 'titleAnimation', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
                >
                  <option value="none">Yok</option>
                  <option value="fade">Fade</option>
                  <option value="slide-up">Aşağıdan Yukarı</option>
                  <option value="slide-down">Yukarıdan Aşağı</option>
                  <option value="zoom">Zoom</option>
                  <option value="typewriter">Daktilo</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Alt Başlık</label>
                <select
                  value={content.animations?.subtitleAnimation || 'fade'}
                  onChange={(e) => updateNestedContent('animations', 'subtitleAnimation', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
                >
                  <option value="none">Yok</option>
                  <option value="fade">Fade</option>
                  <option value="slide-up">Aşağıdan Yukarı</option>
                  <option value="slide-down">Yukarıdan Aşağı</option>
                  <option value="zoom">Zoom</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Görsel</label>
                <select
                  value={content.animations?.imageAnimation || 'fade'}
                  onChange={(e) => updateNestedContent('animations', 'imageAnimation', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
                >
                  <option value="none">Yok</option>
                  <option value="fade">Fade</option>
                  <option value="slide-left">Soldan</option>
                  <option value="slide-right">Sağdan</option>
                  <option value="zoom">Zoom</option>
                  <option value="parallax">Parallax</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Butonlar</label>
                <select
                  value={content.animations?.buttonAnimation || 'slide-up'}
                  onChange={(e) => updateNestedContent('animations', 'buttonAnimation', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
                >
                  <option value="none">Yok</option>
                  <option value="fade">Fade</option>
                  <option value="slide-up">Aşağıdan Yukarı</option>
                  <option value="bounce">Zıplama</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-500 mb-1">Gecikme (ms): {content.animations?.staggerDelay || 100}</label>
                <input
                  type="range"
                  min="0"
                  max="500"
                  step="50"
                  value={content.animations?.staggerDelay || 100}
                  onChange={(e) => updateNestedContent('animations', 'staggerDelay', parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sage-500"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Süre (ms): {content.animations?.duration || 600}</label>
                <input
                  type="range"
                  min="200"
                  max="1500"
                  step="100"
                  value={content.animations?.duration || 600}
                  onChange={(e) => updateNestedContent('animations', 'duration', parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sage-500"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Responsive Settings */}
      <div className="p-4 bg-white rounded-xl border border-slate-200">
        <label className="block text-sm font-semibold text-slate-700 mb-4">Responsive Ayarları</label>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Mobile */}
          <div className="p-3 bg-slate-50 rounded-lg">
            <h4 className="text-xs font-semibold text-slate-600 mb-3 flex items-center gap-2">
              <span>📱</span> Mobil
            </h4>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-slate-500 mb-1">Düzen</label>
                <select
                  value={content.responsive?.mobileLayout || 'stacked'}
                  onChange={(e) => updateNestedContent('responsive', 'mobileLayout', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
                >
                  <option value="stacked">Üst Üste</option>
                  <option value="overlay">Overlay</option>
                  <option value="image-only">Sadece Görsel</option>
                  <option value="content-only">Sadece İçerik</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Metin Hizalama</label>
                <select
                  value={content.responsive?.mobileTextAlign || 'center'}
                  onChange={(e) => updateNestedContent('responsive', 'mobileTextAlign', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
                >
                  <option value="left">Sol</option>
                  <option value="center">Orta</option>
                  <option value="right">Sağ</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Görsel Konumu</label>
                <select
                  value={content.responsive?.mobileImagePosition || 'top'}
                  onChange={(e) => updateNestedContent('responsive', 'mobileImagePosition', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
                >
                  <option value="top">Üstte</option>
                  <option value="bottom">Altta</option>
                  <option value="hidden">Gizle</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Min. Yükseklik</label>
                <select
                  value={content.responsive?.mobileMinHeight || '500px'}
                  onChange={(e) => updateNestedContent('responsive', 'mobileMinHeight', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
                >
                  <option value="400px">400px</option>
                  <option value="500px">500px</option>
                  <option value="600px">600px</option>
                  <option value="100vh">Tam Ekran</option>
                </select>
              </div>
            </div>
          </div>

          {/* Tablet */}
          <div className="p-3 bg-slate-50 rounded-lg">
            <h4 className="text-xs font-semibold text-slate-600 mb-3 flex items-center gap-2">
              <span>📱</span> Tablet
            </h4>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-slate-500 mb-1">Düzen</label>
                <select
                  value={content.responsive?.tabletLayout || 'stacked'}
                  onChange={(e) => updateNestedContent('responsive', 'tabletLayout', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
                >
                  <option value="split">Bölünmüş</option>
                  <option value="stacked">Üst Üste</option>
                  <option value="overlay">Overlay</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Presets */}
      <div className="p-4 bg-white rounded-xl border border-slate-200">
        <label className="block text-sm font-semibold text-slate-700 mb-4">Hazır Şablonlar</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Modern', preset: { layout: 'split-right', backgroundType: 'solid', backgroundColor: '#f8fafc' } },
            { label: 'Gradient', preset: { layout: 'full-width', backgroundType: 'gradient', gradientColors: { from: '#10b981', to: '#3b82f6', direction: 'to-br' } } },
            { label: 'Minimal', preset: { layout: 'minimal', backgroundType: 'solid', backgroundColor: '#ffffff' } },
            { label: 'Bold', preset: { layout: 'overlay', backgroundType: 'solid', backgroundColor: '#1e293b' } },
          ].map((item, index) => (
            <button
              key={index}
              onClick={() => updateContent(item.preset as any)}
              className="p-4 rounded-xl border border-slate-200 hover:border-sage-500 hover:bg-sage-50 transition-all text-center"
            >
              <div className="text-sm font-medium text-slate-700">{item.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Reset All */}
      <div className="p-4 bg-red-50 rounded-xl border border-red-200">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-red-700">Tümünü Sıfırla</h4>
            <p className="text-sm text-red-600">Tüm ayarları varsayılana döndür</p>
          </div>
          <button
            onClick={() => {
              if (confirm('Tüm ayarları sıfırlamak istediğinizden emin misiniz?')) {
                updateContent(getDefaultContent())
              }
            }}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
          >
            Sıfırla
          </button>
        </div>
      </div>
    </div>
  )
}
