import { useUser } from '@clerk/clerk-react';
import {
  LayoutDashboard,
  MapPin,
  FileText,
  Wallet,
  Settings,
  Zap,
  Coins,
  Eye,
  TrendingUp,
} from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import MetricCard from '../components/dashboard/MetricCard';
import VenueCard from '../components/dashboard/VenueCard';
import PublicationTask from '../components/dashboard/PublicationTask';

// ─── Mock Data ──────────────────────────────────────────────
const metrics = [
  {
    title: 'Active Publications',
    value: '3',
    icon: FileText,
    trend: '+2 this week',
    trendDirection: 'up',
    iconBg: 'bg-purple-100 dark:bg-purple-500/15 text-purple-600 dark:text-purple-400',
  },
  {
    title: 'WinCoins Balance',
    value: '1,240',
    icon: Coins,
    trend: '+320 this month',
    trendDirection: 'up',
    iconBg: 'bg-amber-100 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400',
  },
  {
    title: 'Total Impressions',
    value: '18.2K',
    icon: Eye,
    trend: '+12% vs last week',
    trendDirection: 'up',
    iconBg: 'bg-blue-100 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400',
  },
  {
    title: 'Engagement Rate',
    value: '4.8%',
    icon: TrendingUp,
    trend: '+0.6%',
    trendDirection: 'up',
    iconBg: 'bg-emerald-100 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
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

// ─── Navigation Items ───────────────────────────────────────
const navItems = [
  { label: 'Overview', icon: LayoutDashboard, href: '/influencer-dashboard', active: true },
  { label: 'Venues', icon: MapPin, href: '#' },
  { label: 'My Publications', icon: FileText, href: '#' },
  { label: 'Wallet', icon: Wallet, href: '#' },
  { label: 'Settings', icon: Settings, href: '#' },
];

// ─── Component ──────────────────────────────────────────────
export default function InfluencerDashboard() {
  const { user } = useUser();

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

      {/* Nearby Venues */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <MapPin className="w-5 h-5 text-purple-500" />
            Nearby Venues
          </h2>
          <button className="text-sm font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors">
            View all →
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

      {/* Publication Tasks */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500" />
            Publication Tasks
          </h2>
          <button className="text-sm font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors">
            See all →
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
