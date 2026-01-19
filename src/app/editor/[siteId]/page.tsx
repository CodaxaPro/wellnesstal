// src/app/editor/[siteId]/page.tsx

'use client';

import { use, useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import toast from 'react-hot-toast';

import { getVariantComponent } from '@/app/wizard/templates/variantRegistry';

import EditableWrapper from './components/EditableWrapper';
import InlineEditor from './components/InlineEditor';
import { useAutoSave } from './hooks/useAutoSave';
import { useEditableClick } from './hooks/useEditableClick';
import { useContentStore } from './store/useContentStore';

interface EditorPageProps {
  params: Promise<{
    siteId: string;
  }>;
}

const getSectionKey = (type: string): string => {
  const mapping: Record<string, string> = {
    'header': 'headers',
    'hero': 'heroes',
    'features': 'features',
    'services': 'services',
    'cta': 'cta',
    'footer': 'footers',
  };
  return mapping[type] || `${type}s`;
};

export default function EditorPage({ params }: EditorPageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const siteId = resolvedParams.siteId;
  
  const [siteData, setSiteData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'preview' | 'settings'>('preview');
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
  
  const { content, isEditMode, setEditMode, loadFromWizard } = useContentStore();
  
  useEditableClick();

  // Load site data from database (with localStorage fallback)
  useEffect(() => {
    const loadSiteData = async () => {
      try {
        setIsLoading(true);
        
        // Try to load from database first
        const response = await fetch(`/api/editor/sites?siteId=${siteId}`);
        const result = await response.json();
        
        if (result.success && result.data) {
          // Load from database
          const dbData = result.data;
          setSiteData(dbData);
          console.log('📦 Loaded from database:', dbData);
          
          // Load content into store if available
          if (dbData.content) {
            loadFromWizard({
              ...dbData,
              content: dbData.content
            });
          } else {
            loadFromWizard(dbData);
          }
        } else {
          // Fallback to localStorage
          const localData = localStorage.getItem('wizardData');
          if (localData) {
            const parsedData = JSON.parse(localData);
            if (parsedData.siteId === siteId) {
              setSiteData(parsedData);
              console.log('📦 Loaded from localStorage:', parsedData);
              loadFromWizard(parsedData);
              
              // Save to database for future use
              try {
                await fetch('/api/editor/sites', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    siteId,
                    ...parsedData
                  })
                });
              } catch (e) {
                console.warn('Failed to migrate localStorage to database:', e);
              }
            } else {
              throw new Error('Site ID mismatch');
            }
          } else {
            throw new Error('No site data found');
          }
        }
      } catch (error) {
        console.error('Failed to load site data:', error);
        toast.error('Site verileri yüklenemedi');
      } finally {
        setIsLoading(false);
      }
    };

    loadSiteData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteId]);

  // Auto-save hook
  const { saveNow } = useAutoSave({
    siteId,
    siteData,
    enabled: !!siteData,
    debounceMs: 2000,
    onSaveSuccess: () => {
      setSaveStatus('saved');
    },
    onSaveError: (error) => {
      setSaveStatus('unsaved');
      console.error('Auto-save failed:', error);
    }
  });

  // Track save status
  useEffect(() => {
    if (siteData && content) {
      setSaveStatus('unsaved');
    }
  }, [content, siteData]);

  useEffect(() => {
    if (content.sections && content.sections.length > 0) {
      console.log('✅ Sections ready, setting isReady=true');
      setTimeout(() => setIsReady(true), 100);
    }
  }, [content.sections]);

  useEffect(() => {
    console.log('🏪 Store content:', content);
    console.log('📊 Sections count:', content.sections?.length);
    console.log('🎯 isReady:', isReady);
  }, [content, isReady]);

  if (isLoading || !siteData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

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

  const primaryColor = themeColors[siteData.theme || 'headspa-purple'];

  const handleSave = async () => {
    try {
      setSaveStatus('saving');
      const success = await saveNow();
      if (success) {
        toast.success('✅ Değişiklikler kaydedildi!');
        setSaveStatus('saved');
      } else {
        toast.error('❌ Kaydetme başarısız. Lütfen tekrar deneyin.');
        setSaveStatus('unsaved');
      }
    } catch (error) {
      console.error('Save error:', error);
      toast.error('❌ Kaydetme sırasında hata oluştu.');
      setSaveStatus('unsaved');
    }
  };

  return (
    <>
      <InlineEditor />
      
      <div className="min-h-screen bg-gray-100">
        {/* Top Bar */}
        <div className="bg-white border-b shadow-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => router.push('/wizard')}
                  className="text-gray-600 hover:text-gray-900 font-medium"
                >
                  ← Geri
                </button>
                <div className="border-l h-6 border-gray-300" />
                <h1 className="text-xl font-bold">Editor</h1>
                <span className="text-sm text-gray-500">#{siteId}</span>
              </div>

              {/* Tabs */}
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab('preview')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === 'preview'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  👁️ Preview
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === 'settings'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  ⚙️ Settings
                </button>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => setEditMode(!isEditMode)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    isEditMode 
                      ? 'bg-purple-600 text-white hover:bg-purple-700' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {isEditMode ? '✏️ Düzenleme Modu' : '👁️ Görüntüleme Modu'}
                </button>
                <button 
                  onClick={handleSave}
                  disabled={saveStatus === 'saving'}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    saveStatus === 'saving'
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : saveStatus === 'saved'
                      ? 'bg-green-500 text-white hover:bg-green-600'
                      : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  {saveStatus === 'saving' ? (
                    <>
                      <span className="animate-spin inline-block mr-2">⏳</span>
                      Kaydediliyor...
                    </>
                  ) : saveStatus === 'saved' ? (
                    '✅ Kaydedildi'
                  ) : (
                    '💾 Kaydet'
                  )}
                </button>
                <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium">
                  🚀 Yayınla
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Mode Banner */}
        {isEditMode && (
          <div className="bg-purple-600 text-white py-2 px-4 text-center text-sm font-medium">
            ✏️ Düzenleme Modu Aktif - Düzenlemek istediğiniz metne tıklayın
          </div>
        )}

        {/* Content */}
        {activeTab === 'preview' ? (
          <div className="p-8">
            <div className="max-w-7xl mx-auto">
              <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
                {/* Browser Mockup */}
                <div className="bg-gray-100 p-4 border-b">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <div className="ml-4 text-sm text-gray-600 flex-1 bg-white rounded px-3 py-1">
                      🌐 {siteId}.yourdomain.com
                    </div>
                  </div>
                </div>

                {/* Live Page Render */}
                <div className="bg-white" id="page-content">
                  {isReady && content.sections && content.sections.length > 0 ? (
                    content.sections
                      .filter(section => {
                        console.log('🎨 Rendering section:', section.type, section.variant);
                        return section.visible;
                      })
                      .sort((a, b) => a.order - b.order)
                      .map((section) => {
                        const sectionKey = getSectionKey(section.type);
                        console.log('🔑 Section key:', section.type, '→', sectionKey);
                        
                        const Component = getVariantComponent(
                          sectionKey,
                          section.variant
                        );

                        if (!Component) {
                          console.error('❌ Component not found:', sectionKey, section.variant);
                          return null;
                        }

                        console.log('✅ Component found:', sectionKey, section.variant);

                        switch (section.type) {
                          case 'header':
                            return (
                              <div 
                                key={`${section.id}-${JSON.stringify(section.content.ctaTextConfig)}`} 
                                style={{ position: 'relative' }}
                              >
                                <Component 
                                  businessName={content.businessName}
                                  ctaText={section.content.ctaText}
                                  primaryColor={primaryColor}
                                />
                                {isEditMode && (
                                  <>
                                    <EditableWrapper 
                                      path="businessName" 
                                      targetSelector="[data-editable-header-business]"
                                    />
                                    <EditableWrapper 
                                      path="header.ctaText" 
                                      targetSelector="[data-editable-header-cta]"
                                    />
                                  </>
                                )}
                              </div>
                            );

                          case 'hero':
                            console.log('🔍 Hero section.content:', section.content);
                            console.log('🔍 Hero title:', section.content.title);
                            console.log('🔍 Hero titleConfig:', section.content.titleConfig);
                            console.log('🔍 titleConfig.html:', section.content.titleConfig?.html);
                            
                            return (
                              <div 
                                key={`${section.id}-${JSON.stringify(section.content.titleConfig)}-${JSON.stringify(section.content.subtitleConfig)}-${JSON.stringify(section.content.ctaTextConfig)}-${JSON.stringify(section.content.imageConfig)}`} 
                                style={{ position: 'relative' }}
                              >
                                <Component 
                                  title={section.content.title}
                                  subtitle={section.content.subtitle}
                                  ctaText={section.content.ctaText}
                                  image={section.content.image}
                                  imageConfig={section.content.imageConfig}
                                  titleConfig={section.content.titleConfig}
                                  subtitleConfig={section.content.subtitleConfig}
                                  ctaTextConfig={section.content.ctaTextConfig}
                                  primaryColor={primaryColor}
                                />
                                {isEditMode && (
                                  <>
                                    <EditableWrapper 
                                      path="hero.title" 
                                      targetSelector="[data-editable-hero-title]" 
                                    />
                                    <EditableWrapper 
                                      path="hero.subtitle" 
                                      targetSelector="[data-editable-hero-subtitle]" 
                                    />
                                    <EditableWrapper 
                                      path="hero.ctaText" 
                                      targetSelector="[data-editable-hero-cta]" 
                                    />
                                    <EditableWrapper 
                                      path="hero.image" 
                                      targetSelector="[data-editable-hero-image]"
                                    />
                                  </>
                                )}
                              </div>
                            );

                          case 'features':
                            return (
                              <div 
                                key={`${section.id}-${JSON.stringify(section.content.titleConfig)}-${JSON.stringify(section.content.subtitleConfig)}`} 
                                style={{ position: 'relative' }}
                              >
                                <Component 
                                  title={section.content.title}
                                  subtitle={section.content.subtitle}
                                  primaryColor={primaryColor}
                                />
                                {isEditMode && (
                                  <>
                                    <EditableWrapper 
                                      path="features.title" 
                                      targetSelector="[data-editable-features-title]"
                                    />
                                    <EditableWrapper 
                                      path="features.subtitle" 
                                      targetSelector="[data-editable-features-subtitle]"
                                    />
                                  </>
                                )}
                              </div>
                            );

                          case 'services':
                            return (
                              <div 
                                key={`${section.id}-${JSON.stringify(section.content.titleConfig)}-${JSON.stringify(section.content.subtitleConfig)}`} 
                                style={{ position: 'relative' }}
                              >
                                <Component 
                                  title={section.content.title}
                                  subtitle={section.content.subtitle}
                                  primaryColor={primaryColor}
                                />
                                {isEditMode && (
                                  <>
                                    <EditableWrapper 
                                      path="services.title" 
                                      targetSelector="[data-editable-services-title]"
                                    />
                                    <EditableWrapper 
                                      path="services.subtitle" 
                                      targetSelector="[data-editable-services-subtitle]"
                                    />
                                  </>
                                )}
                              </div>
                            );

                          case 'cta':
                            return (
                              <div 
                                key={`${section.id}-${JSON.stringify(section.content.titleConfig)}-${JSON.stringify(section.content.subtitleConfig)}-${JSON.stringify(section.content.ctaTextConfig)}`} 
                                style={{ position: 'relative' }}
                              >
                                <Component 
                                  title={section.content.title}
                                  subtitle={section.content.subtitle}
                                  ctaText={section.content.ctaText}
                                  primaryColor={primaryColor}
                                />
                                {isEditMode && (
                                  <>
                                    <EditableWrapper 
                                      path="cta.title" 
                                      targetSelector="[data-editable-cta-title]"
                                    />
                                    <EditableWrapper 
                                      path="cta.subtitle" 
                                      targetSelector="[data-editable-cta-subtitle]"
                                    />
                                    <EditableWrapper 
                                      path="cta.ctaText" 
                                      targetSelector="[data-editable-cta-button]"
                                    />
                                  </>
                                )}
                              </div>
                            );

                          case 'footer':
                            return (
                              <div 
                                key={`${section.id}-${JSON.stringify(section.content.phoneConfig)}-${JSON.stringify(section.content.emailConfig)}-${JSON.stringify(section.content.addressConfig)}`} 
                                style={{ position: 'relative' }}
                              >
                                <Component 
                                  businessName={content.businessName}
                                  phone={section.content.phone}
                                  email={section.content.email}
                                  address={section.content.address}
                                  primaryColor={primaryColor}
                                />
                                {isEditMode && (
                                  <>
                                    <EditableWrapper 
                                      path="businessName" 
                                      targetSelector="[data-editable-footer-business]"
                                    />
                                    <EditableWrapper 
                                      path="footer.phone" 
                                      targetSelector="[data-editable-footer-phone]"
                                    />
                                    <EditableWrapper 
                                      path="footer.email" 
                                      targetSelector="[data-editable-footer-email]"
                                    />
                                    <EditableWrapper 
                                      path="footer.address" 
                                      targetSelector="[data-editable-footer-address]"
                                    />
                                  </>
                                )}
                              </div>
                            );

                          default:
                            return null;
                        }
                      })
                  ) : (
                    <div className="p-12 text-center">
                      <div className="text-4xl mb-4">⏳</div>
                      <p className="text-gray-500 mb-4">Sections yükleniyor...</p>
                      <div className="text-xs text-gray-400 space-y-1">
                        <p>Sections: {content.sections?.length || 0}</p>
                        <p>isReady: {isReady ? 'true' : 'false'}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold mb-6">⚙️ Site Ayarları</h2>
                
                <div className="bg-purple-50 rounded-lg p-6 mb-6">
                  <h3 className="font-bold text-lg mb-4">📋 Site Bilgileri</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-gray-600">Site ID:</span>
                      <strong className="ml-2">{siteId}</strong>
                    </div>
                    <div>
                      <span className="text-gray-600">Mod:</span>
                      <strong className="ml-2 capitalize">{siteData.mode}</strong>
                    </div>
                    <div>
                      <span className="text-gray-600">Kategori:</span>
                      <strong className="ml-2 capitalize">{siteData.category}</strong>
                    </div>
                    <div>
                      <span className="text-gray-600">Tema:</span>
                      <strong className="ml-2">{siteData.theme}</strong>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-6 mb-6">
                  <h3 className="font-bold text-lg mb-4">
                    🧩 Sections ({content.sections?.length || 0})
                  </h3>
                  {content.sections && content.sections.length > 0 ? (
                    <div className="space-y-2">
                      {content.sections.map((section, index) => (
                        <div key={section.id} className="flex justify-between items-center border-b pb-2">
                          <div className="flex items-center gap-3">
                            <span className="text-gray-400 text-sm">#{index + 1}</span>
                            <span className="font-medium capitalize">{section.type}</span>
                            <span className="text-xs bg-gray-200 px-2 py-1 rounded">{section.variant}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {section.visible ? (
                              <span className="text-green-600 text-sm">👁️ Visible</span>
                            ) : (
                              <span className="text-gray-400 text-sm">🙈 Hidden</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">Sections yükleniyor...</p>
                  )}
                </div>

                <div className="bg-green-50 rounded-lg p-6">
                  <h3 className="font-bold text-lg mb-4">✏️ İçerik Düzenleme</h3>
                  <p className="text-gray-600 mb-4">
                    Preview sekmesine geçip "Düzenleme Modu" butonuna tıklayın. Sonra değiştirmek istediğiniz metne tıklayın.
                  </p>
                  <button 
                    onClick={() => {
                      setActiveTab('preview');
                      setEditMode(true);
                    }}
                    className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
                  >
                    🚀 Düzenlemeye Başla
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}