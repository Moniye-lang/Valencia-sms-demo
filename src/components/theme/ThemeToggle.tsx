'use client';

import React from 'react';
import { useTheme } from './ThemeProvider';
import { Moon, Sun, Monitor } from 'lucide-react';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md';
}

export function ThemeToggle({
  className = '',
  showLabel = false,
  size = 'md',
}: ThemeToggleProps) {
  const { resolvedTheme, toggleTheme, mounted } = useTheme();

  const isDark = mounted ? resolvedTheme === 'dark' : false;

  const sizeClasses =
    size === 'sm'
      ? 'p-1.5 text-xs gap-1.5 rounded-lg'
      : 'p-2 text-sm gap-2 rounded-xl';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`inline-flex items-center justify-center transition-colors border cursor-pointer ${isDark
        ? 'bg-slate-800 text-amber-300 border-slate-700 hover:bg-slate-700 hover:text-amber-200 shadow-xs'
        : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200 hover:text-slate-900 shadow-xs'
        } ${sizeClasses} ${className}`}
    >
      <div className="relative w-4 h-4 flex items-center justify-center">
        {mounted ? (
          isDark ? (
            <Sun className="w-4 h-4 transition-transform duration-200 rotate-0 scale-100 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 transition-transform duration-200 rotate-0 scale-100 text-slate-700" />
          )
        ) : (
          <span className="w-4 h-4 block rounded-full bg-slate-300 dark:bg-slate-700 animate-pulse" />
        )}
      </div>
      {showLabel && (
        <span className="font-semibold text-xs select-none">
          {mounted ? (isDark ? 'Light' : 'Dark') : 'Theme'}
        </span>
      )}
    </button>
  );
}

