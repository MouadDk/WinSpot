import { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { Search, Filter, Star, MessageSquare } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { restaurantNav } from '../../config/navigation.js';

const navItems = restaurantNav.map(item => ({
  ...item,
  active: item.href === '/restaurant-dashboard/influencers',
}));

const mockInfluencers = [
  {
    id: 1,
    name: 'Sofia Martinez',
    handle: '@sofia.eats',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
    followers: '45.2K',
    rating: 4.9,
    reviews: 128,
    tags: ['Foodie', 'Lifestyle'],
    verified: true,
  },
  {
    id: 2,
    name: 'Alex Johnson',
    handle: '@foodie_adventures',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    followers: '12.8K',
    rating: 4.7,
    reviews: 84,
    tags: ['Travel', 'Food'],
    verified: false,
  },
  {
    id: 3,
    name: 'Youssef B',
    handle: '@casablanca.vibes',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    followers: '89.1K',
    rating: 4.9,
    reviews: 312,
    tags: ['Local', 'Events', 'Food'],
    verified: true,
  },
  {
    id: 4,
    name: 'Emma Wilson',
    handle: '@emma_tastes',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
    followers: '5.4K',
    rating: 4.5,
    reviews: 21,
    tags: ['Vegan', 'Healthy'],
    verified: false,
  },
];

export default function InfluencersList() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredInfluencers = mockInfluencers.filter(
    (inf) =>
      inf.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inf.handle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout role="restaurant" user={user} navItems={navItems}>
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">
            Découvrir les Influenceurs
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Trouvez les créateurs idéaux pour votre prochaine campagne.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher des créateurs..."
              className="pl-10 pr-4 py-2 w-full md:w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] transition-shadow dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="p-2.5 bg-[rgba(123,47,255,0.08)] dark:bg-[rgba(123,47,255,0.12)] border border-[rgba(123,47,255,0.18)] rounded-xl text-[var(--brand-highlight)] hover:bg-[rgba(123,47,255,0.16)] dark:hover:bg-[rgba(123,47,255,0.18)] transition-colors" aria-label="Filtrer">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredInfluencers.map((inf) => (
          <div
            key={inf.id}
            className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow group cursor-pointer flex flex-col"
          >
            <div className="flex items-start justify-between mb-4">
              <img
                src={inf.avatar}
                alt={inf.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-white dark:border-slate-800 shadow-sm"
              />
              <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2 py-1 rounded-lg text-sm font-semibold">
                <Star className="w-4 h-4 fill-current" />
                <span>{inf.rating}</span>
                <span className="text-amber-600/60 dark:text-amber-400/60 text-xs ml-1">
                  ({inf.reviews})
                </span>
              </div>
            </div>
            
            <div className="mb-3">
              <h3 className="font-bold text-lg text-slate-800 dark:text-white flex items-center gap-1">
                {inf.name}
                {inf.verified && (
                  <svg className="w-4 h-4 text-[var(--brand-highlight)]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                  </svg>
                )}
              </h3>
              <p className="text-[var(--brand-highlight)] dark:text-[var(--brand-secondary)] text-sm font-medium">
                {inf.handle}
              </p>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {inf.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-xs text-slate-500 dark:text-slate-400">Followers</span>
                <span className="font-bold text-slate-800 dark:text-white">{inf.followers}</span>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-[var(--brand-highlight)] hover:bg-[var(--brand-primary)] text-white rounded-xl font-medium text-sm transition-colors shadow-[0_10px_30px_rgba(123,47,255,0.18)]">
                <MessageSquare className="w-4 h-4" />
                Inviter
              </button>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
