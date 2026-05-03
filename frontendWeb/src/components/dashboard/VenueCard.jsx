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
    <Card padding={false} hover className="overflow-hidden group">
      {/* Image */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* WinCoins badge */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-amber-400/90 backdrop-blur-sm text-slate-900 px-3 py-1.5 rounded-full text-sm font-bold shadow-lg">
          <Coins className="w-4 h-4" />
          {winCoinsReward} WinCoins
        </div>
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">
            {name}
          </h3>
          {rating && (
            <div className="flex items-center gap-1 text-amber-500">
              <Star className="w-4 h-4 fill-current" />
              <span className="text-sm font-semibold">{rating}</span>
            </div>
          )}
        </div>

        {cuisine && (
          <span className="inline-block px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-xs font-medium text-slate-600 dark:text-slate-300 mb-3">
            {cuisine}
          </span>
        )}

        <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mb-4">
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            {location}
          </div>
          {distance && (
            <span className="text-slate-400 dark:text-slate-500">
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
          View Details
        </Button>
      </div>
    </Card>
  );
}
