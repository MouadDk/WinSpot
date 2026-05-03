import { Camera, Clock, CheckCircle, XCircle, Loader } from 'lucide-react';
import Badge from '../ui/Badge';

const platformIcons = {
  instagram: Camera,
  tiktok: Clock,
  facebook: Clock,
  twitter: Clock,
};

const statusConfig = {
  pending: { variant: 'warning', label: 'Pending', Icon: Clock },
  submitted: { variant: 'info', label: 'Submitted', Icon: Loader },
  approved: { variant: 'success', label: 'Approved', Icon: CheckCircle },
  rejected: { variant: 'neutral', label: 'Rejected', Icon: XCircle },
};

export default function PublicationTask({
  platform = 'instagram',
  requirement,
  reward,
  status = 'pending',
  dueDate,
  venueName,
}) {
  const PlatformIcon = platformIcons[platform] || Instagram;
  const statusInfo = statusConfig[status] || statusConfig.pending;

  return (
    <div className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 dark:border-slate-700/50 bg-white dark:bg-slate-800/50 hover:shadow-md transition-all duration-200 group">
      {/* Platform icon */}
      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
        <PlatformIcon className="w-5 h-5 text-white" />
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">
          {requirement}
        </p>
        <div className="flex items-center gap-3 mt-1 text-xs text-slate-500 dark:text-slate-400">
          {venueName && <span>{venueName}</span>}
          {dueDate && (
            <>
              <span className="text-slate-300 dark:text-slate-600">•</span>
              <span>Due {dueDate}</span>
            </>
          )}
        </div>
      </div>

      {/* Reward + Status */}
      <div className="flex items-center gap-3 shrink-0">
        <span className="text-sm font-bold text-amber-500 dark:text-amber-400 whitespace-nowrap">
          +{reward} WC
        </span>
        <Badge variant={statusInfo.variant} dot={status === 'pending'}>
          {statusInfo.label}
        </Badge>
      </div>
    </div>
  );
}
