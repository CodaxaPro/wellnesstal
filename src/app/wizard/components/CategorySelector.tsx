'use client';

import { useWizardStore } from '../store/useWizardStore';

const categories = [
  { id: 'wellness', name: 'Wellness', icon: '🧘', description: 'Spa, Yoga, Masaj' },
  { id: 'food', name: 'Food', icon: '🍽️', description: 'Restaurant, Cafe, Bar' },
  { id: 'fitness', name: 'Fitness', icon: '🏋️', description: 'Gym, Studio, Trainer' },
  { id: 'business', name: 'Business', icon: '💼', description: 'Consulting, Agency' },
  { id: 'ecommerce', name: 'E-Commerce', icon: '🛍️', description: 'Online Store' },
  { id: 'portfolio', name: 'Portfolio', icon: '🎨', description: 'Artist, Designer' },
];

export default function CategorySelector() {
  const { category, setCategory, setStep } = useWizardStore();

  const handleSelect = (categoryId: string) => {
    setCategory(categoryId);
    console.log('Selected category:', categoryId);
  };

  const handleNext = () => {
    setStep('theme');
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">🎯 Sektörünüzü Seçin</h2>
        <p className="text-gray-600">Hangi alanda sayfa oluşturacaksınız?</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleSelect(cat.id)}
            className={`
              bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all
              border-2 text-left
              ${category === cat.id 
                ? 'border-purple-500 bg-purple-50' 
                : 'border-transparent hover:border-purple-300'
              }
            `}
          >
            <div className="text-5xl mb-3">{cat.icon}</div>
            <h3 className="text-xl font-bold mb-2">{cat.name}</h3>
            <p className="text-sm text-gray-600">{cat.description}</p>
            
            {category === cat.id && (
              <div className="mt-3 text-purple-600 font-semibold">
                ✓ Seçildi
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Debug */}
      {category && (
        <div className="mt-8 p-4 bg-green-100 rounded-lg text-center">
          ✅ Seçilen kategori: <strong>{category}</strong>
        </div>
      )}

      {/* Navigation */}
      {category && (
        <div className="mt-8 flex justify-center">
          <button 
            onClick={handleNext}
            className="bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700"
          >
            Devam Et →
          </button>
        </div>
      )}
    </div>
  );
}