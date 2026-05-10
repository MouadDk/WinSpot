import { MapPin, Coins, Pencil, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import Card from '../ui/Card';

const formatMoney = (value) => {
  const numberValue = Number(value || 0);
  return Number.isInteger(numberValue) ? `${numberValue}` : numberValue.toFixed(2);
};

export default function OfferCard({
  offer,
  onEdit,
  onDelete,
  onToggleActive,
  onView,
  showMerchantControls = false,
}) {
  const locationParts = [offer?.location?.city, offer?.location?.address].filter(Boolean);
  const locationLabel = locationParts.length > 0 ? locationParts.join(' • ') : 'Location not set';
  const rewardPerPublication = offer.winCoinsPerPublication ?? offer.winCoinsReward;
  const totalBudget = offer.totalWinCoinsBudget ?? rewardPerPublication;
  const remainingBudget = offer.remainingWinCoinsBudget ?? totalBudget;

  return (
    <Card hover className="h-full flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">
              {offer.establishmentName}
            </h3>
            <Badge variant={offer.isActive ? 'success' : 'neutral'} dot={offer.isActive}>
              {offer.isActive ? 'Active' : 'Paused'}
            </Badge>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {offer.category}
          </p>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-amber-400/15 text-amber-600 dark:text-amber-400 px-3 py-1.5 text-sm font-bold">
          <Coins className="w-4 h-4" />
          {rewardPerPublication} WinCoins / publication
        </div>
      </div>

      {offer.description && (
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
          {offer.description}
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
        <div className="rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-700/50 p-3">
          <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1">
            Min price
          </p>
          <p className="font-semibold text-slate-800 dark:text-white">
            {formatMoney(offer.minConsumption)}
          </p>
        </div>
        <div className="rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-700/50 p-3">
          <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1">
            Location
          </p>
          <p className="font-semibold text-slate-800 dark:text-white flex items-start gap-2">
            <MapPin className="w-4 h-4 mt-0.5 text-slate-400 shrink-0" />
            <span>{locationLabel}</span>
          </p>
        </div>
        <div className="rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-700/50 p-3">
          <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1">
            Total budget
          </p>
          <p className="font-semibold text-slate-800 dark:text-white">
            {formatMoney(totalBudget)} WinCoins
          </p>
        </div>
        <div className="rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-700/50 p-3">
          <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1">
            Remaining
          </p>
          <p className="font-semibold text-slate-800 dark:text-white">
            {formatMoney(remainingBudget)} WinCoins
          </p>
        </div>
      </div>

      <div className="mt-auto flex flex-wrap gap-2 pt-1">
        {showMerchantControls ? (
          <>
            <Button variant="secondary" size="sm" icon={Pencil} onClick={() => onEdit?.(offer)}>
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              icon={offer.isActive ? ToggleLeft : ToggleRight}
              onClick={() => onToggleActive?.(offer)}
            >
              {offer.isActive ? 'Pause' : 'Activate'}
            </Button>
            <Button variant="ghost" size="sm" icon={Trash2} onClick={() => onDelete?.(offer)}>
              Delete
            </Button>
          </>
        ) : (
          <Button variant="primary" size="sm" fullWidth onClick={() => onView?.(offer)}>
            View offer
          </Button>
        )}
      </div>
    </Card>
  );
}