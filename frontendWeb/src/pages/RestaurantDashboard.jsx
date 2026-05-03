import { useUser } from '@clerk/clerk-react';
import {
  LayoutDashboard,
  Megaphone,
  FileText,
  Wallet,
  Settings,
  Coins,
  Users,
  BarChart3,
  TrendingUp,
} from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import MetricCard from '../components/dashboard/MetricCard';
import CampaignRow from '../components/dashboard/CampaignRow';
import RecentPublicationCard from '../components/dashboard/RecentPublicationCard';

// ─── Mock Data ──────────────────────────────────────────────
const metrics = [
  {
    title: 'Active Campaigns',
    value: '3',
    icon: Megaphone,
    trend: '+1 this week',
    trendDirection: 'up',
    iconBg: 'bg-cyan-100 dark:bg-cyan-500/15 text-cyan-600 dark:text-cyan-400',
  },
  {
    title: 'Total Reach',
    value: '45.6K',
    icon: Users,
    trend: '+18% vs last month',
    trendDirection: 'up',
    iconBg: 'bg-blue-100 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400',
  },
  {
    title: 'Publications Generated',
    value: '27',
    icon: FileText,
    trend: '+8 this week',
    trendDirection: 'up',
    iconBg: 'bg-purple-100 dark:bg-purple-500/15 text-purple-600 dark:text-purple-400',
  },
  {
    title: 'WinCoins Distributed',
    value: '3,840',
    icon: Coins,
    trend: '+960 this month',
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

// ─── Navigation Items ───────────────────────────────────────
const navItems = [
  { label: 'Overview', icon: LayoutDashboard, href: '/restaurant-dashboard', active: true },
  { label: 'Campaigns', icon: Megaphone, href: '#' },
  { label: 'Publications', icon: FileText, href: '#' },
  { label: 'Wallet', icon: Wallet, href: '#' },
  { label: 'Settings', icon: Settings, href: '#' },
];

// ─── Component ──────────────────────────────────────────────
export default function RestaurantDashboard() {
  const { user } = useUser();

  return (
    <DashboardLayout role="restaurant" user={user} navItems={navItems}>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">
          Overview
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Manage campaigns, track publications, and grow your reach.
        </p>
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
            <Megaphone className="w-5 h-5 text-cyan-500" />
            Active Campaigns
          </h2>
          <button className="text-sm font-semibold text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 transition-colors">
            Create new →
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
            Recent Publications
          </h2>
          <button className="text-sm font-semibold text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 transition-colors">
            View all →
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
