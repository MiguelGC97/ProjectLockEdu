import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { MantineProvider } from '@mantine/core';
import { getTheme } from '../theme';

interface ThemeContextType {
  theme: 'light' | 'dark'; // Keep the 'theme' key here
  toggleTheme: () => void; // No need to pass the theme as a parameter
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Retrieve theme from localStorage or default to 'dark'
  const storedTheme = (localStorage.getItem('theme') as 'light' | 'dark') || 'dark';
  const [theme, setTheme] = useState<'light' | 'dark'>(storedTheme);

  // Function to toggle between light and dark themes
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };

  // Persist the theme in localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Memoize the Mantine theme to optimize performance
  const mantineTheme = useMemo(() => getTheme(theme), [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {' '}
      {/* Change themeName to theme */}
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
