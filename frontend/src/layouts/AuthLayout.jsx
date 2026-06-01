import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Logo } from '../components/ui';

const AuthLayout = () => (
  <div className="min-h-screen bg-bg flex">
    {/* Left panel — branding */}
    <div className="hidden lg:flex flex-col justify-between w-[420px] flex-shrink-0 bg-bg-2 border-r border-border p-10">
      <Link to="/">
        <Logo size={36} textClassName="text-base" subtext="AI Interview Platform" />
      </Link>

      <div>
        <div className="text-3xl font-heading font-bold leading-snug mb-4">
          Land your <span className="bg-gradient-to-r from-accent to-cyan-400 bg-clip-text text-transparent">dream role</span> with AI-powered practice
        </div>
        <div className="space-y-3">
          {[
            ['🎙️', 'Voice interview with real-time AI feedback'],
            ['🧠', 'Adaptive questions based on your resume'],
            ['📊', 'Detailed performance analytics & roadmap'],
          ].map(([icon, text]) => (
            <div key={text} className="flex items-center gap-3 text-sm text-slate-600">
              <span>{icon}</span><span>{text}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="text-xs text-slate-400">
        Trusted by 50,000+ engineers preparing for FAANG & top tech companies
      </div>
    </div>

    {/* Right panel — form */}
    <div className="flex-1 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Outlet />
      </motion.div>
    </div>
  </div>
);

export default AuthLayout;
