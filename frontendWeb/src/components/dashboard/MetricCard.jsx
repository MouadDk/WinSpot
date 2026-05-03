import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import Card from '../ui/Card';

const trendConfig = {
  up: {
    Icon: TrendingUp,
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-500/10',
  },
  down: {
    Icon: TrendingDown,
    color: 'text-rose-600 dark:text-rose-400',
    bg: 'bg-rose-50 dark:bg-rose-500/10',
  },
  neutral: {
    Icon: Minus,
    color: 'text-slate-500 dark:text-slate-400',
    bg: 'bg-slate-50 dark:bg-slate-700',
  },
};

export default function MetricCard({
  title,
  value,
  icon: Icon,
  trend,
  trendDirection = 'neutral',
  iconBg = 'bg-purple-100 dark:bg-purple-500/15 text-purple-600 dark:text-purple-400',
}) {
  const trendStyle = trendConfig[trendDirection] || trendConfig.neutral;
  const TrendIcon = trendStyle.Icon;

  return (
    <Card hover>
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          {title}
        </h3>
        {Icon && (
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg}`}
          >
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
      <p className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">
        {value}
      </p>
      {trend && (
        <div className="flex items-center gap-1.5 mt-3">
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold ${trendStyle.color} ${trendStyle.bg}`}
          >
            <TrendIcon className="w-3.5 h-3.5" />
            {trend}
          </span>
        </div>
      )}
    </Card>
  );
}
