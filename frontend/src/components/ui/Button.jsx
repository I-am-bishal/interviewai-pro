import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const VARIANTS = {
  primary: 'bg-accent hover:bg-accent-2 text-white border-transparent shadow-lg shadow-accent/20 hover:shadow-accent/40',
  ghost: 'bg-transparent text-slate-600 border-border hover:bg-bg-3 hover:text-slate-900',
  danger: 'bg-transparent text-danger border-danger hover:bg-danger hover:text-slate-900',
  success: 'bg-success/15 text-success border-success/30 hover:bg-success hover:text-slate-900',
};

const SIZES = {
  xs: 'px-2.5 py-1.5 text-xs rounded-md gap-1.5',
  sm: 'px-3 py-2 text-[13px] rounded-lg gap-1.5',
  md: 'px-4 py-2.5 text-[14px] rounded-lg gap-2',
  lg: 'px-6 py-3 text-[15px] rounded-xl gap-2',
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

  return (
    <motion.button
      whileTap={{ scale: isDisabled ? 1 : 0.97 }}
      disabled={isDisabled}
      className={`
        inline-flex items-center justify-center font-medium border transition-all
        ${VARIANTS[variant]}
        ${SIZES[size]}
        ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
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
