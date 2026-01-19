'use client'

import { useEffect } from 'react'

import { useRouter } from 'next/navigation'

export default function ContactSettingsPage() {
  const router = useRouter()
  
  // Redirect to /admin/content with contact-section tab
  useEffect(() => {
    router.replace('/admin/content?tab=contact-section')
  }, [router])
  
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage-600 mx-auto mb-4" />
        <p className="text-gray-600">Yönlendiriliyor...</p>
      </div>
    </div>
  )
}
