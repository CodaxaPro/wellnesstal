import { TextContent } from '../../types'

import { getDefaultTextContent } from './defaults'

// Problem Definition Block - Referans sayfadan
export const getProblemTextContent = (): TextContent => ({
  ...getDefaultTextContent(),
  stylePreset: 'problem',
  title: 'Kopf voller Gedanken?',
  content: `Erlebe ein einzigartiges Headspa-Ritual, das Stress löst, den Geist beruhigt und neue Energie schenkt. Ideal für alle, die abschalten, regenerieren und sich selbst etwas Gutes tun möchten.`,
  showTitle: true,
  showSubtitle: false,
  maxWidth: 'xl',
  padding: {
    top: '4rem',
    bottom: '4rem',
    left: '1.5rem',
    right: '1.5rem'
  },
  typography: {
    title: {
      enabled: true,
      fontSize: '2.5rem',
      fontWeight: '700',
      lineHeight: '1.2',
      letterSpacing: '-0.02em',
      color: '#2C2C2C',
      marginBottom: '1.5rem'
    },
    subtitle: {
      enabled: false,
      fontSize: '1.25rem',
      fontWeight: '400',
      lineHeight: '1.5',
      color: '#64748b',
      marginBottom: '1.5rem'
    },
    body: {
      fontSize: '1.125rem',
      fontWeight: '400',
      lineHeight: '1.75',
      letterSpacing: '0',
      color: '#666666',
      paragraphSpacing: '1.5rem'
    },
    dropCap: {
      enabled: false,
      lines: 3,
      fontSize: '4rem',
      fontWeight: '700',
      color: '#10b981',
      marginRight: '0.5rem'
    },
    links: {
      color: '#9CAF88',
      hoverColor: '#637554',
      decoration: 'underline',
      hoverDecoration: 'none'
    }
  },
  background: {
    type: 'solid',
    color: '#f7f5f3'
  }
})

// Solution Block - Referans sayfadan
export const getSolutionTextContent = (): TextContent => ({
  ...getDefaultTextContent(),
  stylePreset: 'solution',
  title: 'Was ist Headspa?',
  content: `Headspa ist eine ganzheitliche Kopfhaut- und Kopfmassage, die aus Japan stammt und inzwischen weltweit für ihre entspannende und regenerierende Wirkung geschätzt wird. Diese besondere Behandlung kombiniert sanfte Massagetechniken mit hochwertigen Pflegeprodukten, um nicht nur die Kopfhaut zu pflegen, sondern auch den gesamten Körper zu entspannen.`,
  showTitle: true,
  showSubtitle: false,
  maxWidth: 'xl',
  padding: {
    top: '4rem',
    bottom: '4rem',
    left: '1.5rem',
    right: '1.5rem'
  },
  typography: {
    title: {
      enabled: true,
      fontSize: '2.5rem',
      fontWeight: '700',
      lineHeight: '1.2',
      letterSpacing: '-0.02em',
      color: '#2C2C2C',
      marginBottom: '1.5rem'
    },
    subtitle: {
      enabled: false,
      fontSize: '1.25rem',
      fontWeight: '400',
      lineHeight: '1.5',
      color: '#64748b',
      marginBottom: '1.5rem'
    },
    body: {
      fontSize: '1.125rem',
      fontWeight: '400',
      lineHeight: '1.75',
      letterSpacing: '0',
      color: '#666666',
      paragraphSpacing: '1.5rem'
    },
    dropCap: {
      enabled: false,
      lines: 3,
      fontSize: '4rem',
      fontWeight: '700',
      color: '#10b981',
      marginRight: '0.5rem'
    },
    links: {
      color: '#9CAF88',
      hoverColor: '#637554',
      decoration: 'underline',
      hoverDecoration: 'none'
    }
  },
  background: {
    type: 'solid',
    color: '#ffffff'
  }
})

