import React from 'react';
import { motion } from 'framer-motion';

/**
 * Premium Score Ring with gradient stroke and glow effect
 */
const ScoreRing = ({ score = 0, label = '', size = 90, color = '#7c5bf0' }) => {
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const center = size / 2;

  // Generate a secondary color for gradient
  const gradientId = `scoreGrad-${label.replace(/\s/g, '')}`;

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Glow effect behind */}
        <div
          className="absolute inset-2 rounded-full opacity-15 blur-xl"
          style={{ background: color }}
        />
        <svg width={size} height={size} className="relative z-10">
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={color} />
              <stop offset="100%" stopColor={color} stopOpacity="0.4" />
            </linearGradient>
          </defs>
          {/* Track */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-bg-3 opacity-40"
          />
          {/* Progress arc */}
          <motion.circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 }}
            transform={`rotate(-90 ${center} ${center})`}
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <span className="font-heading font-extrabold text-slate-900" style={{ fontSize: size * 0.22 }}>
            {score}
          </span>
        </div>
      </div>
      {label && (
        <span className="text-[11px] font-medium text-slate-500 tracking-wide">
          {label}
        </span>
      )}
    </div>
  );
};

export default ScoreRing;
