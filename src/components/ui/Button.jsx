import { forwardRef } from 'react';

const variantStyles = {
  primary:
    'bg-gradient-to-r from-purple-700 to-purple-500 hover:from-purple-800 hover:to-purple-600 text-white shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30',
  secondary:
    'bg-gradient-to-r from-[var(--brand-secondary)] to-[var(--brand-highlight)] hover:from-[var(--brand-primary)] hover:to-[var(--brand-highlight)] text-white shadow-lg shadow-[rgba(123,47,255,0.25)] hover:shadow-xl hover:shadow-[rgba(123,47,255,0.35)]',
  ghost:
    'bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300',
  outline:
    'border-2 border-amber-400 dark:border-amber-500 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-400/10',
};

const sizeStyles = {
  sm: 'px-4 py-2 text-sm rounded-lg gap-1.5',
  md: 'px-6 py-3 text-base rounded-xl gap-2',
  lg: 'px-8 py-4 text-lg rounded-2xl gap-2.5',
};

const Button = forwardRef(
  (
    {
      variant = 'primary',
      size = 'md',
      icon: Icon,
      iconRight: IconRight,
      fullWidth = false,
      children,
      className = '',
      as: Component = 'button',
      ...rest
    },
    ref
  ) => {
    return (
      <Component
        ref={ref}
        className={`
          inline-flex items-center justify-center font-bold
          transition-all duration-200 ease-out
          hover:scale-[1.02] active:scale-[0.98]
          disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${fullWidth ? 'w-full' : ''}
          ${className}
        `}
        {...rest}
      >
        {Icon && <Icon className="w-5 h-5 shrink-0" />}
        {children}
        {IconRight && <IconRight className="w-5 h-5 shrink-0" />}
      </Component>
    );
  }
);

Button.displayName = 'Button';
export default Button;
