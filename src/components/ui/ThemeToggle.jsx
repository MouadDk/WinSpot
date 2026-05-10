import { Sun, Moon } from 'lucide-react';
import { useDarkMode } from '../../hooks/useDarkMode.jsx';

export default function ThemeToggle() {
  const { isDark, toggle } = useDarkMode();

  return (
    <button
      onClick={toggle}
      aria-label="Toggle dark mode"
      className="
        fixed bottom-6 right-6 z-50
        w-14 h-14 rounded-[1.25rem]
        flex items-center justify-center
        bg-[rgba(15,15,25,0.92)] dark:bg-[rgba(16,16,24,0.95)]
        border border-[rgba(123,47,255,0.18)]
        shadow-[0_25px_80px_rgba(123,47,255,0.12)]
        hover:-translate-y-1 active:translate-y-0.5
        transition-all duration-300
        text-[var(--brand-highlight)]
        hover:text-[var(--brand-gold)]
        backdrop-blur-xl
      "
    >
      {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  );
}
