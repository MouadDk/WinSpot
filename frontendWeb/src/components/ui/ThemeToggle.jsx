import { Sun, Moon } from 'lucide-react';
import { useDarkMode } from '../../hooks/useDarkMode';

export default function ThemeToggle() {
  const { isDark, toggle } = useDarkMode();

  return (
    <button
      onClick={toggle}
      aria-label="Toggle dark mode"
      className="
        fixed bottom-6 right-6 z-50
        w-12 h-12 rounded-2xl
        flex items-center justify-center
        bg-white dark:bg-slate-800
        border border-slate-200 dark:border-slate-700
        shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50
        hover:scale-110 active:scale-95
        transition-all duration-200
        text-slate-600 dark:text-slate-300
        hover:text-purple-600 dark:hover:text-purple-400
      "
    >
      {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  );
}
