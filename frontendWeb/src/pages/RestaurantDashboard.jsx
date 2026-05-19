import { useEffect, useState } from 'react';
import { useLocation, Outlet, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Loader2, LayoutDashboard, Megaphone, Wallet, Settings,
  Coins, BarChart3, AlertTriangle, ArrowRight, QrCode,
  Sparkles, ArrowUpRight,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import DashboardLayout from '../components/layout/DashboardLayout';
import MetricCard from '../components/dashboard/MetricCard';
import { apiUrl, authHeaders, parseApiResponse } from '../lib/api';

// ─── Navigation Items (all wired to real routes) ────────────────────────────
const navItems = [
  { label: 'Overview',  icon: LayoutDashboard, href: '/restaurant-dashboard' },
  { label: 'Offers',   icon: Megaphone,        href: '/restaurant-dashboard/offers' },
  { label: 'Wallet',   icon: Wallet,           href: '/restaurant-dashboard/wallet' },
  { label: 'Settings', icon: Settings,         href: '/restaurant-dashboard/settings' },
];

// ─── Animated quick-action card ─────────────────────────────────────────────
function QuickAction({ icon: Icon, title, description, href, gradient, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: 'easeOut' }}
    >
      <Link
        to={href}
        className="group relative flex items-center gap-4 rounded-2xl p-5 border border-slate-100 dark:border-slate-700/50 bg-white dark:bg-slate-800/50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
      >
        {/* Hover glow */}
        <div className={`absolute inset-0 opacity-0 group-hover:opacity-[0.04] transition-opacity duration-500 ${gradient}`} />
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-slate-800 dark:text-white text-sm group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">{title}</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{description}</p>
        </div>
        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-cyan-500 group-hover:translate-x-1 transition-all duration-300 shrink-0" />
      </Link>
    </motion.div>
  );
}

/**
 * OverviewContent — the "index" page for the restaurant dashboard.
 */
function OverviewContent() {
  const { token } = useAuth();
  const [offers, setOffers] = useState([]);
  const [walletBalance, setWalletBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    let ignore = false;

    Promise.all([
      fetch(apiUrl('/api/offers/mine'), { headers: authHeaders(token) }),
      fetch(apiUrl('/api/transactions/balance'), { headers: authHeaders(token) }),
    ])
      .then(async ([offersRes, balanceRes]) => {
        const offersData = await parseApiResponse(offersRes);
        const balanceData = await parseApiResponse(balanceRes);
        if (!ignore) {
          setOffers(offersData.offers || []);
          setWalletBalance(balanceData.balance ?? 0);
        }
      })
      .catch(() => {})
      .finally(() => { if (!ignore) setLoading(false); });

    return () => { ignore = true; };
  }, [token]);

  const activeOffers = offers.filter((o) => o.isActive);
  const totalBudgetRemaining = offers.reduce((s, o) => s + Number(o.remainingWinCoinsBudget || 0), 0);
  const totalBudgetPublished = offers.reduce((s, o) => s + Number(o.totalWinCoinsBudget || 0), 0);
  const avgCashback = offers.length > 0 ? offers.reduce((s, o) => s + o.cashbackPercent, 0) / offers.length : 0;
  const avgPrice = offers.length > 0 ? offers.reduce((s, o) => s + o.price, 0) / offers.length : 0;

  const metrics = [
    { title: 'Active Offers',    value: activeOffers.length.toString(),         icon: Megaphone, trend: `${offers.length} total`,                    trendDirection: 'up',      iconBg: 'bg-cyan-100 dark:bg-cyan-500/15 text-cyan-600 dark:text-cyan-400' },
    { title: 'Budget Remaining', value: `${totalBudgetRemaining.toFixed(1)} WC`, icon: Coins,     trend: `Published: ${totalBudgetPublished.toFixed(1)}`, trendDirection: 'neutral', iconBg: 'bg-blue-100 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400' },
    { title: 'Avg Cashback',     value: `${avgCashback.toFixed(0)}%`,            icon: BarChart3, trend: `Avg price: ${avgPrice.toFixed(0)} MAD`,     trendDirection: 'up',      iconBg: 'bg-emerald-100 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 gap-3 text-slate-500 dark:text-slate-400">
        <Loader2 className="w-5 h-5 animate-spin" /> Loading dashboard…
      </div>
    );
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
        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">Overview</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Welcome back! Here's a snapshot of your cashback business.
        </p>
      </motion.div>

      {/* ★ Hero Wallet Card — unique branded gradient */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45, delay: 0.1 }}
      >
        <div className={`relative overflow-hidden rounded-3xl p-6 sm:p-8 shadow-2xl ${
          walletBalance <= 0
            ? 'bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 shadow-amber-500/25'
            : 'bg-gradient-to-br from-[#0ea5e9] via-[#0284c7] to-[#1d4ed8] shadow-blue-500/25'
        }`}>
          {/* Decorative orbs */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/[0.06] rounded-full -translate-y-1/3 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/[0.04] rounded-full translate-y-1/3 -translate-x-1/4" />
          <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-amber-400/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl" />
          
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                {walletBalance <= 0 ? (
                  <AlertTriangle className="w-4 h-4 text-amber-200" />
                ) : (
                  <Sparkles className="w-4 h-4 text-cyan-200" />
                )}
                <span className="text-sm font-semibold text-white/80 uppercase tracking-wider">
                  {walletBalance <= 0 ? 'Wallet Empty' : 'Wallet Balance'}
                </span>
              </div>
              <div className="flex items-baseline gap-3">
                <span className="text-5xl sm:text-6xl font-black text-white tabular-nums">{walletBalance.toFixed(2)}</span>
                <span className="text-2xl font-bold text-white/70">WC</span>
              </div>
              <p className="text-white/60 text-sm mt-2">
                {walletBalance <= 0
                  ? 'Top up to create offers and start earning'
                  : `≈ ${(walletBalance * 10).toFixed(0)} MAD · Budget across offers: ${totalBudgetRemaining.toFixed(1)} WC`}
              </p>
            </div>
            <Link
              to="/restaurant-dashboard/wallet"
              className="inline-flex items-center gap-2 rounded-2xl bg-white/15 hover:bg-white/25 backdrop-blur-sm border border-white/20 px-5 py-3 text-sm font-bold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              <Wallet className="w-4 h-4" />
              {walletBalance <= 0 ? 'Request Top-Up' : 'View Wallet'}
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {metrics.map((m, i) => (
          <motion.div
            key={m.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.15 + i * 0.08 }}
          >
            <MetricCard {...m} />
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <QuickAction
            icon={Megaphone}
            title="Manage Offers"
            description={`${activeOffers.length} active · Create, edit, or generate QR codes`}
            href="/restaurant-dashboard/offers"
            gradient="bg-gradient-to-br from-cyan-500 to-blue-500"
            delay={0.25}
          />
          <QuickAction
            icon={Wallet}
            title="Wallet & Transactions"
            description="View balance, history, and request top-ups"
            href="/restaurant-dashboard/wallet"
            gradient="bg-gradient-to-br from-violet-500 to-fuchsia-500"
            delay={0.33}
          />
          <QuickAction
            icon={Settings}
            title="Account Settings"
            description="Update profile, password, and preferences"
            href="/restaurant-dashboard/settings"
            gradient="bg-gradient-to-br from-slate-600 to-slate-800 dark:from-slate-500 dark:to-slate-700"
            delay={0.41}
          />
        </div>
      </div>

      {/* Recent Active Offers preview */}
      <motion.section
        className="bg-white dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-700/50 shadow-sm p-6"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.45 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <QrCode className="w-5 h-5 text-cyan-500" />
            Active Offers
          </h2>
          <Link
            to="/restaurant-dashboard/offers"
            className="text-sm font-semibold text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
          >
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        {activeOffers.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 px-6 py-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-cyan-100 dark:bg-cyan-500/15 flex items-center justify-center">
              <Megaphone className="w-8 h-8 text-cyan-500 dark:text-cyan-400" />
            </div>
            <p className="text-slate-600 dark:text-slate-300 font-semibold mb-1">No offers yet</p>
            <p className="text-sm text-slate-400 dark:text-slate-500">Create your first cashback offer to start rewarding customers.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {activeOffers.slice(0, 3).map((offer, i) => (
              <motion.div
                key={offer._id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.5 + i * 0.06 }}
                className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-700/50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
              >
                <div>
                  <p className="font-semibold text-slate-800 dark:text-white text-sm">{offer.itemName}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{offer.establishmentName} · {offer.cashbackPercent}% cashback</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-cyan-600 dark:text-cyan-400">{offer.price} MAD</p>
                  <p className="text-xs text-slate-500">{Number(offer.remainingWinCoinsBudget || 0).toFixed(1)} WC left</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.section>
    </>
  );
}

/**
 * RestaurantDashboard — the layout wrapper.
 */
export default function RestaurantDashboard() {
  const { user } = useAuth();
  const location = useLocation();
  const isIndex = location.pathname === '/restaurant-dashboard';

  return (
    <DashboardLayout role="restaurant" user={user} navItems={navItems}>
      {isIndex ? <OverviewContent /> : <Outlet />}
    </DashboardLayout>
  );
}
