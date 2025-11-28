/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Wellnesstal Brand Colors
        sage: {
          50: '#f7f8f5',
          100: '#eef1ea',
          200: '#dce3d4',
          300: '#c4d0b7',
          400: '#a8ba95',
          500: '#9CAF88', // Primary sage
          600: '#7a9268',
          700: '#637554',
          800: '#515e46',
          900: '#434e3b',
        },
        earth: {
          50: '#faf8f5',
          100: '#f5f1eb',
          200: '#ebe2d4',
          300: '#ddc9b2',
          400: '#D4B996', // Secondary earth
          500: '#c5a380',
          600: '#b18d69',
          700: '#947658',
          800: '#79614b',
          900: '#63503f',
        },
        forest: {
          50: '#f5f7f1',
          100: '#eaefe2',
          200: '#d6dec6',
          300: '#bbc8a2',
          400: '#9db17a',
          500: '#829d5a',
          600: '#6B8A3A', // Accent forest
          700: '#546e2e',
          800: '#445827',
          900: '#3a4a24',
        },
        cream: '#F7F5F3',
        charcoal: '#2C2C2C',
        'gray-custom': '#666666',
      },
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px rgba(0,0,0,0.08)',
        'medium': '0 8px 30px rgba(0,0,0,0.12)',
        'large': '0 16px 40px rgba(0,0,0,0.16)',
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '20px',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '88': '22rem',
        '96': '24rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'scale-in': 'scaleIn 0.4s ease-out',
        'float': 'float 3s ease-in-out infinite',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'wellness-gradient': 'linear-gradient(135deg, #9CAF88 0%, #6B8A3A 100%)',
        'cream-gradient': 'linear-gradient(135deg, #F7F5F3 0%, #FFFFFF 100%)',
      },
      screens: {
        'xs': '475px',
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
          '2xl': '6rem',
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}