const variantStyles = {
  success:
    'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400',
  warning:
    'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400',
  info: 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400',
  pending:
    'bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-400',
  neutral:
    'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
};

const dotColors = {
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  info: 'bg-blue-500',
  pending: 'bg-purple-500',
  neutral: 'bg-slate-400',
};

export default function Badge({
  variant = 'neutral',
  children,
  dot = false,
  className = '',
}) {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full
        text-xs font-semibold tracking-wide
        ${variantStyles[variant]}
        ${className}
      `}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full animate-pulse ${dotColors[variant]}`}
        />
      )}
      {children}
    </span>
  );
}
