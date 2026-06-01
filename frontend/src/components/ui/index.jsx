import React from 'react';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { LogoIcon } from './Logo';

// ── Card ───────────────────────────────────────────────────────────────────
export const Card = ({ children, className = '', hover = false, onClick }) => (
  <motion.div
    whileHover={hover ? { y: -2, boxShadow: '0 12px 40px rgba(0,0,0,0.4)' } : undefined}
    onClick={onClick}
    className={`
      bg-bg-2 border border-border rounded-2xl p-6
      ${hover ? 'cursor-pointer transition-colors hover:border-border-2' : ''}
      ${className}
    `}
  >
    {children}
  </motion.div>
);

// ── Badge ──────────────────────────────────────────────────────────────────
const BADGE_VARIANTS = {
  blue: 'bg-info/15 text-info',
  green: 'bg-success/15 text-success',
  amber: 'bg-warning/15 text-warning',
  pink: 'bg-cyan-400/15 text-cyan-400',
  purple: 'bg-accent/15 text-accent-2',
  gray: 'bg-slate-100 text-slate-600',
  red: 'bg-danger/15 text-danger',
};

export const Badge = ({ children, color = 'gray', className = '' }) => (
  <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium ${BADGE_VARIANTS[color]} ${className}`}>
    {children}
  </span>
);

// ── Input ──────────────────────────────────────────────────────────────────
export const Input = React.forwardRef(({ label, error, icon, className = '', ...props }, ref) => (
  <div className="w-full">
    {label && <label className="block text-xs text-slate-500 mb-1.5 font-medium">{label}</label>}
    <div className="relative">
      {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30">{icon}</span>}
      <input
        ref={ref}
        className={`
          w-full bg-bg-2 border rounded-lg px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400
          outline-none transition-all
          ${error ? 'border-danger focus:border-danger focus:ring-1 focus:ring-danger/30' : 'border-border focus:border-accent focus:ring-1 focus:ring-accent/25'}
          ${icon ? 'pl-9' : ''}
          ${className}
        `}
        {...props}
      />
    </div>
    {error && <p className="mt-1 text-xs text-danger">{error}</p>}
  </div>
));
Input.displayName = 'Input';

// ── ProgressBar ────────────────────────────────────────────────────────────
export const ProgressBar = ({ value = 0, color = 'accent', className = '' }) => (
  <div className={`h-1.5 bg-bg-4 rounded-full overflow-hidden ${className}`}>
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className={`h-full rounded-full ${color === 'accent' ? 'bg-gradient-to-r from-accent to-cyan-400' : `bg-${color}`}`}
    />
  </div>
);

// ── Skeleton loader ────────────────────────────────────────────────────────
export const Skeleton = ({ className = '' }) => (
  <div className={`bg-bg-3 rounded-lg animate-pulse ${className}`} />
);

// ── Loading Spinner ────────────────────────────────────────────────────────
const LoadingSpinner = ({ fullscreen = false, size = 24 }) => {
  if (fullscreen) {
    return (
      <div className="fixed inset-0 bg-bg flex items-center justify-center z-50">
        <div className="flex flex-col items-center gap-4">
          <LogoIcon size={44} className="animate-pulse" />
          <Loader2 size={20} className="text-accent animate-spin" />
        </div>
      </div>
    );
  }
  return <Loader2 size={size} className="text-accent animate-spin" />;
};

// ── Section Title ──────────────────────────────────────────────────────────
export const SectionTitle = ({ children, className = '' }) => (
  <div className={`text-[11px] font-semibold tracking-widest uppercase text-slate-500 mb-3 ${className}`}>
    {children}
  </div>
);

// ── Divider ────────────────────────────────────────────────────────────────
export const Divider = ({ className = '' }) => (
  <div className={`border-t border-border ${className}`} />
);

// ── Toggle ─────────────────────────────────────────────────────────────────
export const Toggle = ({ checked, onChange }) => (
  <button
    onClick={() => onChange(!checked)}
    className={`w-11 h-6 rounded-full relative transition-colors ${checked ? 'bg-accent' : 'bg-slate-200'}`}
  >
    <motion.div
      animate={{ x: checked ? 20 : 2 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className="absolute top-1 w-4 h-4 bg-white rounded-full shadow"
    />
  </button>
);

export { Logo, LogoIcon } from './Logo';
export default LoadingSpinner;
