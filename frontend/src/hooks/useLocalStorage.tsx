import { useState } from 'react';

function useLocalStorage<T>(key: string, initialValue: T | null) {
  const storedValue = localStorage.getItem(key);
  const parsedValue = storedValue ? JSON.parse(storedValue) : initialValue;

  const [storedValueState, setStoredValue] = useState<T | null>(parsedValue);

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
