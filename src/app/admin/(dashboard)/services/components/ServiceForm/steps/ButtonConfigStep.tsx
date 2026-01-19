'use client'

import { ServiceFormData, ButtonType } from '../../../../../../types/services'

interface ButtonConfigStepProps {
  formData: ServiceFormData
  onInputChange: (field: keyof ServiceFormData, value: any) => void
}

export default function ButtonConfigStep({
  formData,
  onInputChange
}: ButtonConfigStepProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-charcoal mb-4">Service Buttons</h3>
      
      <div className="bg-gray-50 rounded-xl p-6 space-y-8">
        {/* Primary Button */}
        <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 bg-sage-500 rounded-full" />
            <h4 className="font-medium text-charcoal">Primary Action Button</h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Button Text</label>
              <input
                type="text"
                value={formData.primaryButtonText || ''}
                onChange={(e) => onInputChange('primaryButtonText', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                placeholder="Jetzt buchen"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Action Type</label>
              <select
                value={formData.primaryButtonType || ''}
                onChange={(e) => onInputChange('primaryButtonType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
              >
                <option value="phone">📞 Phone Call</option>
                <option value="whatsapp">💬 WhatsApp</option>
                <option value="page">📄 Modal Page</option>
                <option value="link">🔗 External Link</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {formData.primaryButtonType === 'phone' && 'Phone Number'}
                {formData.primaryButtonType === 'whatsapp' && 'WhatsApp Number'}
                {formData.primaryButtonType === 'page' && 'Modal Content'}
                {formData.primaryButtonType === 'link' && 'URL Address'}
              </label>
              {formData.primaryButtonType === 'page' ? (
                <textarea
                  value={formData.primaryButtonValue || ''}
                  onChange={(e) => onInputChange('primaryButtonValue', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                  rows={3}
                  placeholder="Modal content..."
                />
              ) : (
                <input
                  type="text"
                  value={formData.primaryButtonValue || ''}
                  onChange={(e) => onInputChange('primaryButtonValue', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                  placeholder={
                    formData.primaryButtonType === 'phone' ? '+491733828581' :
                    formData.primaryButtonType === 'whatsapp' ? '+491733828581' :
                    'https://example.com'
                  }
                />
              )}
            </div>
          </div>

          {/* WhatsApp Message */}
          {formData.primaryButtonType === 'whatsapp' && (
            <div className="bg-green-50 p-3 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp Message (optional)</label>
              <input
                type="text"
                value={formData.primaryButtonMessage || ''}
                onChange={(e) => onInputChange('primaryButtonMessage', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Hallo, ich interessiere mich für..."
              />
            </div>
          )}

          {/* Modal Button Configuration */}
          {formData.primaryButtonType === 'page' && (
            <div className="bg-sage-50 p-4 rounded-lg mt-4">
              <h5 className="font-medium text-charcoal mb-3 flex items-center gap-2">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Modal Action Buttons
              </h5>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Button */}
                <div className="space-y-3">
                  <div className="text-sm font-medium text-gray-600 bg-white px-2 py-1 rounded-md">Left Button</div>
                  <input
                    type="text"
                    value={formData.primaryModalLeftButtonText || ''}
                    onChange={(e) => onInputChange('primaryModalLeftButtonText', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
                    placeholder="Button text"
                  />
                  <select
                    value={formData.primaryModalLeftButtonType || ''}
                    onChange={(e) => onInputChange('primaryModalLeftButtonType', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
                  >
                    <option value="phone">📞 Phone</option>
                    <option value="whatsapp">💬 WhatsApp</option>
                    <option value="link">🔗 Link</option>
                  </select>
                  <input
                    type="text"
                    value={formData.primaryModalLeftButtonValue || ''}
                    onChange={(e) => onInputChange('primaryModalLeftButtonValue', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
                    placeholder={
                      formData.primaryModalLeftButtonType === 'phone' ? '+491733828581' :
                      formData.primaryModalLeftButtonType === 'whatsapp' ? '+491733828581' :
                      'https://example.com'
                    }
                  />
                </div>
                
                {/* Right Button */}
                <div className="space-y-3">
                  <div className="text-sm font-medium text-gray-600 bg-white px-2 py-1 rounded-md">Right Button</div>
                  <input
                    type="text"
                    value={formData.primaryModalRightButtonText || ''}
                    onChange={(e) => onInputChange('primaryModalRightButtonText', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
                    placeholder="Button text"
                  />
                  <select
                    value={formData.primaryModalRightButtonType || ''}
                    onChange={(e) => onInputChange('primaryModalRightButtonType', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
                  >
                    <option value="phone">📞 Phone</option>
                    <option value="whatsapp">💬 WhatsApp</option>
                    <option value="link">🔗 Link</option>
                  </select>
                  <input
                    type="text"
                    value={formData.primaryModalRightButtonValue || ''}
                    onChange={(e) => onInputChange('primaryModalRightButtonValue', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
                    placeholder={
                      formData.primaryModalRightButtonType === 'phone' ? '+491733828581' :
                      formData.primaryModalRightButtonType === 'whatsapp' ? '+491733828581' :
                      'https://example.com'
                    }
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Secondary Button */}
        <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 bg-gray-400 rounded-full" />
            <h4 className="font-medium text-charcoal">Secondary Action Button</h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Button Text</label>
              <input
                type="text"
                value={formData.secondaryButtonText || ''}
                onChange={(e) => onInputChange('secondaryButtonText', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                placeholder="Mehr Details"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Action Type</label>
              <select
                value={formData.secondaryButtonType || ''}
                onChange={(e) => onInputChange('secondaryButtonType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
              >
                <option value="phone">📞 Phone Call</option>
                <option value="whatsapp">💬 WhatsApp</option>
                <option value="page">📄 Modal Page</option>
                <option value="link">🔗 External Link</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {formData.secondaryButtonType === 'phone' && 'Phone Number'}
                {formData.secondaryButtonType === 'whatsapp' && 'WhatsApp Number'}
                {formData.secondaryButtonType === 'page' && 'Modal Content'}
                {formData.secondaryButtonType === 'link' && 'URL Address'}
              </label>
              {formData.secondaryButtonType === 'page' ? (
                <textarea
                  value={formData.secondaryButtonValue || ''}
                  onChange={(e) => onInputChange('secondaryButtonValue', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                  rows={3}
                  placeholder="Modal content..."
                />
              ) : (
                <input
                  type="text"
                  value={formData.secondaryButtonValue || ''}
                  onChange={(e) => onInputChange('secondaryButtonValue', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                  placeholder={
                    formData.secondaryButtonType === 'phone' ? '+491733828581' :
                    formData.secondaryButtonType === 'whatsapp' ? '+491733828581' :
                    'https://example.com'
                  }
                />
              )}
            </div>
          </div>

          {/* WhatsApp Message */}
          {formData.secondaryButtonType === 'whatsapp' && (
            <div className="bg-green-50 p-3 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp Message (optional)</label>
              <input
                type="text"
                value={formData.secondaryButtonMessage || ''}
                onChange={(e) => onInputChange('secondaryButtonMessage', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Hallo, ich möchte mehr über... erfahren"
              />
            </div>
          )}

          {/* Modal Button Configuration */}
          {formData.secondaryButtonType === 'page' && (
            <div className="bg-sage-50 p-4 rounded-lg mt-4">
              <h5 className="font-medium text-charcoal mb-3 flex items-center gap-2">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Modal Action Buttons
              </h5>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Button */}
                <div className="space-y-3">
                  <div className="text-sm font-medium text-gray-600 bg-white px-2 py-1 rounded-md">Left Button</div>
                  <input
                    type="text"
                    value={formData.secondaryModalLeftButtonText || ''}
                    onChange={(e) => onInputChange('secondaryModalLeftButtonText', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
                    placeholder="Button text"
                  />
                  <select
                    value={formData.secondaryModalLeftButtonType || ''}
                    onChange={(e) => onInputChange('secondaryModalLeftButtonType', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
                  >
                    <option value="phone">📞 Phone</option>
                    <option value="whatsapp">💬 WhatsApp</option>
                    <option value="link">🔗 Link</option>
                  </select>
                  <input
                    type="text"
                    value={formData.secondaryModalLeftButtonValue || ''}
                    onChange={(e) => onInputChange('secondaryModalLeftButtonValue', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
                    placeholder={
                      formData.secondaryModalLeftButtonType === 'phone' ? '+491733828581' :
                      formData.secondaryModalLeftButtonType === 'whatsapp' ? '+491733828581' :
                      'https://example.com'
                    }
                  />
                </div>
                
                {/* Right Button */}
                <div className="space-y-3">
                  <div className="text-sm font-medium text-gray-600 bg-white px-2 py-1 rounded-md">Right Button</div>
                  <input
                    type="text"
                    value={formData.secondaryModalRightButtonText || ''}
                    onChange={(e) => onInputChange('secondaryModalRightButtonText', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
                    placeholder="Button text"
                  />
                  <select
                    value={formData.secondaryModalRightButtonType || ''}
                    onChange={(e) => onInputChange('secondaryModalRightButtonType', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
                  >
                    <option value="phone">📞 Phone</option>
                    <option value="whatsapp">💬 WhatsApp</option>
                    <option value="link">🔗 Link</option>
                  </select>
                  <input
                    type="text"
                    value={formData.secondaryModalRightButtonValue || ''}
                    onChange={(e) => onInputChange('secondaryModalRightButtonValue', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
                    placeholder={
                      formData.secondaryModalRightButtonType === 'phone' ? '+491733828581' :
                      formData.secondaryModalRightButtonType === 'whatsapp' ? '+491733828581' :
                      'https://example.com'
                    }
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Button Preview */}
        <div className="bg-white rounded-lg p-5 border border-sage-200">
          <h4 className="font-medium text-charcoal mb-4 flex items-center gap-2">
            <svg className="h-4 w-4 text-sage-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Preview
          </h4>
          <div className="flex flex-col sm:flex-row gap-3">
            <button className="flex-1 bg-sage-500 text-white px-6 py-3 rounded-xl font-medium text-center">
              {formData.primaryButtonText}
            </button>
            <button className="flex-1 border-2 border-sage-500 text-sage-500 px-6 py-3 rounded-xl font-medium text-center">
              {formData.secondaryButtonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}