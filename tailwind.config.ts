import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ivory: '#FAF7F2',
        beige: '#F0EBE3',
        stone: '#E8E4DD',
        champagne: '#C4B5A0',
        charcoal: '#2A2A28',
        ink: '#0D0D0C',
        wood: '#8B7355',
        gold: '#B8956B',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        luxury: '0.2em',
        wide: '0.35em',
      },
      transitionTimingFunction: {
        luxury: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      animation: {
        'fade-up': 'fadeUp 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'slow-zoom': 'slowZoom 20s ease-out infinite alternate',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(32px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slowZoom: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.08)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
