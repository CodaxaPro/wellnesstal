'use client'

interface Step {
  number: number
  title: string
  icon: string
}

interface StepNavigationProps {
  steps: Step[]
  currentStep: number
  onStepClick: (stepNumber: number) => void
  isSubmitting?: boolean
}

export default function StepNavigation({
  steps,
  currentStep,
  onStepClick,
  isSubmitting = false
}: StepNavigationProps) {
  return (
    <div className="mt-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <button
              type="button"
              onClick={() => onStepClick(step.number)}
              disabled={isSubmitting}
              className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all cursor-pointer hover:scale-105 disabled:cursor-not-allowed disabled:hover:scale-100 ${
                currentStep >= step.number
                  ? 'bg-sage-500 border-sage-500 text-white shadow-lg'
                  : 'bg-white border-gray-300 text-gray-500 hover:border-sage-300 hover:bg-sage-50'
              }`}
            >
              {currentStep > step.number ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <span className="text-lg">{step.icon}</span>
              )}
            </button>
            <button
              type="button"
              onClick={() => onStepClick(step.number)}
              disabled={isSubmitting}
              className="ml-3 hidden sm:block hover:text-sage-600 transition-colors disabled:cursor-not-allowed disabled:hover:text-current"
            >
              <div className={`text-sm font-medium ${
                currentStep >= step.number ? 'text-charcoal' : 'text-gray-500'
              }`}>
                {step.title}
              </div>
            </button>
            {index < steps.length - 1 && (
              <div className={`hidden sm:block w-full h-0.5 mx-4 transition-colors ${
                currentStep > step.number ? 'bg-sage-500' : 'bg-gray-300'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Mobile Step Indicator */}
      <div className="sm:hidden mt-4 text-center">
        <div className="text-sm text-gray-500">
          Adım {currentStep} / {steps.length}
        </div>
        <div className="text-base font-medium text-charcoal">
          {steps.find(s => s.number === currentStep)?.title}
        </div>
        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-sage-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / steps.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  )
}