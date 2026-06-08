import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Logo } from '../components/ui';

const AuthLayout = () => (
  <div className="min-h-screen bg-bg flex relative overflow-hidden">
    {/* Left panel — branding with mesh gradient */}
    <div className="hidden lg:flex flex-col justify-between w-[440px] flex-shrink-0 relative overflow-hidden border-r border-border/30">
      {/* Mesh gradient background */}
      <div className="absolute inset-0 bg-bg-2" />
      <div className="ambient-orb ambient-orb-1 absolute -top-32 -left-32" />
      <div className="ambient-orb ambient-orb-2 absolute bottom-20 right-10" />
      <div className="ambient-orb ambient-orb-3 absolute top-1/2 left-1/3" />

      <div className="relative z-10 p-10">
        <Link to="/">
          <Logo size={36} textClassName="text-base" subtext="AI Interview Platform" />
        </Link>
      </div>

      <div className="relative z-10 p-10">
        <div className="text-3xl font-heading font-extrabold leading-snug mb-5 tracking-tight">
          Land your{' '}
          <span className="gradient-text-accent">dream role</span>
          {' '}with AI-powered practice
        </div>
        <div className="space-y-3.5">
          {[
            ['🎙️', 'Voice interview with real-time AI feedback'],
            ['🧠', 'Adaptive questions based on your resume'],
            ['📊', 'Detailed performance analytics & roadmap'],
          ].map(([icon, text]) => (
            <div key={text} className="flex items-center gap-3 text-[13.5px] text-slate-600">
              <div className="icon-container icon-container-sm">
                <span className="text-sm">{icon}</span>
              </div>
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 p-10 text-xs text-slate-400 font-medium">
        Trusted by 50,000+ engineers preparing for FAANG & top tech companies
      </div>
    </div>

    {/* Right panel — form */}
    <div className="flex-1 flex items-center justify-center p-6 relative">
      <div className="ambient-orb ambient-orb-1 absolute top-10 right-10 opacity-[0.04]" />
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md"
      >
        <Outlet />
      </motion.div>
    </div>
  </div>
);

export default AuthLayout;
