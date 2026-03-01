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
        // Brand palette — logo-derived futuristic robotics theme
        brand: {
          teal:    '#3FB6D6',
          cyan:    '#4CC9F0',
          blue:    '#4361EE',
          indigo:  '#3A0CA3',
          electric:'#00E5FF',
          ice:     '#90E0EF',
          'deep-teal': '#023047',
          midnight:'#1B263B',
        },
        // Keep primary alias for legacy components
        primary: {
          50:  '#e8f8fd',
          100: '#c4edfa',
          200: '#90E0EF',
          300: '#4CC9F0',
          400: '#3FB6D6',
          500: '#4361EE',
          600: '#4361EE',
          700: '#3A0CA3',
          800: '#023047',
          900: '#021825',
        },
        dark: {
          50:  '#e2f3f8',
          100: '#b8dcea',
          200: '#4CC9F0',
          300: '#3FB6D6',
          400: '#2e9ab8',
          500: '#1b6a80',
          600: '#1B263B',
          700: '#162032',
          800: '#0f192a',
          900: '#021825',
        },
      },
      backgroundImage: {
        'gradient-brand':    'linear-gradient(135deg, #4361EE 0%, #3A0CA3 100%)',
        'gradient-teal':     'linear-gradient(135deg, #3FB6D6 0%, #4CC9F0 100%)',
        'gradient-hero':     'linear-gradient(135deg, #021825 0%, #031d2e 50%, #0d1b3e 100%)',
        'gradient-card':     'linear-gradient(135deg, rgba(2,48,71,0.6) 0%, rgba(27,38,59,0.6) 100%)',
        'gradient-diagonal': 'linear-gradient(135deg, #4361EE 0%, #4CC9F0 50%, #3A0CA3 100%)',
      },
      boxShadow: {
        'glow-cyan':   '0 0 20px rgba(0, 229, 255, 0.35)',
        'glow-blue':   '0 0 20px rgba(67, 97, 238, 0.45)',
        'glow-teal':   '0 0 20px rgba(63, 182, 214, 0.35)',
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

