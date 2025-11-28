'use client';

import { useWizardStore } from '../store/useWizardStore';

const steps = [
  { id: 'mode', label: 'Mod', icon: '🎯' },
  { id: 'category', label: 'Kategori', icon: '📁' },
  { id: 'theme', label: 'Tema', icon: '🎨' },
  { id: 'customize', label: 'Özelleştir', icon: '⚙️' },
  { id: 'preview', label: 'Önizle', icon: '👁️' },
];

export default function WizardProgress() {
  const { currentStep } = useWizardStore();

  const currentIndex = steps.findIndex(s => s.id === currentStep);

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between max-w-4xl mx-auto">
        {steps.map((step, index) => {
          const isActive = step.id === currentStep;
          const isCompleted = index < currentIndex;

          return (
            <div key={step.id} className="flex items-center flex-1">
              {/* Step Circle */}
              <div className="flex flex-col items-center">
                <div
                  className={`
                    w-12 h-12 rounded-full flex items-center justify-center
                    text-xl font-bold transition-all
                    ${isActive 
                      ? 'bg-purple-600 text-white ring-4 ring-purple-200 scale-110' 
                      : isCompleted
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-400'
                    }
                  `}
                >
                  {isCompleted ? '✓' : step.icon}
                </div>
                <div
                  className={`
                    mt-2 text-xs font-semibold
                    ${isActive ? 'text-purple-600' : 'text-gray-500'}
                  `}
                >
                  {step.label}
                </div>
              </div>

              {/* Line */}
              {index < steps.length - 1 && (
                <div
                  className={`
                    flex-1 h-1 mx-2 transition-all
                    ${index < currentIndex 
                      ? 'bg-green-500' 
                      : 'bg-gray-200'
                    }
                  `}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}