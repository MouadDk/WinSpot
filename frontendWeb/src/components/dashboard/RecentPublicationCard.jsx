import { Users, Coins, Clock } from 'lucide-react';
import Card from '../ui/Card';

export default function RecentPublicationCard({
  influencerName,
  influencerAvatar,
  followerCount,
  platform,
  postPreview,
  winCoinsPaid,
  postedAt,
  engagementRate,
}) {
  return (
    <Card hover>
      {/* Header: influencer info */}
      <div className="flex items-center gap-3 mb-4">
        <img
          src={influencerAvatar}
          alt={influencerName}
          className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-700"
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-slate-800 dark:text-white truncate">
            {influencerName}
          </p>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Users className="w-3.5 h-3.5" />
            <span>{followerCount} followers</span>
            {platform && (
              <>
                <span className="text-slate-300 dark:text-slate-600">•</span>
                <span className="capitalize">{platform}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Post preview */}
      <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 mb-4 leading-relaxed">
        {postPreview}
      </p>

      {/* Footer: metrics */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700/50">
        <div className="flex items-center gap-1.5 text-amber-500 dark:text-amber-400">
          <Coins className="w-4 h-4" />
          <span className="text-sm font-bold">{winCoinsPaid} WC</span>
        </div>
        {engagementRate && (
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-md">
            {engagementRate}% engagement
          </span>
        )}
        {postedAt && (
          <div className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
            <Clock className="w-3.5 h-3.5" />
            {postedAt}
          </div>
        )}
      </div>
    </Card>
  );
}
