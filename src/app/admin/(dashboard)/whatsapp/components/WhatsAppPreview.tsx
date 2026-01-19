'use client'

import { sizeClasses, iconSizes, borderRadiusClasses } from './constants'
import { WhatsAppSettings } from './types'

interface WhatsAppPreviewProps {
  settings: WhatsAppSettings
}

export function WhatsAppPreview({ settings }: WhatsAppPreviewProps) {
  const isOnline = settings.availability.mode === 'always-online' ||
    (settings.availability.mode === 'manual' && settings.availability.manualStatus)

  if (settings.basic.useOriginalStyle) {
    // Original Style Preview
    return (
      <div className="relative">
        <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg relative">
          <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
          </svg>
          <span className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-75" />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white flex items-center justify-center">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">Orijinal Stil</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center">
      {/* Tooltip Preview - Only show when CTA bubble is not visible */}
      {settings.message.tooltipText && !settings.ctaBubble.enabled && (
        <div className="bg-gray-800 text-white px-2 py-1 rounded-md text-[10px] whitespace-nowrap mb-2 max-w-[140px] truncate">
          {settings.message.tooltipText}
        </div>
      )}

      {/* CTA Bubble Preview - Scaled down for preview area */}
      {settings.ctaBubble.enabled && (
        <div
          className="p-2 rounded-lg shadow-lg max-w-[160px] mb-2 relative"
          style={{ backgroundColor: settings.ctaBubble.backgroundColor }}
        >
          <h4 className="font-semibold text-xs mb-0.5 truncate" style={{ color: settings.ctaBubble.titleColor }}>
            {settings.ctaBubble.title}
          </h4>
          <p className="text-[10px] line-clamp-2" style={{ color: settings.ctaBubble.textColor }}>
            {settings.ctaBubble.message}
          </p>
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent"
            style={{ borderTopColor: settings.ctaBubble.backgroundColor }} />
        </div>
      )}

      {/* Button Preview */}
      <div
        className={`${sizeClasses[settings.appearance.size]} ${borderRadiusClasses[settings.appearance.borderRadius]} flex items-center justify-center text-white relative transition-all duration-300`}
        style={{
          backgroundColor: settings.appearance.buttonColor,
          boxShadow: settings.appearance.shadow ? '0 10px 25px -5px rgba(0, 0, 0, 0.2)' : 'none'
        }}
      >
        <svg
          className={iconSizes[settings.appearance.size]}
          fill={settings.appearance.iconColor}
          viewBox="0 0 24 24"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
        </svg>

        {/* Pulse Animation */}
        {settings.appearance.pulseAnimation && (
          <span
            className={`absolute inset-0 ${borderRadiusClasses[settings.appearance.borderRadius]} animate-ping opacity-75`}
            style={{ backgroundColor: settings.appearance.buttonColor }}
           />
        )}

        {/* Online Indicator */}
        {settings.availability.showIndicator && (
          <div
            className="absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center"
            style={{ backgroundColor: isOnline ? settings.availability.onlineColor : settings.availability.offlineColor }}
          >
            <div
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: isOnline ? settings.availability.onlineColor : settings.availability.offlineColor }}
             />
          </div>
        )}
      </div>
    </div>
  )
}
