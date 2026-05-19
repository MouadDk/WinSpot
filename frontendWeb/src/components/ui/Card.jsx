/**
 * Card — base container component with support for two aesthetic modes:
 *   - "glass"  (default): Glassmorphism look for restaurant/analytical dashboards
 *   - "clay":  Claymorphism look for customer dashboard — playful, soft 3D feel
 *
 * Both modes respect dark mode and use existing brand tokens.
 */
export default function Card({
  children,
  className = '',
  hover = false,
  padding = true,
  variant = 'glass', // 'glass' | 'clay'
}) {
  const baseClasses = 'rounded-2xl transition-all duration-300';

  const variantClasses = {
    glass: `
      border border-slate-100 dark:border-slate-700/50
      bg-white/90 dark:bg-slate-800/50
      backdrop-blur-md
      shadow-sm
      ${hover ? 'hover:shadow-xl hover:shadow-slate-200/40 dark:hover:shadow-black/20 hover:-translate-y-1 cursor-pointer' : ''}
    `,
    clay: `
      border-[3px] border-slate-200/80 dark:border-slate-600/50
      bg-white dark:bg-slate-800/70
      shadow-[6px_6px_12px_rgba(0,0,0,0.06),-3px_-3px_8px_rgba(255,255,255,0.8)]
      dark:shadow-[6px_6px_12px_rgba(0,0,0,0.3),-3px_-3px_8px_rgba(255,255,255,0.04)]
      ${hover ? 'hover:shadow-[8px_8px_16px_rgba(0,0,0,0.08),-4px_-4px_10px_rgba(255,255,255,0.9)] dark:hover:shadow-[8px_8px_16px_rgba(0,0,0,0.4),-4px_-4px_10px_rgba(255,255,255,0.06)] hover:-translate-y-1 cursor-pointer' : ''}
    `,
  };

  return (
    <div
      className={`
        ${baseClasses}
        ${variantClasses[variant] || variantClasses.glass}
        ${padding ? 'p-6' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
