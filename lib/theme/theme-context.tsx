'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'auto';
type ResolvedTheme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
  accentColor: string;
  setAccentColor: (color: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const ACCENT_COLORS = {
  blue: '#3b82f6',
  purple: '#a855f7',
  pink: '#ec4899',
  green: '#10b981',
  orange: '#f97316',
  red: '#ef4444',
  cyan: '#06b6d4',
  yellow: '#eab308',
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('dark');
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('dark');
  const [accentColor, setAccentColorState] = useState<string>(ACCENT_COLORS.blue);
  const [mounted, setMounted] = useState(false);

  // Initialize theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    const savedAccent = localStorage.getItem('accentColor');
    
    if (savedTheme) {
      setThemeState(savedTheme);
    }
    
    if (savedAccent) {
      setAccentColorState(savedAccent);
    }
    
    setMounted(true);
  }, []);

  // Handle theme resolution (auto mode)
  useEffect(() => {
    if (!mounted) return;

    const getResolvedTheme = (): ResolvedTheme => {
      if (theme === 'auto') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light';
      }
      return theme as ResolvedTheme;
    };

    const updateTheme = () => {
      const resolved = getResolvedTheme();
      setResolvedTheme(resolved);

      // Update document classes
      const root = document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(resolved);

      // Update meta theme-color
      const metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (metaThemeColor) {
        metaThemeColor.setAttribute(
          'content',
          resolved === 'dark' ? '#0a0a0a' : '#ffffff'
        );
      }
    };

    updateTheme();

    // Listen for system theme changes if in auto mode
    if (theme === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => updateTheme();
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme, mounted]);

  // Apply accent color as CSS variable
  useEffect(() => {
    if (!mounted) return;
    document.documentElement.style.setProperty('--accent-color', accentColor);
  }, [accentColor, mounted]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const setAccentColor = (color: string) => {
    setAccentColorState(color);
    localStorage.setItem('accentColor', color);
  };

  // Prevent flash of wrong theme
  if (!mounted) {
    return null;
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        resolvedTheme,
        setTheme,
        accentColor,
        setAccentColor,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export { ACCENT_COLORS };
