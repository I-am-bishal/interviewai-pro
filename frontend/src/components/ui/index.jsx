import React from 'react';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { LogoIcon } from './Logo';

// ── Card ───────────────────────────────────────────────────────────────────
export const Card = ({ children, className = '', hover = false, onClick }) => (
  <motion.div
    whileHover={hover ? { y: -3, transition: { type: 'spring', stiffness: 400, damping: 25 } } : undefined}
    onClick={onClick}
    className={`
      relative bg-bg-2/80 backdrop-blur-xl border border-border/50 rounded-2xl p-6
      shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04),0_1px_3px_rgba(0,0,0,0.1),0_8px_24px_rgba(0,0,0,0.05)]
      transition-all duration-300
      ${hover ? 'cursor-pointer hover:border-accent/20 hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06),0_4px_12px_rgba(0,0,0,0.12),0_16px_40px_rgba(0,0,0,0.08),0_0_30px_-10px_rgba(124,91,240,0.1)]' : ''}
      ${className}
    `}
  >
    {children}
  </motion.div>
);

// ── Badge ──────────────────────────────────────────────────────────────────
const BADGE_VARIANTS = {
  blue:   'bg-blue-500/10 text-blue-400 border-blue-500/15',
  green:  'bg-emerald-500/10 text-emerald-400 border-emerald-500/15',
  amber:  'bg-amber-500/10 text-amber-400 border-amber-500/15',
  pink:   'bg-cyan-400/10 text-cyan-400 border-cyan-400/15',
  purple: 'bg-violet-500/10 text-violet-400 border-violet-500/15',
  gray:   'bg-slate-500/8 text-slate-500 border-slate-500/10',
  red:    'bg-red-500/10 text-red-400 border-red-500/15',
};

export const Badge = ({ children, color = 'gray', className = '' }) => (
  <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10.5px] font-semibold border tracking-wide ${BADGE_VARIANTS[color]} ${className}`}>
    {children}
  </span>
);

// ── Input ──────────────────────────────────────────────────────────────────
export const Input = React.forwardRef(({ label, error, icon, className = '', ...props }, ref) => (
  <div className="w-full">
    {label && <label className="block text-xs text-slate-500 mb-1.5 font-medium tracking-wide">{label}</label>}
    <div className="relative">
      {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">{icon}</span>}
      <input
        ref={ref}
        className={`
          w-full bg-bg-3/60 backdrop-blur-sm border rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400/60
          outline-none transition-all duration-300
          shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)]
          ${error
            ? 'border-danger/50 focus:border-danger focus:ring-2 focus:ring-danger/15'
            : 'border-border/60 focus:border-accent/50 focus:ring-2 focus:ring-accent/10 focus:bg-bg-2/80'
          }
          ${icon ? 'pl-9' : ''}
          ${className}
        `}
        {...props}
      />
    </div>
    {error && <p className="mt-1 text-xs text-danger font-medium">{error}</p>}
  </div>
));
Input.displayName = 'Input';

// ── ProgressBar ────────────────────────────────────────────────────────────
export const ProgressBar = ({ value = 0, color = 'accent', className = '' }) => (
  <div className={`h-1.5 bg-bg-4/50 rounded-full overflow-hidden ${className}`}>
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className="h-full rounded-full relative overflow-hidden"
      style={{
        background: color === 'accent'
          ? 'linear-gradient(90deg, #7c5bf0 0%, #3b82f6 50%, #06d6a0 100%)'
          : undefined,
      }}
    >
      {/* Shimmer sweep */}
      <div
        className="absolute inset-0 animate-shimmer-bar"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)',
          width: '50%',
        }}
      />
    </motion.div>
  </div>
);

// ── Skeleton loader ────────────────────────────────────────────────────────
export const Skeleton = ({ className = '' }) => (
  <div className={`bg-bg-3/60 rounded-2xl animate-pulse ${className}`}>
    <div className="relative overflow-hidden h-full w-full rounded-2xl">
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(124,91,240,0.04), transparent)',
          animation: 'shimmerBar 2s ease-in-out infinite',
        }}
      />
    </div>
  </div>
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
  <div className={`flex items-center gap-2 text-[11px] font-semibold tracking-widest uppercase text-slate-500 mb-3 ${className}`}>
    <div className="w-1 h-3.5 rounded-full" style={{ background: 'linear-gradient(180deg, #7c5bf0, #3b82f6)' }} />
    {children}
  </div>
);

// ── Divider ────────────────────────────────────────────────────────────────
export const Divider = ({ className = '' }) => (
  <div className={`border-t border-border/50 ${className}`} />
);

// ── Toggle ─────────────────────────────────────────────────────────────────
export const Toggle = ({ checked, onChange }) => (
  <button
    onClick={() => onChange(!checked)}
    className={`w-11 h-6 rounded-full relative transition-all duration-300 ${
      checked
        ? 'shadow-glow-sm'
        : 'bg-bg-4/60'
    }`}
    style={checked ? {
      background: 'linear-gradient(135deg, #7c5bf0, #3b82f6)',
    } : undefined}
  >
    <motion.div
      animate={{ x: checked ? 20 : 2 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md"
    />
  </button>
);

export { Logo, LogoIcon } from './Logo';
export default LoadingSpinner;
