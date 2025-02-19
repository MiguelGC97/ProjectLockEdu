import React, { createContext, useContext, useMemo, useState } from 'react';
import { MantineProvider } from '@mantine/core';
import { getTheme } from '../theme';
import { useAuth } from './AuthProvider';

interface ThemeContextType {
  themeName: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme, updateTheme } = useAuth();

  const toggleTheme = () => {
    updateTheme((prev: 'light' | 'dark') => (prev === 'dark' ? 'light' : 'dark'));
  };

  const mantineTheme = useMemo(() => getTheme(theme), [theme]); // Get theme dynamically

  return (
    <ThemeContext.Provider value={{ themeName: theme, toggleTheme }}>
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
