'use client'

interface PageLoaderProps {
  brandName?: string
  showBrand?: boolean
}

export default function PageLoader({ 
  brandName = 'WellnessTal',
  showBrand = true 
}: PageLoaderProps) {
  return (
    <div className="min-h-screen bg-cream-gradient flex items-center justify-center">
      <div className="text-center">
        {/* Brand Logo/Icon */}
        {showBrand && (
          <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-600">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-sage-500 shadow-lg mb-4">
              <span className="text-4xl text-white font-bold">W</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-charcoal tracking-tight">
              {brandName}
            </h1>
          </div>
        )}

        {/* Loading Spinner */}
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-sage-200 border-t-sage-500 mx-auto mb-4"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-6 bg-sage-500 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Subtle loading indicator */}
        <div className="mt-6 animate-pulse">
          <div className="h-2 w-32 bg-sage-200 rounded mx-auto"></div>
        </div>
      </div>
    </div>
  )
}

