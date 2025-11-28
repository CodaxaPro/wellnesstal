// src/app/admin/services/[id]/landing-page/components/shared/TabNavigation.tsx

'use client'

import React from 'react'

interface Tab {
  id: string
  label: string
  icon?: string
  disabled?: boolean
}

interface TabNavigationProps {
  tabs: Tab[]
  activeTab: string
  onTabChange: (tabId: string) => void
  variant?: 'default' | 'pills' | 'underline' | 'vertical'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const variantClasses = {
  default: {
    container: 'border-b border-gray-200',
    tab: 'px-4 py-2 border-b-2 border-transparent hover:border-gray-300 transition-colors',
    active: 'border-blue-500 text-blue-600',
    inactive: 'text-gray-700 hover:text-gray-900'
  },
  pills: {
    container: 'bg-gray-100 rounded-lg p-1',
    tab: 'px-4 py-2 rounded-lg transition-colors',
    active: 'bg-white text-blue-600 shadow-sm',
    inactive: 'text-gray-700 hover:text-gray-900 hover:bg-gray-200'
  },
  underline: {
    container: '',
    tab: 'px-4 py-2 border-b-2 border-transparent transition-colors',
    active: 'border-blue-500 text-blue-600 bg-blue-50',
    inactive: 'text-gray-700 hover:text-gray-900 hover:border-gray-300'
  },
  vertical: {
    container: 'border-b border-gray-200 bg-gray-50',
    tab: 'w-full px-4 py-3 text-left border-l-4 border-transparent hover:bg-gray-100 transition-colors',
    active: 'border-blue-500 bg-blue-50 text-blue-600 font-medium',
    inactive: 'text-gray-700 hover:text-gray-900'
  }
}

const sizeClasses = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg'
}

export default function TabNavigation({
  tabs,
  activeTab,
  onTabChange,
  variant = 'default',
  size = 'md',
  className = ''
}: TabNavigationProps) {
  const styles = variantClasses[variant]
  const isVertical = variant === 'vertical'

  return (
    <div 
      className={`${styles.container} ${className}`}
      role="tablist"
    >
      <div className={isVertical ? 'flex flex-col' : 'flex space-x-1'}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => !tab.disabled && onTabChange(tab.id)}
            disabled={tab.disabled}
            className={`${styles.tab} ${sizeClasses[size]} ${
              isVertical ? 'flex items-center gap-3' : ''
            } font-medium transition-colors ${
              activeTab === tab.id 
                ? styles.active 
                : styles.inactive
            } ${
              tab.disabled 
                ? 'opacity-50 cursor-not-allowed' 
                : 'cursor-pointer'
            }`}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-disabled={tab.disabled}
            tabIndex={activeTab === tab.id ? 0 : -1}
          >
            {tab.icon && (
              <span className={isVertical ? '' : 'mr-2'}>{tab.icon}</span>
            )}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

// Hook for tab navigation keyboard support
export function useTabNavigation(tabs: Tab[], activeTab: string, onTabChange: (tabId: string) => void) {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLElement && e.target.getAttribute('role') === 'tab') {
        const currentIndex = tabs.findIndex(tab => tab.id === activeTab)
        let nextIndex = currentIndex

        switch (e.key) {
          case 'ArrowLeft':
          case 'ArrowUp':
            e.preventDefault()
            nextIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1
            break
          case 'ArrowRight':
          case 'ArrowDown':
            e.preventDefault()
            nextIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0
            break
          case 'Home':
            e.preventDefault()
            nextIndex = 0
            break
          case 'End':
            e.preventDefault()
            nextIndex = tabs.length - 1
            break
          default:
            return
        }

        const nextTab = tabs[nextIndex]
        if (nextTab && !nextTab.disabled) {
          onTabChange(nextTab.id)
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [tabs, activeTab, onTabChange])
}