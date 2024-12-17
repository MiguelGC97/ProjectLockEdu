import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { fetchLockers } from '@/services/fetch';
import { Locker } from '@/types/types';

interface AppContextProps {
  lockers: Locker[];
  selectedLocker: Locker | null;
  setLockers: React.Dispatch<React.SetStateAction<Locker[]>>;
  setSelectedLocker: React.Dispatch<React.SetStateAction<Locker | null>>;
}

interface AppProviderProps {
  children: ReactNode;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [lockers, setLockers] = useState<Locker[]>([]);
  const [selectedLocker, setSelectedLocker] = useState<Locker | null>(null);

  useEffect(() => {
    const loadLockers = async () => {
      const data = await fetchLockers(); // Llama a la API para obtener los lockers
      setLockers(data || []); // Establece los lockers
    };
    loadLockers();
  }, []);

  return (
    <AppContext.Provider value={{ lockers, selectedLocker, setLockers, setSelectedLocker }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
