import type { Config } from 'tailwindcss'

export default {
  content: [
    './app/**/*.{vue,ts,tsx}',
    './components/**/*.{vue,ts,tsx}',
    './pages/**/*.{vue,ts,tsx}',
    './layouts/**/*.{vue,ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Nunito', 'ui-sans-serif', 'system-ui'],
      },
      colors: {
        cream: {
          50: '#FDFAF6',
          100: '#FAF5ED',
          200: '#F4EAD8',
        },
        coral: {
          400: '#EFA99F',
          500: '#E8837A',
          600: '#D96B62',
        },
        charcoal: {
          900: '#2C2420',
          800: '#3D3330',
          700: '#5A4E4A',
          500: '#8B7D78',
          300: '#C4B8B4',
          100: '#EDE7E5',
        },
        mint: {
          400: '#6DBF9E',
          500: '#52A98A',
        },
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        warm: '0 4px 24px -4px rgba(44, 36, 32, 0.08)',
        'warm-md': '0 8px 32px -8px rgba(44, 36, 32, 0.12)',
        'warm-lg': '0 16px 48px -12px rgba(44, 36, 32, 0.14)',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'pulse-gentle': 'pulseGentle 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGentle: {
          '0%, 100%': { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(232, 131, 122, 0.4)' },
          '50%': { transform: 'scale(1.02)', boxShadow: '0 0 0 10px rgba(232, 131, 122, 0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config
