import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const trendConfig = {
  up: {
    Icon: TrendingUp,
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
  },
  down: {
    Icon: TrendingDown,
    color: 'text-rose-500',
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/20',
  },
  neutral: {
    Icon: Minus,
    color: 'text-slate-500',
    bg: 'bg-slate-500/10',
    border: 'border-slate-500/20',
  },
};

export default function MetricCard({
  title,
  value,
  icon: Icon,
  trend,
  trendDirection = 'neutral',
  iconBg = 'bg-purple-500/10 text-purple-500',
}) {
  const trendStyle = trendConfig[trendDirection] || trendConfig.neutral;
  const TrendIcon = trendStyle.Icon;

  return (
    <div className="relative group rounded-3xl overflow-hidden p-[1px] transition-all duration-500 hover:-translate-y-1">
      {/* Animated Gradient Border */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/40 via-transparent to-fuchsia-500/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
      
      {/* Inner Card content */}
      <div className="relative h-full glass-card rounded-3xl p-6 flex flex-col justify-between overflow-hidden shadow-xl shadow-purple-500/5">
        
        {/* Subtle Background Glow */}
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-purple-500/20 blur-2xl rounded-full pointer-events-none group-hover:bg-purple-500/30 transition-colors duration-500" />
        
        <div className="relative z-10 flex items-start justify-between mb-4">
          <h3 className="text-sm font-semibold text-[var(--text-muted)] tracking-wide uppercase">
            {title}
          </h3>
          {Icon && (
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner ${iconBg} transform group-hover:scale-110 transition-transform duration-500`}
            >
              <Icon className="w-6 h-6" />
            </div>
          )}
        </div>
        
        <div className="relative z-10 mt-auto">
          <p className="text-4xl font-extrabold text-[var(--text-main)] tracking-tight mb-2">
            {value}
          </p>
          {trend && (
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border ${trendStyle.bg} ${trendStyle.color} ${trendStyle.border}`}
              >
                <TrendIcon className="w-3.5 h-3.5" />
                {trend}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
