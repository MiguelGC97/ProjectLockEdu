import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { MantineProvider } from '@mantine/core';
import { getTheme } from '../theme';

interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Retrieve theme from localStorage or default to 'dark'
  const storedTheme = (localStorage.getItem('theme') as 'light' | 'dark') || 'dark';
  const [theme, setTheme] = useState<'light' | 'dark'>(storedTheme);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  const mantineTheme = useMemo(() => getTheme(theme), [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <MantineProvider theme={mantineTheme}>{children}</MantineProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
