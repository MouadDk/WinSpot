import { useEffect, useState, useCallback } from 'react';
import { useLocation, Outlet, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Loader2, LayoutDashboard, MapPin, Wallet, Settings,
  Coins, TrendingUp, QrCode, ArrowRight, RefreshCw,
  Sparkles, ArrowUpRight,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import DashboardLayout from '../components/layout/DashboardLayout';
import MetricCard from '../components/dashboard/MetricCard';
import { SkeletonDashboard } from '../components/ui/SkeletonLoader';
import { apiUrl, authHeaders, parseApiResponse } from '../lib/api';

// ─── Navigation Items (all wired to real routes) ────────────────────────────
const navItems = [
  { label: 'Overview',  icon: LayoutDashboard, href: '/customer-dashboard' },
  { label: 'Offers',    icon: MapPin,          href: '/customer-dashboard/offers' },
  { label: 'Wallet',    icon: Wallet,          href: '/customer-dashboard/wallet' },
  { label: 'Settings',  icon: Settings,        href: '/customer-dashboard/settings' },
];

// ─── Animated quick-action card (Claymorphism style) ────────────────────────
function QuickAction({ icon: Icon, title, description, href, gradient, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: 'easeOut' }}
    >
      <Link
        to={href}
        className="group relative flex items-center gap-4 rounded-2xl p-5
          border-[3px] border-slate-200/80 dark:border-slate-600/50
          bg-white dark:bg-slate-800/70
          shadow-[4px_4px_10px_rgba(0,0,0,0.06),-2px_-2px_6px_rgba(255,255,255,0.8)]
          dark:shadow-[4px_4px_10px_rgba(0,0,0,0.3),-2px_-2px_6px_rgba(255,255,255,0.04)]
          hover:shadow-[6px_6px_14px_rgba(0,0,0,0.08),-3px_-3px_8px_rgba(255,255,255,0.9)]
          dark:hover:shadow-[6px_6px_14px_rgba(0,0,0,0.4),-3px_-3px_8px_rgba(255,255,255,0.06)]
          hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer"
      >
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-slate-800 dark:text-white text-sm group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">{title}</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{description}</p>
        </div>
        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-purple-500 group-hover:translate-x-1 transition-all duration-300 shrink-0" />
      </Link>
    </motion.div>
  );
}

/**
 * OverviewContent — the "index" page for the customer dashboard.
 * Uses Claymorphism aesthetic: thick borders, double shadows, playful feel.
 */
function OverviewContent() {
  const { token } = useAuth();
  const [redemptions, setRedemptions] = useState([]);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const [balanceRes, historyRes] = await Promise.all([
        fetch(apiUrl('/api/transactions/balance'), { headers: authHeaders(token) }),
        fetch(apiUrl('/api/qr/my/history'), { headers: authHeaders(token) }),
      ]);
      const balanceData = await parseApiResponse(balanceRes);
      const historyData = await parseApiResponse(historyRes);
      setBalance(balanceData.balance ?? 0);
      setRedemptions(historyData.redemptions ?? []);
    } catch (fetchError) {
      setError(fetchError.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { loadData(); }, [loadData]);

  const totalCashbackEarned = redemptions.reduce((s, r) => s + (r.cashbackCoins || 0), 0);
  const totalCashbackMAD    = redemptions.reduce((s, r) => s + (r.cashbackMAD || 0), 0);

  const metrics = [
    { title: 'Wallet Balance',       value: `${balance.toFixed(1)}`,            icon: Coins,      trend: `≈ ${(balance * 10).toFixed(0)} MAD`,         trendDirection: 'up',      iconBg: 'bg-amber-100 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400' },
    { title: 'Total Cashback Earned', value: `${totalCashbackEarned.toFixed(1)}`, icon: TrendingUp, trend: `${totalCashbackMAD.toFixed(0)} MAD total`, trendDirection: 'up',      iconBg: 'bg-emerald-100 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' },
    { title: 'QR Scans',             value: redemptions.length.toString(),       icon: QrCode,     trend: 'Total redemptions',                         trendDirection: 'neutral', iconBg: 'bg-purple-100 dark:bg-purple-500/15 text-purple-600 dark:text-purple-400' },
  ];

  // ── Skeleton loading state ──
  if (loading) {
    return <SkeletonDashboard />;
  }

  return (
    <>
      {/* Page Header */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <h1
          className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight"
          style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}
        >
          My Cashback
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Scan QR codes at restaurants and earn WinCoins cashback.
        </p>
      </motion.div>

      {/* Hero Balance Card */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45, delay: 0.1 }}
      >
        <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#7c3aed] via-[#6d28d9] to-[#4f46e5] shadow-2xl shadow-purple-500/25
          border-[3px] border-purple-400/20"
        >
          {/* Decorative orbs */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/[0.06] rounded-full -translate-y-1/3 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/[0.04] rounded-full translate-y-1/3 -translate-x-1/4" />
          <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-amber-400/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl" />

          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span className="text-sm font-semibold text-purple-200 uppercase tracking-wider">Your Balance</span>
              </div>
              <div className="flex items-baseline gap-3">
                <span
                  className="text-5xl sm:text-6xl font-black text-white tabular-nums"
                  style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}
                >
                  {balance.toFixed(2)}
                </span>
                <span className="text-2xl font-bold text-purple-200">WC</span>
              </div>
              <p className="text-purple-200/70 text-sm mt-2">&asymp; {(balance * 10).toFixed(0)} MAD</p>
            </div>
            <Link
              to="/customer-dashboard/wallet"
              className="inline-flex items-center gap-2 rounded-2xl bg-white/15 hover:bg-white/25 backdrop-blur-sm border border-white/20 px-5 py-3 text-sm font-bold text-white transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-lg cursor-pointer"
            >
              <Wallet className="w-4 h-4" />
              Withdraw
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Metrics — Claymorphism variant */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {metrics.map((m, i) => (
          <motion.div
            key={m.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.15 + i * 0.08 }}
          >
            <MetricCard {...m} variant="clay" />
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2
          className="text-lg font-bold text-slate-800 dark:text-white mb-4"
          style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}
        >
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <QuickAction
            icon={MapPin}
            title="Discover Offers"
            description="Browse cashback offers from restaurants near you"
            href="/customer-dashboard/offers"
            gradient="bg-gradient-to-br from-emerald-500 to-cyan-500"
            delay={0.25}
          />
          <QuickAction
            icon={Wallet}
            title="Wallet & Withdrawals"
            description={`${balance.toFixed(1)} WC available · Withdraw to real money`}
            href="/customer-dashboard/wallet"
            gradient="bg-gradient-to-br from-violet-500 to-fuchsia-500"
            delay={0.33}
          />
          <QuickAction
            icon={Settings}
            title="Account Settings"
            description="Update profile, password, and preferences"
            href="/customer-dashboard/settings"
            gradient="bg-gradient-to-br from-slate-600 to-slate-800 dark:from-slate-500 dark:to-slate-700"
            delay={0.41}
          />
        </div>
      </div>

      {/* Recent Cashback History */}
      <motion.section
        className="rounded-3xl p-6 border-[3px] border-slate-200/80 dark:border-slate-600/50
          bg-white dark:bg-slate-800/70
          shadow-[4px_4px_10px_rgba(0,0,0,0.06),-2px_-2px_6px_rgba(255,255,255,0.8)]
          dark:shadow-[4px_4px_10px_rgba(0,0,0,0.3),-2px_-2px_6px_rgba(255,255,255,0.04)]"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.45 }}
      >
        <div className="flex items-center justify-between gap-3 mb-6">
          <h2
            className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2"
            style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}
          >
            <QrCode className="w-5 h-5 text-purple-500" />
            Recent Cashback
          </h2>
          <button
            type="button"
            onClick={loadData}
            className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-200 dark:border-slate-700 px-3 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-95 transition-all cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {error ? (
          <div className="rounded-2xl border border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-300">{error}</div>
        ) : redemptions.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 px-6 py-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-purple-100 dark:bg-purple-500/15 flex items-center justify-center">
              <QrCode className="w-8 h-8 text-purple-500 dark:text-purple-400" />
            </div>
            <p className="text-slate-600 dark:text-slate-300 font-semibold mb-1">No cashback yet</p>
            <p className="text-sm text-slate-400 dark:text-slate-500">Visit a restaurant, enjoy your meal, and scan the QR code to earn rewards!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {redemptions.slice(0, 5).map((r, i) => (
              <motion.div
                key={r._id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.5 + i * 0.06 }}
                className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-700/50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
              >
                <div>
                  <p className="font-semibold text-slate-800 dark:text-white">{r.snapshotItemName}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {r.offerId?.establishmentName || 'Restaurant'} &middot; {new Date(r.redeemedAt).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-emerald-600 dark:text-emerald-400">+{r.cashbackCoins?.toFixed(1)} WC</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{r.cashbackMAD?.toFixed(0)} MAD</p>
                </div>
              </motion.div>
            ))}
            {redemptions.length > 5 && (
              <Link
                to="/customer-dashboard/wallet"
                className="block text-center text-sm font-semibold text-purple-600 dark:text-purple-400 hover:underline pt-2 cursor-pointer"
              >
                View all {redemptions.length} transactions &rarr;
              </Link>
            )}
          </div>
        )}
      </motion.section>
    </>
  );
}

/**
 * CustomerDashboard — the layout wrapper.
 */
export default function CustomerDashboard() {
  const { user } = useAuth();
  const location = useLocation();
  const isIndex = location.pathname === '/customer-dashboard';

  return (
    <DashboardLayout role="customer" user={user} navItems={navItems}>
      {isIndex ? <OverviewContent /> : <Outlet />}
    </DashboardLayout>
  );
}
