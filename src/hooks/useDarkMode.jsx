import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const DarkModeContext = createContext(null);

function getInitialDarkMode() {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('pub2win-dark-mode');
    if (stored !== null) return stored === 'true';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  return false;
}

export function DarkModeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => getInitialDarkMode());

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('pub2win-dark-mode', isDark);
  }, [isDark]);

  const toggle = () => setIsDark((prev) => !prev);
  const value = useMemo(() => ({ isDark, toggle }), [isDark]);

  return (
    <DarkModeContext.Provider value={value}>
      {children}
    </DarkModeContext.Provider>
  );
}

export function useDarkMode() {
  const context = useContext(DarkModeContext);
  if (!context) {
    throw new Error('useDarkMode must be used within a DarkModeProvider');
  }
  return context;
}
