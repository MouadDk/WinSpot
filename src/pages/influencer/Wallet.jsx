import { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { Coins, ArrowRight, History, Building2, Download } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { influencerNav } from '../../config/navigation.js';

const navItems = influencerNav.map(item => ({
  ...item,
  active: item.href === '/influencer-dashboard/wallet',
}));

const transactions = [
  { id: 1, type: 'earn', amount: 150, date: 'May 8, 2026', venue: 'Maison Lulu', status: 'completed' },
  { id: 2, type: 'earn', amount: 200, date: 'May 3, 2026', venue: 'Sky Lounge Bar', status: 'completed' },
  { id: 3, type: 'withdraw', amount: 50, date: 'Apr 28, 2026', venue: 'Bank Transfer', status: 'completed' },
  { id: 4, type: 'earn', amount: 120, date: 'Apr 25, 2026', venue: 'Sakura Sushi', status: 'completed' },
];

export default function Wallet() {
  const { user } = useAuth();
  const balance = 1240; // mock balance in WinCoins
  const minWithdrawal = 20;

  const [withdrawAmount, setWithdrawAmount] = useState('');

  return (
    <DashboardLayout role="influencer" user={user} navItems={navItems}>
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-extrabold text-[var(--text-main)] tracking-tight">
          Mon Wallet
        </h1>
        <p className="text-[var(--text-muted)] mt-1">
          Gérez vos gains et retirez vos WinCoins.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* Central Coin Balance - Design Requested */}
          <div className="bg-[var(--bg-main)] rounded-2xl p-10 flex flex-col items-center justify-center relative overflow-hidden border border-[var(--border-subtle)] glow-border mb-6">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[var(--brand-highlight)] opacity-20 blur-3xl rounded-full"></div>
            
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-[var(--brand-gold)] border-4 border-white dark:border-[var(--bg-main)] flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(245,166,35,0.4)]">
                <Coins className="w-12 h-12 text-white" />
              </div>
              
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-6xl font-mono font-extrabold text-[var(--text-main)] tracking-tight">{balance}</span>
              </div>
              
              <div className="px-4 py-1.5 rounded-full bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[var(--brand-highlight)] font-semibold text-sm mb-6">
                1 WinCoin = 1 €
              </div>

              {/* Progress Milestones Bar (0 -> 50 -> 100 -> 150) */}
              <div className="w-full max-w-md">
                <div className="flex justify-between text-xs font-mono text-[var(--text-muted)] mb-2 px-1">
                  <span>0</span>
                  <span>50</span>
                  <span>100</span>
                  <span>150+</span>
                </div>
                <div className="h-3 w-full bg-[var(--bg-surface)] rounded-full overflow-hidden border border-[var(--border-subtle)]">
                  <div className="h-full bg-brand-gradient w-full" style={{ width: '100%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Withdrawal Module */}
          <div className="glass-card rounded-2xl p-6 md:p-8">
            <h2 className="text-xl font-heading font-bold text-[var(--text-main)] mb-6 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[var(--brand-highlight)]" />
              Retrait Bancaire
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-[var(--text-main)] mb-2">
                  Montant à retirer (WC)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono font-bold text-[var(--text-muted)]">
                    WC
                  </span>
                  <input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-12 pr-4 py-3 bg-[var(--bg-main)] border border-[var(--border-subtle)] rounded-xl focus:outline-none focus:border-[var(--brand-highlight)] glow-border transition-all text-[var(--text-main)] font-mono font-medium"
                  />
                  <button
                    onClick={() => setWithdrawAmount(balance.toString())}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[var(--brand-highlight)] bg-[var(--glass-bg)] px-2 py-1 rounded"
                  >
                    MAX
                  </button>
                </div>
                {withdrawAmount && Number(withdrawAmount) < minWithdrawal && (
                  <p className="text-xs text-rose-500 mt-2">
                    Le retrait minimum est de {minWithdrawal} WC ({minWithdrawal}€).
                  </p>
                )}
              </div>
              
              <div className="flex flex-col justify-end">
                <button
                  disabled={!withdrawAmount || Number(withdrawAmount) < minWithdrawal || Number(withdrawAmount) > balance}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-white bg-brand-gradient hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <Download className="w-5 h-5" />
                  Demander un Retrait
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-subtle)] p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-heading font-bold text-[var(--text-main)] flex items-center gap-2">
              <History className="w-5 h-5 text-[var(--text-muted)]" />
              Historique Récent
            </h2>
            <button className="text-sm font-semibold text-[var(--brand-highlight)] hover:text-[var(--brand-primary)]">
              Voir tout
            </button>
          </div>

          <div className="space-y-4">
            {transactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-3 hover:bg-[var(--glass-bg)] rounded-xl transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    tx.type === 'earn' ? 'bg-[var(--brand-gold)]/10 text-[var(--brand-gold)]' : 'bg-[var(--glass-bg)] text-[var(--text-muted)]'
                  }`}>
                    {tx.type === 'earn' ? <Coins className="w-4 h-4" /> : <Building2 className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[var(--text-main)]">{tx.venue}</p>
                    <p className="text-xs text-[var(--text-muted)]">{tx.date}</p>
                  </div>
                </div>
                <div className={`font-mono font-bold ${
                  tx.type === 'earn' ? 'text-[var(--brand-gold)]' : 'text-[var(--text-main)]'
                }`}>
                  {tx.type === 'earn' ? '+' : '-'}{tx.amount} WC
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
