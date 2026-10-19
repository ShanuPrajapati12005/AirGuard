import { useState, useEffect } from 'react';

export function useTheme() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window === 'undefined') return 'dark';
    try {
      const isDefaultSet = localStorage.getItem('airguard-dark-default-initialized');
      if (!isDefaultSet) {
        localStorage.setItem('airguard-dark-default-initialized', 'true');
        localStorage.setItem('airguard-theme', 'dark');
        return 'dark';
      }
      return (localStorage.getItem('airguard-theme') as 'light' | 'dark') || 'dark';
    } catch {
      return 'dark';
    }
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('airguard-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));

  return { theme, toggleTheme, setTheme };
}
