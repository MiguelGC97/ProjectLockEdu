import { useEffect, useState } from 'react';

function useLocalStorage<T>(key: string, initialValue: T | null) {
  const getStoredValue = () => {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : initialValue;
  };

  const [storedValueState, setStoredValue] = useState<T | null>(getStoredValue);

  useEffect(() => {
    const handleStorageChange = () => {
      setStoredValue(getStoredValue());
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const setValue = (value: T | null) => {
    setStoredValue(value);
    if (value === null) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, JSON.stringify(value));
    }
  };

  return [storedValueState, setValue] as const;
}

export default useLocalStorage;
