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
    <div className="glass-card rounded-2xl p-5 hover:-translate-y-1 hover:shadow-lg hover:shadow-[var(--brand-primary)]/5 transition-all duration-300">
      {/* Header: influencer info */}
      <div className="flex items-center gap-3 mb-4">
        <img
          src={influencerAvatar}
          alt={influencerName}
          className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-700"
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-[var(--text-main)] truncate">
            {influencerName}
          </p>
          <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] mt-0.5">
            <Users className="w-3.5 h-3.5" />
            <span>{followerCount} abonnés</span>
            {platform && (
              <>
                <span className="opacity-50">•</span>
                <span className="capitalize text-[var(--brand-primary)] font-medium">{platform}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Post preview */}
      <p className="text-sm text-[var(--text-muted)] line-clamp-2 mb-4 leading-relaxed italic">
        "{postPreview}"
      </p>

      {/* Footer: metrics */}
      <div className="flex items-center justify-between pt-3 border-t border-[var(--border-subtle)]">
        <div className="flex items-center gap-1.5 text-[var(--brand-gold)]">
          <Coins className="w-4 h-4" />
          <span className="text-sm font-bold">{winCoinsPaid} WC</span>
        </div>
        {engagementRate && (
          <span className="text-xs font-semibold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
            {engagementRate}% engagement
          </span>
        )}
        {postedAt && (
          <div className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
            <Clock className="w-3.5 h-3.5" />
            {postedAt}
          </div>
        )}
      </div>
    </div>
  );
}
