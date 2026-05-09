import { useEffect, useState } from 'react';
import { Loader2, LayoutDashboard, MapPin, FileText, Wallet, Settings, Sparkles, Coins, Eye, TrendingUp, RefreshCw } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import DashboardLayout from '../components/layout/DashboardLayout';
import MetricCard from '../components/dashboard/MetricCard';
import OfferCard from '../components/dashboard/OfferCard';
import { apiUrl, authHeaders, parseApiResponse } from '../lib/api';

// ─── Navigation Items ───────────────────────────────────────
const navItems = [
  { label: 'Overview', icon: LayoutDashboard, href: '/influencer-dashboard', active: true },
  { label: 'Offers', icon: MapPin, href: '#' },
  { label: 'My Publications', icon: FileText, href: '#' },
  { label: 'Wallet', icon: Wallet, href: '#' },
  { label: 'Settings', icon: Settings, href: '#' },
];

const buildMetrics = (offers) => {
  const activeOffers = offers.filter((offer) => offer.isActive);
  const getRewardValue = (offer) => Number(offer.winCoinsPerPublication ?? offer.winCoinsReward ?? 0);
  const averageReward = activeOffers.length > 0
    ? activeOffers.reduce((sum, offer) => sum + getRewardValue(offer), 0) / activeOffers.length
    : 0;
  const bestReward = activeOffers.length > 0
    ? Math.max(...activeOffers.map((offer) => getRewardValue(offer)))
    : 0;
  const averageMinSpend = activeOffers.length > 0
    ? activeOffers.reduce((sum, offer) => sum + Number(offer.minConsumption || 0), 0) / activeOffers.length
    : 0;

  return [
    {
      title: 'Live Offers',
      value: activeOffers.length.toString(),
      icon: MapPin,
      trend: offers.length > 0 ? `${offers.length} total` : 'No offers yet',
      trendDirection: 'up',
      iconBg: 'bg-purple-100 dark:bg-purple-500/15 text-purple-600 dark:text-purple-400',
    },
    {
      title: 'Avg Reward / Publication',
      value: `${averageReward.toFixed(0)}`,
      icon: Coins,
      trend: `Best offer: ${bestReward}`,
      trendDirection: 'up',
      iconBg: 'bg-amber-100 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400',
    },
    {
      title: 'Average Min Price',
      value: `${averageMinSpend.toFixed(0)}`,
      icon: Eye,
      trend: 'Required spend',
      trendDirection: 'neutral',
      iconBg: 'bg-blue-100 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400',
    },
    {
      title: 'Freshness',
      value: `${offers.filter((offer) => offer.isActive).length}`,
      icon: TrendingUp,
      trend: 'Active listings',
      trendDirection: 'up',
      iconBg: 'bg-emerald-100 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
    },
  ];
};

// ─── Component ──────────────────────────────────────────────
export default function InfluencerDashboard() {
  const { user, token } = useAuth();
  const [offers, setOffers] = useState([]);
  const [loadingOffers, setLoadingOffers] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) {
      return;
    }

    let ignore = false;

    const loadOffers = async () => {
      setLoadingOffers(true);
      setError(null);

      try {
        const response = await fetch(apiUrl('/api/offers'), {
          headers: authHeaders(token),
        });

        const data = await parseApiResponse(response);
        if (!data.success) {
          throw new Error(data.message || 'Unable to load offers');
        }

        if (!ignore) {
          setOffers(data.offers || []);
        }
      } catch (fetchError) {
        if (!ignore) {
          setError(fetchError.message);
        }
      } finally {
        if (!ignore) {
          setLoadingOffers(false);
        }
      }
    };

    loadOffers();

    return () => {
      ignore = true;
    };
  }, [token]);

  const metrics = buildMetrics(offers);

  return (
    <DashboardLayout role="influencer" user={user} navItems={navItems}>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">
          Overview
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Discover venues, complete publications, and earn WinCoins.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {metrics.map((m) => (
          <MetricCard key={m.title} {...m} />
        ))}
      </div>

      {/* Live Offers */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            Live offers from merchants
          </h2>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 text-sm font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
        {loadingOffers ? (
          <div className="flex items-center justify-center py-12 text-slate-500 dark:text-slate-400 gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            Loading offers
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-300">
            {error}
          </div>
        ) : offers.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 px-6 py-12 text-center text-slate-500 dark:text-slate-400">
            No active offers yet. Check back after merchants publish new campaigns.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {offers.map((offer) => (
              <OfferCard
                key={offer._id}
                offer={offer}
                onView={() => {}}
              />
            ))}
          </div>
        )}
      </section>
    </DashboardLayout>
  );
}
