// src/app/admin/services/[id]/landing-page/components/shared/SidebarPanel.tsx

'use client'

import React, { useEffect } from 'react'

interface SidebarPanelProps {
  isOpen: boolean
  onClose: () => void
  title: string
  subtitle?: string
  children: React.ReactNode
  position?: 'left' | 'right'
  width?: 'sm' | 'md' | 'lg' | 'xl'
  footer?: React.ReactNode
}

const widthClasses = {
  sm: 'w-80',      // 320px
  md: 'w-96',      // 384px
  lg: 'w-[32rem]', // 512px
  xl: 'w-[40rem]'  // 640px
}

export default function SidebarPanel({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  position = 'right',
  width = 'lg',
  footer
}: SidebarPanelProps) {
  // ESC key to close
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-30 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Sidebar Panel */}
      <div 
        className={`fixed top-0 ${position === 'right' ? 'right-0' : 'left-0'} h-full ${widthClasses[width]} bg-white shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-in-out`}
      >
        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between p-6 border-b border-gray-200 bg-white">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
            {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors ml-4"
            aria-label="Close"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="flex-shrink-0 border-t border-gray-200 p-6 bg-gray-50">
            {footer}
          </div>
        )}
      </div>
    </>
  )
}