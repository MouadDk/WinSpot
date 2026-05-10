import { FileText, Settings } from 'lucide-react';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

const statusConfig = {
  active: { variant: 'success', label: 'Active' },
  paused: { variant: 'warning', label: 'En pause' },
  completed: { variant: 'neutral', label: 'Terminée' },
};

export default function CampaignRow({
  title,
  budgetTotal,
  budgetSpent,
  publicationsGenerated,
  status = 'active',
  dateRange,
  onManage,
}) {
  const statusInfo = statusConfig[status] || statusConfig.active;
  const budgetPercent =
    budgetTotal > 0 ? Math.min((budgetSpent / budgetTotal) * 100, 100) : 0;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-5 glass-card rounded-2xl hover:scale-[1.01] hover:shadow-lg hover:shadow-[var(--brand-primary)]/5 transition-all duration-300 group">
      {/* Left: title + status */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2.5 mb-1">
          <h4 className="text-sm font-bold text-[var(--text-main)] truncate group-hover:text-[var(--brand-highlight)] transition-colors">
            {title}
          </h4>
          <Badge variant={statusInfo.variant} dot={status === 'active'}>
            {statusInfo.label}
          </Badge>
        </div>
        {dateRange && (
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {dateRange}
          </p>
        )}
      </div>

      {/* Middle: budget progress */}
      <div className="sm:w-48">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-[var(--text-muted)] font-medium">
            Budget consommé
          </span>
          <span className="font-semibold text-slate-700 dark:text-slate-200">
            {budgetSpent} / {budgetTotal} WC
          </span>
        </div>
        <div className="h-2 bg-[var(--bg-main)] rounded-full overflow-hidden border border-[var(--border-subtle)]">
          <div
            className="h-full bg-brand-gradient rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(123,47,255,0.4)]"
            style={{ width: `${budgetPercent}%` }}
          />
        </div>
      </div>

      {/* Publications count */}
      <div className="flex items-center gap-2 shrink-0">
        <div className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-300">
          <FileText className="w-4 h-4 text-slate-400" />
          <span className="font-semibold">{publicationsGenerated}</span>
          <span className="text-xs text-slate-400 dark:text-slate-500">
            posts
          </span>
        </div>
      </div>

      {/* Manage button */}
      <Button variant="ghost" size="sm" icon={Settings} onClick={onManage}>
        Gérer
      </Button>
    </div>
  );
}
