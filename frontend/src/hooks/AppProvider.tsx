import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { MantineProvider } from '@mantine/core';
import { fetchBoxesByLocker, fetchItemsByBox, fetchLockers } from '@/services/fetch';
import { dark, light } from '@/theme';
import { BoxType, Item, Locker } from '@/types/types';

interface ThemeContextProps {
  toggleTheme: () => void;
  currentTheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

interface AppContextProps {
  lockers: Locker[];
  selectedLocker: Locker | null;
  setLockers: React.Dispatch<React.SetStateAction<Locker[]>>;
  setSelectedLocker: React.Dispatch<React.SetStateAction<Locker | null>>;
  boxes: BoxType[];
  selectedBox: BoxType | null;
  setBoxes: React.Dispatch<React.SetStateAction<BoxType[]>>;
  setSelectedBox: React.Dispatch<React.SetStateAction<BoxType | null>>;
  objects: Item[];
  selectedObjects: Item[] | null;
  setObjects: React.Dispatch<React.SetStateAction<Item[]>>;
  setSelectedObjects: React.Dispatch<React.SetStateAction<Item[] | null>>;
  currentTheme: string;
  setCurrentTheme: React.Dispatch<React.SetStateAction<string>>;
}

interface AppProviderProps {
  children: ReactNode;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [lockers, setLockers] = useState<Locker[]>([]);
  const [selectedLocker, setSelectedLocker] = useState<Locker | null>(null);
  const [boxes, setBoxes] = useState<BoxType[]>([]);
  const [selectedBox, setSelectedBox] = useState<BoxType | null>(null);
  const [objects, setObjects] = useState<Item[]>([]);
  const [selectedObjects, setSelectedObjects] = useState<Item[] | null>(null);

  useEffect(() => {
    const loadLockers = async () => {
      const data = await fetchLockers();
      setLockers(data || []);
    };
    loadLockers();
  }, []);

  useEffect(() => {
    const loadBoxes = async () => {
      const data = await fetchBoxesByLocker(selectedLocker?.id);
      setBoxes(data || []);
    };
    loadBoxes();
  }, [selectedLocker]);

  useEffect(() => {
    const loadObjects = async () => {
      const data = await fetchItemsByBox(selectedBox?.id);
      setObjects(data || []);
    };
    loadObjects();
  }, [selectedBox]);

  return (
    <AppContext.Provider
      value={{
        lockers,
        selectedLocker,
        setLockers,
        setSelectedLocker,
        boxes,
        selectedBox,
        setBoxes,
        setSelectedBox,
        objects,
        selectedObjects,
        setObjects,
        setSelectedObjects,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// ThemeProvider component
export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('dark');

  const toggleTheme = () => {
    setCurrentTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ toggleTheme, currentTheme }}>
      <MantineProvider theme={currentTheme === 'light' ? light : dark}>{children}</MantineProvider>
    </ThemeContext.Provider>
  );
};

export const useThemeContext = (): ThemeContextProps => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
