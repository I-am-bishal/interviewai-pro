import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const VARIANTS = {
  primary:
    'text-white border-transparent btn-shimmer',
  ghost:
    'bg-bg-2/60 backdrop-blur-xl text-slate-600 border-border/60 hover:bg-bg-3/80 hover:text-slate-900 hover:border-accent/20',
  danger:
    'bg-transparent text-danger border-danger/40 hover:bg-danger/10 hover:border-danger',
  success:
    'bg-success/10 text-success border-success/30 hover:bg-success/20 hover:border-success',
};

const SIZES = {
  xs: 'px-2.5 py-1.5 text-xs rounded-lg gap-1.5',
  sm: 'px-3.5 py-2 text-[13px] rounded-xl gap-1.5',
  md: 'px-5 py-2.5 text-[14px] rounded-xl gap-2',
  lg: 'px-7 py-3 text-[15px] rounded-2xl gap-2',
};

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconRight,
  className = '',
  disabled,
  ...props
}) => {
  const isDisabled = disabled || loading;
  const isPrimary = variant === 'primary';

  return (
    <motion.button
      whileTap={{ scale: isDisabled ? 1 : 0.97 }}
      whileHover={{ scale: isDisabled ? 1 : 1.01 }}
      disabled={isDisabled}
      className={`
        inline-flex items-center justify-center font-semibold border transition-all duration-300 tracking-tight
        ${VARIANTS[variant]}
        ${SIZES[size]}
        ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      style={isPrimary && !isDisabled ? {
        background: 'linear-gradient(135deg, #7c5bf0 0%, #6343d8 40%, #3b82f6 100%)',
        boxShadow: '0 4px 20px -4px rgba(124, 91, 240, 0.4), inset 0 1px 0 rgba(255,255,255,0.15)',
      } : isPrimary && isDisabled ? {
        background: 'linear-gradient(135deg, #7c5bf0 0%, #6343d8 40%, #3b82f6 100%)',
        boxShadow: 'none',
      } : undefined}
      {...props}
    >
      {loading ? (
        <Loader2 size={14} className="animate-spin" />
      ) : icon ? (
        <span className="flex-shrink-0">{icon}</span>
      ) : null}
      {children}
      {iconRight && !loading && <span className="flex-shrink-0">{iconRight}</span>}
    </motion.button>
  );
};

export default Button;
