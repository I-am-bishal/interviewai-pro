import React from 'react';

/**
 * Premium Logo Icon for InterviewAI Pro
 * Combines a sleek, rounded hexagon with a digital microphone and soundwaves
 */
export const LogoIcon = ({ size = 32, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`flex-shrink-0 ${className}`}
  >
    <defs>
      {/* Dynamic gradient matching our brand colors (accent to pink) */}
      <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#6366f1" />
        <stop offset="100%" stopColor="#06b6d4" />
      </linearGradient>
      {/* Drop shadow for depth */}
      <filter id="logoGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="1.5" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>

    {/* Outer Rounded Hexagon Grid */}
    <path
      d="M16 2.5L28.1 9.5V22.5L16 29.5L3.9 22.5V9.5L16 2.5Z"
      stroke="url(#logoGrad)"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="url(#logoGrad)"
      fillOpacity="0.06"
      filter="url(#logoGlow)"
    />

    {/* Inner decorative network paths */}
    <path
      d="M16 2.5V8M3.9 9.5L8.5 12M28.1 9.5L23.5 12M3.9 22.5L8.5 20M28.1 22.5L23.5 20M16 29.5V24"
      stroke="url(#logoGrad)"
      strokeWidth="1.2"
      strokeOpacity="0.4"
      strokeLinecap="round"
    />

    {/* Professional Microphone Symbol (Voice Mock Interview) */}
    <rect
      x="13.5"
      y="9"
      width="5"
      height="8.5"
      rx="2.5"
      fill="url(#logoGrad)"
    />
    <path
      d="M10.5 13.5V14.5C10.5 17.53 12.97 20 16 20C19.03 20 21.5 17.53 21.5 14.5V13.5"
      stroke="url(#logoGrad)"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M16 20V23.5"
      stroke="url(#logoGrad)"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M13 23.5H19"
      stroke="url(#logoGrad)"
      strokeWidth="2.5"
      strokeLinecap="round"
    />

    {/* Glowing AI Signal wave dot */}
    <circle
      cx="16"
      cy="13.5"
      r="1.2"
      fill="#ffffff"
      opacity="0.8"
    />
  </svg>
);

/**
 * Standard Full Logo Component with Text
 */
export const Logo = ({ size = 32, showText = true, className = '', textClassName = '', subtext }) => (
  <div className={`flex items-center gap-2.5 ${className}`}>
    <LogoIcon size={size} />
    {showText && (
      <div className="flex flex-col">
        <span className={`font-heading font-extrabold text-sm text-slate-900 tracking-tight leading-tight ${textClassName}`}>
          InterviewAI Pro
        </span>
        <span className="text-[9px] font-bold tracking-wider text-accent uppercase opacity-90 leading-none mt-0.5">
          {subtext || 'AI Interview Coach'}
        </span>
      </div>
    )}
  </div>
);
