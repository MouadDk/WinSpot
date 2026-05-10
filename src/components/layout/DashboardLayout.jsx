import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { Menu, X, Sun, Moon, Bell, LogOut, ChevronDown } from 'lucide-react';
import { useDarkMode } from '../../hooks/useDarkMode.jsx';
import p2wLogo from '../../assets/logo-p2w.png';

const roleStyles = {
  influencer: {
    logoGradient: 'bg-brand-gradient',
    activeNav: 'glass-panel text-[var(--brand-highlight)] dark:text-[var(--brand-secondary)] border-l-4 border-l-[var(--brand-primary)]',
    activeBar: 'hidden',
    hoverNav: 'hover:bg-[var(--glass-bg)]',
  },
  restaurant: {
    logoGradient: 'bg-brand-gradient',
    activeNav: 'glass-panel text-[var(--brand-highlight)] dark:text-[var(--brand-secondary)] border-l-4 border-l-[var(--brand-primary)]',
    activeBar: 'hidden',
    hoverNav: 'hover:bg-[var(--glass-bg)]',
  },
};

export default function DashboardLayout({
  role = 'influencer',
  navItems = [],
  children,
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isDark, toggle: toggleDark } = useDarkMode();
  const location = useLocation();
  const navigate = useNavigate();
  const { user: authUser, logout } = useAuth();
  const style = roleStyles[role];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Generate initials from user name
  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    return parts.length >= 2
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] transition-colors duration-300">
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
          bg-[var(--bg-card)] border-r border-[var(--border-subtle)]
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo */}
        <div className="h-16 flex items-center gap-3 px-5 border-b border-[var(--border-subtle)]">
          <div className="flex items-center justify-start h-full py-2">
            <img src={p2wLogo} alt="P2W Logo" style={{ width: '160px', height: 'auto', objectFit: 'contain', transform: 'scale(1.2)', transformOrigin: 'left center' }} />
          </div>
          <div className="flex-1 min-w-0">
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
                      : `text-[var(--text-muted)] ${style.hoverNav}`
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
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[var(--border-subtle)]">
          {authUser && (
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl bg-brand-gradient flex items-center justify-center text-white text-sm font-bold shrink-0">
                {getInitials(authUser.name)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[var(--text-main)] truncate">
                  {authUser.name}
                </p>
                <p className="text-xs text-[var(--text-muted)] truncate">
                  {authUser.email}
                </p>
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* ── Main Area ── */}
      <div className="lg:pl-64 min-h-screen flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-30 h-16 bg-[var(--bg-main)]/80 backdrop-blur-xl border-b border-[var(--border-subtle)]">
          <div className="h-full px-4 sm:px-6 flex items-center justify-between">
            {/* Left: hamburger + greeting */}
            <div className="flex items-center gap-4">
              <button
                className="lg:hidden text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-6 h-6" />
              </button>
              {authUser && (
                <div className="hidden sm:block">
                  <p className="text-xs text-[var(--text-muted)]">
                    Bonjour,
                  </p>
                  <p className="text-sm font-semibold text-[var(--text-main)]">
                    {authUser.name?.split(' ')[0] || (role === 'influencer' ? 'Créateur' : 'Partenaire')}
                  </p>
                </div>
              )}
            </div>

            {/* Right: actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleDark}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--glass-bg)] transition-colors"
                aria-label="Basculer le mode sombre"
              >
                {isDark ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>
              <button className="w-9 h-9 rounded-xl flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--glass-bg)] transition-colors relative" aria-label="Notifications">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[var(--brand-highlight)] rounded-full" />
              </button>
              <div className="w-px h-6 bg-[var(--border-subtle)] mx-1 hidden sm:block" />
              {authUser && (
                <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-[var(--glass-bg)] cursor-pointer hover:bg-[var(--glass-border)] transition-colors">
                  <div className="w-8 h-8 rounded-full bg-brand-gradient flex items-center justify-center text-white text-xs font-bold">
                    {getInitials(authUser.name)}
                  </div>
                  <span className="text-sm font-medium text-[var(--text-main)] truncate max-w-[100px]">
                    {authUser.name?.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                </div>
              )}
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
