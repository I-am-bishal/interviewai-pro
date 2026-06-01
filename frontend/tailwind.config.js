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
          DEFAULT: 'rgb(var(--bg-default) / <alpha-value>)',
          2: 'rgb(var(--bg-2) / <alpha-value>)',
          3: 'rgb(var(--bg-3) / <alpha-value>)',
          4: 'rgb(var(--bg-4) / <alpha-value>)',
        },
        border: {
          DEFAULT: 'rgb(var(--border-default) / <alpha-value>)',
          2: 'rgb(var(--border-2) / <alpha-value>)',
        },
        slate: {
          900: 'rgb(var(--slate-900) / <alpha-value>)',
          800: 'rgb(var(--slate-800) / <alpha-value>)',
          700: 'rgb(var(--slate-700) / <alpha-value>)',
          650: 'rgb(var(--slate-650) / <alpha-value>)',
          600: 'rgb(var(--slate-600) / <alpha-value>)',
          500: 'rgb(var(--slate-500) / <alpha-value>)',
          400: 'rgb(var(--slate-400) / <alpha-value>)',
          300: 'rgb(var(--slate-300) / <alpha-value>)',
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
