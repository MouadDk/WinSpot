import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UserButton } from '@clerk/clerk-react';
import { Menu, X, Sun, Moon, Bell, Coins } from 'lucide-react';
import { useDarkMode } from '../../hooks/useDarkMode';

const roleStyles = {
  influencer: {
    logoGradient: 'from-purple-700 to-purple-500',
    activeNav:
      'bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400',
    activeBar: 'bg-purple-600 dark:bg-purple-400',
    hoverNav: 'hover:bg-slate-50 dark:hover:bg-slate-800',
  },
  restaurant: {
    logoGradient: 'from-blue-500 to-cyan-400',
    activeNav:
      'bg-cyan-50 text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-400',
    activeBar: 'bg-cyan-500 dark:bg-cyan-400',
    hoverNav: 'hover:bg-slate-50 dark:hover:bg-slate-800',
  },
};

export default function DashboardLayout({
  role = 'influencer',
  user,
  navItems = [],
  children,
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isDark, toggle: toggleDark } = useDarkMode();
  const location = useLocation();
  const style = roleStyles[role];
  const brandName = role === 'influencer' ? 'Creator Hub' : 'Restaurant Hub';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* ── Mobile overlay ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64
          bg-white dark:bg-slate-900
          border-r border-slate-200 dark:border-slate-800
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo */}
        <div className="h-16 flex items-center gap-3 px-5 border-b border-slate-100 dark:border-slate-800">
          <div
            className={`w-9 h-9 bg-gradient-to-br ${style.logoGradient} rounded-xl flex items-center justify-center shadow-md`}
          >
            <Coins className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="font-bold text-slate-800 dark:text-white text-sm block">
              pub2WIN
            </span>
            <span className="block text-[11px] text-slate-400 dark:text-slate-500 -mt-0.5 truncate">
              {brandName}
            </span>
          </div>
          <button
            className="lg:hidden text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-1 mt-2">
          {navItems.map((item) => {
            const isActive =
              item.active !== undefined
                ? item.active
                : location.pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                to={item.href || '#'}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                  transition-all duration-200 relative
                  ${
                    isActive
                      ? style.activeNav
                      : `text-slate-600 dark:text-slate-400 ${style.hoverNav}`
                  }
                `}
              >
                {isActive && (
                  <div
                    className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full ${style.activeBar}`}
                  />
                )}
                {Icon && <Icon className="w-5 h-5 shrink-0" />}
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <UserButton
              appearance={{ elements: { avatarBox: 'w-9 h-9' } }}
            />
            {user && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">
                  {user.firstName || 'User'}
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500 truncate">
                  {user.primaryEmailAddress?.emailAddress || ''}
                </p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* ── Main Area ── */}
      <div className="lg:pl-64 min-h-screen flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-30 h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800">
          <div className="h-full px-4 sm:px-6 flex items-center justify-between">
            {/* Left: hamburger + greeting */}
            <div className="flex items-center gap-4">
              <button
                className="lg:hidden text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-6 h-6" />
              </button>
              {user && (
                <div className="hidden sm:block">
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Welcome back,
                  </p>
                  <p className="text-sm font-semibold text-slate-800 dark:text-white">
                    {user.firstName ||
                      (role === 'influencer' ? 'Creator' : 'Partner')}
                  </p>
                </div>
              )}
            </div>

            {/* Right: actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleDark}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Toggle dark mode"
              >
                {isDark ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>
              <button className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
              </button>
              <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1 hidden sm:block" />
              <div className="hidden sm:block">
                <UserButton
                  appearance={{ elements: { avatarBox: 'w-9 h-9' } }}
                />
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
