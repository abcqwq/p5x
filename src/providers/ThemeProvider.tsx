'use client';
import React, { useContext } from 'react';
import Cookie from 'js-cookie';

import { LIGHT_COLORS, DARK_COLORS } from '@/consts/COLORS';

type Props = {
  initialTheme: string;
  children: React.ReactNode;
};

type ThemeContextType = {
  theme: string;
  toggleTheme: () => void;
};

export const ThemeContext = React.createContext({
  theme: 'dark',
  toggleTheme: () => {}
} as ThemeContextType);

export const useTheme = () => {
  return useContext(ThemeContext);
};

export const ThemeProvider = ({ initialTheme, children }: Props) => {
  const [theme, setTheme] = React.useState<string>(initialTheme);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);

    Cookie.set('color-theme', nextTheme, {
      expires: 1000
    });

    // HACK: we're interfering with element outside of react directly.
    // sadly, there's nothing we can do, it is what it is
    const root = document.documentElement;
    const colors = nextTheme === 'light' ? LIGHT_COLORS : DARK_COLORS;
    root.setAttribute('data-color-theme', nextTheme);

    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  };

  return <ThemeContext value={{ theme, toggleTheme }}>{children}</ThemeContext>;
};
