import { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { Search, Filter, Star, Navigation } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { influencerNav } from '../../config/navigation.js';

const navItems = influencerNav.map(item => ({
  ...item,
  active: item.href === '/influencer-dashboard/venues',
}));

const mockVenues = [
  {
    id: 1,
    name: 'Maison Lulu',
    category: 'Restaurant',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop',
    rating: 4.8,
    reviews: 124,
    minOrder: '50€',
    winCoins: 150,
    distance: '1.2 km',
    location: 'Maarif, Casablanca',
    tags: ['French', 'Bistro', 'Cozy'],
  },
  {
    id: 2,
    name: 'Sky Lounge Bar',
    category: 'Bar',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop',
    rating: 4.6,
    reviews: 89,
    minOrder: '30€',
    winCoins: 200,
    distance: '3.5 km',
    location: 'Corniche, Casablanca',
    tags: ['Cocktails', 'Rooftop', 'Music'],
  },
  {
    id: 3,
    name: 'Sakura Sushi',
    category: 'Restaurant',
    image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&h=600&fit=crop',
    rating: 4.9,
    reviews: 210,
    minOrder: '40€',
    winCoins: 120,
    distance: '5.0 km',
    location: 'Agdal, Rabat',
    tags: ['Japanese', 'Sushi', 'Premium'],
  },
];

export default function VenueCatalog() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Restaurant', 'Bar', 'Café', 'Club'];

  const filteredVenues = mockVenues.filter(
    (venue) =>
      (activeCategory === 'All' || venue.category === activeCategory) &&
      venue.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout role="influencer" user={user} navItems={navItems}>
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-extrabold text-[var(--text-main)] tracking-tight">
          Explorer les Lieux
        </h1>
        <p className="text-[var(--text-muted)] mt-1">
          Découvrez les meilleurs endroits pour collaborer et gagner des WinCoins.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Rechercher par nom ou lieu..."
            className="w-full pl-10 pr-4 py-3 bg-[var(--bg-main)] border border-[var(--border-subtle)] rounded-xl focus:outline-none focus:border-[var(--brand-highlight)] glow-border transition-all text-[var(--text-main)]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl font-medium text-sm whitespace-nowrap transition-colors ${
                activeCategory === cat
                  ? 'bg-[var(--brand-highlight)] text-white glow-border'
                  : 'bg-[var(--bg-main)] text-[var(--text-muted)] border border-[var(--border-subtle)] hover:bg-[var(--glass-bg)]'
              }`}
            >
              {cat}
            </button>
          ))}
          <button className="px-4 py-2 bg-[var(--bg-main)] border border-[var(--border-subtle)] rounded-xl text-[var(--text-main)] hover:bg-[var(--glass-bg)] transition-colors flex items-center gap-2">
            <Filter className="w-4 h-4" />
            <span className="text-sm font-medium">Filters</span>
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVenues.map((venue) => (
          <div
            key={venue.id}
            className="group bg-[var(--bg-card)] rounded-2xl overflow-hidden border border-[var(--border-subtle)] hover:glow-border transition-all cursor-pointer flex flex-col relative"
          >
            <div className="absolute top-0 left-0 w-1 h-full bg-brand-gradient opacity-0 group-hover:opacity-100 transition-opacity z-10" />
            <div className="relative aspect-[4/3] overflow-hidden">
              <img
                src={venue.image}
                alt={venue.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 bg-[var(--bg-main)]/90 backdrop-blur px-2.5 py-1 rounded-lg text-xs font-bold text-[var(--text-main)]">
                {venue.category}
              </div>
              <div className="absolute top-3 right-3 bg-[var(--brand-gold)] text-[var(--bg-main)] px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 shadow-md">
                <Star className="w-3.5 h-3.5 fill-current" />
                {venue.rating}
              </div>
            </div>
            
            <div className="p-5 flex-1 flex flex-col">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-lg font-heading font-bold text-[var(--text-main)]">
                    {venue.name}
                  </h3>
                  <div className="flex items-center gap-1 text-[var(--text-muted)] text-sm mt-0.5">
                    <Navigation className="w-3.5 h-3.5" />
                    {venue.location} ({venue.distance})
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-1.5 mb-4">
                {venue.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded text-xs font-medium bg-[var(--bg-main)] text-[var(--text-muted)] border border-[var(--border-subtle)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-auto pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between">
                <div>
                  <p className="text-xs text-[var(--text-muted)]">Min. Order</p>
                  <p className="font-semibold text-[var(--text-main)]">{venue.minOrder}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-[var(--text-muted)]">Reward</p>
                  <div className="px-2 py-1 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-md">
                    <p className="font-mono font-bold text-[var(--brand-gold)] flex items-center gap-1 justify-end">
                      {venue.winCoins} WC
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
