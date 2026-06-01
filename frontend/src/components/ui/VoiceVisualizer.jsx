import React from 'react';

/**
 * Animated voice waveform visualizer
 * Shows animated bars when recording, flat line when idle
 */
const VoiceVisualizer = ({ isRecording = false, bars = 10, className = '' }) => (
  <div className={`flex items-center gap-0.5 h-8 ${className}`}>
    {Array.from({ length: bars }).map((_, i) => (
      <div
        key={i}
        className={`w-1 rounded-sm transition-all ${isRecording ? 'bg-accent' : 'bg-white/20'}`}
        style={isRecording ? {
          height: '6px',
          animation: `wave 1.2s ease-in-out infinite`,
          animationDelay: `${i * 0.08}s`,
        } : { height: '4px' }}
      />
    ))}
    <style>{`
      @keyframes wave {
        0%, 100% { height: 6px; }
        50% { height: ${Math.floor(Math.random() * 20) + 14}px; }
      }
    `}</style>
  </div>
);

export default VoiceVisualizer;
