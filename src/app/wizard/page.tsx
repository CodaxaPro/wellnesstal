'use client';

import { useWizardStore } from './store/useWizardStore';  // ✅ ../ yerine ./
import WizardProgress from './components/WizardProgress';
import CategorySelector from './components/CategorySelector';
import ThemeSelector from './components/ThemeSelector';
import ComponentCustomizer from './components/ComponentCustomizer';
import PreviewPanel from './components/PreviewPanel';

export default function WizardPage() {
  const { mode, currentStep, setMode } = useWizardStore();

  const handleSelectMode = (selectedMode: 'ai' | 'manual') => {
    setMode(selectedMode);
  };

  // Preview
  if (currentStep === 'preview') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-8">
        <WizardProgress />
        <PreviewPanel />
      </div>
    );
  }

  // Customize
  if (currentStep === 'customize') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-8">
        <WizardProgress />
        <ComponentCustomizer />
      </div>
    );
  }

  // Theme selection
  if (currentStep === 'theme') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-8">
        <WizardProgress />
        <ThemeSelector />
      </div>
    );
  }

  // Category selection
  if (currentStep === 'category') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-8">
        <WizardProgress />
        <CategorySelector />
      </div>
    );
  }

  // Mode selection (ilk adım)
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🎯 Landing Page Wizard
          </h1>
          <p className="text-xl text-gray-600">
            5 dakikada profesyonel sayfa oluşturun
          </p>
        </div>

        {/* Mode Selection */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* AI Mode */}
          <button
            onClick={() => handleSelectMode('ai')}
            className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all cursor-pointer border-2 border-transparent hover:border-purple-500 text-left"
          >
            <div className="text-6xl mb-4">🤖</div>
            <h2 className="text-2xl font-bold mb-3">AI Sihiri</h2>
            <div className="space-y-2 text-gray-600 mb-6">
              <p>✓ 5 soru</p>
              <p>✓ 2 dakika</p>
              <p>✓ Otomatik içerik</p>
            </div>
            <div className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors text-center">
              Başla
            </div>
          </button>

          {/* Manual Mode */}
          <button
            onClick={() => handleSelectMode('manual')}
            className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all cursor-pointer border-2 border-transparent hover:border-blue-500 text-left"
          >
            <div className="text-6xl mb-4">🎨</div>
            <h2 className="text-2xl font-bold mb-3">Manuel</h2>
            <div className="space-y-2 text-gray-600 mb-6">
              <p>✓ Adım adım</p>
              <p>✓ 5 dakika</p>
              <p>✓ Tam kontrol</p>
            </div>
            <div className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center">
              Başla
            </div>
          </button>
        </div>

        {/* Info */}
        <div className="mt-8 text-center text-sm text-gray-500">
          💡 Yeni başlayanlar için AI Sihiri önerilir
        </div>
      </div>
    </div>
  );
}