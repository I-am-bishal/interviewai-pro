import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, MessageSquare, Code2, FileText,
  BarChart3, Trophy, Settings, LogOut, Zap, Menu, X,
  BookOpen, Activity
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';
import LoadingSpinner, { Logo } from '../components/ui';

const NAV_ITEMS = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'AI Interview', path: '/interview', icon: MessageSquare, badge: 'New' },
  { label: 'Prep Hub', path: '/prep', icon: BookOpen },
  { label: 'Coding Round', path: '/coding', icon: Code2 },
  { label: 'Resume AI', path: '/resume', icon: FileText },
  { label: 'Analytics', path: '/analytics', icon: BarChart3 },
  { label: 'Leaderboard', path: '/leaderboard', icon: Trophy },
  { label: 'Settings', path: '/settings', icon: Settings },
  { label: 'System Status', path: '/status', icon: Activity },
];

const AppLayout = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out');
    navigate('/login');
  };

  const initials = user?.name?.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() || 'AI';

  const Sidebar = ({ mobile = false }) => (
    <aside className={`
      flex flex-col h-full
      bg-bg-2/70 backdrop-blur-2xl border-r border-border/40
      ${mobile ? 'w-72' : 'w-[220px]'}
    `}>
      {/* Logo */}
      <div className="p-5 border-b border-border/30 flex items-center gap-2">
        <Logo size={32} subtext="Dashboard Hub" />
        {mobile && (
          <button onClick={() => setSidebarOpen(false)} className="ml-auto text-slate-400 hover:text-slate-900 transition-colors">
            <X size={18} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map(({ label, path, icon: Icon, badge }) => (
          <NavLink
            key={path}
            to={path}
            onClick={() => mobile && setSidebarOpen(false)}
            className={({ isActive }) => `
              relative flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200
              ${isActive ? 'text-white' : 'text-slate-500 hover:text-slate-800 hover:bg-bg-3/30'}
            `}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute inset-0 rounded-xl -z-10"
                    style={{
                      background: 'linear-gradient(135deg, rgba(124, 91, 240, 0.18) 0%, rgba(59, 130, 246, 0.12) 100%)',
                      border: '1px solid rgba(124, 91, 240, 0.15)',
                      boxShadow: '0 0 20px -8px rgba(124, 91, 240, 0.2)',
                    }}
                    transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                  />
                )}
                {/* Active indicator bar */}
                {isActive && (
                  <motion.div
                    layoutId="activeBar"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-full"
                    style={{ background: 'linear-gradient(180deg, #7c5bf0, #3b82f6)' }}
                    transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                  />
                )}
                <Icon size={16} className={isActive ? 'text-accent-soft' : 'text-slate-400'} />
                <span className="flex-1">{label}</span>
                {badge && (
                  <span
                    className="text-[9px] font-bold px-1.5 py-0.5 rounded-full text-white z-10"
                    style={{ background: 'linear-gradient(135deg, #7c5bf0, #3b82f6)' }}
                  >
                    {badge}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div className="p-3 border-t border-border/30">
        <div 
          onClick={() => navigate('/profile')}
          className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-bg-3/40 cursor-pointer group transition-all duration-200"
        >
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
            style={{
              background: 'linear-gradient(135deg, #7c5bf0, #3b82f6)',
              boxShadow: '0 2px 10px -2px rgba(124, 91, 240, 0.4)',
            }}
          >
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-semibold text-slate-900 truncate">{user?.name || 'User'}</div>
            <div className="text-[10.5px] font-medium flex items-center gap-1 text-accent">
              <Zap size={9} /> {user?.currentStreak || 0} day streak
            </div>
          </div>
          <button 
            onClick={(e) => { e.stopPropagation(); handleLogout(); }}
            className="text-slate-400 hover:text-danger opacity-0 group-hover:opacity-100 transition-all duration-200"
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen bg-bg overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden md:flex flex-shrink-0">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex md:hidden"
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <motion.div
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            className="relative z-10 h-full"
          >
            <Sidebar mobile />
          </motion.div>
        </motion.div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar — mobile only */}
        <div className="md:hidden flex items-center gap-3 px-4 h-14 bg-bg-2/80 backdrop-blur-xl border-b border-border/30 flex-shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="text-slate-500 hover:text-slate-900 transition-colors">
            <Menu size={22} />
          </button>
          <Logo size={26} subtext="" />
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
