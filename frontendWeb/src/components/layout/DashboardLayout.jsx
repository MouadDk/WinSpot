import { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X, Sun, Moon, Bell, LogOut } from 'lucide-react';
import { useDarkMode } from '../../hooks/useDarkMode';
import { useAuth } from '../../contexts/AuthContext';
import PageTransition from './PageTransition';

const roleStyles = {
  customer: {
    activeNav: 'bg-gradient-to-r from-purple-500/10 to-transparent text-purple-800 dark:from-purple-500/20 dark:text-purple-300',
    activeBar: 'bg-purple-600 dark:bg-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.6)]',
    hoverNav: 'hover:bg-purple-50/50 dark:hover:bg-purple-500/5 hover:translate-x-1',
    ambientGlow: 'bg-[radial-gradient(circle,rgba(147,51,234,0.15)_0%,transparent_60%)]',
  },
  restaurant: {
    activeNav: 'bg-gradient-to-r from-cyan-500/10 to-transparent text-cyan-800 dark:from-cyan-500/20 dark:text-cyan-300',
    activeBar: 'bg-cyan-500 dark:bg-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.6)]',
    hoverNav: 'hover:bg-cyan-50/50 dark:hover:bg-cyan-500/5 hover:translate-x-1',
    ambientGlow: 'bg-[radial-gradient(circle,rgba(6,182,212,0.15)_0%,transparent_60%)]',
  },
};

/**
 * DashboardLayout — persistent shell for both merchant and customer dashboards.
 *
 * Supports two usage modes:
 *  1. Nested routing (preferred): renders <Outlet /> for sub-routes; each sub-page
 *     wraps its content in <PageTransition> for animated transitions.
 *  2. Legacy children prop: still works if a page renders children directly.
 *
 * The <AnimatePresence> key is the current pathname so Framer Motion detects
 * route changes and triggers exit/enter animations.
 */
export default function DashboardLayout({
  role = 'customer',
  user,
  navItems = [],
  children,
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isDark, toggle: toggleDark } = useDarkMode();
  const location = useLocation();
  const { logout } = useAuth();
  const style = roleStyles[role];
  const brandName = role === 'customer' ? 'Customer Hub' : 'Restaurant Hub';

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#05050A] transition-colors duration-500 font-sans">
      {/* Background ambient glow for premium feel */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className={`absolute top-0 left-1/4 w-[800px] h-[800px] mix-blend-screen opacity-30 dark:opacity-40 transition-colors duration-700 ${style.ambientGlow}`} />
      </div>

      {/* ── Mobile overlay ── */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ── Sidebar ── */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64
          bg-white/95 dark:bg-[#0A0A0F]/95 backdrop-blur-3xl
          border-r border-slate-200/60 dark:border-white/5
          transform transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
          lg:translate-x-0 shadow-2xl lg:shadow-none shadow-black/10
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo */}
        <div className="h-20 flex items-center justify-between px-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex flex-col mt-2">
            <img
              src="/winspot-logo.png"
              alt="WinSpot"
              className="h-14 w-auto object-contain"
              style={{ filter: 'drop-shadow(0 2px 4px rgba(147,51,234,0.3))' }}
            />
            <span
              className="text-[13px] text-purple-500 dark:text-purple-400 self-end -mt-3 opacity-90 translate-x-6 -rotate-3"
              style={{ fontFamily: 'cursive' }}
            >
              {brandName}
            </span>
          </div>
          <button
            className="lg:hidden text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-1 mt-2">
          {navItems.map((item) => {
            // For dashboard root paths (Overview), require exact match only.
            // For sub-paths (offers, wallet, settings), allow startsWith matching.
            const dashRoots = ['/customer-dashboard', '/restaurant-dashboard'];
            const isExactOnly = dashRoots.includes(item.href);
            const isActive = item.href && item.href !== '#'
              ? isExactOnly
                ? location.pathname === item.href
                : location.pathname === item.href || location.pathname.startsWith(item.href + '/')
              : item.active;
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                to={item.href || '#'}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold tracking-wide
                  transition-all duration-300 relative group overflow-hidden cursor-pointer
                  focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500
                  ${isActive
                    ? style.activeNav
                    : `text-slate-500 dark:text-slate-400 ${style.hoverNav}`
                  }
                `}
              >
                {/* Active indicator with framer-motion */}
                {isActive && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full ${style.activeBar}`}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                {Icon && <Icon className={`w-5 h-5 shrink-0 transition-transform duration-300 ${isActive ? 'scale-110 text-current' : 'group-hover:scale-110'}`} />}
                <span className="relative z-10">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom section — user info + logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 font-bold uppercase">
              {user?.firstName?.[0] || 'U'}
            </div>
            {user && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">{user.firstName || 'User'}</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 truncate">{user.email || ''}</p>
              </div>
            )}
            <button
              onClick={() => { logout(); window.location.href = '/'; }}
              className="p-2 text-slate-400 hover:text-red-500 active:scale-95 transition-all cursor-pointer"
              title="Log out"
              aria-label="Log out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main Area ── */}
      <div className="lg:pl-64 min-h-screen flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-30 h-20 bg-white/70 dark:bg-[#0A0A0F]/70 backdrop-blur-2xl border-b border-slate-200/60 dark:border-white/5 transition-colors duration-500">
          <div className="h-full px-4 sm:px-6 flex items-center justify-between">
            {/* Left */}
            <div className="flex items-center gap-4">
              <button
                className="lg:hidden text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors cursor-pointer"
                onClick={() => setSidebarOpen(true)}
                aria-label="Open sidebar"
              >
                <Menu className="w-6 h-6" />
              </button>
              {user && (
                <div className="hidden sm:block">
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Welcome back,</p>
                  <p
                    className="text-sm font-bold text-slate-800 dark:text-white tracking-wide"
                    style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}
                  >
                    {user.firstName || (role === 'customer' ? 'Customer' : 'Partner')}
                  </p>
                </div>
              )}
            </div>

            {/* Center - Live Rate Ticker */}
            <div className="hidden md:flex flex-1 items-center justify-center mx-8">
              <div className="flex items-center gap-3 bg-white/40 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-700/50 rounded-2xl px-4 py-2 backdrop-blur-md shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-all duration-300 hover:bg-white/60 dark:hover:bg-slate-800/60">
                <div className="flex items-center gap-2 pr-3 border-r border-slate-200 dark:border-slate-700">
                  <div className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </div>
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Live Rate</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="flex items-center justify-center w-5 h-5 rounded-full bg-gradient-to-br from-amber-200 to-amber-400 dark:from-amber-500/40 dark:to-amber-600/40 text-amber-700 dark:text-amber-200 shadow-inner">
                    <span className="text-[10px] font-black">W</span>
                  </div>
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
                    1 WC
                    <span className="text-slate-400 dark:text-slate-500 font-medium mx-1.5">=</span>
                    <span className="text-emerald-600 dark:text-emerald-400">10 MAD</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleDark}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 transition-all cursor-pointer"
                aria-label="Toggle dark mode"
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              {/* Bell — decorative until notifications are implemented */}
              <button
                className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 transition-all relative cursor-pointer"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
              </button>
              <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1 hidden sm:block" />
              <div className="hidden sm:block">
                <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 font-bold uppercase cursor-pointer hover:ring-2 hover:ring-purple-500/30 transition-all">
                  {user?.firstName?.[0] || 'U'}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content — AnimatePresence animates between sub-routes */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 relative z-10">
          <div className="max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
              {/*
               * Key = pathname so AnimatePresence detects route changes.
               * If children are passed directly (legacy), render them animated too.
               */}
              {children ? (
                <PageTransition key={location.pathname}>
                  {children}
                </PageTransition>
              ) : (
                <PageTransition key={location.pathname}>
                  <Outlet />
                </PageTransition>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}
