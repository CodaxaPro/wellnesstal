'use client';

import { useEffect } from 'react';

import { useWizardStore } from '../store/useWizardStore';

const componentVariants = {
  header: [
    { id: 'classic', name: 'Classic', icon: '📋' },
    { id: 'modern', name: 'Modern', icon: '✨' },
    { id: 'minimal', name: 'Minimal', icon: '▫️' },
  ],
  hero: [
    { id: 'split', name: 'Split', icon: '⬌' },
    { id: 'centered', name: 'Centered', icon: '⊙' },
    { id: 'fullbg', name: 'Full BG', icon: '🖼️' },
  ],
  features: [
    { id: 'grid-3', name: 'Grid 3', icon: '▦' },
  ],
  services: [
    { id: 'cards', name: 'Cards', icon: '🎴' },
  ],
  cta: [
    { id: 'simple', name: 'Simple', icon: '➤' },
  ],
  footer: [
    { id: '4-col', name: '4 Column', icon: '▦▦▦▦' },
    { id: '3-col', name: '3 Column', icon: '▦▦▦' },
  ],
};

export default function ComponentCustomizer() {
  const { category, theme, customization, setCustomization, setStep } = useWizardStore();

  // ✅ useEffect içinde defaults'ı yükle (render sırasında değil)
  useEffect(() => {
    if (Object.keys(customization).length === 0) {
      console.log('🎯 LOADING DEFAULTS...');
      setCustomization('header', 'classic');
      setCustomization('hero', 'split');
      setCustomization('features', 'grid-3');
      setCustomization('services', 'cards');
      setCustomization('cta', 'simple');
      setCustomization('footer', '4-col');
    }
  }, []); // Sadece mount'ta çalış

  const handleSelect = (section: string, variantId: string) => {
    console.log('🎨 Selected:', section, '=', variantId);
    setCustomization(section, variantId);
  };

  const handleBack = () => {
    setStep('theme');
  };

  const handleNext = () => {
    console.log('📦 Final customization:', customization);
    setStep('preview');
  };

  // Store'dan selections'ı al
  const selections = {
    header: customization.header || 'classic',
    hero: customization.hero || 'split',
    features: customization.features || 'grid-3',
    services: customization.services || 'cards',
    cta: customization.cta || 'simple',
    footer: customization.footer || '4-col',
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">
          🔧 Component'leri Özelleştir
        </h2>
        <p className="text-gray-600">
          {category} → {theme} → Mix & Match
        </p>
      </div>

      <div className="space-y-8">
        {Object.entries(componentVariants).map(([section, variants]) => (
          <div key={section} className="bg-white rounded-xl p-6 shadow-md">
            <h3 className="text-xl font-bold mb-4 capitalize">
              {section === 'cta' ? 'CTA' : section}
            </h3>
            
            <div className="grid grid-cols-3 gap-4">
              {variants.map((variant) => (
                <button
                  key={variant.id}
                  onClick={() => handleSelect(section, variant.id)}
                  className={`
                    p-4 rounded-lg border-2 transition-all
                    ${selections[section as keyof typeof selections] === variant.id
                      ? 'border-purple-500 bg-purple-50 ring-2 ring-purple-200'
                      : 'border-gray-200 hover:border-purple-300'
                    }
                  `}
                >
                  <div className="text-3xl mb-2">{variant.icon}</div>
                  <div className="font-semibold text-sm">{variant.name}</div>
                  {selections[section as keyof typeof selections] === variant.id && (
                    <div className="text-purple-600 text-xs mt-1">✓ Seçildi</div>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-8 p-6 bg-green-50 rounded-xl">
        <h4 className="font-bold mb-3">📋 Seçimleriniz:</h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>Header: <strong>{selections.header}</strong></div>
          <div>Hero: <strong>{selections.hero}</strong></div>
          <div>Features: <strong>{selections.features}</strong></div>
          <div>Services: <strong>{selections.services}</strong></div>
          <div>CTA: <strong>{selections.cta}</strong></div>
          <div>Footer: <strong>{selections.footer}</strong></div>
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-8 flex justify-between">
        <button 
          onClick={handleBack}
          className="bg-gray-200 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300"
        >
          ← Geri
        </button>
        
        <button 
          onClick={handleNext}
          className="bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700"
        >
          Önizle →
        </button>
      </div>
    </div>
  );
}