import {
  LayoutDashboard,
  Megaphone,
  Users,
  Crown,
  Settings,
  MapPin,
  FileText,
  Wallet,
} from 'lucide-react';

export const restaurantNav = [
  { label: 'Vue d\'ensemble', icon: LayoutDashboard, href: '/restaurant-dashboard' },
  { label: 'Campagnes', icon: Megaphone, href: '/restaurant-dashboard/campaigns' },
  { label: 'Influenceurs', icon: Users, href: '/restaurant-dashboard/influencers' },
  { label: 'Abonnements', icon: Crown, href: '/restaurant-dashboard/subscriptions' },
  { label: 'Paramètres', icon: Settings, href: '/restaurant-dashboard/settings' },
];

export const influencerNav = [
  { label: 'Vue d\'ensemble', icon: LayoutDashboard, href: '/influencer-dashboard' },
  { label: 'Lieux', icon: MapPin, href: '/influencer-dashboard/venues' },
  { label: 'Mes Publications', icon: FileText, href: '/influencer-dashboard/publications' },
  { label: 'Wallet', icon: Wallet, href: '/influencer-dashboard/wallet' },
  { label: 'Paramètres', icon: Settings, href: '/influencer-dashboard/settings' },
];
