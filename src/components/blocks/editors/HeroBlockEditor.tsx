'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { HeroContent } from '../types'
import DescriptionRichEditor from './hero/DescriptionRichEditor'

interface HeroBlockEditorProps {
  content: HeroContent
  onUpdate: (content: HeroContent) => void
}

// Default content
const getDefaultContent = (): HeroContent => ({
  badge: '🌿 Willkommen in Baesweiler',
  badgeEnabled: true,
  mainTitle: 'Wellness & Entspannung in Baesweiler',
  subtitle: '',
  primaryButton: 'Jetzt anrufen',
  primaryButtonLink: 'tel:+491733828581',
  secondaryButton: 'Leistungen entdecken',
  secondaryButtonLink: '#services',
  trustIndicator: '500+ zufriedene Kunden',
  scrollIndicator: {
    enabled: true,
    text: 'Scrollen Sie nach unten',
    position: {
      vertical: 'bottom',
      horizontal: 'center'
    }
  },
  image: {
    url: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    alt: 'Entspannende Spa-Behandlung bei Wellnesstal'
  },
  imageStyles: {
    borderRadius: '24px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    opacity: '100',
    hoverScale: '105',
    brightness: '100',
    contrast: '100',
    saturation: '100',
    overlayOpacity: '20',
    overlayColor: '#2C2C2C'
  },
  styles: {
    badge: {
      fontFamily: 'system-ui',
      fontSize: '14px',
      fontWeight: '500',
      color: '#637554',
      backgroundColor: '#eef1ea'
    },
    mainTitle: {
      fontFamily: 'system-ui',
      fontSize: '72px',
      fontWeight: '700',
      color: '#2C2C2C'
    },
    highlightedText: {
      fontFamily: 'system-ui',
      fontSize: '72px',
      fontWeight: '700',
      color: '#9CAF88'
    },
    subtitle: {
      fontFamily: 'system-ui',
      fontSize: '24px',
      fontWeight: '400',
      color: '#666666'
    },
    description: {
      fontFamily: 'system-ui',
      fontSize: '18px',
      fontWeight: '400',
      color: '#666666'
    },
    primaryButton: {
      fontFamily: 'system-ui',
      fontSize: '18px',
      fontWeight: '600',
      color: '#FFFFFF',
      backgroundColor: '#9CAF88'
    },
    secondaryButton: {
      fontFamily: 'system-ui',
      fontSize: '18px',
      fontWeight: '600',
      color: '#9CAF88',
      borderColor: '#9CAF88'
    },
    trustIndicator: {
      fontFamily: 'system-ui',
      fontSize: '14px',
      fontWeight: '600',
      color: '#2C2C2C'
    }
  }
})

// Common SVG icons for buttons
const buttonIcons: Record<string, { name: string; svg: string }[]> = {
  'İletişim': [
    { name: 'Telefon', svg: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>' },
    { name: 'E-posta', svg: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>' },
    { name: 'Mesaj', svg: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>' },
    { name: 'WhatsApp', svg: '<svg fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>' },
    { name: 'Video Arama', svg: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>' },
    { name: 'Konum', svg: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>' },
    { name: 'Adres', svg: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>' },
  ],
  'Aksiyon': [
    { name: 'Ok Sağ', svg: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>' },
    { name: 'Ok Sol', svg: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>' },
    { name: 'Ok Yukarı', svg: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" /></svg>' },
    { name: 'Ok Aşağı', svg: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>' },
    { name: 'Dış Link', svg: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>' },
    { name: 'Tik', svg: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>' },
    { name: 'Artı', svg: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>' },
    { name: 'Eksi', svg: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" /></svg>' },
    { name: 'Kalp', svg: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>' },
    { name: 'Beğeni', svg: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" /></svg>' },
    { name: 'Paylaş', svg: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342c-.396 0-.72-.317-.72-.707 0-.39.324-.707.72-.707h6.632c.396 0 .72.317.72.707 0 .39-.324.707-.72.707h-6.632zm0-4.342c-.396 0-.72-.317-.72-.707 0-.39.324-.707.72-.707h6.632c.396 0 .72.317.72.707 0 .39-.324.707-.72.707h-6.632zm0-4.342c-.396 0-.72-.317-.72-.707 0-.39.324-.707.72-.707h6.632c.396 0 .72.317.72.707 0 .39-.324.707-.72.707h-6.632z" /></svg>' },
    { name: 'İndir', svg: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>' },
    { name: 'Yükle', svg: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>' },
    { name: 'Yazdır', svg: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>' },
    { name: 'Kaydet', svg: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" /></svg>' },
  ],
  'Navigasyon': [
    { name: 'Menü', svg: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" /></svg>' },
    { name: 'Arama', svg: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>' },
    { name: 'Ev', svg: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>' },
    { name: 'Kullanıcı', svg: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>' },
    { name: 'Ayarlar', svg: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>' },
  ],
  'Randevu & Rezervasyon': [
    { name: 'Takvim', svg: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>' },
    { name: 'Randevu', svg: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>' },
    { name: 'Saat', svg: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>' },
    { name: 'Zamanlayıcı', svg: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>' },
    { name: 'Rezervasyon', svg: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>' },
    { name: 'Randevu Defteri', svg: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>' },
  ],
  'Hediye & Özel': [
    { name: 'Hediye', svg: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" /></svg>' },
    { name: 'Hediye Kutusu', svg: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" /></svg>' },
    { name: 'Yıldız', svg: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>' },
    { name: 'Kupon', svg: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>' },
    { name: 'İndirim', svg: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>' },
    { name: 'Kampanya', svg: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>' },
    { name: 'Özel Fırsat', svg: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>' },
  ],
  'Sosyal Medya': [
    { name: 'Facebook', svg: '<svg fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>' },
    { name: 'Instagram', svg: '<svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>' },
    { name: 'Twitter', svg: '<svg fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>' },
  ],
  'Wellness & Spa': [
    { name: 'Spa', svg: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>' },
    { name: 'Masaj', svg: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>' },
    { name: 'Yoga', svg: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>' },
    { name: 'Meditasyon', svg: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>' },
    { name: 'Aromaterapi', svg: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>' },
  ],
  'Ödeme & Finans': [
    { name: 'Kredi Kartı', svg: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>' },
    { name: 'Para', svg: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>' },
    { name: 'Ödeme', svg: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>' },
    { name: 'Sepet', svg: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>' },
  ],
}

// Emoji categories for the emoji picker
const emojiCategories: Record<string, string[]> = {
  'Spa & Wellness': ['🧘', '🧘‍♀️', '🧘‍♂️', '🧘🏻‍♀️', '🧘🏻‍♂️', '🧘🏼‍♀️', '🧘🏼‍♂️', '🧘🏽‍♀️', '🧘🏽‍♂️', '🧘🏾‍♀️', '🧘🏾‍♂️', '🧘🏿‍♀️', '🧘🏿‍♂️', '🛀', '🧖', '🧖‍♀️', '🧖‍♂️', '🧖🏻', '🧖🏻‍♀️', '🧖🏻‍♂️', '🧖🏼', '🧖🏼‍♀️', '🧖🏼‍♂️', '🧖🏽', '🧖🏽‍♀️', '🧖🏽‍♂️', '🧖🏾', '🧖🏾‍♀️', '🧖🏾‍♂️', '🧖🏿', '🧖🏿‍♀️', '🧖🏿‍♂️', '💆', '💆‍♀️', '💆‍♂️', '💆🏻', '💆🏻‍♀️', '💆🏻‍♂️', '💆🏼', '💆🏼‍♀️', '💆🏼‍♂️', '💆🏽', '💆🏽‍♀️', '💆🏽‍♂️', '💆🏾', '💆🏾‍♀️', '💆🏾‍♂️', '💆🏿', '💆🏿‍♀️', '💆🏿‍♂️', '💇', '💇‍♀️', '💇‍♂️', '💇🏻', '💇🏻‍♀️', '💇🏻‍♂️', '💇🏼', '💇🏼‍♀️', '💇🏼‍♂️', '💇🏽', '💇🏽‍♀️', '💇🏽‍♂️', '💇🏾', '💇🏾‍♀️', '💇🏾‍♂️', '💇🏿', '💇🏿‍♀️', '💇🏿‍♂️'],
  'Masaj & Terapi': ['👐', '🤲', '🙌', '🤝', '💆', '💆‍♀️', '💆‍♂️', '💆🏻', '💆🏻‍♀️', '💆🏻‍♂️', '💆🏼', '💆🏼‍♀️', '💆🏼‍♂️', '💆🏽', '💆🏽‍♀️', '💆🏽‍♂️', '💆🏾', '💆🏾‍♀️', '💆🏾‍♂️', '💆🏿', '💆🏿‍♀️', '💆🏿‍♂️', '👋', '🤚', '🖐', '✋', '🖖', '👌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙'],
  'Yüz İfadeleri': ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '😌', '😴', '🤤', '😪', '😵'],
  'El İşaretleri': ['👋', '🤚', '🖐', '✋', '🖖', '👌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👍', '👎', '✊', '👊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏'],
  'Spor & Aktiviteler': ['🏃', '🏃‍♀️', '🏃‍♂️', '🚶', '🚶‍♀️', '🚶‍♂️', '💃', '🕺', '🏋️', '🏋️‍♀️', '🏋️‍♂️', '🤸', '🤸‍♀️', '🤸‍♂️', '⛹️', '⛹️‍♀️', '⛹️‍♂️', '🤾', '🤾‍♀️', '🤾‍♂️'],
  'Yiyecek & İçecek': ['🍎', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦', '🥬', '🥒', '🌶', '🌽', '🥕', '🥔', '🍠', '🥐', '🥯', '🍞', '🥖', '🥨', '🍵', '☕', '🥤', '🧃', '🧉'],
  'Doğa': ['🌿', '🌱', '🌲', '🌳', '🌴', '🌵', '🌾', '🌷', '🌹', '🌺', '🌻', '🌼', '🌸', '🌍', '🌎', '🌏', '🌊', '🌋', '⛰', '🏔', '🏞', '🌅', '🌄', '🌆', '🌇'],
  'Semboller': ['✨', '⭐', '🌟', '💫', '⚡', '🔥', '💧', '🌊', '☀️', '🌙', '💎', '🎯', '🎨', '🎭', '🎪', '🎬', '🎤', '🎧', '🎵', '🎶']
}

export default function HeroBlockEditor({ content: initialContent, onUpdate }: HeroBlockEditorProps) {
  const [content, setContent] = useState<HeroContent>(() => ({
    ...getDefaultContent(),
    ...initialContent
  }))
  
  const [expandedStyleFields, setExpandedStyleFields] = useState<string[]>([])
  const [uploadingHeroImage, setUploadingHeroImage] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [emojiSearch, setEmojiSearch] = useState('')
  const [showPrimaryIconPicker, setShowPrimaryIconPicker] = useState(false)
  const [showSecondaryIconPicker, setShowSecondaryIconPicker] = useState(false)
  const [iconSearch, setIconSearch] = useState('')
  const debounceRef = useRef<NodeJS.Timeout | null>(null)
  const isInitialMount = useRef(true)

  // Update local state when parent content changes
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }
    const contentStr = JSON.stringify(initialContent)
    const localStr = JSON.stringify(content)
    if (contentStr !== localStr) {
      setContent({
        ...getDefaultContent(),
        ...initialContent
      })
    }
  }, [initialContent])

  // Debounced update to parent
  const debouncedUpdate = useCallback((newContent: HeroContent) => {
    if (isInitialMount.current) return
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }
    debounceRef.current = setTimeout(() => {
      onUpdate(newContent)
    }, 500)
  }, [onUpdate])

  // Handle content updates
  const updateContent = useCallback((updates: Partial<HeroContent>) => {
    setContent(prev => {
      const newContent = { ...prev, ...updates }
      debouncedUpdate(newContent)
      return newContent
    })
  }, [debouncedUpdate])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [])

  // Handle image upload
  const handleHeroImageUpload = async (file: File) => {
    setUploadingHeroImage(true)
    try {
      const token = localStorage.getItem('adminToken')
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', 'hero')
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      })
      const data = await response.json()
      if (data.success) {
        updateContent({
          image: { ...content.image, url: data.data.url }
        })
      }
    } catch (error) {
      console.error('Failed to upload image:', error)
    } finally {
      setUploadingHeroImage(false)
    }
  }

  // Handle image delete
  const handleHeroImageDelete = async () => {
    const imageUrl = content.image?.url
    if (!imageUrl || !imageUrl.startsWith('/uploads/')) {
      updateContent({
        image: { ...content.image, url: '' }
      })
      return
    }
    if (!confirm('Hero görseli silinecek. Bu işlem geri alınamaz. Devam etmek istiyor musunuz?')) return
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`/api/upload?url=${encodeURIComponent(imageUrl)}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      if (data.success) {
        updateContent({
          image: { ...content.image, url: '' }
        })
      }
    } catch (error) {
      console.error('Failed to delete image:', error)
    }
  }

  // Update style field
  const updateStyleField = (fieldName: string, styleKey: string, value: string) => {
    setContent(prev => {
      const newStyles = {
        ...prev.styles,
        [fieldName]: {
          ...prev.styles?.[fieldName],
          [styleKey]: value
        }
      }
      const newContent = { ...prev, styles: newStyles }
      debouncedUpdate(newContent)
      return newContent
    })
  }

  // Update image style field
  const updateImageStyleField = (field: string, value: string) => {
    setContent(prev => {
      const newImageStyles = {
        ...prev.imageStyles,
        [field]: value
      }
      const newContent = { ...prev, imageStyles: newImageStyles }
      debouncedUpdate(newContent)
      return newContent
    })
  }

  // Toggle style field expansion
  const toggleStyleField = (fieldName: string) => {
    setExpandedStyleFields(prev =>
      prev.includes(fieldName)
        ? prev.filter(f => f !== fieldName)
        : [...prev, fieldName]
    )
  }

  // Simple style editor component
  const renderStyleEditor = (fieldName: string, label: string, hasBackground = false, hasBorder = false) => {
    const styles = content.styles?.[fieldName] || {}
    const isExpanded = expandedStyleFields.includes(fieldName)
    const defaultStyles = getDefaultContent().styles?.[fieldName] || {}

    return (
      <div className="mt-2">
        <button
          type="button"
          onClick={() => toggleStyleField(fieldName)}
          className={`flex items-center gap-2 text-sm font-medium transition-colors ${
            isExpanded ? 'text-sage-600' : 'text-gray-500 hover:text-sage-600'
          }`}
        >
          <svg
            className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          {label}
        </button>

        {isExpanded && (
          <div className="mt-3 p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-4">
            {/* Typography Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Font Ailesi</label>
                <select
                  value={styles.fontFamily || defaultStyles.fontFamily || 'system-ui'}
                  onChange={(e) => updateStyleField(fieldName, 'fontFamily', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                >
                  <option value="system-ui">System UI</option>
                  <option value="Inter, sans-serif">Inter</option>
                  <option value="Georgia, serif">Georgia (Serif)</option>
                  <option value="Playfair Display, serif">Playfair Display</option>
                  <option value="Roboto, sans-serif">Roboto</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Font Boyutu</label>
                <select
                  value={styles.fontSize || defaultStyles.fontSize || '16px'}
                  onChange={(e) => updateStyleField(fieldName, 'fontSize', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                >
                  <option value="12px">12px</option>
                  <option value="14px">14px</option>
                  <option value="16px">16px</option>
                  <option value="18px">18px</option>
                  <option value="20px">20px</option>
                  <option value="24px">24px</option>
                  <option value="32px">32px</option>
                  <option value="48px">48px</option>
                  <option value="64px">64px</option>
                  <option value="72px">72px</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Font Kalınlığı</label>
                <select
                  value={styles.fontWeight || defaultStyles.fontWeight || '400'}
                  onChange={(e) => updateStyleField(fieldName, 'fontWeight', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                >
                  <option value="300">Light (300)</option>
                  <option value="400">Normal (400)</option>
                  <option value="500">Medium (500)</option>
                  <option value="600">Semibold (600)</option>
                  <option value="700">Bold (700)</option>
                  <option value="800">Extra Bold (800)</option>
                </select>
              </div>
            </div>

            {/* Color Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Metin Rengi</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={styles.color || defaultStyles.color || '#2C2C2C'}
                    onChange={(e) => updateStyleField(fieldName, 'color', e.target.value)}
                    className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={styles.color || defaultStyles.color || '#2C2C2C'}
                    onChange={(e) => updateStyleField(fieldName, 'color', e.target.value)}
                    className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent font-mono"
                  />
                </div>
              </div>
              {hasBackground && (
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Arka Plan Rengi</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={styles.backgroundColor || defaultStyles.backgroundColor || '#9CAF88'}
                      onChange={(e) => updateStyleField(fieldName, 'backgroundColor', e.target.value)}
                      className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={styles.backgroundColor || defaultStyles.backgroundColor || '#9CAF88'}
                      onChange={(e) => updateStyleField(fieldName, 'backgroundColor', e.target.value)}
                      className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent font-mono"
                    />
                  </div>
                </div>
              )}
              {hasBorder && (
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Kenarlık Rengi</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={styles.borderColor || defaultStyles.borderColor || '#9CAF88'}
                      onChange={(e) => updateStyleField(fieldName, 'borderColor', e.target.value)}
                      className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={styles.borderColor || defaultStyles.borderColor || '#9CAF88'}
                      onChange={(e) => updateStyleField(fieldName, 'borderColor', e.target.value)}
                      className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent font-mono"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Badge */}
      <div className="p-4 bg-white rounded-xl border border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-semibold text-charcoal">Badge</label>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={content.badgeEnabled !== false}
              onChange={(e) => updateContent({ badgeEnabled: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sage-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sage-500"></div>
            <span className="ml-3 text-sm font-medium text-gray-700">
              {content.badgeEnabled !== false ? 'Aktif' : 'Pasif'}
            </span>
          </label>
        </div>
        
        {content.badgeEnabled !== false && (
          <>
            <label className="block text-xs font-medium text-gray-600 mb-2">Badge Metni</label>
            <input
              type="text"
              value={content.badge || ''}
              onChange={(e) => updateContent({ badge: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent"
              placeholder="Badge metnini girin..."
            />
            {renderStyleEditor('badge', 'Badge Stili', true)}
          </>
        )}
      </div>

      {/* Main Title */}
      <div className="p-4 bg-white rounded-xl border border-gray-200">
        <label className="block text-sm font-semibold text-charcoal mb-2">Ana Başlık</label>
        <input
          type="text"
          value={content.mainTitle || ''}
          onChange={(e) => updateContent({ mainTitle: e.target.value })}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent"
        />
        {renderStyleEditor('mainTitle', 'Ana Başlık')}
      </div>

      {/* Highlighted Text */}
      <div className="p-4 bg-white rounded-xl border border-gray-200">
        <label className="block text-sm font-semibold text-charcoal mb-2">Vurgulanan Kelimeler</label>
        <p className="text-xs text-gray-500 mb-3">Ana başlıktan hangi kelimelerin vurgulanacağını seçin</p>
        
        {/* Word Selection */}
        {content.mainTitle && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <label className="block text-xs font-medium text-gray-600 mb-2">Vurgulanacak Kelimeleri Seçin:</label>
            <div className="flex flex-wrap gap-2">
              {content.mainTitle.split(' ').map((word, index) => {
                const isSelected = content.highlightedWordIndices?.includes(index) || false
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => {
                      const currentIndices = content.highlightedWordIndices || []
                      const newIndices = isSelected
                        ? currentIndices.filter(i => i !== index)
                        : [...currentIndices, index].sort((a, b) => a - b)
                      updateContent({ highlightedWordIndices: newIndices })
                    }}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      isSelected
                        ? 'bg-sage-500 text-white shadow-sm'
                        : 'bg-white text-gray-700 border border-gray-300 hover:border-sage-400'
                    }`}
                  >
                    {word} ({index + 1})
                  </button>
                )
              })}
            </div>
            {content.highlightedWordIndices && content.highlightedWordIndices.length > 0 && (
              <p className="text-xs text-sage-600 mt-2">
                Seçili kelimeler: {content.highlightedWordIndices.map(i => content.mainTitle.split(' ')[i]).join(', ')}
              </p>
            )}
          </div>
        )}
        
        {renderStyleEditor('highlightedText', 'Vurgulanan Metin Stili')}
      </div>

      {/* Subtitle */}
      <div className="p-4 bg-white rounded-xl border border-gray-200">
        <label className="block text-sm font-semibold text-charcoal mb-2">Alt Başlık</label>
        <textarea
          rows={3}
          value={content.subtitle || ''}
          onChange={(e) => updateContent({ subtitle: e.target.value })}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent"
          placeholder="Alt başlık metnini girin (boş bırakılabilir)..."
        />
        {renderStyleEditor('subtitle', 'Alt Başlık')}
      </div>

      {/* Description */}
      <div className="p-4 bg-white rounded-xl border border-gray-200">
        <label className="block text-sm font-semibold text-charcoal mb-2">Açıklama</label>
        <DescriptionRichEditor
          content={content.description || ''}
          onUpdate={(html) => updateContent({ description: html })}
        />
        {renderStyleEditor('description', 'Açıklama Stili')}
      </div>

      {/* Primary Button */}
      <div className="p-4 bg-white rounded-xl border border-gray-200">
        <label className="block text-sm font-semibold text-charcoal mb-2">Ana Buton</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Metin</label>
            <input
              type="text"
              value={content.primaryButton || ''}
              onChange={(e) => updateContent({ primaryButton: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Link</label>
            <input
              type="text"
              value={content.primaryButtonLink || ''}
              onChange={(e) => updateContent({ primaryButtonLink: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent"
            />
          </div>
        </div>
        
        {/* Icon Selection */}
        <div className="mb-4 relative">
          <label className="block text-xs font-medium text-gray-500 mb-2">İkon</label>
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={content.primaryButtonIcon || ''}
                onChange={(e) => updateContent({ primaryButtonIcon: e.target.value })}
                placeholder="SVG ikon kodu veya boş bırakın"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent text-sm font-mono"
              />
              <button
                type="button"
                onClick={() => {
                  setShowPrimaryIconPicker(!showPrimaryIconPicker)
                  setShowSecondaryIconPicker(false)
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-sage-500 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
            {content.primaryButtonIcon && (
              <button
                type="button"
                onClick={() => updateContent({ primaryButtonIcon: '' })}
                className="px-3 py-2 text-sm text-red-600 hover:text-red-700 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
              >
                Temizle
              </button>
            )}
          </div>
          
          {showPrimaryIconPicker && (
            <div className="absolute z-50 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl p-4 max-w-2xl max-h-96 overflow-y-auto">
              <div className="mb-3">
                <input
                  type="text"
                  placeholder="İkon ara..."
                  value={iconSearch}
                  onChange={(e) => setIconSearch(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500"
                />
              </div>
              <div className="space-y-4">
                {Object.entries(buttonIcons).map(([category, icons]) => {
                  const filtered = icons.filter(icon => 
                    iconSearch === '' || icon.name.toLowerCase().includes(iconSearch.toLowerCase())
                  )
                  if (filtered.length === 0) return null
                  return (
                    <div key={category} className="mb-4">
                      <div className="text-xs font-semibold text-gray-500 mb-2 uppercase">{category}</div>
                      <div className="grid grid-cols-4 gap-2">
                        {filtered.map((icon, index) => (
                          <button
                            key={`${category}-${index}`}
                            type="button"
                            onClick={() => {
                              updateContent({ 
                                primaryButtonIcon: icon.svg,
                                primaryButtonIconPosition: content.primaryButtonIconPosition || 'left'
                              })
                              setShowPrimaryIconPicker(false)
                            }}
                            className="flex flex-col items-center gap-1 p-3 border border-gray-200 rounded-lg hover:border-sage-400 hover:bg-sage-50 transition-colors"
                            title={icon.name}
                          >
                            <div 
                              className="w-6 h-6 text-gray-700"
                              dangerouslySetInnerHTML={{ __html: icon.svg }}
                            />
                            <span className="text-xs text-gray-600">{icon.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
          
          {content.primaryButtonIcon && (
            <div className="mt-3">
              <label className="block text-xs font-medium text-gray-500 mb-1">İkon Pozisyonu</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => updateContent({ primaryButtonIconPosition: 'left' })}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    content.primaryButtonIconPosition === 'left'
                      ? 'bg-sage-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Sol
                </button>
                <button
                  type="button"
                  onClick={() => updateContent({ primaryButtonIconPosition: 'right' })}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    content.primaryButtonIconPosition === 'right'
                      ? 'bg-sage-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Sağ
                </button>
              </div>
            </div>
          )}
        </div>
        
        {renderStyleEditor('primaryButton', 'Ana Buton', true)}
      </div>

      {/* Secondary Button */}
      <div className="p-4 bg-white rounded-xl border border-gray-200">
        <label className="block text-sm font-semibold text-charcoal mb-2">İkincil Buton</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Metin</label>
            <input
              type="text"
              value={content.secondaryButton || ''}
              onChange={(e) => updateContent({ secondaryButton: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Link</label>
            <input
              type="text"
              value={content.secondaryButtonLink || ''}
              onChange={(e) => updateContent({ secondaryButtonLink: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent"
            />
          </div>
        </div>
        
        {/* Icon Selection */}
        <div className="mb-4 relative">
          <label className="block text-xs font-medium text-gray-500 mb-2">İkon</label>
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={content.secondaryButtonIcon || ''}
                onChange={(e) => updateContent({ secondaryButtonIcon: e.target.value })}
                placeholder="SVG ikon kodu veya boş bırakın"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent text-sm font-mono"
              />
              <button
                type="button"
                onClick={() => {
                  setShowSecondaryIconPicker(!showSecondaryIconPicker)
                  setShowPrimaryIconPicker(false)
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-sage-500 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
            {content.secondaryButtonIcon && (
              <button
                type="button"
                onClick={() => updateContent({ secondaryButtonIcon: '' })}
                className="px-3 py-2 text-sm text-red-600 hover:text-red-700 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
              >
                Temizle
              </button>
            )}
          </div>
          
          {showSecondaryIconPicker && (
            <div className="absolute z-50 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl p-4 max-w-2xl max-h-96 overflow-y-auto">
              <div className="mb-3">
                <input
                  type="text"
                  placeholder="İkon ara..."
                  value={iconSearch}
                  onChange={(e) => setIconSearch(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500"
                />
              </div>
              <div className="space-y-4">
                {Object.entries(buttonIcons).map(([category, icons]) => {
                  const filtered = icons.filter(icon => 
                    iconSearch === '' || icon.name.toLowerCase().includes(iconSearch.toLowerCase())
                  )
                  if (filtered.length === 0) return null
                  return (
                    <div key={category} className="mb-4">
                      <div className="text-xs font-semibold text-gray-500 mb-2 uppercase">{category}</div>
                      <div className="grid grid-cols-4 gap-2">
                        {filtered.map((icon, index) => (
                          <button
                            key={`${category}-${index}`}
                            type="button"
                            onClick={() => {
                              updateContent({ 
                                secondaryButtonIcon: icon.svg,
                                secondaryButtonIconPosition: content.secondaryButtonIconPosition || 'left'
                              })
                              setShowSecondaryIconPicker(false)
                            }}
                            className="flex flex-col items-center gap-1 p-3 border border-gray-200 rounded-lg hover:border-sage-400 hover:bg-sage-50 transition-colors"
                            title={icon.name}
                          >
                            <div 
                              className="w-6 h-6 text-gray-700"
                              dangerouslySetInnerHTML={{ __html: icon.svg }}
                            />
                            <span className="text-xs text-gray-600">{icon.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
          
          {content.secondaryButtonIcon && (
            <div className="mt-3">
              <label className="block text-xs font-medium text-gray-500 mb-1">İkon Pozisyonu</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => updateContent({ secondaryButtonIconPosition: 'left' })}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    content.secondaryButtonIconPosition === 'left'
                      ? 'bg-sage-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Sol
                </button>
                <button
                  type="button"
                  onClick={() => updateContent({ secondaryButtonIconPosition: 'right' })}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    content.secondaryButtonIconPosition === 'right'
                      ? 'bg-sage-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Sağ
                </button>
              </div>
            </div>
          )}
        </div>
        
        {renderStyleEditor('secondaryButton', 'İkincil Buton', false, true)}
      </div>

      {/* Trust Indicator */}
      <div className="p-4 bg-white rounded-xl border border-gray-200 space-y-4">
        <div>
          <label className="block text-sm font-semibold text-charcoal mb-2">Güven Göstergesi (Ana Metin)</label>
          <input
            type="text"
            value={content.trustIndicator || ''}
            onChange={(e) => updateContent({ trustIndicator: e.target.value })}
            placeholder="⭐ 4,8 von 5 Sternen – Über 300 zufriedene Kund:innen"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-charcoal mb-2">Güven Göstergesi (Alt Metin)</label>
          <input
            type="text"
            value={content.trustIndicatorSubtext || ''}
            onChange={(e) => updateContent({ trustIndicatorSubtext: e.target.value })}
            placeholder="⭐ 4.9/5 Bewertungen"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">Ana güven göstergesinin altında görünecek metin</p>
        </div>

        <div className="h-px bg-gray-200" />

        <div>
          <label className="block text-sm font-semibold text-charcoal mb-2">İkinci Güven Göstergesi</label>
          <input
            type="text"
            value={content.trustIndicatorSecondary || ''}
            onChange={(e) => updateContent({ trustIndicatorSecondary: e.target.value })}
            placeholder="Kostenlose Beratung"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent mb-2"
          />
          <input
            type="text"
            value={content.trustIndicatorSecondarySubtext || ''}
            onChange={(e) => updateContent({ trustIndicatorSecondarySubtext: e.target.value })}
            placeholder="Unverbindlich & persönlich"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">İkinci güven göstergesi ve alt metni (opsiyonel)</p>
        </div>

        {renderStyleEditor('trustIndicator', 'Güven Göstergesi Stili')}
      </div>

      {/* Scroll Indicator */}
      <div className="p-4 bg-white rounded-xl border border-gray-200 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <label className="block text-sm font-semibold text-charcoal mb-1">Scroll Göstergesi</label>
            <p className="text-xs text-gray-500">Sayfanın altında görünen scroll animasyonu</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={content.scrollIndicator?.enabled !== false}
              onChange={(e) => updateContent({
                scrollIndicator: {
                  ...content.scrollIndicator,
                  enabled: e.target.checked,
                  text: content.scrollIndicator?.text || 'Scrollen Sie nach unten',
                  position: content.scrollIndicator?.position || { vertical: 'bottom', horizontal: 'center' }
                }
              })}
              className="sr-only peer"
            />
            <div className={`w-11 h-6 rounded-full peer transition-colors ${
              content.scrollIndicator?.enabled !== false 
                ? 'bg-sage-500' 
                : 'bg-gray-200'
            } peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sage-300 peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all`}></div>
          </label>
        </div>

        {content.scrollIndicator?.enabled !== false && (
          <>
            <div>
              <label className="block text-sm font-semibold text-charcoal mb-2">Metin</label>
              <input
                type="text"
                value={content.scrollIndicator?.text || ''}
                onChange={(e) => updateContent({
                  scrollIndicator: {
                    ...content.scrollIndicator,
                    text: e.target.value,
                    enabled: content.scrollIndicator?.enabled !== false,
                    position: content.scrollIndicator?.position || { vertical: 'bottom', horizontal: 'center' }
                  }
                })}
                placeholder="Scrollen Sie nach unten"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-charcoal mb-3">Pozisyon</label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-2">Dikey Konum</label>
                  <select
                    value={content.scrollIndicator?.position?.vertical || 'bottom'}
                    onChange={(e) => updateContent({
                      scrollIndicator: {
                        ...content.scrollIndicator,
                        enabled: content.scrollIndicator?.enabled !== false,
                        text: content.scrollIndicator?.text || 'Scrollen Sie nach unten',
                        position: {
                          ...content.scrollIndicator?.position,
                          vertical: e.target.value as 'top' | 'center' | 'bottom',
                          horizontal: content.scrollIndicator?.position?.horizontal || 'center'
                        }
                      }
                    })}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent bg-white"
                  >
                    <option value="top">Üst</option>
                    <option value="center">Orta</option>
                    <option value="bottom">Alt</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-2">Yatay Konum</label>
                  <select
                    value={content.scrollIndicator?.position?.horizontal || 'center'}
                    onChange={(e) => updateContent({
                      scrollIndicator: {
                        ...content.scrollIndicator,
                        enabled: content.scrollIndicator?.enabled !== false,
                        text: content.scrollIndicator?.text || 'Scrollen Sie nach unten',
                        position: {
                          ...content.scrollIndicator?.position,
                          vertical: content.scrollIndicator?.position?.vertical || 'bottom',
                          horizontal: e.target.value as 'left' | 'center' | 'right'
                        }
                      }
                    })}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent bg-white"
                  >
                    <option value="left">Sol</option>
                    <option value="center">Orta</option>
                    <option value="right">Sağ</option>
                  </select>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Hero Image Section */}
      <div className="p-4 bg-white rounded-xl border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <label className="block text-sm font-semibold text-charcoal">Hero Görseli</label>
            <p className="text-xs text-gray-500 mt-1">Hero bölümünde gösterilen ana görsel - Max 5MB - JPG, PNG, WebP, GIF</p>
          </div>
          {content.image?.url && (
            <span className={`text-xs px-2 py-1 rounded-full ${
              content.image.url.startsWith('/uploads/')
                ? 'bg-green-100 text-green-700'
                : 'bg-blue-100 text-blue-700'
            }`}>
              {content.image.url.startsWith('/uploads/') ? 'Yüklendi' : 'Harici'}
            </span>
          )}
        </div>

        {/* Image Preview */}
        <div className="mb-4 relative group">
          {content.image?.url ? (
            <>
              <img
                src={content.image.url}
                alt={content.image?.alt || 'Hero görsel'}
                className="w-full h-48 object-cover rounded-xl border border-gray-200"
                style={{
                  borderRadius: content.imageStyles?.borderRadius || '24px',
                  filter: `brightness(${content.imageStyles?.brightness || 100}%) contrast(${content.imageStyles?.contrast || 100}%) saturate(${content.imageStyles?.saturation || 100}%)`,
                  opacity: parseInt(content.imageStyles?.opacity || '100') / 100,
                }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x400?text=Görsel+Yüklenemedi'
                }}
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-3">
                <label className="cursor-pointer bg-white hover:bg-gray-100 text-charcoal px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleHeroImageUpload(file)
                    }}
                    disabled={uploadingHeroImage}
                  />
                  {uploadingHeroImage ? (
                    <div className="animate-spin h-5 w-5 border-2 border-sage-500 border-t-transparent rounded-full"></div>
                  ) : (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  )}
                  <span className="text-sm font-medium">Değiştir</span>
                </label>
                <button
                  type="button"
                  onClick={handleHeroImageDelete}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span className="text-sm font-medium">Sil</span>
                </button>
              </div>
            </>
          ) : (
            <label className="w-full h-48 border-2 border-dashed border-sage-300 hover:border-sage-500 hover:bg-sage-50 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors">
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleHeroImageUpload(file)
                }}
                disabled={uploadingHeroImage}
              />
              {uploadingHeroImage ? (
                <div className="flex flex-col items-center">
                  <div className="animate-spin h-10 w-10 border-3 border-sage-500 border-t-transparent rounded-full mb-2"></div>
                  <span className="text-sm text-sage-600">Yükleniyor...</span>
                </div>
              ) : (
                <>
                  <svg className="h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span className="text-sm text-gray-500 font-medium">Hero görseli yükle</span>
                  <span className="text-xs text-gray-400 mt-1">veya URL girin</span>
                </>
              )}
            </label>
          )}
        </div>

        {/* URL & Alt Text */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Görsel URL</label>
            <input
              type="text"
              value={content.image?.url || ''}
              onChange={(e) => updateContent({
                image: { ...content.image, url: e.target.value }
              })}
              placeholder="https://..."
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Alt Metin (SEO)</label>
            <input
              type="text"
              value={content.image?.alt || ''}
              onChange={(e) => updateContent({
                image: { ...content.image, alt: e.target.value }
              })}
              placeholder="Görsel açıklaması..."
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Image Effects */}
        <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-sage-50 rounded-xl border border-purple-100">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">✨</span>
            <h4 className="text-sm font-semibold text-charcoal">Görsel Efektleri</h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Köşe Yuvarlaklığı</label>
              <select
                value={content.imageStyles?.borderRadius || '24px'}
                onChange={(e) => updateImageStyleField('borderRadius', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
              >
                <option value="0px">Keskin (0px)</option>
                <option value="8px">Hafif (8px)</option>
                <option value="16px">Orta (16px)</option>
                <option value="24px">Yuvarlak (24px)</option>
                <option value="32px">Çok Yuvarlak (32px)</option>
                <option value="9999px">Tam Yuvarlak</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Gölge</label>
              <select
                value={content.imageStyles?.boxShadow || '0 25px 50px -12px rgba(0, 0, 0, 0.25)'}
                onChange={(e) => updateImageStyleField('boxShadow', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
              >
                <option value="none">Gölge Yok</option>
                <option value="0 4px 6px -1px rgba(0, 0, 0, 0.1)">Hafif</option>
                <option value="0 10px 15px -3px rgba(0, 0, 0, 0.1)">Orta</option>
                <option value="0 25px 50px -12px rgba(0, 0, 0, 0.25)">Büyük</option>
                <option value="0 35px 60px -15px rgba(0, 0, 0, 0.3)">Ekstra Büyük</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Opaklık: {content.imageStyles?.opacity || 100}%
              </label>
              <input
                type="range"
                min="20"
                max="100"
                value={content.imageStyles?.opacity || 100}
                onChange={(e) => updateImageStyleField('opacity', e.target.value)}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-sage-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Hover Zoom: {content.imageStyles?.hoverScale || 105}%
              </label>
              <input
                type="range"
                min="100"
                max="120"
                value={content.imageStyles?.hoverScale || 105}
                onChange={(e) => updateImageStyleField('hoverScale', e.target.value)}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-sage-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Parlaklık: {content.imageStyles?.brightness || 100}%
              </label>
              <input
                type="range"
                min="50"
                max="150"
                value={content.imageStyles?.brightness || 100}
                onChange={(e) => updateImageStyleField('brightness', e.target.value)}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-yellow-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Kontrast: {content.imageStyles?.contrast || 100}%
              </label>
              <input
                type="range"
                min="50"
                max="150"
                value={content.imageStyles?.contrast || 100}
                onChange={(e) => updateImageStyleField('contrast', e.target.value)}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Doygunluk: {content.imageStyles?.saturation || 100}%
              </label>
              <input
                type="range"
                min="0"
                max="200"
                value={content.imageStyles?.saturation || 100}
                onChange={(e) => updateImageStyleField('saturation', e.target.value)}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pink-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Overlay Opaklığı: {content.imageStyles?.overlayOpacity || 20}%
              </label>
              <input
                type="range"
                min="0"
                max="80"
                value={content.imageStyles?.overlayOpacity || 20}
                onChange={(e) => updateImageStyleField('overlayOpacity', e.target.value)}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Overlay Rengi</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={content.imageStyles?.overlayColor || '#2C2C2C'}
                  onChange={(e) => updateImageStyleField('overlayColor', e.target.value)}
                  className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer"
                />
                <input
                  type="text"
                  value={content.imageStyles?.overlayColor || '#2C2C2C'}
                  onChange={(e) => updateImageStyleField('overlayColor', e.target.value)}
                  className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent font-mono"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Floating Elements */}
      <div className="p-4 bg-white rounded-xl border border-gray-200 space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg">🎨</span>
          <h4 className="text-sm font-semibold text-charcoal">Resim Üzeri Elementler</h4>
        </div>

        {/* Status Badge */}
        <div className="space-y-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-semibold text-charcoal mb-1">Durum Rozeti</label>
              <p className="text-xs text-gray-500">"Jetzt geöffnet" gibi durum göstergesi</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={content.imageFloatingElements?.statusBadge?.enabled !== false}
                onChange={(e) => updateContent({
                  imageFloatingElements: {
                    ...content.imageFloatingElements,
                    statusBadge: {
                      ...content.imageFloatingElements?.statusBadge,
                      enabled: e.target.checked,
                      text: content.imageFloatingElements?.statusBadge?.text || 'Jetzt geöffnet',
                      position: content.imageFloatingElements?.statusBadge?.position || { vertical: 'top', horizontal: 'left' }
                    }
                  }
                })}
                className="sr-only peer"
              />
              <div className={`w-11 h-6 rounded-full peer transition-colors ${
                content.imageFloatingElements?.statusBadge?.enabled !== false 
                  ? 'bg-sage-500' 
                  : 'bg-gray-200'
              } peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sage-300 peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all`}></div>
            </label>
          </div>

          {content.imageFloatingElements?.statusBadge?.enabled !== false && (
            <>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">Metin</label>
                <input
                  type="text"
                  value={content.imageFloatingElements?.statusBadge?.text || ''}
                  onChange={(e) => updateContent({
                    imageFloatingElements: {
                      ...content.imageFloatingElements,
                      statusBadge: {
                        ...content.imageFloatingElements?.statusBadge,
                        text: e.target.value,
                        enabled: true,
                        position: content.imageFloatingElements?.statusBadge?.position || { vertical: 'top', horizontal: 'left' }
                      }
                    }
                  })}
                  placeholder="Jetzt geöffnet"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Dikey</label>
                  <select
                    value={content.imageFloatingElements?.statusBadge?.position?.vertical || 'top'}
                    onChange={(e) => updateContent({
                      imageFloatingElements: {
                        ...content.imageFloatingElements,
                        statusBadge: {
                          ...content.imageFloatingElements?.statusBadge,
                          position: {
                            ...content.imageFloatingElements?.statusBadge?.position,
                            vertical: e.target.value as 'top' | 'center' | 'bottom',
                            horizontal: content.imageFloatingElements?.statusBadge?.position?.horizontal || 'left'
                          }
                        }
                      }
                    })}
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500"
                  >
                    <option value="top">Üst</option>
                    <option value="center">Orta</option>
                    <option value="bottom">Alt</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Yatay</label>
                  <select
                    value={content.imageFloatingElements?.statusBadge?.position?.horizontal || 'left'}
                    onChange={(e) => updateContent({
                      imageFloatingElements: {
                        ...content.imageFloatingElements,
                        statusBadge: {
                          ...content.imageFloatingElements?.statusBadge,
                          position: {
                            ...content.imageFloatingElements?.statusBadge?.position,
                            vertical: content.imageFloatingElements?.statusBadge?.position?.vertical || 'top',
                            horizontal: e.target.value as 'left' | 'center' | 'right'
                          }
                        }
                      }
                    })}
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500"
                  >
                    <option value="left">Sol</option>
                    <option value="center">Orta</option>
                    <option value="right">Sağ</option>
                  </select>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Premium Card */}
        <div className="space-y-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-semibold text-charcoal mb-1">Premium Kart</label>
              <p className="text-xs text-gray-500">Hizmet kartı (emoji, başlık, alt metin)</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={content.imageFloatingElements?.premiumCard?.enabled !== false}
                onChange={(e) => updateContent({
                  imageFloatingElements: {
                    ...content.imageFloatingElements,
                    premiumCard: {
                      ...content.imageFloatingElements?.premiumCard,
                      enabled: e.target.checked,
                      emoji: content.imageFloatingElements?.premiumCard?.emoji || '🧘🏻‍♀️',
                      title: content.imageFloatingElements?.premiumCard?.title || 'Premium Headspa',
                      subtitle: content.imageFloatingElements?.premiumCard?.subtitle || '90 Min • ab 85€',
                      position: content.imageFloatingElements?.premiumCard?.position || { vertical: 'bottom', horizontal: 'left' }
                    }
                  }
                })}
                className="sr-only peer"
              />
              <div className={`w-11 h-6 rounded-full peer transition-colors ${
                content.imageFloatingElements?.premiumCard?.enabled !== false 
                  ? 'bg-sage-500' 
                  : 'bg-gray-200'
              } peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sage-300 peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all`}></div>
            </label>
          </div>

          {content.imageFloatingElements?.premiumCard?.enabled !== false && (
            <>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Icon/Emoji</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={content.imageFloatingElements?.premiumCard?.emoji || ''}
                      onChange={(e) => updateContent({
                        imageFloatingElements: {
                          ...content.imageFloatingElements,
                          premiumCard: {
                            ...content.imageFloatingElements?.premiumCard,
                            emoji: e.target.value,
                            enabled: true,
                            position: content.imageFloatingElements?.premiumCard?.position || { vertical: 'bottom', horizontal: 'left' }
                          }
                        }
                      })}
                      placeholder="🧘🏻‍♀️"
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const currentEmoji = content.imageFloatingElements?.premiumCard?.emoji || ''
                        setShowEmojiPicker(!showEmojiPicker)
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-sage-500 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                  </div>
                  {showEmojiPicker && (
                    <div className="absolute z-50 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl p-4 max-w-xs">
                      <div className="mb-3">
                        <input
                          type="text"
                          placeholder="Emoji ara..."
                          value={emojiSearch}
                          onChange={(e) => setEmojiSearch(e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500"
                        />
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        {Object.entries(emojiCategories).map(([category, emojis]) => {
                          const filtered = emojis.filter(emoji => 
                            emojiSearch === '' || emoji.includes(emojiSearch)
                          )
                          if (filtered.length === 0) return null
                          return (
                            <div key={category} className="mb-4">
                              <div className="text-xs font-semibold text-gray-500 mb-2 uppercase">{category}</div>
                              <div className="grid grid-cols-8 gap-1">
                                {filtered.map((emoji, index) => (
                                  <button
                                    key={`${category}-${index}-${emoji}`}
                                    type="button"
                                    onClick={() => {
                                      updateContent({
                                        imageFloatingElements: {
                                          ...content.imageFloatingElements,
                                          premiumCard: {
                                            ...content.imageFloatingElements?.premiumCard,
                                            emoji: emoji,
                                            enabled: true,
                                            position: content.imageFloatingElements?.premiumCard?.position || { vertical: 'bottom', horizontal: 'left' }
                                          }
                                        }
                                      })
                                      setShowEmojiPicker(false)
                                    }}
                                    className="w-8 h-8 flex items-center justify-center text-lg hover:bg-gray-100 rounded-lg transition-colors"
                                  >
                                    {emoji}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Başlık</label>
                  <input
                    type="text"
                    value={content.imageFloatingElements?.premiumCard?.title || ''}
                    onChange={(e) => updateContent({
                      imageFloatingElements: {
                        ...content.imageFloatingElements,
                        premiumCard: {
                          ...content.imageFloatingElements?.premiumCard,
                          title: e.target.value,
                          enabled: true,
                          position: content.imageFloatingElements?.premiumCard?.position || { vertical: 'bottom', horizontal: 'left' }
                        }
                      }
                    })}
                    placeholder="Premium Headspa"
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Alt Metin</label>
                <input
                  type="text"
                  value={content.imageFloatingElements?.premiumCard?.subtitle || ''}
                  onChange={(e) => updateContent({
                    imageFloatingElements: {
                      ...content.imageFloatingElements,
                      premiumCard: {
                        ...content.imageFloatingElements?.premiumCard,
                        subtitle: e.target.value,
                        enabled: true,
                        position: content.imageFloatingElements?.premiumCard?.position || { vertical: 'bottom', horizontal: 'left' }
                      }
                    }
                  })}
                  placeholder="90 Min • ab 85€"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Dikey</label>
                  <select
                    value={content.imageFloatingElements?.premiumCard?.position?.vertical || 'bottom'}
                    onChange={(e) => updateContent({
                      imageFloatingElements: {
                        ...content.imageFloatingElements,
                        premiumCard: {
                          ...content.imageFloatingElements?.premiumCard,
                          position: {
                            ...content.imageFloatingElements?.premiumCard?.position,
                            vertical: e.target.value as 'top' | 'center' | 'bottom',
                            horizontal: content.imageFloatingElements?.premiumCard?.position?.horizontal || 'left'
                          }
                        }
                      }
                    })}
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500"
                  >
                    <option value="top">Üst</option>
                    <option value="center">Orta</option>
                    <option value="bottom">Alt</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Yatay</label>
                  <select
                    value={content.imageFloatingElements?.premiumCard?.position?.horizontal || 'left'}
                    onChange={(e) => updateContent({
                      imageFloatingElements: {
                        ...content.imageFloatingElements,
                        premiumCard: {
                          ...content.imageFloatingElements?.premiumCard,
                          position: {
                            ...content.imageFloatingElements?.premiumCard?.position,
                            vertical: content.imageFloatingElements?.premiumCard?.position?.vertical || 'bottom',
                            horizontal: e.target.value as 'left' | 'center' | 'right'
                          }
                        }
                      }
                    })}
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500"
                  >
                    <option value="left">Sol</option>
                    <option value="center">Orta</option>
                    <option value="right">Sağ</option>
                  </select>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Reviews Badge */}
        <div className="space-y-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-semibold text-charcoal mb-1">Değerlendirme Rozeti</label>
              <p className="text-xs text-gray-500">Google Reviews gibi değerlendirme göstergesi</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={content.imageFloatingElements?.reviewsBadge?.enabled !== false}
                onChange={(e) => updateContent({
                  imageFloatingElements: {
                    ...content.imageFloatingElements,
                    reviewsBadge: {
                      ...content.imageFloatingElements?.reviewsBadge,
                      enabled: e.target.checked,
                      rating: content.imageFloatingElements?.reviewsBadge?.rating || '4.9',
                      text: content.imageFloatingElements?.reviewsBadge?.text || 'Google Reviews',
                      position: content.imageFloatingElements?.reviewsBadge?.position || { vertical: 'top', horizontal: 'right' }
                    }
                  }
                })}
                className="sr-only peer"
              />
              <div className={`w-11 h-6 rounded-full peer transition-colors ${
                content.imageFloatingElements?.reviewsBadge?.enabled !== false 
                  ? 'bg-sage-500' 
                  : 'bg-gray-200'
              } peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sage-300 peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all`}></div>
            </label>
          </div>

          {content.imageFloatingElements?.reviewsBadge?.enabled !== false && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Puan</label>
                  <input
                    type="text"
                    value={content.imageFloatingElements?.reviewsBadge?.rating || ''}
                    onChange={(e) => updateContent({
                      imageFloatingElements: {
                        ...content.imageFloatingElements,
                        reviewsBadge: {
                          ...content.imageFloatingElements?.reviewsBadge,
                          rating: e.target.value,
                          enabled: true,
                          position: content.imageFloatingElements?.reviewsBadge?.position || { vertical: 'top', horizontal: 'right' }
                        }
                      }
                    })}
                    placeholder="4.9"
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Metin</label>
                  <input
                    type="text"
                    value={content.imageFloatingElements?.reviewsBadge?.text || ''}
                    onChange={(e) => updateContent({
                      imageFloatingElements: {
                        ...content.imageFloatingElements,
                        reviewsBadge: {
                          ...content.imageFloatingElements?.reviewsBadge,
                          text: e.target.value,
                          enabled: true,
                          position: content.imageFloatingElements?.reviewsBadge?.position || { vertical: 'top', horizontal: 'right' }
                        }
                      }
                    })}
                    placeholder="Google Reviews"
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Dikey</label>
                  <select
                    value={content.imageFloatingElements?.reviewsBadge?.position?.vertical || 'top'}
                    onChange={(e) => updateContent({
                      imageFloatingElements: {
                        ...content.imageFloatingElements,
                        reviewsBadge: {
                          ...content.imageFloatingElements?.reviewsBadge,
                          position: {
                            ...content.imageFloatingElements?.reviewsBadge?.position,
                            vertical: e.target.value as 'top' | 'center' | 'bottom',
                            horizontal: content.imageFloatingElements?.reviewsBadge?.position?.horizontal || 'right'
                          }
                        }
                      }
                    })}
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500"
                  >
                    <option value="top">Üst</option>
                    <option value="center">Orta</option>
                    <option value="bottom">Alt</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Yatay</label>
                  <select
                    value={content.imageFloatingElements?.reviewsBadge?.position?.horizontal || 'right'}
                    onChange={(e) => updateContent({
                      imageFloatingElements: {
                        ...content.imageFloatingElements,
                        reviewsBadge: {
                          ...content.imageFloatingElements?.reviewsBadge,
                          position: {
                            ...content.imageFloatingElements?.reviewsBadge?.position,
                            vertical: content.imageFloatingElements?.reviewsBadge?.position?.vertical || 'top',
                            horizontal: e.target.value as 'left' | 'center' | 'right'
                          }
                        }
                      }
                    })}
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500"
                  >
                    <option value="left">Sol</option>
                    <option value="center">Orta</option>
                    <option value="right">Sağ</option>
                  </select>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Section ID */}
        <div className="space-y-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
          <div>
            <label className="block text-sm font-semibold text-charcoal mb-2">Bölüm ID (Section ID)</label>
            <p className="text-xs text-gray-500 mb-3">Sayfa içi navigasyon için kullanılır (örn: pricing)</p>
            <input
              type="text"
              value={content.sectionId || ''}
              onChange={(e) => {
                // Remove # character if user types it
                const value = e.target.value.replace(/^#/, '')
                updateContent({ sectionId: value })
              }}
              placeholder="home"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent font-mono"
            />
            <p className="text-xs text-gray-400 mt-2">
              Link'lerde kullanmak için: #{content.sectionId || 'home'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

