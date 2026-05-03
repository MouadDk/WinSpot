export default function Card({
  children,
  className = '',
  hover = false,
  padding = true,
}) {
  return (
    <div
      className={`
        rounded-2xl border border-slate-100 dark:border-slate-700/50
        bg-white dark:bg-slate-800/50
        shadow-sm
        ${hover ? 'hover:shadow-lg hover:-translate-y-0.5 cursor-pointer' : ''}
        transition-all duration-300
        ${padding ? 'p-6' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
