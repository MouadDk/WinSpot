import { useEffect, useState, useCallback } from 'react';
import {
  Wallet, Coins, ArrowDownCircle, ArrowUpCircle, Clock,
  CheckCircle2, XCircle, Loader2, RefreshCw, QrCode,
  ArrowDownCircle as WithdrawIcon, ChevronDown, X,
  AlertCircle, Sparkles,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import MetricCard from '../../components/dashboard/MetricCard';
import { apiUrl, authHeaders, parseApiResponse } from '../../lib/api';

const MIN_WITHDRAWAL = 20;
const WITHDRAWAL_FEE_PERCENT = 1.5;

const TYPE_META = {
  cashback:       { label: 'Cashback',   color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10', Icon: ArrowUpCircle,   sign: '+' },
  topup:          { label: 'Top-Up',     color: 'text-blue-600 dark:text-blue-400',       bg: 'bg-blue-50 dark:bg-blue-500/10',       Icon: ArrowUpCircle,   sign: '+' },
  withdrawal:     { label: 'Withdrawal', color: 'text-violet-600 dark:text-violet-400',   bg: 'bg-violet-50 dark:bg-violet-500/10',   Icon: ArrowDownCircle, sign: '−' },
  withdrawal_fee: { label: 'Fee',        color: 'text-slate-400',                         bg: 'bg-slate-50 dark:bg-slate-800',        Icon: ArrowDownCircle, sign: '−' },
};

const STATUS_META = {
  completed: { label: 'Completed', Icon: CheckCircle2, cls: 'text-emerald-600 dark:text-emerald-400' },
  pending:   { label: 'Pending',   Icon: Clock,        cls: 'text-amber-600 dark:text-amber-400' },
  failed:    { label: 'Failed',    Icon: XCircle,      cls: 'text-red-500 dark:text-red-400' },
};

// ── Confirmation Modal ───────────────────────────────────────────────────────
function ConfirmModal({ amount, paymentMethod, paymentDetails, onConfirm, onCancel, submitting }) {
  const fee = parseFloat((amount * WITHDRAWAL_FEE_PERCENT / 100).toFixed(2));
  const net = parseFloat((amount - fee).toFixed(2));
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl max-w-sm w-full p-8 relative">
        <button onClick={onCancel} className="absolute top-4 right-4 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700"><X className="w-5 h-5 text-slate-500" /></button>
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-violet-100 dark:bg-violet-500/20 rounded-2xl flex items-center justify-center mx-auto mb-3"><WithdrawIcon className="w-7 h-7 text-violet-600 dark:text-violet-400" /></div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-white">Confirm Withdrawal</h3>
        </div>
        <div className="space-y-3 mb-6 text-sm">
          <div className="flex justify-between"><span className="text-slate-500">Amount</span><span className="font-semibold text-slate-800 dark:text-white">{amount} WC</span></div>
          <div className="flex justify-between"><span className="text-slate-500">Fee ({WITHDRAWAL_FEE_PERCENT}%)</span><span className="font-semibold text-red-500">−{fee} WC</span></div>
          <div className="flex justify-between border-t border-slate-200 dark:border-slate-700 pt-3"><span className="font-bold text-slate-800 dark:text-white">You receive</span><span className="font-bold text-emerald-600 dark:text-emerald-400">{net} WC ({(net * 10).toFixed(0)} MAD)</span></div>
          <div className="flex justify-between"><span className="text-slate-500">Via</span><span className="font-semibold capitalize">{paymentMethod}</span></div>
          <div className="flex justify-between"><span className="text-slate-500">To</span><span className="font-mono text-xs max-w-[180px] truncate">{paymentDetails}</span></div>
        </div>
        <p className="text-xs text-amber-600 dark:text-amber-400 mb-6 text-center flex items-center justify-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Processed within 2–5 business days.</p>
        <div className="flex gap-3">
          <button onClick={onCancel} disabled={submitting} className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 py-3 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">Cancel</button>
          <button onClick={onConfirm} disabled={submitting} className="flex-1 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-400 py-3 text-sm font-bold text-white hover:from-violet-600 hover:to-fuchsia-500 transition-all flex items-center justify-center gap-2">
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * CustomerWalletPage — full wallet view:
 *  - Balance + metrics
 *  - Withdrawal form with live fee preview + confirmation modal
 *  - Full transaction history (cashback + withdrawals)
 */
export default function CustomerWalletPage() {
  const { token } = useAuth();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Withdrawal form
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('paypal');
  const [paymentDetails, setPaymentDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [withdrawError, setWithdrawError] = useState(null);
  const [withdrawSuccess, setWithdrawSuccess] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const loadData = useCallback(async () => {
    if (!token) return;
    setLoading(true); setError(null);
    try {
      const [balRes, txRes] = await Promise.all([
        fetch(apiUrl('/api/transactions/balance'), { headers: authHeaders(token) }),
        fetch(apiUrl('/api/transactions'), { headers: authHeaders(token) }),
      ]);
      const balData = await parseApiResponse(balRes);
      const txData  = await parseApiResponse(txRes);
      setBalance(balData.balance ?? 0);
      setTransactions((txData.transactions ?? []).filter((t) => t.type !== 'withdrawal_fee'));
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }, [token]);

  useEffect(() => { loadData(); }, [loadData]);

  const numAmount = parseFloat(amount) || 0;
  const fee = parseFloat((numAmount * WITHDRAWAL_FEE_PERCENT / 100).toFixed(2));
  const net = parseFloat((numAmount - fee).toFixed(2));

  const validationError = numAmount > 0 && numAmount < MIN_WITHDRAWAL ? `Minimum ${MIN_WITHDRAWAL} WC`
    : numAmount > balance ? 'Insufficient balance' : null;

  const canSubmit = numAmount >= MIN_WITHDRAWAL && numAmount <= balance && paymentDetails.trim().length > 0 && !submitting;

  const handleConfirm = async () => {
    setSubmitting(true); setWithdrawError(null);
    try {
      const res = await fetch(apiUrl('/api/transactions/withdraw'), {
        method: 'POST',
        headers: authHeaders(token, { 'Content-Type': 'application/json' }),
        body: JSON.stringify({ amount: numAmount, paymentMethod, paymentDetails: paymentDetails.trim() }),
      });
      const data = await parseApiResponse(res);
      if (!data.success) throw new Error(data.message);
      setWithdrawSuccess(`Withdrawal of ${numAmount} WC submitted! Net: ${data.netAmount} WC (${(data.netAmount * 10).toFixed(0)} MAD).`);
      setAmount(''); setPaymentDetails(''); setShowConfirm(false);
      await loadData();
    } catch (err) { setWithdrawError(err.message); setShowConfirm(false); }
    finally { setSubmitting(false); }
  };

  const totalEarned    = transactions.filter((t) => t.type === 'cashback').reduce((s, t) => s + t.amount, 0);
  const totalWithdrawn = transactions.filter((t) => t.type === 'withdrawal' && t.status !== 'failed').reduce((s, t) => s + t.amount, 0);
  const pendingWd      = transactions.filter((t) => t.type === 'withdrawal' && t.status === 'pending').length;

  const metrics = [
    { title: 'Balance',          value: `${balance.toFixed(2)} WC`,       icon: Coins,           trend: `≈ ${(balance * 10).toFixed(0)} MAD`,    trendDirection: 'up',      iconBg: 'bg-amber-100 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400' },
    { title: 'Total Earned',     value: `${totalEarned.toFixed(1)} WC`,    icon: ArrowUpCircle,   trend: 'from QR cashbacks',                      trendDirection: 'up',      iconBg: 'bg-emerald-100 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' },
    { title: 'Total Withdrawn',  value: `${totalWithdrawn.toFixed(1)} WC`, icon: ArrowDownCircle, trend: 'completed & pending',                    trendDirection: 'neutral', iconBg: 'bg-violet-100 dark:bg-violet-500/15 text-violet-600 dark:text-violet-400' },
    { title: 'Pending',          value: pendingWd.toString(),               icon: Clock,           trend: 'awaiting admin review',                  trendDirection: 'neutral', iconBg: 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400' },
  ];

  return (
    <div className="space-y-8">
      {showConfirm && <ConfirmModal amount={numAmount} paymentMethod={paymentMethod} paymentDetails={paymentDetails} onConfirm={handleConfirm} onCancel={() => setShowConfirm(false)} submitting={submitting} />}

      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">Wallet</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Your WinCoins balance, withdrawals, and transaction history.</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m) => <MetricCard key={m.title} {...m} />)}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Withdrawal Form */}
        <section id="wallet-section" className="bg-white dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-700/50 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-violet-100 dark:bg-violet-500/20 rounded-xl flex items-center justify-center">
              <Wallet className="w-5 h-5 text-violet-600 dark:text-violet-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">Withdraw WinCoins</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Convert cashback to real money</p>
            </div>
          </div>

          {/* ★ Hero Balance Card — branded, eye-catching */}
          <div className="relative overflow-hidden bg-gradient-to-br from-[#7c3aed] via-[#6d28d9] to-[#4f46e5] rounded-2xl p-6 mb-6 text-white shadow-xl shadow-purple-500/20">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/[0.06] rounded-full -translate-y-1/3 translate-x-1/4" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/[0.04] rounded-full translate-y-1/3 -translate-x-1/4" />
            <div className="relative z-10">
              <div className="flex items-center gap-1.5 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <p className="text-sm font-semibold text-purple-200 uppercase tracking-wider">Available</p>
              </div>
              <p className="text-4xl font-black tabular-nums">{balance.toFixed(2)} <span className="text-lg font-bold text-purple-200">WC</span></p>
              <p className="text-sm text-purple-200/70 mt-1">≈ {(balance * 10).toFixed(0)} MAD</p>
            </div>
          </div>

          {withdrawSuccess && (
            <div className="mb-4 flex items-start gap-2 rounded-xl border border-emerald-200 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-300">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />{withdrawSuccess}
            </div>
          )}
          {withdrawError && (
            <div className="mb-4 flex items-start gap-2 rounded-xl border border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-300">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />{withdrawError}
            </div>
          )}

          <form onSubmit={(e) => { e.preventDefault(); if (canSubmit) setShowConfirm(true); }} className="space-y-4">
            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Amount <span className="font-normal text-slate-400">— min {MIN_WITHDRAWAL} WC</span></label>
              <input type="number" min={MIN_WITHDRAWAL} max={balance} step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder={`${MIN_WITHDRAWAL}.00`} className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 px-4 py-3 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-violet-500 transition-all" />
              {validationError && <p className="mt-1 text-xs text-red-500">{validationError}</p>}
            </div>

            {/* Fee preview */}
            {numAmount >= MIN_WITHDRAWAL && numAmount <= balance && (
              <div className="rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 px-4 py-3 text-sm space-y-1">
                <div className="flex justify-between text-slate-500"><span>Fee ({WITHDRAWAL_FEE_PERCENT}%)</span><span className="text-red-500 font-medium">−{fee} WC</span></div>
                <div className="flex justify-between font-semibold border-t border-slate-200 dark:border-slate-700 pt-1 mt-1"><span className="text-slate-800 dark:text-white">You receive</span><span className="text-emerald-600 dark:text-emerald-400">{net} WC ({(net * 10).toFixed(0)} MAD)</span></div>
              </div>
            )}

            {/* Payment method */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Payment Method</label>
              <div className="relative">
                <select value={paymentMethod} onChange={(e) => { setPaymentMethod(e.target.value); setPaymentDetails(''); }} className="w-full appearance-none rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 px-4 py-3 pr-10 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-violet-500 transition-all">
                  <option value="paypal">PayPal</option>
                  <option value="bank">Bank Transfer (RIB)</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              </div>
            </div>

            {/* Payment details */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{paymentMethod === 'paypal' ? 'PayPal Email' : 'Bank RIB / IBAN'}</label>
              <input type={paymentMethod === 'paypal' ? 'email' : 'text'} value={paymentDetails} onChange={(e) => setPaymentDetails(e.target.value)} placeholder={paymentMethod === 'paypal' ? 'your@paypal.com' : 'MA64 0000...'} required className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 px-4 py-3 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-violet-500 transition-all" />
            </div>

            <button type="submit" disabled={!canSubmit} className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-400 px-4 py-3 font-bold text-white shadow-lg shadow-violet-500/20 hover:from-violet-600 hover:to-fuchsia-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              <WithdrawIcon className="w-5 h-5" />
              Request Withdrawal
            </button>
          </form>
        </section>

        {/* Transaction History */}
        <section className="bg-white dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-700/50 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <QrCode className="w-5 h-5 text-purple-500" />
              History
            </h2>
            <button onClick={loadData} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12 gap-2 text-slate-500"><Loader2 className="w-5 h-5 animate-spin" /> Loading…</div>
          ) : error ? (
            <div className="rounded-xl border border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-300">{error}</div>
          ) : transactions.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 px-6 py-12 text-center text-slate-500 dark:text-slate-400">
              No transactions yet. Scan QR codes to earn your first cashback!
            </div>
          ) : (
            <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
              {transactions.map((tx) => {
                const meta = TYPE_META[tx.type] || TYPE_META.cashback;
                const status = STATUS_META[tx.status] || STATUS_META.completed;
                const StatusIcon = status.Icon;
                const TypeIcon = meta.Icon;
                return (
                  <div key={tx._id} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-700/50">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${meta.bg}`}>
                      <TypeIcon className={`w-5 h-5 ${meta.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-800 dark:text-white text-sm truncate">{tx.description || meta.label}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{new Date(tx.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className={`font-bold text-sm ${meta.sign === '+' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}`}>
                        {meta.sign}{tx.amount?.toFixed(2)} WC
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
      </div>
    </div>
  );
}
