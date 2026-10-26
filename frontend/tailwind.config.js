/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        hubspot: {
          50: '#fff3eb',
          100: '#ffe5d6',
          400: '#ff8a65',
          500: '#ff5c35',
          600: '#ea4a23',
          glow: 'rgba(255, 92, 53, 0.35)',
        },
        slate: {
          850: '#0f172a',
          900: '#0b1120',
          950: '#060a12',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
        mono: ['JetBrains Mono', 'Fira Code', 'Menlo', 'monospace'],
      },
      boxShadow: {
        'glow-hubspot': '0 0 25px -4px rgba(255, 92, 53, 0.45)',
        'glow-emerald': '0 0 20px -3px rgba(16, 185, 129, 0.35)',
        'card-elevated':
          '0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.4)',
      },
    },
  },
  plugins: [],
};
