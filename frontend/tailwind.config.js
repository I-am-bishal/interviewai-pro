/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
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
          DEFAULT: '#7c5bf0',
          2: '#6343d8',
          soft: '#a78bfa',
        },
        electric: '#3b82f6',
        teal: '#06d6a0',
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
        info: '#38bdf8',
      },
      boxShadow: {
        'glow-sm': '0 0 15px -3px rgba(124, 91, 240, 0.15)',
        'glow-md': '0 0 30px -5px rgba(124, 91, 240, 0.2)',
        'glow-lg': '0 0 60px -10px rgba(124, 91, 240, 0.25)',
        'glow-teal': '0 0 30px -5px rgba(6, 214, 160, 0.2)',
        'glow-electric': '0 0 30px -5px rgba(59, 130, 246, 0.2)',
        'inner-light': 'inset 0 1px 0 0 rgba(255,255,255,0.05)',
        'card': '0 1px 3px rgba(0,0,0,0.12), 0 8px 24px rgba(0,0,0,0.08)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.15), 0 16px 40px rgba(0,0,0,0.12)',
        'elevated': '0 8px 32px rgba(0,0,0,0.16), 0 2px 8px rgba(0,0,0,0.08)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'pulse-ring': 'pulseRing 2s infinite',
        'typing': 'blink 0.7s infinite',
        'shimmer-bar': 'shimmerBar 2s ease-in-out infinite',
        'glow-breathe': 'glowBreathe 3s ease-in-out infinite',
        'orb-drift': 'orbDrift 20s ease-in-out infinite',
        'orb-drift-reverse': 'orbDriftReverse 25s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: 0, transform: 'translateY(8px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        slideUp: {
          from: { transform: 'translateY(20px)', opacity: 0 },
          to: { transform: 'translateY(0)', opacity: 1 },
        },
        pulseRing: {
          '0%,100%': { transform: 'scale(1)', opacity: 0.5 },
          '50%': { transform: 'scale(1.08)', opacity: 0.2 },
        },
        blink: {
          '0%,100%': { opacity: 1 },
          '50%': { opacity: 0 },
        },
        shimmerBar: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(200%)' },
        },
        glowBreathe: {
          '0%,100%': { opacity: 0.4 },
          '50%': { opacity: 0.8 },
        },
        orbDrift: {
          '0%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.05)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.95)' },
          '100%': { transform: 'translate(0, 0) scale(1)' },
        },
        orbDriftReverse: {
          '0%': { transform: 'translate(0, 0) scale(1.05)' },
          '33%': { transform: 'translate(-40px, 30px) scale(0.95)' },
          '66%': { transform: 'translate(25px, -35px) scale(1.08)' },
          '100%': { transform: 'translate(0, 0) scale(1.05)' },
        },
      },
      backdropBlur: {
        '2xl': '40px',
        '3xl': '64px',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
};
