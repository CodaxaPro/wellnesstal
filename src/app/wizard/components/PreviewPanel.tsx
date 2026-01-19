'use client';

import { useRouter } from 'next/navigation';

import { useWizardStore } from '../store/useWizardStore';
import { getVariantComponent } from '../templates/variantRegistry';

export default function PreviewPanel() {
  const router = useRouter();
  const { mode, category, theme, customization, setStep, reset } = useWizardStore();

  const handleBack = () => {
    setStep('customize');
  };

  // ✅ CREATE SITE - CONTENT EKLENDİ
  const handleCreate = () => {
    const siteId = `site-${Date.now()}`;
    
    const wizardData = {
      siteId,
      mode,
      category,
      theme,
      customization,
      
      // ✅ CONTENT EKLENDI - Editor'da düzenlenebilir
      content: {
        businessName: 'Your Business',
        hero: {
          title: 'Welcome to Your Business',
          subtitle: 'Premium services designed for you',
          ctaText: 'Get Started'
        },
        features: {
          title: 'Why Choose Us',
          subtitle: 'Discover what makes us different'
        },
        services: {
          title: 'Our Services',
          subtitle: 'Choose the perfect package for you'
        },
        cta: {
          title: 'Ready to Get Started?',
          subtitle: 'Join thousands of satisfied customers',
          ctaText: 'Book Appointment'
        },
        footer: {
          phone: '+1 (555) 123-4567',
          email: 'info@yourbusiness.com',
          address: '123 Main St, City, State 12345'
        },
        header: {
          ctaText: 'Book Now'
        }
      },
      
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Save to localStorage
    localStorage.setItem('wizardData', JSON.stringify(wizardData));
    
    console.log('✅ Creating page with:', wizardData);
    
    // Redirect to editor
    router.push(`/editor/${siteId}`);
  };

  const handleRestart = () => {
    if (confirm('Baştan başlamak istiyor musunuz?')) {
      reset();
    }
  };

  // Get selected components
  const HeaderComponent = getVariantComponent('headers', customization.header || 'classic');
  const HeroComponent = getVariantComponent('heroes', customization.hero || 'split');
  const FeaturesComponent = getVariantComponent('features', customization.features || 'grid-3');
  const ServicesComponent = getVariantComponent('services', customization.services || 'cards');
  const CTAComponent = getVariantComponent('cta', customization.cta || 'simple');
  const FooterComponent = getVariantComponent('footers', customization.footer || '4-col');

  // Theme colors
  const themeColors: any = {
    'headspa-purple': '#9333ea',
    'headspa-blue': '#3b82f6',
    'headspa-green': '#10b981',
    'headspa-pink': '#ec4899',
    'headspa-dark': '#1f2937',
    'headspa-teal': '#14b8a6',
    'headspa-amber': '#f59e0b',
    'headspa-indigo': '#6366f1',
    'headspa-rose': '#f43f5e',
    'headspa-emerald': '#059669',
  };

  const primaryColor = themeColors[theme || 'headspa-purple'];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">
          👁️ Canlı Önizleme
        </h2>
        <p className="text-gray-600">
          Sayfanızın tam görünümü
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Basic Info */}
        <div className="bg-white rounded-xl p-6 shadow-md">
          <h3 className="text-xl font-bold mb-4">📋 Temel Bilgiler</h3>
          <div className="space-y-3">
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-600">Mod:</span>
              <strong>{mode === 'ai' ? '🤖 AI Sihiri' : '🎨 Manuel'}</strong>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-600">Kategori:</span>
              <strong className="capitalize">{category}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tema:</span>
              <strong>{theme}</strong>
            </div>
          </div>
        </div>

        {/* Components */}
        <div className="bg-white rounded-xl p-6 shadow-md">
          <h3 className="text-xl font-bold mb-4">🧩 Seçilen Component'ler</h3>
          <div className="space-y-2 text-sm">
            {Object.entries(customization).map(([key, value]) => (
              <div key={key} className="flex justify-between border-b pb-2">
                <span className="text-gray-600 capitalize">{key}:</span>
                <strong>{value as string}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Live Preview */}
      <div className="bg-white rounded-xl shadow-2xl overflow-hidden mb-8">
        <div className="bg-gray-100 p-4 border-b">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <div className="ml-4 text-sm text-gray-600">
              🌐 preview.yourbusiness.com
            </div>
          </div>
        </div>

        <div className="bg-white">
          {/* Header */}
          {HeaderComponent && (
            <HeaderComponent 
              businessName="Your Business"
              ctaText="Book Now"
              primaryColor={primaryColor}
            />
          )}

          {/* Hero */}
          {HeroComponent && (
            <HeroComponent 
              title="Welcome to Your Business"
              subtitle="Premium services designed for you"
              ctaText="Get Started"
              primaryColor={primaryColor}
            />
          )}

          {/* Features */}
          {FeaturesComponent && (
            <FeaturesComponent 
              title="Why Choose Us"
              subtitle="Discover what makes us different"
              primaryColor={primaryColor}
            />
          )}

          {/* Services */}
          {ServicesComponent && (
            <ServicesComponent 
              title="Our Services"
              subtitle="Choose the perfect package for you"
              primaryColor={primaryColor}
            />
          )}

          {/* CTA */}
          {CTAComponent && (
            <CTAComponent 
              title="Ready to Get Started?"
              subtitle="Join thousands of satisfied customers"
              ctaText="Book Appointment"
              primaryColor={primaryColor}
            />
          )}

          {/* Footer */}
          {FooterComponent && (
            <FooterComponent 
              businessName="Your Business"
              phone="+1 (555) 123-4567"
              email="info@yourbusiness.com"
              address="123 Main St, City, State 12345"
              primaryColor={primaryColor}
            />
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button 
          onClick={handleBack}
          className="bg-gray-200 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300"
        >
          ← Geri
        </button>

        <button 
          onClick={handleRestart}
          className="text-gray-500 hover:text-gray-700 underline"
        >
          Baştan Başla
        </button>
        
        <button 
          onClick={handleCreate}
          className="bg-green-600 text-white px-12 py-4 rounded-lg font-bold text-lg hover:bg-green-700 shadow-lg"
        >
          ✓ Sayfayı Oluştur
        </button>
      </div>
    </div>
  );
}