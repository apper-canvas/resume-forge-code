/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#5B4FE8',
        secondary: '#8B85F0',
        accent: '#FF6B6B',
        surface: {
          50: '#F8F9FC',
          100: '#F1F3F9',
          200: '#E4E7EF',
          300: '#D1D7E5',
          400: '#B0B9D0',
          500: '#8F9BB7',
          600: '#6B7A9C',
          700: '#4A5A7F',
          800: '#2D3E63',
          900: '#1A2547'
        },
        success: '#4CAF50',
        warning: '#FF9800',
        error: '#F44336',
        info: '#2196F3'
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        heading: ['Plus Jakarta Sans', 'ui-sans-serif', 'system-ui']
      },
      aspectRatio: {
        'resume': '3/4'
      },
      animation: {
        'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite'
      },
      keyframes: {
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' }
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        }
      }
    },
  },
  plugins: [],
}