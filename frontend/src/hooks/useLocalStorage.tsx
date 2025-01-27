import { useState } from 'react';

function useLocalStorage<T>(key: string, initialValue: T | null) {
  // Get from localStorage or use initial value
  const storedValue = localStorage.getItem(key);
  const parsedValue = storedValue ? JSON.parse(storedValue) : initialValue;

  // State to store the value in memory
  const [storedValueState, setStoredValue] = useState<T | null>(parsedValue);

  // Set value to both state and localStorage
  const setValue = (value: T | null) => {
    setStoredValue(value);

    // If value is null, remove the key from localStorage
    if (value === null) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, JSON.stringify(value));
    }
  };

  return [storedValueState, setValue] as const;
}

export default useLocalStorage;
