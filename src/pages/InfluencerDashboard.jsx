import { useAuth } from '../context/AuthContext.jsx';
import {
  MapPin,
  FileText,
  Wallet,
  Zap,
  Coins,
  Eye,
  TrendingUp,
} from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import MetricCard from '../components/dashboard/MetricCard';
import VenueCard from '../components/dashboard/VenueCard';
import PublicationTask from '../components/dashboard/PublicationTask';
import { influencerNav } from '../config/navigation.js';

// ─── Mock Data ──────────────────────────────────────────────
const metrics = [
  {
    title: 'Publications Actives',
    value: '3',
    icon: FileText,
    trend: '+2 cette semaine',
    trendDirection: 'up',
    iconBg: 'bg-[var(--glass-bg)] text-[var(--brand-highlight)] glow-border',
  },
  {
    title: 'Solde WinCoins',
    value: '1 240',
    icon: Coins,
    trend: '+320 ce mois',
    trendDirection: 'up',
    iconBg: 'bg-[var(--brand-gold)]/10 text-[var(--brand-gold)] glow-border',
  },
  {
    title: 'Impressions Totales',
    value: '18.2K',
    icon: Eye,
    trend: '+12% vs semaine dernière',
    trendDirection: 'up',
    iconBg: 'bg-[var(--glass-bg)] text-[var(--brand-highlight)] glow-border',
  },
  {
    title: 'Taux d\'Engagement',
    value: '4.8%',
    icon: TrendingUp,
    trend: '+0.6%',
    trendDirection: 'up',
    iconBg: 'bg-[var(--glass-bg)] text-[var(--brand-highlight)] glow-border',
  },
];

const nearbyVenues = [
  {
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop',
    name: 'Maison Lulu',
    cuisine: 'French Bistro',
    location: 'Casablanca, Maarif',
    winCoinsReward: 150,
    distance: '1.2 km',
    rating: 4.8,
  },
  {
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop',
    name: 'Sky Lounge Bar',
    cuisine: 'Cocktail Bar',
    location: 'Casablanca, Corniche',
    winCoinsReward: 200,
    distance: '3.5 km',
    rating: 4.6,
  },
  {
    image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400&h=300&fit=crop',
    name: 'Sakura Sushi',
    cuisine: 'Japanese',
    location: 'Rabat, Agdal',
    winCoinsReward: 120,
    distance: '5.0 km',
    rating: 4.9,
  },
];

const publicationTasks = [
  {
    platform: 'instagram',
    requirement: 'Post an Instagram Story tagging @MaisonLulu with location',
    reward: 150,
    status: 'pending',
    dueDate: 'May 5',
    venueName: 'Maison Lulu',
  },
  {
    platform: 'instagram',
    requirement: 'Share a Reel reviewing 2 cocktails at Sky Lounge',
    reward: 200,
    status: 'submitted',
    dueDate: 'May 3',
    venueName: 'Sky Lounge Bar',
  },
  {
    platform: 'instagram',
    requirement: 'Post a carousel of 3+ food photos at Sakura Sushi',
    reward: 120,
    status: 'approved',
    dueDate: 'Apr 28',
    venueName: 'Sakura Sushi',
  },
];

const visitedVenues = [
  {
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop',
    name: 'Maison Lulu',
    cuisine: 'French Bistro',
    location: 'Casablanca, Maarif',
    earnedCoins: 150,
    visitDate: 'May 3, 2026',
    rating: 4.8,
  },
  {
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop',
    name: 'Sky Lounge Bar',
    cuisine: 'Cocktail Bar',
    location: 'Casablanca, Corniche',
    earnedCoins: 200,
    visitDate: 'Apr 28, 2026',
    rating: 4.6,
  },
];

const navItems = influencerNav.map(item => ({
  ...item,
  active: item.href === '/influencer-dashboard',
}));

// ─── Component ──────────────────────────────────────────────
export default function InfluencerDashboard() {
  const { user } = useAuth();

  return (
    <DashboardLayout role="influencer" user={user} navItems={navItems}>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-extrabold text-[var(--text-main)] tracking-tight">
          Bonjour, {user?.name?.split(' ')[0] || 'Créateur'} 👋
        </h1>
        <p className="text-[var(--text-muted)] mt-1">
          Découvrez des lieux, complétez vos publications et gagnez des WinCoins.
        </p>
      </div>

      {/* Balance Card */}
      <div className="mb-8 bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-highlight)] rounded-3xl shadow-2xl p-8 border border-[var(--brand-highlight)]/20">
        <p className="text-[var(--brand-secondary)] text-sm font-semibold mb-2">Votre Solde WinCoins</p>
        <div className="flex items-baseline justify-between">
          <div>
            <h2 className="text-5xl font-extrabold text-white">1 240</h2>
            <p className="text-[var(--brand-secondary)] text-sm mt-2">Disponibles à retirer ou échanger (= 1 240 €)</p>
          </div>
          <Coins className="w-16 h-16 text-white/20" />
        </div>
        <div className="mt-6 flex gap-3">
          <button className="px-6 py-2 bg-white text-[var(--brand-primary)] font-bold rounded-xl hover:bg-slate-100 transition-colors">
            Retirer
          </button>
          <button className="px-6 py-2 border border-white text-white font-bold rounded-xl hover:bg-white/10 transition-colors">
            Historique
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {metrics.map((m) => (
          <MetricCard key={m.title} {...m} />
        ))}
      </div>

      {/* Nearby Venues */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-heading font-bold text-[var(--text-main)] flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[var(--brand-highlight)]" />
            Lieux Proches
          </h2>
          <button className="text-sm font-semibold text-[var(--brand-highlight)] hover:text-[var(--brand-primary)] transition-colors">
            Voir tout →
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {nearbyVenues.map((venue) => (
            <VenueCard
              key={venue.name}
              {...venue}
              onViewDetails={() => {}}
            />
          ))}
        </div>
      </section>

      {/* Visited Venues */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-heading font-bold text-[var(--text-main)] flex items-center gap-2">
            <Wallet className="w-5 h-5 text-[var(--brand-gold)]" />
            Restaurants Visités
          </h2>
          <button className="text-sm font-semibold text-[var(--brand-highlight)] hover:text-[var(--brand-primary)] transition-colors">
            Voir l'historique →
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {visitedVenues.map((venue) => (
            <div
              key={venue.name}
              className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              <div className="h-32 overflow-hidden">
                <img
                  src={venue.image}
                  alt={venue.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-bold text-[var(--text-main)]">{venue.name}</h3>
                    <p className="text-xs text-[var(--text-muted)]">{venue.cuisine}</p>
                  </div>
                  <span className="px-3 py-1 bg-[var(--brand-highlight)]/10 text-[var(--brand-highlight)] text-xs font-bold rounded-full">
                    ★ {venue.rating}
                  </span>
                </div>
                <p className="text-xs text-[var(--text-muted)] mb-3">{venue.location}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[var(--text-muted)]">{venue.visitDate}</span>
                  <div className="flex items-center gap-1 font-bold text-[var(--brand-gold)]">
                    <Coins className="w-4 h-4" />
                    +{venue.earnedCoins}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Publication Tasks */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-heading font-bold text-[var(--text-main)] flex items-center gap-2">
            <Zap className="w-5 h-5 text-[var(--brand-gold)]" />
            Tâches de Publication
          </h2>
          <button className="text-sm font-semibold text-[var(--brand-highlight)] hover:text-[var(--brand-primary)] transition-colors">
            Voir tout →
          </button>
        </div>
        <div className="space-y-3">
          {publicationTasks.map((task, i) => (
            <PublicationTask key={i} {...task} />
          ))}
        </div>
      </section>
    </DashboardLayout>
  );
}
