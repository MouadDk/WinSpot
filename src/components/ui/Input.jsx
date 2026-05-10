import { useState, forwardRef } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const Input = forwardRef(
  ({ label, error, type = 'text', icon: Icon, className = '', ...rest }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          {Icon && (
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
              <Icon className="w-5 h-5" />
            </div>
          )}
          <input
            ref={ref}
            type={inputType}
            className={`
              w-full rounded-xl border bg-white dark:bg-slate-800/50
              text-slate-800 dark:text-slate-100
              placeholder:text-slate-400 dark:placeholder:text-slate-500
              transition-all duration-200
              focus:outline-none focus:ring-2
              ${
                error
                  ? 'border-rose-400 dark:border-rose-500 focus:ring-rose-400/30 focus:border-rose-400'
                  : 'border-slate-200 dark:border-slate-600 focus:ring-purple-500/30 focus:border-purple-500 dark:focus:ring-purple-400/30 dark:focus:border-purple-400'
              }
              ${Icon ? 'pl-11' : 'pl-4'}
              ${isPassword ? 'pr-11' : 'pr-4'}
              py-3 text-sm
              ${className}
            `}
            {...rest}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          )}
        </div>
        {error && (
          <p className="mt-1.5 text-sm text-rose-500 dark:text-rose-400">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
