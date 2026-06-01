import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

const NotFound = () => (
  <div className="min-h-screen bg-bg flex items-center justify-center p-6">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center"
    >
      <div className="text-8xl mb-6">🔍</div>
      <h1 className="font-heading text-5xl font-extrabold mb-3">404</h1>
      <p className="text-xl text-white/50 mb-2">Page not found</p>
      <p className="text-sm text-white/30 mb-8 max-w-xs mx-auto">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-2 bg-accent hover:bg-accent-2 text-white font-medium px-6 py-3 rounded-xl text-sm transition-all hover:shadow-lg hover:shadow-accent/20"
      >
        <ArrowLeft size={15} /> Back to Dashboard
      </Link>
    </motion.div>
  </div>
);

export default NotFound;
