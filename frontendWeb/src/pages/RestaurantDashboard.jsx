import { useEffect, useState } from 'react';
import { Loader2, LayoutDashboard, Megaphone, FileText, Wallet, Settings, Coins, Users, BarChart3, Plus, RefreshCw } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import DashboardLayout from '../components/layout/DashboardLayout';
import MetricCard from '../components/dashboard/MetricCard';
import OfferCard from '../components/dashboard/OfferCard';
import QRGenerator from '../components/qr/QRGenerator';
import { apiUrl, authHeaders, parseApiResponse } from '../lib/api';

const initialForm = {
  establishmentName: '',
  category: 'Restaurant',
  description: '',
  minConsumption: '',
  winCoinsPerPublication: '',
  totalWinCoinsBudget: '',
  address: '',
  city: '',
};

// ─── Navigation Items ───────────────────────────────────────
const navItems = [
  { label: 'Overview', icon: LayoutDashboard, href: '/restaurant-dashboard', active: true },
  { label: 'Offers', icon: Megaphone, href: '#' },
  { label: 'Publications', icon: FileText, href: '#' },
  { label: 'Wallet', icon: Wallet, href: '#' },
  { label: 'Settings', icon: Settings, href: '#' },
];

// ─── Component ──────────────────────────────────────────────
export default function RestaurantDashboard() {
  const { user, token } = useAuth();
  const [offers, setOffers] = useState([]);
  const [loadingOffers, setLoadingOffers] = useState(true);
  const [savingOffer, setSavingOffer] = useState(false);
  const [error, setError] = useState(null);
  const [editingOfferId, setEditingOfferId] = useState(null);
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (!token) {
      return;
    }

    let ignore = false;

    const loadOffers = async () => {
      setLoadingOffers(true);
      setError(null);

      try {
        const response = await fetch(apiUrl('/api/offers/mine'), {
          headers: authHeaders(token),
        });

        const data = await parseApiResponse(response);
        if (!data.success) {
          throw new Error(data.message || 'Unable to load your offers');
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

  const resetForm = () => {
    setEditingOfferId(null);
    setForm(initialForm);
  };

  const refreshOffers = async () => {
    if (!token) return;
    setLoadingOffers(true);

    try {
      const response = await fetch(apiUrl('/api/offers/mine'), {
        headers: authHeaders(token),
      });

      const data = await parseApiResponse(response);
      if (!data.success) {
        throw new Error(data.message || 'Unable to load your offers');
      }

      setOffers(data.offers || []);
    } catch (refreshError) {
      setError(refreshError.message);
    } finally {
      setLoadingOffers(false);
    }
  };

  const buildPayload = () => ({
    establishmentName: form.establishmentName.trim(),
    category: form.category,
    description: form.description.trim(),
    minConsumption: Number(form.minConsumption),
    winCoinsPerPublication: Number(form.winCoinsPerPublication),
    totalWinCoinsBudget: Number(form.totalWinCoinsBudget),
    location: {
      type: 'Point',
      coordinates: [0, 0],
      address: form.address.trim(),
      city: form.city.trim(),
    },
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!token) return;

    setSavingOffer(true);
    setError(null);

    try {
      const response = await fetch(
        editingOfferId ? apiUrl(`/api/offers/${editingOfferId}`) : apiUrl('/api/offers'),
        {
          method: editingOfferId ? 'PUT' : 'POST',
          headers: authHeaders(token, {
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify(buildPayload()),
        }
      );

      const data = await parseApiResponse(response);
      if (!data.success) {
        throw new Error(data.message || 'Unable to save offer');
      }

      resetForm();
      await refreshOffers();
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setSavingOffer(false);
    }
  };

  const handleEdit = (offer) => {
    setEditingOfferId(offer._id);
    setForm({
      establishmentName: offer.establishmentName || '',
      category: offer.category || 'Restaurant',
      description: offer.description || '',
      minConsumption: offer.minConsumption?.toString() || '',
      winCoinsPerPublication: (offer.winCoinsPerPublication ?? offer.winCoinsReward)?.toString() || '',
      totalWinCoinsBudget: (offer.totalWinCoinsBudget ?? 0).toString(),
      address: offer.location?.address || '',
      city: offer.location?.city || '',
    });
  };

  const handleDelete = async (offer) => {
    if (!token || !window.confirm(`Delete offer for ${offer.establishmentName}?`)) return;

    setError(null);

    try {
      const response = await fetch(apiUrl(`/api/offers/${offer._id}`), {
        method: 'DELETE',
        headers: authHeaders(token),
      });

      const data = await parseApiResponse(response);
      if (!data.success) {
        throw new Error(data.message || 'Unable to delete offer');
      }

      await refreshOffers();
    } catch (deleteError) {
      setError(deleteError.message);
    }
  };

  const handleToggleActive = async (offer) => {
    if (!token) return;

    try {
      const response = await fetch(apiUrl(`/api/offers/${offer._id}`), {
        method: 'PUT',
        headers: authHeaders(token, {
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({ isActive: !offer.isActive }),
      });

      const data = await parseApiResponse(response);
      if (!data.success) {
        throw new Error(data.message || 'Unable to update offer');
      }

      await refreshOffers();
    } catch (toggleError) {
      setError(toggleError.message);
    }
  };

  const getRewardValue = (offer) => Number(offer.winCoinsPerPublication ?? offer.winCoinsReward ?? 0);
  const getTotalBudgetValue = (offer) => Number(offer.totalWinCoinsBudget ?? getRewardValue(offer));
  const getRemainingBudgetValue = (offer) => Number(offer.remainingWinCoinsBudget ?? getTotalBudgetValue(offer));

  const activeOffers = offers.filter((offer) => offer.isActive);
  const averageRewardPerPublication = offers.length > 0
    ? offers.reduce((sum, offer) => sum + getRewardValue(offer), 0) / offers.length
    : 0;
  const highestRewardPerPublication = offers.length > 0
    ? Math.max(...offers.map((offer) => getRewardValue(offer)))
    : 0;
  const totalBudgetPublished = offers.reduce((sum, offer) => sum + getTotalBudgetValue(offer), 0);
  const totalBudgetRemaining = offers.reduce((sum, offer) => sum + getRemainingBudgetValue(offer), 0);
  const averageMinPrice = offers.length > 0
    ? offers.reduce((sum, offer) => sum + Number(offer.minConsumption || 0), 0) / offers.length
    : 0;

  const metrics = [
    {
      title: 'Active Offers',
      value: activeOffers.length.toString(),
      icon: Megaphone,
      trend: `${offers.length} total`,
      trendDirection: 'up',
      iconBg: 'bg-cyan-100 dark:bg-cyan-500/15 text-cyan-600 dark:text-cyan-400',
    },
    {
      title: 'Offer Budget Remaining',
      value: `${totalBudgetRemaining}`,
      icon: Users,
      trend: `Published: ${totalBudgetPublished}`,
      trendDirection: 'neutral',
      iconBg: 'bg-blue-100 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400',
    },
    {
      title: 'Avg Reward / Publication',
      value: `${averageRewardPerPublication.toFixed(0)}`,
      icon: Coins,
      trend: `Highest: ${highestRewardPerPublication}`,
      trendDirection: 'up',
      iconBg: 'bg-amber-100 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400',
    },
    {
      title: 'Average Min Price',
      value: `${averageMinPrice.toFixed(0)}`,
      icon: BarChart3,
      trend: 'Per offer',
      trendDirection: 'neutral',
      iconBg: 'bg-purple-100 dark:bg-purple-500/15 text-purple-600 dark:text-purple-400',
    },
  ];

  return (
    <DashboardLayout role="restaurant" user={user} navItems={navItems}>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">
          Overview
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Create live offers, update rewards, and keep your offer board current.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {metrics.map((m) => (
          <MetricCard key={m.title} {...m} />
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <section className="bg-white dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-700/50 shadow-sm p-6">
          <div className="flex items-center justify-between gap-3 mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-cyan-500" />
                {editingOfferId ? 'Edit offer' : 'Create offer'}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Set total budget and WinCoins reward per publication.
              </p>
            </div>
            {editingOfferId && (
              <button
                type="button"
                onClick={resetForm}
                className="text-sm font-semibold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              >
                Cancel edit
              </button>
            )}
          </div>

          {error && (
            <div className="mb-4 rounded-xl border border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="block">
                <span className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Establishment name</span>
                <input
                  value={form.establishmentName}
                  onChange={(event) => setForm((current) => ({ ...current, establishmentName: event.target.value }))}
                  required
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 px-4 py-3 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </label>

              <label className="block">
                <span className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</span>
                <select
                  value={form.category}
                  onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 px-4 py-3 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="Restaurant">Restaurant</option>
                  <option value="Bar">Bar</option>
                  <option value="Café">Café</option>
                  <option value="Hotel">Hotel</option>
                  <option value="Other">Other</option>
                </select>
              </label>
            </div>

            <label className="block">
              <span className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</span>
              <textarea
                value={form.description}
                onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                rows={4}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 px-4 py-3 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
              />
            </label>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="block">
                <span className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Min price</span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={form.minConsumption}
                  onChange={(event) => setForm((current) => ({ ...current, minConsumption: event.target.value }))}
                  required
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 px-4 py-3 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </label>

              <label className="block">
                <span className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">WinCoins per publication</span>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={form.winCoinsPerPublication}
                  onChange={(event) => setForm((current) => ({ ...current, winCoinsPerPublication: event.target.value }))}
                  required
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 px-4 py-3 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </label>
            </div>

            <label className="block">
              <span className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Total WinCoins budget for this offer</span>
              <input
                type="number"
                min="1"
                step="1"
                value={form.totalWinCoinsBudget}
                onChange={(event) => setForm((current) => ({ ...current, totalWinCoinsBudget: event.target.value }))}
                required
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 px-4 py-3 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </label>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="block">
                <span className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">City</span>
                <input
                  value={form.city}
                  onChange={(event) => setForm((current) => ({ ...current, city: event.target.value }))}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 px-4 py-3 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </label>

              <label className="block">
                <span className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Address</span>
                <input
                  value={form.address}
                  onChange={(event) => setForm((current) => ({ ...current, address: event.target.value }))}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 px-4 py-3 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </label>
            </div>

            <button
              type="submit"
              disabled={savingOffer}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-3 font-bold text-white shadow-lg shadow-cyan-500/20 transition-all hover:from-cyan-600 hover:to-blue-600 disabled:opacity-70"
            >
              {savingOffer ? <Loader2 className="w-5 h-5 animate-spin" /> : editingOfferId ? 'Update offer' : 'Publish offer'}
            </button>
          </form>
        </section>

        <section className="bg-white dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-700/50 shadow-sm p-6">
          <div className="flex items-center justify-between gap-3 mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-cyan-500" />
                Your offers
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Published offers are visible to influencers immediately.
              </p>
            </div>
            <button
              type="button"
              onClick={refreshOffers}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
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
          ) : offers.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 px-6 py-12 text-center text-slate-500 dark:text-slate-400">
              No offers published yet. Create the first one to start collecting influencer posts.
            </div>
          ) : (
            <div className="space-y-4">
              {offers.map((offer) => (
                <OfferCard
                  key={offer._id}
                  offer={offer}
                  showMerchantControls
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onToggleActive={handleToggleActive}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      {/* QR Verification Panel */}
      <section className="mt-8 bg-white dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-700/50 shadow-sm p-6">
        <QRGenerator offers={offers} token={token} />
      </section>
    </DashboardLayout>
  );
}
