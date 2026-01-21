'use client'

import { useState, useEffect } from 'react'

import Link from 'next/link'
import { useParams } from 'next/navigation'

import { PageBuilder } from './components/Canvas/FreeForm/PageBuilder'
import { EditorProvider } from './contexts/EditorContext'
import { SelectionProvider } from './contexts/SelectionContext'

interface ServiceData {
  id: string
  title: string
  shortDescription: string
  price: string
  duration: string
  image: string
}

function LandingPageContent({ service }: { service: ServiceData }) {
  return (
    <SelectionProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Toolbar */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold">Landing Page Builder</h1>
              <p className="text-sm text-gray-500">{service.title}</p>
            </div>
            <div className="flex gap-2">
              <Link
                href="/admin/services"
                className="px-4 py-2 text-gray-600 hover:text-gray-900"
              >
                Back
              </Link>
              <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                Save
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="h-[calc(100vh-73px)]">
          <PageBuilder />
        </div>
      </div>
    </SelectionProvider>
  )
}

export default function LandingPageBuilder() {
  const params = useParams()
  const serviceId = params['id'] as string

  const [service, setService] = useState<ServiceData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadService = async () => {
      try {
        const mockService: ServiceData = {
          id: serviceId,
          title: 'Premium Headspa',
          shortDescription: 'Luxury wellness treatment',
          price: '₺85',
          duration: '90 dk',
          image: '/images/default-service.jpg'
        }

        setService(mockService)
        setIsLoading(false)
      } catch (error) {
        console.error('Error loading service:', error)
        setIsLoading(false)
      }
    }

    loadService()
  }, [serviceId])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto" />
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Service not found</h1>
          <Link
            href="/admin/services"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Back to Services
          </Link>
        </div>
      </div>
    )
  }

  return (
    <EditorProvider
      initialData={{
        header: {
          logo: { url: '', alt: 'Logo' },
          navigation: [],
          cta: { text: '', href: '' },
          style: { backgroundColor: '#ffffff', textColor: '#374151', position: 'relative' as const }
        },
        hero: {
          layout: { variant: 'centered', alignment: 'center' },
          content: { title: '', subtitle: '', description: '' },
          buttons: [],
          images: { main: '', background: '' },
          style: {
            backgroundColor: '#ffffff',
            textColor: '#000000',
            overlay: { enabled: false, color: '#000000', opacity: 0.5 }
          },
          typography: { titleSize: 48, titleWeight: 700, subtitleSize: 20 }
        },
        features: {
          layout: { columns: 3, variant: 'cards', alignment: 'center' },
          style: {
            backgroundColor: '#ffffff',
            cardBackgroundColor: '#ffffff',
            textColor: '#000000',
            borderRadius: 8,
            spacing: 24,
            padding: { x: 24, y: 80 }
          },
          header: { title: '', subtitle: '' },
          items: []
        }
      }}
      onSave={async (data) => {
        console.log('Saving:', data)
      }}
    >
      <LandingPageContent service={service} />
    </EditorProvider>
  )
}
