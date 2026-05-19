/**
 * SkeletonLoader — reusable skeleton screen components that replace
 * jarring loading spinners with smooth placeholder shimmer animations.
 *
 * Usage:
 *   <SkeletonCard />       — A full card placeholder
 *   <SkeletonMetric />     — Metric card placeholder
 *   <SkeletonRow />        — A single list-row placeholder
 *   <SkeletonDashboard />  — Full dashboard overview skeleton
 */

export function SkeletonBlock({ className = '' }) {
  return <div className={`skeleton ${className}`} />;
}

export function SkeletonMetric() {
  return (
    <div className="rounded-2xl border border-slate-100 dark:border-slate-700/50 bg-white dark:bg-slate-800/50 p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="skeleton h-4 w-24 rounded-lg" />
        <div className="skeleton w-10 h-10 rounded-xl" />
      </div>
      <div className="skeleton h-8 w-32 rounded-lg mb-3" />
      <div className="skeleton h-5 w-20 rounded-md" />
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-700/50">
      <div className="flex-1 space-y-2">
        <div className="skeleton h-4 w-40 rounded-lg" />
        <div className="skeleton h-3 w-56 rounded-md" />
      </div>
      <div className="space-y-2 text-right">
        <div className="skeleton h-4 w-16 rounded-lg ml-auto" />
        <div className="skeleton h-3 w-12 rounded-md ml-auto" />
      </div>
    </div>
  );
}

export function SkeletonHeroCard() {
  return (
    <div className="rounded-3xl bg-slate-200 dark:bg-slate-800/50 p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-3 flex-1">
          <div className="skeleton h-4 w-24 rounded-lg" />
          <div className="skeleton h-12 w-48 rounded-xl" />
          <div className="skeleton h-4 w-32 rounded-lg" />
        </div>
        <div className="skeleton h-12 w-36 rounded-2xl" />
      </div>
    </div>
  );
}

export function SkeletonDashboard() {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="space-y-2">
        <div className="skeleton h-8 w-48 rounded-xl" />
        <div className="skeleton h-4 w-72 rounded-lg" />
      </div>

      {/* Hero card */}
      <SkeletonHeroCard />

      {/* Metrics grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SkeletonMetric />
        <SkeletonMetric />
        <SkeletonMetric />
      </div>

      {/* Quick actions */}
      <div className="space-y-4">
        <div className="skeleton h-5 w-32 rounded-lg" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-4 rounded-2xl p-5 border border-slate-100 dark:border-slate-700/50 bg-white dark:bg-slate-800/50">
              <div className="skeleton w-12 h-12 rounded-xl shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="skeleton h-4 w-28 rounded-lg" />
                <div className="skeleton h-3 w-44 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="rounded-3xl border border-slate-100 dark:border-slate-700/50 bg-white dark:bg-slate-800/50 p-6 space-y-3">
        <div className="skeleton h-5 w-36 rounded-lg mb-4" />
        <SkeletonRow />
        <SkeletonRow />
        <SkeletonRow />
      </div>
    </div>
  );
}

export default SkeletonDashboard;
