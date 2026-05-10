import { MapPin, Star, Coins } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';

export default function VenueCard({
  image,
  name,
  cuisine,
  location,
  winCoinsReward,
  distance,
  rating,
  onViewDetails,
}) {
  return (
    <div className="glass-card rounded-2xl overflow-hidden hover:scale-[1.02] hover:shadow-xl hover:shadow-[var(--brand-primary)]/10 transition-all duration-300 group">
      {/* Image */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* WinCoins badge */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-[var(--brand-highlight)] backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-[0_0_15px_rgba(123,47,255,0.4)]">
          <Coins className="w-4 h-4 text-white" />
          {winCoinsReward} WinCoins
        </div>
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-bold text-[var(--text-main)] group-hover:text-[var(--brand-highlight)] transition-colors">
            {name}
          </h3>
          {rating && (
            <div className="flex items-center gap-1 text-[var(--brand-gold)]">
              <Star className="w-4 h-4 fill-current" />
              <span className="text-sm font-bold">{rating}</span>
            </div>
          )}
        </div>

        {cuisine && (
          <span className="inline-block px-2.5 py-0.5 rounded-md bg-[rgba(123,47,255,0.08)] border border-[rgba(123,47,255,0.18)] text-xs font-bold text-[var(--brand-primary)] mb-3 uppercase tracking-wider">
            {cuisine}
          </span>
        )}

        <div className="flex items-center gap-4 text-sm text-[var(--text-muted)] mb-4">
          <div className="flex items-center gap-1 font-medium">
            <MapPin className="w-4 h-4" />
            {location}
          </div>
          {distance && (
            <span className="opacity-75">
              {distance}
            </span>
          )}
        </div>

        <Button
          variant="primary"
          size="sm"
          fullWidth
          onClick={onViewDetails}
        >
          Voir les détails
        </Button>
      </div>
    </div>
  );
}
