import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin, Search, Coins, Store, SlidersHorizontal,
  Loader2, RefreshCw, QrCode, ChevronDown, Sparkles,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { apiUrl, authHeaders, parseApiResponse } from '../../lib/api';

const CATEGORIES = ['All', 'Restaurant', 'Bar', 'Café', 'Hotel', 'Other'];

const safeNum = (val) => {
  const n = Number(val);
  return Number.isFinite(n) ? n : 0;
};

function OfferDiscoverCard({ offer, index }) {
  const price = safeNum(offer.price);
  const pct = safeNum(offer.cashbackPercent);
  const cashbackMAD  = (price * pct / 100).toFixed(0);
  const cashbackCoins = (price * pct / 100 / 10).toFixed(1);
  const locationLabel = [offer.location?.city, offer.location?.address].filter(Boolean).join(' · ') || 'Location not set';
  const totalBudget = safeNum(offer.totalWinCoinsBudget);
  const remainingBudget = safeNum(offer.remainingWinCoinsBudget);
  const budgetPct = totalBudget > 0 ? Math.round((remainingBudget / totalBudget) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
    >
      <div className="group bg-white dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-700/50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-5 flex flex-col gap-4 overflow-hidden relative">
        {/* Subtle hover glow */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute -top-12 -right-12 w-40 h-40 bg-purple-500/[0.06] rounded-full blur-2xl" />
        </div>

        {/* Header */}
        <div className="flex items-start justify-between gap-3 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shrink-0 shadow-md group-hover:scale-110 transition-transform duration-300">
              <Store className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 dark:text-white text-sm leading-tight group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">{offer.itemName || 'Unnamed Offer'}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">{offer.establishmentName || 'Restaurant'} · {offer.category || 'Other'}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 px-3 py-1.5 text-sm font-bold shrink-0 border border-purple-200/50 dark:border-purple-500/20">
            <Coins className="w-3.5 h-3.5" />
            {pct}%
          </div>
        </div>

        {/* Description */}
        {offer.description && (
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">{offer.description}</p>
        )}

        {/* Details grid */}
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="rounded-xl bg-slate-50 dark:bg-slate-900/60 p-3 border border-slate-100 dark:border-slate-700/50">
            <p className="text-slate-400 mb-0.5">Price</p>
            <p className="font-bold text-slate-800 dark:text-white">{price} MAD</p>
          </div>
          <div className="rounded-xl bg-purple-50 dark:bg-purple-500/10 p-3 border border-purple-100 dark:border-purple-500/20">
            <p className="text-purple-600 dark:text-purple-400 mb-0.5">Cashback</p>
            <p className="font-bold text-purple-700 dark:text-purple-300">{cashbackMAD} MAD</p>
          </div>
          <div className="rounded-xl bg-amber-50 dark:bg-amber-500/10 p-3 border border-amber-100 dark:border-amber-500/20">
            <p className="text-amber-600 dark:text-amber-400 mb-0.5">WinCoins</p>
            <p className="font-bold text-amber-700 dark:text-amber-300">{cashbackCoins} WC</p>
          </div>
        </div>

        {/* Budget bar */}
        <div>
          <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1.5">
            <span>Budget remaining</span>
            <span className="font-semibold">{budgetPct}%</span>
          </div>
          <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${budgetPct > 30 ? 'bg-gradient-to-r from-violet-400 to-purple-500' : budgetPct > 10 ? 'bg-gradient-to-r from-amber-400 to-amber-500' : 'bg-gradient-to-r from-red-400 to-red-500'}`}
              initial={{ width: 0 }}
              animate={{ width: `${budgetPct}%` }}
              transition={{ duration: 0.8, delay: index * 0.06 + 0.3, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{locationLabel}</span>
        </div>

        {/* CTA */}
        <div className="mt-auto flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-500 to-fuchsia-500 px-4 py-3.5 text-sm font-bold text-white justify-center shadow-lg shadow-violet-500/20 group-hover:shadow-xl group-hover:shadow-violet-500/30 transition-shadow">
          <QrCode className="w-4 h-4" />
          Scan QR to earn {cashbackCoins} WC
        </div>
      </div>
    </motion.div>
  );
}

/**
 * CustomerOffersPage — discover all active offers from merchants.
 */
export default function CustomerOffersPage() {
  const { token } = useAuth();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [city, setCity] = useState('');

  const loadOffers = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(apiUrl('/api/offers'), { headers: authHeaders(token) });
      const data = await parseApiResponse(res);
      setOffers(data.offers ?? []);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }, [token]);

  useEffect(() => { loadOffers(); }, [loadOffers]);

  const filtered = offers.filter((o) => {
    const q = search.toLowerCase();
    const matchSearch = !q
      || o.itemName?.toLowerCase().includes(q)
      || o.establishmentName?.toLowerCase().includes(q)
      || o.description?.toLowerCase().includes(q);
    const matchCategory = category === 'All' || o.category === category;
    const matchCity = !city || o.location?.city?.toLowerCase().includes(city.toLowerCase());
    return matchSearch && matchCategory && matchCity;
  });

  const cities = ['', ...new Set(offers.map((o) => o.location?.city).filter(Boolean))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        className="flex items-start justify-between gap-4 flex-wrap"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight flex items-center gap-3">
            Discover Offers
            <Sparkles className="w-6 h-6 text-amber-400" />
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            {filtered.length} active offer{filtered.length !== 1 ? 's' : ''} available near you
          </p>
        </div>
        <button onClick={loadOffers} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:shadow-md transition-all duration-200">
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </motion.div>

      {/* Filters */}
      <motion.div
        className="flex flex-wrap gap-3"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.1 }}
      >
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search offers, restaurants…"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all"
          />
        </div>

        <div className="relative">
          <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="appearance-none pl-9 pr-8 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-violet-500 transition-all cursor-pointer"
          >
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        </div>

        {cities.length > 1 && (
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="appearance-none pl-9 pr-8 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-violet-500 transition-all cursor-pointer"
            >
              {cities.map((c) => <option key={c} value={c}>{c || 'All Cities'}</option>)}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          </div>
        )}
      </motion.div>

      {error && (
        <div className="rounded-xl border border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-300">{error}</div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16 gap-2 text-slate-500 dark:text-slate-400">
          <Loader2 className="w-5 h-5 animate-spin" /> Loading offers…
        </div>
      ) : filtered.length === 0 ? (
        <motion.div
          className="rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700 px-6 py-16 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-purple-100 dark:bg-purple-500/15 flex items-center justify-center">
            <Store className="w-8 h-8 text-purple-500 dark:text-purple-400" />
          </div>
          <p className="text-slate-600 dark:text-slate-300 font-semibold mb-1">
            {offers.length === 0 ? 'No offers available yet' : 'No offers match your filters'}
          </p>
          <p className="text-sm text-slate-400 dark:text-slate-500">
            {offers.length === 0 ? 'Check back soon — restaurants are joining daily!' : 'Try adjusting your search or filters.'}
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((offer, i) => <OfferDiscoverCard key={offer._id} offer={offer} index={i} />)}
        </div>
      )}
    </div>
  );
}
