'use client';

import { useWizardStore } from '../store/useWizardStore';

const themes = [
  { id: 'headspa-purple', name: 'Purple', color: 'bg-purple-500', preview: '🟣' },
  { id: 'headspa-blue', name: 'Blue', color: 'bg-blue-500', preview: '🔵' },
  { id: 'headspa-green', name: 'Green', color: 'bg-green-500', preview: '🟢' },
  { id: 'headspa-pink', name: 'Pink', color: 'bg-pink-500', preview: '🌸' },
  { id: 'headspa-dark', name: 'Dark', color: 'bg-gray-900', preview: '⚫' },
  { id: 'headspa-teal', name: 'Teal', color: 'bg-teal-500', preview: '🌊' },
  { id: 'headspa-amber', name: 'Amber', color: 'bg-amber-500', preview: '☀️' },
  { id: 'headspa-indigo', name: 'Indigo', color: 'bg-indigo-500', preview: '💜' },
  { id: 'headspa-rose', name: 'Rose', color: 'bg-rose-500', preview: '🌹' },
  { id: 'headspa-emerald', name: 'Emerald', color: 'bg-emerald-500', preview: '💚' },
];

export default function ThemeSelector() {
  const { category, theme, setTheme, setStep } = useWizardStore();

  const handleSelect = (themeId: string) => {
    setTheme(themeId);
    console.log('Selected theme:', themeId);
  };

  const handleBack = () => {
    setStep('category');
  };

  const handleNext = () => {
    setStep('customize');
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">
          🎨 Renk Teması Seçin
        </h2>
        <p className="text-gray-600">
          {category} → Headspa Template (10 renk)
        </p>
      </div>

      <div className="grid md:grid-cols-5 gap-6">
        {themes.map((t) => (
          <button
            key={t.id}
            onClick={() => handleSelect(t.id)}
            className={`
              bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all
              border-2
              ${theme === t.id 
                ? 'border-purple-500 ring-4 ring-purple-200' 
                : 'border-transparent hover:border-gray-300'
              }
            `}
          >
            <div className="text-6xl mb-3">{t.preview}</div>
            <div className={`h-16 ${t.color} rounded-lg mb-3`}></div>
            <h3 className="font-bold text-lg">{t.name}</h3>
            
            {theme === t.id && (
              <div className="mt-2 text-purple-600 font-semibold text-sm">
                ✓ Seçildi
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Debug */}
      {theme && (
        <div className="mt-8 p-4 bg-green-100 rounded-lg text-center">
          ✅ Seçilen tema: <strong>{theme}</strong>
        </div>
      )}

      {/* Navigation */}
      <div className="mt-8 flex justify-between">
        <button 
          onClick={handleBack}
          className="bg-gray-200 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300"
        >
          ← Geri
        </button>
        
        {theme && (
          <button 
            onClick={handleNext}
            className="bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700"
          >
            Devam Et →
          </button>
        )}
      </div>
    </div>
  );
}