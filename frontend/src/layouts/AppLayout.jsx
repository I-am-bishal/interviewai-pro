import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, MessageSquare, Code2, FileText,
  BarChart3, Trophy, Settings, LogOut, Zap, Menu, X,
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';
import LoadingSpinner, { Logo } from '../components/ui';

const NAV_ITEMS = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'AI Interview', path: '/interview', icon: MessageSquare, badge: 'New' },
  { label: 'Coding Round', path: '/coding', icon: Code2 },
  { label: 'Resume AI', path: '/resume', icon: FileText },
  { label: 'Analytics', path: '/analytics', icon: BarChart3 },
  { label: 'Leaderboard', path: '/leaderboard', icon: Trophy },
  { label: 'Settings', path: '/settings', icon: Settings },
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
      flex flex-col h-full bg-bg-2 border-r border-border
      ${mobile ? 'w-72' : 'w-56'}
    `}>
      {/* Logo */}
      <div className="p-5 border-b border-border flex items-center gap-2">
        <Logo size={34} subtext="Dashboard Hub" />
        {mobile && (
          <button onClick={() => setSidebarOpen(false)} className="ml-auto text-slate-400 hover:text-slate-900">
            <X size={18} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map(({ label, path, icon: Icon, badge }) => (
          <NavLink
            key={path}
            to={path}
            onClick={() => mobile && setSidebarOpen(false)}
            className={({ isActive }) => `
              flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13.5px] font-medium transition-all
              ${isActive
                ? 'bg-accent/15 text-accent-2'
                : 'text-slate-500 hover:text-slate-900 hover:bg-bg-3'}
            `}
          >
            <Icon size={17} />
            <span className="flex-1">{label}</span>
            {badge && (
              <span className="bg-accent text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{badge}</span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div className="p-3 border-t border-border">
        <div className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-bg-3 cursor-pointer group">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-cyan-400 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-medium text-slate-900 truncate">{user?.name || 'User'}</div>
            <div className="text-[11px] text-accent font-medium flex items-center gap-1">
              <Zap size={10} /> {user?.currentStreak || 0} day streak
            </div>
          </div>
          <button onClick={handleLogout} className="text-slate-400 hover:text-danger opacity-0 group-hover:opacity-100 transition-opacity">
            <LogOut size={15} />
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
          <div className="absolute inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
          <motion.div
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            className="relative z-10 h-full"
          >
            <Sidebar mobile />
          </motion.div>
        </motion.div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar — mobile only */}
        <div className="md:hidden flex items-center gap-3 px-4 h-14 bg-bg-2 border-b border-border flex-shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="text-slate-600 hover:text-slate-900">
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
