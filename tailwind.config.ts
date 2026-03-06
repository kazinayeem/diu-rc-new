import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand palette — futuristic robotics university theme
        brand: {
          cyan:    '#3DB5D8',
          blue:    '#2F6BFF',
          purple:  '#5B4BFF',
          soft:    '#8ED6E6',
          electric:'#00D4FF',
          bg:      '#0B1F3A',
          card:    '#0F2645',
          dark:    '#0B1F3A',
        },
        // Legacy aliases
        primary: {
          50:  '#e8f8fd',
          100: '#c4edfa',
          200: '#8ED6E6',
          300: '#3DB5D8',
          400: '#3DB5D8',
          500: '#2F6BFF',
          600: '#2F6BFF',
          700: '#5B4BFF',
          800: '#0F2645',
          900: '#0B1F3A',
        },
        dark: {
          50:  '#e2f3f8',
          100: '#b8dcea',
          200: '#8ED6E6',
          300: '#3DB5D8',
          400: '#2F6BFF',
          500: '#5B4BFF',
          600: '#0F2645',
          700: '#0B1F3A',
          800: '#0B1F3A',
          900: '#060f1e',
        },
      },
      backgroundImage: {
        'gradient-brand':    'linear-gradient(135deg, #2F6BFF 0%, #5B4BFF 100%)',
        'gradient-cyan':     'linear-gradient(135deg, #3DB5D8 0%, #2F6BFF 100%)',
        'gradient-hero':     'linear-gradient(135deg, #0B1F3A 0%, #0D2050 50%, #100A2E 100%)',
        'gradient-card':     'linear-gradient(145deg, #0F2645 0%, #0B1F3A 100%)',
        'gradient-full':     'linear-gradient(135deg, #3DB5D8 0%, #2F6BFF 55%, #5B4BFF 100%)',
      },
      boxShadow: {
        'glow-cyan':   '0 0 20px rgba(61, 181, 216, 0.35)',
        'glow-blue':   '0 0 20px rgba(47, 107, 255, 0.45)',
        'glow-purple': '0 0 20px rgba(91, 75, 255, 0.45)',
        'glow-brand':  '0 0 24px rgba(47, 107, 255, 0.4), 0 0 60px rgba(91, 75, 255, 0.15)',
        'card':        '0 8px 32px rgba(2, 24, 37, 0.6)',
        'card-hover':  '0 16px 48px rgba(0, 229, 255, 0.2)',
      },
      animation: {
        'fade-in':       'fadeIn 0.5s ease-in-out',
        'slide-up':      'slideUp 0.5s ease-out',
        'glow-pulse':    'glowPulse 3s ease-in-out infinite',
        'float':         'float 6s ease-in-out infinite',
        'grid-move':     'gridMove 20s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',     opacity: '1' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 10px rgba(0,229,255,0.2)' },
          '50%':      { boxShadow: '0 0 30px rgba(0,229,255,0.5)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-10px)' },
        },
        gridMove: {
          '0%':   { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(40px)' },
        },
      },
    },
  },
  plugins: [],
}
export default config

