'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../providers/ThemeProvider';

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      aria-label="Toggle dark mode"
      className="grid h-9 w-9 place-items-center rounded-[9px] border border-line bg-surface transition-colors duration-300 hover:border-brand hover:text-brand"
    >
      {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
