import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Wallet, Coins, ArrowDownCircle, ArrowUpCircle, Clock,
  CheckCircle2, XCircle, Loader2, RefreshCw, TrendingUp,
  Sparkles, ArrowUpRight, Mail, MessageCircle,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import MetricCard from '../../components/dashboard/MetricCard';
import { apiUrl, authHeaders, parseApiResponse } from '../../lib/api';

const TYPE_LABELS = {
  cashback:        { label: 'Cashback',     color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10', Icon: ArrowUpCircle },
  topup:           { label: 'Top-Up',       color: 'text-blue-600 dark:text-blue-400',       bg: 'bg-blue-50 dark:bg-blue-500/10',       Icon: ArrowUpCircle },
  withdrawal:      { label: 'Withdrawal',   color: 'text-violet-600 dark:text-violet-400',   bg: 'bg-violet-50 dark:bg-violet-500/10',   Icon: ArrowDownCircle },
  withdrawal_fee:  { label: 'Fee',          color: 'text-slate-500 dark:text-slate-400',     bg: 'bg-slate-50 dark:bg-slate-800',        Icon: ArrowDownCircle },
};

const STATUS_BADGE = {
  completed: { label: 'Completed', icon: CheckCircle2, cls: 'text-emerald-600 dark:text-emerald-400' },
  pending:   { label: 'Pending',   icon: Clock,        cls: 'text-amber-600 dark:text-amber-400' },
  failed:    { label: 'Failed',    icon: XCircle,      cls: 'text-red-500 dark:text-red-400' },
};

/**
 * MerchantWalletPage — shows:
 *  - Current wallet balance + metrics
 *  - Full transaction history (topup, cashback credit, withdrawals, fees)
 *  - Request top-up info panel (admin-initiated)
 */
export default function MerchantWalletPage() {
  const { token } = useAuth();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const [balRes, txRes] = await Promise.all([
        fetch(apiUrl('/api/transactions/balance'), { headers: authHeaders(token) }),
        fetch(apiUrl('/api/transactions'), { headers: authHeaders(token) }),
      ]);
      const balData = await parseApiResponse(balRes);
      const txData = await parseApiResponse(txRes);
      setBalance(balData.balance ?? 0);
      // Hide internal withdrawal_fee entries from merchant view
      setTransactions((txData.transactions ?? []).filter((t) => t.type !== 'withdrawal_fee'));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { loadData(); }, [loadData]);

  const totalTopups    = transactions.filter((t) => t.type === 'topup').reduce((s, t) => s + t.amount, 0);
  const totalWithdrawn = transactions.filter((t) => t.type === 'withdrawal' && t.status === 'completed').reduce((s, t) => s + t.amount, 0);
  const pendingCount   = transactions.filter((t) => t.status === 'pending').length;

  const metrics = [
    { title: 'Current Balance',    value: `${balance.toFixed(2)} WC`,   icon: Coins,          trend: `≈ ${(balance * 10).toFixed(0)} MAD`,         trendDirection: 'up',      iconBg: 'bg-violet-100 dark:bg-violet-500/15 text-violet-600 dark:text-violet-400' },
    { title: 'Total Received',     value: `${totalTopups.toFixed(1)} WC`, icon: ArrowUpCircle, trend: 'from admin top-ups',                          trendDirection: 'up',      iconBg: 'bg-blue-100 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400' },
    { title: 'Total Spent',        value: `${totalWithdrawn.toFixed(1)} WC`, icon: ArrowDownCircle, trend: 'completed withdrawals',                 trendDirection: 'neutral', iconBg: 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400' },
    { title: 'Pending',            value: pendingCount.toString(),        icon: Clock,          trend: 'awaiting processing',                         trendDirection: 'neutral', iconBg: 'bg-amber-100 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div className="flex items-start justify-between gap-4" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">Wallet</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Your WinCoins balance and transaction history.</p>
        </div>
        <button onClick={loadData} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:shadow-md transition-all duration-200">
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </motion.div>

      {/* ★ Hero Wallet Card */}
      <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.45, delay: 0.1 }}>
        <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#0ea5e9] via-[#0284c7] to-[#1d4ed8] shadow-2xl shadow-blue-500/25">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/[0.06] rounded-full -translate-y-1/3 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/[0.04] rounded-full translate-y-1/3 -translate-x-1/4" />
          <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-amber-400/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl" />
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-cyan-200" />
                <span className="text-sm font-semibold text-blue-100 uppercase tracking-wider">Current Balance</span>
              </div>
              <div className="flex items-baseline gap-3">
                <span className="text-5xl sm:text-6xl font-black text-white tabular-nums">{balance.toFixed(2)}</span>
                <span className="text-2xl font-bold text-blue-200">WC</span>
              </div>
              <p className="text-blue-200/70 text-sm mt-2">≈ {(balance * 10).toFixed(0)} MAD</p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20 px-5 py-3 text-sm font-bold text-white">
              <ArrowUpRight className="w-4 h-4" />
              Request Top-Up Below
            </div>
          </div>
        </div>
      </motion.div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, i) => (
          <motion.div key={m.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.15 + i * 0.08 }}>
            <MetricCard {...m} />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Transaction History */}
        <section className="xl:col-span-2 bg-white dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-700/50 shadow-sm p-6">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-cyan-500" />
            Transaction History
          </h2>

          {loading ? (
            <div className="flex items-center justify-center py-12 gap-2 text-slate-500 dark:text-slate-400">
              <Loader2 className="w-5 h-5 animate-spin" /> Loading…
            </div>
          ) : error ? (
            <div className="rounded-xl border border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-300">{error}</div>
          ) : transactions.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 px-6 py-12 text-center text-slate-500 dark:text-slate-400">
              No transactions yet. Ask the admin to top up your wallet to start creating offers.
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map((tx) => {
                const type = TYPE_LABELS[tx.type] || TYPE_LABELS.cashback;
                const status = STATUS_BADGE[tx.status] || STATUS_BADGE.completed;
                const StatusIcon = status.icon;
                const TypeIcon = type.Icon;
                const isCredit = ['cashback', 'topup'].includes(tx.type);
                return (
                  <div key={tx._id} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-700/50">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${type.bg}`}>
                      <TypeIcon className={`w-5 h-5 ${type.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-800 dark:text-white text-sm truncate">{tx.description || type.label}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {new Date(tx.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className={`font-bold text-sm ${isCredit ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}>
                        {isCredit ? '+' : '−'}{tx.amount?.toFixed(2)} WC
                      </p>
                      <span className={`inline-flex items-center gap-1 text-xs font-medium ${status.cls}`}>
                        <StatusIcon className="w-3 h-3" />
                        {status.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Top-Up Info Panel */}
        <section className="bg-white dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-700/50 shadow-sm p-6 h-fit">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-cyan-100 dark:bg-cyan-500/20 rounded-xl flex items-center justify-center">
              <Wallet className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            </div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-white">Need more WinCoins?</h2>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
            Merchant wallet top-ups are processed by the WinSpot admin team. Send a top-up request with the amount you need and your preferred payment method.
          </p>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-700/50 px-4 py-3">
              <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center shrink-0">
                <Mail className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="font-semibold text-slate-700 dark:text-slate-200">Email</p>
                <p className="text-slate-400 text-xs">topup@winspot.ma</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-700/50 px-4 py-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center shrink-0">
                <MessageCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="font-semibold text-slate-700 dark:text-slate-200">WhatsApp</p>
                <p className="text-slate-400 text-xs">+212 6XX XXX XXX</p>
              </div>
            </div>
          </div>
          <p className="mt-4 text-xs text-slate-400 dark:text-slate-500 text-center">
            1 WinCoin = 10 MAD • Minimum top-up: 50 WinCoins
          </p>
        </section>
      </div>
    </div>
  );
}
