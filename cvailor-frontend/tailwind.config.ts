import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-dm-serif)', 'Georgia', 'serif'],
      },
      colors: {
        brand: {
          green:  '#2ECC8F',
          purple: '#5B4FCF',
          peach:  '#F4A97F',
          sky:    '#A8D8EA',
          mint:   '#7ECEC4',
        },
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseGlow: {
          '0%,100%': { boxShadow: '0 0 20px rgba(46,204,143,0.3)' },
          '50%':     { boxShadow: '0 0 40px rgba(46,204,143,0.6)' },
        },
        blink: {
          '0%,100%': { opacity: '1' },
          '50%':     { opacity: '0' },
        },
        typingDot: {
          '0%,80%,100%': { transform: 'scale(0)' },
          '40%':          { transform: 'scale(1)' },
        },
      },
      animation: {
        float:      'float 4s ease-in-out infinite',
        shimmer:    'shimmer 3s linear infinite',
        pulseGlow:  'pulseGlow 2s ease-in-out infinite',
        blink:      'blink 1s step-end infinite',
        typingDot:  'typingDot 1.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
export default config
