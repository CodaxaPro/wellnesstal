'use client'

import { useMemo } from 'react'

interface CategoryStatsProps {
  stats: {
    total: number
    active: number
    inactive: number
  }
  isLoading?: boolean
}

export default function CategoryStats({ stats, isLoading = false }: CategoryStatsProps) {
  const statsData = useMemo(() => [
    {
      title: 'Toplam Kategori',
      value: stats.total,
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14-7H5m14 14H5" />
        </svg>
      ),
      color: 'text-charcoal',
      bgColor: 'bg-gray-50'
    },
    {
      title: 'Aktif',
      value: stats.active,
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Pasif',
      value: stats.inactive,
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L5.636 5.636" />
        </svg>
      ),
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      title: 'Aktif Oran',
      value: stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0,
      suffix: '%',
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      color: 'text-sage-600',
      bgColor: 'bg-sage-50'
    }
  ], [stats])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-soft">
            <div className="animate-pulse">
              <div className="flex items-center justify-between mb-4">
                <div className="h-4 bg-gray-200 rounded w-20" />
                <div className="h-6 w-6 bg-gray-200 rounded" />
              </div>
              <div className="h-8 bg-gray-200 rounded w-12" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {statsData.map((stat, index) => (
        <div key={index} className="bg-white rounded-xl p-6 shadow-soft hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">{stat.title}</h3>
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <div className={stat.color}>
                {stat.icon}
              </div>
            </div>
          </div>
          <div className="flex items-baseline">
            <p className="text-2xl font-bold text-charcoal">
              {stat.value}
            </p>
            {stat.suffix && (
              <span className="ml-1 text-lg font-medium text-gray-500">
                {stat.suffix}
              </span>
            )}
          </div>
          
          {/* Progress bar for active ratio */}
          {stat.title === 'Aktif Oran' && stats.total > 0 && (
            <div className="mt-3">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-sage-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${stat.value}%` }}
                 />
              </div>
            </div>
          )}
          
          {/* Additional info for totals */}
          {stat.title === 'Toplam Kategori' && stats.total > 0 && (
            <p className="text-xs text-gray-500 mt-2">
              {stats.active} aktif, {stats.inactive} pasif
            </p>
          )}
        </div>
      ))}
    </div>
  )
}