/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        neon: {
          blue: '#00f0ff',
          purple: '#8b5cf6',
          pink: '#ec4899',
        },
        'receipt-yellow': '#fff9e5',
      },
      boxShadow: {
        'neomorphism': '8px 8px 16px #bebebe, -8px -8px 16px #ffffff',
        'neomorphism-dark': '8px 8px 16px #1a1a1a, -8px -8px 16px #2e2e2e',
        'neomorphism-inset': 'inset 8px 8px 16px #bebebe, inset -8px -8px 16px #ffffff',
        'neomorphism-inset-dark': 'inset 8px 8px 16px #1a1a1a, inset -8px -8px 16px #2e2e2e',
        'neon-blue': '0 0 10px #00f0ff, 0 0 20px #00f0ff, 0 0 30px #00f0ff',
      },
      animation: {
        'pulse-neon': 'pulse-neon 2s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        'pulse-neon': {
          '0%, 100%': { boxShadow: '0 0 5px #00f0ff' },
          '50%': { boxShadow: '0 0 20px #00f0ff, 0 0 30px #00f0ff' }
        },
        'glow': {
          'from': { textShadow: '0 0 5px #00f0ff' },
          'to': { textShadow: '0 0 20px #00f0ff, 0 0 30px #00f0ff' }
        }
      },
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', '"Liberation Mono"', '"Courier New"', 'monospace'],
      },
    },
  },
  plugins: [],
};
