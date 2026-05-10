import { useAuth } from '../context/AuthContext.jsx';
import {
  Megaphone,
  FileText,
  Wallet,
  Coins,
  Users,
  BarChart3,
} from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import MetricCard from '../components/dashboard/MetricCard';
import CampaignRow from '../components/dashboard/CampaignRow';
import RecentPublicationCard from '../components/dashboard/RecentPublicationCard';
import { restaurantNav } from '../config/navigation.js';

// ─── Mock Data ──────────────────────────────────────────────
const metrics = [
  {
    title: 'Campagnes Actives',
    value: '3',
    icon: Megaphone,
    trend: '+1 cette semaine',
    trendDirection: 'up',
    iconBg: 'bg-[rgba(123,47,255,0.08)] dark:bg-[rgba(123,47,255,0.12)] text-[var(--brand-highlight)] dark:text-[var(--brand-highlight)]',
  },
  {
    title: 'Portée Totale',
    value: '45.6K',
    icon: Users,
    trend: '+18% vs mois dernier',
    trendDirection: 'up',
    iconBg: 'bg-[rgba(123,47,255,0.08)] dark:bg-[rgba(123,47,255,0.12)] text-[var(--brand-primary)] dark:text-[var(--brand-primary)]',
  },
  {
    title: 'Publications Générées',
    value: '27',
    icon: FileText,
    trend: '+8 cette semaine',
    trendDirection: 'up',
    iconBg: 'bg-purple-100 dark:bg-purple-500/15 text-purple-600 dark:text-purple-400',
  },
  {
    title: 'WinCoins Distribués',
    value: '3 840',
    icon: Coins,
    trend: '+960 ce mois',
    trendDirection: 'up',
    iconBg: 'bg-amber-100 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400',
  },
];

const campaigns = [
  {
    title: 'Free Cocktail for 1 Instagram Story',
    budgetTotal: 2000,
    budgetSpent: 1200,
    publicationsGenerated: 12,
    status: 'active',
    dateRange: 'Apr 15 – May 15, 2026',
  },
  {
    title: 'Brunch Photo Post — 10% Off',
    budgetTotal: 1500,
    budgetSpent: 600,
    publicationsGenerated: 8,
    status: 'active',
    dateRange: 'Apr 20 – May 20, 2026',
  },
  {
    title: 'Happy Hour Reel Challenge',
    budgetTotal: 1000,
    budgetSpent: 1000,
    publicationsGenerated: 7,
    status: 'completed',
    dateRange: 'Mar 1 – Apr 1, 2026',
  },
];

const recentPublications = [
  {
    influencerName: '@sofia.eats',
    influencerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face',
    followerCount: '12.4K',
    platform: 'instagram',
    postPreview: 'Just had the most incredible cocktails at this gem 🍸✨ The ambiance is unreal and the bartender is a true artist. Definitely coming back!',
    winCoinsPaid: 150,
    postedAt: '2h ago',
    engagementRate: 5.2,
  },
  {
    influencerName: '@foodie_adventures',
    influencerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face',
    followerCount: '8.7K',
    platform: 'instagram',
    postPreview: 'Sunday brunch done right! 🥞 This place knows how to make every dish Instagram-worthy. The eggs benedict were perfection.',
    winCoinsPaid: 120,
    postedAt: '5h ago',
    engagementRate: 4.8,
  },
  {
    influencerName: '@casablanca.vibes',
    influencerAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face',
    followerCount: '22.1K',
    platform: 'instagram',
    postPreview: 'Found my new favorite spot in Maarif! 🔥 The rooftop view paired with amazing tapas — what more could you ask for?',
    winCoinsPaid: 200,
    postedAt: '1d ago',
    engagementRate: 6.1,
  },
];

const navItems = restaurantNav.map(item => ({
  ...item,
  active: item.href === '/restaurant-dashboard',
}));

// ─── Component ──────────────────────────────────────────────
export default function RestaurantDashboard() {
  const { user } = useAuth();

  return (
    <DashboardLayout role="restaurant" user={user} navItems={navItems}>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">
          Bonjour, {user?.name?.split(' ')[0] || 'Partenaire'} 👋
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Gérez vos campagnes, suivez vos publications et développez votre audience.
        </p>
      </div>

      {/* Balance Card */}
      <div className="mb-8 bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-highlight)] rounded-3xl shadow-2xl p-8 border border-[var(--brand-highlight)]/20">
        <p className="text-[var(--brand-secondary)] text-sm font-semibold mb-2">Votre Solde</p>
        <div className="flex items-baseline justify-between">
          <div>
            <h2 className="text-5xl font-extrabold text-white">15 480 WC</h2>
            <p className="text-[var(--brand-secondary)] text-sm mt-2">Solde WinCoins disponible (= 15 480 €)</p>
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

      {/* Active Campaigns */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-[var(--brand-highlight)]" />
            Campagnes Actives
          </h2>
          <button className="text-sm font-semibold text-[var(--brand-highlight)] dark:text-[var(--brand-secondary)] hover:text-[var(--brand-primary)] transition-colors">
            Créer une campagne →
          </button>
        </div>
        <div className="space-y-3">
          {campaigns.map((c, i) => (
            <CampaignRow key={i} {...c} onManage={() => {}} />
          ))}
        </div>
      </section>

      {/* Recent Publications */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-purple-500" />
            Publications Récentes
          </h2>
          <button className="text-sm font-semibold text-[var(--brand-highlight)] dark:text-[var(--brand-secondary)] hover:text-[var(--brand-primary)] transition-colors">
            Voir tout →
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentPublications.map((pub, i) => (
            <RecentPublicationCard key={i} {...pub} />
          ))}
        </div>
      </section>
    </DashboardLayout>
  );
}
