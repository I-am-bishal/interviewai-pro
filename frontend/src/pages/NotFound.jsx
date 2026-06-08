import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

const NotFound = () => (
  <div className="min-h-screen bg-bg flex items-center justify-center p-6 relative overflow-hidden">
    {/* Ambient orbs */}
    <div className="ambient-orb ambient-orb-1 absolute top-20 left-1/4" />
    <div className="ambient-orb ambient-orb-2 absolute bottom-20 right-1/4" />

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="text-center relative z-10"
    >
      <div className="text-8xl mb-6">🔍</div>
      <h1 className="font-heading text-6xl font-extrabold mb-3 gradient-text-accent tracking-tight">404</h1>
      <p className="text-xl text-slate-500 mb-2 font-medium">Page not found</p>
      <p className="text-sm text-slate-400 mb-8 max-w-xs mx-auto">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-2 text-white font-semibold px-7 py-3 rounded-2xl text-sm transition-all duration-300 hover:shadow-glow-md btn-shimmer"
        style={{
          background: 'linear-gradient(135deg, #7c5bf0 0%, #6343d8 40%, #3b82f6 100%)',
          boxShadow: '0 4px 20px -4px rgba(124, 91, 240, 0.4)',
        }}
      >
        <ArrowLeft size={15} /> Back to Dashboard
      </Link>
    </motion.div>
  </div>
);

export default NotFound;
