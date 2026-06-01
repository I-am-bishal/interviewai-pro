/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        heading: ['Syne', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        bg: {
          DEFAULT: 'var(--bg-default)',
          2: 'var(--bg-2)',
          3: 'var(--bg-3)',
          4: 'var(--bg-4)',
        },
        border: {
          DEFAULT: 'var(--border-default)',
          2: 'var(--border-2)',
        },
        slate: {
          900: 'var(--slate-900)',
          800: 'var(--slate-800)',
          700: 'var(--slate-700)',
          650: 'var(--slate-650)',
          600: 'var(--slate-600)',
          500: 'var(--slate-500)',
          400: 'var(--slate-400)',
          300: 'var(--slate-300)',
        },
        accent: {
          DEFAULT: '#6366f1',
          2: '#4f46e5',
        },
        success: '#22c984',
        warning: '#f5a623',
        danger: '#ff5b5b',
        info: '#4da6ff',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease',
        'slide-up': 'slideUp 0.3s ease',
        'pulse-ring': 'pulseRing 2s infinite',
        'typing': 'blink 0.7s infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: 0, transform: 'translateY(8px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        slideUp: { from: { transform: 'translateY(20px)', opacity: 0 }, to: { transform: 'translateY(0)', opacity: 1 } },
        pulseRing: { '0%,100%': { transform: 'scale(1)', opacity: 0.5 }, '50%': { transform: 'scale(1.08)', opacity: 0.2 } },
        blink: { '0%,100%': { opacity: 1 }, '50%': { opacity: 0 } },
      },
    },
  },
  plugins: [],
};
