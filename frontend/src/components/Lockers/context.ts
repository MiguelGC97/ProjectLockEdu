import * as React from 'react';
import { Locker } from '@/types/types';

export const LockersContext = React.createContext<Locker[] | undefined>(undefined);

export function useLockersContext() {
  const lockers = React.useContext(LockersContext);

  if (lockers === undefined) {
    throw new Error('useLockersContext must be used with a lockersContext');
  }

  return lockers;
}
