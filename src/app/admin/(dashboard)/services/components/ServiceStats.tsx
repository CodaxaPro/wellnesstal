'use client'

import { useMemo } from 'react'
import type { ServiceStats as ServiceStatsType } from '../../../../types/services'

interface ServiceStatsProps {
  stats: ServiceStatsType
  isLoading?: boolean
}

export default function ServiceStats({ stats, isLoading = false }: ServiceStatsProps) {
  const statsData = useMemo(() => [
    {
      title: 'Toplam Hizmet',
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
      title: 'Popüler',
      value: stats.popular,
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ),
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Öne Çıkan',
      value: stats.featured,
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
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
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-soft">
            <div className="animate-pulse">
              <div className="flex items-center justify-between mb-4">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
                <div className="h-6 w-6 bg-gray-200 rounded"></div>
              </div>
              <div className="h-8 bg-gray-200 rounded w-12"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
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
                ></div>
              </div>
            </div>
          )}
          
          {/* Additional info for totals */}
          {stat.title === 'Toplam Hizmet' && stats.total > 0 && (
            <p className="text-xs text-gray-500 mt-2">
              {stats.active} aktif, {stats.inactive} pasif
            </p>
          )}
        </div>
      ))}

      {/* Category Breakdown */}
      {stats.byCategory && Object.keys(stats.byCategory).length > 0 && (
        <div className="lg:col-span-6 bg-white rounded-xl p-6 shadow-soft">
          <h3 className="text-lg font-semibold text-charcoal mb-4">Kategoriye Göre Dağılım</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Object.entries(stats.byCategory).map(([categoryId, categoryStats]) => (
              <div key={categoryId} className="text-center">
                <div className="text-2xl font-bold text-charcoal">
                  {categoryStats.count}
                </div>
                <div className="text-sm text-gray-600">
                  {categoryStats.name}
                </div>
                <div className="text-xs text-gray-500">
                  %{Math.round(categoryStats.percentage)}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
                  <div
                    className="bg-sage-500 h-1 rounded-full transition-all duration-300"
                    style={{ width: `${categoryStats.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Performers */}
      {stats.topPerformers && stats.topPerformers.length > 0 && (
        <div className="lg:col-span-6 bg-white rounded-xl p-6 shadow-soft">
          <h3 className="text-lg font-semibold text-charcoal mb-4">En İyi Performans</h3>
          <div className="space-y-3">
            {stats.topPerformers.slice(0, 5).map((performer, index) => (
              <div key={performer.serviceId} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-sage-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-sage-600 font-semibold text-sm">#{index + 1}</span>
                  </div>
                  <div>
                    <div className="font-medium text-charcoal">{performer.title}</div>
                    <div className="text-sm text-gray-500">
                      {performer.viewCount} görüntülenme, {performer.clickCount} tık
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-sage-600">
                    %{Math.round(performer.conversionRate * 100)}
                  </div>
                  <div className="text-xs text-gray-500">dönüşüm</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}