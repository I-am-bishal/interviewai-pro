import React from 'react';

/**
 * Circular SVG score ring
 * @param {number} score      0-100
 * @param {string} label      e.g. "Overall"
 * @param {number} size       SVG size in px
 * @param {string} color      Tailwind color hex
 */
const ScoreRing = ({ score = 0, label = '', size = 100, color = '#7c6dfa' }) => {
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {/* Track */}
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#22222f" strokeWidth={6} />
        {/* Progress */}
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={color} strokeWidth={6}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
      </svg>
      <div className="absolute text-center">
        <div className="font-heading font-extrabold leading-none" style={{ fontSize: size * 0.22, color }}>
          {score}
        </div>
        {label && <div className="text-white/40 leading-tight" style={{ fontSize: size * 0.1 }}>{label}</div>}
      </div>
    </div>
  );
};

export default ScoreRing;
