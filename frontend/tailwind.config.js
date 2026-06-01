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
          DEFAULT: '#f8fafc',
          2: '#ffffff',
          3: '#f1f5f9',
          4: '#e2e8f0',
        },
        border: {
          DEFAULT: '#e2e8f0',
          2: '#cbd5e1',
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
