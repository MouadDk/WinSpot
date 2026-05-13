import { useState, useEffect } from 'react';
import { Wallet as WalletIcon, ArrowRightLeft, Clock, CheckCircle2, AlertCircle, Building2, CreditCard, Download, Loader2 } from 'lucide-react';
import { apiUrl, authHeaders, parseApiResponse } from '../../lib/api';

export default function WalletTab({ token }) {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cashout form state
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('paypal'); // 'paypal' or 'bank'
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [paymentDetails, setPaymentDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadWalletData = async () => {
    setLoading(true);
    try {
      const [balanceRes, txRes] = await Promise.all([
        fetch(apiUrl('/api/transactions/balance'), { headers: authHeaders(token) }),
        fetch(apiUrl('/api/transactions'), { headers: authHeaders(token) })
      ]);

      const balanceData = await parseApiResponse(balanceRes);
      const txData = await parseApiResponse(txRes);

      if (balanceData.success) setBalance(balanceData.balance);
      if (txData.success) setTransactions(txData.transactions);
    } catch (err) {
      console.error('Error loading wallet data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) loadWalletData();
  }, [token]);

  const handleCashout = async (e) => {
    e.preventDefault();
    if (!amount || amount < 20) {
      return alert('Minimum withdrawal amount is 20 WinCoins.');
    }
    if (amount > balance) {
      return alert('Insufficient WinCoins balance.');
    }
    if (!firstName.trim() || !lastName.trim()) {
      return alert('Please enter your first and last name.');
    }
    if (!paymentDetails.trim()) {
      return alert('Please enter your payment details.');
    }

    setIsSubmitting(true);
    try {
      const fullDetails = `Name: ${firstName.trim()} ${lastName.trim()} | ${paymentMethod === 'paypal' ? 'Email' : 'RIB'}: ${paymentDetails.trim()}`;

      const res = await fetch(apiUrl('/api/transactions/withdraw'), {
        method: 'POST',
        headers: authHeaders(token, { 'Content-Type': 'application/json' }),
        body: JSON.stringify({
          amount: Number(amount),
          paymentMethod,
          paymentDetails: fullDetails
        })
      });
      const data = await parseApiResponse(res);
      if (data.success) {
        alert('Withdrawal request submitted successfully! It will be processed soon.');
        setAmount('');
        setFirstName('');
        setLastName('');
        setPaymentDetails('');
        await loadWalletData(); // Refresh balance and history
      } else {
        alert('Error: ' + data.message);
      }
    } catch (err) {
      alert('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-100 dark:bg-purple-500/20 rounded-xl flex items-center justify-center">
            <WalletIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          My Wallet
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">
          Manage your WinCoins balance, request cashouts, and view your transaction history.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Balance & Cashout Form */}
        <div className="lg:col-span-1 space-y-6">
          {/* Balance Card */}
          <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl p-6 text-white shadow-xl shadow-purple-500/20 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
            <div className="relative z-10">
              <p className="text-purple-100 font-medium mb-1">Available Balance</p>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-extrabold tracking-tight">{balance}</span>
                <span className="text-xl font-bold text-purple-200">🪙</span>
              </div>
              <p className="text-sm text-purple-200 mt-4">
                1 WinCoin = 1 MAD (approx.)
              </p>
            </div>
          </div>

          {/* Cashout Form */}
          <div className="bg-white dark:bg-slate-800/50 rounded-3xl border border-slate-200 dark:border-slate-700/50 p-6">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
              <Download className="w-5 h-5 text-slate-400" />
              Withdraw Funds
            </h3>
            
            <form onSubmit={handleCashout} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Amount to Withdraw</label>
                <div className="relative">
                  <input
                    type="number"
                    min="20"
                    max={balance}
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 pl-10 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none"
                    placeholder="Min. 20"
                    required
                  />
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">🪙</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Payment Method</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('paypal')}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${
                      paymentMethod === 'paypal' 
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400' 
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <CreditCard className="w-6 h-6 mb-1" />
                    <span className="text-sm font-bold">PayPal</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('bank')}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${
                      paymentMethod === 'bank' 
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400' 
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Building2 className="w-6 h-6 mb-1" />
                    <span className="text-sm font-bold">Bank Transfer</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">First Name</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none"
                    placeholder="John"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Last Name</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none"
                    placeholder="Doe"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  {paymentMethod === 'paypal' ? 'PayPal Email Address' : 'Bank RIB (24 digits)'}
                </label>
                <input
                  type={paymentMethod === 'paypal' ? 'email' : 'text'}
                  value={paymentDetails}
                  onChange={e => setPaymentDetails(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none"
                  placeholder={paymentMethod === 'paypal' ? 'you@example.com' : 'Enter your full RIB'}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || balance < 20}
                className="w-full flex items-center justify-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl py-3.5 hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Request Cashout'}
              </button>
              
              {balance < 20 && (
                <p className="text-xs text-center text-slate-500 dark:text-slate-400 mt-2">
                  You need at least 20 WinCoins to cashout.
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Right Column: Transaction History */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-slate-800/50 rounded-3xl border border-slate-200 dark:border-slate-700/50 p-6 h-full">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-slate-400" />
              Transaction History
            </h3>
            
            {transactions.length === 0 ? (
              <div className="text-center py-12 text-slate-500 dark:text-slate-400 border border-dashed border-slate-200 dark:border-slate-700 rounded-2xl">
                No transactions yet. Start earning WinCoins to see them here!
              </div>
            ) : (
              <div className="space-y-4">
                {transactions.map(tx => (
                  <div key={tx._id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        tx.type === 'gain' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400' : 'bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400'
                      }`}>
                        <ArrowRightLeft className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 dark:text-white text-sm">
                          {tx.description || (tx.type === 'gain' ? 'Earned WinCoins' : 'Withdrawal')}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {new Date(tx.createdAt).toLocaleDateString()} • {new Date(tx.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className={`font-extrabold text-lg ${
                        tx.type === 'gain' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-800 dark:text-white'
                      }`}>
                        {tx.type === 'gain' ? '+' : '-'}{tx.amount} 🪙
                      </p>
                      {/* Status Badge */}
                      <div className="mt-1">
                        {tx.status === 'pending' && <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 uppercase tracking-wide"><Clock className="w-3 h-3" /> Pending</span>}
                        {tx.status === 'in_review' && <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400 uppercase tracking-wide"><Loader2 className="w-3 h-3 animate-spin" /> Reviewing</span>}
                        {tx.status === 'completed' && <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 uppercase tracking-wide"><CheckCircle2 className="w-3 h-3" /> Completed</span>}
                        {tx.status === 'failed' && <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400 uppercase tracking-wide"><AlertCircle className="w-3 h-3" /> Failed</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
